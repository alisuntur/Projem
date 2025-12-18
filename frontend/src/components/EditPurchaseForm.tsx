import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { purchasesApi } from '../services/api';
import { useToast } from './ui/Toast';
import { Loader2, Save } from 'lucide-react';

interface EditPurchaseFormProps {
    purchase: any;
    onClose: () => void;
}

export default function EditPurchaseForm({ purchase, onClose }: EditPurchaseFormProps) {
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        if (purchase?.items) {
            setItems(purchase.items.map((item: any) => ({
                id: item.id,
                productSku: item.productSku,
                quantity: item.quantity,
                unitPrice: item.unitPrice
            })));
        }
    }, [purchase]);

    const updateMutation = useMutation({
        mutationFn: (data: any) => purchasesApi.update(purchase.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] });
            showToast('Satın alma güncellendi.', 'success');
            onClose();
        },
        onError: () => {
            showToast('Güncelleme başarısız.', 'error');
        }
    });

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: Number(value) };
        setItems(newItems);
    };

    const handleSubmit = () => {
        updateMutation.mutate({ items });
    };

    return (
        <div className="space-y-6">
            <div className="bg-surface border border-accent rounded-lg p-4">
                <p className="text-sm text-text-muted mb-1">Tedarikçi</p>
                <p className="text-white font-medium">{purchase.factoryName}</p>
            </div>

            <div className="space-y-4">
                <h3 className="text-white font-medium">Kalemler</h3>

                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={item.id} className="bg-background border border-accent rounded-lg p-4 space-y-3">
                            <p className="text-white font-medium">{item.productSku}</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-text-muted mb-1">Adet</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        className="w-full bg-surface border border-accent rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-text-muted mb-1">Birim Fiyat (₺)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.unitPrice}
                                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                        className="w-full bg-surface border border-accent rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div className="text-right text-sm text-text-muted">
                                Toplam: <span className="text-white font-medium">₺{(item.quantity * item.unitPrice).toLocaleString('tr-TR')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-surface border border-accent rounded-lg p-4 flex justify-between items-center">
                <span className="text-text-muted">Genel Toplam:</span>
                <span className="text-xl font-bold text-white">
                    ₺{items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toLocaleString('tr-TR')}
                </span>
            </div>

            <button
                onClick={handleSubmit}
                disabled={updateMutation.isPending}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center justify-center"
            >
                {updateMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                Değişiklikleri Kaydet
            </button>
        </div>
    );
}
