import { Router } from 'express';
import { UserRoutes } from '../modules/Users/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';



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


];

moduleRouter.forEach((route) => router.use(route.path, route.route));

export default router;
