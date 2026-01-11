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

    // Connect socket
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    // Join room = user.id
    newSocket.emit("join", user.id);

    // Listen for notifications
    newSocket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]); 
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
