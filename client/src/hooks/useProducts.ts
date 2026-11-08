import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { OrderPayload, OrderResponse, Product } from '../types';

export const productKeys = { all: ['products'] as const, detail: (id: string) => ['products', id] as const };

export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: async () => (await api.get<{ data: Product[] }>('/products')).data.data,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useProduct(id?: string) {
  return useQuery({
    queryKey: productKeys.detail(id ?? ''),
    queryFn: async () => (await api.get<{ data: Product }>(`/products/${id}`)).data.data,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ payload, key }: { payload: OrderPayload; key: string }) =>
      (await api.post<{ data: OrderResponse }>('/orders', payload, { headers: { 'Idempotency-Key': key } })).data.data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
