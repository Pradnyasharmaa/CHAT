const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3001', // Allow requests from your React app
    methods: ['GET', 'POST'], // Allow specific methods
    credentials: true // Allow credentials if needed
}));
const tenorApiKey = 'AIzaSyCgyGePR_41zoea0qw4MWXf3fazfaEGUGw'; // Replace with your actual Tenor API key

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Store conversation history for each user
const conversationHistory = new Map();

// Middleware to handle JSON requests
app.use(express.json());

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Initialize conversation history for new user
    conversationHistory.set(socket.id, []);

    socket.on('sendMessage', async (message) => {
        console.log('Message received:', message);
        io.emit('receiveMessage', message);

        try {
            // Get user's conversation history
            const history = conversationHistory.get(socket.id) || [];
            
            // Add user's message to history
            history.push({ 
                role: "user", 
                content: message.content.text 
            });

            // Prepare messages for OpenAI
            const messages = [
                { 
                    role: "system", 
                    content: "You are John, a friendly person chatting casually. Respond naturally like a human would, using casual language and occasional emojis. Keep responses short and conversational. Don't introduce yourself as an AI." 
                },
                ...history
            ];

            // Call OpenAI API for a response using GPT-4
            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: messages,
                max_tokens: 100,
                temperature: 0.9,
                presence_penalty: 0.6,
                frequency_penalty: 0.5
            });

            const aiResponse = response.choices[0].message.content.trim();
            
            // Add AI response to history
            history.push({ 
                role: "assistant", 
                content: aiResponse 
            });

            // Keep only last 10 messages to manage context window
            if (history.length > 10) {
                history.splice(0, 2);
            }

            // Save updated history
            conversationHistory.set(socket.id, history);

            const aiMessage = {
                id: Date.now(),
                content: { text: `John: ${aiResponse}` },
            };

            // Emit typing indicator
            socket.emit('typingStart');
            
            // Add a realistic typing delay
            setTimeout(() => {
                // Emit the AI response back to all clients
                io.emit('receiveMessage', aiMessage);
                socket.emit('typingEnd');
            }, Math.min(aiResponse.length * 50, 2000)); // Delay based on message length, max 2 seconds

        } catch (error) {
            console.error('Error calling OpenAI:', error);
            socket.emit('receiveMessage', {
                id: Date.now(),
                content: { text: 'Error generating response' },
            });
        }
    });
    socket.on('fetchGifs', async (query) => {
        try {
            const response = await axios.get(`https://tenor.googleapis.com/v2/search`, {
                params: {
                    q: query,
                    key: tenorApiKey,
                    limit: 12,
                },
            });
            socket.emit('gifsFetched', response.data.results); // Emit the fetched GIFs back to the client
        } catch (error) {
            console.error('Error fetching GIFs:', error);
            socket.emit('gifsFetched', []); // Emit an empty array on error
        }
    });

    socket.on('disconnect', () => {
        // Clean up conversation history when user disconnects
        conversationHistory.delete(socket.id);
        console.log('Client disconnected:', socket.id);
    });
});


// Start the server on port 4000
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
