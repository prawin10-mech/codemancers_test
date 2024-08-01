import { HydratedDocument, Model, model, Schema, Types } from "mongoose";

import { IUser } from "./user.model";
import { IProduct } from "./products.model";

interface ICartProduct {
  productId: Types.ObjectId;
  quantity: number;
}

interface ICart {
  userId: Types.ObjectId;
  products: ICartProduct[];
  readonly createdAt: Date;
}

const CartProductSchema = new Schema<ICartProduct>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart, Model<ICart>>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User is required"],
      ref: "User",
    },
    products: [CartProductSchema],
  },
  { collection: "Carts", timestamps: true }
);

const CartModel = model<ICart>("Cart", CartSchema);

export default CartModel;
