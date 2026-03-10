export interface ClientLogo {
  id: string;
  name: string;
  image: string;
}

const LS_KEY = "nz-web-logos";

function getFromLS(): ClientLogo[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToLS(logos: ClientLogo[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(logos));
}

export function fetchLogos(): ClientLogo[] {
  return getFromLS();
}

export function addLogo(logo: Omit<ClientLogo, "id">): ClientLogo {
  const newLogo: ClientLogo = { ...logo, id: crypto.randomUUID() };
  const logos = getFromLS();
  logos.push(newLogo);
  saveToLS(logos);
  return newLogo;
}

export function deleteLogo(id: string): void {
  const logos = getFromLS().filter((l) => l.id !== id);
  saveToLS(logos);
}

export function deleteAllLogos(): void {
  saveToLS([]);
}

export function seedDemoLogos(): ClientLogo[] {
  const demos: Omit<ClientLogo, "id">[] = [
    { name: "Google", image: "https://logo.clearbit.com/google.com" },
    { name: "Microsoft", image: "https://logo.clearbit.com/microsoft.com" },
    { name: "Apple", image: "https://logo.clearbit.com/apple.com" },
    { name: "Amazon", image: "https://logo.clearbit.com/amazon.com" },
    { name: "Meta", image: "https://logo.clearbit.com/meta.com" },
    { name: "Netflix", image: "https://logo.clearbit.com/netflix.com" },
    { name: "Spotify", image: "https://logo.clearbit.com/spotify.com" },
    { name: "Adobe", image: "https://logo.clearbit.com/adobe.com" },
    { name: "Stripe", image: "https://logo.clearbit.com/stripe.com" },
    { name: "Shopify", image: "https://logo.clearbit.com/shopify.com" },
  ];
  const newLogos = demos.map((d) => ({ ...d, id: crypto.randomUUID() }));
  const existing = getFromLS();
  const all = [...existing, ...newLogos];
  saveToLS(all);
  return all;
}
