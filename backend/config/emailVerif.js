import nodemailer from 'nodemailer';
import { BrevoClient } from '@getbrevo/brevo';

const sendVerificationEmail = async (userEmail, token) => {
  const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

  const verificationLink = `http://localhost:5173/verify-email/${token}`;

  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      subject: 'Chato - Email Verification!',
      sender: {
        name: process.env.SENDER_NAME,
        email: process.env.SENDER_EMAIL,
      },
      to: [{ email: userEmail }],
      htmlContent: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 3px solid #000; box-shadow: 4px 4px 0 #000; max-width: 400px;">
                    <h2 style="color: #000;">Halo, welcome to Chato!</h2>
                    <p>Click link below to start using Chato:</p>
                    <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; font-weight: bold; border: 2px solid #000; box-shadow: 2px 2px 0 #888;">
                        Email Verification
                    </a>
                    <p style="margin-top: 20px; font-size: 12px; color: #666;">If this link can't work, copy this link: <br> ${verificationLink}</p>
                </div>
            `,
    });
  } catch (error) {
    console.error('Failed send email', error);
  }
};

export default sendVerificationEmail;
