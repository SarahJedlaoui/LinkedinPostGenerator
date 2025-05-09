"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Link from "next/link";

export default function ReflectionPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [mainQuestion, setMainQuestion] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) return;

      const res = await fetch(
        `https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/insights/${sessionId}`
      );
      const session = await res.json();

      setQuestions(session.questions || []);
      setMainQuestion(session.chosenQuestion || "");
    };

    loadData();
  }, []);

  const handleNext = async () => {
    const updated = [...answers];
    updated[currentStep] = input.trim();
    setAnswers(updated);
    setInput("");

    if (currentStep === questions.length - 1) {
      await finish(updated);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const finish = async (answersToSend) => {
    setLoading(true);
    try {
      const sessionId = localStorage.getItem("sessionId");
      await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/answers",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, answers: answersToSend }),
        }
      );
      router.push("/post");
    } catch (err) {
      console.error(err);
      alert("Failed to save answers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-[#FAF9F7] px-5 py-6 flex flex-col font-sans">
      <div>
          {/* Back and title */}
        <div className="flex items-center gap-2 mb-3">
          <Link href="/details">
            <span className="text-2xl font-bold">←</span>
          </Link>
          <h1 className="text-2xl font-bold">Share Your Thoughts</h1>
        </div>

        <p className="text-sm text-[#6c6c6c]">
          Brick by brick, you’re building it ..
        </p>
        <div className="w-full h-2 rounded-full bg-[#EFECE4] my-2">
          <div
            className="h-full bg-[#A48CF1] rounded-full"
            style={{
              width: `${((currentStep + 1) / questions.length) * 95}%`,
            }}
          ></div>
        </div>

        <div className="bg-[#E4D9F6] p-4 rounded-xl border border-black shadow-[4px_4px_0px_black] text-xl font-bold text-center mb-4">
          {mainQuestion}
        </div>
      </div>

      {/* White box that fills remaining space */}
      <div className="flex flex-col bg-white border border-black rounded-xl p-4 flex-grow mb-6">
        <div className="flex-grow">
          <p className="text-sm mb-2 text-black font-semibold">
            {questions[currentStep]}
          </p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write"
            className="w-full h-full resize-none text-sm text-[#444] outline-none border-none"
          />
        </div>
        {/* Buttons pinned at the bottom */}
        <div className="flex justify-between items-center pt-4">
          <button
            className="text-[#A48CF1] font-semibold"
            onClick={() => finish(answers)}
            disabled={loading}
          >
            Finish
          </button>

          {currentStep < questions.length - 1 && (
            <button
              onClick={handleNext}
              disabled={loading || !input.trim()}
              className="bg-[#A48CF1] text-white rounded-xl px-6 py-3 shadow-[4px_4px_0px_black] font-semibold"
            >
              Go deeper
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
