export const getTrashImage = (level: number) => {
  if (level === 1) return "/images/trash_level1.png"
  if (level === 2) return "/images/trash_level2.png"
  if (level === 3) return "/images/trash_level3.png"
  return "/images/trash_level3.png"
}
