import { validateEmail } from "@marimo/utils/validate-email"
import { isEnglishAndNumber } from "@marimo/utils/is-eng-and-num"

import {
  EMAIL_EXIST,
  EMAIL_FORM_VALIDATION_TEXT,
  PASSWORD_VALIDATION_TEXT,
} from "@marimo/constants"

export const getWarningMsg = (type: "email" | "password", value: string) => {
  if (type === "email" && !validateEmail(value)) {
    return EMAIL_FORM_VALIDATION_TEXT
  }

  if (type === "email" && !isEnglishAndNumber(value)) {
    return EMAIL_EXIST
  }

  if (type === "password" && value.length < 8) {
    return PASSWORD_VALIDATION_TEXT
  }
}
