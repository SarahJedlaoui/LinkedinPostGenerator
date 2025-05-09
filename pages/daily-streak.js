// pages/daily-streak.jsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";


export default function DailyStreakPage() {
  const [streak, setStreak] = useState(Array(7).fill(false));
  const [userName, setUserName] = useState("syrine");

  useEffect(() => {
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    const lastCheckin = localStorage.getItem("lastCheckin");
    const currentDay = today.getDay(); // 0 = Sunday

    let updatedStreak =
      JSON.parse(localStorage.getItem("streak")) || Array(7).fill(false);

    if (lastCheckin !== todayStr) {
      updatedStreak[currentDay] = true;
      localStorage.setItem("lastCheckin", todayStr);
      localStorage.setItem("streak", JSON.stringify(updatedStreak));
    }

    setStreak(updatedStreak);
  }, []);

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const currentDayIndex = new Date().getDay();

  return (
    <div className="min-h-screen max-w-[430px] mx-auto flex flex-col justify-between bg-[#FAF9F7] px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 mt-20">
        Welcome back, {userName}
      </h1>

      <div className="bg-[#DCD1F4] h-[600px] rounded-xl p-6 shadow-[6px_6px_0px_black] border border-black flex flex-col justify-between">
        <h2 className="text-3xl font-semibold text-center mb-2">
          You Made It Today, And We&apos;re So Glad You Did
        </h2>
        <div className="flex justify-center my-6">
          <Image
            src="/images/big-flame.png"
            alt="Big flame"
            width={150}
            height={150}
          />
        </div>
        <div>
          <h3 className="text-center text-2xl font-bold ">6 days streak!</h3>
          <p className="text-center text-xl text-[#6B6B6B] mb-4">
            You're on fire
          </p>
        </div>
        <div>
          <div className="flex justify-between  text-xs text-[#333] font-bold mb-2">
            {days.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>

          <div className="bg-[#C8B9F4] p-2 rounded-full flex justify-between items-center">
            {days.map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-[#A48CF1] flex items-center justify-center"
              >
                {streak[i] ? (
                  <img
                    src={
                      i === currentDayIndex
                        ? "/images/small-flame-animated.jpg"
                        : "/images/small-flame.svg"
                    }
                    alt="Flame icon"
                    width={24}
                    height={24}
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-[#E0E0E0]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button className="w-full py-4 text-white text-lg font-semibold bg-[#A48CF1] rounded-xl shadow-[4px_4px_0px_black]">
          Continue
        </button>
      </div>
    </div>
  );
}
