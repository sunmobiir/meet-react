import { create } from 'zustand';
import { Chat, ChatMessage, ChatMessageType } from '@/model/model_pb';
import { protoInt64 } from '@bufbuild/protobuf';

interface ChatState {
  messages: Chat[];
  currentUserId: string;
  currentUserName: string;

  // Actions
  addMessage: (text: string, isPrivate?: boolean, toUserId?: string) => void;
  addMessages: (m: Chat[]) => void;
  replyToMessage: (replyToId: string, replyText: string, text: string) => void;
  editMessage: (messageId: string, newText: string) => void;
  deleteMessage: (messageId: string) => void;
  setCurrentUser: (userId: string, userName: string) => void;
  clearMessages: () => void;

  // Utility functions
  getMessageById: (messageId: string) => Chat | undefined;
  getPublicMessages: () => Chat[];
  getPrivateMessages: (userId: string) => Chat[];
  initializeMockData: () => void;
}

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper function to create a new chat message
const createChatMessage = (
  text: string,
  userId: string,
  userName: string,
  isPrivate = false,
  toUserId = '',
  isReply = false,
  replyId = '',
  replyText = ''
): Chat => {
  return new Chat({
    ID: generateId(),
    text,
    userId,
    userName,
    isDelete: false,
    insertTime: protoInt64.parse(Date.now()),
    meetId: 1, // Default meet ID
    isReply,
    replyId,
    replyText,
    toUserId,
    isPrivate,
  });
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  currentUserId: '',
  currentUserName: '',

  addMessage: (text, isPrivate = false, toUserId = '') => {
    const state = get();
    const newMessage = createChatMessage(
      text,
      state.currentUserId,
      state.currentUserName,
      isPrivate,
      toUserId
    );

    set((state) => ({
      messages: [...state.messages, newMessage]
    }));
  },
  addMessages: (m: Chat[]) => {
    const state = get();
    // state.messages=m;
    set((state) => ({
      messages: m
    }));
  },

  replyToMessage: (replyToId, replyText, text) => {
    const state = get();
    const newMessage = createChatMessage(
      text,
      state.currentUserId,
      state.currentUserName,
      false,
      '',
      true,
      replyToId,
      replyText
    );

    set((state) => ({
      messages: [...state.messages, newMessage]
    }));
  },

  editMessage: (messageId, newText) => {
    set((state) => ({
      messages: state.messages.map(msg =>
        msg.ID === messageId
          ? new Chat({ ...msg, text: newText })
          : msg
      )
    }));
  },

  deleteMessage: (messageId) => {
    set((state) => ({
      messages: state.messages.map(msg =>
        msg.ID === messageId
          ? new Chat({ ...msg, isDelete: true })
          : msg
      )
    }));
  },

  setCurrentUser: (userId, userName) => {
    set({ currentUserId: userId, currentUserName: userName });
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  getMessageById: (messageId) => {
    const state = get();
    return state.messages.find(msg => msg.ID === messageId);
  },

  getPublicMessages: () => {
    const state = get();
    return state.messages.filter(msg => !msg.isPrivate && !msg.isDelete);
  },

  getPrivateMessages: (userId) => {
    const state = get();
    return state.messages.filter(msg =>
      msg.isPrivate &&
      !msg.isDelete &&
      (msg.userId === userId || msg.toUserId === userId)
    );
  },

  initializeMockData: () => {
    const mockMessages = [
      createChatMessage('Welcome to the meeting!', '1', 'John Doe (Host)'),
      createChatMessage('Hello everyone!', '2', 'Alice Smith'),
      createChatMessage('Good morning!', '3', 'Bob Johnson'),
      createChatMessage('Thanks for joining', '1', 'John Doe (Host)', false, '', true, '2', 'Hello everyone!'),
    ];

    set({
      messages: mockMessages,
      currentUserId: '1',
      currentUserName: 'John Doe (Host)'
    });
  },
}));

// Export the Chat model for use in components
export type { Chat, ChatMessage };
export { ChatMessageType };