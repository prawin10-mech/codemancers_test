import { Router } from "express";
import Authenticate from "../middleware/middleware";
import { CheckoutCart } from "../controller/checkout.controller";

const CheckOutRouter = Router();
export default CheckOutRouter;

CheckOutRouter.post("/", Authenticate, CheckoutCart);
