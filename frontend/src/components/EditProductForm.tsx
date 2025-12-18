import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../services/api';
import { useToast } from './ui/Toast';
import { Loader2 } from 'lucide-react';

interface EditProductFormProps {
    product: any;
    onClose: () => void;
}

export default function EditProductForm({ product, onClose }: EditProductFormProps) {
    const [formData, setFormData] = useState({
        stock: 0,
        price: 0,
        criticalLevel: 10,
        size: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                stock: product.stock,
                price: product.rawPrice ? Number(product.rawPrice) : 0,
                criticalLevel: product.criticalLevel || 10,
                size: product.size || '',
                imageUrl: product.image || '' // Note: mapped as 'image' in UI model, 'imageUrl' in backend often
            });
            // Better to use raw product data if possible, but we might rely on what's passed.
            // Let's assume 'product' prop comes from the inventory list which has mapped keys.
            // We need to be careful about mapping back to backend DTO.
            // Actually, best practice: 'product' prop should be the raw entity or close to it.
            // In Inventory.tsx, we map it. Let's try to handle the UI model values.
        }
    }, [product]);

    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const updateProductMutation = useMutation({
        mutationFn: (data: any) => productsApi.update(product.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            showToast('Ürün başarıyla güncellendi.', 'success');
            onClose();
        },
        onError: () => {
            showToast('Ürün güncellenirken hata oluştu.', 'error');
        }
    });

    const handleSubmit = async () => {
        updateProductMutation.mutate(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'stock' || name === 'price' || name === 'criticalLevel' ? Number(value) : value
        }));
    };

    return (
        <div className="space-y-6">
            <div className="bg-surface/50 p-4 rounded-lg border border-accent mb-4">
                <h3 className="text-white font-bold">{product?.name}</h3>
                <p className="text-sm text-text-muted">{product?.brand} - {product?.sku}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Stok Miktarı</label>
                    <input name="stock" onChange={handleChange} value={formData.stock} type="number" className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Kritik Stok Seviyesi</label>
                    <input name="criticalLevel" onChange={handleChange} value={formData.criticalLevel} type="number" className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Satış Fiyatı (₺)</label>
                    <input name="price" onChange={handleChange} value={formData.price} type="number" className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Ebat</label>
                    <select name="size" onChange={handleChange} value={formData.size} className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary">
                        <option value="">Seçiniz</option>
                        <option value="80x150">80x150</option>
                        <option value="160x230">160x230</option>
                        <option value="200x290">200x290</option>
                        <option value="120x180">120x180</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-text-muted">Görsel URL</label>
                <input name="imageUrl" onChange={handleChange} value={formData.imageUrl} type="text" placeholder="https://..." className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
                <p className="text-xs text-text-muted">Şimdilik harici URL desteği</p>
            </div>

            <div className="pt-4">
                <button
                    onClick={handleSubmit}
                    disabled={updateProductMutation.isPending}
                    className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center justify-center"
                >
                    {updateProductMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                    Değişiklikleri Kaydet
                </button>
            </div>
        </div>
    );
}
