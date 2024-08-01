import { Router } from "express";
import { LoginUser, SignInUser } from "../controller/auth.controller";
import createJoiSchemaValidator from "../middleware/joiValidator";
import Joi from "joi";

const AuthRouter = Router();
export default AuthRouter;

AuthRouter.post(
  "/login",

  LoginUser
);
AuthRouter.post("/signin", SignInUser);
