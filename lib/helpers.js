const { v4: uuidv4 } = require('uuid');

function generateReference() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'NSS-JB-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function calculateBookingTotal(monthlyRate, durationMonths) {
  const rate = parseFloat(monthlyRate);
  const months = parseInt(durationMonths);

  let discountPercent = 0;
  if (months >= 12) discountPercent = 10;
  else if (months >= 6) discountPercent = 5;
  else if (months >= 3) discountPercent = 2;

  const subtotal = rate * months;
  const discountAmount = Math.round(subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  return {
    monthlyRate: rate,
    durationMonths: months,
    subtotal,
    discountPercent,
    discountAmount,
    total,
  };
}

function formatCurrency(amount, currency = 'R') {
  return `${currency} ${Number(amount).toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getDates(startDate, durationMonths) {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setMonth(end.getMonth() + parseInt(durationMonths));

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

module.exports = {
  generateReference,
  calculateBookingTotal,
  formatCurrency,
  getDates,
};
