import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Eye, Search, Trash2 } from 'lucide-react';
import { exportOrdersCsv, useDeleteOrder, useOrders, useUpdateOrder, type OrderFilters } from '../hooks/useAdmin';
import { fmtDate, taka } from '../lib/format';
import type { Order, Status } from '../lib/types';
import { btnGhost, btnPrimary, Empty, ErrorBox, inputCls, Modal, Skeleton, StatusBadge } from '../components/ui';
import { useToast } from '../components/Toast';

const base: OrderFilters = { page: 1, search: '', status: '', from: '', to: '' };

export default function Orders() {
  const toast = useToast();
  const [f, setF] = useState<OrderFilters>(base);
  const [searchInput, setSearchInput] = useState('');
  const [view, setView] = useState<Order | null>(null);
  const [del, setDel] = useState<Order | null>(null);
  const [exporting, setExporting] = useState(false);
  const q = useOrders(f);
  const update = useUpdateOrder();
  const remove = useDeleteOrder();
  const set = (p: Partial<OrderFilters>) => setF((s) => ({ ...s, page: 1, ...p }));

  const changeStatus = (o: Order, status: Status) =>
    update.mutate({ id: o._id, status }, {
      onSuccess: () => { toast('Status updated'); setView((v) => (v && v._id === o._id ? { ...v, status } : v)); },
      onError: (e) => toast(e.message, false),
    });

  const doExport = async () => {
    setExporting(true);
    try { await exportOrdersCsv({ search: f.search, status: f.status, from: f.from, to: f.to }); }
    catch (e) { toast((e as Error).message, false); }
    setExporting(false);
  };

  const rows = q.data?.data ?? [];
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Orders</h1>
        <button onClick={doExport} disabled={exporting} className={btnGhost}><Download className="h-4 w-4" /> {exporting ? 'Exporting...' : 'Export CSV'}</button>
      </div>

      <form className="mt-5 grid gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5" onSubmit={(e) => { e.preventDefault(); set({ search: searchInput.trim() }); }}>
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input aria-label="Search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search name, phone or product" className={`${inputCls} pl-9`} />
        </div>
        <select aria-label="Status" value={f.status} onChange={(e) => set({ status: e.target.value })} className={inputCls}>
          <option value="">All statuses</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option>
        </select>
        <input aria-label="From date" type="date" value={f.from} onChange={(e) => set({ from: e.target.value })} className={inputCls} />
        <input aria-label="To date" type="date" value={f.to} onChange={(e) => set({ to: e.target.value })} className={inputCls} />
        <div className="flex gap-2 sm:col-span-2 lg:col-span-5">
          <button type="submit" className={btnPrimary}>Search</button>
          <button type="button" className={btnGhost} onClick={() => { setSearchInput(''); setF(base); }}>Reset</button>
        </div>
      </form>

      <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
        {q.isLoading && <Skeleton />}
        {q.isError && <ErrorBox message={(q.error as Error).message} onRetry={() => q.refetch()} />}
        {q.data && !rows.length && <Empty text="No orders match your filters" />}
        {!!rows.length && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr><th className="p-3">Date</th><th className="p-3">Customer</th><th className="p-3">Product</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o._id} className="border-t">
                    <td className="whitespace-nowrap p-3">{fmtDate(o.createdAt)}</td>
                    <td className="p-3"><div className="font-semibold">{o.customer.name}</div><div className="text-xs text-gray-500">{o.customer.phone}</div></td>
                    <td className="p-3">{o.productName}</td>
                    <td className="p-3">{taka(o.total)}</td>
                    <td className="p-3">
                      <select aria-label="Change status" value={o.status} disabled={update.isPending} onChange={(e) => changeStatus(o, e.target.value as Status)} className="h-8 rounded-lg border border-gray-300 bg-white px-2 text-xs font-semibold capitalize">
                        <option value="pending">pending</option><option value="confirmed">confirmed</option><option value="cancelled">cancelled</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setView(o)} aria-label="View details" className="rounded p-2 hover:bg-gray-100"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => setDel(o)} aria-label="Delete order" className="rounded p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {q.data && (
          <div className="flex items-center justify-between border-t p-3 text-sm">
            <span className="text-gray-500">{q.data.total} orders</span>
            <div className="flex items-center gap-2">
              <button disabled={f.page <= 1} onClick={() => setF((s) => ({ ...s, page: s.page - 1 }))} aria-label="Previous page" className={`${btnGhost} !px-2`}><ChevronLeft className="h-4 w-4" /></button>
              <span>Page {q.data.page} of {q.data.pages}</span>
              <button disabled={f.page >= q.data.pages} onClick={() => setF((s) => ({ ...s, page: s.page + 1 }))} aria-label="Next page" className={`${btnGhost} !px-2`}><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </div>

      {view && (
        <Modal title="Order details" onClose={() => setView(null)}>
          <dl className="space-y-3 text-sm">
            {([
              ['Order ID', view._id], ['Date', fmtDate(view.createdAt)], ['Product', view.productName], ['Name', view.customer.name],
              ['Phone', view.customer.phone], ['Address', view.customer.address], ['Total', taka(view.total)],
              ['Advance', taka(view.advance)], ['Remaining', taka(view.remaining)],
            ] as const).map(([k, v]) => (
              <div key={k} className="flex gap-3"><dt className="w-24 shrink-0 font-semibold text-gray-500">{k}</dt><dd className="break-words">{v}</dd></div>
            ))}
            <div className="flex items-center gap-3"><dt className="w-24 shrink-0 font-semibold text-gray-500">Status</dt><dd><StatusBadge s={view.status} /></dd></div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-2">
            {(['pending', 'confirmed', 'cancelled'] as Status[]).map((s) => (
              <button key={s} disabled={view.status === s || update.isPending} onClick={() => changeStatus(view, s)} className={`${btnGhost} capitalize`}>Mark {s}</button>
            ))}
          </div>
        </Modal>
      )}

      {del && (
        <Modal title="Delete order?" onClose={() => setDel(null)}>
          <p className="text-sm text-gray-600">This permanently deletes the order from <b>{del.customer.name}</b>. This cannot be undone.</p>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={() => setDel(null)} className={btnGhost}>Cancel</button>
            <button
              disabled={remove.isPending}
              onClick={() => remove.mutate(del._id, { onSuccess: () => { toast('Order deleted'); setDel(null); }, onError: (e) => toast(e.message, false) })}
              className={`${btnPrimary}`}
            >
              {remove.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
