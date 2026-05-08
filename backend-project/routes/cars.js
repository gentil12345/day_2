const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const { requireAuth } = require('../middleware/auth');

// GET all cars
router.get('/', requireAuth, async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// GET single car
router.get('/:plateNumber', requireAuth, async (req, res) => {
  try {
    const car = await Car.findOne({ PlateNumber: req.params.plateNumber.toUpperCase() });
    if (!car) return res.status(404).json({ message: 'Car not found.' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// POST create car
router.post('/', requireAuth, async (req, res) => {
  try {
    const { PlateNumber, type, Model, ManufacturingYear, DriverPhone, MechanicName } = req.body;

    if (!PlateNumber || !type || !Model || !ManufacturingYear || !DriverPhone || !MechanicName) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existing = await Car.findOne({ PlateNumber: PlateNumber.toUpperCase() });
    if (existing) return res.status(400).json({ message: 'Car with this plate number already exists.' });

    const car = new Car({
      PlateNumber: PlateNumber.toUpperCase(),
      type, Model, ManufacturingYear, DriverPhone, MechanicName
    });
    await car.save();
    res.status(201).json({ message: 'Car registered successfully.', car });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

module.exports = router;
