import React from 'react';
import { Bot, Wand2 } from 'lucide-react';

const AiBotButton = ({ isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-2
        ${isActive 
          ? 'bg-purple-500 text-white' 
          : 'bg-purple-500/20 text-white hover:bg-purple-500/30'
        }`}
      title="AI Enhancement"
    >
      <Bot size={20} />
      {isActive && <Wand2 size={16} className="animate-bounce" />}
    </button>
  );
};

export default AiBotButton;