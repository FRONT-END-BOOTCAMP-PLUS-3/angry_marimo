export const getRandomElements = <T>(array: T[], count: number): T[] => {
  if (array.length <= count) return [...array]

  const result = new Set<T>()

  while (result.size < count) {
    const randomIndex = Math.floor(Math.random() * array.length)
    result.add(array[randomIndex as number])
  }

  return Array.from(result)
}
