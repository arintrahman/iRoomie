"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        setMessage("✅ Login successful!");
        router.push("/profile");
      } else {
        setMessage("❌ " + JSON.stringify(data));
      }
    } catch {
      setMessage("⚠️ Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 flex items-center justify-center p-8">
       
      <div className="bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Welcome Back 👋
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholders="Username"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />

          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-all"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>

        <a
          href="/register"
          className="block text-center mt-4 text-blue-700 hover:text-orange-500 font-medium transition"
        >
          Need an account? Register
        </a>
      </div>
    </div>
  );
}
