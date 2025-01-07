import express from "express";
import {UserModel} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields (username, email, password).",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const payload = { user: { id: newUser._id } };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "defaultsecret",
      { expiresIn: "1h" }
    );

    newUser.token = token;
    await newUser.save();

    res.status(201).json({
      message: "User signup successful",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup controller error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    user.token = token;
    await user.save();

    res.json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Login controller error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ message: "You are not authenticated", status: "failed" });
    }
    user.token = null;
    await user.save();
    res.json({ message: "Logout successful", status: "success" });
  } catch (error) {
    console.error("Logout controller error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "defaultsecret",
      (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid or expired token" });
        }

        const newToken = jwt.sign(
          { user: { id: decoded.user.id } },
          process.env.JWT_SECRET_KEY || "defaultsecret",
          { expiresIn: "1h" }
        );

        res.json({ message: "Token refreshed successfully", token: newToken });
      }
    );
  } catch (error) {
    console.error("Refresh token controller error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
