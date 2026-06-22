import nodemailer from 'nodemailer';

const sendVerificationEmail = async (userEmail, token) => {
  console.log(userEmail, token);
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const verificationLink = `http://localhost:5173/verify-email/${token}`;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: userEmail,
      subject: 'Chato - Verifikasi Email Kamu!',
      html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 3px solid #000; box-shadow: 4px 4px 0 #000; max-width: 400px;">
                    <h2 style="color: #000;">Halo, selamat datang di Chato! 👋</h2>
                    <p>Satu langkah lagi buat mulai ngobrol. Klik tombol kotak di bawah ini buat verifikasi email kamu:</p>
                    <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; font-weight: bold; border: 2px solid #000; box-shadow: 2px 2px 0 #888;">
                        VERIFIKASI EMAIL
                    </a>
                    <p style="margin-top: 20px; font-size: 12px; color: #666;">Kalau tombol nggak jalan, copas link ini: <br> ${verificationLink}</p>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email Verification Has been send!');
  } catch (error) {
    console.error('Failed send email', error);
  }
};

export default sendVerificationEmail;
