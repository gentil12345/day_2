const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { requireAuth } = require('../middleware/auth');

// GET all services
router.get('/', requireAuth, async (req, res) => {
  try {
    const services = await Service.find().sort({ ServiceCode: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// GET single service
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// POST create service
router.post('/', requireAuth, async (req, res) => {
  try {
    const { ServiceCode, ServiceName, ServicePrice } = req.body;

    if (!ServiceCode || !ServiceName || ServicePrice === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existing = await Service.findOne({ ServiceCode });
    if (existing) return res.status(400).json({ message: 'Service code already exists.' });

    const service = new Service({ ServiceCode, ServiceName, ServicePrice });
    await service.save();
    res.status(201).json({ message: 'Service created successfully.', service });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

module.exports = router;
