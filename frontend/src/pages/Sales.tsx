import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { salesApi } from '../services/api';
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    Clock,
    Download,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import SlideOver from '../components/SlideOver';
import NewSaleForm from '../components/NewSaleForm';
import FilterPanel from '../components/FilterPanel';
import OrderDetail from '../components/OrderDetail';
import { useToast } from '../components/ui/Toast';

// Mock Stats (Can be calculated from data later)
const ORDER_STATS = [
    { title: 'Bekleyen', value: '18', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Hazırlanıyor', value: '5', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { title: 'Kargoda', value: '12', color: 'text-green-500', bg: 'bg-green-500/10' },
];

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'Delivered':
        case 'Teslim Edildi':
            return <span className="flex items-center text-green-400 text-xs px-2 py-1 bg-green-400/10 rounded-full border border-green-400/20"><CheckCircle2 size={12} className="mr-1" />Teslim Edildi</span>;
        case 'Preparing':
        case 'Hazırlanıyor':
            return <span className="flex items-center text-blue-400 text-xs px-2 py-1 bg-blue-400/10 rounded-full border border-blue-400/20 animate-pulse"><Clock size={12} className="mr-1" />Hazırlanıyor</span>;
        case 'Pending':
        case 'Bekliyor':
            return <span className="flex items-center text-yellow-400 text-xs px-2 py-1 bg-yellow-400/10 rounded-full border border-yellow-400/20"><AlertCircle size={12} className="mr-1" />Bekliyor</span>;
        default:
            return <span className="text-text-muted text-xs">{status}</span>;
    }
};

const BrandBadge = ({ brand }: { brand: string }) => {
    return <span className="text-xs px-2 py-1 bg-white/5 rounded border border-white/10 text-text-muted">{brand || 'Genel'}</span>;
}

export default function Sales() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const { showToast } = useToast();

    // Fetch Sales from API
    const { data: salesData, isLoading, error } = useQuery({
        queryKey: ['sales'],
        queryFn: salesApi.getAll,
    });

    // Map Backend Data
    const orders = salesData?.map((sale: any) => ({
        id: sale.id.substring(0, 8).toUpperCase(), // Shorten UUID
        fullId: sale.id,
        customer: sale.customer ? sale.customer.name : 'Bilinmiyor',
        amount: `₺${Number(sale.totalAmount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
        status: sale.status,
        date: new Date(sale.date).toLocaleDateString('tr-TR'),
        brand: sale.items && sale.items.length > 0 ? 'Çoklu' : '-' // Logic for brand column
    })) || [];

    const handleOrderClick = (id: string) => {
        setSelectedOrderId(id); // Use full ID if needed, here passing short ID for display or Full ID for fetch
        // ideally find the order in 'orders' to get full ID if 'id' param is short
        const order = orders.find((o: any) => o.id === id);
        if (order) setSelectedOrderId(order.fullId);
        setIsDetailOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 text-text-muted">
                <Loader2 className="animate-spin mr-2" /> Siparişler yükleniyor...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-red-400">
                Sipariş verileri alınırken bir hata oluştu.
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Satışlar (Müşteri)</h1>
                        <p className="text-text-muted mt-1">Müşterilere yapılan satışları buradan yönetin.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => showToast('Excel dosyası indiriliyor...', 'success')}
                            className="flex items-center px-4 py-2 bg-surface border border-accent rounded-lg text-sm hover:bg-accent transition-colors text-white"
                        >
                            <Download size={16} className="mr-2" />
                            Excel İndir
                        </button>
                        <button
                            onClick={() => setIsNewSaleOpen(true)}
                            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                        >
                            <Plus size={16} className="mr-2" />
                            Yeni Satış Yap
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {ORDER_STATS.map((stat, index) => (
                        <div key={index} className="bg-surface p-4 rounded-xl border border-accent flex items-center justify-between">
                            <div>
                                <p className="text-text-muted text-sm">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                            </div>
                            <div className={cn("p-3 rounded-lg", stat.bg)}>
                                <div className={cn("w-6 h-6 rounded-full border-2 border-current", stat.color)} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters & Actions */}
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Sipariş no, müşteri veya marka ara..."
                            className="w-full bg-surface border border-accent rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary placeholder-text-muted transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center px-4 py-3 bg-surface border border-accent rounded-lg text-text-muted hover:text-white hover:border-primary/50 transition-colors"
                    >
                        <Filter size={18} className="mr-2" />
                        Filtrele
                    </button>
                </div>

                {/* Table */}
                <div className="bg-surface border border-accent rounded-xl overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#14232a] text-text-muted font-medium border-b border-accent">
                                <tr>
                                    <th className="px-6 py-4">Sipariş No</th>
                                    <th className="px-6 py-4">Müşteri</th>
                                    <th className="px-6 py-4">İçerik</th>
                                    <th className="px-6 py-4">Tarih</th>
                                    <th className="px-6 py-4">Tutar</th>
                                    <th className="px-6 py-4">Durum</th>
                                    <th className="px-6 py-4 text-right">Detay</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-accent">
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                                            Henüz satış kaydı bulunmuyor.
                                        </td>
                                    </tr>
                                )}
                                {orders.map((order: any, index: number) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group hover:bg-white/5 transition-colors cursor-pointer"
                                        onClick={() => handleOrderClick(order.id)}
                                    >
                                        <td className="px-6 py-4 font-medium text-white">#{order.id}</td>
                                        <td className="px-6 py-4 text-text-muted">{order.customer}</td>
                                        <td className="px-6 py-4">
                                            <BrandBadge brand={order.brand} />
                                        </td>
                                        <td className="px-6 py-4 text-text-muted">{order.date}</td>
                                        <td className="px-6 py-4 font-bold text-white">{order.amount}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-text-muted hover:text-white transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Mock */}
                    <div className="p-4 border-t border-accent flex justify-between items-center text-xs text-text-muted">
                        <span>Toplam 45 kayıt gösteriliyor</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 rounded bg-background border border-accent hover:text-white">Önceki</button>
                            <button className="px-3 py-1 rounded bg-primary text-white">1</button>
                            <button className="px-3 py-1 rounded bg-background border border-accent hover:text-white">2</button>
                            <button className="px-3 py-1 rounded bg-background border border-accent hover:text-white">3</button>
                            <button className="px-3 py-1 rounded bg-background border border-accent hover:text-white">Sonraki</button>
                        </div>
                    </div>
                </div>
            </div>

            <SlideOver
                isOpen={isNewSaleOpen}
                onClose={() => setIsNewSaleOpen(false)}
                title="Yeni Satış Oluştur"
            >
                <NewSaleForm onClose={() => setIsNewSaleOpen(false)} />
            </SlideOver>

            <SlideOver
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                title={`${selectedOrderId || ''} - Sipariş Detayı`}
            >
                <OrderDetail orderId={selectedOrderId || ''} />
            </SlideOver>
        </>
    );
}
