const AIBot = {
  // Emoji sets for different moods
  emojiSets: {
    happy: ['😊', '😃', '😄', '🌟', '✨', '💫', '🎉'],
    love: ['❤️', '💖', '💝', '😍', '🥰', '💕', '💗'],
    sad: ['😢', '😔', '💔', '🥺', '😞', '🌧️'],
    excited: ['🎈', '🎊', '🎉', '🎸', '🎵', '🚀', '⭐'],
    funny: ['😂', '🤣', '😅', '😆', '😝', '🤪'],
    cool: ['😎', '🤙', '👊', '💫', '✨', '🔥'],
  },

  // Fun phrases to add randomly
  funPhrases: [
    "Boom! ",
    "Oh snap! ",
    "Wowza! ",
    "Holy moly! ",
    "Bazinga! ",
    "Yeet! ",
    "Epic! ",
    "Legendary! ",
  ],

  // Text animations
  animations: {
    bounce: {
      animation: 'bounce 0.5s',
      keyframes: `@keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }`
    },
    shake: {
      animation: 'shake 0.5s',
      keyframes: `@keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }`
    },
    pop: {
      animation: 'pop 0.3s',
      keyframes: `@keyframes pop {
        0% { transform: scale(0); }
        100% { transform: scale(1); }
      }`
    },
    fadeIn: {
      animation: 'fadeIn 0.5s',
      keyframes: `@keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }`
    }
  },

  // Colors for messages
  colors: [
    '#FF6B6B', // coral
    '#4ECDC4', // turquoise
    '#45B7D1', // sky blue
    '#96CEB4', // mint
    '#FFEEAD', // cream
    '#D4A5A5', // rose
    '#9B59B6', // purple
    '#3498DB', // blue
  ],

  // Movie game data
  movieGame: {
    movies: [
      {
        title: "The Matrix",
        hint: "Reality is not what it seems. Take the red pill or blue pill?",
        year: 1999,
        difficulty: 1
      },
      {
        title: "Inception",
        hint: "Dreams within dreams, but is it all just a dream?",
        year: 2010,
        difficulty: 2
      },
      {
        title: "Avatar",
        hint: "Blue beings protect their planet from human invasion",
        year: 2009,
        difficulty: 1
      },
      {
        title: "Interstellar",
        hint: "Love transcends space and time in this cosmic journey",
        year: 2014,
        difficulty: 2
      },
      {
        title: "The Lion King",
        hint: "A young prince must reclaim his throne in the animal kingdom",
        year: 1994,
        difficulty: 1
      },
      {
        title: "Jurassic Park",
        hint: "Dinosaurs are brought back to life in a theme park",
        year: 1993,
        difficulty: 1
      }
    ],

    getRandomMovie() {
      return this.movies[Math.floor(Math.random() * this.movies.length)];
    },

    checkGuess(guess, movie) {
      const normalizedGuess = guess.toLowerCase().trim();
      const normalizedTitle = movie.title.toLowerCase();
      return normalizedGuess === normalizedTitle;
    },

    calculateScore(attempts, difficulty) {
      // Base score (50) - (10 * attempts) * difficulty multiplier
      return Math.max((50 - (attempts * 10)) * difficulty, 10);
    },

    getHint(movie, attemptNumber) {
      switch(attemptNumber) {
        case 1:
          return movie.hint;
        case 2:
          return `Additional hint: The movie was released in ${movie.year}`;
        case 3:
          return `Another hint: The first letter is "${movie.title[0]}"`;
        default:
          return "Final hint: The movie has " + movie.title.length + " characters";
      }
    }
  },

  // Game response messages
  gameResponses: {
    start: [
      "🎮 Let's play Guess the Movie!",
      "🎬 Time for a movie challenge!",
      "🎯 Ready for a cinematic puzzle?",
    ],
    correct: [
      "🎉 Brilliant! You got it!",
      "⭐ Amazing guess!",
      "🏆 Perfect! That's correct!",
    ],
    wrong: [
      "❌ Not quite right, try again!",
      "🤔 Close, but not the movie I'm thinking of.",
      "😅 Good guess, but that's not it.",
    ],
    gameOver: [
      "Game Over! The movie was",
      "Better luck next time! It was",
      "Time's up! The correct movie was",
    ]
  },

  // Core functions
  detectMood(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.match(/\b(haha|lol|funny|lmao|rofl)\b/)) return 'funny';
    if (lowerText.match(/\b(love|heart|xoxo|kiss)\b/)) return 'love';
    if (lowerText.match(/\b(sad|cry|tears|sorry|miss)\b/)) return 'sad';
    if (lowerText.match(/\b(wow|omg|awesome|amazing|cool)\b/)) return 'excited';
    if (lowerText.match(/\b(nice|great|super|perfect)\b/)) return 'cool';
    return 'happy';
  },

  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  enhanceMessage(text) {
    const mood = this.detectMood(text);
    const emojis = this.emojiSets[mood];
    const color = this.getRandomItem(this.colors);
    const animation = this.getRandomItem(Object.keys(this.animations));
    
    let enhancedText = text;
    
    // Add 1-3 random emojis
    const numEmojis = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numEmojis; i++) {
      const emoji = this.getRandomItem(emojis);
      if (Math.random() > 0.5) {
        enhancedText = emoji + " " + enhancedText;
      } else {
        enhancedText = enhancedText + " " + emoji;
      }
    }

    // Sometimes add a fun phrase
    if (Math.random() > 0.7) {
      enhancedText = this.getRandomItem(this.funPhrases) + enhancedText;
    }

    return {
      text: enhancedText,
      color: color,
      animation: animation
    };
  },

  generateGameMessage(type, movie, attempts = 0, score = 0) {
    const message = {
      text: '',
      color: this.getRandomItem(this.colors),
      animation: 'bounce'
    };

    switch(type) {
      case 'start':
        message.text = `${this.getRandomItem(this.gameResponses.start)}\n\nHint: ${movie.hint}`;
        break;
      case 'correct':
        message.text = `${this.getRandomItem(this.gameResponses.correct)}\nScore: +${score} points!`;
        message.animation = 'pop';
        break;
      case 'wrong':
        message.text = `${this.getRandomItem(this.gameResponses.wrong)}\n${this.movieGame.getHint(movie, attempts)}\nAttempts left: ${5 - attempts}`;
        message.animation = 'shake';
        break;
      case 'gameOver':
        message.text = `${this.getRandomItem(this.gameResponses.gameOver)} "${movie.title}"`;
        message.color = '#FF6B6B';
        break;
    }

    return message;
  }
};

export default AIBot;