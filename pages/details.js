"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function InsightPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        alert("No session ID found.");
        return;
      }

      try {
        // Step 1: Get session data (which topic + question was chosen)
        const res = await fetch(
          `https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/insights/${sessionId}`
        );
        const sessionData = await res.json();
        setSession(sessionData);

        const { topic, chosenQuestion } = sessionData;

        // Step 2: Fetch full topics (already includes insights)
        const topicRes = await fetch("https://sophiabackend-82f7d870b4bb.herokuapp.com/api/topicsV3");
        const topicsData = await topicRes.json();

        const matchedTopic = topicsData.find((t) => t.topic === topic);
        if (!matchedTopic) throw new Error("Topic not found");

        const matchedInsight = matchedTopic.insights.find(
          (i) => i.question === chosenQuestion
        );
        if (!matchedInsight) throw new Error("Insight not found");

        setInsight(matchedInsight);
        setLoading(false);
        await fetch(
          "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/followup",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: sessionData.sessionId,
              followUpQuestion: matchedInsight.followUpQuestion,
            }),
          }
        );
      } catch (err) {
        console.error("Error loading insight page:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const topic = session?.topic || "Loading...";
  const question = session?.chosenQuestion || "Loading question...";
  const quickTake = insight?.quickTake || "Loading summary...";
  const keyIdeas = insight?.keyIdeas || [];
  const quote = insight?.expertQuote?.quote || "";
  const author = insight?.expertQuote?.author || "";
  const title = insight?.expertQuote?.title || "";
  const fastFacts = insight?.fastFacts || [];

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-[#FAF9F7] font-sans flex flex-col justify-between pb-8">
      {/* Header section */}
      <div
        className="relative bg-bottom bg-no-repeat bg-cover min-h-[200px]"
        style={{ backgroundImage: 'url("/images/Bg.png")' }}
      >
        <img
          src="/images/rocket.svg"
          alt="rocket"
          width={120}
          height={120}
          className="absolute top-[5px] right-[0px] z-10 animate-float"
        />

        <div className="p-6 pt-10">
          <Link href="/">
            <span className="text-2xl font-bold">←</span>
          </Link>
          <div className="mb-3 flex justify-center">
            <button className="bg-white/70 px-4 py-1 text-center text-[#9284EC] rounded-full text-sm font-medium">
              {topic}
            </button>
          </div>
          <h1 className="text-3xl font-bold leading-snug">{question}</h1>
          <p className="text-sm text-[#6c6c6c] mt-3 leading-snug">
            {quickTake}
          </p>
        </div>
      </div>

      {/* Learnings */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-xl">We’ll learn about</h2>
          <p className="text-md text-[#6c6c6c]">3 key ideas</p>
        </div>
        <div className="space-y-3 text-sm">
          {loading && keyIdeas.length === 0
            ? [1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"
                ></div>
              ))
            : keyIdeas.map((idea, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 border border-black rounded-full flex items-center justify-center text-xs font-semibold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 border-b border-dashed pb-1">
                    {idea}
                  </div>
                </div>
              ))}
        </div>

        {/* Expert Quote */}
        {quote && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">A Thought from the Field</h2>
            <div className="bg-white p-4 rounded-xl border border-black shadow-[4px_4px_0px_black] flex items-start gap-3">
              <div>
                <p className="font-semibold text-sm">{author}</p>
                <p className="text-xs text-[#6c6c6c] mb-2">{title}</p>
                <p className="text-sm">{quote}</p>
              </div>
            </div>
          </div>
        )}

        {/* Fast Facts */}
        {fastFacts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-3">Fast Facts</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pr-2">
              {fastFacts.map((fact, idx) => {
                const pastelColors = [
                  "#BEE1E6",
                  "#FDEBD0",
                  "#E4D9F6",
                  "#FCF3CF",
                ];
                const bgColor = pastelColors[idx % pastelColors.length];

                return (
                  <div key={idx} className="relative min-w-[250px] h-[120px]">
                    <div className="absolute top-1 left-1 w-full h-full bg-black rounded-xl -z-10" />
                    <div
                      className="h-full p-4 rounded-xl border border-black shadow-[4px_4px_0px_black] text-sm font-semibold flex items-center"
                      style={{ backgroundColor: bgColor }}
                    >
                      {fact}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="px-6 mt-8">
        <button
          className="w-full py-4 bg-[#A48CF1] text-white text-lg font-semibold rounded-xl shadow-[4px_4px_0px_black]"
          disabled={loading}
          onClick={() => router.push("/reflection")}
        >
          {loading ? "Preparing questions..." : "Proceed to Reflection"}
        </button>
      </div>
    </div>
  );
}
