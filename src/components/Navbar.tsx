import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/quem-somos', label: 'Quem Somos' },
    { to: '/dashboard', label: 'Dashboard', protected: true },
  ];

  const handleDashboardClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate('/auth');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight">
            FX <span className="text-gradient-green">Intelligence</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={link.protected ? handleDashboardClick : undefined}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
              {link.protected && ' 🔒'}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => signOut()}
              className="ml-4 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          ) : (
            <Link
              to="/auth"
              className="ml-4 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Entrar
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={(e) => {
                setMobileOpen(false);
                if (link.protected) handleDashboardClick(e);
              }}
              className={`block rounded-md px-4 py-3 text-sm font-medium ${
                location.pathname === link.to
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {link.label} {link.protected && '🔒'}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { signOut(); setMobileOpen(false); }}
              className="mt-2 flex w-full items-center gap-2 rounded-md px-4 py-3 text-sm text-muted-foreground"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMobileOpen(false)}
              className="mt-2 block rounded-md bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground"
            >
              Entrar
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
