export async function getShiprocketToken() {
  const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error("Shiprocket Authentication Failed");
  }

  const data = await response.json();
  return data.token;
}

export async function checkServiceability(pickupPincode, deliveryPincode, weight, cod = 0) {
  const token = await getShiprocketToken();
  const response = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=${cod}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });
  
  const data = await response.json();
  return data;
}

export async function createShiprocketOrder(orderDetails) {
  const token = await getShiprocketToken();
  const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderDetails),
  });
  
  const data = await response.json();
  return data;
}

export async function generateAWB(shipmentId) {
  const token = await getShiprocketToken();
  const response = await fetch("https://apiv2.shiprocket.in/v1/external/courier/assign/awb", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      shipment_id: shipmentId
    }),
  });
  
  const data = await response.json();
  return data;
}

export async function scheduleShiprocketPickup(shipmentId) {
  const token = await getShiprocketToken();
  const response = await fetch("https://apiv2.shiprocket.in/v1/external/courier/generate/pickup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      shipment_id: [shipmentId]
    }),
  });
  
  const data = await response.json();
  return data;
}

export async function getShiprocketLabel(shipmentId) {
  const token = await getShiprocketToken();
  const response = await fetch("https://apiv2.shiprocket.in/v1/external/courier/generate/label", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      shipment_id: [shipmentId]
    }),
  });
  
  const data = await response.json();
  return data;
}

export async function getShiprocketInvoice(orderId) {
  const token = await getShiprocketToken();
  const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/print/invoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ids: [orderId]
    }),
  });
  
  const data = await response.json();
  return data;
}

export async function trackShiprocketOrder(awbCode) {
  const token = await getShiprocketToken();
  const response = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbCode}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  
  const data = await response.json();
  return data;
}

export async function cancelShiprocketOrder(awbs) {
  const token = await getShiprocketToken();
  const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/cancel/awb", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ awbs }),
  });
  
  const data = await response.json();
  return data;
}

export async function createShiprocketReturn(returnDetails) {
  const token = await getShiprocketToken();
  const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/return", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(returnDetails),
  });
  
  const data = await response.json();
  return data;
}

export async function takeNDRAction(awb, action) {
  const token = await getShiprocketToken();
  const response = await fetch("https://apiv2.shiprocket.in/v1/external/ndr/action", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
       awb: awb,
       action: action 
    }),
  });
  
  const data = await response.json();
  return data;
}