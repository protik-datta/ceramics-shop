export default function Hero() {
  return (
    <header className="bg-blue-500 px-4 pb-10 pt-[54px] text-center text-white">
      <div className="mx-auto max-w-[1160px]">
        <span className="inline-block rounded-full bg-white/20 px-4 py-[7px] text-[15px] font-bold">🔥 সীমিত সময়ের অফার</span>
        <h1 className="mt-3 text-[34px] font-extrabold leading-[0.98] sm:text-[48px] lg:text-[52px]">
          BD Online Shop — প্রিমিয়াম ডিনার ও কুকিং সেট কম্বো
        </h1>
        <p className="mt-4 text-[17px] font-bold sm:text-[21px]">৩৫০০ টাকায় পাচ্ছেন ৩০৪ পিস ডিনার সেট + ১৩ পিস কুকিং সেট</p>
        <p className="mt-3 text-[16px] sm:text-[19px]">প্রিমিয়াম কোয়ালিটি সিরামিক ডিনার সেট — বিভিন্ন ডিজাইনে পাওয়া যাচ্ছে!</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <span className="text-[48px] font-extrabold leading-none sm:text-[56px]">৳3,500</span>
          <span className="text-[20px] text-white/70 line-through">৳5,500</span>
          <span className="rounded-full bg-amber-400 px-3 py-[5px] text-[15px] font-bold text-gray-900">36% OFF</span>
        </div>
        <p className="mt-4 text-[15px] sm:text-[16px]">
          ✅ অগ্রিম মাত্র ৳350 — বাকি টাকা ট্রান্সপোর্ট করে পেমেন্ট করতে হবে | 🚚 সারা বাংলাদেশে ডেলিভারি
        </p>
      </div>
    </header>
  );
}
