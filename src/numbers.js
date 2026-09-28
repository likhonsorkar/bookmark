// Turns whatever the user typed into a real number. Bengali keyboards type
// ০১২৩৪৫৬৭৮৯ — Number("২") is NaN, which is why totals stayed 0 before.
const BN_DIGITS = '০১২৩৪৫৬৭৮৯'

export function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  const cleaned = String(value ?? '')
    .replace(/[০-৯]/g, (d) => BN_DIGITS.indexOf(d))
    .replace(/[,\s]/g, '')
    .replace(/٫/g, '.')
  const n = parseFloat(cleaned)
  return Number.isFinite(n) ? n : 0
}

export function money(n) {
  return (Math.round(toNumber(n) * 100) / 100).toFixed(2)
}
