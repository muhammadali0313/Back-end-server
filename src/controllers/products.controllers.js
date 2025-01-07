
import { ProductModel } from "../models/product.model.js";
import {UserModel} from "../models/user.model.js";

export const CreateProduct = async (req, res) => {
  try {
    console.log("File:", req.file); // Log the uploaded file
    console.log("Body:", req.body); // Log the request body

    const { name, description, price, userid } = req.body;

    if (!name || !description || !price || !userid) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const product = new ProductModel({
      name,
      description,
      price,
      image: req.file.path,
      userid,
    });

    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};


export const getSingleproduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product found", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getAllproduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await ProductModel.find({}).skip(skip).limit(limit);

    res.json({
      message: "Products fetched successfully",
      data: products,
      length: products.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findByIdAndDelete(id); 
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
