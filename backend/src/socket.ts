import { Server as IOServer } from 'socket.io';
import http from 'http';

let io: IOServer | null = null;

export function initSocket(server: http.Server) {
  if (io) return io;

  io = new IOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  return io;
}

export function getIo() {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}
