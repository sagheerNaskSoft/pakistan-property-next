/**
 * Pre-filled inquiry text for property WhatsApp links (detail page + listing cards).
 */
export function buildPropertyWhatsappMessage({
  userName,
  propertyTitle,
  city,
  propertyUrl,
}) {
  const name = (userName && String(userName).trim()) || 'there';
  const title = (propertyTitle && String(propertyTitle).trim()) || '—';
  const loc = (city && String(city).trim()) || '—';
  const link = (propertyUrl && String(propertyUrl).trim()) || '';

  return `Hello ${name},

I found your property listing on Pakistan Property and I'm interested in it.

Property Title: ${title}
Location: ${loc}
Link: ${link}

Please share more details. Thank you!`;
}

const PUBLIC_SITE_ORIGIN = 'https://pakistanproperty.com';

export function getPropertyDetailUrl(slug) {
  if (typeof window === 'undefined') {
    return slug ? `${PUBLIC_SITE_ORIGIN}/property-detail/${slug}` : PUBLIC_SITE_ORIGIN;
  }
  const base = window.location.origin;
  return slug ? `${base}/property-detail/${slug}` : base;
}

/** Listing card APIs may expose contact, contacts[], or user phone. */
export function getPropertyCardPhoneDigits(data) {
  const raw =
    data?.contact?.[0] ??
    data?.contacts?.[0] ??
    data?.user?.phone_number ??
    data?.whatsapp;
  return raw ? String(raw).replace(/\D/g, '') : '';
}

export function formatPropertyLocationLine(data) {
  const city =
    typeof data?.city === 'object'
      ? data?.city?.city || data?.city?.name || ''
      : data?.city || '';
  const parts = [data?.location?.name, city].filter(Boolean);
  return parts.join(', ');
}
