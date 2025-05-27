// utils/auth.ts
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useTokenSync() {
  const router = useRouter();

  useEffect(() => {
    const token = router.query.token;
    const userId = router.query.userId;

    if (token && userId) {
      localStorage.setItem("token", token );
      localStorage.setItem("userId", userId );
     
    }
  }, [router.query]);
}
