
/*
  Profit Engine
  - Detect External Arbitrage
  - Apply Execution Cost
  - Apply Your Internal Spread
*/

function detectArbitrage(rateA, rateB, executionCost = 0.0005) {

  const diff = Math.abs(rateA - rateB) / rateA;
  const netDiff = diff - executionCost;

  if (netDiff > 0.001) {
    return {
      opportunity: true,
      netDiff
    };
  }

  return { opportunity: false };
}


function calculateExternalProfit(amount, buyRate, sellRate, executionCost = 0.0005) {

  const bought = amount * buyRate;
  const sold = bought / sellRate;

  const grossProfit = sold - amount;
  const cost = amount * executionCost;

  return grossProfit - cost;
}


// Internal Spread (you can modify this)
function applyInternalSpread(amount, spreadPercent = 0.0008) {
  return amount * spreadPercent;
}


function calculateTotalProfit({
  amount,
  rateA,
  rateB,
  executionCost = 0.0005,
  mySpread = 0.0008
}) {

  const arb = detectArbitrage(rateA, rateB, executionCost);

  if (!arb.opportunity) {
    return {
      opportunity: false
    };
  }

  let externalProfit;

  if (rateA < rateB) {
    externalProfit = calculateExternalProfit(amount, rateA, rateB, executionCost);
  } else {
    externalProfit = calculateExternalProfit(amount, rateB, rateA, executionCost);
  }

  const internalProfit = applyInternalSpread(amount, mySpread);

  const totalProfit = externalProfit + internalProfit;

  return {
    opportunity: true,
    externalProfit,
    internalProfit,
    totalProfit
  };
}

module.exports = {
  calculateTotalProfit
};
