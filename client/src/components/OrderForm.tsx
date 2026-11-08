import { useRef, useState, type FormEvent } from "react";
import type { Product } from "../types";
import { useCreateOrder, useProducts } from "../hooks/useProducts";
import { ApiRequestError } from "../lib/api";
import { taka } from "../lib/format";
import { trackInitiateCheckout, trackLead } from "../lib/analytics";

const PHONE_RE = /^01[3-9]\d{8}$/;
type Errors = Partial<
  Record<"name" | "phone" | "address" | "productId", string>
>;

const inputCls = (err?: string) =>
  `h-[50px] w-full rounded-xl border bg-white px-4 text-[16px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    err ? "border-red-500" : "border-gray-300"
  }`;

export default function OrderForm({
  selected,
  onSelect,
}: {
  selected: Product | null;
  onSelect: (p: Product) => void;
}) {
  const { data: products } = useProducts();
  const mutation = useCreateOrder();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const keyRef = useRef<string>(crypto.randomUUID());

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const startCheckout = () => selected && trackInitiateCheckout(selected);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (mutation.isPending || !selected) return;
    const er: Errors = {};
    const phone = form.phone.replace(/[\s-]/g, "").replace(/^\+?88/, "");
    if (form.name.trim().length < 2) er.name = "আপনার নাম লিখুন";
    if (!PHONE_RE.test(phone))
      er.phone = "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (01XXXXXXXXX)";
    if (form.address.trim().length < 8) er.address = "সম্পূর্ণ ঠিকানা লিখুন";
    setErrors(er);
    setFormError(null);
    if (Object.keys(er).length) return;

    mutation.mutate(
      {
        payload: {
          productId: selected._id,
          name: form.name.trim(),
          phone,
          address: form.address.trim(),
        },
        key: keyRef.current,
      },
      {
        onSuccess: (order) => {
          trackLead(selected, order._id);
          setDone(order._id);
          setForm({ name: "", phone: "", address: "" });
          keyRef.current = crypto.randomUUID();
        },
        onError: (err) => {
          const ae = err as ApiRequestError;
          if (ae.fieldErrors) setErrors(ae.fieldErrors as Errors);
          setFormError(ae.message);
        },
      },
    );
  };

  return (
    <section id="order" className="bg-white px-4 pb-[64px] pt-4">
      <div className="mx-auto max-w-[638px] rounded-[28px] border border-gray-200 bg-page p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-8">
        <h2 className="text-center text-[28px] font-extrabold text-gray-900 sm:text-[34px]">
          📝 অর্ডার ফর্ম
        </h2>
        <p className="mt-1 text-center text-[16px] text-gray-600">
          ডিজাইন সিলেক্ট করুন, তথ্য দিন, অর্ডার কনফার্ম করুন
        </p>

        <form onSubmit={submit} noValidate className="mt-6">
          <fieldset>
            <legend className="mb-2 text-[15px] font-bold text-gray-900">
              🎨 ডিজাইন/কালার সিলেক্ট করুন *
            </legend>
            <div
              className="grid grid-cols-3 gap-2 sm:grid-cols-5"
              role="radiogroup"
            >
              {products?.map((p) => {
                const active = selected?._id === p._id;
                return (
                  <button
                    key={p._id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onSelect(p)}
                    className={`overflow-hidden rounded-lg border bg-white text-center transition ${
                      active
                        ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <img
                      src={p.image}
                      alt=""
                      width={107}
                      height={105}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[107/105] w-full object-cover"
                    />
                    <span className="block px-0.5 py-1 text-[11px] font-medium leading-tight text-gray-900">
                      {p.name}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.productId && (
              <p className="mt-1 text-sm text-red-600">{errors.productId}</p>
            )}
          </fieldset>

          {selected && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-200/70 p-3">
              <img
                src={selected.image}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div>
                <p className="text-[16px] font-bold text-gray-900">
                  {selected.name}
                </p>
                <p className="text-[14px] text-gray-600">
                  {selected.description}
                </p>
              </div>
            </div>
          )}

          <label
            className="mt-5 block text-[15px] font-bold text-gray-900"
            htmlFor="name"
          >
            আপনার নাম *
          </label>
          <input
            id="name"
            autoComplete="name"
            value={form.name}
            onChange={set("name")}
            onFocus={startCheckout}
            placeholder="পুরো নাম লিখুন"
            className={`mt-2 ${inputCls(errors.name)}`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-blue-500">{errors.name}</p>
          )}

          <label
            className="mt-4 block text-[15px] font-bold text-gray-900"
            htmlFor="phone"
          >
            ফোন নম্বর *
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={set("phone")}
            onFocus={startCheckout}
            placeholder="01XXXXXXXXX"
            className={`mt-2 ${inputCls(errors.phone)}`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-blue-500">{errors.phone}</p>
          )}

          <label
            className="mt-4 block text-[15px] font-bold text-gray-900"
            htmlFor="address"
          >
            সম্পূর্ণ ঠিকানা *
          </label>
          <textarea
            id="address"
            autoComplete="street-address"
            value={form.address}
            onChange={set("address")}
            onFocus={startCheckout}
            placeholder="বাসা, রোড, এলাকা, জেলা"
            rows={3}
            className={`mt-2 h-[98px] w-full resize-none rounded-xl border bg-white px-4 py-3 text-[16px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? "border-blue-500" : "border-gray-300"}`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-blue-500">{errors.address}</p>
          )}

          {selected && (
            <div className="mt-5 rounded-xl bg-[#EBECEE] p-4 text-[14.5px] leading-[26px] text-gray-900">
              <h3 className="text-[17px] font-bold leading-7">
                💰 অর্ডার সামারি
              </h3>
              <p>
                প্রোডাক্ট: <b>{selected.name}</b>
              </p>
              <p>
                মোট মূল্য: <b className="text-[16px]">{taka(selected.price)}</b>
              </p>
              <p>
                অগ্রিম:{" "}
                <b className="text-[16px] font-semibold text-blue-500">
                  {taka(selected.advance)}
                </b>
              </p>
              <p>
                বাকি ট্রান্সপোর্টে পেমেন্ট:{" "}
                <b className="text-[16px]">
                  {taka(selected.price - selected.advance)}
                </b>
              </p>
            </div>
          )}

          {formError && (
            <p
              role="alert"
              className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700"
            >
              {formError}
            </p>
          )}
          {done && (
            <p
              role="status"
              className="mt-3 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-800"
            >
              ✅ আপনার অর্ডার সফলভাবে জমা হয়েছে! শীঘ্রই আমরা কল করে কনফার্ম
              করব।
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending || !selected}
            className="mt-4 h-[48px] w-full rounded-xl bg-blue-500 text-[18px] font-bold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {mutation.isPending ? "জমা হচ্ছে..." : "✅ অর্ডার কনফার্ম করুন"}
          </button>
        </form>
      </div>
    </section>
  );
}
