'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

   const submit = async (e) => {
    e.preventDefault();

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

        router.push("/profile");
      } else {

      }
    } catch {

    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-white">
      <div className="w-full max-w-sm bg-white/95 shadow-lg rounded-xl p-6">
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-3xl font-bold text-[oklch(0.7_0.0888_279.53)]">iRoomie</h1>
          <p className="text-sm text-gray-600">Log in to find your roommate</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-[oklch(0.7_0.0888_279.53)] focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-[oklch(0.7_0.0888_279.53)] focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

         

          <button
            type="submit"
            className="w-full rounded-md bg-[oklch(0.7_0.0888_279.53)] text-white font-semibold py-2.5 hover:opacity-90 transition"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New here?{' '}
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="font-semibold text-[oklch(0.7_0.0888_279.53)] hover:underline"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}