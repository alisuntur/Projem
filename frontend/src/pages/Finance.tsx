import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeApi, customersApi, suppliersApi } from '../services/api';
import { Wallet, TrendingUp, TrendingDown, Plus, Minus, History } from 'lucide-react';
import SlideOver from '../components/SlideOver';
import { useToast } from '../components/ui/Toast';

export default function Finance() {
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');

    const { data: stats } = useQuery({ queryKey: ['finance-stats'], queryFn: financeApi.getStats });
    const { data: history } = useQuery({ queryKey: ['finance-history'], queryFn: financeApi.getHistory });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Finans</h1>
                    <p className="text-text-muted mt-1">Nakit akışı ve borç/alacak yönetimi.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => { setTransactionType('income'); setIsPaymentOpen(true); }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                        <Plus size={18} className="mr-2" />
                        Tahsilat Ekle
                    </button>
                    <button
                        onClick={() => { setTransactionType('expense'); setIsPaymentOpen(true); }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                        <Minus size={18} className="mr-2" />
                        Ödeme Yap
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface border border-accent rounded-xl p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-text-muted text-sm font-medium">Toplam Alacak (Müşteriler)</p>
                            <h3 className="text-3xl font-bold text-white mt-2">₺{Number(stats?.totalReceivables || 0).toLocaleString('tr-TR')}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-surface border border-accent rounded-xl p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-text-muted text-sm font-medium">Toplam Borç (Tedarikçiler)</p>
                            <h3 className="text-3xl font-bold text-white mt-2">₺{Number(stats?.totalPayables || 0).toLocaleString('tr-TR')}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
                            <TrendingDown size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-surface border border-accent rounded-xl overflow-hidden">
                <div className="p-6 border-b border-accent flex items-center">
                    <History size={20} className="text-primary mr-2" />
                    <h3 className="font-semibold text-white">Son İşlemler</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#14232a] text-text-muted font-medium border-b border-accent">
                            <tr>
                                <th className="px-6 py-4">Tarih</th>
                                <th className="px-6 py-4">Tür</th>
                                <th className="px-6 py-4">Kişi/Kurum</th>
                                <th className="px-6 py-4">Açıklama</th>
                                <th className="px-6 py-4 text-right">Tutar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-accent">
                            {history?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-text-muted">İşlem kaydı bulunamadı.</td>
                                </tr>
                            )}
                            {history?.map((item: any) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-text-muted">{new Date(item.date).toLocaleDateString('tr-TR')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.type === 'income' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {item.type === 'income' ? 'Tahsilat' : 'Ödeme'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-white">{item.partyName || '-'}</td>
                                    <td className="px-6 py-4 text-text-muted">{item.description}</td>
                                    <td className={`px-6 py-4 text-right font-medium ${item.type === 'income' ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        {item.type === 'income' ? '+' : '-'}₺{Number(item.amount).toLocaleString('tr-TR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <SlideOver
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                title={transactionType === 'income' ? 'Yeni Tahsilat Ekle' : 'Yeni Ödeme Yap'}
            >
                <NewPaymentForm
                    type={transactionType}
                    onClose={() => setIsPaymentOpen(false)}
                />
            </SlideOver>
        </div>
    );
}

function NewPaymentForm({ type, onClose }: { type: 'income' | 'expense', onClose: () => void }) {
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const [partyId, setPartyId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [method, setMethod] = useState('cash');

    // Fetch parties based on type
    // Income -> Customers, Expense -> Suppliers
    const { data: customers } = useQuery({
        queryKey: ['customers'],
        queryFn: customersApi.getAll,
        enabled: type === 'income'
    });

    const { data: suppliers } = useQuery({
        queryKey: ['suppliers'],
        queryFn: suppliersApi.getAll,
        enabled: type === 'expense'
    });

    const mutation = useMutation({
        mutationFn: financeApi.addPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['finance-stats'] });
            queryClient.invalidateQueries({ queryKey: ['finance-history'] });
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            showToast('İşlem başarıyla kaydedildi.', 'success');
            onClose();
        },
        onError: () => showToast('İşlem kaydedilemedi.', 'error')
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!partyId || !amount) {
            showToast('Lütfen kişi ve tutar seçiniz.', 'error');
            return;
        }

        mutation.mutate({
            type,
            partyType: type === 'income' ? 'customer' : 'supplier',
            partyId: Number(partyId),
            amount: Number(amount),
            method,
            description
        });
    };

    const parties = type === 'income' ? customers : suppliers;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-1">
            <div>
                <label className="block text-xs text-text-muted mb-1">{type === 'income' ? 'Müşteri' : 'Tedarikçi'}</label>
                <select
                    className="w-full bg-background border border-accent rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                    value={partyId}
                    onChange={e => setPartyId(e.target.value)}
                >
                    <option value="">Seçiniz</option>
                    {parties?.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs text-text-muted mb-1">Tutar (₺)</label>
                <input
                    type="number"
                    className="w-full bg-background border border-accent rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                />
            </div>

            <div>
                <label className="block text-xs text-text-muted mb-1">Ödeme Yöntemi</label>
                <select
                    className="w-full bg-background border border-accent rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                    value={method}
                    onChange={e => setMethod(e.target.value)}
                >
                    <option value="cash">Nakit</option>
                    <option value="credit_card">Kredi Kartı</option>
                    <option value="bank_transfer">Havale/EFT</option>
                    <option value="check">Çek</option>
                </select>
            </div>

            <div>
                <label className="block text-xs text-text-muted mb-1">Açıklama</label>
                <textarea
                    className="w-full bg-background border border-accent rounded-lg px-3 py-2 text-white focus:border-primary outline-none h-20 resize-none"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="İşlem açıklaması..."
                />
            </div>

            <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors mt-4 disabled:opacity-50"
            >
                {mutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
        </form>
    );
}
