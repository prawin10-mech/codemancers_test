import { Router } from "express";
import {
  AddProduct,
  DeleteProduct,
  EditProduct,
  GetProducts,
} from "../controller/product.controller";
import adminAuthenticate from "../middleware/AdminAuthenticate";

const ProductRouter = Router();
export default ProductRouter;

ProductRouter.post("/add_product", adminAuthenticate, AddProduct);

ProductRouter.get("/get_products", GetProducts);

ProductRouter.put("/edit_product/:id", adminAuthenticate, EditProduct);

ProductRouter.delete("/delete_product/:id", adminAuthenticate, DeleteProduct);
