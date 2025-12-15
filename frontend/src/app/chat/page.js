"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationButton from "../components/NavigationButton";


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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 p-8 flex justify-center">
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
      <div className="w-full">
         <div className=" flex justify-end gap-4 mb-8 max-w-max ml-auto">
          <NavigationButton text="Find Matches" link="/matching" colorClass="bg-blue-600 hover:bg-blue-700" />
          <NavigationButton text="Potential Roomies" link="/profile/matches" colorClass="bg-orange-500 hover:bg-orange-600" />
          <NavigationButton text="Your Profile" link="/profile" colorClass="bg-green-600 hover:bg-green-700" />
      </div>
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">Your Chats</h1>
        
        {chats.length === 0 ? (
          <p className="text-center text-white text-lg">No chats found.</p>
        ) : (
          <div className="space-y-4">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => router.push(`/chat/${chat.id}`)}
                className="cursor-pointer p-5 rounded-2xl bg-white/90 backdrop-blur-lg shadow-md hover:shadow-xl transition-shadow border border-blue-300"
                title="Click to open chat"
              >
                <p className="text-blue-700 font-semibold">
                  <strong>Participants:</strong> {chat.participants.map((p) => p.username).join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
