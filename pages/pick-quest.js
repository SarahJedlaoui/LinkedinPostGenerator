import React, { useState } from "react";
import SwipeableCard from "../components/swipeCard/SwipeDeck";
import Head from "next/head";
import { useRouter } from "next/router"; 


export default function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 

  const topicQuestions = {
    "New UX Design terms": [
      "What does “Dark Pattern” mean in modern interfaces?",
      "How can “Skeuomorphism” improve trust?",
      "What is a “Microinteraction” and why care?",
    ],
    "Tech Industry | AI | Design": [
      "Is it time to move from UX to Human Experience (HX)?",
      "How is AI reshaping creativity in UX?",
      "Can AI help us build better design systems?",
    ],
    "Content | Social | Thought": [
      "How do you craft a viral hook on LinkedIn?",
      "What makes a great Instagram carousel?",
      "Balance value & brevity in a tweet?",
    ],
    "Beauty | Aesthetics": [
      "Why is “Glass Skin” trending on TikTok?",
      "What makes “before & after” posts convert?",
      "How do color palettes affect perception?",
    ],
    "Wellness | Mental Health": [
      "How can apps encourage mindful breaks?",
      "Is journaling with chatbots the next big thing?",
      "How do design choices impact stress levels?",
    ],
  };

  const topics = Object.keys(topicQuestions);
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);

  const handleStart = async () => {
    setLoading(true);
    // create session
    try {
      const res = await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona",
        {
          method: "POST",
        }
      );

      const data = await res.json();
      localStorage.setItem("sessionId", data.sessionId);

      const topic = selectedTopic;
      const sessionId = localStorage.getItem("sessionId");
       const question = topicQuestions[topic][currentQuestionIndex];

      if (!topic || !sessionId) {
        alert("Missing topic or session ID");
        return;
      }
      setLoading(true); // Start loading UI

      // Save the topic
      await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/topic",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, topic }),
        }
      );

      // Save the question
      await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/question",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, question }),
        }
      );
      
      await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/insights",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId,question }),
        }
      );

      router.push("/quest-details");
    } catch (err) {
      console.error("Failed to save topic:", err);
      alert("Something went wrong saving your topic.");
      setLoading(false); // Reset if something goes wrong
    }
  };
  return (
    <div className="h-screen bg-[#FAF9F7] flex flex-col justify-between px-6 pt-6 pb-4 max-w-[430px] mx-auto">
      {/* ─── HEADER ─────────────────────────────────────────────────────────── */}
      <div>
        {/* Progress */}
        <div className="flex gap-2 mb-1 mt-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${
                i === 0 ? "bg-[#D57B59]" : "bg-[#EDE8E2]"
              }`}
            />
          ))}
        </div>
        <p className="text-[#D57B59] text-sm mb-4">Step 1 of 4</p>

        {/* Title + subtitle */}
        <h1 className="text-2xl font-bold font-serif mb-1">
          Choose your Content Quest for today
        </h1>
        <p className="text-sm text-[#6B6B6B] mb-4">
          Every path leads to a unique idea and post. Pick your vibe.
        </p>

        {/* Topic Selector */}
        <div className="flex overflow-x-auto gap-2">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                selectedTopic === topic
                  ? "bg-[#D96C4F] text-white"
                  : "bg-gray-100"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* ─── SWIPE DECK ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center">
      <SwipeableCard
  questions={topicQuestions[selectedTopic]}
  index={currentQuestionIndex}
  setIndex={setCurrentQuestionIndex}
/>

      </div>

      {/* ─── FOOTER ─────────────────────────────────────────────────────────── */}
      <div>
        <p className="text-center text-sm text-gray-500 mb-4">
          👀 2,310 users are working on this today
        </p>
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-[#D96C4F] text-white py-3 rounded-full text-lg shadow-md disabled:opacity-50"
        >
          {loading ? "Starting…" : "Start this Quest"}
        </button>
      </div>
    </div>
  );
}
