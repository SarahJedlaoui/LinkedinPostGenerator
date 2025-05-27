import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userImage, setUserImage] = useState(null); // Optional
  const hideButtons = ["/login", "/signup"].includes(router.pathname);

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

  return (
    <div className="max-w-[430px] mx-auto bg-[#FAF9F7] shadow-sm">
      <div className="max-w-[430px] mx-auto px-4 pt-6 flex items-center justify-between font-sans">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/sophia-logo.svg"
            alt="Sophia Logo"
            width={120}
            height={40}
          />
        </Link>

        {!hideButtons &&
          (isAuthenticated ? (
            <div className="flex items-center gap-3">
              <img
                src={userImage}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border border-black"
              />
              <button
                onClick={handleLogout}
                className="text-sm bg-[#A48CF1] text-white px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_black]"
              >
                Logout
              </button>
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
  );
}
