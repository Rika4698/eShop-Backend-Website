import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { ICoupon } from "./coupon.interface";
import prisma from "../../utils/prisma";
import { DiscountStatus } from "@prisma/client";



const createCoupon = async (payload: ICoupon) => {
  if (payload.discountValue <= 0) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'Discount value must be greater than 0.',
    );
  }

  const coupon = await prisma.coupon.create({
    data: payload,
  });

  return coupon;
};




const getAllCoupons = async () => {
  const activeCoupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
    },
  });

  return activeCoupons;
};



const updateCoupon = async (
  couponId: string,
  payload: {
    code?: string;
    discountStatus?: DiscountStatus;
    discountValue?: number;
    endDate?: Date;
  },
) => {
  const isCouponExists = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!isCouponExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Coupon not found!');
  }

  const updatedCoupon = await prisma.coupon.update({
    where: { id: couponId },
    data: payload,
  });

  return updatedCoupon;
};


const deleteCoupon = async (couponId: string) => {
  const isCouponExists = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!isCouponExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Coupon not found!');
  }

  const deletedCoupon = await prisma.coupon.delete({
    where: { id: couponId },
    
   
  });

  return deletedCoupon;
};



export const CouponServices = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,

};
