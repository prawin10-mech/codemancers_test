import jwt from "jsonwebtoken";

export const generateJwtToken = async (data: any) => {
  try {
    const jwtSecret = process.env.JWT_SECRET || "secret_key";
    const token = jwt.sign(data, jwtSecret);

    return token;
  } catch (error) {
    return null;
  }
};
