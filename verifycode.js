// api/verify-code.js
import { codes } from "./send-code";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, code } = req.body;
  const expected = codes.get(email);

  if (code === expected) {
    codes.delete(email); // Remove after success
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ success: false, message: "Invalid code" });
}