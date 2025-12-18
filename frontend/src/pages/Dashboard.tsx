import { TrendingUp, ShoppingBag, AlertCircle, CreditCard, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '../lib/utils';
import { useState } from 'react';
import SlideOver from '../components/SlideOver';
import NewSaleForm from '../components/NewSaleForm';
import { useToast } from '../components/ui/Toast';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';

const COLORS = ['#13a4ec', '#8b5cf6', '#1f2d33', '#eab308', '#ef4444'];

export default function Dashboard() {
    const [dateRange, setDateRange] = useState('Son 30 Gün');
    const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
    const { showToast } = useToast();

    // Fetch Dashboard Data
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard-overview'],
        queryFn: dashboardApi.getOverview,
        refetchInterval: 30000 // Refresh every 30 seconds
    });

    // KPI Data Construction
    const kpiData = [
        {
            title: 'Aylık Ciro',
            value: data ? `₺${Number(data.kpi.revenue).toLocaleString('tr-TR')}` : '₺0',
            change: '+--', // TODO: Calculate change
            icon: TrendingUp,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        },
        {
            title: 'Bekleyen Sipariş',
            value: data ? data.kpi.pendingOrders : '0',
            change: 'Adet',
            icon: ShoppingBag,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            title: 'Kritik Stok',
            value: data ? `${data.kpi.criticalStock} Ürün` : '0 Ürün',
            change: 'Uyarı',
            icon: AlertCircle,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10'
        },
        {
            title: 'Toplam Bakiye',
            value: data ? `₺${Number(data.kpi.balance).toLocaleString('tr-TR')}` : '₺0',
            change: 'Durum',
            icon: CreditCard,
            color: 'text-red-500',
            bg: 'bg-red-500/10'
        },
    ];

    const salesData = data?.salesChart || [];
    const brandData = data?.brandChart || [];

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

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kpiData.map((kpi, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-surface p-6 rounded-xl border border-accent hover:border-primary/50 transition-all duration-300 shadow-lg cursor-default"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-text-muted text-sm font-medium">{kpi.title}</p>
                                    <h3 className="text-2xl font-bold text-white mt-2">{kpi.value}</h3>
                                </div>
                                <div className={cn("p-3 rounded-xl transition-colors", kpi.bg)}>
                                    <kpi.icon size={22} className={kpi.color} />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <span className={cn("font-medium", kpi.change === 'Uyarı' ? 'text-yellow-500' : 'text-text-muted')}>
                                    {kpi.change}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Chart Placement */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sales Trend */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 bg-surface rounded-xl border border-accent p-6 h-[400px] flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Son 7 Günlük Satış Trendi</h3>
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
                                    <XAxis
                                        dataKey="name"
                                        stroke="#6b7280"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#6b7280"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => `₺${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a262c', borderColor: '#1f2d33', color: '#fff', borderRadius: '8px' }}
                                        itemStyle={{ color: '#13a4ec' }}
                                        formatter={(value: number) => [`₺${value}`, 'Satış'] as [string, string]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="uv"
                                        stroke="#13a4ec"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorUv)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Brand Distribution */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-surface rounded-xl border border-accent p-6 h-[400px] flex flex-col"
                    >
                        <h3 className="text-lg font-semibold text-white mb-6">En Çok Satan Markalar</h3>
                        {brandData.length > 0 ? (
                            <div className="flex-1 w-full min-h-0 flex items-center justify-center relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={brandData}
                                            innerRadius={80}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {brandData.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1a262c', borderColor: '#1f2d33', color: '#fff', borderRadius: '8px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Centered Text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-xl font-bold text-white tracking-tight">
                                        {data ? `₺${Number(data.kpi.revenue).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}` : '0'}
                                    </span>
                                    <span className="text-xs text-text-muted mt-1">Bu Ay</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-text-muted">Veri yok</div>
                        )}

                        {/* Legend */}
                        <div className="flex justify-center flex-wrap gap-2 mt-4">
                            {brandData.map((item: any, index: number) => (
                                <div key={item.name} className="flex items-center text-xs text-text-muted">
                                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    {item.name} ({item.value})
                                </div>
                            ))}
                        </div>
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
