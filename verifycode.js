import { verifyCode } from './_cache';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ message: 'Email and code are required' });

  const valid = verifyCode(email, code);
  return res.status(200).json({ success: valid });
}