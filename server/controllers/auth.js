// controllers/auth.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/auth.js";
import { parseUserAgent } from "../utils/userAgentParser.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(404).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Generate token
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Save login information to the user document for signup
    const user_agent_signup = req.headers['user-agent'];
    const { browser: browser_signup, os: os_signup, device: device_signup } = parseUserAgent(user_agent_signup);
    const ip_address_signup = req.ip;

    newUser.loginHistory.push({
      login_time: Date.now(),
      browser: browser_signup,
      operating_system: os_signup,
      device_type: device_signup,
      ip_address: ip_address_signup,
    });

    await newUser.save();

    console.log('User signed up successfully:', email);
    res.status(200).json({ result: newUser, token });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json("Something went wrong...");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      console.log('Invalid request. Email or password is missing.');
      return res.status(400).json({ message: "Invalid request. Email or password is missing." });
    }

    console.log('Attempting to log in:', email);

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      console.log('User not found:', email);
      return res.status(404).json({ message: "User doesn't exist." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Save login information to the user document for login
    const user_agent_login = req.headers['user-agent'];
    const { browser: browser_login, os: os_login, device: device_login } = parseUserAgent(user_agent_login);
    const ip_address_login = req.ip;

    existingUser.loginHistory.push({
      login_time: Date.now(),
      browser: browser_login,
      operating_system: os_login,
      device_type: device_login,
      ip_address: ip_address_login,
    });

    await existingUser.save();

    console.log('User logged in successfully:', email);
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json("Something went wrong...");
  }
};
