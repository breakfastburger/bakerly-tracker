import React, { useState } from 'react';
import { Package, AlertTriangle, TrendingDown, RefreshCw, Plus, Minus, History, Settings, Zap } from 'lucide-react';

const StockTab = ({ strawberryStock, setStrawberryStock, chocolateStock, setChocolateStock, isDarkMode }) => {
  const [newStockValue, setNewStockValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('strawberry');
  const [stockHistory, setStockHistory] = useState([]);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [showSettings, setShowSettings] = useState(false);

  const handleUpdateStock = () => {
    const value = parseInt(newStockValue);
    if (!isNaN(value) && value >= 0) {
      const previousStock = selectedProduct === 'strawberry' ? strawberryStock : chocolateStock;
      
      // Update the correct stock
      if (selectedProduct === 'strawberry') {
        setStrawberryStock(value);
      } else {
        setChocolateStock(value);
      }
      
      // Add to history
      const historyEntry = {
        id: Date.now(),
        product: selectedProduct,
        previousStock,
        newStock: value,
        change: value - previousStock,
        timestamp: new Date().toLocaleString(),
        type: value > previousStock ? 'restock' : value < previousStock ? 'adjustment' : 'no_change'
      };
      setStockHistory(prev => [historyEntry, ...prev].slice(0, 10));
      
      setNewStockValue('');
      setIsEditing(false);
    }
  };

  const handleQuickAdjust = (product, amount) => {
    const currentStock = product === 'strawberry' ? strawberryStock : chocolateStock;
    const newStock = Math.max(0, currentStock + amount);
    
    // Update the correct stock
    if (product === 'strawberry') {
      setStrawberryStock(newStock);
    } else {
      setChocolateStock(newStock);
    }
    
    // Add to history
    const historyEntry = {
      id: Date.now(),
      product,
      previousStock: currentStock,
      newStock,
      change: amount,
      timestamp: new Date().toLocaleString(),
      type: amount > 0 ? 'quick_add' : 'quick_remove'
    };
    setStockHistory(prev => [historyEntry, ...prev].slice(0, 10));
  };

  const handlePresetStock = (product, presetValue) => {
    const currentStock = product === 'strawberry' ? strawberryStock : chocolateStock;
    
    // Update the correct stock
    if (product === 'strawberry') {
      setStrawberryStock(presetValue);
    } else {
      setChocolateStock(presetValue);
    }
    
    // Add to history
    const historyEntry = {
      id: Date.now(),
      product,
      previousStock: currentStock,
      newStock: presetValue,
      change: presetValue - currentStock,
      timestamp: new Date().toLocaleString(),
      type: 'preset'
    };
    setStockHistory(prev => [historyEntry, ...prev].slice(0, 10));
  };

  const clearHistory = () => {
    setStockHistory([]);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { status: 'out', color: 'text-red-600', bg: 'bg-red-100', message: 'Out of Stock' };
    if (stock < lowStockThreshold) return { status: 'low', color: 'text-yellow-600', bg: 'bg-yellow-100', message: 'Low Stock' };
    if (stock < lowStockThreshold * 3) return { status: 'medium', color: 'text-blue-600', bg: 'bg-blue-100', message: 'Medium Stock' };
    return { status: 'good', color: 'text-green-600', bg: 'bg-green-100', message: 'Good Stock' };
  };

  const getProductImage = (product) => {
    return product === 'strawberry' ? '/bakerly-tracker/images/strawberry.png' : '/bakerly-tracker/images/chocolate.png';
  };

  const getProductColor = (product) => {
    return product === 'strawberry' ? 'from-pink-400 to-pink-600' : 'from-amber-600 to-amber-800';
  };

  const products = [
    { id: 'strawberry', name: 'Strawberry Crepes', stock: strawberryStock },
    { id: 'chocolate', name: 'Chocolate Crepes', stock: chocolateStock }
  ];

  return (
    <div className="scrollable-content p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-2xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Stock Management
        </h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-full transition-colors ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <Settings size={20} className={isDarkMode ? 'text-white' : 'text-gray-700'} />
        </button>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Settings Panel */}
        {showSettings && (
          <div className={`rounded-xl shadow-lg p-6 border-2 border-[#35c3f5] ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
            <h2 className={`text-lg font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Stock Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
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
                  <span className="w-8 text-center font-bold text-[#35c3f5]">
                    {lowStockThreshold}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Alert when stock falls below this number
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Product Stock Displays */}
        {products.map(product => {
          const stockStatus = getStockStatus(product.stock);
          return (
            <div key={product.id} className={`rounded-xl shadow-lg p-6 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
              <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden bg-gradient-to-br ${
                  isDarkMode ? 'from-gray-700 to-gray-600' : 'from-gray-100 to-gray-200'
                }`}>
                  <img 
                    src={getProductImage(product.id)} 
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {product.name}
                </h3>
                <div className={`text-4xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {product.stock}
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                  {stockStatus.message}
                </div>
              </div>

              {product.stock < lowStockThreshold && product.stock > 0 && (
                <div className={`rounded-lg p-4 mb-4 ${
                  isDarkMode 
                    ? 'bg-yellow-900/30 border-yellow-700' 
                    : 'bg-yellow-50 border-yellow-200'
                } border`}>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} mt-0.5`} size={20} />
                    <div>
                      <h3 className={`font-medium ${
                        isDarkMode ? 'text-yellow-300' : 'text-yellow-800'
                      }`}>
                        Low Stock Alert
                      </h3>
                      <p className={`text-sm mt-1 ${
                        isDarkMode ? 'text-yellow-400' : 'text-yellow-700'
                      }`}>
                        Only {product.stock} {product.name.toLowerCase()} left!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {product.stock === 0 && (
                <div className={`rounded-lg p-4 mb-4 ${
                  isDarkMode 
                    ? 'bg-red-900/30 border-red-700' 
                    : 'bg-red-50 border-red-200'
                } border`}>
                  <div className="flex items-start space-x-3">
                    <TrendingDown className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} mt-0.5`} size={20} />
                    <div>
                      <h3 className={`font-medium ${
                        isDarkMode ? 'text-red-300' : 'text-red-800'
                      }`}>
                        Out of Stock
                      </h3>
                      <p className={`text-sm mt-1 ${
                        isDarkMode ? 'text-red-400' : 'text-red-700'
                      }`}>
                        No {product.name.toLowerCase()} available!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Adjustments for this product */}
              <div className="space-y-3">
                <h4 className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Quick Adjustments
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleQuickAdjust(product.id, -10)}
                    className={`py-2 text-xs rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Minus size={14} className="inline mr-1" />
                    10
                  </button>
                  <button
                    onClick={() => handleQuickAdjust(product.id, -1)}
                    className={`py-2 text-xs rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Minus size={14} className="inline mr-1" />
                    1
                  </button>
                  <button
                    onClick={() => handleQuickAdjust(product.id, 1)}
                    className={`py-2 text-xs rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Plus size={14} className="inline mr-1" />
                    1
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleQuickAdjust(product.id, 5)}
                    className={`py-2 text-xs rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Plus size={14} className="inline mr-1" />
                    5
                  </button>
                  <button
                    onClick={() => handleQuickAdjust(product.id, 10)}
                    className={`py-2 text-xs rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Plus size={14} className="inline mr-1" />
                    10
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Preset Stock Levels */}
        <div className={`rounded-xl shadow-lg p-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`text-lg font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Preset Stock Levels
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className={`text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Strawberry Crepes
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handlePresetStock('strawberry', 12)}
                  className={`py-2 text-sm rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Zap size={16} className="inline mr-1" />
                  Half Dozen
                </button>
                <button
                  onClick={() => handlePresetStock('strawberry', 24)}
                  className={`py-2 text-sm rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Zap size={16} className="inline mr-1" />
                  Full Dozen
                </button>
              </div>
            </div>
            <div>
              <h3 className={`text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Chocolate Crepes
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handlePresetStock('chocolate', 12)}
                  className={`py-2 text-sm rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Zap size={16} className="inline mr-1" />
                  Half Dozen
                </button>
                <button
                  onClick={() => handlePresetStock('chocolate', 24)}
                  className={`py-2 text-sm rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Zap size={16} className="inline mr-1" />
                  Full Dozen
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Stock Entry */}
        <div className={`rounded-xl shadow-lg p-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`text-lg font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Custom Stock Amount
          </h2>
          
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Select Product
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedProduct('strawberry')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedProduct === 'strawberry'
                    ? 'border-[#35c3f5] bg-[#35c3f5] text-white'
                    : isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500' 
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded overflow-hidden">
                  <img 
                    src={getProductImage('strawberry')} 
                    alt="Strawberry"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-sm font-medium">Strawberry</div>
              </button>
              <button
                onClick={() => setSelectedProduct('chocolate')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedProduct === 'chocolate'
                    ? 'border-[#35c3f5] bg-[#35c3f5] text-white'
                    : isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500' 
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded overflow-hidden">
                  <img 
                    src={getProductImage('chocolate')} 
                    alt="Chocolate"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-sm font-medium">Chocolate</div>
              </button>
            </div>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => {
                setIsEditing(true);
                setNewStockValue(selectedProduct === 'strawberry' ? strawberryStock.toString() : chocolateStock.toString());
              }}
              className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
            >
              <RefreshCw size={20} />
              <span>Set Custom Stock for {selectedProduct === 'strawberry' ? 'Strawberry' : 'Chocolate'}</span>
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Stock Amount for {selectedProduct === 'strawberry' ? 'Strawberry' : 'Chocolate'}
                </label>
                <input
                  type="number"
                  value={newStockValue}
                  onChange={(e) => setNewStockValue(e.target.value)}
                  placeholder="Enter stock amount"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#35c3f5] focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300'
                  }`}
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

              </div>
    </div>
  );
};

export default StockTab;
