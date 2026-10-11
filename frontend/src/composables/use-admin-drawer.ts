import { ref, type Ref } from 'vue';

const STORAGE_KEY = 'botbuilder_admin_rail';

function getInitialMiniState(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export interface UseAdminDrawerReturn {
  isDrawerOpen: Ref<boolean>;
  isDrawerMini: Ref<boolean>;
  toggleDrawer: (isMobile?: boolean) => void;
  toggleMini: () => void;
  setDrawerMini: (mini: boolean) => void;
  setDrawerOpen: (open: boolean) => void;
}

const isDrawerOpen = ref(true);
const isDrawerMini = ref(getInitialMiniState());

export function useAdminDrawer(): UseAdminDrawerReturn {
  const setDrawerMini = (mini: boolean): void => {
    isDrawerMini.value = mini;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, String(mini));
      } catch (err) {
        void err;
      }
    }
  };

  const toggleMini = (): void => {
    setDrawerMini(!isDrawerMini.value);
  };

  const setDrawerOpen = (open: boolean): void => {
    isDrawerOpen.value = open;
  };

  const toggleDrawer = (isMobile?: boolean): void => {
    if (isMobile) {
      isDrawerOpen.value = !isDrawerOpen.value;
      return;
    }
    toggleMini();
  };

  return {
    isDrawerOpen,
    isDrawerMini,
    toggleDrawer,
    toggleMini,
    setDrawerMini,
    setDrawerOpen,
  };
}
