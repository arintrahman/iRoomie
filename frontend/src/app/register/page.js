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
    <div style={{ padding: "2rem" }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} />
        <br />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          type="email"
        />
        <br />
        <input
          name="password"
          placeholder="Password"
          onChange={handleChange}
          type="password"
        />
        <br />
        <input
          name="password2"
          placeholder="Confirm Password"
          onChange={handleChange}
          type="password"
        />
        <br />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
      <a href="/login">Already have an account? Log in</a>
    </div>
  );
}
