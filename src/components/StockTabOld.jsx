import React, { useState } from 'react';
import { Package, AlertTriangle, TrendingDown, RefreshCw, Plus, Minus, History, Settings, Zap } from 'lucide-react';

const StockTab = ({ strawberryStock, setStrawberryStock, chocolateStock, setChocolateStock }) => {
  const [newStockValue, setNewStockValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [stockHistory, setStockHistory] = useState([]);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [showSettings, setShowSettings] = useState(false);

  const handleUpdateStock = () => {
    const value = parseInt(newStockValue);
    if (!isNaN(value) && value >= 0) {
      const previousStock = stock;
      setStock(value);
      
      // Add to history
      const historyEntry = {
        id: Date.now(),
        previousStock,
        newStock: value,
        change: value - previousStock,
        timestamp: new Date().toLocaleString(),
        type: value > previousStock ? 'restock' : value < previousStock ? 'adjustment' : 'no_change'
      };
      setStockHistory(prev => [historyEntry, ...prev].slice(0, 10)); // Keep last 10 entries
      
      setNewStockValue('');
      setIsEditing(false);
    }
  };

  const handleQuickAdjust = (amount) => {
    const newStock = Math.max(0, stock + amount);
    const previousStock = stock;
    setStock(newStock);
    
    // Add to history
    const historyEntry = {
      id: Date.now(),
      previousStock,
      newStock,
      change: amount,
      timestamp: new Date().toLocaleString(),
      type: amount > 0 ? 'quick_add' : 'quick_remove'
    };
    setStockHistory(prev => [historyEntry, ...prev].slice(0, 10));
  };

  const handlePresetStock = (presetValue) => {
    const previousStock = stock;
    setStock(presetValue);
    
    // Add to history
    const historyEntry = {
      id: Date.now(),
      previousStock,
      newStock: presetValue,
      change: presetValue - previousStock,
      timestamp: new Date().toLocaleString(),
      type: 'preset'
    };
    setStockHistory(prev => [historyEntry, ...prev].slice(0, 10));
  };

  const clearHistory = () => {
    setStockHistory([]);
  };

  const getStockStatus = () => {
    if (stock === 0) return { status: 'out', color: 'text-red-600', bg: 'bg-red-100', message: 'Out of Stock' };
    if (stock < lowStockThreshold) return { status: 'low', color: 'text-yellow-600', bg: 'bg-yellow-100', message: 'Low Stock' };
    if (stock < lowStockThreshold * 3) return { status: 'medium', color: 'text-blue-600', bg: 'bg-blue-100', message: 'Medium Stock' };
    return { status: 'good', color: 'text-green-600', bg: 'bg-green-100', message: 'Good Stock' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Stock Management
        </h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-bakerly-burgundy">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Stock Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Threshold
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-8 text-center font-bold text-bakerly-burgundy">
                    {lowStockThreshold}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Alert when stock falls below this number
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Current Stock Display */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
                 style={{ backgroundColor: stock === 0 ? '#FEE2E2' : stock < lowStockThreshold ? '#FEF3C7' : '#D1FAE5' }}>
              <Package 
                size={48} 
                className={stock === 0 ? 'text-red-600' : stock < lowStockThreshold ? 'text-yellow-600' : 'text-green-600'} 
              />
            </div>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {stock}
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bg} ${stockStatus.color}`}>
              {stockStatus.message}
            </div>
          </div>

          {stock < lowStockThreshold && stock > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
                <div>
                  <h3 className="font-medium text-yellow-800">Low Stock Alert</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    You only have {stock} crepe{stock !== 1 ? 's' : ''} left. Consider restocking soon!
                  </p>
                </div>
              </div>
            </div>
          )}

          {stock === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <TrendingDown className="text-red-600 mt-0.5" size={20} />
                <div>
                  <h3 className="font-medium text-red-800">Out of Stock</h3>
                  <p className="text-sm text-red-700 mt-1">
                    You're completely out of crepes! Update your stock to continue selling.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Adjustments */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Quick Adjustments
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => handleQuickAdjust(-10)}
              className="btn-secondary py-2 text-sm"
            >
              <Minus size={16} className="inline mr-1" />
              10
            </button>
            <button
              onClick={() => handleQuickAdjust(-1)}
              className="btn-secondary py-2 text-sm"
            >
              <Minus size={16} className="inline mr-1" />
              1
            </button>
            <button
              onClick={() => handleQuickAdjust(1)}
              className="btn-secondary py-2 text-sm"
            >
              <Plus size={16} className="inline mr-1" />
              1
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickAdjust(5)}
              className="btn-secondary py-2 text-sm"
            >
              <Plus size={16} className="inline mr-1" />
              5
            </button>
            <button
              onClick={() => handleQuickAdjust(10)}
              className="btn-secondary py-2 text-sm"
            >
              <Plus size={16} className="inline mr-1" />
              10
            </button>
          </div>
        </div>

        {/* Preset Stock Levels */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Preset Stock Levels
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handlePresetStock(12)}
              className="btn-secondary py-2 text-sm"
            >
              <Zap size={16} className="inline mr-1" />
              Half Dozen
            </button>
            <button
              onClick={() => handlePresetStock(24)}
              className="btn-secondary py-2 text-sm"
            >
              <Zap size={16} className="inline mr-1" />
              Full Dozen
            </button>
            <button
              onClick={() => handlePresetStock(36)}
              className="btn-secondary py-2 text-sm"
            >
              <Zap size={16} className="inline mr-1" />
              1.5 Dozen
            </button>
            <button
              onClick={() => handlePresetStock(48)}
              className="btn-secondary py-2 text-sm"
            >
              <Zap size={16} className="inline mr-1" />
              2 Dozen
            </button>
          </div>
        </div>

        {/* Custom Stock Entry */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Custom Stock Amount
          </h2>
          
          {!isEditing ? (
            <button
              onClick={() => {
                setIsEditing(true);
                setNewStockValue(stock.toString());
              }}
              className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
            >
              <RefreshCw size={20} />
              <span>Set Custom Stock</span>
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Amount
                </label>
                <input
                  type="number"
                  value={newStockValue}
                  onChange={(e) => setNewStockValue(e.target.value)}
                  placeholder="Enter stock amount"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bakerly-burgundy focus:border-transparent"
                  min="0"
                  autoFocus
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleUpdateStock}
                  className="flex-1 btn-primary py-3"
                >
                  Update Stock
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setNewStockValue('');
                  }}
                  className="flex-1 btn-secondary py-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stock History */}
        {stockHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Stock History
              </h2>
              <button
                onClick={clearHistory}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stockHistory.map(entry => (
                <div key={entry.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${
                        entry.change > 0 ? 'text-green-600' : 
                        entry.change < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {entry.change > 0 ? '+' : ''}{entry.change}
                      </span>
                      <span className="text-gray-500">
                        ({entry.previousStock} {entry.change !== 0 ? '->' : ''} {entry.newStock})
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {entry.timestamp}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 capitalize">
                    {entry.type.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stock Tips */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Stock Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <span className="text-bakerly-burgundy mt-1">·</span>
              <span>Use quick adjustments for fast inventory changes</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-bakerly-burgundy mt-1">·</span>
              <span>Preset levels help with standard batch sizes</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-bakerly-burgundy mt-1">·</span>
              <span>Adjust low stock threshold in settings</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-bakerly-burgundy mt-1">·</span>
              <span>Stock history tracks all your changes</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StockTab;
