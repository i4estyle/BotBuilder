export interface HeaderState {
  logo: string;
  nav: {
    home: string;
    promotions: string;
    courses: string;
    resources: string;
    about: string;
  };
}

export interface HeroState {
  image: string;
  imageAlt: string;
  titleHighlight: string;
  titleRest: string;
  paragraph: string;
  skills: string[];
  bookingNote: string;
  ctaLabel: string;
  ctaBangsaen: string;
  ctaSriracha: string;
}

export interface BenefitItem {
  icon: string;
  title: string;
  text: string;
}

export interface BenefitsState {
  heading: string;
  items: BenefitItem[];
}

export interface ActivityFormatItem {
  image: string;
  title: string;
  description: string;
}

export interface ActivityFormatsState {
  heading: string;
  items: ActivityFormatItem[];
}

export interface GalleryState {
  heading: string;
  paragraph: string;
  courseCertified: string;
  skillBadges: string;
  imageAlt: string;
  certificateImage: string;
}

export interface ActivityPhotoItem {
  src: string;
  alt: string;
}

export interface ActivityGroupItem {
  title: string;
  photos: ActivityPhotoItem[];
}

export interface ActivityGalleryState {
  heading: string;
  groups: ActivityGroupItem[];
}

export interface QuizQuestionItem {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface QuizState {
  heading: string;
  paragraph: string;
  cta: string;
  questions: QuizQuestionItem[];
}

export interface BranchHourItem {
  days: string;
  time: string;
}

export interface BranchItem {
  name: string;
  address: string;
  description: string;
  hours: BranchHourItem[];
  phone: string;
  contactName: string;
  mapEmbedUrl: string;
}

export interface BranchesState {
  heading: string;
  items: BranchItem[];
}

export interface CtaState {
  heading: string;
  paragraph: string;
  button: string;
}

export interface FooterState {
  brandTitle: string;
  brandText: string;
  quickLinks: string;
  courses: string;
  aboutUs: string;
  resources: string;
  support: string;
  promotion: string;
  copyright: string;
}

export interface PromotionItemState {
  label: string;
  title: string;
  description: string[];
  details?: string[];
  price?: string;
  note?: string;
  likeText?: string;
  likeLabel?: string;
  likeUrl?: string;
  image: string;
}

export interface PromotionsPageState {
  eyebrow: string;
  title: string;
  subtitle: string;
  listHeading: string;
  items: PromotionItemState[];
  cta: {
    eyebrow: string;
    heading: string;
    button: string;
  };
}

export interface CourseItemState {
  badge: string;
  title: string;
  description: string[];
  image: string;
}

export interface CoursesPageState {
  eyebrow: string;
  title: string;
  paragraph: string;
  buttonText: string;
  items: CourseItemState[];
}

export interface ResourceItemState {
  icon: string;
  title: string;
  text: string;
}

export interface ResourcesPageState {
  eyebrow: string;
  title: string;
  paragraph: string;
  items: ResourceItemState[];
}

export interface AboutPageState {
  eyebrow: string;
  title: string;
  intro: string;
  missionHeading: string;
  missionText: string;
  image: string;
  imageAlt: string;
}

export interface CustomBlock {
  id: string;
  type: 'text' | 'image';
  title: string;
  content?: string;
  image?: string;
}

export interface CustomBlockItem {
  id: string;
  type: 'text' | 'image';
  title: string;
  content?: string;
  image?: string;
}

export interface SectionBlockItem {
  id: string;
  sectionId: string;
  type: 'text' | 'image' | 'icon' | 'shape';
  title?: string;
  content?: string;
  image?: string;
  iconName?: string;
  iconColor?: string;
  shapeType?: 'rounded' | 'rect' | 'circle' | 'badge';
  bgColor?: string;
  borderColor?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  zIndex: number;
  textColor?: string;
  fontSizePx?: number;
  isBold?: boolean;
  isItalic?: boolean;
}

export type EditorLocale = 'th-TH' | 'en-US';
export type ActivePage = 'home' | 'promotions' | 'courses' | 'resources' | 'about';
export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
export type EditMode = 'edit' | 'view';

export interface SectionNavItem {
  id: string;
  title: string;
  icon: string;
  color: 'green' | 'red' | 'dark';
  isCustomPage?: boolean;
}

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
}

export interface InlineDomState {
  index: number;
  text?: string | undefined;
  imageSrc?: string | undefined;
  iconName?: string | null;
  display: string;
  transform: string;
  width: string;
  height: string;
  fontSize: string;
  color: string;
  fontWeight: string;
  fontStyle: string;
}

export interface ImageSizeSpec {
  width: number;
  height: number;
  label: string;
}

export interface PageSectionItem {
  id: number;
  pageName: string;
  locale: string;
  sectionKey: string;
  sectionTitle?: string;
  content?: Record<string, unknown> | Array<unknown> | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PageDataResponse {
  pageName: string;
  locale: string;
  sections: Record<string, Record<string, unknown>>;
  navSections: SectionNavItem[];
  themeSettings: ThemeSettings;
  customBlocks: CustomBlockItem[];
  sectionBlocks?: SectionBlockItem[];
  inlineDomStates?: InlineDomState[];
  styleOverrides?: Record<string, unknown>;
}

export interface BulkSavePayload {
  pageName: string;
  locale: string;
  sections?: unknown;
  contentStateMap?: unknown;
  navSections?: SectionNavItem[];
  themeSettings?: ThemeSettings;
  customBlocks?: CustomBlockItem[];
  sectionBlocks?: SectionBlockItem[];
  inlineDomStates?: InlineDomState[];
  styleOverrides?: Record<string, unknown>;
}
