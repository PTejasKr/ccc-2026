# ALGO-BANK: ATM Algorithm Simulator

ALGO-BANK is a modern, responsive web application that simulates an ATM interface while visualizing the performance differences between two core computer science algorithms: **Greedy** and **Dynamic Programming (DP)**. 

Originally built as a C-terminal program, this project has been fully modernized into a React-based application featuring a premium, glassmorphic light-theme UI.

## 🚀 Features

- **Algorithm Comparison Engine**: Dispense cash using either a Greedy algorithm or an optimal Dynamic Programming algorithm.
- **Performance Lab (Benchmark)**: Run side-by-side performance tests scaling up to 1,000 iterations to visualize the time complexity differences:
  - **Greedy**: `O(N)` Time complexity (Faster, but can fail to provide optimal notes).
  - **Dynamic Programming**: `O(Amount × N)` Time complexity (Slower for large amounts, but mathematically guarantees the minimum number of notes).
- **Persistent State**: User balances and active algorithm modes are saved to your browser's local storage.
- **Responsive Design**: Flawless experience on both desktop and mobile devices.
- **Custom Design System**: Utilizes a specific high-contrast color palette (`#F5F5F5`, `#DFF1F1`, `#BBD5DA`, `#FF0000`).

## 🛠 Technology Stack

- **Frontend**: React (via Vite)
- **Styling**: Vanilla CSS with custom CSS variables
- **Icons**: Lucide-React
- **Animations**: Framer Motion

## 📦 Local Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/ccc-2026.git
   cd ccc-2026
   ```

2. **Install Dependencies**
   Make sure you have [Node.js](https://nodejs.org/) installed, then run:
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173/`.

## 👥 Sample Profiles

You can log in to the application using any of the following pre-configured Account IDs. Each account starts with a default balance of ₹50,000.

| Account Name | Account ID | Default Balance |
|--------------|------------|-----------------|
| Punya        | `101`      | ₹50,000         |
| Tejas        | `102`      | ₹50,000         |
| Guest        | `103`      | ₹50,000         |

## 🧠 Denominations Used

The ATM utilizes the following Indian Rupee (₹) denominations:
`₹10`, `₹20`, `₹50`, `₹80`, `₹100`, `₹200`, `₹500`

*Note: The `₹80` note is intentionally included to demonstrate the limitations of the Greedy algorithm compared to Dynamic Programming.*

---
**Developed for CCC 2026**
