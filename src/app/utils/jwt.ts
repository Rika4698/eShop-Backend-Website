import { UserRole } from "@prisma/client";
import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import AppError from "../errors/appError";


export const createToken = (
  jwtPayload: {
    id: string;
    email: string;
    role: UserRole;
  },
  secret: string,
  expiresIn: string,
) => {
    const options: SignOptions ={
        expiresIn: expiresIn as any,
    };
  return jwt.sign(jwtPayload, secret as Secret , options);
};



export const verifyToken = (
  token: string,
  secret: string,
): JwtPayload | Error => {
  try {
    return jwt.verify(token, secret as Secret) as JwtPayload;
  } catch (error: any) {
    throw new AppError(401, 'You are not authorized!');
  }
};