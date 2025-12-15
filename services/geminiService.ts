import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { INITIAL_SYSTEM_INSTRUCTION } from '../constants';

class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing!");
    }
    // Initialize with the API key from environment variables
    this.ai = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  public async startChat(): Promise<void> {
    try {
      this.chat = this.ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: INITIAL_SYSTEM_INSTRUCTION,
        },
      });
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  }

  public async sendMessage(message: string): Promise<string> {
    if (!this.chat) {
      await this.startChat();
    }
    
    if (!this.chat) {
      return "Sorry, I'm having trouble connecting to the network right now.";
    }

    try {
      const response: GenerateContentResponse = await this.chat.sendMessage({ message });
      return response.text || "I didn't catch that. Could you rephrase?";
    } catch (error) {
      console.error("Error sending message:", error);
      return "Something went wrong. Please try again later.";
    }
  }
}

export const geminiService = new GeminiService();