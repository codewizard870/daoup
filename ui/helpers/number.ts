// Convert number to string with a given precision, and chop all trailing zeroes.
export const prettyPrintDecimal = (
  value: number | string,
  maximumFractionDigits: number = 6,
  minimumFractionDigits?: number
): string =>
  Number(value).toLocaleString(undefined, {
    minimumFractionDigits,
    maximumFractionDigits,
  })
