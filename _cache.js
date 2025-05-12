const codes = new Map(); // email -> code

export function storeCode(email, code) {
  codes.set(email, { code, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 min expiry
}

export function verifyCode(email, inputCode) {
  const entry = codes.get(email);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    codes.delete(email);
    return false;
  }
  return entry.code === inputCode;
}