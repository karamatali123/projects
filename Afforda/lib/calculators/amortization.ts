/**
 * Monthly payment for a fully amortizing loan.
 * PMT = P * r * (1+r)^n / ((1+r)^n - 1)
 */
export function monthlyLoanPayment(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  const factor = (1 + monthlyRate) ** termMonths;
  return (principal * monthlyRate * factor) / (factor - 1);
}

/**
 * Maximum principal that can be borrowed for a target monthly payment.
 */
export function presentValueFromPayment(
  payment: number,
  annualRatePercent: number,
  termMonths: number,
): number {
  if (payment <= 0 || termMonths <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) return payment * termMonths;
  const factor = (1 + monthlyRate) ** termMonths;
  return (payment * (factor - 1)) / (monthlyRate * factor);
}
