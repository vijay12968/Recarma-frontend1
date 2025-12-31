import { GoogleGenAI } from "@google/genai";
import { CHATBOT_SYSTEM_INSTRUCTION } from "../constants";

// API key must be obtained from process.env.API_KEY.
// Assume it is valid and accessible.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateChatResponse = async (userMessage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: CHATBOT_SYSTEM_INSTRUCTION,
      }
    });
    
    return response.text || "I didn't get that. Could you rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }
};