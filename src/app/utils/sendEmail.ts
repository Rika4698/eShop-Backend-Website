/* eslint-disable no-console */
import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.emailSender.EMAIL,
      pass: config.emailSender.APP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: config.emailSender.EMAIL,
      to, 
      subject: 'Password Reset Request', 
      html: `
        <p>Click the link to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `, 
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
