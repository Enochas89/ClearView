import mongoose from "mongoose"

export async function connectDB(uri) {
  try {
    mongoose.set("strictQuery", true)
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 })
    console.log("✅ MongoDB connected:", uri)
  } catch (err) {
      console.warn(
      "⚠️  Could not reach Mongo at",
      uri,
      "- starting in-memory MongoDB for dev..."
    )
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server")
      const mem = await MongoMemoryServer.create()
      const memUri = mem.getUri()
      await mongoose.connect(memUri)
      console.log("✅ In-memory MongoDB started:", memUri)
    } catch (memErr) {
      console.error("❌ Failed to start in-memory MongoDB:", memErr.message)
      throw memErr
    }
  }
}