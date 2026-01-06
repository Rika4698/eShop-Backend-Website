import { UserRole } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import { upload } from '../../config/multer.config';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = express.Router();
//create
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



//get all
router.get('/all-product', ProductController.getAllProducts);


//single product
router.get('/:productId',ProductController.getSingleProduct);




//update product
router.patch(
  '/:productId',upload.fields([
    { name: "image", maxCount: 10 },
]),(req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
 
    next();
},
  auth(UserRole.VENDOR),
  validateRequest(ProductValidation.updateProductValidation),
  ProductController.updateProduct,
);

//duplicate product
router.post(
  "/duplicate/:productId", auth(UserRole.VENDOR),
  ProductController.duplicateProduct
);

//delete
router.delete(
  '/:productId',
  auth(UserRole.VENDOR),
  ProductController.deleteProduct,
);



export const ProductRoutes = router;
