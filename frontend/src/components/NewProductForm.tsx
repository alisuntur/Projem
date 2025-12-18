import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../services/api';
import { useToast } from './ui/Toast';
import { Loader2 } from 'lucide-react';

export default function NewProductForm({ onClose }: { onClose: () => void }) {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        sku: '',
        width: '',
        height: '',
        stock: 0,
        price: 0,
        category: '',
        criticalLevel: 10,
        imageUrl: ''
    });

    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const createProductMutation = useMutation({
        mutationFn: productsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            showToast('Ürün başarıyla eklendi.', 'success');
            onClose();
        },
        onError: () => {
            showToast('Ürün eklenirken bir hata oluştu.', 'error');
        }
    });

    const handleSubmit = async () => {
        if (!formData.name) {
            showToast('Lütfen ürün adı giriniz.', 'error');
            return;
        }
        if (!formData.sku) {
            showToast('Lütfen stok kodu giriniz.', 'error');
            return;
        }
        if (!formData.brand) {
            showToast('Lütfen marka giriniz.', 'error');
            return;
        }

        // Build payload with computed size
        const payload = {
            ...formData,
            width: formData.width ? Number(formData.width) : null,
            height: formData.height ? Number(formData.height) : null,
            size: formData.width && formData.height ? `${formData.width}x${formData.height}` : null
        };

        createProductMutation.mutate(payload);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'stock' || name === 'price' || name === 'criticalLevel' ? Number(value) : value
        }));
    };

    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <label className="text-sm text-text-muted">Ürün Adı *</label>
                <input
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                    type="text"
                    className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    placeholder="Örn: Valeri Serisi"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Marka *</label>
                    <input
                        name="brand"
                        onChange={handleChange}
                        value={formData.brand}
                        type="text"
                        className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        placeholder="Örn: Merinos"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Stok Kodu (SKU) *</label>
                    <input
                        name="sku"
                        onChange={handleChange}
                        value={formData.sku}
                        type="text"
                        className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        placeholder="Örn: MER-VAL-001"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-text-muted">Ebat (En x Boy - cm)</label>
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <input
                            name="width"
                            onChange={handleChange}
                            value={formData.width}
                            type="number"
                            step="0.01"
                            className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary pr-12"
                            placeholder="En"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">cm</span>
                    </div>
                    <div className="relative">
                        <input
                            name="height"
                            onChange={handleChange}
                            value={formData.height}
                            type="number"
                            step="0.01"
                            className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary pr-12"
                            placeholder="Boy"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">cm</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Kategori</label>
                    <input
                        name="category"
                        onChange={handleChange}
                        value={formData.category}
                        type="text"
                        className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        placeholder="Örn: Halı, Kilim"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Stok Miktarı</label>
                    <input
                        name="stock"
                        onChange={handleChange}
                        value={formData.stock}
                        type="number"
                        min="0"
                        className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Satış Fiyatı (₺)</label>
                    <input
                        name="price"
                        onChange={handleChange}
                        value={formData.price}
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Kritik Stok Seviyesi</label>
                    <input
                        name="criticalLevel"
                        onChange={handleChange}
                        value={formData.criticalLevel}
                        type="number"
                        min="0"
                        className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-text-muted">Görsel URL (Opsiyonel)</label>
                <input
                    name="imageUrl"
                    onChange={handleChange}
                    value={formData.imageUrl}
                    type="text"
                    placeholder="https://..."
                    className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                />
            </div>

            <div className="pt-4">
                <button
                    onClick={handleSubmit}
                    disabled={createProductMutation.isPending}
                    className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center justify-center"
                >
                    {createProductMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                    Ürünü Kaydet
                </button>
            </div>
        </div>
    );
}
