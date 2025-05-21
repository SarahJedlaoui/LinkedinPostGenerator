import { FaLinkedin } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";


export default function SignupPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Please enter both email and password.");
    }

    try {
      const res = await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (data.success) {
        // ✅ Store token and userId for protected routes
        localStorage.setItem("token", data.token); // ⚠️ You must send token back in the response now
        localStorage.setItem("userId", data.userId);
        router.push(`/topics?user=${data.userId}&token=${data.token}`);
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

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=openid%20profile%20email%20w_member_social`;

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
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 border rounded-xl mb-4"
      />

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

      <div className="my-6 text-center text-sm text-gray-500">
        Don&lsquo;t have an account?{" "}
       <Link href="/signup">
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
