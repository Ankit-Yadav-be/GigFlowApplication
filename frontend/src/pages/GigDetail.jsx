import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import {
  FiInfo,
  FiCheckCircle,
  FiAlertTriangle,
  FiClock,
} from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const GigDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bidForm, setBidForm] = useState({ price: "", message: "" });

  // 🔹 loaders
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [hiringBidId, setHiringBidId] = useState(null);

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

  // 🔹 Submit Bid with loader
  const submitBid = async (e) => {
    e.preventDefault();
    try {
      setIsSubmittingBid(true);
      await api.post("/bids", { gigId: id, ...bidForm });
      setBidForm({ price: "", message: "" });
      await fetchBids();
    } finally {
      setIsSubmittingBid(false);
    }
  };

  // 🔹 Hire Bid with per-button loader
  const hireBid = async (bidId) => {
    try {
      setHiringBidId(bidId);
      await api.patch(`/bids/hire/${bidId}`);
      await fetchGig();
      await fetchBids();
    } finally {
      setHiringBidId(null);
    }
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

          <p className="text-gray-300">{gig.description}</p>

          <div className="bg-gray-700/40 p-4 rounded-xl border border-gray-600 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-green-400" />
              Status: <b>{gig.status.toUpperCase()}</b>
            </div>
            <div className="flex items-center gap-2">
              <FiAlertTriangle className="text-yellow-400" />
              Budget: <b>₹{gig.budget}</b>
            </div>
          </div>

          {!isOwner && gig.status === "open" && (
            <form onSubmit={submitBid} className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold">Place a Bid</h3>

              <input
                type="number"
                placeholder="Your price"
                value={bidForm.price}
                onChange={(e) =>
                  setBidForm({ ...bidForm, price: e.target.value })
                }
                required
                className="p-4 rounded-lg bg-gray-800 border border-gray-700"
              />

              <textarea
                placeholder="Why should you be hired?"
                value={bidForm.message}
                onChange={(e) =>
                  setBidForm({ ...bidForm, message: e.target.value })
                }
                required
                className="p-4 rounded-lg bg-gray-800 border border-gray-700"
              />

              <button
                disabled={isSubmittingBid}
                className={`flex justify-center items-center gap-2 px-6 py-3 rounded-lg font-semibold transition
                ${
                  isSubmittingBid
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isSubmittingBid && (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                )}
                {isSubmittingBid ? "Submitting..." : "Submit Bid"}
              </button>
            </form>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
            <h1 className="text-4xl font-bold">{gig.title}</h1>
          </div>

          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 flex flex-col gap-4">
            <h2 className="text-3xl font-semibold">Bids ({bids.length})</h2>

            {bids.map((bid) => (
              <div
                key={bid._id}
                className="border border-gray-700 rounded-xl p-6 flex flex-col gap-4"
              >
                <div>
                  <p className="text-xl font-bold">₹{bid.price}</p>
                  <p className="text-gray-300">{bid.message}</p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <FiClock /> {new Date(bid.createdAt).toLocaleString()}
                  </span>

                  {isOwner && bid.status === "pending" && (
                    <button
                      onClick={() => hireBid(bid._id)}
                      disabled={hiringBidId === bid._id}
                      className={`flex items-center gap-2 px-8 py-2 rounded-lg border transition
                      ${
                        hiringBidId === bid._id
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      {hiringBidId === bid._id && (
                        <AiOutlineLoading3Quarters className="animate-spin" />
                      )}
                      {hiringBidId === bid._id ? "Hiring..." : "Hire"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetail;
