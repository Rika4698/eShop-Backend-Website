import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/appError';
import { verifyToken } from '../utils/jwt';
import config from '../config';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { UserStatus } from '@prisma/client';


const auth = (...roles: string[]) => {
  return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.headers?.accessToken || req.cookies?.clientAccessToken || req.headers?.clientAccessToken;

      if (!token) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
      }
      console.log(token,"rrrrr")

      const decoded = verifyToken(
        token,
        config.JWT_ACCESS_SECRET as string,
      ) as JwtPayload;

      console.log(decoded,"jjjhh");

      const { role, email } = decoded;

      console.log(decoded,"jjj");

      await prisma.user.findUniqueOrThrow({
        where: {
          email,
          status: UserStatus.ACTIVE,
        },
      });

      if (roles.length && !roles.includes(role)) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Forbidden!');
      }

      req.user = decoded as JwtPayload;
      console.log(req.user,"edrftff");
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;