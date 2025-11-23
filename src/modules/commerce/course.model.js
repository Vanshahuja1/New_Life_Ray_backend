const { Schema, model, Types } = require('mongoose');

const ModuleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    video_url: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const CourseSchema = new Schema(
  {
    astrologer_id: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    modules: { type: [ModuleSchema], default: [] },
    price: { type: Number, required: true, min: 0 },
    isactive: { type: Boolean, default: true, index: true },
  },
  { timestamps: { createdAt: 'createdat', updatedAt: 'updatedat' } }
);

CourseSchema.index({ title: 'text', description: 'text' });

module.exports = model('Course', CourseSchema);
