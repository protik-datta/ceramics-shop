import { Star } from 'lucide-react';

const reviews = [
  { stars: 5, text: '"অসাধারণ কোয়ালিটি! ছবির চেয়েও সুন্দর দেখতে। পরিবারের সবাই খুশি। ধন্যবাদ BD Ceramics!"', name: 'রাহেলা বেগম', city: 'ঢাকা' },
  { stars: 5, text: '"৩৫০০ টাকায় এত সুন্দর ডিনার সেট + কুকিং সেট পাওয়া যায় ভাবতেই পারিনি। ডেলিভারিও দ্রুত ছিল।"', name: 'মো. কামরুল হাসান', city: 'চট্টগ্রাম' },
  { stars: 4, text: '"কম্বো প্যাকেজটা দারুণ! কুকিং সেটের কোয়ালিটি অনেক ভালো। আবার অর্ডার করব ইনশাআল্লাহ।"', name: 'ফাতেমা আক্তার', city: 'রাজশাহী' },
  { stars: 5, text: '"বিয়ের গিফট হিসেবে কিনেছিলাম। সবাই প্রশংসা করেছে। প্যাকেজিংও অনেক সুন্দর ছিল।"', name: 'আব্দুল করিম', city: 'সিলেট' },
  { stars: 5, text: '"আগে অনলাইনে কিনতে ভয় পেতাম। কিন্তু এখানে যা দেখেছি তাই পেয়েছি। ১০০% সন্তুষ্ট!"', name: 'নাসরিন সুলতানা', city: 'বরিশাল' },
  { stars: 5, text: '"লোকাল দোকানে এই দামে এত ভালো জিনিস পাওয়া যায় না। অনেক ভালো সার্ভিস।"', name: 'মো. জাহিদুল ইসলাম', city: 'বগুড়া' },
];

export default function Reviews() {
  return (
    <section className="border-t border-gray-200 bg-white px-4 pb-[100px] pt-[64px]">
      <div className="mx-auto max-w-[1166px]">
        <h2 className="text-center text-[28px] font-extrabold text-gray-900 sm:text-[34px]">⭐ গ্রাহকদের মতামত</h2>
        <p className="mt-1 text-center text-[16px] text-gray-600">আমাদের সন্তুষ্ট গ্রাহকরা যা বলছেন</p>
        <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="rounded-2xl border border-gray-200 bg-page p-5 shadow-sm">
              <div className="flex gap-1" role="img" aria-label={`${r.stars} স্টার`}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`h-[18px] w-[18px] ${i <= r.stars ? 'fill-amber-400 text-amber-400' : 'text-gray-400'}`} aria-hidden />
                ))}
              </div>
              <blockquote className="mt-3 text-[16px] leading-[1.45] text-gray-800">{r.text}</blockquote>
              <figcaption className="mt-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-300 text-sm font-bold text-blue-500">{r.name[0]}</span>
                <span>
                  <span className="block text-[15px] font-bold leading-tight text-gray-900">{r.name}</span>
                  <span className="block text-[13px] leading-tight text-gray-500">{r.city}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
