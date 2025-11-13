const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    phone: { type: String, unique: true, sparse: true, trim: true },
    role: { type: String, enum: ['admin', 'user', 'astrologer'], default: 'user' },
    lastLogin: { type: Date },
    blocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ phone: 1 }, { unique: true, sparse: true });

module.exports = model('User', UserSchema);
