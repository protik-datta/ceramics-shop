import { CircleCheck, ShieldCheck, Truck } from 'lucide-react';

const items = [
  { icon: Truck, text: 'সারা বাংলাদেশে ডেলিভারি' },
  { icon: ShieldCheck, text: '100% অরিজিনাল' },
  { icon: CircleCheck, text: 'ভেরিফাইড সেলার' },
];

export default function TrustBar() {
  return (
    <div className="border-b border-gray-200 bg-white">
      <ul className="mx-auto flex min-h-[60px] max-w-[1160px] flex-wrap items-center justify-center gap-x-10 gap-y-2 px-4 py-3">
        {items.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2 text-[15px] font-semibold text-gray-900">
            <Icon className="h-5 w-5 text-green-600" strokeWidth={1.8} aria-hidden /> {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
