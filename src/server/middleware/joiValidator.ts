import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export default function createJoiSchemaValidator(
  schema: Joi.Schema,
  options?: {
    target?: "body" | "query" | "params";
    failedStatusCode?: number;
    replace?: boolean;
    validationOptions?: Joi.ValidationOptions;
    context?: Joi.Context;
  }
) {
  if (!options) {
    options = { target: "body" };
  }

  const {
    target = "body",
    validationOptions = {},
    replace = true,
    failedStatusCode = 400,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req[target], {
      ...validationOptions,
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      console.error("Joi schema validation error at " + req.path, {
        error: error.details,
        scope: "schema-validation",
        path: req.baseUrl + req.path,
      });

      res.status(failedStatusCode).json({
        ...error.details,
        code: "data-validation-error",
        message: error.message,
      });
    } else {
      if (replace) req[target] = value;

      next();
    }
  };
}
