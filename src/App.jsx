import React, { useState, useEffect } from 'react';
import { ShoppingCart, Users, BarChart3, Package, Plus, X, Calendar, DollarSign, Moon } from 'lucide-react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ShopTab from './components/ShopTab';
import DebtsTab from './components/DebtsTab';
import AnalyticsTab from './components/AnalyticsTab';
import StockTab from './components/StockTab';
import PaymentsTab from './components/PaymentsTab';

function App() {
  const [activeTab, setActiveTab] = useState('shop');
  const [sales, setSales] = useState([]);
  const [debts, setDebts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [strawberryStock, setStrawberryStock] = useState(25);
  const [chocolateStock, setChocolateStock] = useState(25);
  const [totalEarned, setTotalEarned] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const tabs = ['shop', 'debts', 'analytics', 'stock', 'payments'];
  const currentTabIndex = tabs.indexOf(activeTab);

  // Swipe gesture handlers
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && currentTabIndex < tabs.length - 1) {
      // Swipe left - go to next tab
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTab(tabs[currentTabIndex + 1]);
        setIsTransitioning(false);
      }, 150);
    } else if (isRightSwipe && currentTabIndex > 0) {
      // Swipe right - go to previous tab
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTab(tabs[currentTabIndex - 1]);
        setIsTransitioning(false);
      }, 150);
    }
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('bakerlyData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setSales(parsed.sales || []);
      setDebts(parsed.debts || []);
      setPayments(parsed.payments || []);
      setStrawberryStock(parsed.strawberryStock || 25);
      setChocolateStock(parsed.chocolateStock || 25);
      setTotalEarned(parsed.totalEarned || 0);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      sales,
      debts,
      payments,
      strawberryStock,
      chocolateStock,
      totalEarned
    };
    localStorage.setItem('bakerlyData', JSON.stringify(dataToSave));
  }, [sales, debts, payments, strawberryStock, chocolateStock, totalEarned]);

  const handleSale = (product, quantity, isDebt, customerName) => {
    const sale = {
      id: Date.now(),
      product,
      quantity,
      price: 1, // $1 per crepe
      isDebt,
      customerName,
      date: new Date().toISOString(),
      timestamp: new Date().toLocaleString()
    };

    setSales(prev => [...prev, sale]);
    
    if (isDebt) {
      setDebts(prev => {
        const existingDebt = prev.find(d => d.customerName.toLowerCase() === customerName.toLowerCase());
        if (existingDebt) {
          return prev.map(d => 
            d.customerName.toLowerCase() === customerName.toLowerCase() 
              ? { ...d, amount: d.amount + (sale.price * quantity), items: [...d.items, sale] }
              : d
          );
        } else {
          return [...prev, {
            customerName,
            amount: sale.price * quantity,
            items: [sale]
          }];
        }
      });
    } else {
      // Add to payments array for paid items
      setPayments(prev => [...prev, sale]);
      setTotalEarned(prev => prev + (sale.price * quantity));
    }

    // Decrement the correct stock type
    if (product === 'strawberry') {
      setStrawberryStock(prev => prev - quantity);
    } else if (product === 'chocolate') {
      setChocolateStock(prev => prev - quantity);
    }
  };

  const clearDebt = (customerName) => {
    const debt = debts.find(d => d.customerName === customerName);
    if (debt) {
      setTotalEarned(prev => prev + debt.amount);
      // Move debt items to payments when cleared
      setPayments(prev => [...prev, ...debt.items]);
      setDebts(prev => prev.filter(d => d.customerName !== customerName));
    }
  };

  const deleteDebtOrder = (customerName, orderId) => {
    setDebts(prev => {
      return prev.map(debt => {
        if (debt.customerName === customerName) {
          const updatedItems = debt.items.filter(item => item.id !== orderId);
          const deletedItem = debt.items.find(item => item.id === orderId);
          
          // Remove from sales array
          if (deletedItem) {
            setSales(salesPrev => salesPrev.filter(sale => sale.id !== orderId));
          }
          
          if (updatedItems.length === 0) {
            // If no items left, remove the entire debt
            return prev.filter(d => d.customerName !== customerName);
          } else {
            // Update the debt with remaining items
            return {
              ...debt,
              items: updatedItems,
              amount: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
          }
        }
        return debt;
      });
    });
  };

  const deletePaymentOrder = (orderId) => {
    setPayments(prev => {
      const deletedPayment = prev.find(payment => payment.id === orderId);
      
      if (deletedPayment) {
        // Subtract from total earned
        setTotalEarned(prevEarned => prevEarned - (deletedPayment.price * deletedPayment.quantity));
        
        // Remove from sales array
        setSales(salesPrev => salesPrev.filter(sale => sale.id !== orderId));
        
        // Add stock back
        if (deletedPayment.product === 'strawberry') {
          setStrawberryStock(prevStock => prevStock + deletedPayment.quantity);
        } else if (deletedPayment.product === 'chocolate') {
          setChocolateStock(prevStock => prevStock + deletedPayment.quantity);
        }
      }
      
      return prev.filter(payment => payment.id !== orderId);
    });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'shop':
        return <ShopTab onSale={handleSale} strawberryStock={strawberryStock} chocolateStock={chocolateStock} isDarkMode={false} />;
      case 'debts':
        return <DebtsTab debts={debts} onClearDebt={clearDebt} onDeleteOrder={deleteDebtOrder} isDarkMode={false} />;
      case 'payments':
        return <PaymentsTab payments={payments} onDeleteOrder={deletePaymentOrder} isDarkMode={false} />;
      case 'analytics':
        return <AnalyticsTab sales={sales} totalEarned={totalEarned} isDarkMode={false} />;
      case 'stock':
        return <StockTab strawberryStock={strawberryStock} setStrawberryStock={setStrawberryStock} chocolateStock={chocolateStock} setChocolateStock={setChocolateStock} isDarkMode={false} />;
      default:
        return <ShopTab onSale={handleSale} strawberryStock={strawberryStock} chocolateStock={chocolateStock} isDarkMode={false} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isDarkMode={false} />
      
      <main 
        className={`main-container transition-opacity duration-300 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {renderActiveTab()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={false} />
    </div>
  );
}

export default App;
