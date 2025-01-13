import React from 'react';

const EmojiPicker = ({ setElements }) => {
  const emojis = ['😊', '😂', '😍', '👍', '🎉'];

  return (
    <div className="absolute bottom-16 left-4 bg-gray-800 text-white p-4 rounded shadow-lg">
      <div className="flex space-x-4">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => setElements((prev) => [...prev, { type: 'emoji', content: emoji }])}
            className="text-2xl"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;

