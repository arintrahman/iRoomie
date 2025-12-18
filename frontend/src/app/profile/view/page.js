"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileViewPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view your profile.");
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/users/profile/view/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile.");
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 text-white text-xl">
        Loading profile...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 text-white text-xl">
        <p className="bg-white/90 backdrop-blur-xl text-red-600 p-6 rounded-xl shadow max-w-xl">
          {error}
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 flex flex-col items-center p-8">
      {/* Navigation Buttons */}
      <div className="w-full max-w-3xl flex justify-end gap-4 mb-8">
        {/* <button
          onClick={() => router.push("/chat")}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition"
        >
          Your Chats
        </button> */}
        <button
          onClick={() => router.push("/matching")}
          className="px-4 py-2 bg-orange-500 text-white rounded-xl font-semibold shadow hover:bg-orange-600 transition"
        >
          Find Your Matches
        </button>
        <button
          onClick={() => router.push("/profile/matches")}
          className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold shadow hover:bg-green-700 transition"
        >
            Potential Roomies
        </button>
      </div>

      <div className="max-w-xl w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-blue-200">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-6 text-center">
          Your Profile
        </h1>
        <div className="text-gray-800 space-y-4 text-lg">
          <p>
            <span className="font-semibold">Age:</span> {profile.age || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Gender:</span> {profile.gender || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Budget:</span> ${profile.budget || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Preferred Location:</span>{" "}
            {profile.preferred_location || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Bio:</span> {profile.bio || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
