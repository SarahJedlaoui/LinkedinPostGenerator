import { useState, useRef, useEffect } from "react";

export default function ChatEditor({ onSave }) {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const sessionId = localStorage.getItem("sessionId");
    const userMessage = { role: "user", content: input };
    const thinkingMessage = { role: "assistant", content: "Thinking..." };

    // Append user and placeholder assistant message
    setChat((prev) => [...prev, userMessage, thinkingMessage]);
    setLoading(true);

    try {
      const res = await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/edit-post",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, instruction: input }),
        }
      );

      const data = await res.json();

      // Replace the "thinking..." message with actual AI content
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: data.post };
        return updated;
      });

      onSave(data.post);
    } catch (err) {
      alert("Error editing post.");
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-xl h-[300px] mb-5 flex flex-col overflow-hidden">
      {/* Scrollable chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`text-${
              msg.role === "user" ? "right" : "left"
            } text-[#444]`}
          >
            {msg.content === "Thinking..." ? (
              <span className="inline-block px-3 py-2 italic text-gray-500">
                Thinking...
              </span>
            ) : (
              <span className="inline-block px-3 py-2 rounded-lg bg-[#F0F0F0]">
                {msg.content}
              </span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed input field */}
      <div className="flex gap-2 items-center border-t p-3">
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
