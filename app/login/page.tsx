import { VerticalLogo } from "@marimo/components/vertical-logo"
import LoginForm from "@marimo/app/login/_components/login-form"

import { userLogin } from "@marimo/app/login/actions/user-login"

import styles from "@marimo/app/login/page.module.css"

const Login = () => {
  const { container, form } = styles

  return (
    <div className={container}>
      <VerticalLogo />
      <form className={form} action={userLogin}>
        <LoginForm />
      </form>
    </div>
  )
}

export default Login
