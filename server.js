import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
GoogleStrategy.Strategy;
import session from 'express-session';
import userRoutes from './routes/userRoutes.js';
import friendRoutes from './routes/friendRoute.js';
import googleAuthRoute from './routes/googleAuthRoute.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import User from './model/userModel.js';
import configureGoogleStrategy from './config/googleAuth.js';
import http from 'http'; // Add this import
import { Server } from 'socket.io'; // Add this import

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();
const app = express();
const server = http.createServer(app); // Create a server instance
const io = new Server(server, { cors: { origin: '*' } }); // Create a Socket.IO server

if (process.env.NODE_ENV === 'development') {
  const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
  app.use(cors(corsOptions));
} else {
  const corsOptions = {
    origin: 'https://see-megrp7.vercel.app',
    // origin: 'http://localhost:3000',
    credentials: true,
  };
  app.use(cors(corsOptions));
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configureGoogleStrategy();

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userRoutes);
app.use('/auth/google', googleAuthRoute);
app.use('/api/friends', friendRoutes);

app.use(notFound);
app.use(errorHandler);

// Socket.IO signaling logic
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('signal', (data) => {
    const { roomId, signalData } = data;
    socket.to(roomId).emit('signal', signalData);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => console.log(`server started on ${port}`));
