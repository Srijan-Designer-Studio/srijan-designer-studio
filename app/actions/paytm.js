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
      }
    }
    
    console.log("Paytm Payload Check:", paytmParams.body);
    console.log("Key Check:", process.env.PAYTM_MERCHANT_KEY);

    const checksum = await PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANT_KEY)

    paytmParams.head = {
      "signature": checksum
    }

    const hostname = 'securegw.paytm.in'
    console.log("Paytm URL:", hostname);

    const post_data = JSON.stringify(paytmParams);
    console.log("FINAL POSTMAN DATA:", post_data);

    const response = await fetch(`https://${hostname}/theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTM_MID}&orderId=${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': post_data.length.toString()
      },
      body: post_data
    })

    const textResponse = await response.text()
    console.log("Paytm Raw Response:", textResponse); 
    
    let data;
    try {
      data = JSON.parse(textResponse)
    } catch (e) {
      return { success: false, error: "Paytm server is temporarily down or returned invalid data." }
    }

    if (data.body && data.body.resultInfo && data.body.resultInfo.resultStatus === "F") {
      return { success: false, error: data.body.resultInfo.resultMsg || "Payment failed at Paytm Gateway" }
    }

    return { success: true, data: data.body }
  } catch (error) {
    return { success: false, error: error.message }
  }
}