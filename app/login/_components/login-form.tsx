"use client"

import { useSearchParams } from "next/navigation"

import { Suspense, useEffect, useState } from "react"

import { Input } from "@marimo/components/input"

import { validateEmail } from "@marimo/utils/validate-email"
import { isEnglishAndNumber } from "@marimo/utils/is-eng-and-num"

import styles from "@marimo/app/login/_components/login-form.module.css"

import { useStore } from "@marimo/stores/use-store"
import { LOGIN_TEXT, EMAIL_TEXT, PASSWORD_TEXT } from "@marimo/constants"

const { button, input__gap, info, info__div } = styles

const LoginForm = () => {
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
      <div className={info}>
        <p>🌱 환영합니다!</p>
        <p>당신의 마리모는 이미 화가 나 있어요. 잘 달래서 키워볼까요?</p>
      </div>
      <Input label={EMAIL_TEXT} setState={setEmail} />
      <Input label={PASSWORD_TEXT} setState={setPassword} />
      <button
        name="login"
        disabled={!isValid}
        className={`${button} text-xl-b`}
      >
        {LOGIN_TEXT}
      </button>
      <p>아이디와 비밀번호를 입력하면 자동 회원가입 후 로그인됩니다.</p>
    </div>
  )
}

const SuspendedLoginFormPage = () => (
  <Suspense fallback={<div>로딩 중...</div>}>
    <LoginForm />
  </Suspense>
)

export default SuspendedLoginFormPage
