import { VerticalLogo } from "@marimo/components/vertical-logo"
import { PayForm } from "@marimo/app/(main)/pay/_components/pay-form"

import styles from "@marimo/app/(main)/pay/page.module.css"

const Login = () => {
  const { container } = styles

  return (
    <div className={container}>
      <VerticalLogo />
      <PayForm />
    </div>
  )
}

export default Login
