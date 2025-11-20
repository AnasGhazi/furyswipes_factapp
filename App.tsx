import React, { useState, useEffect } from 'react';
import { DeckInput } from './components/DeckInput';
import { FlashCard } from './components/FlashCard';
import { generateDeck } from './services/geminiService';
import { FunFactCard } from './types';
import { Layers, RotateCw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [cards, setCards] = useState<FunFactCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [swipedCards, setSwipedCards] = useState<FunFactCard[]>([]);

  // Initial load suggestion
  useEffect(() => {
    // Optional: Load a default deck on start, or just leave empty for user input
    // handleGenerateDeck("Outer Space");
  }, []);

  const handleGenerateDeck = async (topic: string) => {
    setLoading(true);
    setError(null);
    setSwipedCards([]);
    try {
      const newCards = await generateDeck(topic);
      setCards(newCards);
    } catch (err) {
      setError("Couldn't generate facts. Check your connection or API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (cards.length === 0) return;

    // Remove top card
    const currentCard = cards[0];
    const remainingCards = cards.slice(1);
    
    setCards(remainingCards);
    setSwipedCards([...swipedCards, currentCard]);
  };

  const handleReset = () => {
    setCards([...swipedCards, ...cards]); // Simple reset logic, better to re-fetch or just shuffle
    setSwipedCards([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      {/* Header */}
      <div className="w-full max-w-sm flex items-center justify-between mb-8 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Layers className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">SwipeFacts</h1>
        </div>
        {swipedCards.length > 0 && cards.length === 0 && (
           <button 
             onClick={handleReset}
             className="text-gray-400 hover:text-white transition-colors"
             title="Restart Deck"
           >
             <RotateCw size={24} />
           </button>
        )}
      </div>

      {/* Input Area */}
      <DeckInput onGenerate={handleGenerateDeck} isLoading={loading} />

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg mb-4 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Card Stack Area */}
      <div className="relative w-full max-w-sm h-[65vh] flex items-center justify-center z-0">
        <AnimatePresence>
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <FlashCard
                key={card.id}
                card={card}
                index={index}
                isTop={index === 0}
                onSwipe={handleSwipe}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 space-y-4 text-center px-8">
              {!loading && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                   <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center mb-4 mx-auto border border-gray-700 border-dashed">
                      <Layers size={32} className="opacity-50" />
                   </div>
                   <p className="text-lg font-medium">No cards yet</p>
                   <p className="text-sm opacity-70">Enter a topic above to generate a deck of fun facts!</p>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats / Footer */}
      <div className="mt-8 text-gray-500 text-sm font-medium">
        {loading ? (
          <span className="animate-pulse text-indigo-400">AI is thinking...</span>
        ) : cards.length > 0 ? (
          <span>{cards.length} cards remaining</span>
        ) : (
           <span>Powered by Gemini</span>
        )}
      </div>
    </div>
  );
};

export default App;
