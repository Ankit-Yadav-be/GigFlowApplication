import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    path: "/socket.io",
    cors: {
      origin: [
        "https://gig-flow-application-kw51.vercel.app",
        "http://localhost:5173",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["polling", "websocket"], 
  });

  io.on("connection", (socket) => {
    console.log(" New socket connected:", socket.id);

    // join user-specific room
    socket.on("join", (userId) => {
      if (!userId) return;
      socket.join(userId);
      console.log(` User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
      console.log(" Socket disconnected:", socket.id);
    });
  });

  
  io.engine.on("connection_error", (err) => {
    console.error("Socket connection error:", err.message);
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
