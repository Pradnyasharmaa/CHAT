import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { SmilePlus, Brush, Image, Search, Phone, Video, Eraser, Gamepad, Bot, Wand2, X as XIcon,Plus, Minus, ZoomIn,ZoomOut,RotateCw,ArrowLeft} 
from 'lucide-react';
import { io } from 'socket.io-client';
import WelcomeScreen from './componenets/WelcomeScreen';
import EnhancedMessage from './componenets/EnhancedMessage';
import AiBotButton from './componenets/AiBotButton';
import AIBot from './utils/aiBot';
import { GiphyFetch } from '@giphy/js-fetch-api';
import CameraWithFilters from './componenets/CameraWithFilters';



const App = () => {
  // Screen management state
  const [currentScreen, setCurrentScreen] = useState('welcome'); // Always start with welcome

  // User and chat states
  const [isProcessing, setIsProcessing] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isAiBotActive, setIsAiBotActive] = useState(true);
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifs, setGifs] = useState([]);
  const [gifSearchQuery, setGifSearchQuery] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const workspaceRef = useRef(null);


  const socket = io('http://localhost:4000', {
    transports: ['websocket', 'polling'], // Specify the transports to use
});


  // Drawing states
  const [drawingMode, setDrawingMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawings, setDrawings] = useState([]);
  const [currentDrawing, setCurrentDrawing] = useState([]);
  const [color, setColor] = useState('#3498db');
  const [brushSize, setBrushSize] = useState(5);
  const [showCamera, setShowCamera] = useState(false); // New state

  // Mock chats data
  const mockChats = [
    { 
      id: 1, 
      name: 'John Doe', 
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=john', 
      lastMessage: '',
      status: 'online',
      timestamp: '2:30 PM',
      unread: 2
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=jane', 
      lastMessage: '',
      status: 'offline',
      timestamp: '1:45 PM',
      unread: 0
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=mike', 
      lastMessage: '',
      status: 'online',
      timestamp: '12:15 PM',
      unread: 1
    },
  ];
  
  // Canvas refs
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  useEffect(() => {
    socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
    });

    return () => {
        socket.off('connect');
    };
}, []);

  // Tenor API key
  const tenorApiKey = 'AIzaSyCgyGePR_41zoea0qw4MWXf3fazfaEGUGw'; // Replace with your actual Tenor API key
    // Message Element Component with drag, rotate, and zoom
    const MessageElement = ({ message }) => {
      const [rotation, setRotation] = useState(message.rotation || 0);
      const [scale, setScale] = useState(message.scale || 1);
      const [position, setPosition] = useState(message.position || { x: 0, y: 0 });
      const [isDragging, setIsDragging] = useState(false);
  
      const handleDrag = (e, data) => {
        setPosition({ x: data.x, y: data.y });
        updateMessagePosition(message.id, { x: data.x, y: data.y });
      };
      const handleRotate = () => {
        const newRotation = rotation + 45;
        setRotation(newRotation);
        updateMessageRotation(message.id, newRotation);
      };

      const handleZoomIn = () => {
        const newScaleIn = scale + 0.1;
        setScale(newScaleIn);
        updateMessageScale(message.id, newScaleIn);
      };

      const handleZoomOut = () => {
        const newScaleOut = Math.max(0.5, scale - 0.1);
        setScale(newScaleOut);
        updateMessageScale(message.id, newScaleOut);
      };

      const handleKeyDown = (e) => {
        switch (e.key) {
          case 'ArrowUp':
            setPosition((prev) => ({ x: prev.x, y: prev.y - 10 }));
            updateMessagePosition(message.id, { x: position.x, y: position.y - 10 });
            break;
          case 'ArrowDown':
            setPosition((prev) => ({ x: prev.x, y: prev.y + 10 }));
            updateMessagePosition(message.id, { x: position.x, y: position.y + 10 });
            break;
          case 'ArrowLeft':
            setPosition((prev) => ({ x: prev.x - 10, y: prev.y }));
            updateMessagePosition(message.id, { x: position.x - 10, y: position.y });
            break;
          case 'ArrowRight':
            setPosition((prev) => ({ x: prev.x + 10, y: prev.y }));
            updateMessagePosition(message.id, { x: position.x + 10, y: position.y });
            break;
          case '+':
            const newScaleIn = scale + 0.1;
            setScale(newScaleIn);
            updateMessageScale(message.id, newScaleIn);
            break;
            case '-':
            const newScaleOut = Math.max(0.5, scale - 0.1);
            setScale(newScaleOut);
            updateMessageScale(message.id, newScaleOut);
            break;
          case 'r':
            const newRotation = rotation + 45;
            setRotation(newRotation);
            updateMessageRotation(message.id, newRotation);
            break;
          default:
            break;
        }
      };
      useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, [position, scale, rotation]);
      return (
        <Draggable
          position={position}
          onStart={() => setIsDragging(true)}
          onDrag={handleDrag}
          onStop={() => setIsDragging(false)}
        >
          <div
            className={`absolute cursor-move ${
              selectedMessageId === message.id ? 'ring-2 ring-purple-500' : ''
            }`}
            style={{
              transform: `rotate(${rotation}deg) scale(${scale})`,
              zIndex: selectedMessageId === message.id ? 10 : 1,
            }}
            onClick={() => setSelectedMessageId(message.id)}
          >
            <div className="relative group">
            {message.content.gifUrl ? ( // Check if the message has a GIF URL
                <img src={message.content.gifUrl} alt="GIF" className="w-32 h-auto" /> // Render the GIF
              ) : (
              <EnhancedMessage message={message.content} />
              )}
              
              {selectedMessageId === message.id && (
                <div className="absolute -top-10 left-0 flex gap-1 bg-gray-800/90 rounded-lg p-1">
                  <button
                    onClick={handleRotate}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <RotateCw size={16} className="text-white" />
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <ZoomIn size={16} className="text-white" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <ZoomOut size={16} className="text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </Draggable>
      );
    };
  
    // Message position update functions
    const updateMessagePosition = (id, position) => {
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, position } : msg
      ));
    };
  
    const updateMessageRotation = (id, rotation) => {
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, rotation } : msg
      ));
    };
  
    const updateMessageScale = (id, scale) => {
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, scale } : msg
      ));
    };

  // Handle welcome screen completion
  const handleWelcomeComplete = (userData) => {
    setUser(userData);
    setCurrentScreen('chatlist');
  };

  // Message handling
  const handleSendMessage = () => {
    if (text.trim()) {
      const newMessage = {
        id: Date.now(),
        type: 'enhanced',
        content: isAiBotActive 
          ? AIBot.enhanceMessage(text)
          : {
              text: text,
              color: '#ffffff',
              animation: 'fadeIn'
            },
        position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
        rotation: 0,
        scale: 1,
      };

      // Emit the message to the server
      socket.emit('sendMessage', newMessage);

      // Optionally, add the message to the local state to display it immediately
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Clear the input field and reset other states
      setText('');
      setShowEmojiPicker(false);
      setShowGifPicker(false);
    }
  };

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      console.log('Message received from server:', message); 
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  // GIF handling
  const fetchGifs = async (query) => {
    if (!query) return;
    try {
      const response = await fetch(
        `https://tenor.googleapis.com/v2/search?q=${query}&key=${tenorApiKey}&client_key=peepy_chat&limit=12`
      );
  
      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setGifs(data.results || []);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    }
  };

  const handleGifSelect = (gifUrl) => {
    const newMessage = {
      id: Date.now(),
      type: 'enhanced',
      content: {
        text: '',
        gifUrl: gifUrl,
        color: '#ffffff',
        animation: 'fadeIn'
      },
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
      rotation: 0,
      scale: 1,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setShowGifPicker(false);
  };

  // Drawing functions
  const startDrawing = (e) => {
    if (!drawingMode || !ctxRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentDrawing([{ x, y }]);

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || !drawingMode || !ctxRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentDrawing((prev) => [...prev, { x, y }]);

    ctxRef.current.lineTo(x, y);
    ctxRef.current.strokeStyle = color; // Use selected color
    ctxRef.current.lineWidth = brushSize; // Use selected brush size
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && currentDrawing.length > 0) {
      setDrawings((prev) => [...prev, {
        points: currentDrawing,
        color,
        brushSize
      }]);
    }
    setIsDrawing(false);
    setCurrentDrawing([]);
  };

  // Effects
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctxRef.current = ctx;
    }
  }, [color, brushSize]);

  // Screen rendering
  if (currentScreen === 'welcome') {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  if (currentScreen === 'chatlist') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="flex h-screen">
          {/* Left Side - Chat List (35% width) */}
          <div className="w-[35%] bg-gray-800/50 backdrop-blur-md">
            <div className="p-4 bg-gray-900/50">
              <div className="flex items-center gap-3">
                <img 
                  src={user?.avatar} 
                  alt="profile" 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-white font-semibold">{user?.username}</h3>
                  <p className="text-green-400 text-sm">Online</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700/50 text-white rounded-lg pl-10 pr-4 py-2"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* Chat List */}
            <div className="overflow-y-auto h-[calc(100vh-160px)]">
              {mockChats
                .filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setSelectedChat(chat);
                      setCurrentScreen('chat');
                    }}
                    className="p-4 cursor-pointer hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={chat.avatar} 
                          alt={chat.name} 
                          className="w-12 h-12 rounded-full"
                        />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800
                          ${chat.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-white font-semibold">{chat.name}</h3>
                          <span className="text-gray-400 text-xs">{chat.timestamp}</span>
                        </div>
                        <p className="text-gray-400 text-sm truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unread > 0 && (
                        <div className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Right Side - Robot Animation (65% width) */}
          <div className="w-[65%] flex flex-col items-center justify-center p-8 bg-gray-800/30">
            <div className="relative w-full max-w-2xl">
              <img 
                src="/robot.gif" 
                alt="AI Chat Bot"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
            <div className="mt-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Welcome to AI Chat</h2>
              <div className="space-y-3 text-xl">
                <p>🎮 Play Interactive Games</p>
                <p>🎨 Draw and Create</p>
                <p>🤖 Enhanced Messages</p>
                <p>✨ Special Effects</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main chat screen
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Sidebar */}
      <div className="w-[300px] bg-gray-800/50 backdrop-blur-md h-full flex flex-col border-r border-white/10">
        <div className="p-4 bg-gray-900/50">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentScreen('chatlist')}
              className="text-white hover:text-purple-400"
            >
              <ArrowLeft size={24} />
            </button>
            <img 
              src={selectedChat?.avatar} 
              alt={selectedChat?.name} 
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="text-white font-semibold">{selectedChat?.name}</h3>
              <p className="text-green-400 text-sm">
                {selectedChat?.status === 'online' ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>

        {/* Call Actions */}
        <div className="p-4 flex justify-end gap-2 border-b border-white/10">
          <button className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-white">
            <Phone size={20} />
          </button>
          <button className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-white">
            <Video size={20} />
          </button>
        </div>

        {/* Mini Chat List */}
        <div className="flex-1 overflow-y-auto">
          {mockChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 cursor-pointer hover:bg-white/5 ${
                selectedChat?.id === chat.id ? 'bg-white/10' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={chat.avatar} 
                    alt={chat.name} 
                    className="w-10 h-10 rounded-full"
                  />
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-gray-800
                    ${chat.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm">{chat.name}</h3>
                  <p className="text-gray-400 text-xs truncate">{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 relative">
        {/* Messages Area */}
        <div className="h-[calc(100vh-144px)] overflow-hidden relative">
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 ${drawingMode ? 'cursor-crosshair' : ''}`}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.content.text.startsWith('AI:') ? 'AI' : 'User'}:</strong> {msg.content.text}
        </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-4 left-4 right-4">
          {isAiBotActive && (
            <div className="mb-2 text-purple-300 text-sm flex items-center gap-2 animate-pulse">
              <Bot size={14} />
              <span>AI Enhancement Active</span>
            </div>
          )}
          {/* Brush Size and Color Selection */}
          <div className="flex gap-2 mb-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="p-1 rounded"
            />
            <input
              type="number"
              value={brushSize}
              onChange={(e) => setBrushSize(Math.max(1, e.target.value))}
              className="w-16 p-1 rounded"
              min="1"
            />
          </div>

          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="w-full bg-gray-800/50 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Type a message..."
              />
              
              <button onClick={handleSendMessage}>Send</button>
              
              <AiBotButton 
                isActive={isAiBotActive} 
                onClick={() => setIsAiBotActive(!isAiBotActive)}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-3 bg-purple-500/20 rounded-lg hover:bg-purple-500/30"
              >
                <SmilePlus className="text-white" size={20} />
              </button>

              <button
                onClick={() => setShowGifPicker(!showGifPicker)}
                className="p-3 bg-purple-500/20 rounded-lg hover:bg-purple-500/30"
              >
                <Image className="text-white" size={20} />
              </button>
              
              <button
                onClick={() => setDrawingMode(!drawingMode)}
                className={`p-3 rounded-lg ${
                  drawingMode ? 'bg-purple-500' : 'bg-purple-500/20 hover:bg-purple-500/30'
                }`}
              >
                <Brush className="text-white" size={20} />
              </button>
            </div>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-16 right-4 bg-gray-800/90 backdrop-blur-md p-4 rounded-lg">
              <div className="grid grid-cols-5 gap-2">
                {Object.values(AIBot.emojiSets).flat().map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setText(text + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-2xl hover:bg-white/10 p-2 rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GIF Picker */}
          {showGifPicker && (
            <div className="absolute bottom-16 right-4 bg-gray-800/90 backdrop-blur-md p-4 rounded-lg w-72">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-semibold">Select a GIF</h3>
                <button onClick={() => setShowGifPicker(false)} className="text-gray-400 hover:text-white">
                  <XIcon size={18} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Search GIFs..."
                value={gifSearchQuery}
                onChange={(e) => {
                  setGifSearchQuery(e.target.value);
                  fetchGifs(e.target.value);
                }}
                className="w-full bg-gray-700/50 text-white rounded-lg px-3 py-2 mb-3"
              />
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {gifs.map((gif) => (
                  <img
                    key={gif.id}
                    src={gif.media_formats.tinygif.url}
                    alt={gif.content_description}
                    className="w-full h-auto rounded cursor-pointer hover:opacity-80"
                    onClick={() => handleGifSelect(gif.media_formats.gif.url)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;