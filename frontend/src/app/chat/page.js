"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatListPage() {
  const [chats, setChats] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function loadChats() {
      const res = await fetch("http://127.0.0.1:8000/api/chat/", {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      setChats(data);
    }
    loadChats();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Your Chats</h1>
      {chats.map((chat) => (
        <div
          key={chat.id}
          style={{
            padding: "1rem",
            border: "1px solid #ccc",
            margin: "1rem 0",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={() => router.push(`/chat/${chat.id}`)}
        >
          <p><strong>Participants:</strong> {chat.participants.map((p) => p.username).join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
