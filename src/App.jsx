import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Benchmark from './components/Benchmark';
import { ArrowLeft } from 'lucide-react';

const INITIAL_ACCOUNTS = [
  { id: 1001, name: "Aarav Sharma", balance: 15000 },
  { id: 1002, name: "Priya Patel", balance: 8500 },
  { id: 1003, name: "Rohan Desai", balance: 20000 }
];

function App() {
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('atm_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });
  
  const [loggedInId, setLoggedInId] = useState(() => {
    const saved = localStorage.getItem('atm_loggedInId');
    return saved ? parseInt(saved) : null;
  });
  
  const [algoMode, setAlgoMode] = useState(() => {
    const saved = localStorage.getItem('atm_algoMode');
    return saved || 'DP'; // 'DP' or 'Greedy'
  });
  
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'benchmark'

  useEffect(() => {
    localStorage.setItem('atm_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (loggedInId) {
      localStorage.setItem('atm_loggedInId', loggedInId.toString());
    } else {
      localStorage.removeItem('atm_loggedInId');
    }
  }, [loggedInId]);

  useEffect(() => {
    localStorage.setItem('atm_algoMode', algoMode);
  }, [algoMode]);

  const handleLogin = (id) => {
    const account = accounts.find(a => a.id === id);
    if (account) {
      setLoggedInId(id);
      setView('dashboard');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setLoggedInId(null);
  };

  const updateBalance = (id, newBalance) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === id ? { ...acc, balance: newBalance } : acc
    ));
  };

  const transferFunds = (fromId, toId, amount) => {
    const target = accounts.find(a => a.id === toId);
    if (!target) return { success: false, message: "Beneficiary account not found." };
    
    setAccounts(prev => prev.map(acc => {
      if (acc.id === fromId) return { ...acc, balance: acc.balance - amount };
      if (acc.id === toId) return { ...acc, balance: acc.balance + amount };
      return acc;
    }));
    return { success: true, message: `Successfully transferred ₹${amount} to ${target.name}.` };
  };

  if (!loggedInId) {
    return <Login onLogin={handleLogin} />;
  }

  const currentUser = accounts.find(a => a.id === loggedInId);

  return (
    <div className="app-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', padding: '10px 0', borderBottom: '1px solid var(--card-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '40px', width: 'auto', borderRadius: '4px' }} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}><span className="accent-text">ALGO</span>-BANK</h1>
            <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>Welcome, {currentUser?.name}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {view === 'benchmark' && (
            <button className="btn-secondary" onClick={() => setView('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
          )}
          <button className="btn-secondary" onClick={handleLogout} style={{ padding: '8px 16px' }}>
            Logout
          </button>
        </div>
      </header>

      <main>
        {view === 'dashboard' ? (
          <Dashboard 
            user={currentUser} 
            algoMode={algoMode} 
            setAlgoMode={setAlgoMode}
            updateBalance={updateBalance}
            transferFunds={transferFunds}
            goToBenchmark={() => setView('benchmark')}
          />
        ) : (
          <Benchmark />
        )}
      </main>
    </div>
  );
}

export default App;
