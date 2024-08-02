import { HydratedDocument, Model, model, Schema } from "mongoose";

import { IUser } from "./user.model";

export interface IProduct {
  image: string;
  title: string;
  description: string;
  price: number;
  //   userId: HydratedDocument<IUser>;

  readonly createdAt: Date;
}

const PriceSchema = new Schema<IProduct, Model<IProduct>>(
  {
    image: { type: String, required: [true, "Image is required"] },
    title: { type: String, required: [true, "Title is Required"] },
    description: { type: String, required: [true, "description is required"] },
    price: {
      type: Number,
      required: [true, "Price per unit is Required"],
    },
  },
  { collection: "Products", timestamps: true }
);

const ProductModel = model("Product", PriceSchema);

export default ProductModel;
