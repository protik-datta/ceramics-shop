import { useCallback, useEffect, useState } from 'react';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import ProductGrid from './components/ProductGrid';
import Countdown from './components/Countdown';
import Features from './components/Features';
import Reviews from './components/Reviews';
import OrderForm from './components/OrderForm';
import Contact from './components/Contact';
import WhatsAppButton from './components/WhatsAppButton';
import JsonLd from './components/JsonLd';
import { useProducts } from './hooks/useProducts';
import { trackInitiateCheckout, trackViewContent } from './lib/analytics';
import type { Product } from './types';

export default function App() {
  const { data: products } = useProducts();
  const [selected, setSelected] = useState<Product | null>(null);

  // default selection once data arrives (no tracking: not a user action)
  useEffect(() => {
    if (products?.length && !selected) setSelected(products[0]);
  }, [products, selected]);

  const select = useCallback((p: Product) => {
    setSelected(p);
    trackViewContent(p);
  }, []);

  const orderNow = useCallback(
    (p: Product) => {
      select(p);
      trackInitiateCheckout(p);
      document.getElementById('order')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [select]
  );

  return (
    <>
      <Hero />
      <TrustBar />
      <main>
        <ProductGrid onOrder={orderNow} />
        <Countdown />
        <Features />
        <Reviews />
        <OrderForm selected={selected} onSelect={select} />
      </main>
      <Contact />
      <WhatsAppButton />
      <JsonLd products={products} />
    </>
  );
}
