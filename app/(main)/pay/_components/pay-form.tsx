"use client"

import Image from "next/image"

import { useEffect, useState } from "react"

import { Input } from "@marimo/components/input"

import { useDebounce } from "@marimo/hooks/use-debounce"

import { formatMoney } from "@marimo/utils/format-money"
import { extractNumber } from "@marimo/utils/extract-number"
import { uuidGenerator } from "@marimo/utils/uuid_generator"

import styles from "@marimo/app/(main)/pay/_components/pay-form.module.css"

import { useStore } from "@marimo/stores/use-store"
import {
  loadTossPayments,
  TossPaymentsWidgets,
  WidgetAgreementWidget,
  WidgetPaymentMethodWidget,
} from "@tosspayments/tosspayments-sdk"

export const PayForm = () => {
  const { wrapper, button, p_wrapper, p_round } = styles

  const { user } = useStore()

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
  const customerKey = `customer_key-${user?.id}`

  const [allAmount, setAllAmount] = useState<{
    count: number
    amount: number
  }>({
    count: 0,
    amount: 0,
  })

  const [price, setPrice] = useState<string | undefined>("1")
  const [amount, setAmount] = useState<{
    currency: string
    value: number
  }>({
    currency: "KRW",
    value: extractNumber(price ?? "1"),
  })

  const debouncedPrice = useDebounce(price, 500)

  const [ready, setReady] = useState(false)
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null)
  const [renderUi, setRenderUi] = useState<WidgetPaymentMethodWidget | null>(
    null,
  )
  const [agreementUi, setAgreementUi] = useState<WidgetAgreementWidget | null>(
    null,
  )

  const onClickHandler = async () => {
    if (user === null) return

    try {
      if (widgets === null) return

      await widgets.requestPayment({
        orderId: `order_id-${uuidGenerator()}`,
        orderName: "앵그리 마리모 후원하기",
        successUrl: window.location.origin + "/pay/toss/success",
        failUrl: window.location.origin + "/pay/toss/fail",
        customerEmail: user.email,
        customerName: user.name,
      })
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    }
  }

  useEffect(() => {
    const fetchAllAmount = async () => {
      const response = await fetch(`/api/pay/order`, {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
      }).then((res) => res.json())

      setAllAmount(response)
    }

    fetchAllAmount()
  }, [])

  useEffect(() => {
    setAmount({
      currency: "KRW",
      value: extractNumber(debouncedPrice ?? ""),
    })
  }, [debouncedPrice])

  useEffect(() => {
    if (user === null) return

    async function fetchPaymentWidgets() {
      try {
        const tossPayments = await loadTossPayments(clientKey)
        const widgets = tossPayments.widgets({
          customerKey,
        })
        setWidgets(widgets)
      } catch (error) {
        console.error("Error fetching payment widget:", error)
      }
    }

    fetchPaymentWidgets()
  }, [user, clientKey, customerKey])

  useEffect(() => {
    if (user === null) return

    async function renderPaymentWidgets() {
      if (widgets == null) {
        return
      }

      try {
        setReady(false)

        await renderUi?.destroy()
        await agreementUi?.destroy()

        await widgets.setAmount(amount)

        const newUi = await widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        })

        setRenderUi(newUi)

        const newAgreement = await widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        })

        setAgreementUi(newAgreement)
      } catch (error) {
        if (renderUi) {
          renderUi.destroy()
          setRenderUi(null)
        }
        if (agreementUi) {
          agreementUi.destroy()
          setAgreementUi(null)
        }
        console.error(error)

        setReady(false)
      }

      setReady(true)
    }

    renderPaymentWidgets()

    return () => {
      if (renderUi) {
        renderUi.destroy().then(() => setRenderUi(null))
      }
      if (agreementUi) {
        agreementUi.destroy().then(() => setAgreementUi(null))
      }
    }
  }, [widgets, amount])

  return (
    <div className={wrapper}>
      <div>
        <div className={p_wrapper}>
          <p>💡 실제로 결제 되지 않는 테스트 결제입니다</p>
          <p>Angry Marimo의 팀에게 후원하고 싶은 마음의 크기를 표현해주세요!</p>
          <p
            className={p_round}
          >{`현재까지 모인 횟수 : ${formatMoney(String(allAmount.count))}회`}</p>
          <p
            className={p_round}
          >{`현재까지 모인 금액 : ${formatMoney(String(allAmount.amount))}원`}</p>
        </div>

        <Input label="pay" initialValue={price} setState={setPrice} />

        {/* 결제 UI */}
        <div id="payment-method" />

        {/* 이용약관 UI */}
        <div id="agreement" />

        {/* 결제하기 버튼 */}
        <button className={button} disabled={!ready} onClick={onClickHandler}>
          <Image
            src="/pay-img/toss-logo.png"
            alt="toss-icon"
            width={25}
            height={25}
          />
          토스페이로 결제하기
        </button>
      </div>
    </div>
  )
}
