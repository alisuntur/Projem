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
import OrderDetail from '../components/OrderDetail';
import { useToast } from '../components/ui/Toast';

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'Teslim Edildi':
            return <span className="flex items-center text-green-400 text-xs px-2 py-1 bg-green-400/10 rounded-full border border-green-400/20"><CheckCircle2 size={12} className="mr-1" />Teslim Edildi</span>;
        case 'Hazırlanıyor':
            return <span className="flex items-center text-blue-400 text-xs px-2 py-1 bg-blue-400/10 rounded-full border border-blue-400/20 animate-pulse"><Clock size={12} className="mr-1" />Hazırlanıyor</span>;
        case 'Bekliyor':
            return <span className="flex items-center text-yellow-400 text-xs px-2 py-1 bg-yellow-400/10 rounded-full border border-yellow-400/20"><AlertCircle size={12} className="mr-1" />Bekliyor</span>;
        case 'Yolda':
            return <span className="flex items-center text-purple-400 text-xs px-2 py-1 bg-purple-400/10 rounded-full border border-purple-400/20"><Clock size={12} className="mr-1" />Yolda</span>;
        default:
            return <span className="text-text-muted text-xs">{status}</span>;
    }
};

const BrandBadge = ({ brand }: { brand: string }) => {
    return <span className="text-xs px-2 py-1 bg-white/5 rounded border border-white/10 text-text-muted">{brand || 'Genel'}</span>;
}

export default function Sales() {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [activeTab, setActiveTab] = useState('All');

    const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const { showToast } = useToast();

    // Fetch Stats
    const { data: stats } = useQuery({
        queryKey: ['sales-stats'],
        queryFn: salesApi.getStats
    });

    // Fetch Sales
    const { data: salesData, isLoading, error } = useQuery({
        queryKey: ['sales', page, limit, searchTerm, activeTab],
        queryFn: () => salesApi.getAll(page, limit, searchTerm, activeTab === 'All' ? '' : activeTab),
        keepPreviousData: true
    });

    const orders = salesData?.data?.map((sale: any) => ({
        id: sale.id.substring(0, 8).toUpperCase(),
        fullId: sale.id,
        customer: sale.customer ? sale.customer.name : 'Bilinmiyor',
        amount: `₺${Number(sale.totalAmount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
        status: sale.status,
        date: new Date(sale.date).toLocaleDateString('tr-TR'),
        brand: sale.items && sale.items.length > 0 ? 'Çoklu' : '-'
    })) || [];

    const totalPages = salesData?.totalPages || 1;
    const totalRecords = salesData?.total || 0;

    const handleOrderClick = (id: string, fullId: string) => {
        setSelectedOrderId(fullId);
        setIsDetailOpen(true);
    };

    const handleTabChange = (status: string) => {
        setActiveTab(status);
        setPage(1);
    };

    const TABS = [
        { label: 'Tümü', value: 'All' },
        { label: 'Bekleyen', value: 'Bekliyor' },
        { label: 'Hazırlanıyor', value: 'Hazırlanıyor' },
        { label: 'Yolda', value: 'Yolda' },
        { label: 'Teslim Edildi', value: 'Teslim Edildi' },
    ];

    if (error) return <div className="text-red-400">Error loading sales.</div>;

    // Simple Chart Data Calculation
    const total = stats?.total || 1; // avoid division by zero
    const pendingPct = ((stats?.pending || 0) / total) * 100;
    const preparingPct = ((stats?.preparing || 0) / total) * 100;
    const onWayPct = ((stats?.onWay || 0) / total) * 100;
    const deliveredPct = ((stats?.delivered || 0) / total) * 100;

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Satışlar</h1>
                        <p className="text-text-muted mt-1">Sipariş durumlarını buradan takip edebilirsiniz.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsNewSaleOpen(true)}
                            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                        >
                            <Plus size={16} className="mr-2" />
                            Yeni Sipariş
                        </button>
                    </div>
                </div>

                {/* Dashboard / Global Stats Chart */}
                <div className="bg-surface border border-accent rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">Sipariş Durum Özeti</h3>
                    <div className="flex h-4 rounded-full overflow-hidden bg-background mb-4">
                        <div style={{ width: `${pendingPct}%` }} className="bg-yellow-500/80 transition-all duration-1000" title={`Bekleyen: ${stats?.pending}`} />
                        <div style={{ width: `${preparingPct}%` }} className="bg-blue-500/80 transition-all duration-1000" title={`Hazırlanıyor: ${stats?.preparing}`} />
                        <div style={{ width: `${onWayPct}%` }} className="bg-purple-500/80 transition-all duration-1000" title={`Yolda: ${stats?.onWay}`} />
                        <div style={{ width: `${deliveredPct}%` }} className="bg-green-500/80 transition-all duration-1000" title={`Teslim Edildi: ${stats?.delivered}`} />
                    </div>
                    <div className="flex justify-between text-xs text-text-muted">
                        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-yellow-500/80 mr-2" /> Bekleyen ({stats?.pending || 0})</div>
                        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500/80 mr-2" /> Hazırlanıyor ({stats?.preparing || 0})</div>
                        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-purple-500/80 mr-2" /> Yolda ({stats?.onWay || 0})</div>
                        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500/80 mr-2" /> Teslim Edildi ({stats?.delivered || 0})</div>
                    </div>
                </div>

                <div className="flex space-x-1 bg-surface p-1 rounded-lg border border-accent inline-flex overflow-x-auto max-w-full">
                    {TABS.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => handleTabChange(tab.value)}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                                activeTab === tab.value
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-text-muted hover:text-white hover:bg-white/5"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="bg-surface border border-accent rounded-xl overflow-hidden shadow-lg relative min-h-[400px]">
                    {isLoading && (
                        <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm z-10 flex items-center justify-center">
                            <Loader2 className="animate-spin text-primary" size={32} />
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#14232a] text-text-muted font-medium border-b border-accent">
                                <tr>
                                    <th className="px-6 py-4">Sipariş No</th>
                                    <th className="px-6 py-4">Müşteri</th>
                                    <th className="px-6 py-4">Tarih</th>
                                    <th className="px-6 py-4">Tutar</th>
                                    <th className="px-6 py-4">Durum</th>
                                    <th className="px-6 py-4 text-right">Detay</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-accent">
                                {orders.length === 0 && !isLoading && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                                            Kayıt bulunamadı.
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
                                        onClick={() => handleOrderClick(order.id, order.fullId)}
                                    >
                                        <td className="px-6 py-4 font-medium text-white">#{order.id}</td>
                                        <td className="px-6 py-4 text-text-muted">{order.customer}</td>
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

                    <div className="p-4 border-t border-accent flex justify-between items-center text-xs text-text-muted">
                        <span>Toplam {totalRecords} kayıt gösteriliyor. Sayfa {page} / {totalPages}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(page > 1 ? page - 1 : 1)}
                                disabled={page === 1}
                                className="px-3 py-1 rounded bg-background border border-accent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Önceki
                            </button>
                            <span className="px-3 py-1 rounded bg-primary text-white">{page}</span>
                            <button
                                onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                                disabled={page === totalPages}
                                className="px-3 py-1 rounded bg-background border border-accent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sonraki
                            </button>
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
                title="Sipariş Detayı"
            >
                {selectedOrderId && <OrderDetail orderId={selectedOrderId} />}
            </SlideOver>
        </>
    );
}
