import { verifyCode } from './emailService.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ message: 'Missing email or code.' });

  const valid = verifyCode(email, code);
  if (valid) {
    return res.status(200).json({ message: 'Code verified.' });
  } else {
    return res.status(401).json({ message: 'Invalid or expired code.' });
  }
}