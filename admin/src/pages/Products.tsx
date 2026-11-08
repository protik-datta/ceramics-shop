import { useState, type FormEvent } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { useAdminProducts, useSaveProduct } from '../hooks/useAdmin';
import { taka } from '../lib/format';
import type { Product } from '../lib/types';
import { btnGhost, btnPrimary, Empty, ErrorBox, inputCls, Modal, Skeleton } from '../components/ui';
import { useToast } from '../components/Toast';
import { ApiRequestError } from '../lib/api';

type Form = { name: string; description: string; price: string; originalPrice: string; advance: string; image: string; badge: string; order: string; active: boolean };

const blank: Form = { name: '', description: '304 pcs ডিনার সেট + 13 pcs কুকিং সেট', price: '3500', originalPrice: '5500', advance: '350', image: '', badge: '🎁 কম্বো', order: '', active: true };
const toForm = (p: Product): Form => ({ name: p.name, description: p.description, price: String(p.price), originalPrice: String(p.originalPrice), advance: String(p.advance), image: p.image, badge: p.badge, order: String(p.order), active: p.active });

function ProductForm({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const toast = useToast();
  const save = useSaveProduct();
  const [f, setF] = useState<Form>(product ? toForm(product) : blank);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof Form, v: string | boolean) => { setF((s) => ({ ...s, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })); };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const body = {
      name: f.name, description: f.description, image: f.image, badge: f.badge, active: f.active,
      price: Number(f.price), originalPrice: Number(f.originalPrice), advance: Number(f.advance),
      ...(f.order !== '' ? { order: Number(f.order) } : {}),
    };
    save.mutate({ id: product?._id, body }, {
      onSuccess: () => { toast(product ? 'Product updated' : 'Product added'); onClose(); },
      onError: (err) => { const ae = err as ApiRequestError; setErrors(ae.fieldErrors || {}); toast(ae.message, false); },
    });
  };

  const field = (k: keyof Form, label: string, type = 'text') => (
    <div>
      <label htmlFor={k} className="text-sm font-semibold">{label}</label>
      <input id={k} type={type} value={String(f[k])} onChange={(e) => set(k, e.target.value)} className={`mt-1 ${inputCls} ${errors[k] ? 'border-red-500' : ''}`} />
      {errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>}
    </div>
  );

  return (
    <Modal title={product ? 'Edit product' : 'Add product'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        {field('name', 'Name')}
        {field('description', 'Description')}
        <div className="grid grid-cols-3 gap-3">{field('price', 'Price', 'number')}{field('originalPrice', 'Original', 'number')}{field('advance', 'Advance', 'number')}</div>
        {field('image', 'Image URL')}
        {f.image && <img src={f.image} alt="Preview" className="h-28 w-28 rounded-lg border object-cover" onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0.2')} />}
        <div className="grid grid-cols-2 gap-3">{field('badge', 'Badge')}{field('order', 'Sort order', 'number')}</div>
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={f.active} onChange={(e) => set('active', e.target.checked)} /> Active (visible on site)</label>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
          <button type="submit" disabled={save.isPending} className={btnPrimary}>{save.isPending ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function Products() {
  const toast = useToast();
  const q = useAdminProducts();
  const save = useSaveProduct();
  const [editing, setEditing] = useState<Product | null | 'new'>(null);

  const toggle = (p: Product) =>
    save.mutate({ id: p._id, body: { active: !p.active } }, {
      onSuccess: () => toast(p.active ? 'Product hidden' : 'Product activated'),
      onError: (e) => toast(e.message, false),
    });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Products</h1>
        <button onClick={() => setEditing('new')} className={btnPrimary}><Plus className="h-4 w-4" /> Add product</button>
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
        {q.isLoading && <Skeleton />}
        {q.isError && <ErrorBox message={(q.error as Error).message} onRetry={() => q.refetch()} />}
        {q.data && !q.data.length && <Empty text="No products yet" />}
        {!!q.data?.length && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-3">Product</th><th className="p-3">Price</th><th className="p-3">Advance</th><th className="p-3">Order</th><th className="p-3">Active</th><th className="p-3 text-right">Edit</th></tr></thead>
              <tbody>
                {q.data.map((p) => (
                  <tr key={p._id} className={`border-t ${p.active ? '' : 'opacity-60'}`}>
                    <td className="p-3"><div className="flex items-center gap-3"><img src={p.image} alt="" loading="lazy" className="h-12 w-12 rounded-lg object-cover" /><span className="font-semibold">{p.name}</span></div></td>
                    <td className="p-3">{taka(p.price)} <span className="text-xs text-gray-400 line-through">{taka(p.originalPrice)}</span></td>
                    <td className="p-3">{taka(p.advance)}</td>
                    <td className="p-3">{p.order}</td>
                    <td className="p-3">
                      <button role="switch" aria-checked={p.active} aria-label={`Toggle ${p.name}`} disabled={save.isPending} onClick={() => toggle(p)} className={`h-6 w-11 rounded-full p-0.5 transition ${p.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <span className={`block h-5 w-5 rounded-full bg-white transition ${p.active ? 'translate-x-5' : ''}`} />
                      </button>
                    </td>
                    <td className="p-3 text-right"><button onClick={() => setEditing(p)} aria-label="Edit" className="rounded p-2 hover:bg-gray-100"><Pencil className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {editing && <ProductForm product={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}
    </>
  );
}
