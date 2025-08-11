import { create } from 'zustand';

interface VideoConferenceState {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  isMuted: boolean;
  currentSpeaker?: string;
  layout: 'grid' | 'speaker' | 'presentation';
  toggleVideo: () => void;
  toggleAudio: () => void;
  toggleScreenShare: () => void;
  setVideoLayout: (layout: 'grid' | 'speaker' | 'presentation') => void;
}

export const useVideoConferenceStore = create<VideoConferenceState>((set) => ({
  isVideoEnabled: true,
  isAudioEnabled: true,
  isScreenSharing: false,
  isMuted: false,
  currentSpeaker: 'u2',
  layout: 'grid',

  toggleVideo: () => set((state) => ({
    isVideoEnabled: !state.isVideoEnabled
  })),

  toggleAudio: () => set((state) => ({
    isAudioEnabled: !state.isAudioEnabled
  })),

  toggleScreenShare: () => set((state) => ({
    isScreenSharing: !state.isScreenSharing
  })),

  setVideoLayout: (layout) => set(() => ({
    layout
  })),
}));