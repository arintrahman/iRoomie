"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import NavigationButton from "../components/NavigationButton";


export default function MatchingPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragX, setDragX] = useState(0);
  const dragStartX = useRef(0);
  const router = useRouter();

  // Load candidates for matching
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
  }, [router]);

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
      setCandidates((c) => c.filter((x) => x.username !== target_username));
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

  // Handle drag start, move and end
  function handleDragStart(e, username) {
    setDraggedCard(username);
    dragStartX.current = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
  }

  function handleDragMove(e) {
    if (!draggedCard) return;
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartX.current;
    setDragX(deltaX);
  }

  function handleDragEnd() {
    if (!draggedCard) return;

    if (dragX > 120) {
      swipe(draggedCard, "like");
    } else if (dragX < -120) {
      swipe(draggedCard, "pass");
    }
    setDraggedCard(null);
    setDragX(0);
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 text-white text-xl">
        Loading...
      </div>
    );

  if (candidates.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 text-white text-xl">
        No more candidates!
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 p-8 flex flex-col items-center">
      {/* Top nav buttons */}
       <div className=" flex justify-end gap-4 mb-8 max-w-max ml-auto">
              <NavigationButton text="Your Chats" link="/chat" colorClass="bg-blue-600 hover:bg-blue-700" />
              <NavigationButton text="Potential Roomies" link="/profile/matches" colorClass="bg-orange-500 hover:bg-orange-600" />
              <NavigationButton text="Your Profile" link="/profile" colorClass="bg-green-600 hover:bg-green-700" />
            </div>

      <div className="w-full max-w-3xl relative flex-1">
        <h1 className="text-4xl font-extrabold text-white text-center mb-10">
          Find Your Roommate Match 🔍
        </h1>

        {candidates.map((c) => {
          const isDragging = draggedCard === c.username;
          const translateX = isDragging ? dragX : 0;
          const rotate = isDragging ? dragX / 20 : 0;

          // Opacity for like/pass label
          const likeOpacity = translateX > 0 ? Math.min(translateX / 150, 1) : 0;
          const passOpacity = translateX < 0 ? Math.min(-translateX / 150, 1) : 0;

          return (
            <div
              key={c.username}
              className={`absolute w-full bg-white/90 backdrop-blur-xl shadow-xl rounded-3xl p-8 border border-blue-200 cursor-grab select-none transition-transform duration-150 ease-out ${
                isDragging ? "z-50" : "z-0"
              }`}
              style={{
                transform: `translateX(${translateX}px) rotate(${rotate}deg)`,
                touchAction: "none",
                userSelect: "none",
              }}
              onMouseDown={(e) => handleDragStart(e, c.username)}
              onTouchStart={(e) => handleDragStart(e, c.username)}
              onMouseMove={handleDragMove}
              onTouchMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchEnd={handleDragEnd}
            >
              {/* Like label */}
              <div
                style={{ opacity: likeOpacity }}
                className="absolute top-4 left-4 text-green-600 font-bold text-2xl select-none pointer-events-none"
              >
                LIKE 👍
              </div>

              {/* Pass label */}
              <div
                style={{ opacity: passOpacity }}
                className="absolute top-4 right-4 text-red-600 font-bold text-2xl select-none pointer-events-none"
              >
                PASS 👎
              </div>

              <h2 className="text-2xl font-bold text-blue-700 mb-2">
                <a
                  href={`/profile/view/${c.username}`}
                  className="underline hover:text-blue-900 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/profile/view/${c.username}`);
                  }}
                >
                  {c.username}
                </a>
              </h2>

              <div className="text-gray-700 space-y-1 mb-6">
                <p>
                  <span className="font-semibold">Age:</span> {c.age}
                </p>
                <p>
                  <span className="font-semibold">Gender:</span> {c.gender}
                </p>
                <p>
                  <span className="font-semibold">Budget:</span> ${c.budget}
                </p>
                <p>
                  <span className="font-semibold">Location:</span> {c.preferred_location}
                </p>
                <p>
                  <span className="font-semibold">Bio:</span> {c.bio}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => swipe(c.username, "pass")}
                  className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-xl shadow hover:bg-gray-500 transition"
                >
                  Pass
                </button>

                <button
                  onClick={() => swipe(c.username, "like")}
                  className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl shadow hover:bg-orange-600 transition"
                >
                  Like
                </button>

                <button
                  onClick={() => startChat(c.username)}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition"
                >
                  Start Chat
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}