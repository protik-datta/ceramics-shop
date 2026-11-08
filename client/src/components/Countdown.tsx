import { Clock } from "lucide-react";
import { useCountdown } from "../hooks/useCountdown";

export default function Countdown() {
  const { h, m, s } = useCountdown();
  const box = [
    [h, "ঘন্টা"],
    [m, "মিনিট"],
    [s, "সেকেন্ড"],
  ];
  return (
    <section className="bg-blue-500 px-4 py-[52px] text-center text-white">
      <h2 className="flex items-center justify-center gap-2 text-[20px] font-bold">
        <Clock className="h-6 w-6" strokeWidth={1.6} aria-hidden /> ⏰ সীমিত
        সময়ের অফার!
      </h2>
      <div
        className="mt-4 flex justify-center gap-3"
        role="timer"
        aria-live="off"
      >
        {box.map(([v, label]) => (
          <div key={label} className="w-[94px]">
            <div className="flex h-16 items-center justify-center rounded-xl bg-white/20 text-[48px] font-extrabold leading-none tabular-nums">
              {v}
            </div>
            <div className="mt-1 text-[14px] text-white/85">{label}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[34px] font-extrabold leading-tight sm:text-[40px]">
        মাত্র ৳3,500 তে পুরো সেট!
      </p>
      <p className="mt-2 text-[18px]">
        রেগুলার প্রাইস <b className="line-through">৳5,500</b> — এখনই অর্ডার করে{" "}
        <b>৳2,000 সেভ</b> করুন!
      </p>
    </section>
  );
}
