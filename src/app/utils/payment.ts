import axios from 'axios';
import config from '../config';

export const initiatePayment = async (paymentData: any) => {
  try {
    const response = await axios.post(config.PAYMENT_URL!, {
      store_id: config.STORE_ID,
      signature_key: config.SIGNATURE_KEY,
      tran_id: paymentData.transactionId,
      success_url: `http://localhost:5000/api/payments/confirmation?transactionId=${paymentData.transactionId}&status=success`,
      fail_url: `http://localhost:5000/api/payments/confirmation?status=failed`,
      cancel_url: 'http://localhost:3000/',
      amount: paymentData.amount,
      currency: 'BDT',
      desc: 'Merchant Registration Payment',
      cus_name: paymentData.customerName,
      cus_email: paymentData.customerEmail,
      cus_add1: 'N/A',
      cus_add2: 'N/A',
      cus_city: 'N/A',
      cus_state: 'N/A',
      cus_postcode: 'N/A',
      cus_country: 'N/A',
      cus_phone: 'N/A',
      type: 'json',
    });

    return response.data;
  } catch (error) {
    throw new Error('Payment initiation failed!');
  }
};