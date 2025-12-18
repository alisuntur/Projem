import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '../services/api';
import {
    Search,
    Plus,
    Phone,
    Mail,
    FileText,
    MoreVertical,
    MapPin,
    User,
    Building2,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import SlideOver from '../components/SlideOver';
import NewCustomerForm from '../components/NewCustomerForm';
import CustomerStatement from '../components/CustomerStatement';
import { useToast } from '../components/ui/Toast';

// Helper to assign random colors based on ID (consistent)
const getAvatarColor = (id: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500', 'bg-indigo-500'];
    return colors[id % colors.length];
};

const Avatar = ({ name, color }: { name: string, color: string }) => {
    const initials = name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??';
    return (
        <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg mb-4", color)}>
            {initials}
        </div>
    );
};

export default function Customers() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
    const [isStatementOpen, setIsStatementOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    // Fetch Customers from API
    const { data: customersData, isLoading, error } = useQuery({
        queryKey: ['customers'],
        queryFn: customersApi.getAll,
    });

    // Map Backend Entity to UI Model
    const customers = customersData?.map((c: any) => ({
        id: c.id,
        type: c.type,
        company: c.name, // Mapping 'name' to 'company' as used in UI
        contact: c.contactPerson || '-',
        city: c.city || 'Belirtilmedi',
        balance: `₺${Number(c.balance).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
        lastOrder: 'Yeni', // Todo: fetch real last order date
        color: getAvatarColor(c.id)
    })) || [];

    // Filter Logic
    const filteredCustomers = customers.filter((c: any) =>
        c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAction = (action: string, customer: any) => {
        if (action === 'statement') {
            setSelectedCustomer(customer);
            setIsStatementOpen(true);
        } else if (action === 'call') {
            showToast(`${customer.company} aranıyor...`, 'info');
        } else if (action === 'mail') {
            showToast(`Mail uygulaması açılıyor...`, 'info');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 text-text-muted">
                <Loader2 className="animate-spin mr-2" /> Müşteriler yükleniyor...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-red-400">
                Veriler yüklenirken bir hata oluştu. Lütfen Backend bağlantısını kontrol edin.
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Müşteri Listesi</h1>
                        <p className="text-text-muted mt-1">Bireysel ve kurumsal müşterilerinizi yönetin.</p>
                    </div>
                    <button
                        onClick={() => setIsNewCustomerOpen(true)}
                        className="flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                    >
                        <Plus size={16} className="mr-2" />
                        Yeni Müşteri
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="İsim, firma veya şehir ara..."
                        className="w-full bg-surface border border-accent rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary placeholder-text-muted transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Grid View */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCustomers.length === 0 && (
                        <div className="col-span-full text-center py-10 text-text-muted">
                            Kayıtlı müşteri bulunamadı.
                        </div>
                    )}
                    {filteredCustomers.map((customer: any, index: number) => (
                        <motion.div
                            key={customer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group bg-surface border border-accent rounded-xl p-6 flex flex-col items-center text-center hover:border-primary/50 transition-all duration-300 relative"
                        >
                            {/* Type Badge */}
                            <div className={cn("absolute top-4 left-4 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border",
                                customer.type === 'corporate' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                            )}>
                                {customer.type === 'corporate' ? 'Kurumsal' : 'Bireysel'}
                            </div>

                            {/* Options Menu */}
                            <div className="absolute top-4 right-4 z-10 group/menu">
                                <button className="text-text-muted hover:text-white transition-colors">
                                    <MoreVertical size={18} />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-[#1a2c34] border border-accent rounded-lg shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-20">
                                    <button
                                        onClick={() => handleAction('edit', customer)}
                                        className="w-full text-left px-4 py-2 text-sm text-text-muted hover:bg-white/5 hover:text-white"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm(`${customer.company} isimli müşteriyi ve tüm verilerini silmek istediğinize emin misiniz?`)) {
                                                customersApi.delete(customer.id).then(() => {
                                                    queryClient.invalidateQueries({ queryKey: ['customers'] });
                                                    showToast('Müşteri silindi.', 'success');
                                                }).catch(() => showToast('Silme işlemi başarısız.', 'error'));
                                            }
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>

                            <div className="mt-2">
                                <Avatar name={customer.company} color={customer.color} />
                            </div>

                            <h3 className="text-lg font-bold text-white">{customer.company}</h3>
                            {customer.type === 'corporate' && <p className="text-text-muted text-sm mt-1">{customer.contact}</p>}

                            <div className="flex items-center text-xs text-text-muted mt-2 mb-6">
                                <MapPin size={12} className="mr-1" />
                                {customer.city}
                            </div>

                            <div className="w-full grid grid-cols-2 gap-4 border-t border-accent pt-4 mb-6">
                                <div className="text-center border-r border-accent">
                                    <p className="text-xs text-text-muted mb-1">Cari Bakiye</p>
                                    <p className={cn("font-bold", customer.balance.includes('-') ? 'text-red-500' : 'text-green-500')}>{customer.balance}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-text-muted mb-1">Son Sipariş</p>
                                    <p className="text-white font-medium">{customer.lastOrder}</p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex w-full gap-2">
                                <button
                                    onClick={() => handleAction('call', customer)}
                                    className="flex-1 flex items-center justify-center py-2 bg-background border border-accent rounded-lg text-text-muted text-sm hover:text-white hover:bg-white/5 transition-colors group/btn"
                                >
                                    <Phone size={16} className="group-hover/btn:text-green-400 transition-colors" />
                                </button>
                                <button
                                    onClick={() => handleAction('mail', customer)}
                                    className="flex-1 flex items-center justify-center py-2 bg-background border border-accent rounded-lg text-text-muted text-sm hover:text-white hover:bg-white/5 transition-colors group/btn"
                                >
                                    <Mail size={16} className="group-hover/btn:text-blue-400 transition-colors" />
                                </button>
                                <button
                                    onClick={() => handleAction('statement', customer)}
                                    className="flex-1 flex items-center justify-center py-2 bg-background border border-accent rounded-lg text-text-muted text-sm hover:text-white hover:bg-white/5 transition-colors group/btn"
                                    title="Ekstre"
                                >
                                    <FileText size={16} className="group-hover/btn:text-yellow-400 transition-colors" />
                                    <span className="ml-1 text-xs">Ekstre</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div >
            </div >

            <SlideOver
                isOpen={isNewCustomerOpen}
                onClose={() => setIsNewCustomerOpen(false)}
                title="Yeni Müşteri Ekle"
            >
                <NewCustomerForm onClose={() => setIsNewCustomerOpen(false)} />
            </SlideOver>

            <SlideOver
                isOpen={isStatementOpen}
                onClose={() => setIsStatementOpen(false)}
                title={`${selectedCustomer?.company || 'Müşteri'} - Hesap Ekstresi`}
            >
                <CustomerStatement customerId={selectedCustomer?.id} customerName={selectedCustomer?.company} />
            </SlideOver>
        </>
    );
}
