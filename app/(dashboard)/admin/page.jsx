export const dynamic = 'force-dynamic';
import AdminDashboardClient from "./AdminDashboardClient";
import { getDashboardStats } from "@/app/actions/admin";

export const metadata = {
  title: "Admin Dashboard | SRIJAN Fashion",
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  
  return <AdminDashboardClient initialStats={stats} />;
}
