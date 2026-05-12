export type HomeSectionType = 'hero' | 'image' | 'multi-image' | 'dynamic';

export interface BaseHomeSectionConfig {
  id: string;
  type: HomeSectionType;
  title: string;
  showTitle?: boolean;
}

export interface DynamicSectionConfig extends BaseHomeSectionConfig {
  type: 'dynamic';
  category: string;
  limit?: number;
  isSwiper?: boolean;
  hasBackground?: boolean;
}

export interface ImageSectionConfig extends BaseHomeSectionConfig {
  type: 'image';
  imageUrl: string;      // Legacy, single image
  imageUrls?: string[];  // Support for multiple images
  targetUrl?: string;
  targetTag?: string;
}

export interface MultiImageItem {
  imageUrl: string;
  targetUrl?: string;
  targetTag?: string;
}

export interface MultiImageSectionConfig extends BaseHomeSectionConfig {
  type: 'multi-image';
  images: MultiImageItem[];
}

export interface HeroSectionConfig extends BaseHomeSectionConfig {
  type: 'hero';
  subtitle: string;
  buttonText: string;
  imageUrl: string;
  targetUrl?: string;
}

export type HomeSectionConfig = DynamicSectionConfig | ImageSectionConfig | MultiImageSectionConfig | HeroSectionConfig;

export interface HomeConfig {
  sections: HomeSectionConfig[];
}

export interface Category {
  id: string;
  name: string;
  tag?: string;
  enabled: boolean;
  order: number;
}

export interface ContactConfig {
  whatsapp: { number: string; enabled: boolean };
  facebook: { url: string; enabled: boolean };
}
