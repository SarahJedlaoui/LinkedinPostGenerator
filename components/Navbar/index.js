import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userImage, setUserImage] = useState(null); // Optional
  const hideButtons = ["/login", "/signup"].includes(router.pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setIsAuthenticated(!!token && !!userId);
    setUserImage("/images/user.png");
  };

  useEffect(() => {
    checkAuth();

    const handleRouteChange = () => {
      checkAuth();
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleLoginRedirect = () => {
    const returnTo = router.asPath;
    router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  };


  const Sidebar = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-30 z-50 ${
        isSidebarOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white w-[280px] h-full p-6 shadow-xl relative">
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4"
        >
          ✕
        </button>
        <div className="flex items-center gap-3 mb-6">
          <img
            src={userImage}
            alt="User Avatar"
            className="w-12 h-12 rounded-full border border-black"
          />
          <div>
            <p className="font-semibold">Marc</p>
            <p className="text-xs text-gray-500">Dermatologist</p>
          </div>
        </div>
        <nav className="flex flex-col gap-4 text-sm">
          <Link href="/" className="flex items-center gap-2">
            🏠 Home
          </Link>
          <Link href="/topics" className="flex items-center gap-2">
            🧠 Topics
          </Link>
          <Link href="/chat" className="flex items-center gap-2">
            💬 Chat
          </Link>
          <Link href="/notifications" className="flex items-center gap-2">
            🔔 Notifications
          </Link>
          <Link href="/saved" className="flex items-center gap-2">
            🔖 Saved posts
          </Link>
          <Link href="/profile" className="flex items-center gap-2">
            👤 Profile
          </Link>
          <button
            onClick={handleLogout}
            className="text-left text-sm mt-6 bg-[#A48CF1] text-white px-3 py-2 rounded shadow"
          >
            Logout
          </button>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center">
          <div className="relative w-full max-w-[430px]">
            <div className="absolute left-0 top-0 w-[330px] h-full bg-white shadow-lg p-6 z-50">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 text-xl"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-6 mt-8">
                <img
                  src={userImage || "/images/user.png"}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full border border-black"
                />
                <div>
                  <p className="font-semibold">Marc</p>
                  <p className="text-xs text-gray-500">Dermatologist</p>
                </div>
              </div>

              <nav className="flex flex-col gap-4 text-sm">
                <Link href="/" className="flex items-center gap-2">
                  🏠 Home
                </Link>
                <Link href="/topics" className="flex items-center gap-2">
                  🧠 Topics
                </Link>
                <Link href="/chat" className="flex items-center gap-2">
                  💬 Chat
                </Link>
                <Link href="/notifications" className="flex items-center gap-2">
                  🔔 Notifications
                </Link>
                <Link href="/saved" className="flex items-center gap-2">
                  🔖 Saved posts
                </Link>
                <Link href="/profile" className="flex items-center gap-2">
                  👤 Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-sm mt-6 bg-[#A48CF1] text-white px-3 py-2 rounded shadow"
                >
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <div className="max-w-[430px] mx-auto bg-[#FAF9F7] shadow-sm z-40 relative">
        <div className="px-4 pt-6 pb-2 flex items-center justify-between font-sans">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="focus:outline-none"
          >
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {!hideButtons &&
            (isAuthenticated ? (
              <div className="flex items-center gap-3">
                <img
                  src={userImage || "/images/user.png"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border border-black"
                />
              </div>
            ) : (
              <button
                onClick={handleLoginRedirect}
                className="text-sm bg-[#A48CF1] text-white px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_black]"
              >
                Login
              </button>
            ))}
        </div>
      </div>
    </>
  );
}