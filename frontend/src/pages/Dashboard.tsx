import { TrendingUp, ShoppingBag, AlertCircle, CreditCard, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '../lib/utils';
import { useState } from 'react';
import SlideOver from '../components/SlideOver';
import NewSaleForm from '../components/NewSaleForm';
import { useToast } from '../components/ui/Toast';

const KPI_DATA = [
    { title: 'Aylık Ciro', value: '₺450.000', change: '+12%', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Bekleyen Sipariş', value: '18', change: '-2%', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Kritik Stok', value: '5 Ürün', change: 'Uyarı', icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { title: 'Bakiye', value: '₺-24.500', change: 'Ödeme Gerekli', icon: CreditCard, color: 'text-red-500', bg: 'bg-red-500/10' },
];

const SALES_DATA = [
    { name: '1 Kas', uv: 4000 },
    { name: '5 Kas', uv: 3000 },
    { name: '10 Kas', uv: 2000 },
    { name: '15 Kas', uv: 2780 },
    { name: '20 Kas', uv: 1890 },
    { name: '25 Kas', uv: 2390 },
    { name: '30 Kas', uv: 3490 },
];

const BRAND_DATA = [
    { name: 'Merinos', value: 400 },
    { name: 'Padişah', value: 300 },
    { name: 'Diğer', value: 100 },
];

const COLORS = ['#13a4ec', '#8b5cf6', '#1f2d33'];

export default function Dashboard() {
    const [dateRange, setDateRange] = useState('Son 30 Gün');
    const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
    const { showToast } = useToast();

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
                        {/* Date Filter */}
                        <div className="relative group">
                            <button className="flex items-center px-4 py-2 bg-surface border border-accent rounded-lg text-sm text-text-muted hover:text-white hover:border-primary/50 transition-colors">
                                <Calendar size={16} className="mr-2" />
                                {dateRange}
                            </button>
                            {/* Mock Dropdown */}
                            <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-accent rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                {['Son 30 Gün', 'Bu Hafta', 'Bugün', 'Bu Yıl'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => setDateRange(opt)}
                                        className="block w-full text-left px-4 py-2 text-sm text-text-muted hover:bg-white/5 hover:text-white first:rounded-t-lg last:rounded-b-lg"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => showToast('Rapor hazırlanıyor, lütfen bekleyin.', 'info')}
                            className="px-4 py-2 bg-surface border border-accent rounded-lg text-sm hover:bg-accent transition-colors text-white"
                        >
                            Rapor İndir
                        </button>
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
                    {KPI_DATA.map((kpi, index) => (
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
                                <span className={cn("font-medium", kpi.change.includes('+') ? 'text-green-500' : kpi.change === 'Uyarı' ? 'text-yellow-500' : kpi.change.includes('-') ? 'text-text-muted' : 'text-red-500')}>
                                    {kpi.change}
                                </span>
                                <span className="text-text-muted ml-2 opacity-60">
                                    {kpi.change === 'Uyarı' ? 'stok seviyesi' : kpi.change === 'Ödeme Gerekli' ? 'durum' : 'geçen aya göre'}
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
                            <h3 className="text-lg font-semibold text-white">Satış Trendi</h3>
                            <select className="bg-background border border-accent rounded text-xs px-2 py-1 text-text-muted outline-none">
                                <option>Günlük</option>
                                <option>Haftalık</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={SALES_DATA}>
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
                        <h3 className="text-lg font-semibold text-white mb-6">Marka Dağılımı</h3>
                        <div className="flex-1 w-full min-h-0 flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={BRAND_DATA}
                                        innerRadius={80}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {BRAND_DATA.map((entry, index) => (
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
                                <span className="text-3xl font-bold text-white tracking-tight">₺800B</span>
                                <span className="text-sm text-text-muted mt-1">Toplam Ciro</span>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="flex justify-center gap-4 mt-4">
                            {BRAND_DATA.map((item, index) => (
                                <div key={item.name} className="flex items-center text-xs text-text-muted">
                                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    {item.name}
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
