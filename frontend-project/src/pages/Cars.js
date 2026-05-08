import React, { useState, useEffect } from 'react';
import { getCars, createCar } from '../api';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    PlateNumber: '', type: '', Model: '', ManufacturingYear: '', DriverPhone: '', MechanicName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchCars = async () => {
    try {
      const res = await getCars();
      setCars(res.data);
    } catch (err) {
      console.error('Failed to fetch cars');
    }
  };

  useEffect(() => { fetchCars(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCar(form);
      setSuccess('Car registered successfully!');
      setForm({ PlateNumber: '', type: '', Model: '', ManufacturingYear: '', DriverPhone: '', MechanicName: '' });
      setShowForm(false);
      fetchCars();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register car.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cars Management</h1>
          <p className="text-gray-500 text-sm mt-1">Register and view cars in the garage</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}
          className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
        >
          {showForm ? '✕ Cancel' : '+ Register Car'}
        </button>
      </div>

      {/* Alerts */}
      {success && <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}
      {error && <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Register New Car</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number *</label>
              <input
                type="text" name="PlateNumber" value={form.PlateNumber} onChange={handleChange}
                required placeholder="e.g. RAB 123 A"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Type *</label>
              <select
                name="type" value={form.type} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Motorcycle">Motorcycle</option>
                <option value="Bus">Bus</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <input
                type="text" name="Model" value={form.Model} onChange={handleChange}
                required placeholder="e.g. Toyota Corolla"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturing Year *</label>
              <input
                type="number" name="ManufacturingYear" value={form.ManufacturingYear} onChange={handleChange}
                required min="1900" max={new Date().getFullYear() + 1} placeholder="e.g. 2020"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Driver Phone *</label>
              <input
                type="tel" name="DriverPhone" value={form.DriverPhone} onChange={handleChange}
                required placeholder="e.g. 0788123456"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mechanic Name *</label>
              <input
                type="text" name="MechanicName" value={form.MechanicName} onChange={handleChange}
                required placeholder="e.g. Jean Pierre"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit" disabled={loading}
                className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Register Car'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700">Registered Cars ({cars.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Plate Number</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Model</th>
                <th className="px-4 py-3 text-left">Year</th>
                <th className="px-4 py-3 text-left">Driver Phone</th>
                <th className="px-4 py-3 text-left">Mechanic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cars.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-400">No cars registered yet.</td>
                </tr>
              ) : (
                cars.map(car => (
                  <tr key={car._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-blue-800">{car.PlateNumber}</td>
                    <td className="px-4 py-3">{car.type}</td>
                    <td className="px-4 py-3">{car.Model}</td>
                    <td className="px-4 py-3">{car.ManufacturingYear}</td>
                    <td className="px-4 py-3">{car.DriverPhone}</td>
                    <td className="px-4 py-3">{car.MechanicName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Cars;
