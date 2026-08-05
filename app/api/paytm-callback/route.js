import { NextResponse } from 'next/server';
import PaytmChecksum from 'paytmchecksum';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);

    const paytmChecksum = body.CHECKSUMHASH;
    delete body.CHECKSUMHASH;

    const isVerifySignature = PaytmChecksum.verifySignature(body, process.env.PAYTM_MERCHANT_KEY, paytmChecksum);

    if (isVerifySignature) {
      const supabase = createAdminClient();
      const orderId = body.ORDERID;

      if (body.STATUS === 'TXN_SUCCESS') {
        await supabase
          .from('orders')
          .update({
            payment_status: 'Paid',
            status: 'processing',
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/account/orders?status=success`, 303);
      } else {
        await supabase
          .from('orders')
          .update({
            payment_status: 'Failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/checkout?status=failed`, 303);
      }
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/checkout?status=checksum_failed`, 303);
    }
  } catch (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/checkout?status=error`, 303);
  }
}