const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  PaymentNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  AmountPaid: {
    type: Number,
    required: true,
    min: 0
  },
  PaymentDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  // Foreign key
  RecordNumber: {
    type: String,
    required: true,
    ref: 'ServiceRecord'
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
