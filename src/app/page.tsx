'use client';

import { useChat } from '@ai-sdk/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto stretch">
      <h1 className="text-2xl font-bold mb-8 text-center text-blue-600">🏆 League Insider AI</h1>
      
      <div className="space-y-4 mb-20 px-4">
        {messages.map(m => (
          <div key={m.id} className={`p-4 rounded-xl shadow-sm ${m.role === 'user' ? 'bg-blue-50 border border-blue-100 ml-8' : 'bg-white border border-gray-200 mr-8'}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
              {m.role === 'user' ? 'You' : 'Commish AI'}
            </span>
            
            {/* NEW: Render parts instead of content */}
            {m.parts.map((part, i) => {
              if (part.type === 'text') {
                return <p key={i} className="text-gray-800 whitespace-pre-wrap">{part.text}</p>;
              }
              return null;
            })}
          </div>
        ))}
        {isLoading && <div className="text-gray-400 italic text-sm animate-pulse">Consulting the league archives...</div>}
      </div>

      <form onSubmit={handleSubmit} className="fixed top-35 w-full max-w-2xl p-4 bg-grey backdrop-blur-md">
        <input
          className="w-full p-4 border border-gray-300 rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          value={input}
          placeholder="Ask about interesting facts/data from our league..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}