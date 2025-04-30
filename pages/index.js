import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";



export default function KnowYou() {
  const router = useRouter();
  const [linkOrNotes, setLinkOrNotes] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleContinue = async () => {
    setUploading(true);
  
    const formData = new FormData();
  
    // If they enter notes, append them
    if (linkOrNotes) formData.append("styleNotes", linkOrNotes);
    if (file) formData.append("file", file);
  
    const res = await fetch("https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona", {
      method: "POST",
      body: formData
    });
  
    const data = await res.json();
    localStorage.setItem("sessionId", data.sessionId);
  
    setUploading(false);
    router.push("/trending");
  };
  
  const handleSkip = async () => {
    // Call backend with empty form
    const res = await fetch("https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona", {
      method: "POST"
    });
  
    const data = await res.json();
    localStorage.setItem("sessionId", data.sessionId);
  
    router.push("/trending");
  };
  

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#FAF9F7]`}
    >
    

      <Head>
        <title>Sophia – Match your style</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      {/* Logo top-left */}
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

      {/* Main card */}
      <main className="flex-1 w-full max-w-[430px] mx-auto px-6 flex flex-col gap-6">
        {/* Headline */}
        <h1 className="font-serif font-semibold text-[32px] sm:text-3xl leading-tight mt-10">
          Let’s match your style
        </h1>

        <p className="text-sm text-[#6B6B6B] leading-relaxed">
          Upload a post, video, or article you’ve created. We’ll learn your tone
          and interests.
        </p>

        {/* 1 · Link or Notes box with custom icon */}
        <label
          className="flex flex-col items-center justify-center gap-3
                  rounded-xl border border-[#E7DCD7] bg-white px-5 py-6
                  text-sm text-[#D57B59] cursor-text"
        >
          {/* Your uploaded icon */}
          <Image
            src="/images/LinkSimpleHorizontal.svg" // adjust path if needed
            alt="link icon"
            width={30}
            height={30}
            priority
          />

          {/* Textarea */}
          <textarea
            rows={2}
            value={linkOrNotes}
            onChange={(e) => setLinkOrNotes(e.target.value)}
            placeholder="Paste a link or drop some notes"
            className="w-full text-center placeholder:text-[#D57B59]/70
               text-[#D57B59] text-sm bg-transparent border-none
               focus:outline-none focus:ring-0 resize-none"
          />
        </label>

        {/* 2 · File upload box */}
        <label
          htmlFor="file-input"
          className="flex flex-col items-center justify-center gap-2
                        rounded-xl border border-[#E7DCD7] bg-white px-5 py-6
                        text-sm text-[#D57B59] cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
          {file ? (
            <span className="text-[#6B6B6B]">{file.name}</span>
          ) : (
            <span>Upload PDF, video or screenshot</span>
          )}
          <input
            id="file-input"
            type="file"
            accept=".pdf,image/*,video/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
        </label>
      </main>

      {/* Footer buttons */}
      <div className="w-full max-w-[430px] mx-auto px-6 pb-10 flex justify-between">
        <button
          onClick={handleSkip} 
          className="text-[#D7AFA2] text-sm"
        >
          Skip
        </button>

        <button
          onClick={handleContinue}
          disabled={uploading || (!file && !linkOrNotes)}
          className={`rounded-full px-10 py-4 text-lg font-medium shadow-md
                         transition active:scale-95
                         ${
                           uploading || (!file && !linkOrNotes)
                             ? "bg-[#D57B59]/40 text-white/70 cursor-not-allowed"
                             : "bg-[#D57B59] text-white"
                         }`}
        >
          {uploading ? "Uploading…" : "Continue"}
        </button>
      </div>
    </div>
  );
}
