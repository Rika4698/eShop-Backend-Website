import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import prisma from "../../utils/prisma";
import bcrypt from 'bcryptjs';
import config from "../../config";
import { UserRole } from "@prisma/client";




const createAdmin = async (payload: {
  name: string;
  password: string;
  email: string;
}) => {
  // checking if the user is exist
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is already exist!');
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPT_SALT_ROUND),
  );

  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
      include: {
        admin: true,
      },
    });

    return await tx.admin.create({
      data: {
        name: payload.name,
        email: user.email,
        image:'https://i.ibb.co.com/zTC2VwSK/4122823.png',
        
      },
      

    });


  });

  return newUser;
};



const createVendor = async (payload: {
  name: string;
  password: string;
  email: string;
  role?: string;
  shopName?: string;
  logo?: string;
  description?: string;
}) => {
  // checking if the user is exist
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
console.log(user);

  if (user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is already exist!');
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPT_SALT_ROUND),
  );

  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.VENDOR,
      },
      include: {
        vendor: true,
      },
    });

    return await tx.vendor.create({
      data: {
        name: payload.name,
        email: user.email,
      },
      include: {
        user: true,
      },
    });

    
  });

  return newUser;
};



const createCustomer = async (payload: {
  name: string;
  password: string;
  email: string;
}) => {
  // checking if the user is exist
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is already exist!');
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPT_SALT_ROUND),
  );

  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.CUSTOMER,
      },
      include: {
        customer: true,
      },
    });

   return await tx.customer.create({
      data: {
        name: payload.name,
        email: user.email,
       image:'https://i.ibb.co.com/YBpxwzwN/free-user-icon-3297-thumb.png',
      },
    });

    
  });

 

  return newUser;
};





export const userService = {
  createAdmin,
  createVendor,
  createCustomer,
  
};