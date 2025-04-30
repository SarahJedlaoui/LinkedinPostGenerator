import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [topic, setTopic] = useState("");

  const handleContinue = () => {
    if (!topic.trim()) return;
    router.push(`/topics?topic=${encodeURIComponent(topic.trim())}`);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-between bg-[#FAF9F7]`}
    >

      <Head>
        <title>Sophia</title>
        <meta name="Sophia" content="width=device-width,initial-scale=1" />
      </Head>

      {/* ----------------- 1 · Logo ------------- */}
      <div className="pt-40 sm:pt-26 laptop:pt-8">
        <Image
          src="/images/sophia.svg"
          alt="Sophia logo"
          width={140}
          height={140}
          className="mx-auto"
          priority
        />
      </div>

      {/* --------------- 2 · Question & input --------------- */}
      <main className="w-full max-w-[430px] px-6 flex flex-col gap-8 -mt-28 laptop:pt-28">
        <h1 className="text-center font-serif font-semibold leading-tight text-[28px] sm:text-3xl">
          Hey!
          <br />
          What area are you&nbsp;most
          <br />
          interested in exploring today
        </h1>

        <label className="block">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="UX & AI Evolution"
            className="w-full rounded-full border border-[#D57B59] px-5 py-4
                       placeholder:text-[#D57B59]/70 outline-none
                       focus:ring-2 focus:ring-[#D57B59]"
          />
          <p className="mt-3 text-center text-sm text-[#6B6B6B]">
            This is to personalize your experience<span className="align-super">.</span>
          </p>
        </label>
      </main>

      {/* ---------------- 3 · CTA button ---------------- */}
      <div className="w-full max-w-[430px] px-6 pb-10">
        <button
          onClick={handleContinue}
          disabled={!topic.trim()}
          className={`w-full rounded-full py-4 text-lg font-medium shadow-md
                      active:scale-95 transition
                      ${topic.trim()
              ? "bg-[#D57B59] text-white"
              : "bg-[#D57B59]/40 text-white/70 cursor-not-allowed"
            }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
