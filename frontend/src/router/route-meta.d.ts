import 'vue-router';

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalPath?: string;
  robots?: string;
  image?: string;
  lang?: 'th' | 'en';
}

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    guestOnly?: boolean;
    title?: string;
    seo?: SeoMetadata;
  }
}
