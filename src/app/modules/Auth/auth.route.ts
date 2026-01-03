import express from 'express';
import validateRequest, { validateRequestCookies } from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';




const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);




router.post(
  '/refresh-token',
  validateRequestCookies(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

router.post(
  '/change-password',auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.VENDOR,
  ),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);


router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.forgotPassword,
);


router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthControllers.resetPassword,
);


router.post(
  '/logout',
  
  AuthControllers.logoutUser,
);

export const AuthRoutes = router;