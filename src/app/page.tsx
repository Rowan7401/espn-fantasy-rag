'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');

  const isLoading = status === 'submitted' || status === 'streaming';

  return (

    <main
      className="h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/fantasy_rag_bot_bg.png')" }}
    >
      <div className="flex flex-col w-full max-w-2xl py-12 mx-auto stretch bg-black/60 min-h-screen items-center">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
            🏆 League Insider AI
          </h1>
        </div>

        <div className="space-y-4 mb-20 px-4 ">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-xl shadow-sm ${m.role === 'user'
                ? 'bg-blue-50 border border-blue-100 ml-8'
                : 'bg-white border border-gray-200 mr-8'
                }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                {m.role === 'user' ? 'You' : 'Fantasy RAG bot'}
              </span>

              {m.parts?.map((part, i) => {
                if (part.type === 'text') {
                  return (
                    <p key={i} className="text-gray-800 whitespace-pre-wrap">
                      {part.text}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          ))}

          {isLoading && (
            <div className="text-gray-400 italic text-sm animate-pulse">
              Consulting the league archives...
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();

            console.log("Submitting message:", input);

            sendMessage({
              role: "user",
              parts: [{ type: "text", text: input }],
            });

            setInput("");
          }}
          className="fixed bottom-8 w-full max-w-2xl p-4 bg-white/25 backdrop-blur-lg border-t"
        >
          <input
            className="bg-white/70 backdrop-blur-lg w-full p-4 border border-gray-300 text-gray-600 rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            value={input}
            placeholder="Ask about interesting facts/data from our league..."
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
      </div>
      <footer className="fixed bottom-1 md:bottom-4 right-1 md:right-6 text-gray-400 text-sm md:text-lg backdrop-blur-sm bg-black/30 px-3 py-1 rounded-md">
        Created by <span className="text-white font-semibold">Rowan Dillon</span>
      </footer>
    </main>
  );
}