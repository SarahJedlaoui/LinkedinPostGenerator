import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Cursor from "../components/Cursor";
import data from "../data/portfolio.json";

export default function Topics() {
  const router = useRouter();
  const { topic } = router.query;          // ?topic=…
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("");   // 🔑 single string

  /* fetch titles once we have the topic ----------------------- */
  useEffect(() => {
    if (!topic) return;
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/trending", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic }),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setTitles(data.titles || []);
      } catch (err) {
        console.error("❌ Trending fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [topic]);

  /* toggle (single-select) ------------------------------------ */
  const toggle = (t) => setSelected((prev) => (prev === t ? "" : t));

  /* Continue --------------------------------------------------- */
  const handleContinue = () => {
    console.log("User picked:", selected);
    // router.push("/next-step");
  };

  /* redirect if user arrives without query -------------------- */
  if (!topic && !loading) {
    router.replace("/");
    return null;
  }

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#FAF9F7]
                  ${data.showCursor ? "cursor-none" : ""}`}
    >
      {data.showCursor && <Cursor />}

      <Head>
        <title>{data.name} – Topics</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      {/* Logo */}
      <header className="pt-6 pl-6">
        <Link href="/" scroll={false}>
          <Image
            src="/images/sophia.svg"
            alt="Sophia logo"
            width={32}
            height={32}
            className="cursor-pointer"
            priority
          />
        </Link>
      </header>

      {/* Main body */}
      <main className="flex-1 w-full max-w-[430px] mx-auto px-6 flex flex-col gap-6">
        <p className="text-md text-[#6B6B6B]">
          Here are some trending discussions around your interest:
        </p>

        <h1 className="font-serif font-semibold text-[28px] sm:text-3xl leading-tight">
          What would you like
          <br />
          to focus on&nbsp;?
        </h1>
        <p className="text-md mb-2 text-[#6B6B6B]">
          Pick <strong>one</strong> subject to start with.
        </p>

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-10 text-[#D57B59]">
            Searching for trending topics on&nbsp;
            <span className="font-semibold">{topic}</span>…
          </div>
        )}


        {/* Suggestions */}
        {!loading && (
          <ul className="flex flex-col gap-4">
            {titles.map((t) => {
              const isActive = selected === t;
              return (
                <li
                  key={t}
                  onClick={() => toggle(t)}
                  className={`flex items-center gap-4 rounded-xl px-5 py-4 cursor-pointer transition
                              ${isActive
                      ? "border border-[#D57B59] bg-white"
                      : "bg-[#F7F0EC]"
                    }`}
                >
                  {isActive ? (
                    /* check icon */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#D57B59]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    /* plus icon */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#D57B59]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                  <span className="flex-1 text-sm sm:text-base">{t}</span>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      {/* CTA */}
      <div className="w-full max-w-[430px] mx-auto px-6 pb-10">
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`w-full rounded-full py-4 text-lg font-medium shadow-md
                      transition active:scale-95
                      ${selected
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
