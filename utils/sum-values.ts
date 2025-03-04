export const sumValues = (values: number[]): number => {
  if (values.length === 0) return 0

  return values.reduce((acc, currentValue) => acc + currentValue, 0)
}
