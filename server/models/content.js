// models/Content.js

import mongoose from 'mongoose';

// Check if the model already exists to prevent overwriting
const Content = mongoose.models.Content || mongoose.model('Content', new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'other'],
    required: true
  },
  text: {
    type: String
  },
  fileUrl: {
    type: String
  },
  moderated: {
    type: Boolean,
    default: false
  }
}, { timestamps: true }));

export default Content;
