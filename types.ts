export interface FunFactCard {
  id: string;
  topic: string;
  question: string;
  answer: string;
  color: string; // CSS class or hex for card background
}

export interface DeckGenerationResponse {
  topic: string;
  facts: {
    question: string;
    fact: string;
  }[];
}
