import React, { useState, useEffect } from "react"

import modalStyles from "./modal.module.css"

export const NotificationPermissionModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const { overlay, modal, buttons, buttonAllow, buttonDeny, closeButton } =
    modalStyles

  useEffect(() => {
    if (Notification.permission === "default") {
      setIsVisible(true)
    }
  }, [])

  const handleAllow = () => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        alert("알림 권한이 허용되었습니다!")
      } else {
        alert("알림 권한이 거부되었습니다.")
      }
      setIsVisible(false) // 모달 닫기
    })
  }

  const handleDeny = () => {
    alert("알림 권한이 거부되었습니다.")
    setIsVisible(false) // 모달 닫기
  }

  if (!isVisible) return null

  return (
    <div className={overlay}>
      <div className={modal}>
        <h2>알림 권한 요청</h2>
        <p>
          알림을 통해 중요한 정보를 받을 수 있습니다. 알림을 허용하시겠습니까?
        </p>
        <div className={buttons}>
          <button onClick={handleAllow} className={buttonAllow}>
            허용
          </button>
          <button onClick={handleDeny} className={buttonDeny}>
            거부
          </button>
        </div>
        <button onClick={onClose} className={closeButton}>
          X
        </button>
      </div>
    </div>
  )
}
