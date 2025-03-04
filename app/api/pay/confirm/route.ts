import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const secretKey = process.env.NEXT_TOSS_SECRET_KEY

  const encryptedSecretKey =
    "Basic " + Buffer.from(secretKey + ":").toString("base64")

  try {
    const body = await request.json()

    const { paymentKey, orderId, amount } = body

    const response = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: encryptedSecretKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          amount: amount,
          paymentKey: paymentKey,
        }),
      },
    )

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status })
    }

    return NextResponse.json(result, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { message: `Toss Confirm Error: ${error}` },
      { status: 500 },
    )
  }
}
