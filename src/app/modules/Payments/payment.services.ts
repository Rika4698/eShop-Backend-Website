/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { join } from 'path';
import { readFileSync } from 'fs';
import { verifyPayment } from '../../utils/payment';
import prisma from '../../utils/prisma';




const confirmationService = async (transactionId: string, status?: string) => {
  // console.log('Payment confirmation service started');
  // console.log('Transaction ID:', transactionId);
  // console.log('Status from URL:', status);

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

    // Comprehensive status checking
    const isSuccessful = paymentStatus && 
      (paymentStatus.toLowerCase() === 'successful' || 
       paymentStatus.toLowerCase() === 'success' ||
       paymentStatus === 'PAID' ||
       paymentStatus === 'Successful');

    const isCancelled = status?.toLowerCase() === 'cancel' || 
                        paymentStatus?.toLowerCase() === 'cancelled' ||
                        paymentStatus?.toLowerCase() === 'cancel';

    if (isSuccessful) {
      // PAYMENT SUCCESSFUL
      result = await prisma.$transaction(async (tx) => {
        // 1. Update order to PAID
        const order = await tx.order.update({
          where: { transactionId },
          data: { paymentStatus: 'PAID' },
        });

        // 2. Record coupon usage if applicable
        if (order.couponCode) {
          const coupon = await tx.coupon.findUnique({
            where: { code: order.couponCode },
          });

          if (coupon) {
            // Increment usage count
            await tx.coupon.update({
              where: { id: coupon.id },
              data: { usedCount: { increment: 1 } },
            });

            // Create usage record for this specific order
            await tx.customerCoupon.create({
              data: {
                customerId: order.customerId,
                couponId: coupon.id,
                orderId: order.id,  
                redeemedAt: new Date(),
                isRedeemed: true,
              },
            });

            console.log(`Coupon ${order.couponCode} usage recorded for order ${order.id}`);
          }
        }

        return order;
      });

      message = '🎉 Payment Successful!';
      paymentSuccess = true;
      console.log('Order updated to PAID:', result.id);

    } else if (isCancelled) {
      // PAYMENT CANCELLED BY USER
      result = await prisma.$transaction(async (tx) => {
        const order = await tx.order.update({
          where: { transactionId },
          data: { paymentStatus: 'UNPAID' },
        });

        // Restore product stock
        const orderDetails = await tx.orderDetail.findMany({
          where: { orderId: order.id },
        });

        for (const detail of orderDetails) {
          await tx.product.update({
            where: { id: detail.productId },
            data: {
              stockQuantity: { increment: detail.quantity },
            },
          });
        }

        console.log(`Payment cancelled. Stock restored for order: ${order.id}`);
        return order;
      });

      message = '❌ Payment Cancelled!';
      paymentSuccess = false;
      console.log('Payment cancelled by user');

    } else {
      // PAYMENT FAILED 
      result = await prisma.$transaction(async (tx) => {
        const order = await tx.order.update({
          where: { transactionId },
          data: { paymentStatus: 'UNPAID' },
        });

        // Restore product stock
        const orderDetails = await tx.orderDetail.findMany({
          where: { orderId: order.id },
        });

        for (const detail of orderDetails) {
          await tx.product.update({
            where: { id: detail.productId },
            data: {
              stockQuantity: { increment: detail.quantity },
            },
          });
        }

        console.log(`Stock restored for failed payment. Order: ${order.id}`);
        return order;
      });

      message = '❌ Payment Failed!';
      paymentSuccess = false;
      console.log('Order marked as UNPAID and stock restored');
    }

    // Read HTML template
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
    } else if (isCancelled) {
      template = template.replace(
        '</body>',
        `<script>
          console.log('Payment cancelled, redirecting in 2 seconds...');
          setTimeout(function() {
            window.location.href = '${frontendUrl}/payment-cancel?transactionId=${transactionId}';
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

    // Try to update order to UNPAID and restore stock on error
    try {
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.update({
          where: { transactionId },
          data: { paymentStatus: 'UNPAID' },
        });

        // Restore stock
        const orderDetails = await tx.orderDetail.findMany({
          where: { orderId: order.id },
        });

        for (const detail of orderDetails) {
          await tx.product.update({
            where: { id: detail.productId },
            data: {
              stockQuantity: { increment: detail.quantity },
            },
          });
        }

        console.log('Order marked as UNPAID and stock restored due to error');
      });
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
