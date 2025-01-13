import React, { useState } from 'react';

const WelcomeScreen = ({ onComplete }) => {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const avatars = [
    { id: 1, url: 'https://api.dicebear.com/6.x/avataaars/svg?seed=1' },
    { id: 2, url: 'https://api.dicebear.com/6.x/avataaars/svg?seed=2' },
    { id: 3, url: 'https://api.dicebear.com/6.x/avataaars/svg?seed=3' },
    { id: 4, url: 'https://api.dicebear.com/6.x/avataaars/svg?seed=4' },
  ];

  const handleSubmit = () => {
    if (username.trim() && selectedAvatar) {
      onComplete({
        username: username.trim(),
        avatar: selectedAvatar.url
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex">
      {/* Left Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-lg w-full max-w-md">
          <h1 className="text-4xl font-bold text-white text-center mb-8">
            Welcome to Peepy Chat
          </h1>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar)}
                className={`cursor-pointer rounded-lg p-2 transition-all duration-200 
                  ${selectedAvatar?.id === avatar.id 
                    ? 'bg-purple-500 ring-2 ring-purple-300' 
                    : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                <img
                  src={avatar.url}
                  alt={`Avatar ${avatar.id}`}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            ))}
          </div>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 mb-6
              focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={handleSubmit}
            disabled={!username.trim() || !selectedAvatar}
            className="w-full bg-purple-500 text-white rounded-lg py-3 font-semibold
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:bg-purple-600 transition-colors"
          >
            Start Chatting
          </button>
        </div>
      </div>

      {/* Right Side - Robot Animation */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-gray-800/30">
        <div className="relative w-full max-w-md">
          <img 
            src="/robot.gif" 
            alt="AI Chat Bot"
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        </div>
        <div className="mt-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Powered by AI</h2>
          <div className="space-y-2 text-lg">
            <p>🎮 Play Interactive Games</p>
            <p>🎨 Draw and Create</p>
            <p>🤖 Enhanced Messages</p>
            <p>✨ Special Effects</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;