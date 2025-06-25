import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  id: number;
  username: string;
}

export const getInfo = async (request: Request) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    return null;
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return null;
  }

  let decoded: CustomJwtPayload;
  try {
    decoded = jwt.decode(token) as CustomJwtPayload;
  } catch {
    return null;
  }

  const { id, username, exp } = decoded;

  const currentTime = Math.floor(Date.now() / 1000);
  const expired = exp ? exp < currentTime : true;

  return {
    id,
    username,
    expired,
  };
};
