import { HydratedDocument, Model, model, Schema, Types } from "mongoose";
import { IUser } from "./user.model";

interface ICartProduct {
  productId: Types.ObjectId;
  quantity: number;
}

interface ICheckout extends Document {
  userId: HydratedDocument<IUser>;
  products: ICartProduct[];
  name: string;
  email: string;
  phone: string;
  address: string;
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

const CheckoutSchema = new Schema<ICheckout, Model<ICheckout>>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User is required"],
      ref: "User",
    },
    products: [CartProductSchema],
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
  },
  { collection: "Checkouts", timestamps: true }
);

const CheckoutModel = model<ICheckout>("Checkout", CheckoutSchema);

export default CheckoutModel;
