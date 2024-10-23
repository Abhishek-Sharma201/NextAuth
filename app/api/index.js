import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.db.js";
import { User } from "./models/user.model.js";
import bcryptjs from "bcryptjs";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8100;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Login route
app.post("/login/sendData", async (req, res) => {
  const { email, password } = req.body; 
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error(`User not Found: ${email}`);

    const comparePass = await bcryptjs.compare(password, user.password);
    if (!comparePass) throw new Error("Invalid credentials");

    res.status(200).json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    console.error(`BackEnd --Error in Login: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Signup route
app.post("/signup/sendData", async (req, res) => {
  const { email, password, username } = req.body; 
  try {
    if (!email || !password || !username) {
      throw new Error("All fields are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) throw new Error("User already exists");

    const hashedPass = await bcryptjs.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPass,
    });

    console.log(`User Created: ${newUser.username}`);
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error(`BackEnd --Error in Signup: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
  connectDB();
});
