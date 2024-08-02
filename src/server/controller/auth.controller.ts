import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/user.model";
import { generateJwtToken } from "../functions/generateJwtToken";

export const LoginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = await generateJwtToken({ id: user._id, role: user.role });

    res.json({ message: "Login Success", user, token });
  } catch (error) {
    return res.json({ message: "Something went wrong", error });
  }
};

export const SignInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(404).json({ message: "User already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ message: "User was added", user: newUser });
  } catch (error) {
    return res.json({ message: "Something went wrong", error });
  }
};
