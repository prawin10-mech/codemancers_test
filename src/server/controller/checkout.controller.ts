import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { CustomRequest } from "../middleware/CustomRequest";
import CheckoutModel from "../models/checkout.model";
import CartModel from "../models/cart.model";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const CheckoutCart = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address } = req.body;
    const { userId } = req as CustomRequest;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const newCheckout = new CheckoutModel({
      name,
      email,
      phone,
      address,
      products: cart.products,
      userId,
    });

    await newCheckout.save();

    cart.products = [];
    await cart.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You",
      text: "Your cart was checked out successfully",
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Checkout Success", newCheckout });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};
