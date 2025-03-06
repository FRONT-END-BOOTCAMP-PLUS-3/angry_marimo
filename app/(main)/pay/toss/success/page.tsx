"use client"

import Image from "next/image"
import { redirect, useRouter, useSearchParams } from "next/navigation"

import { Suspense, useEffect, useState } from "react"

import styles from "@marimo/app/(main)/pay/toss/success/page.module.css"

import { useStore } from "@marimo/stores/use-store"

const SuccessPage = () => {
  const router = useRouter()

  const { marimo } = useStore()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    box_section,
    p_grid,
    typography__p,
    p_grid_col,
    text__left,
    text__right,
    button,
  } = styles

  const searchParams = useSearchParams()

  const requestData = {
    orderId: searchParams.get("orderId"),
    amount: searchParams.get("amount"),
    paymentKey: searchParams.get("paymentKey"),
  }

  useEffect(() => {
    if (!marimo) {
      alert("마리모를 찾을 수 없는 오류 발견! 잠시 후 다시 시도해주세요!!")

      redirect("/")
    }

    const confirm = async () => {
      const response = await fetch("/api/pay/confirm", {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      const json = await response.json()

      if (!response.ok) {
        throw { message: json.message, code: json.code }
      }

      return json
    }

    confirm()
      .then(async (res) => {
        const createOrder = async () => {
          try {
            return await fetch(`/api/pay/order`, {
              method: "POST",
              mode: "cors",
              credentials: "same-origin",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                marimoId: marimo?.id,
                amount: res.balanceAmount,
                paymentKey: res.paymentKey,
                status: "SUCCESS",
                payResponse: res,
              }),
            }).then(() => setIsLoading(true))
          } catch (error) {
            console.error(error)
            alert("잠시 후 다시 시도해주세요!")
          }
        }

        await createOrder().catch(() => {
          router.push(`/pay/toss/fail?message=${"결제가 실패하였습니다"}`)
        })
      })
      .catch((error) => {
        console.error("here4")
        router.push(
          `/pay/toss/fail?code=${error.code}&message=${error.message}`,
        )
      })
  }, [])

  return (
    <div className={box_section} style={{ width: "600px" }}>
      <Image
        width={100}
        height={100}
        src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
        alt="결제 완료"
      />
      {!isLoading && <h2>결제 중 입니다! 잠시 기다려주세요...</h2>}
      {isLoading && (
        <>
          <h2>결제를 완료했어요</h2>
          <div
            className={`${p_grid} ${typography__p}`}
            style={{ marginTop: "50px" }}
          >
            <div className={`${p_grid_col} ${text__left}`}>
              <b>결제금액</b>
            </div>
            <div className={`${p_grid_col} ${text__right}`}>
              {`${Number(searchParams.get("amount")).toLocaleString()}원`}
            </div>
          </div>
          <div
            className={`${p_grid} ${typography__p}`}
            style={{ marginTop: "10px" }}
          >
            <div className={`${p_grid_col} ${text__left}`}>
              <b>주문번호</b>
            </div>
            <div className={`${p_grid_col} ${text__right}`}>
              {searchParams.get("orderId")}
            </div>
          </div>
          <div
            className={`${p_grid} ${typography__p}`}
            style={{ marginTop: "10px" }}
          >
            <div className={`${p_grid_col} ${text__left}`}>
              <b>paymentKey</b>
            </div>
            <div
              className={`${p_grid_col} ${text__right}`}
              style={{ whiteSpace: "initial", width: "250px" }}
            >
              {searchParams.get("paymentKey")}
            </div>
          </div>
          <button className={button} onClick={() => router.push("/")}>
            메인 페이지로 이동
          </button>
          <button className={button} onClick={() => router.push("/custom")}>
            마리모 꾸미러 가기
          </button>
        </>
      )}
    </div>
  )
}

const SuspendedSuccessPage = () => (
  <Suspense fallback={<div>로딩 중...</div>}>
    <SuccessPage />
  </Suspense>
)

export default SuspendedSuccessPage
