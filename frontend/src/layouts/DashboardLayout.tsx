import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    Menu,
    LogOut,
    ShoppingBag,
    Factory,
    Building2,
    Wallet
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: 'Panel', path: '/dashboard' },
    { icon: ShoppingBag, label: 'Satışlar', path: '/sales' },
    { icon: Factory, label: 'Satın Alma', path: '/purchases' },
    { icon: Building2, label: 'Tedarikçiler', path: '/suppliers' },
    { icon: Package, label: 'Stok', path: '/inventory' },
    { icon: Users, label: 'Müşteriler', path: '/customers' },
    { icon: Wallet, label: 'Finans', path: '/finance' },
];

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    }

    return (
        <div className="h-screen bg-background flex overflow-hidden">
            {/* Sidebar - Fixed Position */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 220 : 72 }}
                className="h-screen bg-surface border-r border-accent hidden md:flex flex-col flex-shrink-0"
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-4 border-b border-accent">
                    <div className="text-primary text-xl font-bold truncate">
                        {isSidebarOpen ? 'Halı Sarayı' : 'H'}
                    </div>
                </div>

                {/* Navigation - Fixed, no scroll */}
                <nav className="flex-1 py-4 px-2 space-y-1 overflow-hidden">
                    {SIDEBAR_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex items-center px-3 py-2.5 rounded-lg transition-all group",
                                isSidebarOpen ? "" : "justify-center",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-text-muted hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon size={20} strokeWidth={1.5} />
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="ml-3 text-sm font-medium whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile / Logout - Fixed at bottom */}
                <div className="p-2 border-t border-accent">
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center w-full px-3 py-2.5 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors",
                            isSidebarOpen ? "" : "justify-center"
                        )}
                    >
                        <LogOut size={20} strokeWidth={1.5} />
                        {isSidebarOpen && <span className="ml-3 text-sm font-medium">Çıkış Yap</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header - Fixed */}
                <header className="h-16 bg-surface border-b border-accent flex items-center justify-between px-6 flex-shrink-0">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-white/5 text-text-muted transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="ml-4 text-base font-semibold text-white">
                            Hoşgeldiniz
                        </h2>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            B
                        </div>
                    </div>
                </header>

                {/* Page Content - Scrollable */}
                <div className="flex-1 overflow-auto p-6">
                    <Outlet />
                </div>

                {/* Footer - Fixed at bottom */}
                <footer className="py-3 px-6 border-t border-accent text-center text-text-muted text-xs flex-shrink-0">
                    © 2025 Anka. Tüm Hakları Saklıdır.
                </footer>
            </main>
        </div>
    );
}
