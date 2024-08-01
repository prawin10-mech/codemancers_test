import { Model, model, Schema } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;

  readonly createdAt: Date;
}

const UserSchema = new Schema<IUser, Model<IUser>>(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is Required"] },
    password: { type: String, required: [true, "Password is required"] },
    role: {
      type: String,
      required: [true, "Role is Required"],
      enum: ["USER", "ADMIN"],
    },
  },
  { collection: "Users", timestamps: true }
);

const UserModel = model("User", UserSchema);

export default UserModel;
