const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Set up Brevo SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "8cca5f001@smtp-brevo.com", // replace with your Brevo email
    pass: "7j0VgshEn52X9c4R", // replace with your SMTP key
  },
});

exports.sendVerificationCode = functions.https.onCall(async (data, context) => {
  const email = data.email;
  const code = generateVerificationCode();

  const mailOptions = {
    from: '"Your App Name" <your-email@example.com>',
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, code };
  } catch (error) {
    console.error("Email send failed:", error);
    throw new functions.https.HttpsError("internal", "Failed to send email.");
  }
});

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}