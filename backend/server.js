const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import CORS
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

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Middleware to handle JSON requests
app.use(express.json());

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', async (message) => {
        console.log('Message received:', message);
        io.emit('receiveMessage', message);

        // Call OpenAI API for a response using GPT-4
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: message.content.text }],
                max_tokens: 100,
            });

            const aiMessage = {
                id: Date.now(),
                content: { text: `John Doe: ${response.choices[0].message.content.trim()}` },
            };

            // Emit the AI response back to the client
            io.emit('receiveMessage', aiMessage); // Change this line to broadcast to all clients
        } catch (error) {
            console.error('Error calling OpenAI:', error);
            socket.emit('receiveMessage', {
                id: Date.now(),
                content: { text: 'Error generating response' },
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server on port 4000
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});