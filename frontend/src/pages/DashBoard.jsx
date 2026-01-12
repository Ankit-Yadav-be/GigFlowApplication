import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import GigCard from "../componnets/GigCard";
import { SocketContext } from "../context/SocketContext";
import { FiBell, FiSearch, FiLogOut, FiPlus } from "react-icons/fi";

const Dashboard = () => {
  const [gigs, setGigs] = useState([]);
  const [filter, setFilter] = useState("all"); 
  const [search, setSearch] = useState("");
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const { socket, notifications, setNotifications, markAsRead } = useContext(SocketContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Fetch gigs
  const fetchGigs = async () => {
    try {
      const { data } = await api.get(`/gigs?search=${search}`);
      setGigs(data);
    } catch (error) {
      console.error("Error fetching gigs:", error);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, [search]);

  // Handle incoming realtime notifications
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (n) => {
      setNotifications((prev) => [n, ...prev]);
    };

    socket.on("notification", handleNotification);

    return () => socket.off("notification", handleNotification);
  }, [socket, setNotifications]);

  // Always dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Filtered gigs based on tab
  const displayedGigs =
    filter === "my"
      ? gigs.filter((g) => g.ownerId === user.id)
      : gigs;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 transition-colors duration-500">
      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 px-6 py-5 shadow-xl rounded-b-2xl backdrop-blur-md bg-opacity-90 transition-all duration-500">
        <h1 className="text-3xl font-bold text-gray-100 tracking-tight mb-3 md:mb-0">
          Gig Marketplace
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          {/* SEARCH */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search gigs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-2 rounded-xl border border-gray-700 bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md transition-all duration-300"
            />
            <FiSearch className="absolute left-4 top-2.5 text-gray-400" />
          </div>

          {/* CREATE GIG */}
          <button
            onClick={() => navigate("/create-gig")}
            className="flex items-center gap-2 bg-white text-gray-900 px-5 py-2 rounded-2xl shadow-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300"
          >
            <FiPlus /> Create Gig
          </button>

          {/* NOTIFICATIONS */}
          <div className="relative">
            <FiBell
              className="text-2xl cursor-pointer hover:text-green-400 transition-all duration-300"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse shadow-md">
                {unreadCount}
              </span>
            )}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 shadow-2xl rounded-2xl p-3 z-50 max-h-96 overflow-y-auto backdrop-blur-md transition-all duration-300">
                {notifications.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center">
                    No notifications
                  </p>
                ) : (
                  notifications
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((n) => (
                      <div
                        key={n._id}
                        className={`p-3 mb-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-700 ${!n.isRead
                            ? "bg-gray-700 border-l-4 border-green-400"
                            : ""
                          }`}
                        onClick={() => markAsRead(n._id)}
                      >
                        <p className="text-sm">{n.message}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="relative flex items-center gap-3 px-6 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-gray-100 font-medium shadow-lg hover:shadow-xl hover:border-white/40 hover:bg-white/20 transition-all duration-300 overflow-hidden"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex justify-center gap-4 p-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-2 rounded-2xl font-semibold transition ${filter === "all"
              ? "bg-green-500 text-white shadow-lg"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
        >
          All Gigs
        </button>
        <button
          onClick={() => setFilter("my")}
          className={`px-6 py-2 rounded-2xl font-semibold transition ${filter === "my"
              ? "bg-green-500 text-white shadow-lg"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
        >
          My Gigs
        </button>
      </div>

      {/* GIG GRID */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedGigs.length === 0 ? (
          <p className="text-gray-300 text-center col-span-full text-lg font-semibold">
            {filter === "my"
              ? "You haven't created any gigs yet."
              : "No gigs found."}
          </p>
        ) : (
          displayedGigs.map((gig) => (
            <div
              key={gig._id}
              className="transform transition-all hover:scale-105 hover:shadow-2xl rounded-2xl overflow-hidden bg-gray-800 shadow-lg"
            >
              <GigCard
                gig={gig}
                className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
