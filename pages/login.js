import { FaLinkedin } from "react-icons/fa";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/router";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { returnTo } = router.query;
  // ✅ Clear localStorage on first load

  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Please enter both email and password.");
    }
   const sessionId = localStorage.getItem("sessionId");
    try {
      const res = await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password,sessionId  }),
        }
      );

      const data = await res.json();

      if (data.success) {
        // ✅ Store token and userId for protected routes
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);

        if (returnTo) {
          // Check if returnTo already has query parameters
          const separator = returnTo.includes("?") ? "&" : "?";
          router.push(`${returnTo}${separator}userId=${data.userId}`);
        } else {
          router.push(`/topics?userId=${data.userId}`);
        }
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Try again.");
    }
  };

  const handleLinkedInLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI;
    const state = returnTo ? encodeURIComponent(returnTo) : "";
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=openid%20profile%20email%20w_member_social&state=${state}`;

    window.location.href = authUrl;
  };

  return (
    <div className="max-w-[430px] mx-auto bg-[#FAF9F7] min-h-screen flex flex-col justify-center px-6 py-12 font-sans">
      <h1 className="text-3xl font-bold mb-2">Hello there 👋</h1>
      <p className="text-sm text-gray-600 mb-6">
        Please enter your email & password to login.
      </p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 border rounded-xl mb-4"
      />
      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <label className="flex items-center space-x-2 mb-4 text-sm">
        <input type="checkbox" />
        <span>I agree to Terms & Privacy Policy.</span>
      </label>

      <button
        onClick={handleLogin}
        className="w-full py-3 bg-[#9284EC] text-white font-semibold rounded-xl shadow-[2px_2px_0px_black]"
      >
        Sign in
      </button>
      <div className="my-4 text-center text-sm text-gray-500">
        <Link href="/forgot-password" className="text-[#9284EC] underline">
          Forgot password?
        </Link>
      </div>
      <div className="my-6 text-center text-sm text-gray-500">
        Don&lsquo;t have an account?{" "}
        <Link href={`/signup?returnTo=${encodeURIComponent(returnTo)}`}>
          <span className="text-[#9284EC] underline">Signup</span>
        </Link>
      </div>

      <div className="mt-4">
        <button
          onClick={handleLinkedInLogin}
          className="w-full py-3 border border-[#0077B5] text-[#0077B5] font-semibold rounded-xl flex items-center justify-center gap-2"
        >
          <FaLinkedin /> Sign in with LinkedIn
        </button>
      </div>
    </div>
  );
}
