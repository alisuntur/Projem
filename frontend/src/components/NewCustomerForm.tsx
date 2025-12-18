import { useState } from 'react';
import { User, Building2, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '../services/api';
import { useToast } from './ui/Toast';

export default function NewCustomerForm({ onClose }: { onClose: () => void }) {
    const [type, setType] = useState<'individual' | 'corporate'>('individual');
    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        city: 'İstanbul',
        district: '',
        address: '',
        taxOffice: '',
        taxNumber: '',
        tcIdentityNumber: ''
    });

    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const createCustomerMutation = useMutation({
        mutationFn: customersApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            showToast('Müşteri başarıyla oluşturuldu.', 'success');
            onClose();
        },
        onError: () => {
            showToast('Müşteri oluşturulurken bir hata oluştu.', 'error');
        }
    });

    const handleSubmit = async () => {
        // Basic Validation
        if (!formData.name) {
            showToast('Lütfen isim veya firma ünvanı giriniz.', 'error');
            return;
        }

        const payload = {
            ...formData,
            type: type
        };

        createCustomerMutation.mutate(payload);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6">
            {/* Type Selection */}
            <div className="grid grid-cols-2 gap-4 p-1 bg-surface border border-accent rounded-lg">
                <button
                    onClick={() => setType('individual')}
                    className={`flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${type === 'individual' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
                >
                    <User size={16} className="mr-2" />
                    Bireysel
                </button>
                <button
                    onClick={() => setType('corporate')}
                    className={`flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${type === 'corporate' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
                >
                    <Building2 size={16} className="mr-2" />
                    Kurumsal
                </button>
            </div>

            {type === 'individual' ? (
                <>
                    <div className="space-y-2">
                        <label className="text-sm text-text-muted">Ad Soyad</label>
                        <input name="name" onChange={handleChange} value={formData.name} type="text" className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="Müşteri Adı Soyadı" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-text-muted">TC Kimlik No (Opsiyonel)</label>
                        <input name="tcIdentityNumber" onChange={handleChange} value={formData.tcIdentityNumber} type="text" className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" maxLength={11} />
                    </div>
                </>
            ) : (
                <>
                    <div className="space-y-2">
                        <label className="text-sm text-text-muted">Firma Ünvanı</label>
                        <input name="name" onChange={handleChange} value={formData.name} type="text" className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="Örn: Yılmaz Halı A.Ş." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-text-muted">Yetkili Kişi</label>
                        <input name="contactPerson" onChange={handleChange} value={formData.contactPerson} type="text" className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="Ad Soyad" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-text-muted">Vergi Dairesi ve No</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input name="taxOffice" onChange={handleChange} value={formData.taxOffice} type="text" className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="Vergi Dairesi" />
                            <input name="taxNumber" onChange={handleChange} value={formData.taxNumber} type="text" className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="Vergi No" />
                        </div>
                    </div>
                </>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Telefon</label>
                    <input name="phone" onChange={handleChange} value={formData.phone} type="tel" className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="05XX XXX XX XX" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">E-posta</label>
                    <input name="email" onChange={handleChange} value={formData.email} type="email" className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="ornek@email.com" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-text-muted">Şehir / İlçe</label>
                <div className="grid grid-cols-2 gap-4">
                    <select name="city" onChange={handleChange} value={formData.city} className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary">
                        <option>İstanbul</option>
                        <option>Ankara</option>
                        <option>İzmir</option>
                        <option>Bursa</option>
                        <option>Antalya</option>
                        <option>Gaziantep</option>
                    </select>
                    <input name="district" onChange={handleChange} value={formData.district} type="text" className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="İlçe" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-text-muted">Açık Adres</label>
                <textarea name="address" onChange={handleChange} value={formData.address} rows={3} className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary resize-none" placeholder="Mahalle, cadde, sokak..." />
            </div>

            <div className="pt-4">
                <button
                    onClick={handleSubmit}
                    disabled={createCustomerMutation.isPending}
                    className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center justify-center"
                >
                    {createCustomerMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                    {type === 'individual' ? 'Müşteriyi Kaydet' : 'Firmayı Kaydet'}
                </button>
            </div>
        </div>
    );
}
