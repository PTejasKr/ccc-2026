import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, CreditCard } from 'lucide-react';

export default function Login({ onLogin }) {
  const [accountId, setAccountId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!accountId) {
      setError('Please enter an Account ID');
      return;
    }
    const success = onLogin(parseInt(accountId));
    if (!success) {
      setError('Account not found. Try 1001, 1002, or 1003.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ width: '100%', maxWidth: '400px', padding: '40px', boxSizing: 'border-box' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '80px', width: 'auto', marginBottom: '16px', borderRadius: '8px' }} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
          <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Welcome to <span className="accent-text">ALGO</span>-BANK</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Secure login to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Account ID</label>
            <input 
              type="number" 
              placeholder="e.g., 1001" 
              value={accountId}
              onChange={(e) => { setAccountId(e.target.value); setError(''); }}
              style={{ width: '100%' }}
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: '#ff4444', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ShieldAlert size={16} /> {error}
            </motion.div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Access Account
          </button>
        </form>

        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--card-border)', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px 0' }}><ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Demo Accounts Available:</p>
          <p style={{ margin: 0 }}><strong>1001</strong> (Aarav) | <strong>1002</strong> (Priya) | <strong>1003</strong> (Rohan)</p>
        </div>
      </motion.div>
    </div>
  );
}
