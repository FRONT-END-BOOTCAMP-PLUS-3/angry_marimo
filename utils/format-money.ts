export const formatMoney = (input: string) => {
  let value = input.replace(/[^0-9]/g, "")

  value = value.replace(/^0+/, "")

  if (value === "") {
    return "0"
  }

  return `${Number(value).toLocaleString()}`
}
