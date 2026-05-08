import React, { useState, useEffect } from 'react';
import { getPayments, createPayment, getServiceRecords } from '../api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ PaymentNumber: '', AmountPaid: '', PaymentDate: '', RecordNumber: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchAll = async () => {
    try {
      const [payRes, recRes] = await Promise.all([getPayments(), getServiceRecords()]);
      setPayments(payRes.data);
      setRecords(recRes.data);
    } catch (err) {
      console.error('Failed to fetch data');
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');

    // Auto-fill amount when record is selected
    if (e.target.name === 'RecordNumber') {
      const selectedRecord = records.find(r => r.RecordNumber === e.target.value);
      if (selectedRecord?.service) {
        setForm(prev => ({ ...prev, RecordNumber: e.target.value, AmountPaid: selectedRecord.service.ServicePrice }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPayment({ ...form, AmountPaid: Number(form.AmountPaid) });
      setSuccess('Payment recorded successfully!');
      setForm({ PaymentNumber: '', AmountPaid: '', PaymentDate: '', RecordNumber: '' });
      setShowForm(false);
      fetchAll();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment.');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = payments.reduce((sum, p) => sum + p.AmountPaid, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
          <p className="text-gray-500 text-sm mt-1">Record and track service payments</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}
          className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
        >
          {showForm ? '✕ Cancel' : '+ Record Payment'}
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-5 mb-6 text-white">
        <p className="text-green-100 text-sm font-medium">Total Revenue Collected</p>
        <p className="text-3xl font-bold mt-1">{totalRevenue.toLocaleString()} RWF</p>
        <p className="text-green-200 text-sm mt-1">{payments.length} payment(s) recorded</p>
      </div>

      {success && <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}
      {error && <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Record New Payment</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Number *</label>
              <input
                type="text" name="PaymentNumber" value={form.PaymentNumber} onChange={handleChange}
                required placeholder="e.g. PAY001"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Record *</label>
              <select
                name="RecordNumber" value={form.RecordNumber} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a service record</option>
                {records.map(rec => (
                  <option key={rec._id} value={rec.RecordNumber}>
                    {rec.RecordNumber} — {rec.PlateNumber} ({rec.service?.ServiceName || rec.ServiceCode})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (RWF) *</label>
              <input
                type="number" name="AmountPaid" value={form.AmountPaid} onChange={handleChange}
                required min="0" placeholder="Amount in RWF"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date *</label>
              <input
                type="date" name="PaymentDate" value={form.PaymentDate} onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button type="submit" disabled={loading}
                className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-60">
                {loading ? 'Saving...' : 'Record Payment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700">Payment History ({payments.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Payment No.</th>
                <th className="px-4 py-3 text-left">Record No.</th>
                <th className="px-4 py-3 text-left">Plate Number</th>
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-right">Amount (RWF)</th>
                <th className="px-4 py-3 text-left">Payment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-400">No payments recorded yet.</td>
                </tr>
              ) : (
                payments.map(payment => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-blue-800">{payment.PaymentNumber}</td>
                    <td className="px-4 py-3">{payment.RecordNumber}</td>
                    <td className="px-4 py-3 font-medium">{payment.car?.PlateNumber || '—'}</td>
                    <td className="px-4 py-3">{payment.service?.ServiceName || '—'}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-700">
                      {payment.AmountPaid.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{new Date(payment.PaymentDate).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
            {payments.length > 0 && (
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="4" className="px-4 py-3 font-semibold text-gray-700 text-right">Total:</td>
                  <td className="px-4 py-3 text-right font-bold text-green-700">{totalRevenue.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
