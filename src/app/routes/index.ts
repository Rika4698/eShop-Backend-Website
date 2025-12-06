import { Router } from 'express';
import { UserRoutes } from '../modules/Users/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { ProductRoutes } from '../modules/Products/product.route';
import { CategoryRoutes } from '../modules/Category/category.route';
import { OrderRoutes } from '../modules/Orders/order.route';
import { CouponRoutes } from '../modules/Coupon/coupon.route';



const router = Router();

const moduleRouter = [
   {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
   {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
   {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/coupons',
    route: CouponRoutes,
  },


];

moduleRouter.forEach((route) => router.use(route.path, route.route));

export default router;
