import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SavedPostsPage() {
  const router = useRouter();
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/saved-posts?userId=${userId}`
        );
        const data = await res.json();
        setSavedPosts(data.posts || []);
        console.log("posts", data.posts); // ✅ proper log
      } catch (err) {
        console.error("Failed to load saved posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-[430px] min-h-screen mx-auto px-4 pt-6 pb-10 bg-[#FAF9F7] font-sans">
      {/* Top Header */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()} className="text-xl">
          ←
        </button>
        <h1 className="text-xl font-bold">Saved posts</h1>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading saved posts...</p>
      ) : savedPosts.length === 0 ? (
        <p className="text-sm text-gray-500">No saved posts found.</p>
      ) : (
        savedPosts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-2xl shadow border border-[#E7DCD7] mb-6 overflow-hidden"
          >
            {/* Tag Header */}
            <div className="bg-[#A48CF1] text-white text-xs px-4 py-2 font-semibold">
             06/12/2025
            </div>

            {/* Post Content */}
            <div className="p-4">
              <p className="text-sm text-[#333] whitespace-pre-line mb-3">
                {post.generatedPost}
              </p>

              {/* Finalize CTA */}
              <button
                onClick={() => router.push("/journey")}
                className="text-[#A48CF1] text-sm font-semibold flex items-center gap-1"
              >
                Finalize your post →
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
