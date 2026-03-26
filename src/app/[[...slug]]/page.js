import RootApp from '@/RootApp';

const FALLBACK_IMAGE = '/previewImgae.jpg';
const DEFAULT_TITLE = 'Pakistan Property';
const DEFAULT_DESCRIPTION =
  'Find top properties across Pakistan. Browse verified homes, plots, and commercial listings and connect with trusted agents to make confident choices today.';

function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.URL ||
    'https://pakistan-property-next.netlify.app';
  return raw.startsWith('http') ? raw : `https://${raw}`;
}

function toAbsoluteUrl(pathOrUrl, siteUrl) {
  if (!pathOrUrl) return `${siteUrl}${FALLBACK_IMAGE}`;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const normalized = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${siteUrl}${normalized}`;
}

async function getProperty(slug) {
  try {
    const response = await fetch(`https://admin.pakistanproperty.com/api/properties/${slug}`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json?.data?.property || null;
  } catch {
    return null;
  }
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const siteUrl = getSiteUrl();
  const segments = params?.slug || [];
  const [first, second] = segments;

  // Server-side OG for property detail shares.
  if (first === 'property-detail' && second) {
    const property = await getProperty(second);
    const title = property?.title ? `${property.title} - Pakistan Property` : DEFAULT_TITLE;
    const description = property?.description || DEFAULT_DESCRIPTION;
    const imageCandidate = Array.isArray(property?.property_images) ? property.property_images[0] : null;
    const imagePath =
      typeof imageCandidate === 'string' ? imageCandidate : imageCandidate?.image || imageCandidate?.url;
    const image = toAbsoluteUrl(imagePath || FALLBACK_IMAGE, siteUrl);
    const url = `${siteUrl}/property-detail/${second}`;

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

  const path = segments.length ? `/${segments.join('/')}` : '/';
  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    openGraph: {
      type: 'website',
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      url: `${siteUrl}${path}`,
      siteName: 'Pakistan Property',
      images: [{ url: `${siteUrl}${FALLBACK_IMAGE}`, width: 1200, height: 630 }],
      locale: 'en_US',
    },
  };
}

export default function CatchAllPage() {
  return <RootApp />;
}
