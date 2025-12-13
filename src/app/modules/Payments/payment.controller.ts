import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { paymentServices } from './payment.services';
import config from '../../config';

const confirmationController = catchAsync(async (req: Request, res: Response) => {
  const transactionId = req.query.transactionId || req.body.transactionId;
  const status = req.query.status || req.body.status;

  // console.log('Payment confirmation endpoint hit');
  // console.log('Full URL:', req.originalUrl);
  // console.log('Query params:', req.query);
  // console.log('Transaction ID:', transactionId);

  if (!transactionId) {
    console.error('No transaction ID provided');
    return res.status(400).send(`
      <html>
        <body>
          <h1>Error: Transaction ID is required</h1>
          <a href="${config.FRONTEND_URL}">Go back to home</a>
        </body>
      </html>
    `);
  }

  const result = await paymentServices.confirmationService(
    transactionId as string,
    status as string,
  );

  // Send HTML response
  res.send(result);
});

export const paymentController = {
  confirmationController,
};