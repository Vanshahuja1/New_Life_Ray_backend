const crypto = require('crypto');
const User = require('../user/user.model');
const Otp = require('./otp.model');

const hash = (str) => crypto.createHash('sha256').update(String(str)).digest('hex');

async function loginWithEmail({ email, password }) {
  if (!email || !password) throw new Error('Email and password are required');
  const user = await User.findOne({ email: String(email).toLowerCase().trim(), blocked: { $ne: true } });
  if (!user || !user.passwordHash) throw new Error('Invalid credentials');
  const ok = user.passwordHash === hash(password);
  if (!ok) throw new Error('Invalid credentials');
  user.lastLogin = new Date();
  await user.save();
  return user;
}

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function requestOtp({ phone }) {
  if (!phone) throw new Error('Phone is required');
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await Otp.create({ phone, code, expiresAt });
  // In production send via SMS provider. For now return code for testing.
  return { phone, code, expiresAt };
}

async function verifyOtp({ phone, code, name }) {
  if (!phone || !code) throw new Error('Phone and code are required');
  const otp = await Otp.findOne({ phone, code, used: false, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
  if (!otp) throw new Error('Invalid or expired OTP');

  otp.used = true;
  await otp.save();

  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone, name: name || 'User', role: 'user' });
  }
  if (user.blocked) throw new Error('Account is blocked');
  user.lastLogin = new Date();
  await user.save();
  return user;
}

module.exports = {
  hash,
  loginWithEmail,
  requestOtp,
  verifyOtp,
};
