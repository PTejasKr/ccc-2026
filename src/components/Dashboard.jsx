import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowDownToLine, ArrowUpFromLine, Send, Activity, Settings2 } from 'lucide-react';
import TransactionModal from './TransactionModal';

export default function Dashboard({ user, algoMode, setAlgoMode, updateBalance, transferFunds, goToBenchmark }) {
  const [modalType, setModalType] = useState(null); // 'deposit', 'withdraw', 'transfer', null

  const handleTransaction = (type) => {
    setModalType(type);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'grid', gap: '30px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
    >
      <div className="glass-panel" style={{ padding: '30px', gridColumn: '1 / -1' }}>
        <p style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)' }}>Available Balance</p>
        <h2 style={{ margin: 0, fontSize: '48px', fontWeight: 800 }} className="accent-text">₹{user.balance.toLocaleString()}</h2>
        
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => handleTransaction('deposit')} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}>
            <ArrowDownToLine size={18} /> Deposit
          </button>
          <button className="btn-secondary" onClick={() => handleTransaction('withdraw')} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}>
            <ArrowUpFromLine size={18} /> Withdraw
          </button>
          <button className="btn-secondary" onClick={() => handleTransaction('transfer')} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}>
            <Send size={18} /> Transfer
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Settings2 size={20} className="accent-text" /> ATM Algorithm</h3>
          <span style={{ fontSize: '12px', padding: '4px 10px', background: 'rgba(0,0,0,0.05)', borderRadius: '20px', border: '1px solid var(--card-border)' }}>
            {algoMode}
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
          Choose how the ATM dispenses cash. <strong>Greedy</strong> is extremely fast but can occasionally fail to give exact change. <strong>Dynamic Programming (DP)</strong> is 100% accurate but takes more processing time.
        </p>
        <button 
          className="btn-secondary" 
          onClick={() => setAlgoMode(prev => prev === 'Greedy' ? 'DP' : 'Greedy')}
          style={{ width: '100%' }}
        >
          Switch to {algoMode === 'Greedy' ? 'Dynamic Programming' : 'Greedy'}
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Activity size={20} className="accent-text" /> Performance Lab</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            Run a side-by-side benchmark of both algorithms across different withdrawal amounts to visualize the time complexity and accuracy differences.
          </p>
        </div>
        <button className="btn-primary" onClick={goToBenchmark} style={{ width: '100%', marginTop: '20px' }}>
          Run Benchmark
        </button>
      </div>

      {modalType && (
        <TransactionModal 
          type={modalType} 
          user={user} 
          algoMode={algoMode}
          updateBalance={updateBalance}
          transferFunds={transferFunds}
          onClose={() => setModalType(null)} 
        />
      )}
    </motion.div>
  );
}
