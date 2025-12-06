import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { ICoupon } from "./coupon.interface";
import prisma from "../../utils/prisma";



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



export const CouponServices = {
  createCoupon,
  getAllCoupons,

};
