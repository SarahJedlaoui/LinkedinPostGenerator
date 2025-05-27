"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTokenSync } from "../utils/auth";
import Link from "next/link";

export default function ReflectionPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [mainQuestion, setMainQuestion] = useState("");
  const [generating, setGenerating] = useState(false);
 useTokenSync();
  useEffect(() => {
   
    const loadInitialQuestion = async () => {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) return;

      const res = await fetch(
        `https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/insights/${sessionId}`
      );
      const session = await res.json();
      setMainQuestion(session.chosenQuestion || "");
      console.log("Session loaded:", session);
      // Get the first followUpQuestion from session
      const first = session.questions?.[0];
      if (first) {
        setQuestions([first]);
      }
    };

    loadInitialQuestion();
  }, []);

  const handleNext = async () => {
    const updated = [...answers];
    updated[currentStep] = input.trim();
    setAnswers(updated);
    setInput("");

    if (currentStep === questions.length - 1 && questions.length < 4) {
      setGenerating(true);
      const sessionId = localStorage.getItem("sessionId");
      try {
        const res = await fetch(
          "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/deep-questions",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              previousAnswer: updated[currentStep],
            }),
          }
        );
        const newQs = await res.json();
        const extended = [...questions, ...newQs];
        setQuestions(extended.slice(0, 4));
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          setGenerating(false);
        }, 100); // slight delay to ensure state update
      } catch (err) {
        console.error("Failed to fetch deep questions", err);
        setGenerating(false);
      }
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      await finish(updated);
    }
  };

  const finish = async (answersToSend) => {
    setLoading(true);
    try {
      const sessionId = localStorage.getItem("sessionId");
      await fetch("https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/answers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questions,
          answers: answersToSend,
        }),
      });
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
              width: `${((currentStep + 1) / questions.length) * 10}%`,
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
            {generating
              ? "Generating next question..."
              : questions[currentStep]}
          </p>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write your thoughts..."
            className="w-full min-h-[180px] resize-none text-sm text-[#444] outline-none border-none"
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

          {currentStep < 3 && (
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
