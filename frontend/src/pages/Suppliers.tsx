import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suppliersApi } from '../services/api';
import { Search, Plus, Factory, Building2, Package, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SlideOver from '../components/SlideOver';
import { useToast } from '../components/ui/Toast';
import SupplierDetail from '../components/SupplierDetail';

export default function Suppliers() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewSupplierOpen, setIsNewSupplierOpen] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
    const [newSupplierData, setNewSupplierData] = useState({ name: '', type: 'Factory', contactInfo: '', address: '' });

    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { data: suppliers, isLoading } = useQuery({
        queryKey: ['suppliers'],
        queryFn: suppliersApi.getAll,
    });

    const createMutation = useMutation({
        mutationFn: suppliersApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            showToast('Tedarikçi başarıyla eklendi.', 'success');
            setIsNewSupplierOpen(false);
            setNewSupplierData({ name: '', type: 'Factory', contactInfo: '', address: '' });
        },
        onError: () => showToast('Hata oluştu.', 'error')
    });

    const deleteMutation = useMutation({
        mutationFn: suppliersApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            showToast('Tedarikçi silindi.', 'success');
        },
        onError: () => showToast('Silinirken hata oluştu.', 'error')
    });

    const handleCreate = () => {
        if (!newSupplierData.name) return showToast('İsim gereklidir.', 'error');
        createMutation.mutate(newSupplierData);
    };

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Bu tedarikçiyi silmek istediğinize emin misiniz?')) {
            deleteMutation.mutate(id);
        }
    };

    const filteredSuppliers = suppliers?.filter((s: any) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Tedarikçiler</h1>
                        <p className="text-text-muted mt-1">Fabrika ve toptancılarınızı yönetin.</p>
                    </div>
                    <button
                        onClick={() => setIsNewSupplierOpen(true)}
                        className="flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover transition-colors shadow-lg"
                    >
                        <Plus size={16} className="mr-2" />
                        Yeni Ekle
                    </button>
                </div>

                <div className="bg-surface border border-accent rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-accent">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                type="text"
                                placeholder="Tedarikçi ara..."
                                className="w-full bg-background border border-accent rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {filteredSuppliers.map((supplier: any) => (
                            <motion.div
                                key={supplier.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => setSelectedSupplierId(supplier.id)}
                                className="bg-background border border-accent rounded-lg p-4 cursor-pointer hover:border-primary transition-all group relative"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className={`p-2 rounded-lg ${supplier.type === 'Factory' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                                        {supplier.type === 'Factory' ? <Factory size={20} /> : <Building2 size={20} />}
                                    </div>
                                    <button onClick={(e) => handleDelete(supplier.id, e)} className="text-text-muted hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <h3 className="text-white font-medium text-lg">{supplier.name}</h3>
                                <p className="text-text-muted text-sm mb-2">{supplier.type === 'Factory' ? 'Fabrika' : 'Toptancı'}</p>

                                {/* Bakiye */}
                                <div className="mb-4">
                                    <span className="text-xs text-text-muted">Bakiye: </span>
                                    <span className={`font-semibold ${Number(supplier.balance || 0) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        ₺{Number(supplier.balance || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                    </span>
                                    {Number(supplier.balance || 0) > 0 && <span className="text-xs text-red-400 ml-1">(Borçlu)</span>}
                                </div>

                                <div className="flex items-center justify-between text-sm border-t border-accent pt-3">
                                    <div className="flex items-center text-text-muted">
                                        <Package size={14} className="mr-1" />
                                        {supplier.products?.length || 0} Ürün
                                    </div>
                                    <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                                        Detaylar <ArrowRight size={14} className="ml-1" />
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <SlideOver
                isOpen={isNewSupplierOpen}
                onClose={() => setIsNewSupplierOpen(false)}
                title="Yeni Tedarikçi Ekle"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-text-muted">İsim</label>
                        <input
                            value={newSupplierData.name}
                            onChange={(e) => setNewSupplierData({ ...newSupplierData, name: e.target.value })}
                            className="w-full bg-background border border-accent rounded px-3 py-2 text-white sm:text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-text-muted">Tip</label>
                        <select
                            value={newSupplierData.type}
                            onChange={(e) => setNewSupplierData({ ...newSupplierData, type: e.target.value })}
                            className="w-full bg-background border border-accent rounded px-3 py-2 text-white sm:text-sm"
                        >
                            <option value="Factory">Fabrika</option>
                            <option value="Wholesaler">Toptancı</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-text-muted">İletişim Bilgisi</label>
                        <input
                            value={newSupplierData.contactInfo}
                            onChange={(e) => setNewSupplierData({ ...newSupplierData, contactInfo: e.target.value })}
                            className="w-full bg-background border border-accent rounded px-3 py-2 text-white sm:text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-text-muted">Adres</label>
                        <textarea
                            value={newSupplierData.address}
                            onChange={(e) => setNewSupplierData({ ...newSupplierData, address: e.target.value })}
                            className="w-full bg-background border border-accent rounded px-3 py-2 text-white sm:text-sm h-24 resize-none"
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={createMutation.isPending}
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-hover transition-colors"
                    >
                        {createMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </SlideOver>

            <SlideOver
                isOpen={!!selectedSupplierId}
                onClose={() => setSelectedSupplierId(null)}
                title="Tedarikçi Detayı"
            >
                {selectedSupplierId && <SupplierDetail id={selectedSupplierId} />}
            </SlideOver>
        </>
    );
}
