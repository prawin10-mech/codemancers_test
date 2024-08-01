import { Request, Response } from "express";
import CartModel from "../models/cart.model";
import ProductModel from "../models/products.model";

export const GetCartProducts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    let cart = await CartModel.findOne({ userId }).populate(
      "products.productId"
    );

    res.json({ message: "Product added to cart", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const AddProductToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (!productId || !quantity || quantity < 1) {
      return res
        .status(400)
        .json({ message: "Product ID and valid quantity are required" });
    }

    const isProductExist = await ProductModel.findById(productId);

    if (!isProductExist) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await CartModel.findOne({ userId });

    if (cart) {
      const productIndex = cart.products.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId: productId,
          quantity,
        });
      }
    } else {
      cart = new CartModel({
        userId: userId,
        products: [{ productId: productId, quantity }],
      });
    }

    await cart.save();

    res.json({ message: "Product added to cart", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const RemoveFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products.splice(productIndex, 1);

    await cart.save();

    res.json({ message: "Product removed from cart", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};
