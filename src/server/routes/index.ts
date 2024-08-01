import { Router } from "express";
import AuthRouter from "./auth";
import ProductRouter from "./product";
import CartRouter from "./cart";
import CheckOutRouter from "./checkout";

const router = Router();
export default router;

router.use("/auth", AuthRouter);
router.use("/product", ProductRouter);
router.use("/cart", CartRouter);
router.use("/checkout", CheckOutRouter);
