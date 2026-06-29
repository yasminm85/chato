import nodemailer from 'nodemailer';
import { BrevoClient } from '@getbrevo/brevo';

const sendOtp = async (userEmail, otp) => {
  const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
  
  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      subject: 'Chato - Password Reset!',
      sender: {
        name: process.env.SENDER_NAME,
        email: process.env.SENDER_EMAIL,
      },
      to: [{ email: userEmail }],
      htmlContent: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 3px solid #000; box-shadow: 4px 4px 0 #000; max-width: 400px;">
                    <h2 style="color: #000;">Please Input This OTP</h2>
                    <p style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; font-weight: bold; border: 2px solid #000; box-shadow: 2px 2px 0 #888;">
                        ${otp}
                    </>
                </div>
            `,
    });
  } catch (error) {
    console.error('Failed send otp', error);
  }
};

export default sendOtp;
