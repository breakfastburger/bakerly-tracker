import React, { useState } from 'react';
import { User, DollarSign, Calendar, Check, ArrowLeft, CreditCard } from 'lucide-react';

const DebtsTab = ({ debts, onClearDebt }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);

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

  if (selectedCustomer) {
    const customerDebt = debts.find(d => d.customerName === selectedCustomer);
    
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedCustomer}
                </h2>
                <p className="text-sm text-gray-500">Debt Details</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4">
              <div className="text-sm opacity-90 mb-1">Total Debt</div>
              <div className="text-3xl font-bold">
                ${customerDebt.amount}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Purchase History
            </h3>
            <div className="space-y-3">
              {customerDebt.items.map((item, index) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.product === 'strawberry' ? '/bakerly-tracker/images/strawberry.png' : '/bakerly-tracker/images/chocolate.png'}
                        alt={item.product}
                        className="w-8 h-8 object-contain"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.quantity}x {item.product === 'strawberry' ? 'Strawberry' : 'Chocolate'} Crepe
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(item.date)}
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-bakerly-burgundy">
                      ${item.price * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowConfirmDialog(true)}
            className="w-full btn-primary py-3 text-lg font-bold flex items-center justify-center space-x-2"
          >
            <Check size={20} />
            <span>Clear Debt - Move to Total Earned</span>
          </button>

          {/* First Confirmation Dialog */}
          {showConfirmDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-sm w-full">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Clear Debt Confirmation
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to clear {selectedCustomer}'s debt of ${customerDebt.amount}? This will move it to total earnings.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="flex-1 btn-secondary py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowSecondConfirm(true)}
                    className="flex-1 btn-primary py-2"
                  >
                    Yes, I'm Sure
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Second Confirmation Dialog */}
          {showSecondConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-sm w-full">
                <h3 className="text-lg font-bold text-red-600 mb-4">
                  Final Confirmation
                </h3>
                <p className="text-gray-600 mb-6">
                  This action cannot be undone. Are you absolutely sure you want to clear {selectedCustomer}'s debt of ${customerDebt.amount}?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowSecondConfirm(false);
                      setShowConfirmDialog(false);
                    }}
                    className="flex-1 btn-secondary py-2"
                  >
                    No, Cancel
                  </button>
                  <button
                    onClick={() => {
                      onClearDebt(selectedCustomer);
                      setShowSecondConfirm(false);
                      setShowConfirmDialog(false);
                      setSelectedCustomer(null);
                    }}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    YES, CLEAR DEBT
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Debt Ledger
      </h1>

      {debts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={40} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Debts
          </h3>
          <p className="text-gray-500">
            All customers have paid their dues!
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-w-md mx-auto">
          {debts.map(debt => (
            <button
              key={debt.customerName}
              onClick={() => setSelectedCustomer(debt.customerName)}
              className="w-full card p-4 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-bakerly-burgundy rounded-full flex items-center justify-center text-white font-bold">
                    {debt.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {debt.customerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {debt.items.length} purchase{debt.items.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-bakerly-burgundy">
                    ${debt.amount}
                  </div>
                  <div className="text-xs text-gray-500">
                    Last: {formatDate(debt.items[debt.items.length - 1].date)}
                  </div>
                </div>
              </div>
            </button>
          ))}
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Outstanding:</span>
              <span className="text-xl font-bold text-bakerly-burgundy">
                ${debts.reduce((sum, debt) => sum + debt.amount, 0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtsTab;
