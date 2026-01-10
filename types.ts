
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  imageUrl?: string;
  feedback?: 'up' | 'down' | null;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export type KeyboardMode = 'ewts' | 'tibetan' | 'english';

export interface DictionaryEntry {
  term: string; // Used as the primary Tibetan term
  englishTerm?: string; // New field for bilingual terminology
  definition: string;
  isUserAdded?: boolean;
}
