import type { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import { taka } from '../lib/format';

function Skeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white" aria-hidden>
      <div className="aspect-square animate-pulse bg-gray-200" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-9 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

function Card({ p, onOrder, index }: { p: Product; onOrder: (p: Product) => void; index: number }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-square bg-gray-100">
        <img
          src={p.image}
          alt={`${p.name} — ৩০৪ পিস ডিনার সেট + ১৩ পিস কুকিং সেট`}
          width={272}
          height={272}
          loading={index < 4 ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover"
        />
        <span className="absolute left-2 top-2 rounded-full bg-blue-500 px-2.5 py-[3px] text-xs font-bold text-white">{p.badge}</span>
        <img
          src="/products/cooking-set.jpg"
          alt=""
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="absolute bottom-2 right-2 h-14 w-14 rounded-lg border-2 border-white object-cover shadow"
        />
      </div>
      <div className="p-4">
        <h3 className="text-[17px] font-bold leading-snug text-gray-900">{p.name}</h3>
        <p className="mt-1 text-[14px] text-gray-600">✅ {p.description}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[22px] font-extrabold text-blue-500">{taka(p.price)}</span>
          <span className="text-[14px] text-gray-500 line-through">{taka(p.originalPrice)}</span>
        </div>
        <button
          type="button"
          onClick={() => onOrder(p)}
          className="mt-3 h-9 w-full rounded-lg bg-blue-500 text-[15px] font-bold text-white transition-colors hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          🛒 অর্ডার করুন
        </button>
      </div>
    </article>
  );
}

export default function ProductGrid({ onOrder }: { onOrder: (p: Product) => void }) {
  const { data, isLoading, isError, error, refetch, isFetching } = useProducts();
  return (
    <section id="products" className="bg-page px-4 pb-[60px] pt-[60px]">
      <div className="mx-auto max-w-[1166px]">
        <div className="text-center">
          <h2 className="text-[28px] font-extrabold text-gray-900 sm:text-[34px]">🎁 কম্বো প্যাকেজ — ডিজাইন বেছে নিন</h2>
          <p className="mt-2 text-[16px] text-gray-600">প্রতিটি প্যাকেজে আছে: 304 pcs ডিনার সেট + 13 pcs কুকিং সেট</p>
          <p className="mt-3 text-[18px] font-bold text-blue-500">সব কম্বো মাত্র ৳3,500!</p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-[26px] min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading && Array.from({ length: 8 }, (_, i) => <Skeleton key={i} />)}
          {data?.map((p, i) => <Card key={p._id} p={p} index={i} onOrder={onOrder} />)}
        </div>
        {isError && (
          <div role="alert" className="mx-auto mt-8 max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center">
            <p className="font-semibold text-gray-900">{(error as Error).message}</p>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-4 rounded-lg bg-blue-500 px-5 py-2 font-bold text-white disabled:opacity-60"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
