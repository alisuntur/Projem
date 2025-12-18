import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '../services/api';
import { Package, Truck, CheckCircle2, User, MapPin, Calendar, CreditCard, Loader2, Edit } from 'lucide-react';
import { useToast } from './ui/Toast';

export default function OrderDetail({ orderId }: { orderId: string }) {
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const [isEditingStatus, setIsEditingStatus] = useState(false);

    const { data: sale, isLoading } = useQuery({
        queryKey: ['sale', orderId],
        queryFn: () => salesApi.getOne(orderId),
        enabled: !!orderId
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) => salesApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sale', orderId] });
            queryClient.invalidateQueries({ queryKey: ['sales'] }); // Refresh list
            showToast('Sipariş durumu güncellendi.', 'success');
            setIsEditingStatus(false);
        },
        onError: () => showToast('Durum güncellenemedi.', 'error')
    });

    if (!orderId) return null;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                <Loader2 className="animate-spin mb-2" size={32} />
                <span className="text-sm">Sipariş detayları yükleniyor...</span>
            </div>
        );
    }

    if (!sale) {
        return <div className="text-center py-8 text-text-muted">Sipariş bulunamadı.</div>;
    }

    const steps = ['Bekliyor', 'Hazırlanıyor', 'Yolda', 'Teslim Edildi'];
    const currentStepIndex = steps.indexOf(sale.status) === -1 ? 0 : steps.indexOf(sale.status);

    return (
        <div className="space-y-6">
            {/* Status Flow */}
            <div className="flex justify-between items-center relative py-4">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-accent -z-10" />
                {steps.map((step, i) => (
                    <div key={step} className="flex flex-col items-center gap-2 bg-surface px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= currentStepIndex ? 'bg-primary text-white' : 'bg-surface border-2 border-accent text-text-muted'}`}>
                            {i <= currentStepIndex ? <CheckCircle2 size={16} /> : i + 1}
                        </div>
                        <span className="text-xs text-text-muted hidden md:block">{step}</span>
                    </div>
                ))}
            </div>

            {/* Manual Status Update */}
            <div className="bg-surface border border-accent p-4 rounded-lg flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-medium text-white">Sipariş Durumu</h4>
                    <p className="text-xs text-text-muted">Şu anki durum: <span className="text-primary">{sale.status}</span></p>
                </div>
                {isEditingStatus ? (
                    <div className="flex gap-2">
                        <select
                            className="bg-background border border-accent rounded text-sm text-white px-2 py-1"
                            defaultValue={sale.status}
                            onChange={(e) => updateStatusMutation.mutate({ id: orderId, status: e.target.value })}
                        >
                            {steps.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button onClick={() => setIsEditingStatus(false)} className="text-xs text-red-400">İptal</button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditingStatus(true)}
                        className="text-sm text-primary hover:text-primary-hover flex items-center"
                    >
                        <Edit size={14} className="mr-1" /> Değiştir
                    </button>
                )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface border border-accent rounded-lg p-4 space-y-3">
                    <div className="flex items-center text-text-muted text-xs uppercase tracking-wider font-semibold">
                        <User size={14} className="mr-2" /> Müşteri
                    </div>
                    <div>
                        <p className="text-white font-medium">{sale.customer?.name || 'Bilinmeyen Müşteri'}</p>
                        <p className="text-xs text-text-muted">{sale.customer?.contactPerson || '-'}</p>
                    </div>
                </div>
                <div className="bg-surface border border-accent rounded-lg p-4 space-y-3">
                    <div className="flex items-center text-text-muted text-xs uppercase tracking-wider font-semibold">
                        <MapPin size={14} className="mr-2" /> Teslimat
                    </div>
                    <div>
                        <p className="text-white text-sm">{sale.customer?.city || '-'} / {sale.customer?.district || '-'}</p>
                        <p className="text-text-muted text-xs truncate max-w-[200px]">{sale.customer?.address || 'Adres bilgisi yok'}</p>
                    </div>
                </div>
            </div>

            {/* Item List */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center">
                    <Package size={16} className="mr-2 text-primary" />
                    Sipariş İçeriği
                </h3>
                <div className="bg-surface border border-accent rounded-lg overflow-hidden">
                    {sale.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border-b border-accent last:border-0 hover:bg-white/5 transition-colors">
                            <div>
                                <p className="text-sm text-white font-medium">{item.productName}</p>
                                <p className="text-xs text-text-muted">Adet: {item.quantity} x ₺{Number(item.unitPrice).toLocaleString('tr-TR')}</p>
                            </div>
                            <p className="text-white font-bold">₺{Number(item.totalPrice).toLocaleString('tr-TR')}</p>
                        </div>
                    ))}

                    <div className="p-4 bg-primary/10 border-t border-primary/20 flex justify-between items-center">
                        <span className="text-primary font-bold">Genel Toplam:</span>
                        <span className="text-xl font-bold text-white">₺{Number(sale.totalAmount).toLocaleString('tr-TR')}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
                <button className="flex items-center justify-center py-3 bg-surface border border-accent rounded-lg text-text-muted hover:text-white transition-colors opacity-50 cursor-not-allowed">
                    <Calendar size={16} className="mr-2" />
                    Geçmişi Gör
                </button>
                <button
                    onClick={() => showToast('Bu özellik yakında eklenecek.', 'info')}
                    className="flex items-center justify-center py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                >
                    <Truck size={16} className="mr-2" />
                    Kargo Takip No Gir
                </button>
            </div>
        </div>
    );
}


