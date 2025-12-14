"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export const dynamic = "force-dynamic";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/users/profile/", {
          headers: { Authorization: `Token ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          setMessage("⚠️ Failed to load profile");
        }
      } catch {
        setMessage("Server error");
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const payload  = {
        ...profile,
        age: profile.age === "" || profile.age == null ? null : Number(profile.age),
        budget: profile.budget === "" || profile.budget == null ? null : Number(profile.budget),
      };
      const res = await fetch("http://127.0.0.1:8000/api/users/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type") || "";
      let data = null;
      
      if (contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      } else {
        const text = await res.text();
        console.log("PUT response (non-JSON):", text);
      }

      if (res.ok) {
        setMessage("✅ Profile updated successfully!");
        if (data) setProfile(data);
      } else {
        console.log("PUT error response data:", data);
        setMessage('❌ Error updating profile: ${text}');
      }
    } catch (err){
      console.error("Error during profile update:", err);
      setMessage("⚠️ Server error");
    }
  };

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 text-white text-xl">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 flex items-center justify-center p-8">
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
      <div className="bg-white/90 backdrop-blur-xl shadow-xl rounded-3xl p-10 w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-6">
          Your Profile 🎓
        </h1>

        <div className="space-y-4">
          <input
            name="age"
            placeholder="Age"
            value={profile.age || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 focus:ring-2 focus:ring-orange-400 outline-none"
          />

          <input
            name="gender"
            placeholder="Gender"
            value={profile.gender || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 focus:ring-2 focus:ring-orange-400 outline-none"
          />

          <input
            name="budget"
            placeholder="Budget"
            value={profile.budget || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 focus:ring-2 focus:ring-orange-400 outline-none"
          />

          <input
            name="preferred_location"
            placeholder="Preferred Location"
            value={profile.preferred_location || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 focus:ring-2 focus:ring-orange-400 outline-none"
          />

          <textarea
            name="bio"
            placeholder="Bio"
            value={profile.bio || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 h-32 rounded-xl bg-blue-50 border border-blue-200 focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full py-3 bg-orange-500 hover:bg-orange-600 transition text-white font-semibold rounded-xl shadow-md"
        >
          Save Changes
        </button>

        <p className="text-center text-sm text-gray-700 mt-3">{message}</p>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-xl shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
