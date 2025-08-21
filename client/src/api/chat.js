import { io } from "socket.io-client"
const url = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/^http/,"ws")
export const socket = io(url, { transports: ["websocket"] })
