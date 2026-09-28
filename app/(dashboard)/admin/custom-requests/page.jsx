import { createAdminClient } from '@/lib/supabase/admin'
import CustomRequestsClient from './CustomRequestsClient'

export const metadata = {
  title: "Custom Wear Requests | Admin",
};

export default async function CustomRequestsPage() {
  const supabase = createAdminClient()

  const { data: requests, error } = await supabase
    .from('custom_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-8 text-red-500 font-bold">Error fetching data: {error.message}</div>
  }

  return <CustomRequestsClient requests={requests || []} />
}