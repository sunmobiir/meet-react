import { create } from 'zustand';

export type Lang = 'en' | 'ar' | 'fa';
export type ThemeMode = 'light' | 'dark';
export type VideoConferencePosition = 'centerPanel' | 'mainPanelTop' | 'mainPanelCenter' | 'mainPanelBottom' | 'leftPanelTop';
export type UserRole = 'host' | 'participant';

export interface AppSettings {
  selectedCamera: string;
  selectedMicrophone: string;
  selectedSpeaker: string;
  videoQuality: 'low' | 'medium' | 'high';
  enableNotifications: boolean;
  enableSoundEffects: boolean;
  autoJoinAudio: boolean;
  autoStartVideo: boolean;
}

interface UIState {
  lang: Lang;
  theme: ThemeMode;
  isAuthenticated: boolean;
  currentUser: {
    username: string;
    role: UserRole;
  } | null;
  isChatDrawerOpen: boolean;
  isUsersDrawerOpen: boolean;
  isQuizDrawerOpen: boolean;
  isUsersPanelVisible: boolean;
  isLeftPanelVisible: boolean;
  isVideoConferenceVisible: boolean;
  videoConferencePosition: VideoConferencePosition;
  // Individual panel visibility states
  isCenterPanelVisible: boolean;
  isMainPanelVisible: boolean;
  isMainPanelTopVisible: boolean;
  isMainPanelCenterVisible: boolean;
  isMainPanelBottomVisible: boolean;
  isLeftPanelTopVisible: boolean;
  isLeftPanelCenterVisible: boolean;
  isLeftPanelBottomVisible: boolean;
  settings: AppSettings;
  setLang: (lang: Lang) => void;
  setTheme: (theme: ThemeMode) => void;
  login: (username: string, password: string, role: UserRole) => void;
  logout: () => void;
  toggleChatDrawer: (open?: boolean) => void;
  toggleUsersDrawer: (open?: boolean) => void;
  toggleQuizDrawer: (open?: boolean) => void;
  toggleUsersPanel: () => void;
  toggleLeftPanel: () => void;
  toggleVideoConference: () => void;
  setVideoConferencePosition: (position: VideoConferencePosition) => void;
  // Individual panel toggle functions
  toggleCenterPanel: () => void;
  toggleMainPanel: () => void;
  toggleMainPanelTop: () => void;
  toggleMainPanelCenter: () => void;
  toggleMainPanelBottom: () => void;
  toggleLeftPanelTop: () => void;
  toggleLeftPanelCenter: () => void;
  toggleLeftPanelBottom: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useUIStore = create<UIState>((set) => ({
  lang: (typeof window !== 'undefined' ? localStorage.getItem('app-lang') as Lang : null) || 'en',
  theme: (typeof window !== 'undefined' ? localStorage.getItem('app-theme') as ThemeMode : null) || 'light',
  isAuthenticated: (typeof window !== 'undefined' ? localStorage.getItem('app-authenticated') === 'true' : false),
  currentUser: (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('app-user') || 'null') : null),
  isChatDrawerOpen: false,
  isUsersDrawerOpen: false,
  isQuizDrawerOpen: false,
  isUsersPanelVisible: true,
  isLeftPanelVisible: true,
  isVideoConferenceVisible: true,
  videoConferencePosition: 'centerPanel',
  // Individual panel visibility states
  isCenterPanelVisible: true,
  isMainPanelVisible: true,
  isMainPanelTopVisible: true,
  isMainPanelCenterVisible: true,
  isMainPanelBottomVisible: true,
  isLeftPanelTopVisible: true,
  isLeftPanelCenterVisible: true,
  isLeftPanelBottomVisible: true,
  settings: {
    selectedCamera: 'default',
    selectedMicrophone: 'default',
    selectedSpeaker: 'default',
    videoQuality: 'medium',
    enableNotifications: true,
    enableSoundEffects: true,
    autoJoinAudio: true,
    autoStartVideo: false,
  },

  setLang: (lang) => set(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-lang', lang);
    }
    return { lang };
  }),
  setTheme: (theme) => set(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-theme', theme);
    }
    return { theme };
  }),
  login: (username, password, role) => set(() => {
    const user = { username, role };
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-authenticated', 'true');
      localStorage.setItem('app-user', JSON.stringify(user));
    }
    return { isAuthenticated: true, currentUser: user };
  }),
  logout: () => set(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('app-authenticated');
      localStorage.removeItem('app-user');
    }
    return { isAuthenticated: false, currentUser: null };
  }),
  
  toggleChatDrawer: (open) => set((state) => ({ isChatDrawerOpen: open ?? !state.isChatDrawerOpen })),
  toggleUsersDrawer: (open) => set((state) => ({ isUsersDrawerOpen: open ?? !state.isUsersDrawerOpen })),
  toggleQuizDrawer: (open) => set((state) => ({ isQuizDrawerOpen: open ?? !state.isQuizDrawerOpen })),
  
  toggleUsersPanel: () => set((state) => ({ isUsersPanelVisible: !state.isUsersPanelVisible })),
  toggleLeftPanel: () => set((state) => ({ isLeftPanelVisible: !state.isLeftPanelVisible })),
  toggleVideoConference: () => set((state) => ({ isVideoConferenceVisible: !state.isVideoConferenceVisible })),

 
  setVideoConferencePosition: (position) => set(() => ({ videoConferencePosition: position })),
  // Individual panel toggle functions
  toggleCenterPanel: () => set((state) => ({ isCenterPanelVisible: !state.isCenterPanelVisible })),
  toggleMainPanel: () => set((state) => ({ isMainPanelVisible: !state.isMainPanelVisible })),
  toggleMainPanelTop: () => set((state) => ({ isMainPanelTopVisible: !state.isMainPanelTopVisible })),
  toggleMainPanelCenter: () => set((state) => ({ isMainPanelCenterVisible: !state.isMainPanelCenterVisible })),
  toggleMainPanelBottom: () => set((state) => ({ isMainPanelBottomVisible: !state.isMainPanelBottomVisible })),
  toggleLeftPanelTop: () => set((state) => ({ isLeftPanelTopVisible: !state.isLeftPanelTopVisible })),
  toggleLeftPanelCenter: () => set((state) => ({ isLeftPanelCenterVisible: !state.isLeftPanelCenterVisible })),
  toggleLeftPanelBottom: () => set((state) => ({ isLeftPanelBottomVisible: !state.isLeftPanelBottomVisible })),
  updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
}));