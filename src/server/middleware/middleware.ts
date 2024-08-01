import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, verify } from "jsonwebtoken";
import { CustomRequest } from "./CustomRequest";

const Authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const BearerToken = req.headers.authorization;

    const jwtSecret = process.env.JWT_SECRET || "secret_key";

    if (!BearerToken) return res.sendStatus(401);

    const token = BearerToken.split(" ")[1];
    const user = verify(token, jwtSecret) as {
      id: string;
    };
    (req as CustomRequest).userId = user.id;

    if (user.id) {
      next();
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      if (error.message === "jwt expired")
        return res.status(401).json({ code: "jwt expired" });
      if (error.message === "jwt malformed")
        return res.status(401).json({ code: "jwt malformed" });

      return res.status(401).json({ code: "other-error" });
    }
    return res.status(500).json({ code: "server-error" });
  }
};

export default Authenticate;
