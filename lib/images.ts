export function getUnitImageUrl(
  name: string,
  width = 400,
  height = 300
): string {
  const seed = slugify(name);
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

export function getUnitGalleryUrls(name: string, count = 4): string[] {
  const seed = slugify(name);
  return Array.from(
    { length: count },
    (_, i) => `https://picsum.photos/seed/${seed}-gallery-${i + 1}/800/600`
  );
}

export function getPlaceholderImage(width = 400, height = 300): string {
  return `https://picsum.photos/${width}/${height}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
