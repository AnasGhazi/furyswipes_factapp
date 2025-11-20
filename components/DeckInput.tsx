import React, { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';

interface DeckInputProps {
  onGenerate: (topic: string) => void;
  isLoading: boolean;
}

export const DeckInput: React.FC<DeckInputProps> = ({ onGenerate, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onGenerate(input.trim());
    }
  };

  return (
    <div className="w-full max-w-sm mb-6 relative z-50">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-gray-800 rounded-full p-1 shadow-xl border border-gray-700">
          <Search className="text-gray-400 ml-3" size={20} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Topic (e.g., Space, Cats, 90s Music)"
            className="flex-1 bg-transparent border-none outline-none text-white px-3 py-2 placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-2 pl-4 pr-4 flex items-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <span>Go</span>
                <Sparkles size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
