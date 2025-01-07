import express from "express";
import {
  CreateProduct,
  deleteProduct,
  getAllproduct,
  getSingleproduct,
  updateProduct,
} from "../controllers/products.controllers.js";
import upload from "../middleware/multer.middleware.js";
// import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createproduct",upload.single("image"),CreateProduct);
router.get("/getproduct", getAllproduct);
router.get("/getsingleproduct/:id", getSingleproduct);
router.put("/updateproduct/:id", updateProduct);
router.delete("/deleteproduct/:id", deleteProduct);

export default router;