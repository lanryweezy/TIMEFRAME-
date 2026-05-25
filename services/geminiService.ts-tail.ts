export class ResilientChatSession {
  private chat: any;

  constructor(chat: any) {
    this.chat = chat;
  }

  async sendMessage(options: any): Promise<any> {
    const projectId = 'current_project'; 
    const relevantMemory = await MemoryService.recallRelevant(projectId, options.message);
    const memoryPrompt = relevantMemory.length > 0 
        ? `\n\n### PROJECT MEMORY (RECALLED)\n${relevantMemory.map(m => `- ${m.content}`).join('\n')}\n`
        : '';

    const enrichedOptions = {
        ...options,
        message: `${memoryPrompt}\nUser Request: ${options.message}`
    };

    if (!this.chat) {
      throw new Error("Neural Core: Gemini session not initialized. Verify API key configuration.");
    }

    return await this.chat.sendMessage(enrichedOptions);
  }
}

export const createGeminiSession = () => {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
      console.warn('Neural Core: VITE_GEMINI_API_KEY is missing. Operating in restricted Local-Fallback mode.');
      return new ResilientChatSession(null) as any;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
        model: 'gemini-2.0-flash', 
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: tools,
        },
    });
    return new ResilientChatSession(chat) as any;
  } catch (error) {
    console.error("Neural Core: Initialization failed", error);
    return new ResilientChatSession(null) as any;
  }
};
