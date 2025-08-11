import { create } from 'zustand';
import { nanoid } from 'nanoid';

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'yes-no';
  options: string[];
  correctIndex: number;
}

interface QuizState {
  questions: QuizQuestion[];
  responses: Record<string, number>; // key: questionId -> selected index
  answerQuiz: (questionId: string, optionIndex: number) => void;
  addQuizQuestion: (question: string, type: 'multiple-choice' | 'yes-no', options: string[], correctIndex: number) => void;
  deleteQuizQuestion: (questionId: string) => void;
}

const mockQuestions: QuizQuestion[] = [
  { id: 'q1', question: 'What is React?', type: 'multiple-choice', options: ['A library', 'A framework', 'A language'], correctIndex: 0 },
  { id: 'q2', question: 'Tailwind is a ...', type: 'multiple-choice', options: ['CSS Framework', 'Design tool', 'Database'], correctIndex: 0 },
  { id: 'q3', question: 'Is React a JavaScript library?', type: 'yes-no', options: ['Yes', 'No'], correctIndex: 0 },
];

export const useQuizStore = create<QuizState>((set) => ({
  questions: mockQuestions,
  responses: {},

  answerQuiz: (questionId, optionIndex) => set((state) => ({
    responses: { ...state.responses, [questionId]: optionIndex }
  })),

  addQuizQuestion: (question, type, options, correctIndex) => set((state) => ({
    questions: [
      ...state.questions,
      { id: nanoid(), question, type, options, correctIndex }
    ]
  })),

  deleteQuizQuestion: (questionId) => set((state) => ({
    questions: state.questions.filter(q => q.id !== questionId),
    responses: Object.fromEntries(
      Object.entries(state.responses).filter(([id]) => id !== questionId)
    )
  })),
}));