export function registerSockets(io){
  io.on("connection",(socket)=>{
    socket.on("join_project",(projectId)=>socket.join(`project:${projectId}`))
    socket.on("chat_message",({projectId,text,user})=>{
      io.to(`project:${projectId}`).emit("chat_message",{text,user,ts:Date.now()})
    })
  })
}
