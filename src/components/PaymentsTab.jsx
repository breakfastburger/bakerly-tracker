import React, { useState } from 'react';
import { Check, Calendar, DollarSign, Search, ArrowLeft, TrendingUp, Trash2 } from 'lucide-react';

const PaymentsTab = ({ payments, onDeleteOrder, isDarkMode }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const getProductEmoji = (productId) => {
    return productId === 'strawberry' ? 'strawberry' : 'chocolate';
  };

  const getUniqueDates = () => {
    const dates = [...new Set(payments.map(payment => payment.date.split('T')[0]))];
    return dates.sort((a, b) => new Date(b) - new Date(a));
  };

  const getPaymentsForDate = (date) => {
    return payments.filter(payment => payment.date.startsWith(date));
  };

  const getTotalForDate = (date) => {
    const datePayments = getPaymentsForDate(date);
    return datePayments.reduce((sum, payment) => sum + (payment.price * payment.quantity), 0);
  };

  const filteredPayments = payments.filter(payment => 
    payment.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = payments.reduce((sum, payment) => sum + (payment.price * payment.quantity), 0);

  if (selectedDate) {
    const datePayments = getPaymentsForDate(selectedDate);
    const dateTotal = getTotalForDate(selectedDate);

    return (
      <div className="p-4 max-w-md mx-auto">
        <div className={`rounded-xl shadow-lg p-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedDate(null)}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <ArrowLeft size={20} className={isDarkMode ? 'text-white' : 'text-gray-700'} />
              </button>
              <div>
                <h2 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h2>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Payment Details
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp size={20} />
                <span className="text-xs opacity-90">Daily Revenue</span>
              </div>
              <div className="text-3xl font-bold">
                ${dateTotal}
              </div>
              <div className="text-sm opacity-90">{datePayments.length} payment{datePayments.length !== 1 ? 's' : ''}</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-3 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Payment History
            </h3>
            <div className="space-y-3">
              {datePayments.map(payment => (
                <div key={payment.id} className={`rounded-lg p-3 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded overflow-hidden">
                        <img 
                          src={payment.product === 'strawberry' ? '/images/strawberry.png' : '/images/chocolate.png'}
                          alt={payment.product}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {payment.quantity}x {payment.product === 'strawberry' ? 'Strawberry' : 'Chocolate'} Crepe Pack
                        </div>
                        <div className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {payment.customerName} - {payment.timestamp}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`text-lg font-bold ${
                        payment.product === 'strawberry' ? 'text-red-500' : 'text-blue-500'
                      }`}>
                        ${payment.price * payment.quantity}
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Delete this ${payment.quantity}x ${payment.product === 'strawberry' ? 'Strawberry' : 'Chocolate'} Crepe Pack payment? This will refund the stock and reduce total earnings.`)) {
                            onDeleteOrder(payment.id);
                          }
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode 
                            ? 'hover:bg-red-900 text-red-400' 
                            : 'hover:bg-red-100 text-red-600'
                        }`}
                        title="Delete payment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scrollable-content p-4">
      <h1 className={`text-2xl font-bold mb-6 text-center ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Payments
      </h1>

      {/* Total Revenue Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 max-w-md mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90">Total Revenue</div>
            <div className="text-3xl font-bold">${totalRevenue}</div>
          </div>
          <DollarSign size={32} className="opacity-80" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-6">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-400'
          }`} size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search payments..."
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'border-gray-300'
            }`}
          />
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="text-center py-12">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <Check size={40} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            No Payments Found
          </h3>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            {searchTerm ? 'No matching payments found.' : 'No payments recorded yet.'}
          </p>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          {/* Date Grouped Payments */}
          <div className="space-y-4">
            {getUniqueDates().map(date => {
              const datePayments = searchTerm 
                ? getPaymentsForDate(date).filter(payment => 
                    payment.product.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                : getPaymentsForDate(date);
              
              if (datePayments.length === 0) return null;
              
              const dateTotal = getTotalForDate(date);
              
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`w-full rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow text-left ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
                      }`}>
                        <Calendar size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-500'} />
                      </div>
                      <div>
                        <div className={`font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {datePayments.length} payment{datePayments.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-500">
                        ${dateTotal}
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent payments preview */}
                  <div className={`flex items-center space-x-2 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {datePayments.slice(0, 3).map((payment, index) => (
                      <span key={payment.id} className="flex items-center space-x-1">
                        <img 
                          src={payment.product === 'strawberry' ? '/images/strawberry.png' : '/images/chocolate.png'}
                          alt={payment.product}
                          className="w-4 h-4 object-contain"
                        />
                        <span>{payment.quantity}x</span>
                      </span>
                    ))}
                    {datePayments.length > 3 && (
                      <span>+{datePayments.length - 3} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsTab;
