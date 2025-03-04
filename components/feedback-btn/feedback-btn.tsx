import Link from "next/link"
import Image from "next/image"

import styles from "@marimo/components/feedback-btn/feedback-btn.module.css"

import { FEED_BACK_BUTTON } from "@marimo/constants/feedback"

const FeedbackButton = () => {
  const { container, button, balloon, triangle } = styles

  return (
    <div aria-label="feedback_id" className={container}>
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
}

export default FeedbackButton
