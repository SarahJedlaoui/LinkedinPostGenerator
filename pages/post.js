import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { FiThumbsUp, FiThumbsDown, FiCopy } from "react-icons/fi";
import { FaLinkedinIn, FaInstagram, FaTiktok } from "react-icons/fa";
import ChatEditor from "../components/ChatEditor";
import { useRouter } from "next/router";
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

export default function PostPreview() {
  const router = useRouter();
  const [platform, setPlatform] = useState("LinkedIn");
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null);
  const [postText, setPostText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingFacts, setLoadingFacts] = useState(true);
  const [factChecked, setFactChecked] = useState(false);
  const [activeTab, setActiveTab] = useState("facts");
  const [highlights, setHighlights] = useState([]);
  const [sources, setSources] = useState([]);
  const [facts, setFacts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [ratingFeedback, setRatingFeedback] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);
  const [showFacts, setShowFacts] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [editedPostText, setEditedPostText] = useState("");

  const hasInitialized = useRef(false);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    const sessionId = localStorage.getItem("sessionId");
    const res = await fetch("https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/drafts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const data = await res.json();
    setDrafts(data.drafts || []);
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    const fetchPost = async () => {
      try {
        const res = await fetch("https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();
        setPostText(
          data?.post || "⚠️ Something went wrong. No post was returned."
        );
      } catch (err) {
        console.error("Post generation failed:", err);
      } finally {
        setLoading(false); // ✅ Unlock post immediately
      }
    };

    const fetchFactCheck = async () => {
      try {
        const fcRes = await fetch(
          "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/fact-check",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          }
        );

        const fc = await fcRes.json();
        setHighlights(fc.highlights || []);
        setSources(fc.sources || []);
        setFacts(fc.facts || []);
      } catch (err) {
        console.error("Fact-check failed:", err);
      } finally {
        setLoadingFacts(false); // ✅ Done silently
      }
    };

    fetchPost(); // starts post generation
    fetchFactCheck(); // runs fact-check in background
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFactCheck = () => {
    setFactChecked(true);
    setShowFacts((prev) => !prev);
  };

  const handleRatePost = async () => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    if (showRating) {
      setShowRating(false); // Just toggle off
      return;
    }

    setRatingLoading(true);
    setRatingFeedback("");
    setShowRating(true);

    try {
      const res = await fetch("https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/rate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, post: postText }),
      });
      const data = await res.json();
      setRatingFeedback(data.feedback || "No feedback received.");
    } catch (err) {
      console.error("Rating failed:", err);
      setRatingFeedback("⚠️ Failed to get feedback.");
    } finally {
      setRatingLoading(false);
    }
  };

  const handleEditToggle = async () => {
    if (isInlineEditing) {
      const sessionId = localStorage.getItem("sessionId");
      try {
        await fetch("https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/save-post", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, post: editedPostText }),
        });
        setPostText(editedPostText);
      } catch (err) {
        console.error("Failed to save post", err);
        alert("Failed to save your changes.");
      }
    } else {
      setEditedPostText(postText); // preload existing text
    }

    setIsInlineEditing(!isInlineEditing);
  };

  const handleSelectDraft = async (newPostText) => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    try {
      // Save current main post as a draft
      await fetch("https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, content: postText }),
      });

      // Set the selected draft as the new main post
      await fetch("https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/save-post", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, post: newPostText }),
      });

      // Update UI
      setPostText(newPostText);

      // Re-fetch drafts to see updated version
      const res = await fetch("https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      setDrafts(data.drafts || []);
    } catch (err) {
      console.error("Error swapping draft:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col justify-between px-4 pt-6 pb-10 max-w-[430px] mx-auto font-sans">
      <Head>
        <title>Post Preview</title>
      </Head>

      <div className="flex-1">
        {/* Back and title */}
        <div className="flex items-center gap-2 mb-3">
          <Link href="/reflection">
            <span className="text-2xl font-light">←</span>
          </Link>
          <h1 className="text-2xl font-bold">Your post is ready!</h1>
        </div>

        <p className="text-sm text-[#6c6c6c] mb-2">
          This is where growth happens ..
        </p>

        {/* Progress bar */}
        <div className="w-full h-2 bg-[#EFECE4] rounded-full mb-5">
          <div className="h-full bg-[#A48CF1] rounded-full w-[95%]"></div>
        </div>

        {/* Platform Switch */}
        <div className="flex gap-2 mb-4">
          {Object.keys(THEMES).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`text-sm px-4 py-1 rounded-xl transition border font-medium ${
                platform === p
                  ? "bg-[#A48CF1] text-white border-[#A48CF1]"
                  : "border-black text-black"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Post Card Section */}
        <div className="overflow-x-auto flex gap-4 pb-4 mb-4">
          {/* Main Generated Post */}
          <div className="min-w-[300px] h-[320px] flex flex-col rounded-xl border border-black bg-white shadow-[4px_4px_0px_black]">
            <div
              className={`${THEMES[platform].bg} rounded-[10px_10px_0px_0px] text-white text-sm font-medium px-4 py-2 flex justify-between items-center`}
            >
              <span>{loading ? "Please wait..." : "Your post is ready"}</span>
              <span>{THEMES[platform].icon}</span>
            </div>

            <div className="p-4 text-sm text-[#333] overflow-auto flex-1 whitespace-pre-line">
              {loading ? (
                "Generating post..."
              ) : isInlineEditing ? (
                <textarea
                  value={editedPostText}
                  onChange={(e) => setEditedPostText(e.target.value)}
                  className="w-full h-full text-sm text-[#333] border border-[#ddd] rounded-lg p-2 resize-none"
                />
              ) : (
                postText
              )}
            </div>

            <div className="flex items-center px-4 py-2 border-t border-black/10 text-sm">
              <div className="flex gap-4 text-lg text-black">
                <FiThumbsUp
                  className={`cursor-pointer ${
                    liked === true ? "text-green-600" : ""
                  }`}
                  onClick={() => setLiked(true)}
                />
                <FiThumbsDown
                  className={`cursor-pointer ${
                    liked === false ? "text-red-500" : ""
                  }`}
                  onClick={() => setLiked(false)}
                />
              </div>

              <div className="flex gap-4 items-center ml-auto">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1"
                >
                  <FiCopy />
                  {copied ? "Copied!" : "Copy"}
                </button>

                <button
                  onClick={handleEditToggle}
                  className="text-xs text-[#A48CF1] font-semibold"
                >
                  {isInlineEditing ? "Save" : "Edit here"}
                </button>
              </div>
            </div>
          </div>

          {/* Drafts */}
          {drafts.map((draft, i) => (
            <div
              key={i}
              className="min-w-[300px] h-[320px] relative rounded-xl border border-black bg-white shadow-[4px_4px_0px_black] flex flex-col"
            >
              <div className="bg-gray-800 rounded-[10px_10px_0px_0px] text-white text-sm font-medium px-4 py-2">
                Draft #{i + 1}
              </div>

              <div className="p-4 text-sm text-[#333] overflow-auto flex-1 whitespace-pre-line">
                {draft.content}
              </div>

              <div className="px-4 py-2 text-sm text-right text-[#A48CF1]">
                Saved: {new Date(draft.editedAt).toLocaleDateString()}
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <button
                  onClick={() => handleSelectDraft(draft.content)}
                  className="text-xs text-white bg-[#A48CF1] w-full rounded-xl py-2 shadow-[2px_2px_0px_black] font-semibold"
                >
                  📌 Use this as main post
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-row  sm:flex-row gap-3 mt-4">
          <button
            onClick={handleFactCheck}
            className="text-sm bg-[#A48CF1] text-white px-4 py-2 rounded-xl mb-4 shadow-[2px_2px_0px_black]"
          >
            {showFacts ? "🙈 Hide facts" : "🧠 Fact check"}
          </button>

          <button
            onClick={handleRatePost}
            disabled={ratingLoading}
            className="text-sm bg-[#A48CF1] text-white px-4 py-2 rounded-xl mb-4 shadow-[2px_2px_0px_black]"
          >
            {showRating ? "🙈 Hide feedback" : "🤖 Rate my post"}
          </button>
        </div>

        {showRating && (
          <div className="bg-white border border-black rounded-xl p-4 text-sm mt-2 mb-5 shadow-[4px_4px_0px_black]">
            <p className="font-semibold mb-2">AI Feedback:</p>
            {ratingLoading ? (
              <p className="italic text-[#999]">Analyzing your post...</p>
            ) : (
              <p>{ratingFeedback}</p>
            )}
          </div>
        )}
      </div>
      {!isEditing && factChecked && showFacts && (
        <div>
          {/* Tabs */}
          <div className="flex gap-6 border-b border-[#E7DCD7] text-sm mb-3">
            <button
              onClick={() => setActiveTab("facts")}
              className={`pb-1 ${
                activeTab === "facts"
                  ? "text-[#A48CF1] border-b-2 border-[#A48CF1]"
                  : ""
              }`}
            >
              🧠 Facts
            </button>
            <button
              onClick={() => setActiveTab("highlights")}
              className={`pb-1 ${
                activeTab === "highlights"
                  ? "text-[#A48CF1] border-b-2 border-[#A48CF1]"
                  : ""
              }`}
            >
              ✅ Highlights
            </button>
            <button
              onClick={() => setActiveTab("sources")}
              className={`pb-1 ${
                activeTab === "sources"
                  ? "text-[#A48CF1] border-b-2 border-[#A48CF1]"
                  : ""
              }`}
            >
              📄 Sources
            </button>
          </div>

          {/* Tab Content */}
          {loadingFacts ? (
            <p className="text-sm text-[#999]">Loading fact-check results...</p>
          ) : activeTab === "facts" ? (
            facts.length === 0 ? (
              <p className="text-sm text-[#999]">No facts available.</p>
            ) : (
              facts.map((fact, index) => (
                <div
                  key={index}
                  className={`relative mb-4 p-4 rounded-xl border border-black shadow-[4px_4px_0px_black] text-sm font-semibold`}
                  style={{
                    backgroundColor: ["#FDE68A", "#D1FAE5", "#FCD5CE"][
                      index % 3
                    ],
                  }}
                >
                  <p className="mb-3">{fact.fact}</p>
                  <button className="bg-white text-black text-xs font-medium px-3 py-1 rounded-xl shadow-[2px_2px_0px_black]">
                    Add this to your post
                  </button>
                  <div className="absolute bottom-2 right-2 text-xl">🧠</div>
                </div>
              ))
            )
          ) : activeTab === "highlights" ? (
            highlights.length === 0 ? (
              <p className="text-sm text-[#999]">
                No fact-check highlights found.
              </p>
            ) : (
              highlights.map((fact, index) => (
                <div
                  key={index}
                  className="mb-4 text-sm bg-white p-3 rounded-lg border border-[#E7DCD7]"
                >
                  <p className="font-semibold mb-1">Claim: “{fact.claim}”</p>
                  <p>
                    {fact.verdict === "confirmed"
                      ? "✅"
                      : fact.verdict === "incorrect"
                      ? "❌"
                      : "⚠️"}{" "}
                    {fact.explanation}
                  </p>
                </div>
              ))
            )
          ) : sources.length === 0 ? (
            <p className="text-sm text-[#999]">No sources provided.</p>
          ) : (
            sources.map((source, index) => (
              <div
                key={index}
                className="mb-4 text-sm bg-white p-3 rounded-lg border border-[#E7DCD7] break-words"
              >
                <p className="font-semibold mb-1">{source.title}</p>
                <p className="mb-1">{source.snippet}</p>
                <div className="overflow-x-auto">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A48CF1] underline break-all"
                  >
                    {source.url}
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {isEditing && (
        <ChatEditor
          onSave={async (newPost) => {
            setPostText(newPost);
            await fetchDrafts(); // 👈 Refresh draft list after save
          }}
        />
      )}
      {/* Bottom buttons */}
      <div className="flex justify-between items-center gap-4 px-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-[#A48CF1] font-semibold"
        >
          {isEditing ? "Close Editor" : "Edit post"}
        </button>

        <button
          onClick={() => router.push("/journey")}
          className="bg-[#A48CF1] text-white font-semibold px-6 py-3 rounded-xl shadow-[4px_4px_0px_black]"
        >
          Finalize Post
        </button>
      </div>
    </div>
  );
}
