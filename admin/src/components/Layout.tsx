import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, Package, ShoppingBag, X } from 'lucide-react';
import { useAuth } from '../lib/auth';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/products', label: 'Products', icon: Package },
];

export default function Layout() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen lg:flex">
      <div className="flex items-center justify-between bg-brand px-4 py-3 text-white lg:hidden">
        <span className="font-bold">BD Ceramics Admin</span>
        <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
      </div>
      <aside className={`${open ? 'block' : 'hidden'} w-full shrink-0 bg-white lg:sticky lg:top-0 lg:block lg:h-screen lg:w-60 lg:border-r`}>
        <div className="hidden px-5 py-5 text-lg font-extrabold text-brand lg:block">BD Ceramics Admin</div>
        <nav className="flex flex-col gap-1 p-3">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-brand text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
          <button onClick={logout} className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
