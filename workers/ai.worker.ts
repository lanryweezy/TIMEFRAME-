import { GoogleGenAI } from '@google/genai';
import { tools } from '../hooks/ai-handlers/index';
const SYSTEM_INSTRUCTION = 'You are Zoe, an elite AI video editor...'; // Fallback instruction

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY || '' });

self.onmessage = async (e) => {
    const { id, type, payload } = e.data;

    if (type === 'INIT_SESSION') {
        try {
            const chat = ai.chats.create({
                model: 'gemini-2.0-flash',
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    tools: tools
                }
            });
            (self as any).currentChat = chat;
            self.postMessage({ id, type: 'SESSION_READY' });
        } catch (err: any) {
            self.postMessage({ id, type: 'ERROR', payload: err.message });
        }
    } else if (type === 'SEND_MESSAGE') {
        try {
            if (!(self as any).currentChat) throw new Error("Chat not initialized");
            const response = await (self as any).currentChat.sendMessage(payload);
            self.postMessage({ id, type: 'MESSAGE_RESPONSE', payload: response });
        } catch (err: any) {
            self.postMessage({ id, type: 'ERROR', payload: err.message });
        }
    }
};
