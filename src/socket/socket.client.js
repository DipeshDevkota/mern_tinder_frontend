// import io from 'socket.io-client';
// const SOCKET_URL = "http://localhost:5000";
// let socket = null;

// export const initializeSocket = (token, userId) => {
//     if (!token || !userId) {
//         console.warn("Socket initialization failed: Missing token or user ID.");
//         return;
//     }

//     if (socket && socket.auth?.token === token && socket.auth?.userId === userId) {
//         console.log("Socket is already connected with the same token and user ID.");
//         return;
//     }

//     if (socket) {
//         socket.disconnect(); // Disconnect existing socket if reinitializing with new credentials
//     }

//     socket = io(SOCKET_URL, {
//         auth: {
//             token,
//             userId
//         }
//     });

//     socket.on("connect", () => {
//         console.log("Socket connected:", socket.id);
//     });

//     socket.on("disconnect", () => {
//         console.log("Socket disconnected");
//     });

//     socket.on("connect_error", (error) => {
//         console.error("Socket connection error:", error);
//     });
// };

// export const getSocket = () => {
//     if (!socket) {
//         throw new Error("Socket not initialized. Call initializeSocket first.");
//     }
//     return socket;
// };

// export const disconnectSocket = () => {
//     if (socket) {
//         socket.disconnect();
//         socket = null;
//         console.log("Socket disconnected and instance set to null.");
//     }
// };
