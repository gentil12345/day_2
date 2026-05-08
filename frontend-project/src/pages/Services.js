import React, { useState, useEffect } from 'react';
import { getServices, createService } from '../api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ ServiceCode: '', ServiceName: '', ServicePrice: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await getServices();
      setServices(res.data);
    } catch (err) {
      console.error('Failed to fetch services');
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createService({ ...form, ServicePrice: Number(form.ServicePrice) });
      setSuccess('Service added successfully!');
      setForm({ ServiceCode: '', ServiceName: '', ServicePrice: '' });
      setShowForm(false);
      fetchServices();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add service.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => `${price.toLocaleString()} RWF`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Services Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage repair services and pricing</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}
          className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
        >
          {showForm ? '✕ Cancel' : '+ Add Service'}
        </button>
      </div>

      {success && <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}
      {error && <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Service</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Code *</label>
              <input
                type="text" name="ServiceCode" value={form.ServiceCode} onChange={handleChange}
                required placeholder="e.g. SRV001"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
              <input
                type="text" name="ServiceName" value={form.ServiceName} onChange={handleChange}
                required placeholder="e.g. Engine Repair"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Price (RWF) *</label>
              <input
                type="number" name="ServicePrice" value={form.ServicePrice} onChange={handleChange}
                required min="0" placeholder="e.g. 150000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit" disabled={loading}
                className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {services.map(service => (
          <div key={service._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                  {service.ServiceCode}
                </span>
                <h3 className="font-semibold text-gray-800">{service.ServiceName}</h3>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-700">{formatPrice(service.ServicePrice)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700">All Services ({services.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Service Code</th>
                <th className="px-4 py-3 text-left">Service Name</th>
                <th className="px-4 py-3 text-right">Price (RWF)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-400">No services added yet.</td>
                </tr>
              ) : (
                services.map((service, idx) => (
                  <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-semibold text-blue-800">{service.ServiceCode}</td>
                    <td className="px-4 py-3">{service.ServiceName}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-700">{formatPrice(service.ServicePrice)}</td>
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

export default Services;
