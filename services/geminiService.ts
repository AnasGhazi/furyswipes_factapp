import { GoogleGenAI, Type } from "@google/genai";
import { DeckGenerationResponse, FunFactCard } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to assign random vibrant colors to cards
const CARD_COLORS = [
  'from-pink-500 to-rose-500',
  'from-purple-500 to-indigo-500',
  'from-blue-400 to-cyan-500',
  'from-emerald-400 to-teal-500',
  'from-orange-400 to-amber-500',
  'from-red-400 to-orange-500',
];

export const generateDeck = async (topic: string): Promise<FunFactCard[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 10 fun, surprising, and engaging trivia facts about "${topic}".
      For each fact, provide a short "hook" or question for the front of the card, and the full "fun fact" for the back.
      Ensure the facts are accurate and suitable for a general audience.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            facts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING, description: "A short question or hook for the front of the card" },
                  fact: { type: Type.STRING, description: "The detailed fun fact" },
                },
                required: ["question", "fact"]
              }
            }
          },
          required: ["topic", "facts"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}") as DeckGenerationResponse;

    if (!data.facts) return [];

    return data.facts.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      topic: data.topic,
      question: item.question,
      answer: item.fact,
      color: CARD_COLORS[index % CARD_COLORS.length]
    }));

  } catch (error) {
    console.error("Failed to generate deck:", error);
    throw error;
  }
};
