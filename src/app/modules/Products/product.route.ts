import { UserRole } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import { upload } from '../../config/multer.config';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = express.Router();

router.post(
  '/create-product', upload.fields([
    { name: "image", maxCount: 10 },
]),
(req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    // console.log(req.body,"body");
    
    next();
},
  auth(UserRole.VENDOR),
  validateRequest(ProductValidation.createProductValidation),
  ProductController.createProduct,
);

router.get('/all-product', ProductController.getAllProducts);




export const ProductRoutes = router;
