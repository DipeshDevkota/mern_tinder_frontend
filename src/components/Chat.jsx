// import jwt_decode from "jwt-decode";
// import { useCookies } from "react-cookie";
// import Cookies from 'js-cookie'
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getSocket, initializeSocket } from "../socket/socket.client";
import { BASE_URL } from "../utils/constants";
const Chat = () => {
    const { id } = useParams(); 
    // const token =Cookies.get("token")

    const getCookie = (cookieName) => {
        const name =`${cookieName}`
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
           let cookie = cookieArray[i].trim();
           if (cookie.indexOf(name) === 0) {
              return cookie.substring(name.length, cookie.length);
           }
        }
        return null; // Returns null if cookie not found
     };

     const cookie= getCookie("token");
       console.log('Cookie is',cookie)
         // const cookies = useCookies(["token"]);


    const [currentUserId, setCurrentUserId] = useState(null); 
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState(""); 
    const [userData, setUserData] = useState(null); 
    // useEffect(() => {
    //     if (token) {
    //         try {
    //             const decodedToken = jwt_decode(token);
    //             setCurrentUserId(decodedToken.userId);
    //             console.log("Logged-in user ID (sender):", decodedToken.userId);
    //         } catch (error) {
    //             console.error("Failed to decode token:", error);
    //         }
    //     } else {
    //         console.error("Token is missing");
    //     }
    // }, [token]);

    const getProfile = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/view/${id}`, { withCredentials: true });
            setUserData(res.data.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const sendMessage = async () => {
        if (!messageInput.trim()) {
            console.warn("Message content cannot be empty.");
            return;
        }

        try {
            const res = await axios.post(
                `${BASE_URL}/sendmessage/${id}`,
                { content: messageInput },
                { withCredentials: true }
            );

            console.log("Message sent:", res.data.message.content);

            setMessages((prevMessages) => [
                ...prevMessages,
                { senderId: currentUserId, content: res.data.message.content },
            ]);

            const socket = getSocket();
            socket.emit('newMessage', {
                senderId: currentUserId,
                receiverId: id,
                content: res.data.message.content
            });

            setMessageInput(""); 
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
  const [token,setToken]= useState(getCookie("token"))
    const viewMessages = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/viewmessages/${id}`, { withCredentials: true });
            setMessages(res.data.messages);
        } catch (error) {
            console.error("Error receiving messages:", error);
        }
    };

    useEffect(() => {
        console.log('Token is',token);
        
        if (!token ) {
            console.error("Token is missing");
            return;
        }

        initializeSocket(token, currentUserId);
        const socket = getSocket();

        getProfile(); 
        viewMessages(); 

        socket.on("newMessage", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on('reconnect', () => {
            console.log('Reconnected to server');
            viewMessages(); // Optionally re-fetch messages after reconnect
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        return () => {
            socket.off('newMessage');
            socket.off('reconnect');
            socket.off('disconnect');
            socket.off('connect_error');
        };
    }, [token, currentUserId, id]);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {userData ? (
                <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto my-10 space-y-4 md:space-y-0 md:space-x-4">
                    {/* Profile Sidebar */}
                    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center w-full md:w-1/3 lg:w-1/4 space-y-4">
                        <img
                            className="h-32 w-32 rounded-full border-4 border-blue-500 object-cover"
                            src={userData.photoUrl}
                            alt={`${userData.firstName}'s profile`}
                        />
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {userData.firstName} {userData.lastName}
                            </h2>
                            <p className="text-gray-600 mt-2">
                                Start chatting with {userData.firstName}!
                            </p>
                        </div>
                    </div>

                    {/* Chat Section */}
                    <div className="bg-white shadow-lg rounded-lg flex flex-col justify-between w-full md:w-2/3 lg:w-3/4 p-6">
                        {/* Chat Messages */}
                        <div className="space-y-4 mb-4 overflow-y-auto h-80">
                            {messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`chat ${
                                            msg.senderId === currentUserId
                                                ? "chat-end"
                                                : "chat-start"
                                        }`}
                                    >
                                        <div
                                            className={`chat-bubble ${
                                                msg.senderId === currentUserId
                                                    ? "bg-green-100"
                                                    : "bg-blue-100"
                                            } text-gray-800 p-4 rounded-lg max-w-xs`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No messages yet.</p>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="flex items-center space-x-2 border-t pt-4">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 text-lg">Loading user data...</p>
            )}
        </div>
    );
};

export default Chat;
