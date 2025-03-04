export const isEnglishAndNumber = (value: string) => {
  return /^[a-zA-Z0-9@.]+$/.test(value)
}
