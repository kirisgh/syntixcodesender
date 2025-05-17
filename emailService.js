import nodemailer from 'nodemailer';
import express from 'express';

const VERIFICATION_CODES = new Map(); // email => { code, expiresAt }

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());;

app.post('/send-email', async (req, res) => {
  try {
    // Your nodemailer email sending code here
    res.status(200).json({ message: 'Email sent!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.post('/', async (req, res) => {
  const { email, code } = req.body;

  // ✅ Make sure logging happens after the destructuring
  console.log("Received request body:", req.body);
  console.log("Email:", email);
  console.log("Code:", code);

  if (!email || !code) {
    return res.status(400).json({ message: "Missing email or code" });
  }
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
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    debug: true,
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Your 6-digit Verification Code",
    text: `Your verification code is ${code}`,
    html: `<p>Your verification code is <strong>${code}</strong></p>`,
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