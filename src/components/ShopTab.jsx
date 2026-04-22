import React, { useState } from 'react';
import { Plus, Minus, DollarSign, User, Users, Check, ArrowLeft } from 'lucide-react';

const ShopTab = ({ onSale, strawberryStock, chocolateStock }) => {
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
    
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedProduct.name}
            </h2>
            <button
              onClick={() => setSelectedProduct(null)}
              className="flex items-center space-x-2 px-3 py-2 border-2 border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-all duration-300 ease-in-out"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            
            {/* Quantity Presets */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => setQuantity(Math.min(currentStock, 6))}
                className="p-2 bg-[#35c3f5] text-white rounded-lg text-sm font-medium hover:bg-[#35c3f5]/90 transition-colors"
                disabled={currentStock < 6}
              >
                1 Pack ($6)
              </button>
              <button
                onClick={() => setQuantity(Math.min(currentStock, 12))}
                className="p-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                disabled={currentStock < 12}
              >
                2 Packs ($12)
              </button>
              <button
                onClick={() => setQuantity(Math.min(currentStock, 18))}
                className="p-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                disabled={currentStock < 18}
              >
                3 Packs ($18)
              </button>
            </div>
            
            {/* Manual Quantity Adjustment */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus size={20} />
              </button>
              <div className="text-2xl font-bold w-12 text-center">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={quantity >= currentStock}
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="text-center mt-2 text-sm text-gray-500">
              {quantity} crepe{quantity !== 1 ? 's' : ''}
            </div>
            {currentStock < 5 && (
              <div className="text-center mt-2 text-red-500 text-sm font-medium">
                Low stock: {currentStock} remaining
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsDebt(false)}
                className={`flex-1 p-3 rounded-lg border-2 bg-white text-gray-700 transition-all duration-300 ease-in-out ${
                  !isDebt 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-300 hover:border-blue-500 hover:shadow-md'
                }`}
              >
                <Check className="mx-auto mb-1" size={20} />
                <div className="text-sm font-medium">Paid</div>
              </button>
              <button
                onClick={() => setIsDebt(true)}
                className={`flex-1 p-3 rounded-lg border-2 bg-white text-gray-700 transition-all duration-300 ease-in-out ${
                  isDebt 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-300 hover:border-blue-500 hover:shadow-md'
                }`}
              >
                <User className="mx-auto mb-1" size={20} />
                <div className="text-sm font-medium">Debt</div>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer:
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => {
                // Auto-format: capitalize first letter of each word
                const formatted = e.target.value.replace(/\b\w/g, l => l.toUpperCase());
                setCustomerName(formatted);
              }}
              placeholder="Enter customer name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-blue-500">
                ${quantity}
              </span>
            </div>
          </div>

          <button
            onClick={handleConfirmSale}
            disabled={quantity > currentStock || !customerName.trim()}
            className="w-full btn-primary py-3 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Sale
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Quick Sales
      </h1>
      
      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        {products.map(product => {
          const productStock = product.id === 'strawberry' ? strawberryStock : chocolateStock;
          return (
            <button
              key={product.id}
              onClick={() => handleProductSelect(product)}
              className="card p-6 hover:shadow-md transition-shadow"
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
                    <h3 className="text-lg font-bold text-gray-900">
                      {product.name}
                    </h3>
                    <div className="text-2xl font-bold text-blue-500">
                      $1
                    </div>
                    <div className="text-sm text-gray-500">
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
