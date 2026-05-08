const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  PlateNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  Model: {
    type: String,
    required: true,
    trim: true
  },
  ManufacturingYear: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  DriverPhone: {
    type: String,
    required: true,
    trim: true
  },
  MechanicName: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
