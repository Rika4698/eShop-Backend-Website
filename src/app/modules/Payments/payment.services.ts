/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { join } from 'path';
import { readFileSync } from 'fs';
import { verifyPayment } from '../../utils/payment';
import prisma from '../../utils/prisma';

const confirmationService = async (transactionId: string, status: string) => {
  try {
    const verifyResponse = await verifyPayment(transactionId);
    
    //  response to debug
    console.log('Verify Response:', JSON.stringify(verifyResponse, null, 2));
    
    let result;
    let message = '';

    // Check multiple possible 
    const paymentStatus = verifyResponse?.pay_status || verifyResponse?.status;
    const isSuccessful = paymentStatus && 
      (paymentStatus.toLowerCase() === 'successful' || 
       paymentStatus.toLowerCase() === 'success' ||
       paymentStatus === 'PAID');

    if (isSuccessful) {
      result = await prisma.order.update({
        where: {
          transactionId: transactionId,
        },
        data: {
          paymentStatus: 'PAID',
        },
      });
      message = 'Successfully Paid!';
      console.log('Order updated to PAID:', result);
    }
    
    else {
     
      result = await prisma.order.update({
        where: {
          transactionId: transactionId,
        },
        data: {
          paymentStatus: 'UNPAID',
        },
      });
      message = 'Payment Failed!';
      console.log('Order updated to FAILED:', result);
    }

    const filePath = join(__dirname, '../../../../confirmation.html');
    let template = readFileSync(filePath, 'utf-8');

    template = template.replace('{{message}}', message);

    return template;
  } catch (error) {
    console.error('Confirmation Service Error:', error);
    
 
    await prisma.order.update({
      where: {
        transactionId: transactionId,
      },
      data: {
        paymentStatus: 'UNPAID',
      },
    });
    
    const filePath = join(__dirname, '../../../../confirmation.html');
    let template = readFileSync(filePath, 'utf-8');
    template = template.replace('{{message}}', 'Payment verification failed!');
    
    return template;
  }
};
export const paymentServices = {
  confirmationService,
};
