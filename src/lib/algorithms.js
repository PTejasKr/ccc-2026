export const DENOMINATIONS = [10, 20, 50, 80, 100, 200, 500];

export function dispenseGreedy(amount) {
  const t0 = performance.now();
  let remaining = amount;
  let count = 0;
  let details = {};
  
  // Create sorted array descending
  const sorted = [...DENOMINATIONS].sort((a, b) => b - a);
  
  for (const note of sorted) {
    if (remaining >= note) {
      const numNotes = Math.floor(remaining / note);
      details[note] = numNotes;
      count += numNotes;
      remaining -= (numNotes * note);
    }
  }
  
  const t1 = performance.now();
  
  return {
    success: remaining === 0,
    count,
    details,
    timeMs: t1 - t0,
    remainder: remaining,
    method: "Greedy"
  };
}

export function dispenseDP(amount) {
  const t0 = performance.now();
  const dp = new Array(amount + 1).fill(Infinity);
  const parent = new Array(amount + 1).fill(-1);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (const note of DENOMINATIONS) {
      if (note <= i) {
        if (dp[i - note] + 1 < dp[i]) {
          dp[i] = dp[i - note] + 1;
          parent[i] = note;
        }
      }
    }
  }
  
  let count = dp[amount];
  let details = {};
  let success = count !== Infinity;
  
  if (success) {
    let curr = amount;
    while (curr > 0) {
      const note = parent[curr];
      details[note] = (details[note] || 0) + 1;
      curr -= note;
    }
  }
  
  const t1 = performance.now();
  
  return {
    success,
    count: success ? count : 0,
    details,
    timeMs: t1 - t0,
    method: "Dynamic Programming"
  };
}
