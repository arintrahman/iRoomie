"use client";

import { useRouter } from "next/navigation";

export default function NavigationButton({ text, link, colorClass }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(link)}
      className={`flex-1 max-w-max px-10 py-2 rounded-xl font-semibold shadow text-white transition text-center
        ${colorClass} hover:brightness-110`}
    >
      {text}
    </button>
  );
}
