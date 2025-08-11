import { create } from 'zustand';
import { MeetStatus, ActivePanelType } from '@/model/messaging_pb';
import { Participant, Chat, FileModel, Permission, OfficeFileDto, VideoPlayerDto, DesktopStreamingDto, ClientConfig } from '@/model/model_pb';
import { QuizModel } from '@/model/quiz_pb';
import { RecorderState } from '@/model/recorder_pb';

interface MeetStatusState {
  meetStatus: MeetStatus | null;
  
  // Actions
  setMeetStatus: (meetStatus: MeetStatus) => void;
  updateParticipant: (participant: Participant) => void;
  setToken: (token: string) => void;
  setMeetTitle: (meetTitle: string) => void;
  updateUserList: (userList: { [key: string]: Participant }) => void;
  addUser: (userId: string, participant: Participant) => void;
  removeUser: (userId: string) => void;
  updateChatList: (chatList: { [key: string]: Chat }) => void;
  addChat: (chatId: string, chat: Chat) => void;
  setActivePanel: (activePanel: ActivePanelType) => void;
  setMediaServer: (mediaServer: string) => void;
  updateFileList: (fileList: { [key: number]: FileModel }) => void;
  addFile: (fileId: number, file: FileModel) => void;
  removeFile: (fileId: number) => void;
  setMeetId: (meetId: number) => void;
  setQuiz: (quiz: QuizModel) => void;
  setPermission: (permission: Permission) => void;
  setOfficeFileDto: (officeFileDto: OfficeFileDto) => void;
  setVideoPlayerDto: (videoPlayerDto: VideoPlayerDto) => void;
  setDesktopStreamingDto: (desktopStreamingDto: DesktopStreamingDto) => void;
  updatePrivateChatList: (privateChatList: { [key: string]: Chat }) => void;
  addPrivateChat: (chatId: string, chat: Chat) => void;
  setClientConfig: (clientConfig: ClientConfig) => void;
  setRecorderState: (recorderState: RecorderState) => void;
  
  // Utility actions
  clearMeetStatus: () => void;
  resetToDefaults: () => void;
}

export const useMeetStatusStore = create<MeetStatusState>((set, get) => ({
  meetStatus: null,

  setMeetStatus: (meetStatus) => set({ meetStatus }),

  updateParticipant: (participant) => set((state) => {
    
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        participant
      }
    };
  }),

  setToken: (token) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        token
      }
    };
  }),

  setMeetTitle: (meetTitle) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        meetTitle
      }
    };
  }),

  updateUserList: (userList) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        userList
      }
    };
  }),

  addUser: (userId, participant) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        userList: {
          ...state.meetStatus.userList,
          [userId]: participant
        }
      }
    };
  }),

  removeUser: (userId) => set((state) => {
    if (!state.meetStatus) return state;
    const { [userId]: removed, ...remainingUsers } = state.meetStatus.userList;
    return {
      meetStatus: {
        ...state.meetStatus,
        userList: remainingUsers
      }
    };
  }),

  updateChatList: (chatList) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        chatList
      }
    };
  }),

  addChat: (chatId, chat) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        chatList: {
          ...state.meetStatus.chatList,
          [chatId]: chat
        }
      }
    };
  }),

  setActivePanel: (activePanel) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        activePanel
      }
    };
  }),

  setMediaServer: (mediaServer) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        mediaServer
      }
    };
  }),

  updateFileList: (fileList) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        fileList
      }
    };
  }),

  addFile: (fileId, file) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        fileList: {
          ...state.meetStatus.fileList,
          [fileId]: file
        }
      }
    };
  }),

  removeFile: (fileId) => set((state) => {
    if (!state.meetStatus) return state;
    const { [fileId]: removed, ...remainingFiles } = state.meetStatus.fileList;
    return {
      meetStatus: {
        ...state.meetStatus,
        fileList: remainingFiles
      }
    };
  }),

  setMeetId: (meetId) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        meetId
      }
    };
  }),

  setQuiz: (quiz) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        quiz
      }
    };
  }),

  setPermission: (permission) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        permission
      }
    };
  }),

  setOfficeFileDto: (OfficeFileDto) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        OfficeFileDto
      }
    };
  }),

  setVideoPlayerDto: (VideoPlayerDto) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        VideoPlayerDto
      }
    };
  }),

  setDesktopStreamingDto: (DesktopStreamingDto) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        DesktopStreamingDto
      }
    };
  }),

  updatePrivateChatList: (privateChatList) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        privateChatList
      }
    };
  }),

  addPrivateChat: (chatId, chat) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        privateChatList: {
          ...state.meetStatus.privateChatList,
          [chatId]: chat
        }
      }
    };
  }),

  setClientConfig: (ClientConfig) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        ClientConfig
      }
    };
  }),

  setRecorderState: (RecorderState) => set((state) => {
    if (!state.meetStatus) return state;
    return {
      meetStatus: {
        ...state.meetStatus,
        RecorderState
      }
    };
  }),

  clearMeetStatus: () => set({ meetStatus: null }),

  resetToDefaults: () => set({
    meetStatus: new MeetStatus({
      participant: undefined,
      token: "",
      meetTitle: "",
      userList: {},
      chatList: {},
      activePanel: ActivePanelType.Whiteboard,
      mediaServer: "",
      fileList: {},
      meetId: 0,
      quiz: undefined,
      permission: undefined,
      OfficeFileDto: undefined,
      VideoPlayerDto: undefined,
      DesktopStreamingDto: undefined,
      privateChatList: {},
      ClientConfig: undefined,
      RecorderState: undefined,
    })
  }),
}));