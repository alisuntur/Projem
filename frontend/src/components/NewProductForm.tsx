import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../services/api';
import { useToast } from './ui/Toast';
import { Loader2 } from 'lucide-react';

export default function NewProductForm({ onClose }: { onClose: () => void }) {
    const [formData, setFormData] = useState({
        name: '',
        brand: 'Merinos',
        sku: '',
        size: '160x230',
        stock: 0,
        price: 0,
        category: 'Halı',
        stock: 0,
        price: 0,
        category: 'Halı',
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
        createProductMutation.mutate(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'stock' || name === 'price' ? Number(value) : value
        }));
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm text-text-muted">Ürün Adı</label>
                <input name="name" onChange={handleChange} value={formData.name} type="text" className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="Örn: Valeri Serisi" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Marka</label>
                    <select name="brand" onChange={handleChange} value={formData.brand} className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary">
                        <option>Merinos</option>
                        <option>Padişah</option>
                        <option>Brillant</option>
                        <option>Diğer</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">SKU Kodu</label>
                    <input name="sku" onChange={handleChange} value={formData.sku} type="text" className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="SKU-123" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Ebat</label>
                    <select name="size" onChange={handleChange} value={formData.size} className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary">
                        <option>80x150</option>
                        <option>160x230</option>
                        <option>200x290</option>
                        <option>120x180</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Stok Miktarı</label>
                    <input name="stock" onChange={handleChange} value={formData.stock} type="number" className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-text-muted">Satış Fiyatı (₺)</label>
                <input name="price" onChange={handleChange} value={formData.price} type="number" className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
            </div>

            <div className="space-y-2">
                <label className="text-sm text-text-muted">Görsel URL</label>
                <input name="imageUrl" onChange={handleChange} value={formData.imageUrl} type="text" placeholder="https://..." className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
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
