"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useRef } from "react";

export default function ChatRoom({ params }) {
  const { room_id } = params;
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${room_id}/`);
    socketRef.current = ws;

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => ws.close();
  }, [room_id]);

  function sendMessage() {
    const token = localStorage.getItem("token");
    if (socketRef.current && content.trim()) {
      socketRef.current.send(
        JSON.stringify({
          token,
          message: content,
        })
      );
      setContent("");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Chat Room</h1>

      <div
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "1px solid #ddd",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        {messages.map((m, i) => (
          <p key={i}><strong>{m.username}:</strong> {m.message}</p>
        ))}
      </div>

      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type message..."
        style={{ width: "70%", marginRight: "1rem" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
