'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  const getToolLabel = (toolName: string) => {
    switch (toolName) {
      case "weeklyRankingsTool":
        return "📅 Analyzing weekly rankings...";

      case "playerRankingsTool":
        return "🏈 Analyzing player rankings...";

      case "valueRankingsTool":
        return "📈 Calculating player value...";

      case "punchingBagTool":
        return "🥊 Checking who took the worst beatings...";

      case "getTeamScorerRankingsTool":
        return "🔥 Analyzing team scoring...";

      case "badBenchRankingTool":
        return "🪑 Investigating the league's worst decision makers...";

      case "teamRecordsTool":
        return "🏆 Checking manager records...";

      default:
        return "🔎 Consulting the league archives...";
    }
  };

  const lastMessage = messages[messages.length - 1];

  const activeToolPart = lastMessage?.parts
    ?.slice()
    .reverse()
    .find(
      (part) =>
        part.type.startsWith("tool-") &&
        "state" in part &&
        part.state !== "output-available"
    );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: isLoading ? 'auto' : 'smooth',
    });
  }, [messages, isLoading]);

  return (

    <main
      className="h-screen bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: "url('/fantasy_rag_bot_bg.png')" }}
    >
      <div className="flex flex-col w-full max-w-2xl py-8 mx-auto stretch bg-black/60 border-3 h-[88vh] items-center">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
            🏆 League Insider AI
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 px-4 w-full">
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
                if (part.type === "text") {
                  return (
                    <div key={i} className="text-gray-800">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold">{children}</strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic">{children}</em>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc ml-5 mb-2">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal ml-5 mb-2">{children}</ol>
                          ),
                          li: ({ children }) => (
                            <li className="mb-1">{children}</li>
                          ),
                          code: ({ children }) => (
                            <code className="bg-gray-100 rounded px-1 py-0.5 text-sm">
                              {children}
                            </code>
                          ),
                        }}
                      >
                        {part.text}
                      </ReactMarkdown>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          ))}

          {isLoading && (
            <div className="text-gray-400 italic text-sm animate-pulse">
              {activeToolPart
                ? getToolLabel(activeToolPart.type.replace("tool-", ""))
                : "Consulting the league archives..."}
            </div>
          )}

          {/* Invisible scroll target */}
          <div ref={messagesEndRef} />
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