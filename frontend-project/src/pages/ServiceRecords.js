import React, { useState, useEffect } from 'react';
import { getServiceRecords, createServiceRecord, updateServiceRecord, deleteServiceRecord, getCars, getServices } from '../api';

const ServiceRecords = () => {
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ RecordNumber: '', ServiceDate: '', PlateNumber: '', ServiceCode: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchAll = async () => {
    try {
      const [recRes, carRes, srvRes] = await Promise.all([getServiceRecords(), getCars(), getServices()]);
      setRecords(recRes.data);
      setCars(carRes.data);
      setServices(srvRes.data);
    } catch (err) {
      console.error('Failed to fetch data');
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await updateServiceRecord(editId, form);
        setSuccess('Service record updated successfully!');
      } else {
        await createServiceRecord(form);
        setSuccess('Service record created successfully!');
      }
      setForm({ RecordNumber: '', ServiceDate: '', PlateNumber: '', ServiceCode: '' });
      setEditId(null);
      setShowForm(false);
      fetchAll();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setForm({
      RecordNumber: record.RecordNumber,
      ServiceDate: record.ServiceDate ? record.ServiceDate.substring(0, 10) : '',
      PlateNumber: record.PlateNumber,
      ServiceCode: record.ServiceCode
    });
    setEditId(record._id);
    setShowForm(true);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteServiceRecord(id);
      setSuccess('Service record deleted.');
      setDeleteConfirm(null);
      fetchAll();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ RecordNumber: '', ServiceDate: '', PlateNumber: '', ServiceCode: '' });
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Service Records</h1>
          <p className="text-gray-500 text-sm mt-1">Track car repair service records</p>
        </div>
        <button
          onClick={() => { if (showForm && !editId) { cancelForm(); } else { setShowForm(true); setEditId(null); setForm({ RecordNumber: '', ServiceDate: '', PlateNumber: '', ServiceCode: '' }); } }}
          className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
        >
          {showForm && !editId ? '✕ Cancel' : '+ New Record'}
        </button>
      </div>

      {success && <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}
      {error && <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {editId ? 'Edit Service Record' : 'New Service Record'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Record Number *</label>
              <input
                type="text" name="RecordNumber" value={form.RecordNumber} onChange={handleChange}
                required placeholder="e.g. REC001"
                disabled={!!editId}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Date *</label>
              <input
                type="date" name="ServiceDate" value={form.ServiceDate} onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Plate Number *</label>
              <select
                name="PlateNumber" value={form.PlateNumber} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a car</option>
                {cars.map(car => (
                  <option key={car._id} value={car.PlateNumber}>
                    {car.PlateNumber} — {car.Model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service *</label>
              <select
                name="ServiceCode" value={form.ServiceCode} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a service</option>
                {services.map(srv => (
                  <option key={srv._id} value={srv.ServiceCode}>
                    {srv.ServiceCode} — {srv.ServiceName} ({srv.ServicePrice.toLocaleString()} RWF)
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={cancelForm}
                className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-60">
                {loading ? 'Saving...' : editId ? 'Update Record' : 'Create Record'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 text-sm mb-6">Are you sure you want to delete this service record? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700">All Service Records ({records.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Record No.</th>
                <th className="px-4 py-3 text-left">Service Date</th>
                <th className="px-4 py-3 text-left">Plate Number</th>
                <th className="px-4 py-3 text-left">Car Model</th>
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-left">Price (RWF)</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-400">No service records yet.</td>
                </tr>
              ) : (
                records.map(record => (
                  <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-blue-800">{record.RecordNumber}</td>
                    <td className="px-4 py-3">{new Date(record.ServiceDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-medium">{record.PlateNumber}</td>
                    <td className="px-4 py-3">{record.car?.Model || '—'}</td>
                    <td className="px-4 py-3">{record.service?.ServiceName || record.ServiceCode}</td>
                    <td className="px-4 py-3 text-green-700 font-medium">
                      {record.service ? record.service.ServicePrice.toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(record)}
                          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md text-xs font-medium transition-colors">
                          Edit
                        </button>
                        <button onClick={() => setDeleteConfirm(record._id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-xs font-medium transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
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

export default ServiceRecords;
