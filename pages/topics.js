/* ----------------------------------------------------------------------
   pages/topics.jsx
   ------------------------------------------------------------------ */
   import { useState } from "react";
   import { useRouter } from "next/router";
   import Head from "next/head";
   import Image from "next/image";
   import Cursor from "../components/Cursor";
   import data from "../data/portfolio.json";
   import Link from "next/link";  
   /* -------------------------------------------------------------
      Replace these with the suggestions you fetch from your API.
      ------------------------------------------------------------- */
   const initialSuggestions = [
     "Can UX survive AI advancements?",
     "How Can UX Survive AI?",
     "The changing role of UX researchers",
     "Future of UX Careers",
     "Ethics in AI",
     "Human-centered in an AI-driven  era",
   ];
   
   export default function Topics() {
     const router = useRouter();
     const [selected, setSelected] = useState([]); // array of strings
   
     /* toggle selection -------------------------------------------------- */
     const toggle = (topic) =>
       setSelected((prev) =>
         prev.includes(topic)
           ? prev.filter((t) => t !== topic)
           : [...prev, topic]
       );
   
     /* navigate on continue --------------------------------------------- */
     const handleContinue = () => {
       // TODO: persist `selected` in context / DB / query-params
       router.push("/summary"); // adjust the route for your flow
     };
   
     return (
       <div
         className={`min-h-screen flex flex-col bg-[#FAF9F7]
                     ${data.showCursor ? "cursor-none" : ""}`}
       >
         {data.showCursor && <Cursor />}
   
         <Head>
           <title>{data.name} – Topic suggestions</title>
           <meta name="viewport" content="width=device-width,initial-scale=1" />
         </Head>
   
         {/* ------------- 1 · Tiny logo top-left --------------------------- */}
         <header className="pt-6 pl-6">
           <Image
             src="/images/sophia.svg"  
             alt="Sophia logo"
             width={32}
             height={32}
             priority
           />
         </header>
   
         {/* ------------- 2 · Main body ----------------------------------- */}
         <main className="flex-1 w-full max-w-[430px] mx-auto px-6 flex flex-col gap-6">
           {/* helper blurb */}
           <p className="text-md text-[#6B6B6B]">
             Here are some trending discussions around your interest:
           </p>
   
           {/* headline */}
           <h1 className="font-serif font-semibold text-[28px] sm:text-3xl leading-tight">
             What would you like
             <br />
             to focus on&nbsp;?
           </h1>
           <p className="text-md mb-2 text-[#6B6B6B]">
             Pick as many as you’d like.
           </p>
   
           {/* suggestions list */}
           <ul className="flex flex-col gap-4">
             {initialSuggestions.map((topic) => {
               const isActive = selected.includes(topic);
               return (
                 <li
                   key={topic}
                   onClick={() => toggle(topic)}
                   className={`flex items-center gap-4 rounded-xl px-5 py-4
                               cursor-pointer transition
                               ${
                                 isActive
                                   ? "border border-[#D57B59] bg-white"
                                   : "bg-[#F7F0EC]"
                               }`}
                 >
                   {isActive ? (
                     /* X icon */
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
                         d="M6 18L18 6M6 6l12 12"
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
                   <span className="flex-1 text-sm sm:text-base">{topic}</span>
                 </li>
               );
             })}
           </ul>
         </main>
   
         {/* ------------- 3 · CTA bottom ---------------------------------- */}
         <div className="w-full max-w-[430px] mx-auto px-6 pb-10">
           <button
             onClick={handleContinue}
             disabled={selected.length === 0}
             className={`w-full rounded-full py-4 text-lg font-medium shadow-md
                         transition active:scale-95
                         ${
                           selected.length === 0
                             ? "bg-[#D57B59]/40 text-white/70 cursor-not-allowed"
                             : "bg-[#D57B59] text-white"
                         }`}
           >
             Continue
           </button>
         </div>
       </div>
     );
   }
   