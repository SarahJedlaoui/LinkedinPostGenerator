// utils/requireAuth.js
export function requireAuth() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) {
    window.location.href = "/login";
  }
}
