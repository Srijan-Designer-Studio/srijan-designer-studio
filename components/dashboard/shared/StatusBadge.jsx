export default function StatusBadge({ status }) {
  // Normalize the status string to lowercase for matching
  const normalizedStatus = status?.toLowerCase() || '';

  // Define color mappings for different statuses
  const styles = {
    completed: 'bg-green-100 text-green-800',
    delivered: 'bg-green-100 text-green-800',
    active: 'bg-green-100 text-green-800',
    
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-yellow-100 text-yellow-800',
    
    shipped: 'bg-blue-100 text-blue-800',
    
    cancelled: 'bg-red-100 text-red-800',
    failed: 'bg-red-100 text-red-800',
    inactive: 'bg-gray-100 text-gray-600',
  };

  // Fallback to gray if the status isn't in our list
  const badgeStyle = styles[normalizedStatus] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize tracking-wide ${badgeStyle}`}>
      {status}
    </span>
  );
}