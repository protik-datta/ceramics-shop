import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Order, Paged, Product, Stats, Status } from '../lib/types';

export interface OrderFilters { page: number; search: string; status: string; from: string; to: string }

const clean = (f: Record<string, string | number>) => Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== 0));

export const useStats = () =>
  useQuery({ queryKey: ['stats'], queryFn: async () => (await api.get<{ data: Stats }>('/stats')).data.data });

export const useOrders = (f: OrderFilters, limit = 10) =>
  useQuery({
    queryKey: ['orders', f, limit],
    queryFn: async () => (await api.get<Paged<Order>>('/orders', { params: clean({ ...f, limit }) })).data,
    placeholderData: keepPreviousData,
  });

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => (await api.patch(`/orders/${id}`, { status })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }); qc.invalidateQueries({ queryKey: ['stats'] }); },
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/orders/${id}`)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }); qc.invalidateQueries({ queryKey: ['stats'] }); },
  });
}

export async function exportOrdersCsv(f: Omit<OrderFilters, 'page'>) {
  const res = await api.get('/orders/export', { params: clean(f), responseType: 'blob' });
  const url = URL.createObjectURL(res.data as Blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'orders.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export const useAdminProducts = () =>
  useQuery({ queryKey: ['admin-products'], queryFn: async () => (await api.get<{ data: Product[] }>('/products')).data.data });

export function useSaveProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id?: string; body: Partial<Product> }) =>
      id ? (await api.patch(`/products/${id}`, body)).data : (await api.post('/products', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}
