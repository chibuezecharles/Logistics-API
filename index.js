// app.js
const express = require('express');
require('dotenv').config();
require('./dbConnection');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const auth = require('./Routes/users');
const customer = require('./Routes/customers');
const rider = require('./Routes/riders');
const socketio = require('socket.io');

const app = express();
const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

// Socket.io setup
const io = socketio(server);

// Middleware to pass io object to route handlers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Handle socket connections for real-time notifications
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Listen for user authentication and join their own room
    socket.on('authenticate', (userId) => {
        socket.join(userId.toString());
    });

    // Listen for user joining their own room
    socket.on('join', (userId) => {
        socket.join(userId.toString());
    });

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

// Routes
app.use('/api/auth', auth);
app.use('/api/customer', customer);
app.use('/api/rider', rider);




module.exports = app;
