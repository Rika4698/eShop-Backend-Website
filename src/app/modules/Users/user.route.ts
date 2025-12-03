import express  from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from './user.validation';
import { userController } from './user.controller';

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



export const UserRoutes = router;




