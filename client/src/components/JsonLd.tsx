import { useEffect } from 'react';
import type { Product } from '../types';

export default function JsonLd({ products }: { products?: Product[] }) {
  useEffect(() => {
    if (!products?.length) return;
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'ld-products';
    el.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': products.map((p) => ({
        '@type': 'Product',
        name: p.name,
        image: p.image,
        description: p.description,
        sku: p.slug,
        brand: { '@type': 'Brand', name: 'BD Online Ceramics Shop' },
        offers: {
          '@type': 'Offer',
          price: p.price,
          priceCurrency: 'BDT',
          availability: 'https://schema.org/InStock',
          url: window.location.origin + '/#order',
          itemCondition: 'https://schema.org/NewCondition',
        },
      })),
    });
    document.getElementById('ld-products')?.remove();
    document.head.appendChild(el);
    return () => el.remove();
  }, [products]);
  return null;
}
