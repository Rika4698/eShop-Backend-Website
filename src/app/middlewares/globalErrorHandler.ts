import { ErrorRequestHandler } from 'express';
import config from '../../config';
import AppError from '../errors/appError';

import { Prisma } from '@prisma/client';
import { ZodError, ZodIssue } from 'zod';
import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode;
  let message = err.message || 'Something went wrong!';
  let error = err;

  // Prisma validation error (usually thrown for invalid data formats)
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode =StatusCodes.INTERNAL_SERVER_ERROR;
    message = 'Validation Error';
    error = err.message;
  } 
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma error code 'P2002' indicates a unique constraint violation (duplicate key error)
    if (err.code === 'P2002') {
      statusCode = StatusCodes.BAD_REQUEST;
      message = 'Duplicate Key error';
      error = err.meta;
    }
    if (err.code === "P1000") {
            message = "Authentication failed against database server",
            error = err.meta,
            statusCode = StatusCodes.BAD_GATEWAY
        }
        if (err.code === "P2003") {
            message = "Foreign key constraint failed",
                error = err.meta,
                statusCode = StatusCodes.BAD_REQUEST
        }
  }
   else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        message = "Unknown Prisma error occured!",
            error = err.message,
            statusCode = StatusCodes.BAD_REQUEST
    }
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        message = "Prisma client failed to initialize!",
            error = err.message,
            statusCode = StatusCodes.BAD_REQUEST
    }

  // Zod Validation Error
  else if (err instanceof ZodError) {
    statusCode =StatusCodes.BAD_REQUEST;
    message = 'Zod Validation Error';
    error = err.issues.map((issue: ZodIssue) => {
      return {
        path: issue?.path[issue.path.length - 1],
        message: issue?.message,
      };
    });
  }
  // throw new AppError validation
  else if (err instanceof AppError) {
    message = err?.message;
    error = err.message;
  }

  return res.status(statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message,
    error,
    stack: config.NODE_ENV === 'development' ? err.stack : null,
  });
};

export default globalErrorHandler;
