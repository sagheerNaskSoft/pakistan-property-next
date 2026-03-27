const FALLBACK_IMAGE = '/previewImgae.jpg';
export const DEFAULT_TITLE = 'Pakistan Property';
export const DEFAULT_DESCRIPTION =
  'Find top properties across Pakistan. Browse verified homes, plots, and commercial listings and connect with trusted agents to make confident choices today.';

const PROPERTY_API_BASE = 'https://admin.pakistanproperty.com/api/properties/';

export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.URL ||
    'https://pakistanproperty.com';
  return raw.startsWith('http') ? raw : `https://${raw}`;
}

export function toAbsoluteUrl(pathOrUrl, siteUrl) {
  const fallback = `${siteUrl}${FALLBACK_IMAGE}`;
  if (!pathOrUrl) return fallback;

  try {
    const sanitized = encodeURI(String(pathOrUrl).trim());
    if (/^https?:\/\//i.test(sanitized)) {
      return new URL(sanitized).toString();
    }
    const normalized = sanitized.startsWith('/') ? sanitized : `/${sanitized}`;
    return new URL(normalized, siteUrl).toString();
  } catch {
    return fallback;
  }
}

export async function fetchPropertyPageData(slug) {
  if (!slug) return null;
  try {
    const response = await fetch(`${PROPERTY_API_BASE}${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const json = await response.json();
    // Match ContextProvider: typeResult?.data?.data (Laravel may nest twice)
    return json?.data?.data ?? json?.data ?? null;
  } catch {
    return null;
  }
}

export function cleanDescription(text) {
  if (!text) return DEFAULT_DESCRIPTION;
  return String(text)
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isChatFriendlyImage(url) {
  return /\.(jpe?g|png)(\?.*)?$/i.test(url || '');
}

export function buildPropertyOpenGraphMetadata(property, slug) {
  const siteUrl = getSiteUrl();
  const title = property?.title ? `${property.title} - Pakistan Property` : DEFAULT_TITLE;
  const description = cleanDescription(property?.description);
  const imageCandidate = Array.isArray(property?.property_images) ? property.property_images[0] : null;
  const imagePath =
    typeof imageCandidate === 'string' ? imageCandidate : imageCandidate?.image || imageCandidate?.url;
  const candidateImage = toAbsoluteUrl(imagePath || FALLBACK_IMAGE, siteUrl);
  const image = isChatFriendlyImage(candidateImage)
    ? candidateImage
    : toAbsoluteUrl(FALLBACK_IMAGE, siteUrl);
  const url = toAbsoluteUrl(`/property-detail/${slug}`, siteUrl);

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      siteName: 'Pakistan Property',
      images: [{ url: image, width: 1200, height: 630 }],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
