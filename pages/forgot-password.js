import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    const res = await fetch("https://sophiabackend-82f7d870b4bb.herokuapp.com/api/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.success) setSent(true);
    else alert(data.error);
  };

  return (
     <div className="max-w-[430px] mx-auto bg-[#FAF9F7] min-h-screen flex flex-col justify-center px-6 py-12 font-sans">
      <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
      {sent ? (
        <p className="text-green-600">Check your email for a reset link.</p>
      ) : (
        <>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border rounded-xl mb-4"
          />
          <button onClick={handleSubmit} className="bg-[#9284EC] text-white px-4 py-2 rounded">
            Send Reset Link
          </button>
        </>
      )}
    </div>
  );
}
