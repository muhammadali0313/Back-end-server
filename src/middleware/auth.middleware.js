import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

  const authMiddleware = async (req, res, next) => {
    try {
      if (process.env.SKIP_AUTH === "true") {
        console.log("Skipping authentication...");
        return next(); // Skip authentication if bypass is enabled
      }
  
      const authHeader = req.headers["authorization"];
      const token = authHeader?.split(" ")[1];
  
      if (!token) {
        return res
          .status(401)
          .json({ message: "No token provided, authorization denied" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded.user;
      next();
    } catch (error) {
      console.error("Authentication error:", error.message);
      res.status(401).json({ message: "Token is not valid", status: "failed" });
    }
  };
  


export default authMiddleware;