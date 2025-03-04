import { Dropdown } from "@marimo/components/header/dropdown"
import { HorizontalLogo } from "@marimo/components/header/horizontal-logo"

import styles from "@marimo/components/header/index.module.css"

export const Header = () => {
  const { header } = styles
  return (
    <header className={header}>
      <HorizontalLogo />
      <Dropdown />
    </header>
  )
}
