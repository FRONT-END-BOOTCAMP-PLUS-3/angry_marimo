export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // 이메일 기본 패턴 검증
  if (!emailRegex.test(email)) {
    return false
  }

  // 로컬 파트와 도메인 파트를 분리
  const [localPart, domain] = email.split("@")

  // 연속된 점이 있는지 검사
  if (/\.\./.test(localPart) || /\.\./.test(domain)) {
    return false
  }

  return true
}
