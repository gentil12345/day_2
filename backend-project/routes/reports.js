const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const ServiceRecord = require('../models/ServiceRecord');
const Car = require('../models/Car');
const Service = require('../models/Service');
const { requireAuth } = require('../middleware/auth');

// GET full report - all payments with car and service details (invoice-style)
router.get('/payments', requireAuth, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ PaymentDate: -1 });

    const report = await Promise.all(payments.map(async (payment) => {
      const record = await ServiceRecord.findOne({ RecordNumber: payment.RecordNumber });
      let car = null;
      let service = null;
      if (record) {
        car = await Car.findOne({ PlateNumber: record.PlateNumber });
        service = await Service.findOne({ ServiceCode: record.ServiceCode });
      }
      return {
        PaymentNumber: payment.PaymentNumber,
        PaymentDate: payment.PaymentDate,
        AmountPaid: payment.AmountPaid,
        RecordNumber: payment.RecordNumber,
        ServiceDate: record ? record.ServiceDate : null,
        PlateNumber: car ? car.PlateNumber : null,
        CarType: car ? car.type : null,
        CarModel: car ? car.Model : null,
        DriverPhone: car ? car.DriverPhone : null,
        MechanicName: car ? car.MechanicName : null,
        ServiceName: service ? service.ServiceName : null,
        ServicePrice: service ? service.ServicePrice : null
      };
    }));

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// GET summary stats
router.get('/summary', requireAuth, async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalRecords = await ServiceRecord.countDocuments();
    const totalPayments = await Payment.countDocuments();

    const payments = await Payment.find();
    const totalRevenue = payments.reduce((sum, p) => sum + p.AmountPaid, 0);

    res.json({ totalCars, totalServices, totalRecords, totalPayments, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

module.exports = router;
