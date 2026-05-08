const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema({
  RecordNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  ServiceDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  // Foreign keys
  PlateNumber: {
    type: String,
    required: true,
    ref: 'Car'
  },
  ServiceCode: {
    type: String,
    required: true,
    ref: 'Service'
  }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);
