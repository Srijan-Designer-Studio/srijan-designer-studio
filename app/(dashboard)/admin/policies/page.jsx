export const dynamic = 'force-dynamic';

import { getAllPolicies } from '@/app/actions/policies';
import PoliciesClient from './PoliciesClient';

export const metadata = {
  title: 'Manage Policies | Admin Dashboard',
};

export default async function AdminPoliciesPage() {
  const policies = await getAllPolicies();

  return (
    <PoliciesClient initialPolicies={policies} />
  );
}