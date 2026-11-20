// Netlify event function: runs automatically after every successful deploy.
// Submits every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver, and through
// Bing also ChatGPT Search / Copilot), so new and updated pages get recrawled within minutes.
//
// - ES module (package.json has "type": "module"), Lambda-compatible `handler` export.
// - Production deploys only (deploy previews and branch deploys are skipped).
// - Never throws and always answers 200: a failed ping must never look like a failed deploy.
// - The key file lives at public/<KEY>.txt (served as text/plain + X-Robots-Tag: noindex,
//   see netlify.toml). Changing the key means renaming that file too.
//
// Security:
// - Netlify signs platform events (JWS) and only invokes event functions for verified events,
//   so outside callers cannot trigger it; the context check below is defence in depth.
// - No SSRF: the only hosts ever fetched are the hard-coded ORIGIN and the IndexNow endpoint
//   (nothing from the request body is used as a URL), redirects are refused, and every
//   request has a timeout. Submitted URLs must parse and belong to ORIGIN.
// - The IndexNow key is public by design (served at /<KEY>.txt). Nothing secret is logged;
//   errors are logged by name/message only and the response body never echoes them.
const HOST = 'nz-web.com';
const KEY = 'b4de74f617e50be05dfea2e84c50902a';
const ORIGIN = 'https://' + HOST;
const TIMEOUT_MS = 8000;
const MAX_SITEMAP_BYTES = 5 * 1024 * 1024;
const MAX_URLS = 10000; // IndexNow limit per request

/** Reads the deploy context from the event body; anything malformed → null. */
function deployContext(event) {
  const raw = event && typeof event.body === 'string' ? event.body : '';
  if (!raw || raw.length > 1024 * 1024) return null;
  try {
    const body = JSON.parse(raw);
    const context = body && typeof body === 'object' && body.payload && body.payload.context;
    return typeof context === 'string' ? context.slice(0, 40) : null;
  } catch {
    return null;
  }
}

/** Only absolute https URLs on ORIGIN (no credentials, no other host / port). */
function ownUrl(value) {
  try {
    const u = new URL(value);
    if (u.origin !== ORIGIN || u.username || u.password) return null;
    return u.href;
  } catch {
    return null;
  }
}

export const handler = async (event) => {
  try {
    const context = deployContext(event);
    // Netlify always sends payload.context ("production", "deploy-preview", "branch-deploy").
    // Anything else (a local run, a malformed body) is skipped rather than pinging the live index.
    if (context !== 'production') {
      console.log('IndexNow: skipped (' + (context ? JSON.stringify(context) : 'no context') + ')');
      return { statusCode: 200, body: 'skipped' };
    }

    const res = await fetch(ORIGIN + '/sitemap.xml', {
      headers: { 'cache-control': 'no-cache' },
      redirect: 'error',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.log('IndexNow: sitemap fetch returned ' + res.status + ', nothing submitted');
      return { statusCode: 200, body: 'sitemap ' + res.status };
    }
    const xml = await res.text();
    if (xml.length > MAX_SITEMAP_BYTES) {
      console.log('IndexNow: sitemap larger than expected, nothing submitted');
      return { statusCode: 200, body: 'sitemap too large' };
    }
    const urlList = [...new Set(
      [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)]
        .map((m) => ownUrl(m[1].replace(/&amp;/g, '&')))
        .filter(Boolean),
    )].slice(0, MAX_URLS);

    if (urlList.length === 0) {
      console.log('IndexNow: 0 urls in sitemap, nothing submitted');
      return { statusCode: 200, body: 'no urls' };
    }

    const ping = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: ORIGIN + '/' + KEY + '.txt',
        urlList,
      }),
      redirect: 'error',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    console.log('IndexNow: ' + ping.status + ' for ' + urlList.length + ' urls');
    return { statusCode: 200, body: 'IndexNow ' + ping.status + ' for ' + urlList.length + ' urls' };
  } catch (err) {
    const name = err && err.name ? err.name : 'Error';
    const message = err && err.message ? String(err.message).slice(0, 200) : String(err).slice(0, 200);
    console.error('IndexNow failed: ' + name + ': ' + message);
    return { statusCode: 200, body: 'IndexNow error' };
  }
};
