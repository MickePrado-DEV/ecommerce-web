export const formatMoney = (amount: number, currency = 'MXN') =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(amount);
