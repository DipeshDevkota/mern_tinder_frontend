import io from 'socket.io-client';
const SOCKET_URL = "http://localhost:5000";
let socket = null;

export const initializeSocket = (token, userId) => {
    if (socket) {
        socket.disconnect();
    }

    socket = io(SOCKET_URL, {
        auth: {
            token,
            userId
        }
    });

    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });
};

export const getSocket = () => {
    if (!socket) {
        throw new Error("Socket not initialized");
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
