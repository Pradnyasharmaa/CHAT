import React from 'react';
import AIBot from '../utils/aiBot';

const EnhancedMessage = ({ message, style }) => {
  // Create style tag for animations
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    const animations = Object.values(AIBot.animations)
      .map(anim => anim.keyframes)
      .join('\n');
    styleSheet.textContent = animations;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  const messageStyle = {
    ...style,
    color: message.color,
    animation: AIBot.animations[message.animation].animation,
  };

  return (
    <div 
      className="enhanced-message"
      style={messageStyle}
    >
      {message.text}
    </div>
  );
};

export default EnhancedMessage;