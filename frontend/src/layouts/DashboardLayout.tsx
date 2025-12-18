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
        // TODO: clear auth
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="bg-surface border-r border-accent hidden md:flex flex-col relative z-20"
            >
                {/* Logo */}
                <div className="h-20 flex items-center px-6 border-b border-accent">
                    <div className="text-primary text-2xl font-bold truncate">
                        {isSidebarOpen ? 'Yönetim Paneli' : 'S.'}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-2">
                    {SIDEBAR_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex items-center px-3 py-3 rounded-lg transition-all group",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-text-muted hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon size={22} strokeWidth={1.5} />
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="ml-3 font-medium whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile / Logout */}
                <div className="p-3 border-t border-accent">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-3 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                        <LogOut size={22} strokeWidth={1.5} />
                        {isSidebarOpen && <span className="ml-3 font-medium">Çıkış Yap</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-surface border-b border-accent flex items-center justify-between px-8">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-white/5 text-text-muted"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="ml-4 text-lg font-semibold text-white">
                            Hoşgeldiniz, Bayi
                        </h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            B
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
