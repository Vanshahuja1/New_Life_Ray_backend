const { Schema, model } = require('mongoose');

const AstrologerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    display_name: { type: String, trim: true },
    expertise: { type: String, trim: true },
    bio: { type: String },
    rating: { type: Number, default: 0 },
    rating_count: { type: Number, default: 0 },
    is_available: { type: Boolean, default: false },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    approved_at: { type: Date },
    rejected_at: { type: Date },
  },
  { timestamps: true }
);

module.exports = model('Astrologer', AstrologerSchema);
