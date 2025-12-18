import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchasesApi } from '../services/api';
import {
    Search,
    Plus,
    Truck,
    CheckCircle2,
    Download,
    Factory,
    Loader2,
    Pencil
} from 'lucide-react';
import { motion } from 'framer-motion';
import SlideOver from '../components/SlideOver';
import NewPurchaseForm from '../components/NewPurchaseForm';
import EditPurchaseForm from '../components/EditPurchaseForm';
import { useToast } from '../components/ui/Toast';

export default function Purchases() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);
    const [editingPurchase, setEditingPurchase] = useState<any>(null);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { data: purchases, isLoading } = useQuery({
        queryKey: ['purchases'],
        queryFn: purchasesApi.getAll,
    });

    const receiveMutation = useMutation({
        mutationFn: purchasesApi.receive,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] });
            queryClient.invalidateQueries({ queryKey: ['products'] }); // Stock updates
            showToast('Ürünler stoka eklendi.', 'success');
        },
        onError: () => {
            showToast('İşlem başarısız oldu.', 'error');
        }
    });

    const handleReceive = (id: string) => {
        if (confirm('Ürünleri teslim aldığınızı onaylıyor musunuz? Stoklarınız artacaktır.')) {
            receiveMutation.mutate(id);
        }
    }

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) => purchasesApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] });
            showToast('Sipariş durumu güncellendi.', 'success');
        },
        onError: () => {
            showToast('Durum güncellenirken hata oluştu.', 'error');
        }
    });

    const handleStatusChange = (id: string, newStatus: string) => {
        // Find current purchase
        const currentPurchase = purchases?.find((p: any) => p.id === id);

        if (currentPurchase?.status === 'Teslim Alındı') {
            const password = prompt('Teslim alınmış siparişi güncellemek için yönetici parolası giriniz:');
            if (password !== '1234') {
                showToast('Hatalı parola! İşlem iptal edildi.', 'error');
                return; // Abort
            }
        }

        updateStatusMutation.mutate({ id, status: newStatus });
    }

    const filteredPurchases = purchases?.map((p: any) => ({
        id: p.id.substring(0, 8).toUpperCase(),
        fullId: p.id,
        factory: p.factoryName || 'Bilinmiyor',
        date: new Date(p.date).toLocaleDateString('tr-TR'),
        items: p.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0,
        amount: `₺${Number(p.totalAmount).toLocaleString('tr-TR')}`,
        status: p.status
    })) || [];

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Satın Alma (Fabrika)</h1>
                        <p className="text-text-muted mt-1">Fabrikalardan verilen siparişlerinizi ve tedarik sürecini yönetin.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => showToast('Rapor indiriliyor...', 'success')}
                            className="flex items-center px-4 py-2 bg-surface border border-accent rounded-lg text-sm hover:bg-accent transition-colors text-white"
                        >
                            <Download size={16} className="mr-2" />
                            Rapor
                        </button>
                        <button
                            onClick={() => setIsNewPurchaseOpen(true)}
                            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                        >
                            <Plus size={16} className="mr-2" />
                            Yeni Sipariş Ver
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Mock KPIs for visual consistency until backend endpoint exists */}
                    <div className="bg-surface p-4 rounded-xl border border-accent flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                            <Factory size={24} />
                        </div>
                        <div>
                            <p className="text-text-muted text-sm">Bekleyen Siparişler</p>
                            <p className="text-xl font-bold text-white">{filteredPurchases.filter((p: any) => p.status === 'Sipariş Verildi' || p.status === 'Üretimde').length} Adet</p>
                        </div>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-accent flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-text-muted text-sm">Bu Ay Teslim Alınan</p>
                            <p className="text-xl font-bold text-white">{filteredPurchases.filter((p: any) => p.status === 'Teslim Alındı').length} Adet</p>
                        </div>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-accent flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500">
                            <Truck size={24} />
                        </div>
                        <div>
                            <p className="text-text-muted text-sm">Yoldaki Ürünler</p>
                            <p className="text-xl font-bold text-white">{filteredPurchases.filter((p: any) => p.status === 'Yolda').length} Adet</p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-surface border border-accent rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-accent flex gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                type="text"
                                placeholder="Sipariş no veya fabrika ara..."
                                className="w-full bg-background border border-accent rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary placeholder-text-muted"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#14232a] text-text-muted font-medium">
                                <tr>
                                    <th className="px-6 py-4">Sipariş No</th>
                                    <th className="px-6 py-4">Fabrika</th>
                                    <th className="px-6 py-4">Tarih</th>
                                    <th className="px-6 py-4">Ürün Adedi</th>
                                    <th className="px-6 py-4">Tutar</th>
                                    <th className="px-6 py-4">Durum</th>
                                    <th className="px-6 py-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-accent">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                                            <div className="flex items-center justify-center">
                                                <Loader2 className="animate-spin mr-2" /> Yükleniyor...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredPurchases.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                                            Henüz sipariş bulunmuyor.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPurchases.map((item: any, index: number) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4 font-mono text-white">#{item.id}</td>
                                            <td className="px-6 py-4 font-medium text-white">{item.factory}</td>
                                            <td className="px-6 py-4 text-text-muted">{item.date}</td>
                                            <td className="px-6 py-4 text-white">{item.items}</td>
                                            <td className="px-6 py-4 text-white font-bold">{item.amount}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleStatusChange(item.fullId, e.target.value)}
                                                    className="bg-transparent text-xs border border-accent rounded px-2 py-1 text-white focus:border-primary focus:outline-none [&>option]:bg-surface"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <option value="Sipariş Verildi">Sipariş Verildi</option>
                                                    <option value="Üretimde">Üretimde</option>
                                                    <option value="Yolda">Yolda</option>
                                                    <option value="Teslim Alındı">Teslim Alındı</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => {
                                                        const fullPurchase = purchases?.find((p: any) => p.id === item.fullId);
                                                        setEditingPurchase(fullPurchase);
                                                    }}
                                                    className="text-yellow-400 hover:text-yellow-300 transition-colors text-xs border border-yellow-400/30 hover:border-yellow-300/50 px-2 py-1 rounded bg-yellow-400/10"
                                                >
                                                    <Pencil size={12} className="inline mr-1" />
                                                    Düzenle
                                                </button>
                                                {item.status !== 'Teslim Alındı' && (
                                                    <button
                                                        onClick={() => handleReceive(item.fullId)}
                                                        className="text-primary hover:text-green-400 transition-colors text-xs border border-primary/30 hover:border-green-400/50 px-2 py-1 rounded bg-primary/10"
                                                        disabled={receiveMutation.isPending}
                                                    >
                                                        Teslim Al
                                                    </button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    )))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <SlideOver
                isOpen={isNewPurchaseOpen}
                onClose={() => setIsNewPurchaseOpen(false)}
                title="Fabrika Siparişi Oluştur (Satın Alma)"
            >
                <NewPurchaseForm onClose={() => setIsNewPurchaseOpen(false)} />
            </SlideOver>

            <SlideOver
                isOpen={!!editingPurchase}
                onClose={() => setEditingPurchase(null)}
                title="Satın Alma Düzenle"
            >
                {editingPurchase && <EditPurchaseForm purchase={editingPurchase} onClose={() => setEditingPurchase(null)} />}
            </SlideOver>
        </>
    );
}
