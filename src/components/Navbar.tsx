import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, LogOut, Menu, X, LayoutDashboard, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard', protected: true },
    { to: '/solucoes', label: 'Soluções' }, // 👈 ADICIONADO
    { to: '/quem-somos', label: 'Quem Somos' },
  ];

  const handleDashboardClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate('/auth');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight text-white">
            FX <span className="text-gradient-green">Intelligence</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex">
          {links.map((link) => {
            const isDashboard = link.to === '/dashboard';
            const isActive = location.pathname === link.to;

            if (isDashboard) {
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={handleDashboardClick}
                  className="relative group px-5 py-2 transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-50 group-hover:opacity-100 transition-opacity animate-pulse" />
                  
                  <div className={`relative flex items-center gap-2 rounded-full border border-primary/50 bg-black/40 px-4 py-1.5 text-sm font-black uppercase tracking-wider transition-all group-hover:border-primary group-hover:scale-105 ${
                    isActive ? 'text-primary border-primary shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'text-primary'
                  }`}>
                    <LayoutDashboard className="h-4 w-4" />
                    {link.label}
                    <Sparkles className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-semibold transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="mx-2 h-4 w-[1px] bg-white/20" />

          {user ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          ) : (
            <Link
              to="/auth"
              className="rounded-lg px-4 py-2 text-sm font-bold text-white hover:bg-white/5 transition-all"
            >
              Entrar
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-black p-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={(e) => {
                setMobileOpen(false);
                if (link.protected) handleDashboardClick(e);
              }}
              className={`block rounded-xl px-4 py-4 text-base font-bold mb-2 ${
                link.to === '/dashboard' 
                  ? 'bg-primary/20 text-primary border border-primary/30' 
                  : 'text-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                {link.to === '/dashboard' && <LayoutDashboard className="h-5 w-5" />}
                {link.label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}