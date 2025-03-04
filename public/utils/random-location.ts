//  랜덤 위치
export const randomLocation = (
  iterations: number,
): { x: number; y: number; isInside: boolean }[] =>{
  const points: { x: number; y: number; isInside: boolean }[] = []

  for (let i = 0; i < iterations; i++) {
    const x = Math.random()
    const y = Math.random()

    const isInside = x * x + y * y <= 1

    points.push({ x, y, isInside })
  }

  return points
}

export const containerInside = (
  points: { x: number; y: number; isInside: boolean }[],
): number => {
  const insidePoints = points.filter((point) => point.isInside).length
  // x, y 포지션에 따른 랜덤 계산
  return 4 * (insidePoints / points.length)
}

export default randomLocation
