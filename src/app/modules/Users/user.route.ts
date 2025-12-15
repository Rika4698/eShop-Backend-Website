import express, { NextFunction, Request, Response }  from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from './user.validation';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { upload } from '../../config/multer.config';

const router = express.Router();

router.post('/create-admin',validateRequest(userValidation.createUser),userController.createAdmin,
);


router.post(
  '/create-vendor',
  validateRequest(userValidation.createUser),
  userController.createVendor,
);

router.post(
  '/create-customer',
  validateRequest(userValidation.createUser),
  userController.createCustomer,
);


router.get('/all',auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.getAllFromDB,
);

router.get("/vendors/all", userController.getPublicVendors);

router.get(
  '/me',
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  userController.getMyProfile,
);

router.get(
  '/get-vendor/:vendorId',
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  userController.getVendorUser,
);



router.get(
  '/get-customer/:email',
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  userController.getCustomerUser,
);



router.post('/follow', auth(UserRole.CUSTOMER), userController.followVendor);

router.delete(
  '/unfollow',
  auth(UserRole.CUSTOMER),
  userController.unfollowVendor,
);

router.patch(
  '/update-customer',
  auth(UserRole.CUSTOMER),
  upload.fields([{ name: "image", maxCount: 1 }]),
  
     userController.updateCustomer
);

router.patch(
  '/update-vendor',
  auth(UserRole.VENDOR),upload.fields([{ name: "image", maxCount: 1 }]),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
},
  userController.updateVendor,
);


router.patch(
  '/:id/status',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(userValidation.updateStatus),
  userController.changeUpdateUserStatus,
);


router.delete(
  '/:userId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.deleteUser,
);

router.patch(
  '/update-vendor-status/:vendorId',  
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),     
  userController.updateVendorStatus,  
);


export const UserRoutes = router;




