import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { CategoryController } from './category.controller';
import validateRequest from '../../middlewares/validateRequest';
import { categoryValidation } from './category.validation';
import { upload } from '../../config/multer.config';

const router = express.Router();

router.post(
  '/create-category',upload.fields([{ name: "image", maxCount: 1 }]),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
},
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(categoryValidation.createCategoryValidation),
  CategoryController.createCategory,
);



router.get('/all-category', CategoryController.getAllCategories);


router.patch(
  '/update-category/:categoryId',upload.fields([{ name: "image", maxCount: 1 }]),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
        // console.log(  req.body );
        
    }
    next();
},
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(categoryValidation.updateCategoryValidation),
  CategoryController.updateCategory,
);



router.delete(
  '/:categoryId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
