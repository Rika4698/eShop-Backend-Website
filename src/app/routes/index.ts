import { Router } from 'express';
import { UserRoutes } from '../modules/Users/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { ProductRoutes } from '../modules/Products/product.route';
import { CategoryRoutes } from '../modules/Category/category.route';
import { OrderRoutes } from '../modules/Orders/order.route';
import { CouponRoutes } from '../modules/Coupon/coupon.route';
import { RecentViewProductRoutes } from '../modules/Recent Products/recentProduct.route';
import { PaymentRoutes } from '../modules/Payments/payment.route';



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
  {
    path: '/payments',
    route: PaymentRoutes,
  },
  {
    path: '/recent-products',
    route: RecentViewProductRoutes,
  },


];

moduleRouter.forEach((route) => router.use(route.path, route.route));

export default router;
