import express from "express";
import { signup, login, logout, refreshToken } from "../controllers/user.conroller.js";

const router = express.Router();

// Route for user signup
router.post("/signup", signup);

// Route for user login
router.post("/login", login);

// Route for user logout
router.post("/logout", logout);

// Route for refreshing token
router.post("/refresh-token", refreshToken);

export default router;
