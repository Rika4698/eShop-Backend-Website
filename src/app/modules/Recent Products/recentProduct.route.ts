import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { RecentProductViewController } from './recentProduct.controller';

const router = express.Router();

router.post(
  '/create',
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  RecentProductViewController.createRecentProduct,
);





export const RecentViewProductRoutes = router;
