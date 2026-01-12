import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const newSocket = io("https://gigflowapplication.onrender.com", {
      path: "/socket.io",
      transports: ["polling", "websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("🟢 Socket connected (frontend):", newSocket.id);
      if (user?.id) newSocket.emit("join", user.id);
    });

    newSocket.on("reconnect", () => {
      console.log("♻️ Socket reconnected (frontend):", newSocket.id);
      if (user?.id) newSocket.emit("join", user.id);
    });

    newSocket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    newSocket.on("disconnect", () => {
      console.log("🔴 Socket disconnected (frontend)");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error (frontend):", err.message);
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <SocketContext.Provider
      value={{ socket, notifications, setNotifications, markAsRead }}
    >
      {children}
    </SocketContext.Provider>
  );
};
