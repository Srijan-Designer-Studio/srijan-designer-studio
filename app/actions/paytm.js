'use server'

import PaytmChecksum from 'paytmchecksum'

export async function initiatePaytmTransaction(orderId, amount, customerId) {
  try {
    const paytmParams = {}

    paytmParams.body = {
      "requestType": "Payment",
      "mid": process.env.NEXT_PUBLIC_PAYTM_MID,
      "websiteName": process.env.NEXT_PUBLIC_PAYTM_WEBSITE,
      "orderId": orderId,
      "callbackUrl": `${process.env.NEXT_PUBLIC_SITE_URL}/api/paytm-callback`,
      "txnAmount": {
        "value": Number(amount).toFixed(2).toString(),
        "currency": "INR",
      },
      "userInfo": {
        "custId": customerId,
      },
    }

    const checksum = await PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANT_KEY)

    paytmParams.head = {
      "signature": checksum
    }

    const isProduction = process.env.NODE_ENV === 'production'
    const hostname = isProduction ? 'securegw.paytm.in' : 'securegw-stage.paytm.in'

    const post_data = JSON.stringify(paytmParams)

    const response = await fetch(`https://${hostname}/theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTM_MID}&orderId=${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': post_data.length.toString()
      },
      body: post_data
    })

    const data = await response.json()
    return { success: true, data: data.body }
  } catch (error) {
    return { success: false, error: error.message }
  }
}