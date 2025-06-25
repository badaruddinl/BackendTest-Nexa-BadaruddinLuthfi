import jwt, { JwtPayload } from "jsonwebtoken";
import ms from "ms";
import dotenv from "dotenv";
dotenv.config();

interface JwtPayloadExtended extends JwtPayload {
  id: number;
  username: string;
}

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET enviroment variable is not defined");
}

const expiresIn = Number(process.env.JWT_EXPIRES_IN);

const jwtExpire = expiresIn > 0 ? ms(`${expiresIn}H`) / 1000 : 3600;

export const generateJWT = (data: { id: number; username: string }) => {
  try {
    const payload: JwtPayloadExtended = {
      id: data.id,
      username: data.username,
      iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(payload, secret, { expiresIn: jwtExpire });
  } catch (error) {
    console.error("Error generating JWT:", error);
    throw new Error("Error generating JWT");
  }
};

export const decodeJWT = (token: string): JwtPayload | null => {
  return jwt.decode(token) as JwtPayload | null;
};

export const decodeExpJWT = (token: string): number | null => {
  const decoded = jwt.decode(token) as JwtPayload | null;

  if (decoded && typeof decoded.exp === "number") {
    return decoded.exp; // epoch detik
  }

  return null;
};

export const decodeExpAsDate = (token: string): Date | null => {
  const decoded = jwt.decode(token) as JwtPayload | null;

  if (decoded && decoded.exp) {
    return new Date(decoded.exp * 1000); // convert to ms
  }

  return null;
};
