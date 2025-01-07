import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./src/routes/user.route.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "./src/db/index.js";
// import userRoutes from "./src/controllers/user.conroller.js"
import productRoutes from "./src/routes/product.roues.js"
// import orderRoutes from  "./src/routes/"
const app = express();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", userRoutes);
app.use("/api/v1", productRoutes)

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });