import { Router } from 'express';
import { paymentController } from './payment.controller';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/confirmation', paymentController.confirmationController);
router.get('/confirmation', auth(UserRole.CUSTOMER), paymentController.confirmationController);


export const PaymentRoutes = router;
