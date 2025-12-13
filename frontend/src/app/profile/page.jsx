"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

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
      const res = await fetch("http://127.0.0.1:8000/api/users/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setMessage("✅ Profile updated successfully!");
      } else {
        setMessage("❌ Error updating profile");
      }
    } catch {
      setMessage("⚠️ Server error");
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Your Profile</h1>
      <input
        name="age"
        placeholder="Age"
        value={profile.age || ""}
        onChange={handleChange}
      />
      <br />
      <input
        name="gender"
        placeholder="Gender"
        value={profile.gender || ""}
        onChange={handleChange}
      />
      <br />
      <input
        name="budget"
        placeholder="Budget"
        value={profile.budget || ""}
        onChange={handleChange}
      />
      <br />
      <input
        name="preferred_location"
        placeholder="Preferred Location"
        value={profile.preferred_location || ""}
        onChange={handleChange}
      />
      <br />
      <textarea
        name="bio"
        placeholder="Bio"
        value={profile.bio || ""}
        onChange={handleChange}
      />
      <br />
      <button onClick={handleSave}>Save Changes</button>
      <p>{message}</p>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
