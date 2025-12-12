"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationButton from "../../components/NavigationButton";


export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchMatches() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/matching/matches/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch matches.");
        }

        const data = await res.json();
        setMatches(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, [router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 text-white text-xl">
        Loading matches...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 text-red-600 text-xl p-4">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 p-8 flex flex-col items-center">
       {/* Navigation Buttons */}
       <div className=" flex justify-end gap-4 mb-8 max-w-max ml-auto">
        <NavigationButton text="Your Chats" link="/chat" colorClass="bg-blue-300 hover:bg-blue-700" />
        <NavigationButton text="Find Your Matches" link="/matching" colorClass="bg-orange-400 hover:bg-orange-600" />
        <NavigationButton text="Your Profile" link="/profile" colorClass="bg-green-600 hover:bg-green-700" />
      </div>

      <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
        Your Successful Matches
      </h1>

      {matches.length === 0 ? (
        <p className="text-white text-center text-lg">
          No matches found yet.
        </p>
      ) : (
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6">
          {matches.map((user) => (
            <div
              key={user.id}
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-md border border-blue-300 cursor-pointer hover:shadow-xl transition"
              onClick={() => router.push(`/profile/view/${user.username}`)}
              title={`View ${user.username}'s profile`}
            >
              <h2 className="text-2xl font-bold text-blue-700 mb-2">
                {user.username}
              </h2>
              {/* You can add more details here if your serializer includes them */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
