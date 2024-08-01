import { Router } from "express";
import {
  AddProduct,
  DeleteProduct,
  EditProduct,
  GetProducts,
} from "../controller/product.controller";

const ProductRouter = Router();
export default ProductRouter;

ProductRouter.post("/add_product", AddProduct);

ProductRouter.get("/get_products", GetProducts);

ProductRouter.put("/edit_product/:id", EditProduct);

ProductRouter.delete("/delete_product/:id", DeleteProduct);
