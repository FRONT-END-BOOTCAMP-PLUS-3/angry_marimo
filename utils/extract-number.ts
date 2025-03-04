export const extractNumber = (input: string): number => {
  const result = input.replace(/\D/g, "")

  return result ? Number(result) : 0
}
