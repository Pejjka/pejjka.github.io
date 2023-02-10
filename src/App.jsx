import React, { useState } from "react";

const VirtualWallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // Load balance and transactions from IndexedDB
  React.useEffect(() => {
    const openDB = async () => {
      const db = await window.indexedDB.open("wallet", 1);
      db.onupgradeneeded = (event) => {
        const objectStore = event.target.result.createObjectStore("data", {
          keyPath: "id",
        });
        objectStore.createIndex("balance", "balance", { unique: false });
        objectStore.createIndex("transactions", "transactions", {
          unique: false,
        });
      };
      db.onsuccess = (event) => {
        const objectStore = event.target.result
          .transaction("data", "readonly")
          .objectStore("data");
        const balanceRequest = objectStore.index("balance").get(1);
        balanceRequest.onsuccess = (event) => {
          setBalance(event.target.result.balance || 0);
        };
        const transactionsRequest = objectStore.index("transactions").get(1);
        transactionsRequest.onsuccess = (event) => {
          setTransactions(event.target.result.transactions || []);
        };
      };
    };
    openDB();
  }, []);

  // Save balance and transactions to IndexedDB
  React.useEffect(() => {
    const saveData = async () => {
      const db = await window.indexedDB.open("wallet", 1);
      db.onsuccess = (event) => {
        const objectStore = event.target.result
          .transaction("data", "readwrite")
          .objectStore("data");
        objectStore.put({ id: 1, balance, transactions });
      };
    };
    saveData();
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