import { useState } from "react";
import { useRouter } from "next/router";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleReset = async () => {
    if (password !== confirm) return alert("Passwords do not match");

    const res = await fetch("http://localhost:5000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Password updated");
      router.push("/login");
    } else {
      alert(data.error);
    }
  };

  return (
     <div className="max-w-[430px] mx-auto bg-[#FAF9F7] min-h-screen flex flex-col justify-center px-6 py-12 font-sans">
      <h1 className="text-2xl font-bold mb-4">Enter New Password</h1>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 border rounded-xl mb-4"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full px-4 py-3 border rounded-xl mb-4"
      />
      <button onClick={handleReset} className="bg-[#9284EC] text-white px-4 py-2 rounded">
        Reset Password
      </button>
    </div>
  );
}
