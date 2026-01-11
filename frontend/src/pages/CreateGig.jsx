import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FiUpload } from "react-icons/fi";

const CreateGig = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/gigs", form);
      navigate("/");
    } catch (err) {
      console.error("Error creating gig:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-6">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* LEFT IMAGE/ILLUSTRATION */}
        <div className="lg:w-1/2 hidden lg:flex items-center justify-center bg-linear-to-br ">
          <img
            src="https://c8.alamy.com/comp/H6H3HW/creative-ideas-design-imagination-innovation-concept-H6H3HW.jpg"
            alt="Gig Illustration"
            className="w-3/4 rounded-2xl shadow-lg"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="lg:w-1/2 w-full p-8 lg:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-white text-center lg:text-left">
            Create a New Gig
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              name="title"
              placeholder="Gig Title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />

            <textarea
              name="description"
              placeholder="Gig Description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none h-32"
              required
            />

            <input
              name="budget"
              type="number"
              placeholder="Budget (₹)"
              value={form.budget}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />

            

            <button
              type="submit"
              className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              Create Gig
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGig;
