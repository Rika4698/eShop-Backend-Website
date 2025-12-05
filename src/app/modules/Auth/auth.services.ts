import { TLoginUser } from "./auth.interface";
import prisma from '../../utils/prisma';
import { UserStatus } from "@prisma/client";
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcryptjs';
import { createToken, verifyToken } from "../../utils/jwt";
import config from '../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IAuthUser } from "../Users/user.interface";
import { sendEmail } from "../../utils/sendEmail";


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




const changePassword = async (
  payload: {
    oldPassword: string;
    newPassword: string;
  },
  user: IAuthUser,
) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exists!");
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password,
  );

  if (!isCorrectPassword) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Password incorrect!');
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.newPassword,
    Number(config.BCRYPT_SALT_ROUND),
  );

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: 'Password changed successfully!',
  };
};




const forgotPassword = async (payload: { email: string }) => {
  // console.log("REQ BODY =>", payload);

  if (!payload || !payload.email) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email is required!");
  }

  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData || userData.status !== UserStatus.ACTIVE) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist or inactive!");
  }

  const jwtPayload = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };
  console.log(userData.email);

  const resetToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    '20m',
  );

  const resetUILink = `${config.RESET_PASS_UI_LINK}?email=${userData.email}&token=${resetToken} `;

  await sendEmail(userData?.email, resetUILink);
};



const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  // console.log({ token, payload });

  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const decoded = verifyToken(
    token,
    config.JWT_ACCESS_SECRET as string,
  ) as JwtPayload;

  const { email } = decoded;

  if (payload?.email !== email) {
    throw new AppError(StatusCodes.FORBIDDEN, 'You are forbidden!');
  }
  // hash password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.BCRYPT_SALT_ROUND),
  );

  // update into database
  await prisma.user.update({
    where: {
      email: payload.email,
    },
    data: {
      password: newHashedPassword,
    },
  });
};


export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword

  
};