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
  const [platform, setPlatform] = useState("LinkedIn");
  const [finalAnswerSaved, setFinalAnswerSaved] = useState(false);

  useEffect(() => {
    setInput(answers[currentStep] || "");
  }, [currentStep]);

  // Speech recognition setup
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    const mic = document.getElementById("mic");
    if (mic) {
      mic.onclick = () => {
        recognition.start();
        mic.disabled = true;
      };
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + " " + transcript);
    };

    recognition.onend = () => {
      if (mic) mic.disabled = false;
    };
  }, [currentStep]);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      alert("No session found.");
      return;
    }

    const fetchQuestions = async () => {
      const res = await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/session/" + sessionId
      );
      const data = await res.json();
      if (data.questions?.length) {
        setQuestions(data.questions);
        setAnswers(Array(data.questions.length).fill(""));
      } else {
        alert("No questions found for your session.");
      }
    };

    fetchQuestions();
  }, []);

  const handleNext = () => {
    const updated = [...answers];
    updated[currentStep] = input.trim();
    setAnswers(updated);
  
    if (currentStep === questions.length - 1) {
      setFinalAnswerSaved(true); // ✅ mark as saved
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  

  const handleQuestionClick = (index) => {
    if (index !== questions.length - 1) {
      setFinalAnswerSaved(false); // going back = needs re-confirmation
    }
    setCurrentStep(index);
  };
  

  const handleFinish = async () => {
    const updated = [...answers];
    updated[currentStep] = input.trim();
    setAnswers(updated);
  
    const sessionId = localStorage.getItem("sessionId");
  
    try {
      await fetch("https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/answers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, answers: updated })
      });
  
      router.push("/post"); // Replace with your next page
    } catch (err) {
      console.error("Failed to save answers:", err);
      alert("Something went wrong while saving your answers.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col justify-between px-4 py-6 max-w-[430px] mx-auto">
      <Head>
        <title>Build Your Post</title>
      </Head>

      <div>
        <Link href="/trending" className="mb-4 inline-block text-[#D57B59]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>

        <h1 className="text-2xl font-bold font-serif mt-5 mb-2">
          Let&apos;s build your post.
        </h1>
        <p className="text-sm text-[#6B6B6B] mb-6">
          We&apos;ll guide you with 3–4 quick questions.
        </p>

        <div className="flex gap-3 mb-6">
          {["LinkedIn", "Instagram", "Tiktok"].map((item) => (
            <button
              key={item}
              onClick={() => setPlatform(item)}
              className={`text-sm px-4 py-1 rounded-full border transition font-medium
                ${
                  platform === item
                    ? "bg-[#D57B59] text-white border-[#D57B59]"
                    : "border-black text-black"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        {questions.map((question, index) => (
          <div
            key={index}
            onClick={() => handleQuestionClick(index)}
            className={`p-4 rounded-xl border mb-3 cursor-pointer transition
              ${
                currentStep === index ? "border-[#D57B59]" : "border-black/20"
              }`}
          >
            <p className="text-sm font-semibold">
              Q{index + 1}. {question}
            </p>
            {answers[index] && (
              <p className="mt-2 text-sm text-[#6B6B6B]">{answers[index]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-[#FAF9F7] pt-4 pb-6">
        <div className="border rounded-xl px-4 py-3 flex items-center gap-3 bg-white text-sm text-[#D57B59] mb-4">
          <span>💬</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full bg-transparent outline-none placeholder:text-[#D57B59]/70"
          />
          <button id="mic" type="button" className="text-xl">
            🎤
          </button>
        </div>

        {currentStep === questions.length - 1 && finalAnswerSaved ? (
          <button
            onClick={handleFinish}
            disabled={!input.trim()}
            className={`w-full rounded-full py-4 text-sm font-medium shadow-md transition
      ${
        input.trim()
          ? "bg-[#D57B59] text-white"
          : "bg-[#D57B59]/40 text-white/70 cursor-not-allowed"
      }`}
          >
            Generate Post
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!input.trim()}
            className={`w-full rounded-full py-4 text-sm font-medium shadow-md transition
      ${
        input.trim()
          ? "bg-[#D57B59] text-white"
          : "bg-[#D57B59]/40 text-white/70 cursor-not-allowed"
      }`}
          >
            Save & Continue
          </button>
        )}
      </div>
    </div>
  );
}
