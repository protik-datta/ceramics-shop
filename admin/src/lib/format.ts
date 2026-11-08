export const taka = (n: number) => `৳${n.toLocaleString('en-US')}`;
export const fmtDate = (d: string) =>
  new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
