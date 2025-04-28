   import { useRouter } from "next/router";
   import Head from "next/head";
   import Image from "next/image";
   import Cursor from "../components/Cursor";
   import data from "../data/portfolio.json";
   
   export default function Home() {
     const router = useRouter();
   
     /** Handle the CTA */
     const handleContinue = () => {
       // TODO: persist the chosen interest here if you need it
       router.push("/topics"); // change the route as appropriate
     };
   
     return (
       <div
         className={`min-h-screen flex flex-col items-center justify-between
                     bg-[#FAF9F7] ${data.showCursor ? "cursor-none" : ""}`}
       >
         {data.showCursor && <Cursor />}
   
         <Head>
           <title>{data.name}</title>
           <meta name="Sophia" content="width=device-width,initial-scale=1" />
         </Head>
   
         {/* ----------------- 1 · Logo ------------- */}
         <div className="pt-40 sm:pt-26">
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
         <main className="w-full max-w-[430px] px-6 flex flex-col gap-8 -mt-28">
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
               placeholder="UX &amp; AI Evolution"
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
             className="w-full rounded-full bg-[#D57B59] py-4
                        text-lg font-medium text-white shadow-md
                        active:scale-95 transition"
           >
             Continue
           </button>
         </div>
       </div>
     );
   }
   