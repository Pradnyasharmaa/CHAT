import React from 'react';

const DrawingControls = ({ color, setColor, brushSize, setBrushSize }) => (
  <div className="absolute top-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg space-y-4">
    <div>
      <label>Brush Color:</label>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="ml-2"
      />
    </div>
    <div>
      <label>Brush Size:</label>
      <input
        type="range"
        min="1"
        max="20"
        value={brushSize}
        onChange={(e) => setBrushSize(e.target.value)}
        className="ml-2"
      />
    </div>
  </div>
);

export default DrawingControls;
