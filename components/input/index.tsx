"use client"

import {
  useState,
  type FC,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useEffect,
  KeyboardEventHandler,
} from "react"

import { formatMoney } from "@marimo/utils/format-money"
import { getWarningMsg } from "@marimo/utils/get-warning-msg"

import styles from "@marimo/components/input/index.module.css"

interface InputProps {
  label: string
  initialValue?: string
  setState: Dispatch<SetStateAction<string | undefined>>
}

export const Input: FC<InputProps> = ({ label, initialValue, setState }) => {
  const { input__wrapper, input_label, input, p, isVisible } = styles

  const [value, setValue] = useState<string | undefined>(initialValue ?? "")
  const [warning, setWarning] = useState<string | undefined>(undefined)

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event?.target.value.length === 0) {
      setValue("")
      return setState("")
    }

    const value =
      label === "pay" ? formatMoney(event?.target.value) : event?.target.value

    setValue(value)
    setState(value)
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (
      label === "pay" &&
      !/^[0-9]$/.test(event.key) &&
      ![
        "Backspace",
        "Tab",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ].includes(event.key)
    ) {
      alert("숫자만 입력 할 수 있습니다.")

      event.preventDefault()
    }
  }

  useEffect(() => {
    value
      ? setWarning(getWarningMsg(label as "email" | "password", value))
      : setWarning(undefined)
  }, [label, value])

  return (
    <div className={input__wrapper}>
      <label htmlFor={label} className={`${input_label} text-xl-b`}>
        {label}
      </label>
      <input
        type={label}
        id={label}
        name={label}
        value={value}
        onKeyDown={handleKeyDown}
        className={`${input} text-lg`}
        onChange={onChangeHandler}
        autoComplete={label === "pay" ? "off" : "on"}
      />
      <p className={`${p} ${!!warning && isVisible} text-sm`}>{warning}</p>
    </div>
  )
}
