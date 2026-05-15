export function getUnitImageUrl(name, width = 400, height = 300) {
  const seed = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

export function getUnitGalleryUrls(name, count = 4) {
  const seed = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return Array.from({ length: count }, (_, i) =>
    `https://picsum.photos/seed/${seed}-gallery-${i + 1}/800/600`
  );
}

export function getPlaceholderImage(width = 400, height = 300) {
  return `https://picsum.photos/${width}/${height}`;
}

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
