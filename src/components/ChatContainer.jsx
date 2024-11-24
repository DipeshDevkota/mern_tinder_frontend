// src/components/ChatComponent.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendMessage } from "../utils/chatActions";
import { useParams } from "react-router-dom";

const ChatComponent = () => {
  const { connectionId } = useParams(); // Get the connectionId from the route params
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chat);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

  // Fetch messages when the component is mounted
  useEffect(() => {
    dispatch(fetchMessages(connectionId));
  }, [dispatch, connectionId]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      dispatch(sendMessage(connectionId, message, image));
      setMessage(""); // Clear message input after sending
      setImage(null); // Clear image input
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 shadow-md">
        <h1 className="text-2xl font-semibold">Live Chat</h1>
      </header>

      {/* Messages Area */}
      <main className="flex-1 p-4 overflow-y-auto space-y-4">
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {messages.length === 0 && !loading && (
          <p className="text-center text-gray-400">No messages yet. Start chatting!</p>
        )}
        
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xl p-3 rounded-lg shadow-lg ${msg.sender === "me" ? "bg-indigo-600 text-white" : "bg-white text-gray-800"}`}
              >
                <p className="text-sm">{msg.text}</p>
                {msg.image && <img src={msg.image} alt="Message Attachment" className="mt-2 rounded-lg max-w-full" />}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white p-4 border-t flex items-center space-x-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition duration-300"
        >
          Send
        </button>
      </footer>
    </div>
  );
};

export default ChatComponent;
