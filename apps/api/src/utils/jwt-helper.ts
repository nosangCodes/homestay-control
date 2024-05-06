import jwt from "jsonwebtoken";

const generateToken = (email: string, userId: number) => {
  if (!process.env.JWT_SECRET) {
    throw Error("jwt secret  is missing");
  }
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: "4h",
  });
};

const verifyToken = (token: string) => {
  if (!process.env.JWT_SECRET) {
    throw Error("jwt secret  is missing");
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};

export { generateToken, verifyToken };
