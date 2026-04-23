import React from 'react';
import { ShoppingCart, Users, BarChart3, Package, Check } from 'lucide-react';

const BottomNav = ({ activeTab, setActiveTab, isDarkMode }) => {
  const navItems = [
    { id: 'shop', label: 'Shop', icon: ShoppingCart },
    { id: 'debts', label: 'Debts', icon: Users },
    { id: 'payments', label: 'Payments', icon: Check },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'stock', label: 'Stock', icon: Package },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 border-t z-50 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${activeTab === item.id ? 'active' : ''} ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={20} />
              <span className="mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
