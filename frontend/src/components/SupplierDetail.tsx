import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suppliersApi, productsApi } from '../services/api';
import { Loader2, Plus, X, Search } from 'lucide-react';
import { useToast } from './ui/Toast';

export default function SupplierDetail({ id }: { id: number }) {
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const [isAddMode, setIsAddMode] = useState(false);
    const [productSearch, setProductSearch] = useState('');

    const { data: supplier, isLoading } = useQuery({
        queryKey: ['supplier', id],
        queryFn: () => suppliersApi.getOne(id),
    });

    const { data: allProducts } = useQuery({
        queryKey: ['products'],
        queryFn: productsApi.getAll,
        enabled: isAddMode
    });

    const addProductMutation = useMutation({
        mutationFn: ({ supplierId, productId }: { supplierId: number, productId: number }) => suppliersApi.addProduct(supplierId, productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['supplier', id] });
            showToast('Ürün kataloğa eklendi.', 'success');
            setIsAddMode(false);
        }
    });

    const removeProductMutation = useMutation({
        mutationFn: ({ supplierId, productId }: { supplierId: number, productId: number }) => suppliersApi.removeProduct(supplierId, productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['supplier', id] });
            showToast('Ürün katalogdan çıkarıldı.', 'success');
        }
    });

    if (isLoading) return <div className="text-center p-8"><Loader2 className="animate-spin mx-auto text-primary" /></div>;
    if (!supplier) return <div className="text-text-muted text-center">Tedarikçi bulunamadı.</div>;

    const existingProductIds = new Set(supplier.products?.map((p: any) => p.id));

    // Filter products not already in supplier's catalog
    const availableProducts = allProducts?.filter((p: any) =>
        !existingProductIds.has(p.id) &&
        p.name.toLowerCase().includes(productSearch.toLowerCase())
    ) || [];

    return (
        <div className="space-y-6">
            <div className="bg-surface/50 p-4 rounded-lg border border-accent space-y-2">
                <div>
                    <span className="text-xs text-text-muted uppercase tracking-wider">Tip</span>
                    <p className="text-white">{supplier.type === 'Factory' ? 'Fabrika' : 'Toptancı'}</p>
                </div>
                <div>
                    <span className="text-xs text-text-muted uppercase tracking-wider">İletişim</span>
                    <p className="text-white">{supplier.contactInfo || '-'}</p>
                </div>
                <div>
                    <span className="text-xs text-text-muted uppercase tracking-wider">Adres</span>
                    <p className="text-white text-sm">{supplier.address || '-'}</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">Ürün Kataloğu ({supplier.products?.length || 0})</h3>
                    <button
                        onClick={() => setIsAddMode(!isAddMode)}
                        className="text-xs text-primary hover:text-primary-hover flex items-center border border-primary/30 px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                    >
                        {isAddMode ? <><X size={12} className="mr-1" /> İptal</> : <><Plus size={12} className="mr-1" /> Ürün Ekle</>}
                    </button>
                </div>

                {isAddMode && (
                    <div className="bg-background border border-accent rounded-lg p-3 animate-in fade-in slide-in-from-top-2">
                        <div className="relative mb-2">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                autoFocus
                                placeholder="Ürün ara..."
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                className="w-full bg-surface border border-accent rounded px-3 pl-9 py-2 text-xs text-white"
                            />
                        </div>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                            {availableProducts.map((p: any) => (
                                <button
                                    key={p.id}
                                    onClick={() => addProductMutation.mutate({ supplierId: id, productId: p.id })}
                                    className="w-full text-left flex items-center justify-between p-2 hover:bg-white/5 rounded text-sm text-text-muted hover:text-white transition-colors"
                                >
                                    <span>{p.name} ({p.brand})</span>
                                    <Plus size={14} />
                                </button>
                            ))}
                            {availableProducts.length === 0 && (
                                <p className="text-xs text-text-muted text-center py-2">Eklenecek ürün bulunamadı.</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    {supplier.products?.length === 0 ? (
                        <p className="text-text-muted text-sm italic">Bu tedarikçiye henüz ürün tanımlanmamış.</p>
                    ) : (
                        supplier.products?.map((product: any) => (
                            <div key={product.id} className="flex items-center justify-between bg-background border border-accent p-3 rounded-lg group hover:border-white/20 transition-colors">
                                <div>
                                    <p className="text-white text-sm font-medium">{product.name}</p>
                                    <p className="text-text-muted text-xs">{product.brand} - {product.size}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (confirm('Ürünü katalogdan çıkarmak istiyor musunuz?'))
                                            removeProductMutation.mutate({ supplierId: id, productId: product.id })
                                    }}
                                    className="text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
