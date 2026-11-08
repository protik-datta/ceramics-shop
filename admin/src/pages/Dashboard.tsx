import { Link } from 'react-router-dom';
import { useOrders, useStats } from '../hooks/useAdmin';
import { fmtDate, taka } from '../lib/format';
import { Empty, ErrorBox, Skeleton, StatusBadge } from '../components/ui';

const empty = { page: 1, search: '', status: '', from: '', to: '' };

export default function Dashboard() {
  const stats = useStats();
  const orders = useOrders(empty, 10);
  const s = stats.data;
  const cards = [
    ['Total orders', s?.total, 'text-gray-900'],
    ['Pending', s?.pending, 'text-amber-600'],
    ['Confirmed', s?.confirmed, 'text-green-600'],
    ['Cancelled', s?.cancelled, 'text-red-600'],
    ['Confirmed revenue', s && taka(s.revenue), 'text-gray-900'],
    ['Advance collected', s && taka(s.advance), 'text-gray-900'],
    ['Orders today', s?.today, 'text-brand'],
  ] as const;

  return (
    <>
      <h1 className="text-2xl font-extrabold">Dashboard</h1>
      {stats.isError && <ErrorBox message={(stats.error as Error).message} onRetry={() => stats.refetch()} />}
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(([label, value, color]) => (
          <div key={label} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
            {stats.isLoading ? <div className="mt-2 h-8 w-20 animate-pulse rounded bg-gray-200" /> : <p className={`mt-1 text-2xl font-extrabold ${color}`}>{value ?? 0}</p>}
          </div>
        ))}
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-bold">Latest orders</h2>
          <Link to="/orders" className="text-sm font-semibold text-brand">View all</Link>
        </div>
        {orders.isLoading && <Skeleton />}
        {orders.isError && <ErrorBox message={(orders.error as Error).message} onRetry={() => orders.refetch()} />}
        {orders.data && !orders.data.data.length && <Empty text="No orders yet" />}
        {!!orders.data?.data.length && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-3">Date</th><th className="p-3">Customer</th><th className="p-3">Product</th><th className="p-3">Total</th><th className="p-3">Status</th></tr></thead>
              <tbody>
                {orders.data.data.map((o) => (
                  <tr key={o._id} className="border-t">
                    <td className="p-3 whitespace-nowrap">{fmtDate(o.createdAt)}</td>
                    <td className="p-3"><div className="font-semibold">{o.customer.name}</div><div className="text-xs text-gray-500">{o.customer.phone}</div></td>
                    <td className="p-3">{o.productName}</td>
                    <td className="p-3">{taka(o.total)}</td>
                    <td className="p-3"><StatusBadge s={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
