// api/sendVerificationCode.js

const SibApiV3Sdk = require('sib-api-v3-sdk');

// Configure the Brevo API client
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { email, code } = req.body;  // Email and code passed from the client app

    try {
      // Send the email using Brevo
      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.to = [{ email }];
      sendSmtpEmail.sender = { email: 'your-email@example.com' };
      sendSmtpEmail.subject = 'Your Verification Code';
      sendSmtpEmail.htmlContent = `<p>Your verification code is: <strong>${code}</strong></p>`;
      
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      res.status(200).json({ message: 'Verification code sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};