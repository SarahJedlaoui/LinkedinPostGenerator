// pages/build-post.jsx

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function BuildPost() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load questions on mount
  useEffect(() => {
    (async () => {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) return alert("No session");

      const res = await fetch(
        `http://localhost:5000/api/persona/session/${sessionId}`
      );
      const data = await res.json();
      if (data.questions?.length) {
        setQuestions(data.questions);
        setAnswers(Array(data.questions.length).fill(""));
        setInput("");
      } else {
        alert("No questions found for your session.");
      }
    })();
  }, []);

  // Pre-fill input when changing steps
  useEffect(() => {
    setInput(answers[currentStep] || "");
  }, [currentStep, answers]);

  // Speech-to-text
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    const mic = document.getElementById("mic");
    if (mic) {
      mic.onclick = () => {
        recognition.start();
        mic.disabled = true;
      };
    }

    recognition.onresult = (ev) => {
      setInput((prev) => prev + " " + ev.results[0][0].transcript);
    };
    recognition.onend = () => {
      if (mic) mic.disabled = false;
    };
  }, [currentStep]);

  const handleNext = async () => {
    // Save current answer
    const updated = [...answers];
    updated[currentStep] = input.trim();
    setAnswers(updated);

    // If last question, send all answers
    if (currentStep === questions.length - 1) {
      setLoading(true);
      try {
        const sessionId = localStorage.getItem("sessionId");
        await fetch(
          "http://localhost:5000/api/persona/answers",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, answers: updated }),
          }
        );
        router.push("/post-preview");
      } catch (err) {
        console.error(err);
        alert("Failed to save answers.");
      } finally {
        setLoading(false);
      }
    } else {
      // Otherwise go to next question
      setCurrentStep(currentStep + 1);
    }
  };

  if (!questions.length) {
    return <p className="p-6 text-center">Loading questions…</p>;
  }

  const isLast = currentStep === questions.length - 1;

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col justify-between px-4 py-6 max-w-[430px] mx-auto">
      <Head>
        <title>Build Your Post</title>
      </Head>

      <div>
       
        


        <Link href="/pick-quest" className="mb-10 inline-block text-[#D57B59]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
     

      {/* Progress & Title */}
      <div className="mb-4 mt-4">
        <div className="flex gap-2 mb-1">
          <div className="flex-1 h-1 bg-[#D57B59] rounded-full" />
          <div className="flex-1 h-1 bg-[#D57B59] rounded-full" />
          <div className="flex-1 h-1 bg-[#EDE8E2] rounded-full" />
        </div>
        <p className="text-[#D57B59] text-sm">Step 2 of 3</p>
        <h1 className="text-2xl font-bold font-serif mt-1 mb-1">Great take! 🧠</h1>
        <p className="text-md text-[#6B6B6B]">
          Let’s break it down and build your narrative together.
        </p>
      </div>

    
     {/* Single question card */}
        <div className=" flex-1 bg-white overflow-y-auto rounded-xl border p-6 mb-4">
          <p className="text-sm font-semibold mb-4">
            Q{currentStep + 1}. {questions[currentStep]}
          </p>
          <textarea
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write your answer..."
            className="w-full  rounded-lg p-4 text-sm resize-none focus:outline-none"
          />
        </div>
      </div>

      {/* Footer: speech, buttons */}
      <div className="sticky bottom-0 bg-[#FAF9F7] pt-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button id="mic" className="text-xl text-[#D57B59]">🎤</button>
          <span className="text-sm text-[#6B6B6B]">
            {isLast ? `Answer and finish` : `Answer and go deeper`}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={loading || !input.trim()}
          className={`w-full rounded-full py-4 text-sm font-medium shadow-md transition
            ${
              !input.trim() || loading
                ? "bg-[#D57B59]/40 text-white/70 cursor-not-allowed"
                : "bg-[#D57B59] text-white active:scale-95"
            }`}
        >
          {loading
            ? "Saving…"
            : isLast
            ? "Finish"
            : "Go deeper"}
        </button>
      </div>
    </div>
  );
}
