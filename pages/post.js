import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  FiThumbsUp,
  FiThumbsDown,
  FiCopy
} from "react-icons/fi";
import {
  FaLinkedinIn,
  FaInstagram,
  FaTiktok
} from "react-icons/fa";

const THEMES = {
  LinkedIn: {
    bg: "bg-[#0077B5]",
    icon: <FaLinkedinIn className="text-white" />
  },
  Instagram: {
    bg: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
    icon: <FaInstagram className="text-white" />
  },
  Tiktok: {
    bg: "bg-black",
    icon: <FaTiktok className="text-white" />
  }
};

export default function PostPreview() {
  const [platform, setPlatform] = useState("LinkedIn");
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null); // null | true | false
  const [customIdea, setCustomIdea] = useState("");
  const [postText, setPostText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    try {
      const res = await fetch("https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });
      const data = await res.json();
      setPostText(data.post);
    } catch (err) {
      console.error("Failed to fetch post:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

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
      setCustomIdea(transcript);
    };

    recognition.onend = () => {
      if (mic) mic.disabled = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col justify-between px-4 py-6 max-w-[430px] mx-auto">
      <Head>
        <title>Post Preview</title>
      </Head>

      <div>
        <Link href="/guided-post" className="mb-4 inline-block text-[#D57B59]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <h1 className="text-2xl font-bold font-serif mt-5 mb-2">Here’s your post, ready to publish.</h1>
        <p className="text-sm text-[#6B6B6B] mb-6">
          Based on your input, we’ve crafted a high-value post. Want to make edits or fact-check it?
        </p>

        {/* Platform Switch */}
        <div className="flex gap-3 mb-4">
          {Object.keys(THEMES).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`text-sm px-4 py-1 rounded-full border transition font-medium
              ${platform === p ? "bg-[#D57B59] text-white border-[#D57B59]" : "border-black text-black"}`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Post Card */}
        <div className="rounded-xl bg-white border border-black/10 shadow-sm">
          <div className={`${THEMES[platform].bg} text-white text-sm font-medium px-4 py-2 flex justify-between items-center rounded-t-xl`}>
            <span>Your post is ready</span>
            <span>{THEMES[platform].icon}</span>
          </div>

          <div className="p-4 text-sm whitespace-pre-line text-[#333]">
            {loading ? "Generating post..." : postText}
          </div>

          {!loading && (
            <div className="flex justify-between items-center px-4 py-2 border-t border-black/5 text-[#D57B59] text-sm">
              <div className="flex gap-4 text-xl">
                <FiThumbsUp
                  className={`${liked === true ? "text-green-600" : "text-[#000]"} cursor-pointer`}
                  onClick={() => setLiked(true)}
                />
                <FiThumbsDown
                  className={`${liked === false ? "text-red-500" : "text-[#000]"} cursor-pointer`}
                  onClick={() => setLiked(false)}
                />
              </div>
              <button onClick={handleCopy} className="text-sm flex items-center gap-2">
                <FiCopy />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Small Fact Check Button */}
      <div className="mt-6 flex justify-start">
      <Link href="/fact-check" scroll={false}>
        <button className="text-xs bg-[#D57B59] text-white px-3 py-2 rounded-full">
          🛒 Fact check
        </button>
        </Link>
      </div>

      {/* Idea Input Bar */}
      <div className="sticky bottom-0 bg-[#FAF9F7] pt-4 pb-6">
        <div className="border rounded-xl px-4 py-3 flex items-center gap-3 bg-white text-sm text-[#D57B59]">
          <span>💡</span>
          <input
            type="text"
            value={customIdea}
            onChange={(e) => setCustomIdea(e.target.value)}
            placeholder="Got a different idea? Tell me what you’d like to post about."
            className="w-full bg-transparent outline-none placeholder:text-[#D57B59]/70"
          />
          <button id="mic" type="button" className="text-xl">🎤</button>
        </div>
      </div>
    </div>
  );
}
