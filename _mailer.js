import nodemailer from 'nodemailer';

export async function sendEmail(to, code) {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: '"Syntix Verification" <no-reply@syntix.com>',
    to: to,
    subject: 'Your Syntix Verification Code',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  });

  console.log('Email sent:', info.messageId);
}