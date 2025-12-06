import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { CouponController } from './coupon.controller';
import validateRequest from '../../middlewares/validateRequest';
import { couponValidation } from './coupon.validation';

const router = express.Router();

router.post(
  '/create-coupon',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(couponValidation.createCouponValidation),
  CouponController.createCoupon,
);


router.get(
  '/all',
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.VENDOR,
  ),
  CouponController.getAllCoupons,
);



export const CouponRoutes = router;