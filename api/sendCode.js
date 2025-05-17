// For Vercel: place in /api/sendCode.js
// For Express: just use as a POST endpoint handler

import { sendVerificationCode } from './emailService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  try {
    await sendVerificationCode(email);
    return res.status(200).json({ message: 'Verification code sent.' });
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).json({ message: 'Failed to send verification code.' });
  }
}