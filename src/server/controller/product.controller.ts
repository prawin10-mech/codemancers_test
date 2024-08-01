import { Request, Response } from "express";
import multer from "multer";
import ProductModel from "../models/products.model";
import MulterStorage from "../helpers/MulterStorage";
const upload = multer({ storage: MulterStorage });

export const AddProduct = [
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const { title, description, price } = req.body;
      const image = req.file?.path;

      if (!title || !description || !price || !image) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const imageUrl = image.split("\\").slice(1).join("/");

      const newProduct = new ProductModel({
        title,
        description,
        price,
        image: `/${imageUrl}`,
      });

      await newProduct.save();
      res.json({ message: "Product added", newProduct });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error });
    }
  },
];

export const GetProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find();
    res.json({ message: "Products fetched", products });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const DeleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findByIdAndDelete(id);
    res.json({ message: "Products Deleted", product });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const EditProduct = [
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      if (!Object.keys(req.body).length && !req.file) {
        return res.status(400).json({ message: "Request body is empty" });
      }

      let image;
      if (req.file) {
        const imageUrl = req.file.path.split("\\").slice(1).join("/");
        image = `/${imageUrl}`;
      } else if (req.body.image && typeof req.body.image === "string") {
        image = req.body.image;
      }

      const updateData = { ...req.body };
      if (image) {
        updateData.image = image;
      }

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product Updated", product: updatedProduct });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error });
    }
  },
];