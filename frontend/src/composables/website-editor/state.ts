import { reactive, ref } from 'vue';
import { createInitialState, createInitialEnState, INITIAL_NAV_SECTIONS } from './defaults';
import type {
  EditorLocale,
  ActivePage,
  ViewportMode,
  EditMode,
  CustomBlockItem,
  SectionBlockItem,
  SectionNavItem,
  ThemeSettings,
} from './types';

export const contentStateMap: Record<EditorLocale, ReturnType<typeof createInitialState>> = {
  'th-TH': createInitialState(),
  'en-US': createInitialEnState(),
};

export const contentState = createInitialState();
export const editorLocale = ref<EditorLocale>('th-TH');
export const activePage = ref<ActivePage>('home');

export const isLoading = ref(false);
export const isSaving = ref(false);
export const error = ref<string | null>(null);

export const customBlocks = reactive<CustomBlockItem[]>([]);
export const sectionBlocks = reactive<SectionBlockItem[]>([]);
export const ghostBlockType = ref<'text' | 'image' | 'icon' | 'shape' | null>(null);

export const activeSectionId = ref<string>('');
export const selectedBlockId = ref<string>('');
export const viewportMode = ref<ViewportMode>('desktop');
export const editMode = ref<EditMode>('edit');

export const themeSettings = reactive<ThemeSettings>({
  primaryColor: '#c00000',
  accentColor: '#1c871e',
  fontFamily: 'Noto Sans Thai, sans-serif',
});

export const navSections = reactive<SectionNavItem[]>([...INITIAL_NAV_SECTIONS]);

export const historyStack = ref<string[]>([]);
export const redoStack = ref<string[]>([]);
export const maxHistory = 40;
