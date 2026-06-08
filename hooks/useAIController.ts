import React, { useState, useRef, useEffect, useCallback } from 'react';
import { workerPool } from '../services/workerPool';
import {
  ChatMessage,
  ToolNames,
  ToolArgs,
  VideoState,
  FilterPreset,
} from '../types';
import { Chat } from '@google/genai';
import { INITIAL_CHAT_MESSAGE } from '../constants';
import { useVideoStore } from '../store/videoStore';
import { visualHandlers } from './ai-handlers/visualHandlers';
import { audioHandlers } from './ai-handlers/audioHandlers';
import { generativeHandlers } from './ai-handlers/generativeHandlers';
import { projectHandlers } from './ai-handlers/projectHandlers';
import { HandlerContext } from './ai-handlers/types';

const allHandlers = {
  ...visualHandlers,
  ...audioHandlers,
  ...generativeHandlers,
  ...projectHandlers,
};

export const useAIController = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', content: INITIAL_CHAT_MESSAGE },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const aiWorkerRef = useRef<Worker | null>(null);
  const messageResolvers = useRef(new Map());
  const store = useVideoStore();
  const stateRef = useRef(store);

  // Sync ref with latest state from store
  useEffect(() => {
    stateRef.current = store;
  }, [store]);

  // Helper for sandboxed actions (AI Governance)
  const proposeAction = useCallback((toolName: string, args: any, description: string, stateUpdate: Partial<VideoState>) => {
    store.setState({
        aiActionSandbox: {
            ...stateRef.current.aiActionSandbox,
            actions: [
                ...stateRef.current.aiActionSandbox.actions,
                {
                    id: crypto.randomUUID().slice(0, 8),
                    toolName,
                    args,
                    description,
                    proposedState: stateUpdate,
                    timestamp: Date.now(),
                    status: 'pending' as const
                }
            ]
        }
    });
  }, [store]);

  useEffect(() => {
    try {
      const worker = workerPool.getWorker('ai');
      aiWorkerRef.current = worker;

      worker.onmessage = (e) => {
          const { id, type, payload } = e.data;
          const resolver = messageResolvers.current.get(id);
          if (resolver) {
              if (type === 'MESSAGE_RESPONSE') {
                  resolver.resolve(payload);
              } else if (type === 'ERROR') {
                  resolver.reject(new Error(payload));
              }
              messageResolvers.current.delete(id);
          }
      };

      worker.postMessage({ id: 'init', type: 'INIT_SESSION' });
      console.log('Neural Core Online: Primary models loaded via Web Worker.');
    } catch (err) {
      console.error('Neural Core Offline', err);
    }
  }, []);

  const handleSendMessage = useCallback(
    async (userMessage: string) => {
      if (!aiWorkerRef.current) return;
      setIsProcessing(true);

      if (userMessage.startsWith('Resolve the debate:')) {
         const resolution = userMessage.includes("Zoe's") ? 'narrative' : 'aesthetic';
         store.setState({ 
            debateState: { ...stateRef.current.debateState!, isActive: false },
            isAnalyzing: true,
            projectDNA: {
               ...stateRef.current.projectDNA,
               narrativeWeight: resolution === 'narrative' ? Math.min(1, stateRef.current.projectDNA.narrativeWeight + 0.1) : stateRef.current.projectDNA.narrativeWeight,
               aestheticWeight: resolution === 'aesthetic' ? Math.min(1, stateRef.current.projectDNA.aestheticWeight + 0.1) : stateRef.current.projectDNA.aestheticWeight,
               emotionalTone: [...new Set([...stateRef.current.projectDNA.emotionalTone, resolution === 'narrative' ? 'Intense' : 'Stylized'])],
            },
            activeFilter: resolution === 'narrative' ? 'cinema' : 'cyber' as FilterPreset,
         });
         setTimeout(() => store.setAiStatus({ isAnalyzing: false }), 2000);
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'user', content: userMessage },
      ]);

      // Dynamic Telemetry Update
      store.setState({
         neuralTelemetry: {
            ...stateRef.current.neuralTelemetry,
            synapticLatency: 5 + Math.random() * 15,
            quantumEntropy: 0.01 + Math.random() * 0.05,
         }
      });

      try {
        const response = await new Promise<any>((resolve, reject) => {
          const msgId = crypto.randomUUID();
          messageResolvers.current.set(msgId, { resolve, reject });
          aiWorkerRef.current!.postMessage({ id: msgId, type: 'SEND_MESSAGE', payload: { message: userMessage } });
        });
        const functionCalls = response.functionCalls;

        if (functionCalls && functionCalls.length > 0) {
          const thinkingId = Date.now().toString() + '_thinking';
          setMessages((prev) => [
            ...prev,
            { id: thinkingId, role: 'model', content: '', isFunctionCall: true },
          ]);

          const handlerContext: HandlerContext = {
            store,
            state: stateRef.current,
            proposeAction,
          };

          for (const call of functionCalls) {
            const toolName = call.name;
            const args = call.args as ToolArgs;
            
            store.setAiStatus({ isAnalyzing: true });

            if (toolName) {
              const handler = (allHandlers as any)[toolName];
              if (handler) {
                const result = await handler(args, handlerContext);
                if (result && result.result) {
                  // We could add the result to the chat session history if needed
                }
              } else {
                console.warn(`No handler for tool: ${toolName}`);
              }
            }
          }
          
          store.setAiStatus({ isAnalyzing: false });
        }

        if (response.text) {
          setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), role: 'model', content: response.text || '' },
          ]);
        }
      } catch (error) {
        console.error('AI Error:', error);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'model',
            content: 'Error communicating with neural core. Attempting reconnection...',
          },
        ]);
      } finally {
        setIsProcessing(false);
      }
    },
    [proposeAction, store]
  );

  return { messages, isProcessing, handleSendMessage };
};
