import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const sign = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, secret, { expiresIn: "7d" });
};

export async function register(req, res) {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name)
      return res.status(400).json({ message: "Name, email and password are required" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User exists" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, name });
    res.json({ token: sign(user.id) });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    res.json({ token: sign(user.id) });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
