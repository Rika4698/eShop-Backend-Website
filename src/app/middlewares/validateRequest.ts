import { ZodSchema, ZodError, ZodObject, ZodRawShape } from 'zod';
import catchAsync from '../utils/catchAsync';
import { NextFunction, Request, Response } from 'express';

const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body );
      next();
    } catch (error) {
      if (error instanceof ZodError) {
     
        const zodErrors = (error as ZodError).issues.map((issue) => issue.message);
        return res.status(400).json({
          success: false,
          errors: zodErrors,
        });
      }
      next(error);
    }
  };
};


export const validateRequestCookies = (schema: ZodObject<ZodRawShape>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedCookies = await schema.parseAsync({
      cookies: req.cookies,
    });

    req.cookies = parsedCookies.cookies as Record<string, any>;

    next();
  });
};

export default validateRequest;
