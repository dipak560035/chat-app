require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Stack trace:', err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', async ({ username }) => {
    console.log(`${username} joined`);
    socket.broadcast.emit('userJoined', { username, message: `${username} has joined the chat` });
    
    // Send total users count to everyone
    const totalUsers = await User.countDocuments();
    io.emit('statsUpdate', { totalUsers });
  });

  socket.on('sendMessage', async (data) => {
    const { sender, text, username } = data;
    
    try {
      const newMessage = new Message({
        sender,
        text,
        username
      });
      await newMessage.save();

      // Emit to all users
      io.emit('message', newMessage);

      // Emit total message count
      const totalMessages = await Message.countDocuments();
      io.emit('statsUpdate', { totalMessages });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
//server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
































// require('dotenv').config();
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// const messageRoutes = require('./routes/messages');

// const Message = require('./models/Message');
// const User = require('./models/User');

// const app = express();

// const server = http.createServer(app);

// // const FRONTEND_URL =
// //   process.env.FRONTEND_URL ||
// //   'https://chat-app-five-blue-45.vercel.app/';

// const FRONTEND_URL =
//   process.env.FRONTEND_URL ||
//   (process.env.NODE_ENV === 'production'
//     ? 'https://chat-app-five-blue-45.vercel.app'
//     : 'http://localhost:5173');

// // Socket.io
// const io = new Server(server, {
//   cors: {
//     origin: FRONTEND_URL,
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// // Middleware
// app.use(
//   cors({
//     origin: FRONTEND_URL,
//     credentials: true,
//   })
// );

// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/messages', messageRoutes);

// // Health route
// app.get('/', (req, res) => {
//   res.send('Backend server running...');
// });

// // Error Handler Middleware
// app.use((err, req, res, next) => {
//   console.error('Stack trace:', err.stack);

//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

//   res.status(statusCode).json({
//     message: err.message,
//     stack: process.env.NODE_ENV === 'production'
//       ? null
//       : err.stack,
//   });
// });

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('MongoDB Connected');
//   })
//   .catch((err) => {
//     console.log('MongoDB Connection Error:', err);
//   });

// // Socket.io Logic
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   // User Join
//   socket.on('join', async ({ username }) => {
//     console.log(`${username} joined`);

//     socket.broadcast.emit('userJoined', {
//       username,
//       message: `${username} has joined the chat`,
//     });

//     try {
//       const totalUsers = await User.countDocuments();

//       io.emit('statsUpdate', {
//         totalUsers,
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   });

//   // Send Message
//   socket.on('sendMessage', async (data) => {
//     const { sender, text, username } = data;

//     try {
//       const newMessage = new Message({
//         sender,
//         text,
//         username,
//       });

//       await newMessage.save();

//       // Send message to all users
//       io.emit('message', newMessage);

//       // Update stats
//       const totalMessages =
//         await Message.countDocuments();

//       io.emit('statsUpdate', {
//         totalMessages,
//       });
//     } catch (error) {
//       console.error('Error saving message:', error);
//     }
//   });

//   // Disconnect
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// // Server Start
// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });