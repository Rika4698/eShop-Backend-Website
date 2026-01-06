/* eslint-disable no-console */
import { Resend } from 'resend';
import config from '../config';

const resend = new Resend(config.API_KEY);

export const sendEmail = async (to: string, resetLink: string) => {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset</h2>
          <p>Click the button below to reset your password:</p>
          <a 
            href="${resetLink}"
            style="
              display:inline-block;
              padding:10px 16px;
              background:#2563eb;
              color:#fff;
              text-decoration:none;
              border-radius:6px;
            "
          >
            Reset Password
          </a>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
       tracking: {
    opens: false,
    clicks: false,
  },
    } as any );

    console.log('✅ Reset email sent successfully via Resend');
  } catch (error) {
    console.error('❌ Error sending email via Resend:', error);
    throw error;
  }
};
