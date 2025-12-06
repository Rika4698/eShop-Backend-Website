import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import prisma from "../../utils/prisma";
import { IAuthUser } from "../Users/user.interface";
import { TOrder, TOrderFilterRequest } from "./order.interface";
import { Coupon, PaymentStatus, Prisma } from '@prisma/client';
import { initiatePayment } from "../../utils/payment";
import { calculatePagination, IPaginationOptions } from "../../utils/calculatePagination";






const createOrder = async (payload: TOrder, user: IAuthUser) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: user?.email,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new AppError(StatusCodes.NOT_FOUND, "Customer doesn't exist!");
  }

  const vendor = await prisma.vendor.findUnique({
    where: {
      id: payload.vendorId,
      isDeleted: false,
    },
  });

  if (!vendor) {
    throw new AppError(StatusCodes.NOT_FOUND, "Vendor doesn't exist!");
  }

  let existingCoupon: null | Coupon;

  if (payload.coupon) {
    existingCoupon = await prisma.coupon.findUnique({
      where: { code: payload.coupon },
    });

    if (!existingCoupon) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Coupon not found!');
    }

    if (new Date() > existingCoupon.endDate) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Coupon is inactive or expired!',
      );
    }

    const alreadyRedeemed = await prisma.customerCoupon.findUnique({
      where: {
        customerId_couponId: {
          customerId: customer.id,
          couponId: existingCoupon.id,
        },
      },
    });

    if (alreadyRedeemed) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Coupon already redeemed!');
    }
  }

  const order = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        customerId: customer.id,
        vendorId: vendor.id,
        deliveryAddress: payload.deliveryAddress,
        transactionId: payload.transactionId,
        paymentStatus: PaymentStatus.PENDING,
        totalPrice: payload.totalPrice,
      },
    });

    for (const detail of payload.orderDetails) {

      const product = await tx.product.update({
        where: { id: detail.productId },
        data: {
          stockQuantity: {
            decrement: detail.quantity,
          },
        },
      });

      if (product.stockQuantity < 0) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `Insufficient inventory for product ID ${detail.productId}. Available: ${product.stockQuantity + detail.quantity}, Required: ${detail.quantity}`,
        );
      }

      await tx.orderDetail.create({
        data: {
          orderId: order.id,
          productId: detail.productId,
          quantity: detail.quantity,
          pricePerUnit: detail.pricePerUnit,
        },
      });
    }

    if (existingCoupon) {
      await tx.coupon.update({
        where: { id: existingCoupon.id },
        data: { usedCount: { increment: 1 } },
      });

      await tx.customerCoupon.create({
        data: {
          customerId: customer.id,
          couponId: existingCoupon.id,
          redeemedAt: new Date(),
          isRedeemed: true,
        },
      });
    }

    return order;
  });

  const paymentData = {
    transactionId: payload?.transactionId,
    amount: payload?.totalPrice,
    customerName: customer.name,
    customerEmail: customer.email,
  };

  const paymentSession = await initiatePayment(paymentData);

  return { paymentSession, order };
};



const getAllOrders = async (
  filters: TOrderFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = calculatePagination(options);

  const andConditions: Prisma.OrderWhereInput[] = [];

  if (Object.keys(filters).length > 0) {
    const filterConditions = Object.keys(filters).map((key) => ({
      [key]: {
        equals: (filters as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  andConditions.push({
    vendor: {
      isDeleted: false,
    },
  });

  andConditions.push({
    customer: {
      isDeleted: false,
    },
  });

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { paymentStatus: 'asc' },
    include: {
      vendor: true,
      customer: true,
      orderDetails: {
        include: {
          product: true,
        },
      },
    },
  });

  const total = await prisma.order.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const OrderServices = {
  createOrder,
  getAllOrders

};