"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, ChevronLeft, Loader2, Truck, CheckCircle2, XCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder, deleteFailedOrder } from "@/app/actions/orders";
import { getUserAddresses } from "@/app/actions/addresses";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/app/actions/razorpay";
import { createClient } from "@/lib/supabase/client";
import ScrollToTop from "@/components/providers/ScrollToTop";
import PaymentNotification from "@/components/ui/PaymentNotification";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, isLoaded, clearCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false); 
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("new");

  const [mode, setMode] = useState(null);
  const [buyNowItem, setBuyNowItem] = useState(null);
  const [isPageInitialized, setIsPageInitialized] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const currentMode = searchParams.get('mode');
    setMode(currentMode);

    if (currentMode === 'buynow') {
      const itemStr = sessionStorage.getItem('buyNowItem');
      if (itemStr) {
        setBuyNowItem(JSON.parse(itemStr));
      } else {
        router.push('/cart');
      }
    }
    setIsPageInitialized(true);
  }, [router]);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      } else {
        setUserProfile(user);
        const userAddrs = await getUserAddresses();
        setAddresses(userAddrs || []);
        if (userAddrs && userAddrs.length > 0) {
          const defaultAddr = userAddrs.find(a => a.is_default) || userAddrs[0];
          setSelectedAddressId(defaultAddr.id);
        }
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (mode === 'buynow') return; 
    if (isLoaded && cartItems.length === 0 && !isAuthChecking && !isSuccess) {
      router.push("/cart");
    }
  }, [isLoaded, cartItems, router, isAuthChecking, isSuccess, mode]);

  const activeItems = mode === 'buynow' && buyNowItem ? [buyNowItem] : cartItems;
  const activeSubtotal = mode === 'buynow' && buyNowItem ? (buyNowItem.price * buyNowItem.quantity) : subtotal;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const clearBackendCart = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('cart_items').delete().eq('user_id', user.id);
      }
      clearCart();
    } catch (err) {
    }
  };

  if (!isPageInitialized || isAuthChecking || !isLoaded || (mode !== 'buynow' && cartItems.length === 0 && !isSuccess)) {
    return (
      <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-[#00c3ff]" />
      </div>
    );
  }

  const frontendTotal = activeSubtotal;

  const handleCheckout = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setErrorMsg("");
    setShowErrorPopup(false);

    startTransition(async () => {
      let createdOrderId = null; 

      try {
        const selectedAddr = addresses.find(a => a.id === selectedAddressId);
        
        const finalAddress = selectedAddr ? {
          phone: formData.get('phone'),
          addressLine1: selectedAddr.address_line_1,
          addressLine2: selectedAddr.address_line_2 || '',
          city: selectedAddr.city,
          state: selectedAddr.state,
          zip: selectedAddr.postal_code,
          cart_meta: activeItems.map(i => ({ id: i.variantId || i.id, size: i.size || 'N/A' }))
        } : {
          phone: formData.get('phone'),
          addressLine1: formData.get('address1'),
          addressLine2: formData.get('address2') || '',
          city: formData.get('city'),
          state: formData.get('state'),
          zip: formData.get('zip'),
          cart_meta: activeItems.map(i => ({ id: i.variantId || i.id, size: i.size || 'N/A' }))
        };

        const orderPayload = {
          totalAmount: frontendTotal,
          paymentMethod: "online",
          customer_phone: formData.get('phone'),
          address: finalAddress,
          items: activeItems.map(item => ({
            variantId: item.variantId || item.id,
            quantity: item.quantity,
            unitPrice: item.price
          }))
        };

        const dbResult = await createOrder({
          ...orderPayload,
          paymentStatus: 'Pending',
          status: 'pending'
        });

        if (!dbResult.success) {
          throw new Error(dbResult.error || "Failed to create order");
        }

        createdOrderId = dbResult.orderId || dbResult.id || dbResult.order?.id;

        const res = await loadRazorpayScript();
        if (!res) {
          throw new Error("Failed to load Razorpay SDK. Please check your internet connection.");
        }

        const rzpOrder = await createRazorpayOrder(frontendTotal, createdOrderId);
        
        if (!rzpOrder.success) {
          throw new Error(rzpOrder.error);
        }

        await new Promise((resolve, reject) => {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: rzpOrder.order.amount,
            currency: rzpOrder.order.currency,
            name: "SRIJAN Fashion",
            image: `${window.location.origin}/email-img/logo.webp`,
            description: "Order Payment",
            order_id: rzpOrder.order.id,
            prefill: {
              contact: formData.get('phone'),
              email: userProfile?.email || "",
            },
            theme: {
              color: "#00c3ff",
            },
            handler: async function (response) {
              const verifyResult = await verifyRazorpayPayment(
                response.razorpay_payment_id,
                response.razorpay_order_id,
                response.razorpay_signature,
                createdOrderId
              );
              
              if (verifyResult.success) {
                if (mode === 'buynow') {
                  sessionStorage.removeItem('buyNowItem');
                } else {
                  await clearBackendCart();
                }
                setIsSuccess(true); 
                setTimeout(() => {
                  router.push("/success");
                }, 2500);
                resolve();
              } else {
                reject(new Error(verifyResult.error || "Payment verification failed"));
              }
            },
            modal: {
              ondismiss: function () {
                reject(new Error("Your payment didn't go through as it was declined or cancelled. Try another payment method or contact your bank."));
              }
            }
          };

          const paymentObject = new window.Razorpay(options);
          paymentObject.on('payment.failed', function (response) {
            reject(new Error("Your payment didn't go through as it was declined by the bank. Try another payment method or contact your bank."));
          });
          paymentObject.open();
        });

      } catch (error) {
        if (createdOrderId) {
          await deleteFailedOrder(createdOrderId);
        }
        setErrorMsg(error.message || "Failed to process checkout. Please try again.");
        setShowErrorPopup(true);
      }
    });
  };

  return (
    <>
      {isSuccess && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-md w-full animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={50} className="text-green-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Order Successful!</h2>
            <p className="text-gray-600 mb-8 font-medium">Thank you for shopping with us. Your order has been placed successfully.</p>
            <div className="flex items-center gap-2 text-[#00c3ff] font-bold">
              <Loader2 size={18} className="animate-spin" />
              <span>Redirecting...</span>
            </div>
          </div>
        </div>
      )}

      {showErrorPopup && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm w-full animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5">
              <XCircle size={40} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-8 text-[15px] leading-relaxed">{errorMsg}</p>
            <button 
              onClick={() => setShowErrorPopup(false)}
              className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-[#f4f5f7] py-12 md:py-20 font-sans pt-[100px] lg:pt-[120px]">
        <ScrollToTop />
        <PaymentNotification />
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="mb-8">
            <Link href="/cart" className="inline-flex items-center text-gray-500 hover:text-black transition-colors font-medium text-sm">
              <ChevronLeft size={18} className="mr-1" /> Back to Cart
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 tracking-tight">Checkout</h1>
          </div>

          <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                  <input required name="phone" type="tel" pattern="[0-9]{10}" title="Please enter a valid 10-digit mobile number" placeholder="e.g. 9876543210" className="w-full border text-black border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>

                {addresses.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Delivery Address</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map(addr => (
                        <div 
                          key={addr.id} 
                          onClick={() => setSelectedAddressId(addr.id)} 
                          className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${selectedAddressId === addr.id ? 'border-[#00c3ff] bg-[#00c3ff]/5' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-gray-900 capitalize">{addr.title}</span>
                            {addr.is_default && <span className="bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded-full">Default</span>}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {addr.address_line_1}<br/>
                            {addr.address_line_2 && <>{addr.address_line_2}<br/></>}
                            {addr.city}, {addr.state} {addr.postal_code}
                          </p>
                        </div>
                      ))}
                      <div 
                        onClick={() => setSelectedAddressId("new")} 
                        className={`cursor-pointer border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-all min-h-[120px] ${selectedAddressId === "new" ? 'border-[#00c3ff] bg-[#00c3ff]/5 text-[#00c3ff]' : 'border-gray-300 hover:border-gray-400 text-gray-500'}`}
                      >
                        <span className="text-2xl mb-1">+</span>
                        <span className="font-medium text-sm">Add New Address</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedAddressId === "new" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
                      <input required name="address1" type="text" placeholder="House number and street name" className="w-full border text-black border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Apartment, suite, unit, etc. *</label>
                      <input name="address2" type="text" required placeholder="Apartment, suite, unit, etc." className="w-full text-black border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Town / City *</label>
                      <input required name="city" type="text" className="w-full border text-black border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                      <input required name="state" type="text" className="w-full border text-black border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Postcode / ZIP *</label>
                      <input required name="zip" type="text" className="w-full border text-black border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Truck className="text-green-600" size={24} />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <label className="flex flex-col p-5 border rounded-xl cursor-default transition-all border-[#00c3ff] bg-[#00c3ff]/5">
                    <div className="flex items-center mb-2">
                      <input type="radio" name="payment" value="online" checked readOnly className="w-4 h-4 text-[#00c3ff] focus:ring-[#00c3ff] border-gray-300" />
                      <CreditCard className="ml-4 mr-3 text-[#00c3ff]" size={24} />
                      <span className="font-bold text-gray-900 text-lg">Online Payment</span>
                    </div>
                    <p className="ml-11 text-sm text-gray-600 font-medium">
                      Pay securely via UPI, Credit/Debit Card, Netbanking, etc.
                    </p>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h2>

                <div className="space-y-5 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {activeItems.map((item, idx) => {
                    const itemPrice = Number(item.price || 0);
                    const itemBasePrice = Number(item.basePrice || item.originalPrice || item.base_price || 0);
                    const qty = Number(item.quantity || 1);

                    return (
                      <div key={idx} className="flex gap-4">
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                          <img
                            src={item.image || "/images/placeholder.jpg"}
                            alt={item.title}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1">{item.title}</h3>
                          <p className="text-[13px] text-gray-500 mb-1">Qty: {qty} | Size: {item.size}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-[15px] font-extrabold text-black">₹{(itemPrice * qty).toLocaleString('en-IN')}</p>
                            {itemBasePrice > itemPrice && (
                              <p className="text-[13px] font-medium text-gray-400 line-through">
                                ₹{(itemBasePrice * qty).toLocaleString('en-IN')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-5 mb-5">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">₹{activeSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-5 mb-8">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-[#0ba6ff]">
                    ₹{frontendTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <button disabled={isPending || isSuccess} type="submit" className="w-full flex items-center justify-center gap-2 text-white font-bold text-[15px] py-4 rounded-xl transition-all shadow-lg shadow-[#00c3ff]/30 uppercase tracking-wide disabled:opacity-70 cursor-pointer bg-[#00c3ff] hover:bg-[#00baef]">
                  {isPending && <Loader2 size={18} className="animate-spin" />}
                  {(isPending || isSuccess) ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}