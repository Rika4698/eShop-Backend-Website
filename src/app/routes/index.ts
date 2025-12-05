import { Router } from 'express';
import { UserRoutes } from '../modules/Users/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { ProductRoutes } from '../modules/Products/product.route';
import { CategoryRoutes } from '../modules/Category/category.route';



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


];

moduleRouter.forEach((route) => router.use(route.path, route.route));

export default router;
