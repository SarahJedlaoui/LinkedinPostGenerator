import Head from "next/head";
import Link from "next/link";

export default function PostPreview() {
  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col justify-between px-4 py-6 max-w-[430px] mx-auto">
      <Head>
        <title>Post Preview</title>
      </Head>

      <div>
        <Link href="/guided-post" className="mb-4 inline-block text-[#D57B59]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <h1 className="text-2xl font-bold font-serif mt-5 mb-2">Almost there…</h1>
        <p className="text-sm text-[#6B6B6B] mb-6">
          Your post is being crafted based on your answers.
        </p>

        <div className="mt-10 p-5 text-center text-[#D57B59] border border-[#D57B59] rounded-xl bg-white">
          <p className="text-lg font-medium">✨ Post preview page in progress…</p>
    
        </div>
      </div>

      <div className="text-center text-xs text-[#6B6B6B] mt-10 mb-4">
        Sophia AI · V1
      </div>
    </div>
  );
}
