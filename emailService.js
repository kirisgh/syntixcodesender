import nodemailer from 'nodemailer';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const VERIFICATION_CODES = new Map(); // email => { code, expiresAt }

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ Send verification email
app.post('/send-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.log("❌ Missing email in request");
    return res.status(400).json({ message: "Missing email" });
  }

  const code = generateCode();
  const expiresAt = Date.now() + 5 * 60 * 1000; // expires in 5 mins
  VERIFICATION_CODES.set(email, { code, expiresAt });

  console.log(`📤 Sending code ${code} to ${email}`);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your 6-digit Verification Code",
      text: `Dear User,

        Thank you for registering with Syntix.

        Please use the following verification code to complete your email verification process:

        Verification Code: ${code}

        If you did not request this, please disregard this email.

        Best regards,  
        The Syntix Team`,

    html: `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <p>Dear User,</p>
        <p>Thank you for registering with <strong>Syntix</strong>.</p>
        <p>Please use the following verification code to complete your email verification process:</p>
        <p style="font-size: 20px; font-weight: bold; color: #2c3e50;">${code}</p>
        <p>If you did not request this, please disregard this email.</p>
        <p>Best regards,<br>The Syntix Team</p>
    </div>
    `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);

    return res.status(200).json({ message: 'Email sent!' });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
});

// ✅ Verify the code
app.post('/verify', (req, res) => {
  const { email, code } = req.body;

  console.log("🔍 Verifying code for:", email);
  console.log("Provided code:", code);

  if (!email || !code) {
    return res.status(400).json({ message: "Missing email or code" });
  }

  const entry = VERIFICATION_CODES.get(email);
  if (!entry) {
    return res.status(400).json({ message: "No code found for this email" });
  }

  const { code: storedCode, expiresAt } = entry;

  if (Date.now() > expiresAt) {
    VERIFICATION_CODES.delete(email);
    return res.status(400).json({ message: "Code expired" });
  }

  if (storedCode !== code) {
    return res.status(400).json({ message: "Invalid code" });
  }

  // Success!
  VERIFICATION_CODES.delete(email);
  return res.status(200).json({ message: "Code verified successfully" });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

// 🔧 Utilities
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
