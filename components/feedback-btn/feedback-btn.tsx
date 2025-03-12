"use client"
import Link from "next/link"
import Image from "next/image"

import { useState } from "react"

import styles from "@marimo/components/feedback-btn/feedback-btn.module.css"

import { FEED_BACK_BUTTON } from "@marimo/constants/feedback"

const FeedbackButton = () => {
  const { container, button, buttonHidden, balloon, triangle } = styles

  const [isVisible, setIsVisible] = useState(true)

  return (
    isVisible && (
      <div aria-label="feedback_id" className={container}>
        <button onClick={() => setIsVisible(false)} className={buttonHidden}>
          x
        </button>
        <Link href={FEED_BACK_BUTTON} target="_blank">
          <div className={balloon}>
            <p>Click me!</p>
            <span className={triangle}></span>
          </div>
          <Image
            src="/images/present.png"
            alt="선물상자"
            width={80}
            height={80}
            className={button}
          />
        </Link>
      </div>
    )
  )
}

export default FeedbackButton
