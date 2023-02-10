import React, { useState } from "react";

const VirtualWallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // Load balance and transactions from local storage
  React.useEffect(() => {
    const storedBalance = localStorage.getItem("balance");
    const storedTransactions = JSON.parse(localStorage.getItem("transactions"));

    if (storedBalance) {
      setBalance(Number(storedBalance));
    }

    if (storedTransactions) {
      setTransactions(storedTransactions);
    }
  }, []);

  // Save balance and transactions to local storage
  React.useEffect(() => {
    localStorage.setItem("balance", balance);
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [balance, transactions]);

  const deposit = (amount) => {
    setBalance(balance + amount);
    setTransactions([...transactions, { type: "deposit", amount }]);
  };

  const withdraw = (amount) => {
    if (balance - amount >= 0) {
      setBalance(balance - amount);
      setTransactions([...transactions, { type: "withdraw", amount }]);
    }
  };

  return (
    <div>
      <h1>Virtual Wallet</h1>
      <p>Balance: {balance}</p>
      <button onClick={() => deposit(10)}>Deposit $10</button>
      <button onClick={() => withdraw(10)}>Withdraw $10</button>
      <h2>Transaction History</h2>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            {transaction.type}: {transaction.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VirtualWallet;