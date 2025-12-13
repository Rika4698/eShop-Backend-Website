/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { join } from 'path';
import { readFileSync } from 'fs';
import { verifyPayment } from '../../utils/payment';
import prisma from '../../utils/prisma';




const confirmationService = async (transactionId: string, status?: string) => {
  console.log('Payment confirmation service started');
  console.log('Transaction ID:', transactionId);
  console.log('Status from URL:', status);

  try {
    // Verify payment with Aamarpay
    const verifyResponse = await verifyPayment(transactionId);
    console.log('Gateway verification response:', JSON.stringify(verifyResponse, null, 2));

    let result;
    let message = '';
    let paymentSuccess = false;



    // Check payment status from gateway response
    const paymentStatus = verifyResponse?.pay_status || verifyResponse?.status;
    console.log('Payment status from gateway:', paymentStatus);

    // More comprehensive status checking
    const isSuccessful = paymentStatus && 
      (paymentStatus.toLowerCase() === 'successful' || 
       paymentStatus.toLowerCase() === 'success' ||
       paymentStatus === 'PAID' ||
       paymentStatus === 'Successful');

    if (isSuccessful) {
      // Update order to PAID
      result = await prisma.order.update({
        where: { transactionId },
        data: { paymentStatus: 'PAID' },
      });
      message = '🎉 Payment Successful!';
      paymentSuccess = true;
      console.log('Order updated to PAID:', result.id);
    } else {
      // Update order to UNPAID
      result = await prisma.order.update({
        where: { transactionId },
        data: { paymentStatus: 'UNPAID' },
      });
      message = '❌ Payment Failed!';
      paymentSuccess = false;
      console.log('Order marked as UNPAID');
    }

    // Read HTML template from root
    const filePath = join(__dirname, '../../../../confirmation.html');
    let template = readFileSync(filePath, 'utf-8');
    template = template.replace('{{message}}', message);

    // Add redirect script
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (paymentSuccess) {
      template = template.replace(
        '</body>',
        `<script>
          console.log('Payment successful, redirecting in 2 seconds...');
          setTimeout(function() {
            window.location.href = '${frontendUrl}/payment-success?orderId=${result.id}&transactionId=${transactionId}';
          }, 2000);
        </script></body>`
      );
    } else {
      template = template.replace(
        '</body>',
        `<script>
          console.log('Payment failed, redirecting in 2 seconds...');
          setTimeout(function() {
            window.location.href = '${frontendUrl}/payment-failed?transactionId=${transactionId}';
          }, 2000);
        </script></body>`
      );
    }

    return template;

  } catch (error: any) {
    console.error('Payment confirmation error:', error);

    // Try to update order to UNPAID on error
    try {
      await prisma.order.update({
        where: { transactionId },
        data: { paymentStatus: 'UNPAID' },
      });
      console.log('Order marked as UNPAID due to error');
    } catch (dbError) {
      console.error('Failed to update order in DB:', dbError);
    }

    // Return error HTML
    const filePath = join(__dirname, '../../../../confirmation.html');
    let template = readFileSync(filePath, 'utf-8');
    template = template.replace('{{message}}', 'Payment verification failed!');

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    template = template.replace(
      '</body>',
      `<script>
        console.log('Error occurred, redirecting...');
        setTimeout(function() {
          window.location.href = '${frontendUrl}/payment-failed?error=verification-failed';
        }, 2000);
      </script></body>`
    );

    return template;
  }
};




export const paymentServices = {
  confirmationService,
};
