import { create } from 'zustand';
import { Participant, Permission } from '@/model/model_pb';



interface ParticipantState {
  participants: Participant[];
  currentParticipant: Participant | null;
  
  // Actions
  setParticipants: (participants: Participant[]) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  updateParticipant: (participantId: string, updates: Partial<Participant>) => void;
  setCurrentParticipant: (participant: Participant | null) => void;
  toggleRaiseHand: (participantId: string) => void;
  updatePermission: (participantId: string, permission: Permission) => void;
  setParticipantRole: (participantId: string, role: number) => void;
  toggleParticipantVisibility: (participantId: string) => void;
  
  // Utility actions
  clearParticipants: () => void;
  getParticipantById: (participantId: string) => Participant | undefined;
  getParticipantsByRole: (role: number) => Participant[];
  getVisibleParticipants: () => Participant[];
  initializeMockData: () => void;
}

// Mock data generator
const createMockParticipant = (id: string, name: string, role: number): Participant => {
  return new Participant({
    id,
    name,
    role,
    permission: new Permission({
      video: role === 1, // Host has video permission
      audio: true,
      screen: role === 1,
      board: role === 1,
      file: role === 1,
      chat: true,
      player: role === 1,
      office: role === 1,
    }),
    raiseHand: false,
    isHidden: false,
    IsRecorder: false,
    RecordType: "",
  });
};

export const useParticipantStore = create<ParticipantState>((set, get) => ({
  participants: [],
  currentParticipant: null,

  setParticipants: (participants) => set({ participants }),

  addParticipant: (participant) => set((state) => ({
    participants: [...state.participants, participant]
  })),

  removeParticipant: (participantId) => set((state) => ({
    participants: state.participants.filter(p => p.id !== participantId)
  })),

  updateParticipant: (participantId, updates) => set((state) => ({
    participants: state.participants.map(p => 
      p.id === participantId 
        ? new Participant({ ...p, ...updates })
        : p
    )
  })),

  setCurrentParticipant: (participant) => set({ currentParticipant: participant }),

  toggleRaiseHand: (participantId) => set((state) => ({
    participants: state.participants.map(p => 
      p.id === participantId 
        ? new Participant({ ...p, raiseHand: !p.raiseHand })
        : p
    )
  })),

  updatePermission: (participantId, permission) => set((state) => ({
    participants: state.participants.map(p => 
      p.id === participantId 
        ? new Participant({ ...p, permission })
        : p
    )
  })),

  setParticipantRole: (participantId, role) => set((state) => ({
    participants: state.participants.map(p => 
      p.id === participantId 
        ? new Participant({ ...p, role })
        : p
    )
  })),

  toggleParticipantVisibility: (participantId) => set((state) => ({
    participants: state.participants.map(p => 
      p.id === participantId 
        ? new Participant({ ...p, isHidden: !p.isHidden })
        : p
    )
  })),

  clearParticipants: () => set({ participants: [], currentParticipant: null }),

  getParticipantById: (participantId) => {
    const state = get();
    return state.participants.find(p => p.id === participantId);
  },

  getParticipantsByRole: (role) => {
    const state = get();
    return state.participants.filter(p => p.role === role);
  },

  getVisibleParticipants: () => {
    const state = get();
    return state.participants.filter(p => !p.isHidden);
  },

  initializeMockData: () => {
    const mockParticipants = [
      createMockParticipant("1", "John Doe (Host)", 1), // Host
      createMockParticipant("2", "Alice Smith", 0), // Participant
      createMockParticipant("3", "Bob Johnson", 0), // Participant
      createMockParticipant("4", "Carol Williams", 0), // Participant
      createMockParticipant("5", "David Brown", 0), // Participant
    ];

    // Set one participant with raised hand
    mockParticipants[1] = new Participant({
      ...mockParticipants[1],
      raiseHand: true
    });

    set({ 
      participants: mockParticipants,
      currentParticipant: mockParticipants[0] // Set host as current participant
    });
  },
}));

