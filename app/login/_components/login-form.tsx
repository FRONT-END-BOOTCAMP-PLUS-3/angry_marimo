"use client"

import { useSearchParams } from "next/navigation"

import { Suspense, useEffect, useState } from "react"

import { Input } from "@marimo/components/input"

import { validateEmail } from "@marimo/utils/validate-email"
import { isEnglishAndNumber } from "@marimo/utils/is-eng-and-num"

import styles from "@marimo/app/login/_components/login-form.module.css"

import { useStore } from "@marimo/stores/use-store"
import { LOGIN_TEXT, EMAIL_TEXT, PASSWORD_TEXT } from "@marimo/constants"

const { button, input__gap } = styles

export const LoginForm = () => {
  const searchParams = useSearchParams()
  const status = searchParams.get("status")

  const { clearUser } = useStore()

  const [email, setEmail] = useState<string | undefined>(undefined)
  const [password, setPassword] = useState<string | undefined>(undefined)
  const [isValid, setIsValid] = useState<boolean>(false)

  useEffect(() => {
    if (
      email &&
      password &&
      validateEmail(email) &&
      isEnglishAndNumber(email) &&
      password?.length > 7
    )
      return setIsValid(true)

    setIsValid(false)
  }, [email, password])

  useEffect(() => {
    clearUser()

    if (!!status && Number(status) === 303)
      alert("비밀번호가 일치하지 않습니다")
  }, [clearUser, status])

  return (
    <div className={input__gap}>
      <Input label={EMAIL_TEXT} setState={setEmail} />
      <Input label={PASSWORD_TEXT} setState={setPassword} />
      <button
        name="login"
        disabled={!isValid}
        className={`${button} text-xl-b`}
      >
        {LOGIN_TEXT}
      </button>
    </div>
  )
}

const SuspendedLoginForm = () => (
  <Suspense fallback={<div>로딩 중...</div>}>
    <LoginForm />
  </Suspense>
)

export default SuspendedLoginForm
