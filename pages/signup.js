import { FaLinkedin } from "react-icons/fa";

export default function SignupPage() {
  const handleLinkedInLogin = () => {
    window.location.href = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=r_liteprofile%20r_emailaddress%20w_member_social";
  };

  return (
    <div className="max-w-[430px] mx-auto bg-[#FAF9F7] min-h-screen flex flex-col justify-center px-6 py-12 font-sans">
      <h1 className="text-3xl font-bold mb-2">Hello there 👋</h1>
      <p className="text-sm text-gray-600 mb-6">Please enter your email & password to create an account.</p>

      <input type="email" placeholder="Email" className="w-full px-4 py-3 border rounded-xl mb-4" />
      <input type="password" placeholder="Password" className="w-full px-4 py-3 border rounded-xl mb-4" />

      <label className="flex items-center space-x-2 mb-4 text-sm">
        <input type="checkbox" />
        <span>I agree to Terms & Privacy Policy.</span>
      </label>

      <button className="w-full py-3 bg-[#9284EC] text-white font-semibold rounded-xl shadow-[2px_2px_0px_black]">
        Continue
      </button>

      <div className="my-6 text-center text-sm text-gray-500">
        Already have an account? <a className="text-[#9284EC] underline" href="/login">Log in</a>
      </div>

      <div className="mt-4">
        <button
          onClick={handleLinkedInLogin}
          className="w-full py-3 border border-[#0077B5] text-[#0077B5] font-semibold rounded-xl flex items-center justify-center gap-2"
        >
          <FaLinkedin /> Sign up with LinkedIn
        </button>
      </div>
    </div>
  );
}
