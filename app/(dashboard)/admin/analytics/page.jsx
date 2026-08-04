import { Eye, ShoppingCart, Heart, ShoppingBag, TrendingUp, IndianRupee, TrendingDown } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 0;

export default async function ProductAnalytics() {
  const supabase = createAdminClient();

  const { data: products } = await supabase
    .from('products')
    .select('id, title, base_price, view_count, cart_count, wishlist_count, purchase_count, stock_quantity')
    .eq('is_active', true);

  const productList = products || [];

  let totalViews = 0;
  let totalCart = 0;
  let totalWishlist = 0;
  let totalPurchases = 0;
  let totalRevenue = 0;

  productList.forEach(p => {
    totalViews += (p.view_count || 0);
    totalCart += (p.cart_count || 0);
    totalWishlist += (p.wishlist_count || 0);
    
    const purchases = (p.purchase_count || 0);
    totalPurchases += purchases;
    totalRevenue += purchases * (p.base_price || 0);
  });

  const conversionRate = totalViews > 0 ? ((totalPurchases / totalViews) * 100).toFixed(2) : "0.00";

  const STATS = [
    { id: 1, label: "Total Views", value: totalViews.toLocaleString('en-IN'), icon: Eye, color: "text-blue-500", bg: "bg-blue-100" },
    { id: 2, label: "Add to Cart", value: totalCart.toLocaleString('en-IN'), icon: ShoppingCart, color: "text-orange-500", bg: "bg-orange-100" },
    { id: 3, label: "Wishlist", value: totalWishlist.toLocaleString('en-IN'), icon: Heart, color: "text-pink-500", bg: "bg-pink-100" },
    { id: 4, label: "Total Purchases", value: totalPurchases.toLocaleString('en-IN'), icon: ShoppingBag, color: "text-green-500", bg: "bg-green-100" },
    { id: 5, label: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-100" },
    { id: 6, label: "Total Revenue", value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-100" },
  ];

  const bestSelling = [...productList]
    .sort((a, b) => (b.purchase_count || 0) - (a.purchase_count || 0))
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      name: p.title,
      sales: p.purchase_count || 0,
      revenue: (p.purchase_count || 0) * (p.base_price || 0),
      stock: p.stock_quantity || 0
    }));

  const lowPerforming = [...productList]
    .filter(p => (p.view_count || 0) > 0)
    .sort((a, b) => {
      const convA = (a.purchase_count || 0) / (a.view_count || 1);
      const convB = (b.purchase_count || 0) / (b.view_count || 1);
      return convA - convB; 
    })
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      name: p.title,
      views: p.view_count || 0,
      sales: p.purchase_count || 0,
      conversion: (((p.purchase_count || 0) / (p.view_count || 1)) * 100).toFixed(2) + "%",
      stock: p.stock_quantity || 0
    }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-[1320px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 uppercase tracking-wide">Product Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm flex items-center gap-5 transition-transform hover:-translate-y-1 duration-300">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${stat.bg}`}>
                  <Icon size={26} className={stat.color} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-500 mb-1 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-[16px] font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                <TrendingUp className="text-green-500" size={22} strokeWidth={2.5} />
                Best Selling Products
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-gray-400 text-[11px] uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5 font-bold">Product Name</th>
                    <th className="p-5 font-bold">Total Sales</th>
                    <th className="p-5 font-bold">Revenue</th>
                    <th className="p-5 font-bold">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bestSelling.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-5 text-[14px] font-bold text-gray-900">{item.name}</td>
                      <td className="p-5 text-[14px] font-bold text-gray-600">{item.sales}</td>
                      <td className="p-5 text-[14px] font-black text-green-600">₹{item.revenue.toLocaleString('en-IN')}</td>
                      <td className="p-5 text-[13px] font-bold text-gray-500">
                        <span className="px-2.5 py-1 bg-gray-100 rounded-full">{item.stock} left</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-[16px] font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                <TrendingDown className="text-red-500" size={22} strokeWidth={2.5} />
                Low Performing Products
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-gray-400 text-[11px] uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5 font-bold">Product Name</th>
                    <th className="p-5 font-bold">Views</th>
                    <th className="p-5 font-bold">Conv. Rate</th>
                    <th className="p-5 font-bold">Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {lowPerforming.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-5 text-[14px] font-bold text-gray-900">{item.name}</td>
                      <td className="p-5 text-[14px] font-bold text-gray-600">{item.views}</td>
                      <td className="p-5 text-[14px] font-black text-red-500">{item.conversion}</td>
                      <td className="p-5 text-[14px] font-bold text-gray-600">{item.sales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}