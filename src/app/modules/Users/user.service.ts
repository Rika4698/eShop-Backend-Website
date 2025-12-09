import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import prisma from "../../utils/prisma";
import bcrypt from 'bcryptjs';
import config from "../../config";
import { UserRole } from "@prisma/client";
import { createToken } from "../../utils/jwt";




export const createAdmin = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, "This user already exists!");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPT_SALT_ROUND)
  );


  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
      include: { admin: true },
    });

    const admin = await tx.admin.create({
      data: {
        name: payload.name,
        email: user.email,
        image: "https://i.ibb.co/zTC2VwSK/4122823.png", 
      },
    });

    return { ...user, admin };
  });

  // Create JWT tokens
  const jwtPayload = {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    config.JWT_REFRESH_EXPIRES as string
  );

  // Return combined result
  const combinedResult = {
    accessToken,
    refreshToken,
    newUser,
  };

  return combinedResult;
};


export const createVendor = async (payload: {
  name: string;
  password: string;
  email: string;
  role?: string;
  shopName?: string;
  logo?: string;
  description?: string;
}) => {

  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  console.log(existingUser);

  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, "This user already exists!");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPT_SALT_ROUND)
  );


  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.VENDOR,
      },
      include: { vendor: true },
    });

    const vendor = await tx.vendor.create({
      data: {
        name: payload.name,
        email: user.email,
        shopName: payload.shopName,
        logo: payload.logo,
        description: payload.description,
      },
      include: { user: true },
    });

    return { ...user, vendor };
  });

  // Create JWT tokens
  const jwtPayload = {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    config.JWT_REFRESH_EXPIRES as string
  );

  // Return combined result
  const combinedResult = {
    accessToken,
    refreshToken,
    newUser,
  };

  return combinedResult;
};





export const createCustomer = async (payload: {
  name: string;
  password: string;
  email: string;
}) => {

  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, "This user already exists!");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPT_SALT_ROUND)
  );


  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.CUSTOMER,
      },
      include: { customer: true },
    });

    const customer = await tx.customer.create({
      data: {
        name: payload.name,
        email: user.email,
        image: "https://i.ibb.co/YBpxwzwN/free-user-icon-3297-thumb.png",
      },
      include: { user: true },
    });

    return { ...user, customer };
  });

  // Create JWT tokens
  const jwtPayload = {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    config.JWT_REFRESH_EXPIRES as string
  );

  // Return combined result
  const combinedResult = {
    accessToken,
    refreshToken,
    newUser,
  };

  return combinedResult;
};





export const userService = {
  createAdmin,
  createVendor,
  createCustomer,
  
};