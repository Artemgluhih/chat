const express = require('express');
const path = require('path');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const apiRoutes = require('./router');
const http = require('http');
const socketIo = require('socket.io');
const router = require('./api');

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];



app.use(router);


app.use(express.json());

app.use(cors({
    origin: function (origin, callback) {

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
}));

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST']
    }
});



io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sendMessage', (message) => {
        if (!message.sender) {
            message.sender = 'client';
        }

        if (message.isSupport) {  
            message.sender = 'support';
        }
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});




app.use('/images', express.static(path.join(__dirname, '/images')));


app.use(apiRoutes);


server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
