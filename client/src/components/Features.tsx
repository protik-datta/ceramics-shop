import { Gift, ShieldCheck, Star, Truck } from 'lucide-react';

const items = [
  { icon: Star, title: 'প্রিমিয়াম কোয়ালিটি', sub: 'হাই গ্রেড সিরামিক' },
  { icon: Gift, title: 'সাশ্রয়ী মূল্য', sub: 'বাজারের চেয়ে কম দাম' },
  { icon: Truck, title: 'ফাস্ট ডেলিভারি', sub: '3-5 দিনে ডেলিভারি' },
  { icon: ShieldCheck, title: 'অরিজিনাল গ্যারান্টি', sub: '100% অরিজিনাল' },
];

export default function Features() {
  return (
    <section className="bg-page px-4 pb-14 pt-[60px]">
      <div className="mx-auto max-w-[1166px]">
        <h2 className="text-center text-[28px] font-extrabold text-gray-900 sm:text-[34px]">✨ কেন আমাদের থেকে কিনবেন?</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-2xl border border-gray-200 bg-white px-4 py-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F0E6]">
                <Icon className="h-6 w-6 text-green-700" strokeWidth={1.6} aria-hidden />
              </div>
              <h3 className="mt-3 text-[18px] font-bold text-gray-900">{title}</h3>
              <p className="mt-1 text-[14px] text-gray-500">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
