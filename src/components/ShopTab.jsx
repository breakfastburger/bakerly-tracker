import React, { useState } from 'react';
import { Plus, Minus, DollarSign, User, Users, Check, ArrowLeft, CreditCard } from 'lucide-react';

const ShopTab = ({ onSale, strawberryStock, chocolateStock, isDarkMode }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isDebt, setIsDebt] = useState(false);
  const [customerName, setCustomerName] = useState('');

  const products = [
    {
      id: 'strawberry',
      name: 'Strawberry Crepe Pack',
      emoji: 'strawberry',
      price: 6,
      image: '/bakerly-tracker/images/strawberry.png',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'chocolate',
      name: 'Chocolate Crepe Pack',
      emoji: 'chocolate',
      price: 6,
      image: '/bakerly-tracker/images/chocolate.png',
      color: 'from-blue-500 to-blue-600'
    }
  ];

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsDebt(false);
    setCustomerName('');
  };

  const handleConfirmSale = () => {
    const currentStock = selectedProduct.id === 'strawberry' ? strawberryStock : chocolateStock;
    if (!selectedProduct || quantity < 1 || quantity > currentStock) return;
    
    if (!customerName.trim()) {
      return;
    }

    onSale(selectedProduct.id, quantity, isDebt, customerName);
    
    // Reset form
    setSelectedProduct(null);
    setQuantity(1);
    setIsDebt(false);
    setCustomerName('');
  };

  
  if (selectedProduct) {
    const currentStock = selectedProduct.id === 'strawberry' ? strawberryStock : chocolateStock;
    
    if (currentStock === 0) {
      return (
        <div className="p-4 max-w-md mx-auto">
          <div className={`rounded-xl shadow-lg p-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-center">
              <h2 className={`text-xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {selectedProduct.name}
              </h2>
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Out of Stock
              </p>
              <button
                onClick={() => setSelectedProduct(null)}
                className={`mt-6 px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Back to Shop
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className={`rounded-xl shadow-lg p-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {selectedProduct.name}
            </h2>
            <button
              onClick={() => setSelectedProduct(null)}
              className={`flex items-center space-x-2 px-3 py-2 border-2 rounded-lg transition-all duration-300 ease-in-out ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white' 
                  : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500'
              }`}
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
          </div>

          <div className="mb-6">
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.name}
              className="w-full h-32 object-contain mb-4 rounded-lg"
            />
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                $1
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Quantity
            </label>
            
            {/* Quantity Presets */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => setQuantity(Math.min(currentStock, 6))}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-[#35c3f5] text-white hover:bg-[#35c3f5]/90' 
                    : 'bg-[#35c3f5] text-white hover:bg-[#35c3f5]/90'
                }`}
                disabled={currentStock < 6}
              >
                1 Pack ($6)
              </button>
              <button
                onClick={() => setQuantity(Math.min(currentStock, 12))}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                disabled={currentStock < 12}
              >
                2 Packs ($12)
              </button>
              <button
                onClick={() => setQuantity(Math.min(currentStock, 18))}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                disabled={currentStock < 18}
              >
                3 Packs ($18)
              </button>
            </div>
            
            {/* Manual Quantity Adjustment */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                disabled={quantity <= 1}
              >
                <Minus size={20} />
              </button>
              <div className={`text-2xl font-bold w-12 text-center ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                disabled={quantity >= currentStock}
              >
                <Plus size={20} />
              </button>
            </div>
            <div className={`text-center mt-2 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {quantity} crepe{quantity !== 1 ? 's' : ''}
            </div>
            {currentStock < 5 && (
              <div className="text-center mt-2 text-red-500 text-sm font-medium">
                Low stock: {currentStock} remaining
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Payment Type
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsDebt(false)}
                className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all duration-300 ease-in-out ${
                  !isDebt 
                    ? (selectedProduct.id === 'strawberry' 
                        ? 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600' 
                        : 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600')
                    : (selectedProduct.id === 'strawberry'
                        ? `border-gray-300 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} hover:border-blue-500 hover:bg-blue-500 hover:text-white`
                        : `border-gray-300 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} hover:border-blue-500 hover:bg-blue-500 hover:text-white`)
                }`}
              >
                <DollarSign size={20} className="mx-auto mb-1" />
                <span className="block text-sm font-medium">Paid</span>
              </button>
              <button
                onClick={() => setIsDebt(true)}
                className={`flex-1 p-3 rounded-lg border-2 transition-all duration-300 ease-in-out ${
                  isDebt 
                    ? (selectedProduct.id === 'strawberry'
                        ? 'border-red-500 bg-red-500 text-white hover:bg-red-600'
                        : 'border-red-500 bg-red-500 text-white hover:bg-red-600')
                    : (selectedProduct.id === 'strawberry'
                        ? `border-gray-300 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} hover:border-red-500 hover:bg-red-500 hover:text-white`
                        : `border-gray-300 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} hover:border-red-500 hover:bg-red-500 hover:text-white`)
                }`}
              >
                <CreditCard size={20} className="mx-auto mb-1" />
                <span className="block text-sm font-medium">Debt</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Customer:
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>

          <div className="mb-6">
            <div className={`rounded-lg p-4 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Total:
                </span>
                <span className="text-2xl font-bold text-blue-500">${quantity}</span>
              </div>
              <div className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {isDebt ? 'Customer will pay later' : 'Payment received'}
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirmSale}
            disabled={!customerName.trim() || currentStock === 0}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              selectedProduct.id === 'strawberry' 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Confirm Sale
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className={`text-2xl font-bold mb-6 text-center ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Shop
      </h1>
      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        {products.map(product => {
          const productStock = product.id === 'strawberry' ? strawberryStock : chocolateStock;
          
          return (
            <button
              key={product.id}
              onClick={() => handleProductSelect(product)}
              disabled={productStock === 0}
              className={`card p-4 hover:shadow-md transition-shadow text-left ${
                productStock === 0 ? 'opacity-50 cursor-not-allowed' : ''
              } ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${product.color} p-4 flex items-center justify-center`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {product.name}
                  </h3>
                  <div className="text-2xl font-bold text-blue-500">
                    $1
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {productStock < 5 ? `Only ${productStock} left!` : 'In stock'}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ShopTab;
