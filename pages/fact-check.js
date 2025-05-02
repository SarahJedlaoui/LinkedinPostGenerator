import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { FaLinkedinIn, FaInstagram, FaTiktok } from "react-icons/fa";

const THEMES = {
  LinkedIn: {
    bg: "bg-[#0077B5]",
    icon: <FaLinkedinIn className="text-white" />,
  },
  Instagram: {
    bg: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
    icon: <FaInstagram className="text-white" />,
  },
  Tiktok: {
    bg: "bg-black",
    icon: <FaTiktok className="text-white" />,
  },
};

export default function FactCheckPage() {
  const [post, setPost] = useState("");
  const [editedPost, setEditedPost] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const [sources, setSources] = useState([]);
  const [activeTab, setActiveTab] = useState("highlights");
  const [platform, setPlatform] = useState("LinkedIn");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFactCheck = async () => {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) return alert("No session found");

      try {
        const res = await fetch("https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/fact-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText);
        }

        const data = await res.json();
        setPost(data.post);
        setEditedPost(data.post);
        setHighlights(data.highlights || []);
        setSources(data.sources || []);
      } catch (err) {
        console.error("Fact-check error:", err.message);
        alert("Failed to load fact-check results.");
      } finally {
        setLoading(false);
      }
    };

    fetchFactCheck();
  }, []);

  const platformColor = {
    LinkedIn: "#0A66C2",
    Instagram: "#E1306C",
    Tiktok: "#000000",
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] px-4 py-6 max-w-[430px] mx-auto flex flex-col justify-between">
      <Head>
        <title>Fact Check</title>
      </Head>

      <div>
        <Link href="/post" className="mb-4 inline-block text-[#D57B59]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <h1 className="text-xl font-bold font-serif mb-1">Verified insights for credibility.</h1>
        <p className="text-sm text-[#6B6B6B] mb-4">
          We&apos;ve scanned the web and latest research to fact-check key points in your post.
        </p>

        <div className="flex gap-3 mb-4">
          {Object.keys(THEMES).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`text-sm px-4 py-1 rounded-full border transition font-medium ${
                platform === p ? "bg-[#D57B59] text-white border-[#D57B59]" : "border-black text-black"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Post Header */}
        <div
          className="mb-4 rounded-md p-2 text-sm font-semibold flex justify-between items-center"
          style={{ backgroundColor: platformColor[platform], color: "white" }}
        >
          <span>Post Summary:</span>
          <span>{THEMES[platform].icon}</span>
        </div>

        {/* Post Content */}
        {isEditing ? (
          <textarea
            value={editedPost}
            onChange={(e) => setEditedPost(e.target.value)}
            className="w-full bg-white text-sm border border-gray-200 rounded-lg p-3 mb-4 resize-none outline-none"
            rows={5}
          />
        ) : (
          <div className="bg-white p-4 rounded-lg text-sm mb-4 border border-gray-200">{editedPost}</div>
        )}

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#E7DCD7] text-sm mb-3">
          <button
            onClick={() => setActiveTab("highlights")}
            className={`pb-1 ${activeTab === "highlights" ? "text-[#D57B59] border-b-2 border-[#D57B59]" : ""}`}
          >
            ✅ Highlights
          </button>
          <button
            onClick={() => setActiveTab("sources")}
            className={`pb-1 ${activeTab === "sources" ? "text-[#D57B59] border-b-2 border-[#D57B59]" : ""}`}
          >
            📄 Sources
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-[#999]">Loading fact-check results...</p>
        ) : activeTab === "highlights" ? (
          highlights.length === 0 ? (
            <p className="text-sm text-[#999]">No fact-check highlights found.</p>
          ) : (
            highlights.map((fact, index) => (
              <div key={index} className="mb-4 text-sm bg-white p-3 rounded-lg border border-[#E7DCD7]">
                <p className="font-semibold mb-1">Claim: “{fact.claim}”</p>
                <p>
                  {fact.verdict === "confirmed" ? "✅" : fact.verdict === "incorrect" ? "❌" : "⚠️"} {fact.explanation}
                </p>
              </div>
            ))
          )
        ) : sources.length === 0 ? (
          <p className="text-sm text-[#999]">No sources provided.</p>
        ) : (
          sources.map((source, index) => (
            <div key={index} className="mb-4 text-sm bg-white p-3 rounded-lg border border-[#E7DCD7]">
              <p className="font-semibold mb-1">{source.title}</p>
              <p className="mb-1">{source.snippet}</p>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[#D57B59] underline">
                {source.url}
              </a>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4">
        {isEditing ? (
          <button
            onClick={() => {
              setIsEditing(false);
              setPost(editedPost); // Optional: Save back to backend later
            }}
            className="text-[#D57B59] font-medium text-sm"
          >
            Done Editing
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-[#D57B59] font-medium text-sm">
            Edit my post
          </button>
        )}
        <button className="bg-[#D57B59] text-white px-6 py-3 rounded-full text-sm font-medium">Approve</button>
      </div>
    </div>
  );
}
