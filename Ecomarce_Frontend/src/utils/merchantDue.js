export const toMoney = (value) => {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) ? Number(numeric.toFixed(2)) : 0;
};

export const getMerchantDueFromNegativeStock = (stock, price) => {
  const numericStock = Number(stock || 0);
  const numericPrice = Number(price || 0);
  const shortageQty = Math.max(0, Math.abs(Math.min(0, numericStock)));
  const dueAmount = toMoney(shortageQty * numericPrice * 0.5);

  return { shortageQty, dueAmount };
};
