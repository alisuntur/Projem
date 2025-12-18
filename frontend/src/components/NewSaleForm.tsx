import { useState } from 'react';
import { Search, MapPin, X, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi, productsApi, salesApi } from '../services/api';
import { useToast } from './ui/Toast';

export default function NewSaleForm({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState(1);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [cart, setCart] = useState<{ id: number, name: string, qty: number, price: number }[]>([]);

    const queryClient = useQueryClient();
    const { showToast } = useToast();

    // Fetch Customers
    const { data: customers } = useQuery({
        queryKey: ['customers'],
        queryFn: customersApi.getAll,
    });

    // Fetch Products
    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: productsApi.getAll,
    });

    const getSelectedCustomerName = () => {
        return customers?.find((c: any) => c.id === selectedCustomerId)?.name || 'Müşteri';
    };

    const getTotalAmount = () => {
        return cart.reduce((total, item) => total + (item.price * item.qty), 0);
    };

    const addToCart = (product: any) => {
        if (product.stock <= 0) {
            showToast('Bu ürün stokta yok!', 'error');
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                // Check stock limit
                if (existing.qty + 1 > product.stock) {
                    showToast(`Stok yetersiz! Maksimum ${product.stock} adet alabilirsiniz.`, 'error');
                    return prev;
                }
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { id: product.id, name: product.name, qty: 1, price: product.price }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    // Mutation
    const createSaleMutation = useMutation({
        mutationFn: salesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales'] }); // Refresh sales list
            queryClient.invalidateQueries({ queryKey: ['products'] }); // Refresh stock
            queryClient.invalidateQueries({ queryKey: ['customers'] }); // Refresh balance
            showToast('Sipariş başarıyla oluşturuldu.', 'success');
            onClose();
        },
        onError: (err: any) => {
            const message = err.response?.data?.message || 'Sipariş oluşturulurken bir hata oluştu.';
            showToast(message, 'error');
        }
    });

    const handleSubmit = () => {
        if (!selectedCustomerId || cart.length === 0) return;

        const payload = {
            customerId: selectedCustomerId,
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.qty
            }))
        };

        createSaleMutation.mutate(payload);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)]">
            {/* Steps Indicator */}
            <div className="flex items-center mb-8 px-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-surface border border-accent text-text-muted'}`}>1</div>
                <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-surface border-t border-accent'}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-surface border border-accent text-text-muted'}`}>2</div>
                <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary' : 'bg-surface border-t border-accent'}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-surface border border-accent text-text-muted'}`}>3</div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            <h3 className="text-lg font-bold text-white mb-4">Müşteri Seçimi</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input type="text" placeholder="Müşteri ara..." className="w-full bg-background border border-accent rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary" />
                            </div>
                            <div className="space-y-2">
                                {customers?.map((c: any) => (
                                    <div
                                        key={c.id}
                                        onClick={() => setSelectedCustomerId(c.id)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-colors flex justify-between items-center ${selectedCustomerId === c.id ? 'bg-primary/20 border-primary' : 'bg-background border-accent hover:border-primary/50'}`}
                                    >
                                        <div>
                                            <p className="text-white font-medium">{c.name}</p>
                                            <span className="text-xs text-text-muted flex items-center mt-1">
                                                <MapPin size={10} className="mr-1" /> {c.city || 'Şehir Belirtilmemiş'}
                                            </span>
                                        </div>
                                        <span className={`text-sm font-bold ${c.balance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            ₺{Number(c.balance).toLocaleString('tr-TR')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            <h3 className="text-lg font-bold text-white mb-4">Ürün Seçimi</h3>
                            <div className="space-y-2">
                                {products?.map((p: any) => (
                                    <div key={p.id} className="p-3 bg-background border border-accent rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="text-white text-sm font-medium">{p.name}</p>
                                            <p className="text-xs text-text-muted">Stok: {p.stock} | ₺{p.price}</p>
                                        </div>
                                        <button
                                            onClick={() => addToCart(p)}
                                            className="w-8 h-8 rounded-full bg-surface border border-accent flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {cart.length > 0 && (
                                <div className="mt-6 border-t border-accent pt-4">
                                    <h4 className="text-sm text-text-muted mb-2">Sepetim ({cart.length})</h4>
                                    {cart.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm text-white mb-2 p-2 bg-white/5 rounded">
                                            <span>{item.name} (x{item.qty})</span>
                                            <div className="flex items-center gap-2">
                                                <span>₺{item.price * item.qty}</span>
                                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400"><X size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="mt-4 text-right text-lg font-bold text-primary">
                                        Toplam: ₺{getTotalAmount().toLocaleString('tr-TR')}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="text-center py-10"
                        >
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Plus size={40} className="text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Sipariş Özeti</h3>
                            <p className="text-text-muted mb-8">
                                <strong>{getSelectedCustomerName()}</strong> için <strong>₺{getTotalAmount().toLocaleString('tr-TR')}</strong> tutarında sipariş oluşturulacak.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-accent flex justify-between gap-4">
                <button
                    onClick={step === 1 ? onClose : () => setStep(s => s - 1)}
                    className="flex-1 py-3 bg-surface border border-accent rounded-lg text-text-muted hover:text-white transition-colors"
                >
                    {step === 1 ? 'İptal' : 'Geri'}
                </button>
                <button
                    onClick={() => step < 3 ? setStep(s => s + 1) : handleSubmit()}
                    disabled={createSaleMutation.isPending || (step === 1 && !selectedCustomerId) || (step === 2 && cart.length === 0)}
                    className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center justify-center"
                >
                    {createSaleMutation.isPending && step === 3 ? <Loader2 className="animate-spin mr-2" /> : null}
                    {step === 3 ? 'Siparişi Onayla' : 'Devam Et'}
                </button>
            </div>
        </div>
    );
}
