"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MatchingPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const message = localStorage.getItem("username");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function loadCandidates() {
      const res = await fetch("http://127.0.0.1:8000/api/matching/candidates/", {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      setCandidates(data);
      setLoading(false);
    }

    loadCandidates();
  }, []);

  async function swipe(target_username, action) {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/api/matching/swipe/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ target_username, action }),
    });

    if (res.ok) {
      alert(`${action} recorded.`);
      setCandidates(candidates.filter((c) => c.username !== target_username));
    } else {
      alert("Error swiping.");
    }
  }

  async function startChat(target_username) {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/api/matching/start_chat/", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      },
      body: JSON.stringify({ target_username }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push(`/chat/${data.room_id}`);
    } else {
      alert("Could not start chat.");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Matching</h1>

      {candidates.length === 0 && <p>No more candidates!</p>}

      {candidates.map((c) => (
        <div
          key={c.username}
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            margin: "1rem 0",
            borderRadius: "8px",
          }}
        >
          <h2>{c.username}</h2>
          <p>Age: {c.age}</p>
          <p>Gender: {c.gender}</p>
          <p>Budget: {c.budget}</p>
          <p>Location: {c.preferred_location}</p>
          <p>Bio: {c.bio}</p>

          <button
            style={{ marginRight: "1rem", background: "#aaa" }}
            onClick={() => swipe(c.username, "pass")}
          >
            Pass
          </button>

          <button
            style={{ marginRight: "1rem", background: "green", color: "white" }}
            onClick={() => swipe(c.username, "like")}
          >
            Like
          </button>

          <button
            style={{ marginLeft: "1rem", background: "blue", color: "white" }}
            onClick={() => startChat(c.username)}
          >
            Start Chat
          </button>
        </div>
      ))}
    </div>
  );
}
