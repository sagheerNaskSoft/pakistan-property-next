import RootApp from '@/RootApp';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  buildPropertyOpenGraphMetadata,
  fetchPropertyPageData,
  getSiteUrl,
  toAbsoluteUrl,
} from '@/lib/propertyDetailServer';

const FALLBACK_IMAGE = '/previewImgae.jpg';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resolved = params && typeof params.then === 'function' ? await params : params;
  const slug = resolved?.slug;
  if (!slug) {
    const siteUrl = getSiteUrl();
    const defaultImage = toAbsoluteUrl(FALLBACK_IMAGE, siteUrl);
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      openGraph: {
        type: 'website',
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        url: siteUrl,
        siteName: 'Pakistan Property',
        images: [{ url: defaultImage, width: 1200, height: 630 }],
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        images: [defaultImage],
      },
    };
  }

  const pageData = await fetchPropertyPageData(slug);
  const property = pageData?.property ?? null;
  if (!property) {
    const siteUrl = getSiteUrl();
    const defaultImage = toAbsoluteUrl(FALLBACK_IMAGE, siteUrl);
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      openGraph: {
        type: 'website',
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        url: toAbsoluteUrl(`/property-detail/${slug}`, siteUrl),
        siteName: 'Pakistan Property',
        images: [{ url: defaultImage, width: 1200, height: 630 }],
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        images: [defaultImage],
      },
    };
  }

  return buildPropertyOpenGraphMetadata(property, slug);
}

export default async function PropertyDetailPage({ params }) {
  const resolved = params && typeof params.then === 'function' ? await params : params;
  const slug = resolved?.slug;
  const initialPropertyData = slug ? await fetchPropertyPageData(slug) : null;

  return (
    <RootApp
      ssrPropertyDetail={{
        slug,
        initialPropertyData,
      }}
    />
  );
}
