export const remToPx = (rem: number, width: number) => {
  if (width < 769) {
    return 15 * rem
  }

  return 19 * rem
}
