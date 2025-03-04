import jwt from "jsonwebtoken"

export const generateJWT = (id: number, email: string) => {
  const SECRET_KEY = process.env.MARIMO_SECRET_KEY!

  const payload = { id, email }
  const options = { expiresIn: 12 * 60 * 60 } // 12시간 동안 유효
  const token = jwt.sign(payload, SECRET_KEY, options)
  return token
}

export const verifyJWT = (token: string) => {
  const SECRET_KEY = process.env.MARIMO_SECRET_KEY!

  try {
    return jwt.verify(token, SECRET_KEY)
  } catch (error) {
    return null // 유효하지 않거나 만료된 토큰
  }
}
