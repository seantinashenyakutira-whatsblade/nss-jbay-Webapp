const UNIT_IMAGES: Record<string, string> = {
  'extra-small': 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop',
  'small': 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=300&fit=crop',
  'medium': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  'large': 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop',
};

const FACILITY_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop';
const MAP_IMAGE = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop';

export function getUnitImageUrl(
  unit: { size: string; name?: string },
  width = 400,
  height = 300
): string {
  const baseUrl = UNIT_IMAGES[unit.size] || UNIT_IMAGES['small'];
  return baseUrl.replace(/w=\d+&h=\d+/, `w=${width}&h=${height}`);
}

export function getUnitGalleryUrls(name: string, count = 4): string[] {
  const seed = slugify(name);
  return Array.from(
    { length: count },
    (_, i) => `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&sig=${i}`
  );
}

export function getFacilityImageUrl(): string {
  return FACILITY_IMAGE;
}

export function getMapImageUrl(): string {
  return MAP_IMAGE;
}

export function getPlaceholderImage(width = 400, height = 300): string {
  return `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=${width}&h=${height}&fit=crop`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
