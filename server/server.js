import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { registerSockets } from "./sockets/index.js";
import app from "./app.js";

dotenv.config()

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
registerSockets(io);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pmapp";
connectDB(MONGO_URI).then(() => {
  server.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT}`));
});

export { app, server };