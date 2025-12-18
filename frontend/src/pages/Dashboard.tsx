import { TrendingUp, ShoppingBag, AlertCircle, CreditCard, Calendar, Users, Truck, Package, ArrowUpRight, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SlideOver from '../components/SlideOver';
import NewSaleForm from '../components/NewSaleForm';
import { useToast } from '../components/ui/Toast';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';

const COLORS = ['#13a4ec', '#8b5cf6', '#22c55e', '#eab308', '#ef4444'];

export default function Dashboard() {
    const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Fetch Dashboard Data
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard-overview'],
        queryFn: dashboardApi.getOverview,
        refetchInterval: 30000 // Refresh every 30 seconds
    });

    // KPI Data Construction - Clickable cards
    const kpiData = [
        {
            title: 'Aylık Ciro',
            value: data ? `₺${Number(data.kpi.revenue).toLocaleString('tr-TR')}` : '₺0',
            subtitle: 'Bu ay',
            icon: TrendingUp,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            link: '/orders'
        },
        {
            title: 'Bekleyen Sipariş',
            value: data ? data.kpi.pendingOrders : '0',
            subtitle: 'Adet',
            icon: ShoppingBag,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            link: '/orders'
        },
        {
            title: 'Kritik Stok',
            value: data ? `${data.kpi.criticalStock}` : '0',
            subtitle: 'Ürün',
            icon: AlertCircle,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
            link: '/inventory'
        },
        {
            title: 'Müşteri Alacakları',
            value: data ? `₺${Math.abs(Number(data.kpi.customerBalance)).toLocaleString('tr-TR')}` : '₺0',
            subtitle: Number(data?.kpi.customerBalance || 0) < 0 ? 'Bize borçlular' : 'Bakiye',
            icon: Users,
            color: 'text-cyan-500',
            bg: 'bg-cyan-500/10',
            link: '/customers'
        },
        {
            title: 'Tedarikçi Borçları',
            value: data ? `₺${Number(data.kpi.supplierBalance).toLocaleString('tr-TR')}` : '₺0',
            subtitle: 'Biz borçluyuz',
            icon: Truck,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            link: '/suppliers'
        },
        {
            title: 'Aylık Tahsilat',
            value: data ? `₺${Number(data.kpi.totalIncome).toLocaleString('tr-TR')}` : '₺0',
            subtitle: 'Bu ay toplanan',
            icon: Wallet,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            link: '/finance'
        },
        {
            title: 'Aylık Ödemeler',
            value: data ? `₺${Number(data.kpi.totalExpense).toLocaleString('tr-TR')}` : '₺0',
            subtitle: 'Bu ay ödenen',
            icon: CreditCard,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
            link: '/finance'
        },
        {
            title: 'Toplam Ürün',
            value: data ? data.kpi.productCount : '0',
            subtitle: 'Stokta',
            icon: Package,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            link: '/inventory'
        },
    ];

    const salesData = data?.salesChart || [];
    const brandData = data?.brandChart || [];
    const topSuppliers = data?.topSuppliers || [];
    const topCustomers = data?.topCustomers || [];

    if (isLoading) return <div className="text-white p-8">Yükleniyor...</div>;

    return (
        <>
            <div className="space-y-8">
                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Genel Bakış</h1>
                        <p className="text-text-muted mt-1">Mağaza performansınızı buradan takip edin.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setIsNewSaleOpen(true)}
                            className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 flex items-center"
                        >
                            <ShoppingBag size={16} className="mr-2" />
                            Yeni Satış
                        </button>
                    </div>
                </div>

                {/* KPI Grid - Clickable */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpiData.map((kpi, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.03 }}
                            onClick={() => navigate(kpi.link)}
                            className="bg-surface p-5 rounded-xl border border-accent hover:border-primary/50 transition-all duration-300 shadow-lg cursor-pointer group"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-text-muted text-sm font-medium">{kpi.title}</p>
                                    <h3 className="text-xl font-bold text-white mt-1">{kpi.value}</h3>
                                    <p className="text-xs text-text-muted mt-1">{kpi.subtitle}</p>
                                </div>
                                <div className={cn("p-3 rounded-xl transition-colors relative", kpi.bg)}>
                                    <kpi.icon size={20} className={kpi.color} />
                                    <ArrowUpRight size={12} className="absolute -top-1 -right-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Chart Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sales Trend */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        onClick={() => navigate('/orders')}
                        className="lg:col-span-2 bg-surface rounded-xl border border-accent p-6 h-[350px] flex flex-col cursor-pointer hover:border-primary/50 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Son 7 Günlük Satış Trendi</h3>
                            <ArrowUpRight size={16} className="text-primary" />
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesData}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#13a4ec" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#13a4ec" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2d33" vertical={false} />
                                    <XAxis dataKey="name" stroke="#6b7280" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                    <YAxis stroke="#6b7280" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(value) => `₺${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a262c', borderColor: '#1f2d33', color: '#fff', borderRadius: '8px' }}
                                        formatter={(value: number) => [`₺${value.toLocaleString('tr-TR')}`, 'Satış'] as [string, string]}
                                    />
                                    <Area type="monotone" dataKey="uv" stroke="#13a4ec" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Brand Distribution */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => navigate('/inventory')}
                        className="bg-surface rounded-xl border border-accent p-6 h-[350px] flex flex-col cursor-pointer hover:border-primary/50 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Marka Dağılımı</h3>
                            <ArrowUpRight size={16} className="text-primary" />
                        </div>
                        {brandData.length > 0 ? (
                            <div className="flex-1 w-full min-h-0 flex items-center justify-center relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={brandData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {brandData.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#1a262c', borderColor: '#1f2d33', color: '#fff', borderRadius: '8px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-text-muted">Veri yok</div>
                        )}
                        <div className="flex justify-center flex-wrap gap-2 mt-2">
                            {brandData.map((item: any, index: number) => (
                                <div key={item.name} className="flex items-center text-xs text-text-muted">
                                    <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Chart Row 2 - Financial Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Suppliers */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        onClick={() => navigate('/suppliers')}
                        className="bg-surface rounded-xl border border-accent p-6 cursor-pointer hover:border-primary/50 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">En Borçlu Olduğumuz Tedarikçiler</h3>
                            <ArrowUpRight size={16} className="text-primary" />
                        </div>
                        {topSuppliers.length > 0 ? (
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topSuppliers} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2d33" horizontal={false} />
                                        <XAxis type="number" stroke="#6b7280" tickFormatter={(v) => `₺${v}`} tick={{ fontSize: 10 }} />
                                        <YAxis type="category" dataKey="name" stroke="#6b7280" tick={{ fontSize: 10 }} width={80} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1a262c', borderColor: '#1f2d33', color: '#fff', borderRadius: '8px' }}
                                            formatter={(value: number) => [`₺${value.toLocaleString('tr-TR')}`, 'Borç']}
                                        />
                                        <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center text-text-muted">Borç yok</div>
                        )}
                    </motion.div>

                    {/* Top Customers */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        onClick={() => navigate('/customers')}
                        className="bg-surface rounded-xl border border-accent p-6 cursor-pointer hover:border-primary/50 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">En Çok Borçlu Müşteriler</h3>
                            <ArrowUpRight size={16} className="text-primary" />
                        </div>
                        {topCustomers.length > 0 ? (
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topCustomers} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2d33" horizontal={false} />
                                        <XAxis type="number" stroke="#6b7280" tickFormatter={(v) => `₺${v}`} tick={{ fontSize: 10 }} />
                                        <YAxis type="category" dataKey="name" stroke="#6b7280" tick={{ fontSize: 10 }} width={80} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1a262c', borderColor: '#1f2d33', color: '#fff', borderRadius: '8px' }}
                                            formatter={(value: number) => [`₺${value.toLocaleString('tr-TR')}`, 'Alacak']}
                                        />
                                        <Bar dataKey="value" fill="#22c55e" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center text-text-muted">Alacak yok</div>
                        )}
                    </motion.div>
                </div>
            </div>

            <SlideOver
                isOpen={isNewSaleOpen}
                onClose={() => setIsNewSaleOpen(false)}
                title="Yeni Satış Oluştur"
            >
                <NewSaleForm onClose={() => setIsNewSaleOpen(false)} />
            </SlideOver>
        </>
    );
}
