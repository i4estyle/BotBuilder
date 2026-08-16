import heroImageDefault from '@/assets/landing/intro.png';
import starterImageDefault from '@/assets/landing/playlearn.png';
import explorerImageDefault from '@/assets/landing/roboticcamp.png';
import masterImageDefault from '@/assets/landing/precompete.png';
import certificateDefault from '@/assets/landing/cretificate.jpg';
import promotionsPhotoDefault from '@/assets/landing/promotions.png';
import happyPlayTimePhotoDefault from '@/assets/landing/happyplaytime.png';
import exploringSpacePhotoDefault from '@/assets/landing/exploringspace.png';
import takeawayMicrobitPhotoDefault from '@/assets/landing/takeaway.png';
import takeawayPythonPhotoDefault from '@/assets/landing/takegreen.png';
import logoDefault from '@/assets/landing/logo.png';
import heroJpegDefault from '@/assets/landing/hero.jpeg';
import mapJpegDefault from '@/assets/landing/map.jpeg';
import inside1JpgDefault from '@/assets/landing/inside1.jpg';

const ASSET_MAP: Record<string, string> = {
  '/src/assets/landing/intro.png': heroImageDefault,
  '/src/assets/landing/playlearn.png': starterImageDefault,
  '/src/assets/landing/roboticcamp.png': explorerImageDefault,
  '/src/assets/landing/precompete.png': masterImageDefault,
  '/src/assets/landing/cretificate.jpg': certificateDefault,
  '/src/assets/landing/promotions.png': promotionsPhotoDefault,
  '/src/assets/landing/happyplaytime.png': happyPlayTimePhotoDefault,
  '/src/assets/landing/exploringspace.png': exploringSpacePhotoDefault,
  '/src/assets/landing/takeaway.png': takeawayMicrobitPhotoDefault,
  '/src/assets/landing/takegreen.png': takeawayPythonPhotoDefault,
  '/src/assets/landing/logo.png': logoDefault,
  '/src/assets/landing/hero.jpeg': heroJpegDefault,
  '/src/assets/landing/map.jpeg': mapJpegDefault,
  '/src/assets/landing/inside1.jpg': inside1JpgDefault,
  'intro.png': heroImageDefault,
  'playlearn.png': starterImageDefault,
  'roboticcamp.png': explorerImageDefault,
  'precompete.png': masterImageDefault,
  'cretificate.jpg': certificateDefault,
  'promotions.png': promotionsPhotoDefault,
  'happyplaytime.png': happyPlayTimePhotoDefault,
  'exploringspace.png': exploringSpacePhotoDefault,
  'takeaway.png': takeawayMicrobitPhotoDefault,
  'takegreen.png': takeawayPythonPhotoDefault,
  'logo.png': logoDefault,
  'hero.jpeg': heroJpegDefault,
  'map.jpeg': mapJpegDefault,
  'inside1.jpg': inside1JpgDefault,
};

export function resolveAssetUrl(src: string | undefined | null): string {
  if (!src) return '';
  if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  const cleanPath = src.replace(/^\/+/, '/');
  if (ASSET_MAP[cleanPath]) {
    return ASSET_MAP[cleanPath];
  }
  for (const [key, value] of Object.entries(ASSET_MAP)) {
    if (cleanPath.endsWith(key) || key.endsWith(cleanPath)) {
      return value;
    }
  }
  if (cleanPath.startsWith('/uploads/')) {
    const backendUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';
    return `${backendUrl}${cleanPath}`;
  }
  return src;
}
