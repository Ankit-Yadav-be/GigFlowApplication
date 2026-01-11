import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await registerUser(form);
      login(data); // auto-login
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-6">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* LEFT IMAGE SECTION */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gray-900">
          <img
            src="https://thumbs.dreamstime.com/b/writing-note-showing-register-now-business-photo-showcasing-name-official-list-enlist-to-be-member-sign-up-clothespin-hol-125580140.jpg"
            alt="Register Illustration"
            className="w-3/4 rounded-2xl shadow-lg"
          />
        </div>

        {/* RIGHT REGISTER FORM */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2 text-white">
            Create your account 
          </h2>
          <p className="text-gray-400 mb-8">
            Join the marketplace and start posting gigs
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              name="name"
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Create password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            <button
              type="submit"
              className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg transition"
            >
              Create Account
            </button>
          </form>

          <p className="text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-400 hover:underline font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
