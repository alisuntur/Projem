import { useQuery } from '@tanstack/react-query';
import { salesApi } from '../services/api';
import { Package, Truck, CheckCircle2, User, MapPin, Calendar, CreditCard, Loader2 } from 'lucide-react';

export default function OrderDetail({ orderId }: { orderId: string }) {
    const { data: sale, isLoading } = useQuery({
        queryKey: ['sale', orderId],
        queryFn: () => salesApi.getOne(orderId),
        enabled: !!orderId
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

    const steps = ['Bekliyor', 'Hazırlanıyor', 'Kargoda', 'Teslim Edildi'];
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
                        <span className="text-xs text-text-muted">{step}</span>
                    </div>
                ))}
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
                <button className="flex items-center justify-center py-3 bg-surface border border-accent rounded-lg text-text-muted hover:text-white transition-colors">
                    <Calendar size={16} className="mr-2" />
                    Geçmişi Gör
                </button>
                <button className="flex items-center justify-center py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                    <Truck size={16} className="mr-2" />
                    Kargo Takip
                </button>
            </div>
        </div>
    );
}
