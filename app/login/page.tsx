import { VerticalLogo } from "@marimo/components/vertical-logo"
import SuspendedLoginForm from "@marimo/app/login/_components/login-form"

import { userLogin } from "@marimo/app/login/actions/user-login"

import styles from "@marimo/app/login/page.module.css"

const Login = () => {
  const { container, info, form } = styles

  return (
    <div className={container}>
      <VerticalLogo />
      <div className={info}>
        <p>가입 한 적 없어도 놀라지 말아요!</p>
        <p>
          다른 정보를 입력 할 필요없이 이메일, 패스워드를 입력하면 자동으로
          회원가입을 합니다 🥳
        </p>
        <p>앞으로 소셜 로그인 등 다양한 로그인 방법을 만들어 볼께요!</p>
      </div>
      <form className={form} action={userLogin}>
        <SuspendedLoginForm />
      </form>
    </div>
  )
}

export default Login
