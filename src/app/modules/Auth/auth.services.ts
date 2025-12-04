import { TLoginUser } from "./auth.interface";
import prisma from '../../utils/prisma';
import { UserStatus } from "@prisma/client";
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcryptjs';
import { createToken } from "../../utils/jwt";
import config from '../../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';


const loginUser = async (payload: TLoginUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User not found!');
  }

  //checking if the password is correct
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    userData.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Password does not matched');
  }

  //create token and sent to the  client
  const jwtPayload = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    config.JWT_REFRESH_EXPIRES as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {

  const decoded = jwt.verify(
    token,
    config.JWT_REFRESH_SECRET as string,
  ) as JwtPayload;

  const { email } = decoded;


  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
      status: UserStatus.ACTIVE,
    },
  });

  const jwtPayload = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES as string,
  );

  return {
    accessToken,
  };
};







export const AuthServices = {
  loginUser,
  refreshToken,

  
};