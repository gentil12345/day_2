const express = require('express');
const router = express.Router();
const ServiceRecord = require('../models/ServiceRecord');
const Car = require('../models/Car');
const Service = require('../models/Service');
const { requireAuth } = require('../middleware/auth');

// GET all service records (with populated car and service info)
router.get('/', requireAuth, async (req, res) => {
  try {
    const records = await ServiceRecord.find().sort({ createdAt: -1 });

    // Manually populate car and service details
    const populated = await Promise.all(records.map(async (record) => {
      const car = await Car.findOne({ PlateNumber: record.PlateNumber });
      const service = await Service.findOne({ ServiceCode: record.ServiceCode });
      return {
        ...record.toObject(),
        car: car || null,
        service: service || null
      };
    }));

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// GET single service record
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const record = await ServiceRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Service record not found.' });

    const car = await Car.findOne({ PlateNumber: record.PlateNumber });
    const service = await Service.findOne({ ServiceCode: record.ServiceCode });

    res.json({ ...record.toObject(), car, service });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// POST create service record
router.post('/', requireAuth, async (req, res) => {
  try {
    const { RecordNumber, ServiceDate, PlateNumber, ServiceCode } = req.body;

    if (!RecordNumber || !ServiceDate || !PlateNumber || !ServiceCode) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate car exists
    const car = await Car.findOne({ PlateNumber: PlateNumber.toUpperCase() });
    if (!car) return res.status(404).json({ message: 'Car with this plate number not found.' });

    // Validate service exists
    const service = await Service.findOne({ ServiceCode });
    if (!service) return res.status(404).json({ message: 'Service with this code not found.' });

    const existing = await ServiceRecord.findOne({ RecordNumber });
    if (existing) return res.status(400).json({ message: 'Record number already exists.' });

    const record = new ServiceRecord({
      RecordNumber,
      ServiceDate,
      PlateNumber: PlateNumber.toUpperCase(),
      ServiceCode
    });
    await record.save();
    res.status(201).json({ message: 'Service record created successfully.', record });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// PUT update service record
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { RecordNumber, ServiceDate, PlateNumber, ServiceCode } = req.body;

    if (!RecordNumber || !ServiceDate || !PlateNumber || !ServiceCode) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate car exists
    const car = await Car.findOne({ PlateNumber: PlateNumber.toUpperCase() });
    if (!car) return res.status(404).json({ message: 'Car with this plate number not found.' });

    // Validate service exists
    const service = await Service.findOne({ ServiceCode });
    if (!service) return res.status(404).json({ message: 'Service with this code not found.' });

    const record = await ServiceRecord.findByIdAndUpdate(
      req.params.id,
      { RecordNumber, ServiceDate, PlateNumber: PlateNumber.toUpperCase(), ServiceCode },
      { new: true, runValidators: true }
    );

    if (!record) return res.status(404).json({ message: 'Service record not found.' });
    res.json({ message: 'Service record updated successfully.', record });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// DELETE service record
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const record = await ServiceRecord.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Service record not found.' });
    res.json({ message: 'Service record deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

module.exports = router;
