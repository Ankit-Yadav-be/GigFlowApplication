import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiClock } from "react-icons/fi";

const GigDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bidForm, setBidForm] = useState({ price: "", message: "" });

  const fetchGig = async () => {
    const { data } = await api.get(`/gigs/${id}`);
    setGig(data);
  };

  const fetchBids = async () => {
    const { data } = await api.get(`/bids/${id}`);
    setBids(data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await fetchGig();
        await fetchBids();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const submitBid = async (e) => {
    e.preventDefault();
    await api.post("/bids", { gigId: id, ...bidForm });
    setBidForm({ price: "", message: "" });
    fetchBids();
  };

  const hireBid = async (bidId) => {
    await api.patch(`/bids/hire/${bidId}`);
    fetchGig();
    fetchBids();
  };

  if (loading) return <p className="p-6 text-gray-400">Loading...</p>;
  if (!gig) return <p className="p-6 text-red-500">Gig not found</p>;

  const isOwner = user?.id === gig.ownerId;

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-100 flex flex-col">
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* LEFT PANEL */}
        <div className="lg:w-1/3 bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-lg flex flex-col gap-6">
          <div className="flex items-center gap-2 text-green-400 font-semibold text-lg">
            <FiInfo /> Gig Overview
          </div>
          <p className="text-gray-300 leading-relaxed text-base">{gig.description}</p>

          <div className="bg-gray-700/40 p-4 rounded-xl border border-gray-600 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-100">
              <FiCheckCircle className="text-green-400" /> Status:{" "}
              <span className="font-semibold">{gig.status.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-100">
              <FiAlertTriangle className="text-yellow-400" /> Budget:{" "}
              <span className="font-semibold">₹{gig.budget}</span>
            </div>
            <p className="text-gray-400 text-sm">
              Place your bid carefully. Highlight your strengths and explain why you are the best fit.
            </p>
          </div>

          {!isOwner && gig.status === "open" && (
            <div className="mt-4 flex flex-col gap-3">
              <h3 className="text-xl font-semibold">Place a Bid</h3>
              <form className="flex flex-col gap-3" onSubmit={submitBid}>
                <input
                  type="number"
                  placeholder="Your price"
                  value={bidForm.price}
                  onChange={(e) => setBidForm({ ...bidForm, price: e.target.value })}
                  className="w-full border border-gray-700 bg-gray-800 text-gray-100 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
                <textarea
                  placeholder="Why should you be hired?"
                  value={bidForm.message}
                  onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                  className="w-full border border-gray-700 bg-gray-800 text-gray-100 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
                <button className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition">
                  Submit Bid
                </button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:w-2/3 flex flex-col gap-6 h-full">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-lg flex flex-col gap-6">
            <h1 className="text-4xl font-bold">{gig.title}</h1>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-2xl font-semibold text-gray-100">₹{gig.budget}</span>
              <span
                className={`px-3 py-1 text-sm rounded-full font-medium ${
                  gig.status === "open" ? "bg-green-700/30 text-green-400" : "bg-yellow-700/30 text-yellow-400"
                }`}
              >
                {gig.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-lg flex flex-col gap-6 flex-1">
            <h2 className="text-3xl font-semibold">Bids ({bids.length})</h2>

            <div className="flex flex-col gap-4 flex-1">
              {bids.length === 0 ? (
                <p className="text-gray-400 text-lg">No bids yet</p>
              ) : (
                bids.map((bid) => (
                  <div
                    key={bid._id}
                    className="border border-gray-700 rounded-2xl p-6 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 flex flex-col gap-4"
                  >
                    {/* BID INFO */}
                    <div>
                      <p className="font-bold text-xl text-gray-100">₹{bid.price}</p>
                      <p className="text-gray-300 mt-2">{bid.message}</p>
                    </div>

                    {/* ACTION ROW */}
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm px-3 py-1 rounded-full font-medium border border-gray-500 bg-gray-800 text-gray-100`}
                        >
                          {bid.status.toUpperCase()}
                        </span>
                        <span className="flex items-center text-gray-400 text-xs sm:text-sm gap-1">
                          <FiClock /> {new Date(bid.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {isOwner && bid.status === "pending" && (
                        <button
                          onClick={() => hireBid(bid._id)}
                          className="px-12 py-3 rounded-lg font-semibold border border-gray-500 text-gray-100 bg-gray-800 hover:bg-gray-700 transition duration-200"
                        >
                          Hire
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetail;
