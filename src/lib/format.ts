export function inr(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    const l = amount / 100000;
    return `₹${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)} L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function inrFull(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export function pctBelow(price: number, benchmark: number): number {
  return Math.round(((benchmark - price) / benchmark) * 100);
}
