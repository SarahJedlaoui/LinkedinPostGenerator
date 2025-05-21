import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    const userId = router.query.user;

    if (userId) {
      // Store userId or fetch session
      console.log("Authenticated as user:", userId);
      // router.push("/dashboard"); or store in context/state
    }
  }, [router.query]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Login Successful ✅</h1>
      <p>You're now logged in with LinkedIn. Redirecting...</p>
    </div>
  );
}
