// controllers/auth.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/auth.js";
import { parseUserAgent } from "../utils/userAgentParser.js";
import nodemailer from "nodemailer";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: "User already exists." });
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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('Email not registered:', email);
      return res.status(404).json({ message: "Email not registered." });
    }

    // Generate reset token
    const resetToken = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Save the reset token to the user document
    user.resetToken = resetToken;
    await user.save();

    // Send reset email
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    const emailBody = `Click the following link to reset your password: ${resetLink}`;
    
    require('dotenv').config(); // Load environment variables from .env file

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: emailBody,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending reset email:', error);
        return res.status(500).json("Error sending reset email.");
      } else {
        console.log('Reset email sent successfully:', info.response);
        res.status(200).json({ message: "Reset email sent successfully." });
      }
    });

  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).json("Something went wrong...");
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({ resetToken: token });

    if (!user) {
      console.log('Invalid reset token:', token);
      return res.status(404).json({ message: "Invalid reset token." });
    }

    // Update the user's password and clear the reset token
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = null;
    await user.save();

    console.log('Password reset successfully for user:', user.email);
    res.status(200).json({ message: "Password reset successfully." });

  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json("Something went wrong...");
  }
};
