const { Schema, model } = require('mongoose');

const OtpSchema = new Schema(
  {
    phone: { type: String, required: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    attempts: { type: Number, default: 0 },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

OtpSchema.index({ phone: 1, code: 1, used: 1 });

module.exports = model('Otp', OtpSchema);
