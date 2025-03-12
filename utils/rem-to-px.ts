export const remToPx = (rem: number, width: number) => {
  if (width < 769) {
    return 10 * rem
  }

  return 16 * rem
}
