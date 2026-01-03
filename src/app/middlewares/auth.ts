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
        const token = req.cookies?.clientAccessToken || req.headers?.clientAccessToken;

      if (!token) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
      }

      const decoded = verifyToken(
        token,
        config.JWT_ACCESS_SECRET as string,
      ) as JwtPayload;

      const { role, email } = decoded;

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
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;