import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

export default function TrendingPage() {
  const router = useRouter();
  const [topics, setTopics] = useState([]);
  const [loadingCustomInput, setLoadingCustomInput] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [userCount, setUserCount] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const pastelColors = ["#D6EAF8", "#FADBD8", "#FCF3CF", "#D5F5E3"];
  const [loading, setLoading] = useState(false);
  const hasInitialized = useRef(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const loadingMessages = [
    "Collecting information...",
    "Thanks for your patience!",
    "Almost there — promise 🤞",
    "Good things take time ⏳",
  ];

  useEffect(() => {
    if (!router.isReady || hasInitialized.current) return;
    hasInitialized.current = true;

    const setupSessionAndTopics = async () => {
      try {
        // ✅ Fetch topics
        const res = await fetch(
          "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/topicsV3"
        );
        const data = await res.json();
        console.log("topics", data);
        const transformed = data.map((item) => ({
          topic: item.topic,
          questions: item.insights.map((insight) => insight.question),
          insights: item.insights,
        }));

        setTopics(transformed);
        setSelectedTopicIndex(0);

        // 🧠 Create user session
        localStorage.removeItem("sessionId");
        let storedSessionId = localStorage.getItem("sessionId");

        if (!storedSessionId) {
          const sessionRes = await fetch(
            "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/session",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }
          );
          const sessionData = await sessionRes.json();
          storedSessionId = sessionData.sessionId;
          localStorage.setItem("sessionId", storedSessionId);
        }

        setSessionId(storedSessionId);
        setUserCount(Math.floor(Math.random() * 3000) + 1000);
      } catch (err) {
        console.error("Init error:", err);
      }
    };

    setupSessionAndTopics();
  }, [router.isReady]);

  // ✅ 2. Handle Start
  const handleStart = async () => {
    if (!topics[selectedTopicIndex] || !sessionId) return;

    const topic = topics[selectedTopicIndex].topic;
    const question = topics[selectedTopicIndex].questions[currentQuestionIndex];

    setLoading(true);

    try {
      await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/topic",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, topic }),
        }
      );

      await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/question",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, question }),
        }
      );

      // ❌ Removed insights generation — now comes preloaded from backend

      router.push("/details");
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [loading]);

  const handleCustomTopicSubmit = async () => {
    const input = userInput.trim();
    if (!input) return;

    try {
      setLoadingCustomInput(true);
      const sessionId = localStorage.getItem("sessionId");
      const res = await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/extract-topic-question",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, text: input }),
        }
      );

      const data = await res.json();
      router.push("/reflection?from=home");
    } catch (err) {
      console.error("Failed to extract topic/question:", err);
      alert("Something went wrong.");
      setLoadingCustomInput(false);
    }
  };

  return (
    <div className="max-w-[430px] mx-auto bg-[#FAF9F7] min-h-[92vh] flex flex-col gap-9 px-5 pb-8 font-sans">
      {/* Top + Scrollable Content */}
      <div className="flex flex-col justify-start mt-5">
        <h1 className="text-2xl font-bold text-[#222] mb-1">
          Choose your Content Quest for today
        </h1>
        <p className="text-sm text-[#6c6c6c] mb-3">
          Progress unlocked: You&apos;re in the game.
        </p>

        <div className="h-2 w-full bg-[#EAE7DE] rounded-full mb-4">
          <div className="h-full bg-[#A48CF1] rounded-full w-[25%]"></div>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-4 whitespace-nowrap no-scrollbar">
          {topics.map((t, i) => (
            <button
              key={i}
              className={`px-4 py-1.5 text-sm rounded-xl transition-all ${
                selectedTopicIndex === i
                  ? "bg-[#A48CF1] text-white"
                  : "border border-black text-black"
              }`}
              onClick={() => setSelectedTopicIndex(i)}
            >
              {t.topic}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-semibold text-center font-medium ">
          Today’s Question
        </h2>
      </div>

      <div>
        {topics[selectedTopicIndex]?.questions && (
          <div className="mb-6">
            <Swiper
              modules={[EffectCoverflow]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={1.2}
              spaceBetween={-40}
              onSlideChange={(swiper) =>
                setCurrentQuestionIndex(swiper.realIndex)
              }
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 150,
                modifier: 1.5,
                slideShadows: false,
              }}
              className="h-[360px]"
            >
              {topics[selectedTopicIndex].questions.map((question, index) => (
                <SwiperSlide key={index}>
                  <div
                    onClick={handleStart}
                    className="w-[280px] h-[320px] mx-auto rounded-xl border border-black shadow-[4px_4px_0px_black] relative flex flex-col items-center justify-center p-6 text-center text-lg font-semibold"
                    style={{
                      backgroundColor:
                        pastelColors[index % pastelColors.length],
                    }}
                  >
                    <div className="text-sm text-[#444] mb-2">
                      {topics[selectedTopicIndex].topic}
                    </div>
                    <span className="z-10">{question}</span>
                    <Image
                      src="/images/!.svg"
                      alt="question icon"
                      className="absolute bottom-4 right-4"
                      width={96}
                      height={96}
                    />
                    {/* ➡️ Arrow circle */}
                    <div className="absolute bottom-3 right-3 z-20 bg-white bg-opacity-70 rounded-full p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[430px] bg-white rounded-xl shadow-md px-4 py-3 flex items-center justify-between border border-gray-200">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="What would you like to post about today?"
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-600"
        />
        <button
          onClick={handleCustomTopicSubmit}
          disabled={loadingCustomInput}
          className="ml-3 bg-[#A48CF1] p-2 rounded-full shadow flex items-center justify-center w-9 h-9"
        >
          {loadingCustomInput ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
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
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
