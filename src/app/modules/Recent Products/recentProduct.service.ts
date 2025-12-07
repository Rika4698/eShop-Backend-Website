import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import prisma from "../../utils/prisma";
import { IAuthUser } from "../Users/user.interface";




const createRecentProducts = async (
  payload: { productId: string },
  user: IAuthUser,
) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: user?.email,
      isDeleted: false,
    },
  });
console.log(customer);

  if (!customer) {
    throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist!");
  }

  const product = await prisma.product.findUnique({
    where: {
      id: payload.productId,
      isDeleted: false,
    },
  });

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product doesn't exist!");
  }

  const existingRecentProduct = await prisma.recentProductView.findFirst({
    where: {
      customerId: customer.id,
      productId: product.id,
    },
    include: {
      customer: true,
      product: true,
    },
  });

  if (existingRecentProduct) {
    return;
  }

  const recentProduct = await prisma.recentProductView.create({
    data: {
      customerId: customer.id,
      productId: product.id,
    },
    include: {
      customer: true,
      product: true,
    },
  });

  return recentProduct;
};


export const RecentProductViewServices = {
  createRecentProducts,
  
};