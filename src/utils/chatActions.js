// src/redux/chatActions.js
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { setMessages, setLoading, setError, addMessage } from "./chatStore";

// Fetch messages for a specific connection
export const fetchMessages = (connectionId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${BASE_URL}/viewmessage/${connectionId}`, { withCredentials: true });
    dispatch(setMessages(response.data));  // Save the fetched messages to Redux
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
    console.error("Error fetching messages:", error.message);
  }
};

// Send a new message to the selected connection
export const sendMessage = (connectionId, text, image) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(
      `${BASE_URL}/sendmessage/${connectionId}`,
      { text, image },
      { withCredentials: true }
    );
    dispatch(addMessage(response.data.data));  // Add the new message to the Redux store
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
    console.error("Error sending message:", error.message);
  }
};
