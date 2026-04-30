import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Activity, Clock, Target } from 'lucide-react';
import { dispenseGreedy, dispenseDP, DENOMINATIONS } from '../lib/algorithms';

const TEST_AMOUNTS = [80, 130, 240, 1000, 5000, 15000];
const ITERATIONS = 1000; // Multiplier to make ms measurable

export default function Benchmark() {
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const runBenchmark = () => {
    setIsRunning(true);
    setResults([]);

    // Small timeout to allow UI to update before blocking main thread
    setTimeout(() => {
      const newResults = [];
      
      for (const amount of TEST_AMOUNTS) {
        // Test Accuracy
        const gRes = dispenseGreedy(amount);
        const dpRes = dispenseDP(amount);
        
        // Test Performance (Scale up)
        const t0_g = performance.now();
        for(let i=0; i<ITERATIONS; i++) dispenseGreedy(amount);
        const t1_g = performance.now();
        
        const t0_dp = performance.now();
        for(let i=0; i<ITERATIONS; i++) dispenseDP(amount);
        const t1_dp = performance.now();

        const greedyFailed = gRes.count > dpRes.count || !gRes.success;

        newResults.push({
          amount,
          gNotes: gRes.count,
          dpNotes: dpRes.count,
          gTime: t1_g - t0_g,
          dpTime: t1_dp - t0_dp,
          greedyFailed
        });
      }

      setResults(newResults);
      setIsRunning(false);
    }, 100);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-panel"
      style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity className="accent-text" /> Algorithm Benchmark
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Comparing Greedy vs Dynamic Programming with {ITERATIONS} iterations per amount. <br/>
            Current Denominations: <strong>{DENOMINATIONS.join(', ')}</strong>
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={runBenchmark} 
          disabled={isRunning}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {isRunning ? <Activity className="animate-spin" size={18} /> : <Play size={18} />}
          {isRunning ? 'Running...' : 'Start Benchmark'}
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '15px' }}>Amount</th>
              <th style={{ padding: '15px' }}><Target size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/>Greedy Notes</th>
              <th style={{ padding: '15px' }}><Target size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/>DP Notes</th>
              <th style={{ padding: '15px' }}><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/>Greedy Time</th>
              <th style={{ padding: '15px' }}><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/>DP Time</th>
              <th style={{ padding: '15px' }}>Analysis</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 && !isRunning && (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Click Start Benchmark to see results
                </td>
              </tr>
            )}
            {results.map((res, idx) => (
              <motion.tr 
                key={res.amount}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{ borderBottom: '1px solid var(--card-border)' }}
              >
                <td style={{ padding: '15px', fontWeight: 600 }}>₹{res.amount.toLocaleString()}</td>
                <td style={{ padding: '15px', color: res.greedyFailed ? '#ff4444' : 'inherit' }}>{res.gNotes}</td>
                <td style={{ padding: '15px', color: 'var(--primary-accent)', fontWeight: 600 }}>{res.dpNotes}</td>
                <td style={{ padding: '15px' }}>{res.gTime.toFixed(2)} ms</td>
                <td style={{ padding: '15px' }}>{res.dpTime.toFixed(2)} ms</td>
                <td style={{ padding: '15px' }}>
                  {res.greedyFailed ? (
                    <span style={{ color: '#ff4444', fontSize: '12px', padding: '4px 8px', background: 'rgba(255, 68, 68, 0.1)', borderRadius: '12px', fontWeight: 600 }}>
                      GREEDY SUB-OPTIMAL
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Optimal</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {results.length > 0 && (
        <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          <strong>Conclusion:</strong> Greedy is significantly faster because its time complexity is <span className="accent-text">O(N)</span> regardless of the amount. However, for certain amounts (e.g., ₹130), Greedy fails to find the mathematically optimal number of notes. Dynamic Programming guarantees accuracy but its time complexity <span className="accent-text">O(Amount × N)</span> causes it to slow down linearly as the withdrawal amount increases.
        </div>
      )}
    </motion.div>
  );
}
