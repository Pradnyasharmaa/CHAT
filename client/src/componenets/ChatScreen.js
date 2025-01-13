import React, { useState, useRef, useEffect } from 'react';
import DrawingControls from './DrawingControls';
import EmojiPicker from './EmojiPicker';
import GiphyPicker from './GiphyPicker';
import Element from './Element';

const ChatScreen = () => {
  const [elements, setElements] = useState([]);
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGiphyPicker, setShowGiphyPicker] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#3498db');
  const [brushSize, setBrushSize] = useState(5);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctxRef.current = ctx;
    }
  }, [color, brushSize]);


  return (
    <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-black overflow-hidden">
      {drawingMode && (
        <DrawingControls
          color={color}
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
        />
      )}

      <canvas
        ref={canvasRef}
        className={`absolute top-0 left-0 ${drawingMode ? 'cursor-crosshair' : ''}`}
        onMouseDown={(e) => {
          if (!drawingMode || !ctxRef.current) return;
          const rect = canvasRef.current.getBoundingClientRect();
          ctxRef.current.beginPath();
          ctxRef.current.moveTo(e.clientX - rect.left, e.clientY - rect.top);
          setIsDrawing(true);
        }}
        onMouseMove={(e) => {
          if (!isDrawing || !drawingMode || !ctxRef.current) return;
          const rect = canvasRef.current.getBoundingClientRect();
          ctxRef.current.lineTo(e.clientX - rect.left, e.clientY - rect.top);
          ctxRef.current.stroke();
        }}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
      />

      <div className="fixed bottom-4 left-4 right-4 flex gap-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-gray-800 text-white rounded px-4 py-2"
          placeholder="Type a message..."
        />
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 bg-gray-800 rounded hover:bg-gray-700"
        >
          😊
        </button>
        <button
          onClick={() => setShowGiphyPicker(!showGiphyPicker)}
          className="p-2 bg-gray-800 rounded hover:bg-gray-700"
        >
          GIF
        </button>
        <button
          onClick={() => setDrawingMode(!drawingMode)}
          className={`p-2 rounded ${drawingMode ? 'bg-blue-500' : 'bg-gray-600'}`}
        >
          🖌️
        </button>
        <button
          onClick={handleSend}
          className="p-2 bg-green-600 text-white rounded hover:bg-green-500"
        >
          Send
        </button>
      </div>

      {showEmojiPicker && <EmojiPicker setElements={setElements} />}
      {showGiphyPicker && <GiphyPicker setElements={setElements} />}

      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto p-4">
        {elements.map((element, index) => (
          <Element key={index} element={element} />
        ))}
      </div>
    </div>
  );
};

export default ChatScreen;
