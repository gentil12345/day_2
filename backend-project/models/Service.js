const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  ServiceCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  ServiceName: {
    type: String,
    required: true,
    trim: true
  },
  ServicePrice: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
