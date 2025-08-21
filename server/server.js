import express from "express"
import cors from "cors"
import morgan from "morgan"
import http from "http"
import { Server } from "socket.io"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import projectRoutes from "./routes/projectRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import { registerSockets } from "./sockets/index.js"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.get("/api/health",(_req,res)=>res.json({ok:true,service:"PM API"}))
app.use("/api/auth",authRoutes)
app.use("/api/projects",projectRoutes)
app.use("/api/tasks",taskRoutes)
app.use("/api/posts",postRoutes)
app.use("/api/chats",chatRoutes)

const server = http.createServer(app)
const io = new Server(server,{ cors:{ origin:"*" } })
registerSockets(io)

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pmapp"
connectDB(MONGO_URI).then(()=>{
  server.listen(PORT,()=>console.log(`🚀 Server http://localhost:${PORT}`))
})
