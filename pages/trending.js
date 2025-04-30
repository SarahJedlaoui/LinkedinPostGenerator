import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

const topicData = {
  "Tech Industry | AI | Design": [
    "Impact of AI on UX 🔥",
    "How Can UX Survive AI?",
    "Designing with ChatGPT",
    "Prompt Design = UX 2.0",
    "Ethical AI Interfaces",
    "Rise of AI Product Designers",
  ],
  "Content | Social | Thought Leadership": [
    "How to Present on LinkedIn 🔥",
    "Public Post",
    "Turning Insights into Posts",
    "Share Your Workflow",
    "Personal Coaching",
    "Personal Brand",
  ],
  "Beauty | Aesthetics": [
    "TikTok Beauty Trends 🔥",
    "Glass Skin Obsession",
    "Before & After: What Converts?",
  ],
  "Wellness | Mental Health": [
    "AI in Daily Wellness",
    "Journaling with Chatbots",
    "Design for Calm",
  ],
};

export default function TopicPicker() {
  const router = useRouter();
  const [openSections, setOpenSections] = useState(Object.keys(topicData));
  const [selected, setSelected] = useState("");
  const [customIdea, setCustomIdea] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleSection = (section) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleSelect = (topic) => {
    setSelected((prev) => (prev === topic ? "" : topic));
  };

  const handleContinue = async () => {
    const topic = customIdea.trim() || selected;
    const sessionId = localStorage.getItem("sessionId");

    if (!topic || !sessionId) {
      alert("Missing topic or session ID");
      return;
    }
    setLoading(true); // Start loading UI
    try {
      // Save the topic
      await fetch("http://localhost:5000/api/persona/topic", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, topic }),
      });

      // ✅ Generate and save questions
      await fetch("http://localhost:5000/api/persona/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      router.push("/guided-post");
    } catch (err) {
      console.error("Failed to save topic:", err);
      alert("Something went wrong saving your topic.");
      setLoading(false); // Reset if something goes wrong
    }
  };

  // Speech-to-text setup
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
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCustomIdea(transcript);
    };
    recognition.onend = () => {
      if (mic) mic.disabled = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col justify-between px-4 py-6 max-w-[430px] mx-auto">
      <Head>
        <title>Pick a Topic</title>
      </Head>

      <div>
        <Link href="/" className="mb-4 inline-block text-[#D57B59]">
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

        <h1 className="text-2xl font-bold font-serif mb-2 mt-5">
          What&apos;s on your mind today?
        </h1>
        <p className="text-sm text-[#6B6B6B] mb-6">
          Choose a trending topic or enter your own.
        </p>

        {Object.entries(topicData).map(([category, topics]) => (
          <div key={category} className="mb-4">
            <button
              onClick={() => toggleSection(category)}
              className="flex justify-between items-center w-full text-left font-semibold text-sm mb-2"
            >
              <span>{category}</span>
              <span>{openSections.includes(category) ? "▴" : "▾"}</span>
            </button>

            {openSections.includes(category) && (
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleSelect(topic)}
                    className={`px-3 py-1 text-sm rounded-full border transition
                      ${
                        selected === topic
                          ? "bg-[#D57B59] text-white border-[#D57B59]"
                          : "border-black text-black"
                      }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-[#FAF9F7] pt-4 pb-6">
        <div className="border rounded-xl px-4 py-3 flex items-center gap-3 bg-white text-sm text-[#D57B59] mb-4">
          <span>💡</span>
          <input
            type="text"
            value={customIdea}
            onChange={(e) => setCustomIdea(e.target.value)}
            placeholder="Got a different idea? Tell me what you’d like to post about."
            className="w-full bg-transparent outline-none placeholder:text-[#D57B59]/70"
          />
          <button id="mic" type="button" className="text-xl">
            🎤
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={(!customIdea && !selected) || loading}
          className={`w-full rounded-full py-4 text-sm font-medium shadow-md transition
    ${
      (!customIdea && !selected) || loading
        ? "bg-[#D57B59]/40 text-white/70 cursor-not-allowed"
        : "bg-[#D57B59] text-white"
    }`}
        >
          {loading ? "Thinking..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
