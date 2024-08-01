import { Router } from "express";
import {
  AddProductToCart,
  GetCartProducts,
  RemoveFromCart,
} from "../controller/cart.controller";
import Authenticate from "../middleware/middleware";

const CartRouter = Router();
export default CartRouter;

CartRouter.get("/get_cart", Authenticate, GetCartProducts);

CartRouter.post("/add_product_to_cart", Authenticate, AddProductToCart);

CartRouter.post("/remove_product", Authenticate, RemoveFromCart);
