import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CouponServices } from "./coupon.service";




const createCoupon = catchAsync(async (req, res) => {
  const result = await CouponServices.createCoupon(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupon created successfully!',
    data: result,
  });
});



const getAllCoupons = catchAsync(async (req, res) => {
  const result = await CouponServices.getAllCoupons();

  sendResponse(res, {
    statusCode:StatusCodes.OK,
    success: true,
    message: 'Coupons retrieved successfully!',
    data: result,
  });
});



const updateCoupon = catchAsync(async (req, res) => {
  const { couponId } = req.params;

  const result = await CouponServices.updateCoupon(couponId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupon updated successfully!',
    data: result,
  });
});



const deleteCoupon = catchAsync(async (req, res) => {
  const { couponId } = req.params;

  const result = await CouponServices.deleteCoupon(couponId);

  sendResponse(res, {
    statusCode:StatusCodes.OK,
    success: true,
    message: 'Coupon delete successfully!',
    data: result,
  });
});


export const CouponController = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  
};