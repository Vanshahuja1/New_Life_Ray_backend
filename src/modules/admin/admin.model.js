const { Schema, model } = require('mongoose');

const AdminSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
  },
  { timestamps: true }
);

module.exports = model('Admin', AdminSchema);
