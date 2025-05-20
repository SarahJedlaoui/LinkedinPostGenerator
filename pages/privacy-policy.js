import Link from "next/link";
export default function PrivacyPolicy() {
  return (
    <div className="max-w-[430px] mx-auto bg-[#FAF9F7] min-h-screen px-6 py-12 font-sans text-sm text-[#333]">
      <h1 className="text-3xl font-bold mb-3">Privacy Policy</h1>
      <p className="text-xs text-gray-500 mb-6">Last updated: 05/20/2025</p>

      <section className="space-y-4">
        <p>
          At <strong>Sophia</strong>, your privacy is important to us. This
          Privacy Policy explains what information we collect, how we use it,
          and the choices you have.
        </p>

        <div>
          <h2 className="font-semibold text-base mb-1">1. What We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Personal Information:</strong> name, email, profile
              details.
            </li>
            <li>
              <strong>Content Data:</strong> messages, uploads, notes, drafts,
              posts.
            </li>
            <li>
              <strong>Usage Data:</strong> pages visited, features used,
              interactions.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-base mb-1">
            2. How We Use Your Data
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Personalize your experience with Sophia</li>
            <li>Generate AI-powered content from your inputs</li>
            <li>Help you reach creative/professional goals</li>
            <li>Improve our services and features</li>
            <li>Send helpful tips or account notifications</li>
          </ul>
          <p className="mt-2">
            We <strong>never</strong> sell your personal information.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base mb-1">
            3. How We Store and Protect Your Data
          </h2>
          <p>
            Your data is stored using industry-standard encryption. Access is
            limited to authorized systems that support your Sophia experience.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base mb-1">4. Your Choices</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Update your info anytime</li>
            <li>Delete your data by contacting us</li>
            <li>Unsubscribe from emails via the link</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-base mb-1">5. Third-Party Tools</h2>
          <p>
            We use services like analytics or cloud storage. These providers are
            vetted and only access what&apos;s needed.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base mb-1">
            6. Children’s Privacy
          </h2>
          <p>
            Sophia is not intended for children under 13 (or 16 in some
            regions). We don’t knowingly collect their personal data.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base mb-1">
            7. Changes to This Policy
          </h2>
          <p>
            We may update this policy from time to time. We&apos;ll notify you
            if anything significant changes.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base mb-1">8. Contact Us</h2>
          <p>
            Have questions? Email us at:{" "}
            <a
              href="mailto:your@email.com"
              className="text-[#9284EC] underline"
            >
              admin@bei.dev
            </a>
          </p>
        </div>
      </section>
      <Link href="/reflection">
        <span className="text-[#9284EC] font-light underline">
          ← Back to home
        </span>
      </Link>
    </div>
  );
}
