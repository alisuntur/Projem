import { useState } from 'react';
import { User, Building2, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '../services/api';
import { useToast } from './ui/Toast';

// Validation helpers
const onlyLetters = (value: string) => value.replace(/[^a-zA-ZğüşöçıİĞÜŞÖÇ\s]/g, '');
const onlyNumbers = (value: string) => value.replace(/[^0-9]/g, '');
const phoneFormat = (value: string) => {
    const nums = value.replace(/[^0-9]/g, '');
    if (nums.length <= 4) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 4)} ${nums.slice(4)}`;
    return `${nums.slice(0, 4)} ${nums.slice(4, 7)} ${nums.slice(7, 11)}`;
};
const emailFormat = (value: string) => value.replace(/[^a-zA-Z0-9@._-]/g, '');

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
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name || formData.name.length < 2) {
            newErrors.name = 'İsim en az 2 karakter olmalıdır.';
        }
        if (formData.name.length > 100) {
            newErrors.name = 'İsim en fazla 100 karakter olabilir.';
        }

        if (formData.phone && formData.phone.replace(/\s/g, '').length < 10) {
            newErrors.phone = 'Telefon numarası en az 10 hane olmalıdır.';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Geçerli bir e-posta adresi giriniz.';
        }

        if (type === 'individual' && formData.tcIdentityNumber) {
            if (formData.tcIdentityNumber.length !== 11) {
                newErrors.tcIdentityNumber = 'TC Kimlik No 11 hane olmalıdır.';
            }
        }

        if (type === 'corporate' && formData.taxNumber) {
            if (formData.taxNumber.length < 10 || formData.taxNumber.length > 11) {
                newErrors.taxNumber = 'Vergi No 10-11 hane olmalıdır.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            showToast('Lütfen hatalı alanları düzeltiniz.', 'error');
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
        let processedValue = value;

        // Apply field-specific formatting
        switch (name) {
            case 'name':
            case 'contactPerson':
            case 'taxOffice':
            case 'district':
                processedValue = onlyLetters(value).slice(0, 100);
                break;
            case 'phone':
                processedValue = phoneFormat(value).slice(0, 14);
                break;
            case 'email':
                processedValue = emailFormat(value).slice(0, 100);
                break;
            case 'tcIdentityNumber':
            case 'taxNumber':
                processedValue = onlyNumbers(value).slice(0, 11);
                break;
            case 'address':
                processedValue = value.slice(0, 500);
                break;
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const inputClass = (fieldName: string) =>
        `w-full bg-background border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary ${errors[fieldName] ? 'border-red-500' : 'border-accent'}`;

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
                        <label className="text-sm text-text-muted">Ad Soyad *</label>
                        <input name="name" onChange={handleChange} value={formData.name} type="text" className={inputClass('name')} placeholder="Müşteri Adı Soyadı" maxLength={100} />
                        {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-text-muted">TC Kimlik No (Opsiyonel)</label>
                        <input name="tcIdentityNumber" onChange={handleChange} value={formData.tcIdentityNumber} type="text" className={inputClass('tcIdentityNumber')} maxLength={11} placeholder="11 haneli TC No" />
                        {errors.tcIdentityNumber && <p className="text-xs text-red-400">{errors.tcIdentityNumber}</p>}
                    </div>
                </>
            ) : (
                <>
                    <div className="space-y-2">
                        <label className="text-sm text-text-muted">Firma Ünvanı *</label>
                        <input name="name" onChange={handleChange} value={formData.name} type="text" className={inputClass('name')} placeholder="Örn: Yılmaz Halı A.Ş." maxLength={100} />
                        {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-text-muted">Yetkili Kişi</label>
                        <input name="contactPerson" onChange={handleChange} value={formData.contactPerson} type="text" className={inputClass('contactPerson')} placeholder="Ad Soyad" maxLength={100} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-text-muted">Vergi Dairesi ve No</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input name="taxOffice" onChange={handleChange} value={formData.taxOffice} type="text" className={inputClass('taxOffice')} placeholder="Vergi Dairesi" maxLength={50} />
                            <div>
                                <input name="taxNumber" onChange={handleChange} value={formData.taxNumber} type="text" className={inputClass('taxNumber')} placeholder="Vergi No" maxLength={11} />
                                {errors.taxNumber && <p className="text-xs text-red-400">{errors.taxNumber}</p>}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Telefon</label>
                    <input name="phone" onChange={handleChange} value={formData.phone} type="tel" className={inputClass('phone')} placeholder="05XX XXX XX XX" maxLength={14} />
                    {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">E-posta</label>
                    <input name="email" onChange={handleChange} value={formData.email} type="email" className={inputClass('email')} placeholder="ornek@email.com" maxLength={100} />
                    {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
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
                    <input name="district" onChange={handleChange} value={formData.district} type="text" className={inputClass('district')} placeholder="İlçe" maxLength={50} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-text-muted">Açık Adres</label>
                <textarea name="address" onChange={handleChange} value={formData.address} rows={3} className="w-full bg-background border border-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary resize-none" placeholder="Mahalle, cadde, sokak..." maxLength={500} />
                <p className="text-xs text-text-muted text-right">{formData.address.length}/500</p>
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
