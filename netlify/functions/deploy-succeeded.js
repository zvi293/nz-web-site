// Netlify event function: runs automatically after every successful deploy.
// Submits every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver, and through
// Bing also ChatGPT Search / Copilot), so new and updated pages get recrawled within minutes.
//
// - ES module (package.json has "type": "module"), Lambda-compatible `handler` export.
// - Production deploys only (deploy previews and branch deploys are skipped).
// - Never throws and always answers 200: a failed ping must never look like a failed deploy.
// - The key file lives at public/<KEY>.txt (served as text/plain + X-Robots-Tag: noindex,
//   see netlify.toml). Changing the key means renaming that file too.
const HOST = 'nz-web.com';
const KEY = 'b4de74f617e50be05dfea2e84c50902a';
const ORIGIN = 'https://' + HOST;

export const handler = async (event) => {
  try {
    let body = {};
    try {
      body = JSON.parse((event && event.body) || '{}');
    } catch {
      body = {};
    }
    const context = body.payload && body.payload.context;
    // Netlify always sends payload.context ("production", "deploy-preview", "branch-deploy").
    // Anything else (a local run, a malformed body) is skipped rather than pinging the live index.
    if (context !== 'production') {
      console.log('IndexNow: skipped (' + (context || 'no context') + ')');
      return { statusCode: 200, body: 'skipped: ' + (context || 'no context') };
    }

    const res = await fetch(ORIGIN + '/sitemap.xml', { headers: { 'cache-control': 'no-cache' } });
    if (!res.ok) {
      console.log('IndexNow: sitemap fetch returned ' + res.status + ', nothing submitted');
      return { statusCode: 200, body: 'sitemap ' + res.status };
    }
    const xml = await res.text();
    const urlList = [...new Set(
      [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)]
        .map((m) => m[1].trim())
        .filter((u) => u.startsWith(ORIGIN + '/')),
    )].slice(0, 10000);

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
    });
    console.log('IndexNow: ' + ping.status + ' for ' + urlList.length + ' urls');
    return { statusCode: 200, body: 'IndexNow ' + ping.status + ' for ' + urlList.length + ' urls' };
  } catch (err) {
    console.error('IndexNow failed:', err && err.message ? err.message : err);
    return { statusCode: 200, body: 'IndexNow error: ' + (err && err.message ? err.message : String(err)) };
  }
};
