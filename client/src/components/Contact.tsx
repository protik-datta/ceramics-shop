import { MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <footer
      id="contact"
      className="border-t border-gray-200 bg-page px-4 pb-20 pt-14 text-center"
    >
      <h2 className="text-[28px] font-extrabold text-gray-900 sm:text-[32px]">
        📞 যোগাযোগ করুন
      </h2>
      <p className="mt-3 text-[16px] text-gray-600">
        অর্ডার বা যেকোনো তথ্যের জন্য যোগাযোগ করুন
      </p>
      <address className="mt-4 flex flex-col items-center gap-3 not-italic">
        <a
          href="tel:+8801340501226"
          className="flex items-center gap-2 text-[20px] font-semibold text-blue-500"
        >
          <Phone className="h-5 w-5" aria-hidden /> 01340501226 (WhatsApp)
        </a>
        <p className="flex items-center gap-2 text-[16px] text-gray-700">
          <MapPin className="h-5 w-5 text-gray-600" aria-hidden /> বগুড়া,
          মাটিডালি, বিমানবন্দর এলাকা
        </p>
      </address>
    </footer>
  );
}
