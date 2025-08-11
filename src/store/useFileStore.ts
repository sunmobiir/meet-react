import { create } from 'zustand';
import { nanoid } from 'nanoid';

export interface FileItem {
  id: string;
  name: string;
  sizeKb: number;
  type: 'pdf' | 'doc' | 'ppt' | 'image' | 'other';
  updatedAt: number;
}

interface FileState {
  files: FileItem[];
  addFile: (name: string, type?: FileItem['type']) => void;
  deleteFile: (id: string) => void;
}

const now = () => Date.now();

const mockFiles: FileItem[] = [
  { id: 'f1', name: 'Agenda.pdf', sizeKb: 320, type: 'pdf', updatedAt: now() - 1000 * 60 * 60 },
  { id: 'f2', name: 'Slides.pptx', sizeKb: 2048, type: 'ppt', updatedAt: now() - 1000 * 60 * 30 },
];

export const useFileStore = create<FileState>((set) => ({
  files: mockFiles,

  addFile: (name, type = 'other') => set((state) => ({
    files: [
      { id: nanoid(), name, type, sizeKb: Math.round(100 + Math.random() * 5000), updatedAt: now() },
      ...state.files,
    ]
  })),

  deleteFile: (id) => set((state) => ({
    files: state.files.filter(f => f.id !== id)
  })),
}));