import jwt from "jsonwebtoken"
import User from "../models/User.js"

/**
 * Dev mode: if DEV_NO_AUTH=true, skip JWT and use a 'Dev User'.
 * Prod mode: verify Bearer token as usual.
 */
export async function protect(req, res, next) {
  try {
    if (process.env.DEV_NO_AUTH === "true") {
      let user = await User.findOne({ email: "dev@example.com" })
      if (!user) {
        user = await User.create({
          email: "dev@example.com",
          password: "dev", // irrelevant in dev
          name: "Developer",
        })
      }
      req.user = { id: user.id }
      return next()
    }

    const auth = req.headers.authorization || ""
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null
    if (!token) return res.status(401).json({ message: "No token" })
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error("JWT_SECRET is not defined")
    }
    const decoded = jwt.verify(token, secret)
    req.user = { id: decoded.id }
    next()
  } catch (err) {
    console.error("auth error:", err)
    if (err.message === "JWT_SECRET is not defined") {
      return res.status(500).json({ message: "JWT secret not configured" })
    }
    const msg = err.name === "TokenExpiredError" ? "Token expired" : "Invalid token"
    return res.status(401).json({ message: msg })
  }
}
