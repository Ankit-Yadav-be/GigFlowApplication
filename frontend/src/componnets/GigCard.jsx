import { useNavigate } from "react-router-dom";
import React from "react";

const GigCard = ({ gig }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/gig/${gig._id}`)}
      className="cursor-pointer rounded-2xl p-5 bg-gray-800 border border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-100 mb-2">{gig.title}</h2>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4">
        {gig.description.length > 100
          ? gig.description.substring(0, 100) + "..."
          : gig.description}
      </p>

      {/* Budget and Status */}
      <div className="flex justify-between items-center">
        <span className="font-bold text-gray-100">₹{gig.budget}</span>
        <span
          className={`text-sm font-medium ${
            gig.status === "open" ? "text-green-400" : "text-yellow-400"
          }`}
        >
          {gig.status}
        </span>
      </div>
    </div>
  );
};

export default GigCard;
