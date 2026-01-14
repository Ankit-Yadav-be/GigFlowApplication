import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";
import api from "../api/axios"; 

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Function to fetch offline/persistent notifications from DB
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const { data } = await api.get("/notifications"); 
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    }
  };

  useEffect(() => {
    if (!user) return;

    //  Fetch offline notifications on mount
    fetchNotifications();

    //  Initialize socket connection
    const newSocket = io("https://gig-flow-application.vercel.app", {
      path: "/socket.io",
      transports: ["polling", "websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    //  On socket connect
    newSocket.on("connect", () => {
      console.log(" Socket connected (frontend):", newSocket.id);
      if (user?.id) newSocket.emit("join", user.id);
    });

    //  On socket reconnect
    newSocket.on("reconnect", () => {
      console.log(" Socket reconnected (frontend):", newSocket.id);
      if (user?.id) newSocket.emit("join", user.id);
    });

    //  Receive realtime notifications
    newSocket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    //  Disconnect & error handling
    newSocket.on("disconnect", () => {
      console.log(" Socket disconnected (frontend)");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error (frontend):", err.message);
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user]);

  // Mark notification as read (local state update + optional API call)
  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    try {
      await api.patch(`/notifications/${id}/read`); 
    } catch (error) {
      console.error("Failed to mark notification as read:", error.message);
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket, notifications, setNotifications, markAsRead }}
    >
      {children}
    </SocketContext.Provider>
  );
};
