
import { useChatStore } from './useChatStore';
import { useQuizStore } from './useQuizStore';
import { useVideoConferenceStore } from './useVideoConferenceStore';
import { useFileStore } from './useFileStore';
import { useUIStore } from './useUIStore';
// Legacy hook that combines all stores for backward compatibility
export const useAppStore = <T>(selector: (state: any) => T): T => {
  const chatStore = useChatStore();
  const quizStore = useQuizStore();
  const videoConferenceStore = useVideoConferenceStore();
  const fileStore = useFileStore();
  const uiStore = useUIStore();

  // Combine all stores into a single state object that matches the old structure
  const combinedState = {
    // Data
    messages: chatStore.messages,
    files: fileStore.files,
    quiz: {
      questions: quizStore.questions,
      responses: quizStore.responses,
    },
    ui: {
      lang: uiStore.lang,
      theme: uiStore.theme,
      isChatDrawerOpen: uiStore.isChatDrawerOpen,
      isUsersDrawerOpen: uiStore.isUsersDrawerOpen,
      isQuizDrawerOpen: uiStore.isQuizDrawerOpen,

      isUsersPanelVisible: uiStore.isUsersPanelVisible,
      isVideoConferenceVisible: uiStore.isVideoConferenceVisible,
    },
    videoConference: {
      isVideoEnabled: videoConferenceStore.isVideoEnabled,
      isAudioEnabled: videoConferenceStore.isAudioEnabled,
      isScreenSharing: videoConferenceStore.isScreenSharing,
      isMuted: videoConferenceStore.isMuted,
      currentSpeaker: videoConferenceStore.currentSpeaker,
      layout: videoConferenceStore.layout,
    },
    settings: uiStore.settings,

    // Actions
    setLang: uiStore.setLang,
    setTheme: uiStore.setTheme,

    toggleChatDrawer: uiStore.toggleChatDrawer,
    toggleUsersDrawer: uiStore.toggleUsersDrawer,
    toggleQuizDrawer: uiStore.toggleQuizDrawer,
    toggleUsersPanel: uiStore.toggleUsersPanel,
    toggleVideoConference: uiStore.toggleVideoConference,
    toggleVideo: videoConferenceStore.toggleVideo,
    toggleAudio: videoConferenceStore.toggleAudio,
    toggleScreenShare: videoConferenceStore.toggleScreenShare,
    setVideoLayout: videoConferenceStore.setVideoLayout,
    updateSettings: uiStore.updateSettings,

    addMessage: chatStore.addMessage,
    replyToMessage: chatStore.replyToMessage,
    editMessage: chatStore.editMessage,
    deleteMessage: chatStore.deleteMessage,

    addFile: fileStore.addFile,
    deleteFile: fileStore.deleteFile,

    answerQuiz: quizStore.answerQuiz,
    addQuizQuestion: quizStore.addQuizQuestion,
    deleteQuizQuestion: quizStore.deleteQuizQuestion,
  };

  return selector(combinedState);
};
