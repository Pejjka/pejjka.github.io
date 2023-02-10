const express = require("express");
const app = express();
const port = 55511;
const bodyParser = require("body-parser");
const io = require("socket.io")(port);

app.use(bodyParser.json());

let balance = 0;
let transactions = [];

app.post("/deposit", function(req, res) {
  balance += req.body.amount;
  transactions.push({ type: "Deposit", amount: req.body.amount });
  io.sockets.emit("balanceUpdate", balance);
  io.sockets.emit("transactionUpdate", {
    type: "Deposit",
    amount: req.body.amount,
  });
  res.json({ balance });
});

app.post("/withdraw", function(req, res) {
  if (balance >= req.body.amount) {
    balance -= req.body.amount;
    transactions.push({ type: "Withdrawal", amount: req.body.amount });
    io.sockets.emit("balanceUpdate", balance);
    io.sockets.emit("transactionUpdate", {
      type: "Withdrawal",
      amount: req.body.amount,
    });
    res.json({ balance });
  } else {
    res.status(400).json({ error: "Insufficient funds" });
  }
});

app.listen(port, function() {
  console.log(`Virtual wallet server listening at http://localhost:${port}`);
});