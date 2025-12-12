"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import * as React from 'react'
import NavigationButton from "../../components/NavigationButton";

export default function ChatRoom({ params }) {
  // Use state to track current room id so we can switch rooms without remounting component
  const initialRoomId = params.room_id;
  const [roomId, setRoomId] = useState(initialRoomId);

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const socketRef = useRef(null);
  const router = useRouter();

  // Load all chats for sidebar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    async function loadChats() {
      const res = await fetch("http://127.0.0.1:8000/api/chat/", {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      setChats(data);
    }
    loadChats();
  }, [router]);

  // Setup WebSocket connection for current roomId
  useEffect(() => {
    if (!roomId) return;

    setMessages([]); // clear messages when room changes

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomId}/`);
    socketRef.current = ws;

    ws.onopen = () => console.log("WebSocket connected to room", roomId);
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [roomId]);

  function sendMessage() {
    const token = localStorage.getItem("token");

    if (socketRef.current?.readyState === WebSocket.OPEN && content.trim()) {
      socketRef.current.send(
        JSON.stringify({
          token,
          message: content,
        })
      );
      setContent("");
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400">
      {/* Sidebar */}
      <aside className="w-64 bg-white/90 backdrop-blur-md border-r border-blue-300 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-blue-700 p-4 border-b border-blue-300">
          Your Chats
        </h2>

        <div className="flex-grow overflow-y-auto">
          {chats.length === 0 ? (
            <p className="p-4 text-gray-600">No chats available.</p>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setRoomId(chat.id)}
                className={`w-full text-left p-4 border-b border-blue-200 hover:bg-blue-100 transition 
                  ${
                    chat.id === roomId
                      ? "bg-blue-300 font-semibold text-white"
                      : "text-blue-700"
                  }`}
              >
                {chat.participants.map((p) => p.username).join(", ")}
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Chat main content */}
      <main className="flex-1 flex flex-col p-6">
        <div className=" flex justify-end gap-4 mb-8 max-w-max ml-auto">
                    <NavigationButton text="Find Matches" link="/matching" colorClass="bg-blue-600 hover:bg-blue-700" />
                    <NavigationButton text="Potential Roomies" link="/profile/matches" colorClass="bg-orange-500 hover:bg-orange-600" />
                    <NavigationButton text="Your Profile" link="/profile" colorClass="bg-green-600 hover:bg-green-700" />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-6 text-center">
          Chat Room #{roomId}
        </h1>
          
        <div
          className="flex-1 bg-white/90 backdrop-blur-md rounded-3xl p-6 overflow-y-auto shadow-lg border border-blue-300 max-h-[calc(100vh-160px)]"
        >
          
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((m, i) => (
              <p key={i} className="mb-2">
                <strong className="text-blue-700">{m.username}:</strong> {m.message}
              </p>
            ))
          )}
        </div>

        <div className="mt-6 flex gap-4">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-grow px-4 py-3 rounded-2xl border border-blue-300 focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl shadow-md transition"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
