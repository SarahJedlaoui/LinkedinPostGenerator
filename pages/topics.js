import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { requireAuth } from "../utils/requireAuth";
export default function TrendingPage() {
  const router = useRouter();
  const [topics, setTopics] = useState([]);
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

  //  1. Fetch Topics + Session Setup
  useEffect(() => {
    if (!router.isReady || hasInitialized.current) return;
    hasInitialized.current = true;

    const setupSessionAndTopics = async () => {
      const userId = router.query.user;
      if (!userId) {
        console.error("Missing userId in query params");
        return;
      }
      const token = router.query.token;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
      }
      requireAuth();
      try {
        // Fetch topics from new V3 route
        const res = await fetch(
          "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/topicsV3"
        );
        const data = await res.json();

        const transformed = data.map((item) => ({
          topic: item.topic,
          questions: item.insights.map((insight) => insight.question),
          insights: item.insights,
        }));

        setTopics(transformed);
        setSelectedTopicIndex(0);

        // Reset session
        localStorage.removeItem("sessionId");
        let storedId = localStorage.getItem("sessionId");

        if (!storedId) {
          const sessionRes = await fetch(
            "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId }),
            }
          );
          const sessionData = await sessionRes.json();
          storedId = sessionData.sessionId;
          localStorage.setItem("sessionId", storedId);
        }

        setSessionId(storedId);
        setUserCount(Math.floor(Math.random() * 3000) + 1000);
      } catch (err) {
        console.error("Init error:", err);
      }
    };

    setupSessionAndTopics();
  }, [router.isReady]); // 👈 Depend on router.isReady

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

  return (
    <div className="max-w-[430px] mx-auto bg-[#FAF9F7] min-h-screen flex flex-col justify-between px-5 py-8 font-sans">
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
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {userCount && (
          <div className="text-center text-3xl text-[#222] font-medium mb-6">
            {userCount.toLocaleString()} users are working on this today
          </div>
        )}
      </div>

      {/* Bottom button */}
      <button
        disabled={loading}
        onClick={handleStart}
        className={`w-full py-4 text-white text-lg font-semibold rounded-xl shadow-[4px_4px_0px_black] transition-all ${
          loading ? "bg-[#A48CF1]/70" : "bg-[#A48CF1]"
        }`}
      >
        {loading ? (
          <div className="flex justify-center items-center gap-2">
            <span>{loadingMessages[messageIndex]}</span>
            <div className="bouncing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : (
          "Start Challenge"
        )}
      </button>
    </div>
  );
}
