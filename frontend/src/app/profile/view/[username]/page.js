"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import NavigationButton from "../../../components/NavigationButton";

export default function PublicProfileViewPage() {
  const params = useParams();
  const router = useRouter();
  const { username } = params;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`http://127.0.0.1:8000/api/users/profile/view/${username}/`, {
          headers: { Authorization: `Token ${token}` },
        });

        if (!res.ok) {
          setError("Profile not found or you are not authorized");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError("Server error");
      }
      setLoading(false);
    }
    fetchProfile();
  }, [username, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 text-white text-xl">
        Loading profile...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700 text-xl font-semibold">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 flex flex-col items-center p-8">
      <div className="w-full max-w-3xl flex justify-end gap-4 mb-8">
          <div className=" flex justify-end gap-4 mb-8 max-w-max ml-auto">
                  <NavigationButton text="Your Chats" link="/chat" colorClass="bg-blue-600 hover:bg-blue-700" />
                  <NavigationButton text="Find Your Matches" link="/matching" colorClass="bg-orange-500 hover:bg-orange-600" />
                  <NavigationButton text="Your Profile" link="/profile" colorClass="bg-green-600 hover:bg-green-700" />
                </div>
        </div>
      <div className="bg-white rounded-3xl shadow-xl max-w-3xl w-full p-10">
        
        {/* Profile Header */}
        <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center border-b border-blue-200 pb-4">
          Profile of <span className="text-orange-500">{username}</span>
        </h1>

        {/* Profile Details */}
        <div className="space-y-6 text-gray-800 text-lg">
          {/* Age */}
          <div className="flex justify-between border-b border-gray-300 pb-3">
            <span className="font-semibold text-gray-600">Age:</span>
            <span className="text-gray-900">{profile.age ?? "N/A"}</span>
          </div>

          {/* Gender */}
          <div className="flex justify-between border-b border-gray-300 pb-3">
            <span className="font-semibold text-gray-600">Gender:</span>
            <span className="text-gray-900">{profile.gender ?? "N/A"}</span>
          </div>

          {/* Budget */}
          <div className="flex justify-between border-b border-gray-300 pb-3">
            <span className="font-semibold text-gray-600">Budget:</span>
            <span className="text-gray-900">{profile.budget ? `$${profile.budget}` : "N/A"}</span>
          </div>

          {/* Location */}
          <div className="flex justify-between border-b border-gray-300 pb-3">
            <span className="font-semibold text-gray-600">Preferred Location:</span>
            <span className="text-gray-900">{profile.preferred_location ?? "N/A"}</span>
          </div>

          {/* Bio */}
          <div className="flex flex-col">
            <span className="font-semibold mb-2 text-gray-600">Bio:</span>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{profile.bio ?? "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
