
const express = require("express");

function calculateTotalProfit({ amount, rateA, rateB }) {

  const executionCost = 0.0005;
  const mySpread = 0.0008;

  const diff = Math.abs(rateA - rateB) / rateA;
  const netDiff = diff - executionCost;

  if (netDiff <= 0.001) {
    return { opportunity: false };
  }

  let externalProfit;

  if (rateA < rateB) {
    const bought = amount * rateA;
    const sold = bought / rateB;
    externalProfit = sold - amount;
  } else {
    const bought = amount * rateB;
    const sold = bought / rateA;
    externalProfit = sold - amount;
  }

  const cost = amount * executionCost;
  externalProfit -= cost;

  const internalProfit = amount * mySpread;

  const totalProfit = externalProfit + internalProfit;

  return {
    opportunity: true,
    externalProfit,
    internalProfit,
    totalProfit
  };
}

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Laid Backend Running 🚀");
});

app.post("/check-profit", (req, res) => {

  const { amount, rateA, rateB } = req.body;

  const result = calculateTotalProfit({
    amount,
    rateA,
    rateB
  });

  res.json(result);
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
