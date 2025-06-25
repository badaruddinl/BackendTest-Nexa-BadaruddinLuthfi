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

export const verifyJwt = async (
  token: string
): Promise<{ status: boolean; decoded: JwtPayloadExtended | null }> => {
  try {
    if (await isJwtFormatValid(token)) {
      const decoded = jwt.verify(token, secret) as JwtPayloadExtended;

      if (!isTokenExpired(decoded)) {
        return {
          status: true,
          decoded,
        };
      }
    }

    return {
      status: false,
      decoded: null,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return {
      status: false,
      decoded: null,
    };
  }
};

export const isJwtFormatValid = async (token: string): Promise<boolean> => {
  const parts = token.split(".");

  if (parts.length !== 3) {
    return false;
  }

  const [header, payload] = parts;

  if (!header || !payload) {
    return false;
  }

  try {
    Buffer.from(header, "base64").toString("utf8"); // Decode header
    Buffer.from(payload, "base64").toString("utf8"); // Decode payload
  } catch (error) {
    return false; // Invalid base64 format
  }

  return true; // JWT format is correct
};

export const isTokenExpired = (decoded: JwtPayloadExtended): boolean => {
  const expirationTime = decoded.exp;
  if (typeof expirationTime !== "undefined") {
    const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
    return expirationTime < currentTimestamp;
  }
  return true; // Missing exp claim
};
