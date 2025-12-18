import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { purchasesApi, productsApi, suppliersApi } from '../services/api';
import { useToast } from './ui/Toast';
import { Loader2, Plus, X } from 'lucide-react';

export default function NewPurchaseForm({ onClose }: { onClose: () => void }) {
    const [selectedSupplierId, setSelectedSupplierId] = useState<number>(0);
    const [items, setItems] = useState<{ productId: number, quantity: number, unitPrice: number }[]>([]);

    // Fetch Suppliers
    const { data: suppliers } = useQuery<any[]>({
        queryKey: ['suppliers'],
        queryFn: suppliersApi.getAll,
    });

    // Fetch Products filtered by Supplier
    const { data: products } = useQuery<any[]>({
        queryKey: ['products', selectedSupplierId],
        queryFn: () => productsApi.getAll(selectedSupplierId ? selectedSupplierId : undefined),
        enabled: selectedSupplierId > 0
    });

    // Set default supplier if none selected (optional, or force user to select)
    useEffect(() => {
        if (suppliers && suppliers.length > 0 && selectedSupplierId === 0) {
            setSelectedSupplierId(suppliers[0].id);
        }
    }, [suppliers]);

    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const createPurchaseMutation = useMutation({
        mutationFn: purchasesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] });
            showToast('Sipariş başarıyla fabrikaya iletildi.', 'success');
            onClose();
        },
        onError: () => {
            showToast('Sipariş oluşturulurken bir hata oluştu.', 'error');
        }
    });

    const handleAddItem = () => {
        setItems([...items, { productId: 0, quantity: 1, unitPrice: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...items];
        if (field === 'productId') {
            const product = products?.find((p: any) => p.id === Number(value));
            newItems[index] = {
                ...newItems[index],
                productId: Number(value),
                unitPrice: product ? product.price * 0.7 : 0 // Assume buying price is 70% of selling price for mock
            };
        } else {
            newItems[index] = { ...newItems[index], [field]: Number(value) };
        }
        setItems(newItems);
    };

    const getTotalAmount = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    const handleSubmit = () => {
        const validItems = items.filter(i => i.productId !== 0 && i.quantity > 0);
        if (validItems.length === 0) {
            showToast('Lütfen en az bir ürün ekleyin.', 'error');
            return;
        }

        const selectedSupplier = suppliers?.find((s: any) => s.id === selectedSupplierId);

        const payload = {
            factoryName: selectedSupplier?.name || 'Bilinmiyor',
            items: validItems
        };

        createPurchaseMutation.mutate(payload);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm text-text-muted">Tedarikçi Fabrika / Toptancı</label>
                <select
                    value={selectedSupplierId}
                    onChange={(e) => {
                        setSelectedSupplierId(Number(e.target.value));
                        setItems([]); // Clear items when supplier changes to avoid mismatch
                    }}
                    className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                >
                    <option value={0}>Seçiniz...</option>
                    {suppliers?.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.type === 'Factory' ? 'Fabrika' : 'Toptancı'})</option>
                    ))}
                </select>
            </div>

            <div className="space-y-4 border border-accent rounded-lg p-4 bg-surface/50">
                <h4 className="text-sm font-medium text-white mb-2">Sipariş Kalemleri</h4>

                {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-6">
                            <select
                                value={item.productId}
                                onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                className="w-full bg-background border border-accent rounded px-3 py-2 text-sm text-white"
                            >
                                <option value={0}>Ürün Seçiniz</option>
                                {products?.map((p: any) => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                placeholder="Adet"
                                className="w-full bg-background border border-accent rounded px-3 py-2 text-sm text-white"
                            />
                        </div>
                        <div className="col-span-2">
                            <input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                placeholder="Birim Fiyat"
                                className="w-full bg-background border border-accent rounded px-3 py-2 text-sm text-white"
                            />
                        </div>
                        <div className="col-span-1 text-sm text-text-muted text-right">
                            ₺{(item.quantity * item.unitPrice).toLocaleString()}
                        </div>
                        <div className="col-span-1 text-right">
                            <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-400">
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                <button onClick={handleAddItem} className="text-primary text-sm hover:underline flex items-center">
                    <Plus size={16} className="mr-1" /> Yeni Satır Ekle
                </button>
            </div>

            <div className="pt-4 border-t border-accent mt-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-text-muted">Tahmini Tutar</span>
                    <span className="text-xl font-bold text-white">₺{getTotalAmount().toLocaleString('tr-TR')}</span>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={createPurchaseMutation.isPending}
                    className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center justify-center"
                >
                    {createPurchaseMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                    Siparişi Gönder
                </button>
            </div>
        </div>
    );
}
