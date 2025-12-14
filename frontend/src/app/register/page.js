"use client";
import { useState } from "react";
export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Registering...");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Registration successful! You can now log in.");
      } else {
        setMessage("❌ " + JSON.stringify(data));
      }
    } catch (err) {
      setMessage("⚠️ Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 flex items-center justify-center p-6">
      <div className="absolute inset-0 flex items-start pointer-events-none select-none">
       <div className="w-full px-4 pt-3 space-y-5">
         <p className="uppercase tracking-[0.1em] text-white/15 text-8xl font-bold">
         I-L-L / I-N-I / I-L-L / I-N-I / I
         -L-L / I-N-I / I-L-L / I-N-I / I-
         L-L / I-N-I / I-L-L / I-N-I / I-L
         -L / I-N-I / I-L-L / I-N-I / I-L-
         L / I-N-I / I-L-L / I-N-I / I-L-L
         / I-N-I / I-L-L / I-N-I / I-L-L /
         I-N-I / I-L-L / I-N-I / I-L-L / I
         -N-I / I-L-L / I-N-I / I-L-L / I-
         </p>
       </div>
      </div>
      <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />

          <input
            name="password2"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-all"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>

        <a
          href="/login"
          className="block text-center mt-4 text-blue-700 hover:text-orange-500 font-medium transition"
        >
          Already have an account? Log in
        </a>
      </div>
    </div>
  );
}
