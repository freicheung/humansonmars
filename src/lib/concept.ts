import type { ImageMetadata } from 'astro';

// Concept images dropped into src/assets/concept/ are picked up by base name; missing ones fall back to drawn scenes.
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/concept/*.{webp,jpg,jpeg,png}', { eager: true });

export function concept(name: string): ImageMetadata | undefined {
  const key = Object.keys(files).find((k) => k.split('/').pop()!.replace(/\.\w+$/, '') === name);
  return key ? files[key].default : undefined;
}
