import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { dispenseGreedy, dispenseDP } from '../lib/algorithms';

export default function TransactionModal({ type, user, algoMode, updateBalance, transferFunds, onClose }) {
  const [amount, setAmount] = useState('');
  const [targetId, setTargetId] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success'|'error', msg: '', details: null }

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseInt(amount);

    if (isNaN(val) || val <= 0) {
      setStatus({ type: 'error', msg: 'Please enter a valid amount' });
      return;
    }

    if (type === 'deposit') {
      updateBalance(user.id, user.balance + val);
      setStatus({ type: 'success', msg: `Successfully deposited ₹${val}` });
      setTimeout(onClose, 2000);
      return;
    }

    if (type === 'withdraw') {
      if (val % 10 !== 0) {
        setStatus({ type: 'error', msg: 'Amount must be a multiple of 10' });
        return;
      }
      if (val > user.balance) {
        setStatus({ type: 'error', msg: 'Insufficient funds' });
        return;
      }

      // Execute Algorithm
      const result = algoMode === 'Greedy' ? dispenseGreedy(val) : dispenseDP(val);

      if (!result.success) {
        setStatus({ type: 'error', msg: `ATM cannot dispense exactly ₹${val} with current denominations using ${algoMode}.` });
        return;
      }

      updateBalance(user.id, user.balance - val);
      setStatus({ 
        type: 'success', 
        msg: `Successfully withdrew ₹${val}`,
        details: result 
      });
      return;
    }

    if (type === 'transfer') {
      const target = parseInt(targetId);
      if (isNaN(target)) {
        setStatus({ type: 'error', msg: 'Invalid target account ID' });
        return;
      }
      if (target === user.id) {
        setStatus({ type: 'error', msg: 'Cannot transfer to yourself' });
        return;
      }
      if (val > user.balance) {
        setStatus({ type: 'error', msg: 'Insufficient funds' });
        return;
      }

      const res = transferFunds(user.id, target, val);
      if (res.success) {
        setStatus({ type: 'success', msg: res.message });
        setTimeout(onClose, 2000);
      } else {
        setStatus({ type: 'error', msg: res.message });
      }
    }
  };

  const titleMap = {
    deposit: 'Deposit Funds',
    withdraw: 'Withdraw Cash',
    transfer: 'Transfer Funds'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel"
        style={{ width: '100%', maxWidth: '500px', padding: '30px', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <h2 style={{ margin: '0 0 20px 0' }}>{titleMap[type]}</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {type === 'transfer' && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Beneficiary Account ID</label>
              <input 
                type="number" 
                placeholder="e.g., 1002"
                value={targetId}
                onChange={e => setTargetId(e.target.value)}
                disabled={status?.type === 'success'}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Amount (₹)</label>
            <input 
              type="number" 
              placeholder="Enter amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              disabled={status?.type === 'success'}
            />
          </div>

          <AnimatePresence>
            {status && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ 
                  padding: '15px', 
                  borderRadius: '8px', 
                  backgroundColor: status.type === 'success' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 68, 68, 0.1)',
                  border: `1px solid ${status.type === 'success' ? 'var(--primary-accent)' : '#ff4444'}`,
                  color: status.type === 'success' ? 'var(--primary-accent)' : '#ff4444'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: status.details ? '15px' : '0' }}>
                  {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                  <span style={{ fontWeight: 500 }}>{status.msg}</span>
                </div>
                
                {status.details && (
                  <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '6px', fontSize: '14px', color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Algorithm:</span>
                      <strong>{status.details.method}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/>Execution Time:</span>
                      <strong>{status.details.timeMs.toFixed(4)} ms</strong>
                    </div>
                    
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Notes Dispensed ({status.details.count} total):</div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {Object.entries(status.details.details).map(([note, count]) => (
                        <div key={note} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '5px 10px', borderRadius: '4px' }}>
                          ₹{note} <span style={{ color: 'var(--primary-accent)', fontWeight: 600 }}>× {count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!status?.details && (
            <button type="submit" className="btn-primary" disabled={status?.type === 'success'}>
              Confirm {titleMap[type].split(' ')[0]}
            </button>
          )}

          {status?.details && (
            <button type="button" className="btn-secondary" onClick={onClose}>
              Close
            </button>
          )}

        </form>
      </motion.div>
    </div>
  );
}
