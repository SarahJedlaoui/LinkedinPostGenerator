import { useState } from "react";

export default function ChatEditor({ onSave }) {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const sessionId = localStorage.getItem("sessionId");
    const userMessage = { role: "user", content: input };
    setChat([...chat, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/edit-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, instruction: input }),
      });

      const data = await res.json();
      setChat([...chat, userMessage, { role: "assistant", content: data.post }]);
      onSave(data.post);
    } catch (err) {
      alert("Error editing post.");
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-xl min-h-[260px] p-4 mb-5 overflow-scroll">
      <div className="space-y-2 text-sm max-h-[260] overflow-y-auto mb-3">
        {chat.map((msg, i) => (
          <div key={i} className={`${msg.role === "user" ? "text-right" : "text-left"} text-[#444]`}>
            <span className="inline-block px-3 py-2 rounded-lg bg-[#F0F0F0]">{msg.content}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-black px-3 py-2 rounded-lg"
          placeholder="Give instructions for your post..."
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-[#A48CF1] text-white px-4 py-2 rounded-lg shadow-[2px_2px_0px_black]"
        >
          {loading ? "Editing..." : "Send"}
        </button>
      </div>
    </div>
  );
}
