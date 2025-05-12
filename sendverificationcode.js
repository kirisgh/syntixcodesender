import { sendEmail } from './_mailer';
import { storeCode } from './_cache';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    await sendEmail(email, code);
    storeCode(email, code);
    return res.status(200).json({ message: 'Code sent' });
  } catch (error) {
    console.error('Failed to send email:', error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}