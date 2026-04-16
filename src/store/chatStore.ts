import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  source?: string;
  chips?: string[];
  timestamp: number;
}

export interface PlanCard {
  id: string;
  name: string;
  carrier: string;
  premium: number;
  starRating: number;
  deductible: number;
  maxOutOfPocket: number;
  drugCoverage: boolean;
  dentalVision: boolean;
  fitness: boolean;
  highlights: string[];
}

export interface UserProfile {
  zipCode: string;
  county: string;
  age: number;
  medications: string[];
  doctors: string[];
  priorities: string[];
  budget: string;
  currentCoverage: string;
}

export type ConversationPhase =
  | 'welcome'
  | 'discovery'
  | 'plan_search'
  | 'comparison'
  | 'deep_dive'
  | 'enrollment'
  | 'confirmation';

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  phase: ConversationPhase;
  userProfile: Partial<UserProfile>;
  selectedPlans: PlanCard[];
  enrollingPlan: PlanCard | null;
  sessionId: string;
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
  setIsTyping: (v: boolean) => void;
  setPhase: (p: ConversationPhase) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  setSelectedPlans: (plans: PlanCard[]) => void;
  setEnrollingPlan: (plan: PlanCard | null) => void;
  sendMessage: (text: string) => Promise<void>;
  reset: () => void;
}

const MAX_STORED_MESSAGES = 100;
const MAX_HISTORY_TO_API = 40;

const createInitialMessage = (): Message => ({
  id: '1',
  role: 'assistant',
  content: "Hi! I'm your Medicare AI Advisor. I'll help you find the best Medicare Advantage plan for your needs. I use real CMS data and carrier information to give you accurate, transparent recommendations.\n\nWhat would you like to explore?",
  source: 'System',
  chips: ['Find plans near me', 'Compare plan benefits', 'Check my medications', 'Understand Medicare basics'],
  timestamp: Date.now(),
});

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [createInitialMessage()],
  isTyping: false,
  phase: 'welcome',
  userProfile: {},
  selectedPlans: [],
  enrollingPlan: null,
  sessionId: uuidv4(),

  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, { ...msg, id: uuidv4(), timestamp: Date.now() }].slice(-MAX_STORED_MESSAGES),
  })),

  setIsTyping: (v) => set({ isTyping: v }),
  setPhase: (p) => set({ phase: p }),
  updateProfile: (data) => set((state) => ({
    userProfile: { ...state.userProfile, ...data },
  })),
  setSelectedPlans: (plans) => set({ selectedPlans: plans }),
  setEnrollingPlan: (plan) => set({ enrollingPlan: plan }),

  sendMessage: async (text: string) => {
    const { addMessage, setIsTyping } = get();
    if (!text.trim()) return;

    // Build user message
    const userMsg: Omit<Message, 'id' | 'timestamp'> = { role: 'user', content: text };

    // Build history BEFORE mutating state, include the new user message
    const history = [...get().messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: text }].slice(-MAX_HISTORY_TO_API);

    addMessage(userMsg);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          userProfile: get().userProfile,
          phase: get().phase,
        }),
      });
      const data = await res.json();

      if (data.error) {
        addMessage({
          role: 'assistant',
          content: 'I apologize, but I encountered an issue. Please try again or call 1-800-555-0199 for assistance.',
          source: 'System',
        });
      } else {
        addMessage({
          role: 'assistant',
          content: data.message,
          source: data.source || 'Perplexity AI',
          chips: data.chips,
        });
        if (data.profileUpdate) {
          get().updateProfile(data.profileUpdate);
        }
        if (data.phase) {
          get().setPhase(data.phase);
        }
        if (data.planCards) {
          get().setSelectedPlans(data.planCards);
        }
      }
    } catch (err) {
      addMessage({
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        source: 'System',
      });
    } finally {
      setIsTyping(false);
    }
  },

  reset: () => set({
    messages: [createInitialMessage()],
    isTyping: false,
    phase: 'welcome',
    userProfile: {},
    selectedPlans: [],
    enrollingPlan: null,
    sessionId: uuidv4(),
  }),
}));
