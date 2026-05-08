import React, { useState, useEffect } from 'react';
import { getPaymentReport, getSummary } from '../api';

const Reports = () => {
  const [report, setReport] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repRes, sumRes] = await Promise.all([getPaymentReport(), getSummary()]);
        setReport(repRes.data);
        setSummary(sumRes.data);
      } catch (err) {
        console.error('Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredReport = filterDate
    ? report.filter(r => r.PaymentDate && r.PaymentDate.substring(0, 10) === filterDate)
    : report;

  const filteredTotal = filteredReport.reduce((sum, r) => sum + (r.AmountPaid || 0), 0);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Payment reports and service summaries</p>
        </div>
        <button
          onClick={handlePrint}
          className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
        >
          🖨️ Print Report
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Cars', value: summary.totalCars, color: 'bg-blue-50 text-blue-800', icon: '🚗' },
            { label: 'Services', value: summary.totalServices, color: 'bg-purple-50 text-purple-800', icon: '🔧' },
            { label: 'Service Records', value: summary.totalRecords, color: 'bg-yellow-50 text-yellow-800', icon: '📋' },
            { label: 'Payments', value: summary.totalPayments, color: 'bg-green-50 text-green-800', icon: '💳' },
            { label: 'Total Revenue', value: `${summary.totalRevenue.toLocaleString()} RWF`, color: 'bg-emerald-50 text-emerald-800', icon: '💰' },
          ].map((card, i) => (
            <div key={i} className={`${card.color} rounded-xl p-4 text-center`}>
              <div className="text-2xl mb-1">{card.icon}</div>
              <div className="text-xl font-bold">{card.value}</div>
              <div className="text-xs font-medium mt-1 opacity-80">{card.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Filter by Payment Date:</label>
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {filterDate && (
          <button onClick={() => setFilterDate('')}
            className="text-sm text-red-600 hover:underline">
            Clear filter
          </button>
        )}
        <span className="text-sm text-gray-500 ml-auto">
          Showing {filteredReport.length} record(s) — Total: <strong>{filteredTotal.toLocaleString()} RWF</strong>
        </span>
      </div>

      {/* Invoice-style Report Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden print:shadow-none">
        {/* Print Header */}
        <div className="px-6 py-5 border-b border-gray-100 print:block">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">SmartPark CRPMS</h2>
              <p className="text-gray-500 text-sm">Rubavu District, Western Province, Rwanda</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">Payment Report</p>
              <p className="text-xs text-gray-400">Generated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-800 text-white text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Payment No.</th>
                <th className="px-4 py-3 text-left">Payment Date</th>
                <th className="px-4 py-3 text-left">Plate No.</th>
                <th className="px-4 py-3 text-left">Car Model</th>
                <th className="px-4 py-3 text-left">Driver Phone</th>
                <th className="px-4 py-3 text-left">Mechanic</th>
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-right">Service Price</th>
                <th className="px-4 py-3 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReport.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-400">No payment records found.</td>
                </tr>
              ) : (
                filteredReport.map((row, idx) => (
                  <tr key={idx} className={`hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                    <td className="px-4 py-3 font-semibold text-blue-800">{row.PaymentNumber}</td>
                    <td className="px-4 py-3">{row.PaymentDate ? new Date(row.PaymentDate).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 font-medium">{row.PlateNumber || '—'}</td>
                    <td className="px-4 py-3">{row.CarModel ? `${row.CarType} ${row.CarModel}` : '—'}</td>
                    <td className="px-4 py-3">{row.DriverPhone || '—'}</td>
                    <td className="px-4 py-3">{row.MechanicName || '—'}</td>
                    <td className="px-4 py-3">{row.ServiceName || '—'}</td>
                    <td className="px-4 py-3 text-right">{row.ServicePrice ? row.ServicePrice.toLocaleString() : '—'}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-700">
                      {row.AmountPaid ? row.AmountPaid.toLocaleString() : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredReport.length > 0 && (
              <tfoot className="bg-blue-800 text-white">
                <tr>
                  <td colSpan="7" className="px-4 py-3 font-semibold text-right">TOTAL REVENUE:</td>
                  <td></td>
                  <td className="px-4 py-3 text-right font-bold text-lg">
                    {filteredTotal.toLocaleString()} RWF
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
