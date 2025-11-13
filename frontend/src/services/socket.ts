import { io, Socket } from "socket.io-client";

const SOCKET_URL = (import.meta as any).env?.VITE_API_URL
  ? ((import.meta as any).env.VITE_API_URL as string).replace(/\/api\/?$/, "")
  : "http://localhost:5000";

let socket: Socket | null = null;

export function initSocket() {
  if (socket) return socket;
  socket = io(SOCKET_URL, {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Connected to socket server", socket?.id);
  });

  socket.on("connect_error", (err: any) => {
    console.warn("Socket connect error", err);
  });

  return socket;
}

export default function getSocket() {
  return socket ?? initSocket();
}
