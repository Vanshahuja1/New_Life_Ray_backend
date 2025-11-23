const { Schema, model, Types } = require('mongoose');

const EbookSchema = new Schema(
  {
    astrologer_id: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    file_url: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    isactive: { type: Boolean, default: true, index: true },
  },
  { timestamps: { createdAt: 'createdat', updatedAt: 'updatedat' } }
);

EbookSchema.index({ title: 'text', description: 'text' });

module.exports = model('Ebook', EbookSchema);
