// api/send-code.js
let codes = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codes.set(email, code);

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Syntix", email: "no-reply@syntix.app" },
      to: [{ email }],
      subject: "Your Syntix Verification Code",
      htmlContent: `<p>Your verification code is: <strong>${code}</strong></p>`,
    }),
  });

  if (!response.ok) {
    return res.status(500).json({ error: "Failed to send email" });
  }

  return res.status(200).json({ message: "Code sent" });
}

export { codes };