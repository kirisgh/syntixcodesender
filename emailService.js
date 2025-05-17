import nodemailer from 'nodemailer';

const VERIFICATION_CODES = new Map(); // email => { code, expiresAt }

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationCode(email) {
  const code = generateCode();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now

  // Store the code in memory
  VERIFICATION_CODES.set(email, { code, expiresAt });

  // Configure Nodemailer transporter (use your real credentials)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Your Verification Code',
    text: `Your verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
  return code;
}

export function verifyCode(email, inputCode) {
  const entry = VERIFICATION_CODES.get(email);
  if (!entry) return false;
  const { code, expiresAt } = entry;

  const isValid = code === inputCode && Date.now() < expiresAt;
  if (isValid) {
    VERIFICATION_CODES.delete(email); // One-time use
    return true;
  }
  return false;
}