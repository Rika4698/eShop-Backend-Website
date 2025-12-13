import { Router } from 'express';
import { paymentController } from './payment.controller';

const router = Router();

router.post('/confirmation', paymentController.confirmationController);
router.get('/confirmation', paymentController.confirmationController);


export const PaymentRoutes = router;
