import { useEffect, useState } from "react";
import Image from "next/image";

export default function RewardScreen() {
  const [postText, setPostText] = useState("");

  useEffect(() => {
    const fetchLatestPost = async () => {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) return;

      try {
        const res = await fetch(
          "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/get-latest-post",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          }
        );

        const data = await res.json();
        if (data.post) setPostText(data.post);
        console.log("post2", postText);
      } catch (err) {
        console.error("Failed to fetch post:", err);
      }
    };

    fetchLatestPost();
  }, []);

  const handlePublish = () => {
    if (!postText) return alert("No post to publish yet.");

    // Copy post text to clipboard
    navigator.clipboard
      .writeText(postText)
      .then(() => {
        // Open LinkedIn sharing modal
        window.open(
          "https://www.linkedin.com/sharing/share-offsite/",
          "_blank",
          "width=600,height=600"
        );
        alert("✅ Post copied! Paste it into LinkedIn and hit publish.");
      })
      .catch((err) => {
        console.error("Clipboard error:", err);
        alert("Failed to copy the post to clipboard. Please copy it manually.");
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 bg-[#FFFCF7] font-sans">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-black mb-8 mt-20">
          Challenge complete!
        </h1>

        <div className="relative bg-[#C2E4E4] rounded-xl border border-black shadow-[6px_6px_0px_black] w-[320px] h-[520px] px-6 py-10 flex flex-col justify-between items-center">
          <div className="text-black font-semibold text-3xl mb-4 text-center">
            You&apos;ve Earned A <br /> Wisdom Card
          </div>

          <div className="mb-4">
            <Image
              src="/images/star.svg"
              alt="Star Icon"
              width={120}
              height={120}
              className="drop-shadow-md"
            />
          </div>

          <div className="text-2xl font-bold mb-2">Brilliant Star</div>
          <div className="text-md text-[#444] px-4 text-center">
            A new Wisdom Card has landed
          </div>
          <div className="text-sm text-[#777] mt-2 text-center">
            collect it, reflect on it, and shine brighter.
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3 w-full max-w-xs text-center">
        <button
          onClick={handlePublish}
          className="w-full bg-[#A48CF1] text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-[4px_4px_0px_black]"
        >
          Publish Post
        </button>
        <button className="w-full bg-[#A48CF1] text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-[4px_4px_0px_black]">
          Unlock a new challenge
        </button>
      </div>
    </div>
  );
}
