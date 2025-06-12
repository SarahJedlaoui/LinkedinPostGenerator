import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useTokenSync } from "../utils/auth";
import { FiThumbsUp, FiThumbsDown, FiCopy } from "react-icons/fi";
import { FaLinkedinIn, FaInstagram, FaTiktok } from "react-icons/fa";
import ChatEditor from "../components/ChatEditor";
import { useRouter } from "next/router";
import Link from "next/link";
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
  const imagesRef = useRef(null);

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
  const [activeToolTab, setActiveToolTab] = useState("content");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    fetchDrafts();
  }, []);
  useEffect(() => {
    if (generatedImages.length > 0 && imagesRef.current) {
      imagesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [generatedImages]);
  const fetchDrafts = async () => {
    const sessionId = localStorage.getItem("sessionId");
    const res = await fetch(
      "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/drafts",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      }
    );
    const data = await res.json();
    setDrafts(data.drafts || []);
  };
  useTokenSync();

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(
          "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/generate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          }
        );

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

    const fetchFactCheckWithRetryUntilReady = async () => {
      const maxAttempts = 8;
      const delay = 1500;
      let attempt = 0;

      while (attempt < maxAttempts) {
        try {
          const res = await fetch(
            "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/fact-check",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId }),
            }
          );

          if (res.status === 404) {
            // Backend not ready yet
            attempt++;
            await new Promise((r) => setTimeout(r, delay));
            continue;
          }

          const fc = await res.json();

          // Only exit if facts are present
          if ((fc?.facts || []).length > 0 || attempt >= maxAttempts - 1) {
            setHighlights(fc.highlights || []);
            setSources(fc.sources || []);
            setFacts(fc.facts || []);
            break;
          }

          attempt++;
          await new Promise((r) => setTimeout(r, delay));
        } catch (err) {
          console.warn(`Fact-check attempt ${attempt + 1} failed`);
          attempt++;
          await new Promise((r) => setTimeout(r, delay));
        }
      }

      setLoadingFacts(false);
    };

    // ✅ Sequential: wait for post before running fact-check
    (async () => {
      await fetchPost();
      await fetchFactCheckWithRetryUntilReady();
    })();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFactCheck = () => {
    setFactChecked(true);
  };

  const handleRatePost = async () => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    setRatingLoading(true);
    setRatingFeedback("");
    setShowRating(true);

    try {
      const res = await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/rate-post",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, post: postText }),
        }
      );
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
        await fetch(
          "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/save-post",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, post: editedPostText }),
          }
        );
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
      await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/save-draft",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, content: postText }),
        }
      );

      // Set the selected draft as the new main post
      await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/save-post",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, post: newPostText }),
        }
      );

      // Update UI
      setPostText(newPostText);

      // Re-fetch drafts to see updated version
      const res = await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/drafts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        }
      );
      const data = await res.json();
      setDrafts(data.drafts || []);
    } catch (err) {
      console.error("Error swapping draft:", err);
      alert("Something went wrong.");
    }
  };

  const handleApplyFeedback = async () => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId || !ratingFeedback) return;

    try {
      const res = await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/apply-feedback",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            feedback: ratingFeedback,
          }),
        }
      );

      const data = await res.json();
      if (data.success && data.updatedPost) {
        setPostText(data.updatedPost);
        alert("✅ Feedback applied to your post!");
      } else {
        alert("❌ Failed to apply feedback.");
      }
    } catch (err) {
      console.error("Apply feedback error:", err);
      alert("Something went wrong.");
    }
  };

  const handleGenerateImage = async () => {
    setImageLoading(true);
    try {
      const res = await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/generate-image",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ post: postText }),
        }
      );

      const data = await res.json();
      if (data.image) {
        setGeneratedImage(`data:image/png;base64,${data.image}`);
      } else {
        alert("No image returned.");
      }
    } catch (err) {
      console.error("Image generation failed:", err);
      alert("Something went wrong generating the image.");
    } finally {
      setImageLoading(false);
    }
  };

  const handleGenerateImages = async () => {
    setLoadingImages(true);
    try {
      const res = await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/images/generate-social-images",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ post: postText }),
        }
      );
      const data = await res.json();
      setGeneratedImages(data.images || []);
    } catch (err) {
      console.error("Image generation failed:", err);
    } finally {
      setLoadingImages(false);
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

        {/* Post Card Section */}

        <div className="overflow-x-auto whitespace-nowrap border-b border-[#E7DCD7] text-sm mb-3 mt-5 no-scrollbar">
          <div className="flex gap-6 px-1">
            {[
              { key: "content", label: "📝 Content" },
              { key: "chat", label: "💬 Chat" },
              { key: "rate", label: "✅ Rate" },
              { key: "highlights", label: "📌 Highlights" },
              { key: "sources", label: "📄 Sources" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveToolTab(key);
                  if (key === "rate") handleRatePost();
                  if (["facts", "highlights", "sources"].includes(key))
                    handleFactCheck();
                }}
                className={`pb-1 whitespace-nowrap ${
                  activeToolTab === key
                    ? "text-[#A48CF1] border-b-2 border-[#A48CF1]"
                    : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-2">
          {activeToolTab === "chat" && (
            <ChatEditor
              onSave={async (newPost) => {
                setPostText(newPost);
                await fetchDrafts();
              }}
            />
          )}

          {activeToolTab === "content" && (
            <div className="overflow-x-auto flex gap-4 pb-4 no-scrollbar">
              {/* Main Generated Post */}
              <div className="w-[380px] min-w-[300px] h-full flex flex-col rounded-xl  bg-white ">
                <div
                  className={`${THEMES[platform].bg} rounded-[10px_10px_0px_0px] text-white text-sm font-medium px-4 py-2 flex justify-between items-center`}
                >
                  <span>
                    {loading ? "Please wait..." : "Your post is ready"}
                  </span>
                  <span>{THEMES[platform].icon}</span>
                </div>

                <div
                  className="p-4 text-sm text-[#333] overflow-auto whitespace-pre-line"
                  style={{ minHeight: "200px", flexGrow: 1 }}
                >
                  {loading ? (
                    <div className="min-h-[200px] flex items-center justify-center text-gray-500">
                      Generating post...
                    </div>
                  ) : isInlineEditing ? (
                    <textarea
                      value={editedPostText}
                      onChange={(e) => setEditedPostText(e.target.value)}
                      className="w-full h-full text-sm text-[#333] border border-[#ddd] rounded-lg p-2 resize-none"
                    />
                  ) : (
                    <>
                      <div className="min-h-[200px]">
                        {postText}
                        {generatedImages.length > 0 && (
                          <div
                            ref={imagesRef}
                            className="mt-6 overflow-x-auto no-scrollbar"
                          >
                            <div className="flex space-x-4">
                              {generatedImages.map((img, index) => (
                                <div key={index} className="shrink-0 w-[200px]">
                                  <img
                                    src={img}
                                    alt={`Generated ${index}`}
                                    className="rounded-xl shadow w-full"
                                  />
                                  <a
                                    href={img}
                                    download={`sophia-image-${index + 1}.png`}
                                    className="inline-block mt-2 text-xs bg-[#A48CF1] text-white px-2 py-1 rounded shadow"
                                  >
                                    Download Image {index + 1}
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="sticky bottom-0 left-0 w-full bg-white px-4 py-1 ">
                  <button
                    onClick={handleGenerateImages}
                    disabled={loadingImages}
                    className="mt-1 text-[#A48CF1] font-semibold text-sm flex items-center gap-2"
                  >
                    {loadingImages ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin text-[#A48CF1]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Generating images...
                      </>
                    ) : generatedImages.length > 0 ? (
                      "🔁 Regenerate Images"
                    ) : (
                      "✨ Generate Post Images"
                    )}
                  </button>
                </div>
                <div className="flex items-center px-4 py-2 border-t border-black/10 text-sm">
                  <div className="flex gap-10 text-lg text-black">
                    <button
                      onClick={handleCopy}
                      className="flex text-sm items-center gap-1"
                    >
                      <FiCopy />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={() => router.push("/journey")}
                      className="text-xs text-[#A48CF1] font-semibold"
                    >
                      Finalize Post
                    </button>
                    <button
                      onClick={() => router.push("/saved")}
                      className="text-xs text-[#A48CF1] font-semibold"
                    >
                      Save for later
                    </button>
                  </div>

                  <div className="flex gap-4 items-center ml-auto">
                    <button
                      onClick={handleEditToggle}
                      className="flex  text-sm items-center gap-1"
                    >
                      {isInlineEditing ? "Save" : "Edit"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Drafts */}
              {drafts.map((draft, i) => (
                <div
                  key={i}
                  className="min-w-[300px] h-[620px] relative rounded-xl border border-black bg-white shadow-[4px_4px_0px_black] flex flex-col"
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
          )}

          {activeToolTab === "rate" && showRating && (
            <div className="bg-white border border-black rounded-xl p-4 text-sm shadow-[4px_4px_0px_black]">
              <p className="font-semibold mb-2">AI Feedback:</p>
              {ratingLoading ? (
                <p className="italic text-[#999]">Analyzing your post...</p>
              ) : (
                <>
                  <p className="mb-3">{ratingFeedback}</p>
                  <button
                    onClick={handleApplyFeedback}
                    className="bg-[#A48CF1] text-white px-4 py-2 rounded-lg shadow-[2px_2px_0px_black] text-xs font-semibold"
                  >
                    Apply Changes
                  </button>
                </>
              )}
            </div>
          )}

          {activeToolTab === "highlights" && (
            <div className="mt-2">
              {loadingFacts ? (
                <p className="text-sm text-[#999]">Loading highlights...</p>
              ) : highlights.length === 0 ? (
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
              )}
            </div>
          )}

          {activeToolTab === "sources" && (
            <div className="mt-2">
              {loadingFacts ? (
                <p className="text-sm text-[#999]">Loading sources...</p>
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
        </div>
      </div>
    </div>
  );
}
