import React, { useState, useEffect, useRef, useCallback } from "react";
import { Chat } from "@google/genai";
import { v4 as uuidv4 } from "uuid";

import Header from "./components/Header";
import MessageBubble from "./components/MessageBubble";
import InputArea from "./components/InputArea";

import { ChatMessage, Role } from "./types";
import { createChatSession, sendMessageOnce } from "./services/geminiService";

import { MessageSquareDashed } from "lucide-react";

const generateId = uuidv4;

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  /* ---------------- INIT CHAT ---------------- */
  const initChat = useCallback(() => {
    try {
      chatSessionRef.current = createChatSession();

      if (!hasInitialized.current) {
        setMessages([
          {
            id: generateId(),
            role: Role.MODEL,
            content:
              "Hello! I'm **DevMate**, your AI Coding Assistant 👨‍💻\n\n" +
              "Ask me anything related to programming, debugging, or computer science.",
            timestamp: Date.now(),
          },
        ]);
        hasInitialized.current = true;
      }
    } catch (error: any) {
      console.error(error);
      setInitError(
        "❌ Gemini API key is missing.\n\n" +
        "Please add VITE_GEMINI_API_KEY to .env.local and restart the app."
      );
    }
  }, []);

  useEffect(() => {
    initChat();
  }, [initChat]);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!chatSessionRef.current || !content.trim()) return;

      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: Role.USER,
          content,
          timestamp: Date.now(),
        },
      ]);

      setIsLoading(true);

      try {
        const reply = await sendMessageOnce(
          chatSessionRef.current,
          content
        );

        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: Role.MODEL,
            content: reply,
            timestamp: Date.now(),
          },
        ]);
      } catch (error) {
        console.error("Gemini error:", error);
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: Role.MODEL,
            content:
              `❌ Error: ${errorMsg}\n\nTroubleshooting:\n- Check browser console for details\n- Verify VITE_GEMINI_API_KEY is set\n- Ensure API is enabled in Google Cloud Console`,
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ---------------- RENDER ---------------- */
  return (
    <div className="flex flex-col h-dvh bg-slate-950 text-slate-100">
      {/* Fixed header on mobile via sticky in component, full-width container here */}
      <Header />

      {/* Scrollable messages area between header and input, works well on mobile with keyboard */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-6">
        <div className="max-w-4xl mx-auto flex flex-col min-h-full pb-2 sm:pb-4">
          {initError ? (
            <div className="flex-1 flex items-center justify-center text-red-400 text-center whitespace-pre-line">
              {initError}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <MessageSquareDashed
                  size={40}
                  className="mx-auto mb-3 opacity-50"
                />
                <p className="text-sm sm:text-base">Start a conversation</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 space-y-2 pb-1">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Fixed input bar; already sticky-safe in its own component */}
      <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
