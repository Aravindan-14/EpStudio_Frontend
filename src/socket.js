import { io } from "socket.io-client";
import { baseURL } from "./Utils/ServerUrl";
// Auto-connect socket when this file is imported
const socket = io(`${baseURL}`, {
  autoConnect: true, // This ensures the connection happens automatically
  reconnectionAttempts: 5, // Attempt to reconnect up to 5 times
  reconnectionDelay: 1000, // Wait 1 second before trying to reconnect
});

export default socket;
