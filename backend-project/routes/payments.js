const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const ServiceRecord = require('../models/ServiceRecord');
const Car = require('../models/Car');
const Service = require('../models/Service');
const { requireAuth } = require('../middleware/auth');

// GET all payments
router.get('/', requireAuth, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });

    const populated = await Promise.all(payments.map(async (payment) => {
      const record = await ServiceRecord.findOne({ RecordNumber: payment.RecordNumber });
      let car = null;
      let service = null;
      if (record) {
        car = await Car.findOne({ PlateNumber: record.PlateNumber });
        service = await Service.findOne({ ServiceCode: record.ServiceCode });
      }
      return { ...payment.toObject(), record, car, service };
    }));

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// POST create payment
router.post('/', requireAuth, async (req, res) => {
  try {
    const { PaymentNumber, AmountPaid, PaymentDate, RecordNumber } = req.body;

    if (!PaymentNumber || AmountPaid === undefined || !PaymentDate || !RecordNumber) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate service record exists
    const record = await ServiceRecord.findOne({ RecordNumber });
    if (!record) return res.status(404).json({ message: 'Service record not found.' });

    const existing = await Payment.findOne({ PaymentNumber });
    if (existing) return res.status(400).json({ message: 'Payment number already exists.' });

    const payment = new Payment({ PaymentNumber, AmountPaid, PaymentDate, RecordNumber });
    await payment.save();
    res.status(201).json({ message: 'Payment recorded successfully.', payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

module.exports = router;
