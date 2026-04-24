import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';

const AnalyticsTab = ({ sales, totalEarned, isDarkMode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getSalesForDate = (date) => {
    const dateStr = formatDate(date);
    return sales.filter(sale => sale.date.startsWith(dateStr));
  };

  const getProfitForDate = (date) => {
    const daySales = getSalesForDate(date);
    return daySales.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0);
  };

  const getWeekStats = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= weekStart;
    });
    
    const weekProfit = weekSales.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0);
    return { sales: weekSales.length, profit: weekProfit };
  };

  const getMonthStats = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const monthSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= monthStart && saleDate <= monthEnd;
    });
    
    const monthProfit = monthSales.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0);
    return { sales: monthSales.length, profit: monthProfit };
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = formatDate(date);
      const daySales = getSalesForDate(date);
      const profit = getProfitForDate(date);
      const isSelected = selectedDate && formatDate(selectedDate) === dateStr;
      const isToday = formatDate(new Date()) === dateStr;
      
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-12 rounded-lg border transition-all ${
            isSelected 
              ? 'border-bakerly-burgundy bg-bakerly-burgundy text-white' 
              : isToday
              ? `border-bakerly-burgundy ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`
              : isDarkMode
              ? 'border-gray-600 bg-gray-800 text-white hover:border-gray-500'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="text-sm font-medium">{day}</div>
          {daySales.length > 0 && (
            <div className={`text-xs ${isSelected ? 'text-white' : isDarkMode ? 'text-green-400' : 'text-bakerly-burgundy'}`}>
              ${profit}
            </div>
          )}
        </button>
      );
    }
    
    return (
      <div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className={`text-center text-xs font-medium py-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const weekStats = getWeekStats();
  const monthStats = getMonthStats();
  const selectedDateSales = selectedDate ? getSalesForDate(selectedDate) : [];
  const selectedDateProfit = selectedDate ? getProfitForDate(selectedDate) : 0;

  return (
    <div className="scrollable-content p-4">
      <h1 className={`text-2xl font-bold mb-6 text-center ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Analytics
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={20} />
            <span className="text-xs opacity-90">This Week</span>
          </div>
          <div className="text-2xl font-bold">${weekStats.profit}</div>
          <div className="text-xs opacity-90">{weekStats.sales} sales</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 size={20} />
            <span className="text-xs opacity-90">This Month</span>
          </div>
          <div className="text-2xl font-bold">${monthStats.profit}</div>
          <div className="text-xs opacity-90">{monthStats.sales} sales</div>
        </div>
      </div>

      {/* Calendar */}
      <div className={`rounded-xl shadow-lg p-4 mb-6 max-w-md mx-auto ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth(-1)}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={20} className={isDarkMode ? 'text-white' : 'text-gray-700'} />
          </button>
          
          <h2 className={`text-lg font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          
          <button
            onClick={() => navigateMonth(1)}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronRight size={20} className={isDarkMode ? 'text-white' : 'text-gray-700'} />
          </button>
        </div>
        
        {renderCalendar()}
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className={`rounded-xl shadow-lg p-4 max-w-md mx-auto ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg font-bold mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          {selectedDateSales.length === 0 ? (
            <p className={`text-center py-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>No sales on this day</p>
          ) : (
            <div className="space-y-3">
              <div className={`rounded-lg p-3 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Total Profit</span>
                  <span className="text-xl font-bold text-bakerly-burgundy">
                    ${selectedDateProfit}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                {selectedDateSales.map(sale => (
                  <div key={sale.id} className={`rounded-lg p-2 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={sale.product === 'strawberry' ? '/images/strawberry.png' : '/images/chocolate.png'}
                          alt={sale.product}
                          className="w-6 h-6 object-contain"
                        />
                        <span className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {sale.quantity}x {sale.product === 'strawberry' ? 'Strawberry' : 'Chocolate'}
                        </span>
                      </div>
                      <span className="font-bold text-bakerly-burgundy">
                        ${sale.price * sale.quantity}
                      </span>
                    </div>
                    {sale.notes && (
                      <div className="text-xs text-gray-500 mt-1">
                        Notes: {sale.notes}
                      </div>
                    )}
                    {sale.isDebt && (
                      <div className="text-xs text-gray-500 mt-1">
                        Debt for {sale.customerName}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Total Earned Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 max-w-md mx-auto mt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90">Total Earned (All Time)</div>
            <div className="text-3xl font-bold">${totalEarned}</div>
            <div className="text-xs opacity-75 mt-1">
              ${sales.filter(s => s.isDebt).reduce((sum, s) => sum + (s.price * s.quantity), 0)} in debt
            </div>
          </div>
          <DollarSign size={32} className="opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
