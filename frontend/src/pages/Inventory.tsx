import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../services/api';
import {
    Search,
    Plus,
    AlertTriangle,
    Package,
    SlidersHorizontal,
    Loader2,
    Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import SlideOver from '../components/SlideOver';
import NewProductForm from '../components/NewProductForm';
import ProductDetail from '../components/ProductDetail';
import EditProductForm from '../components/EditProductForm';
import { useToast } from '../components/ui/Toast';

const StockBadge = ({ stock, status }: { stock: number, status: string }) => {
    if (Number(stock) === 0) {
        return (
            <div className="flex items-center text-red-500 bg-red-500/10 px-3 py-1 rounded-full text-xs font-medium border border-red-500/20">
                <AlertTriangle size={14} className="mr-2" />
                Stok Tükendi
            </div>
        );
    }
    if (status === 'Critical') {
        return (
            <div className="flex items-center text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full text-xs font-medium border border-yellow-500/20 animate-pulse">
                <AlertTriangle size={14} className="mr-2" />
                Kritik Seviye ({stock})
            </div>
        );
    }
    return (
        <div className="flex items-center text-green-500 bg-green-500/10 px-3 py-1 rounded-full text-xs font-medium border border-green-500/20">
            <Package size={14} className="mr-2" />
            Stokta ({stock})
        </div>
    );
};

export default function Inventory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBrand, setFilterBrand] = useState('Tüm Markalar');
    const [filterSize, setFilterSize] = useState('Tüm Ebatlar');

    const [isNewProductOpen, setIsNewProductOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: productsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            showToast('Ürün başarıyla silindi.', 'success');
        },
        onError: () => {
            showToast('Ürün silinirken bir hata oluştu.', 'error');
        }
    });

    const handleDeleteClick = (item: any) => {
        if (confirm(`"${item.name}" ürününü silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve ilişkili satış/satın alma kayıtları da silinecektir.`)) {
            deleteMutation.mutate(item.id);
        }
    };

    // Fetch Products from API
    const { data: productsData, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: () => productsApi.getAll(),
    });

    // Map Backend Entity to UI Model
    const inventoryItems = productsData?.map((p: any) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        brand: p.brand || 'Bilinmiyor',
        width: p.width,
        height: p.height,
        size: p.width && p.height ? `${p.width}x${p.height} cm` : (p.size || '-'),
        stock: p.stock,
        rawPrice: p.price,
        price: `₺${Number(p.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
        image: p.imageUrl || 'bg-indigo-900',
        status: p.stock === 0 ? 'Out of Stock' : (p.stock <= p.criticalLevel ? 'Critical' : 'In Stock'),
        criticalLevel: p.criticalLevel
    })) || [];

    // Dynamic filter options from data
    const uniqueBrands: string[] = ['Tüm Markalar', ...Array.from(new Set(inventoryItems.map((item: any) => item.brand).filter(Boolean) as string[]))];
    const uniqueSizes: string[] = ['Tüm Ebatlar', ...Array.from(new Set(inventoryItems.map((item: any) => item.size).filter((s: any) => s !== '-') as string[]))];

    const filteredItems = inventoryItems.filter((item: any) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesBrand = filterBrand === 'Tüm Markalar' || item.brand === filterBrand;
        const matchesSize = filterSize === 'Tüm Ebatlar' || item.size === filterSize;

        return matchesSearch && matchesBrand && matchesSize;
    });

    const handleEditClick = (product: any) => {
        setSelectedProduct(product);
        setIsEditOpen(true);
    };

    const handleDetailClick = (product: any) => {
        setSelectedProduct(product);
        setIsDetailOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 text-text-muted">
                <Loader2 className="animate-spin mr-2" /> Stok verileri yükleniyor...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-red-400">
                Stok verileri alınırken bir hata oluştu.
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Stok Takibi</h1>
                        <p className="text-text-muted mt-1">Ürünlerinizi ve stok durumlarını buradan yönetin.</p>
                    </div>
                    <button
                        onClick={() => setIsNewProductOpen(true)}
                        className="flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                    >
                        <Plus size={16} className="mr-2" />
                        Yeni Ürün Ekle
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="bg-surface border border-accent rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Ürün adı, SKU veya marka ara..."
                            className="w-full bg-background border border-accent rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary placeholder-text-muted transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Dropdown Filters */}
                    <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <select
                            value={filterBrand}
                            onChange={(e) => setFilterBrand(e.target.value)}
                            className="bg-background border border-accent rounded-lg px-3 py-2.5 text-sm text-text-muted focus:outline-none hover:text-white cursor-pointer min-w-[120px]"
                        >
                            {uniqueBrands.map((brand: string) => (
                                <option key={brand}>{brand}</option>
                            ))}
                        </select>
                        <select
                            value={filterSize}
                            onChange={(e) => setFilterSize(e.target.value)}
                            className="bg-background border border-accent rounded-lg px-3 py-2.5 text-sm text-text-muted focus:outline-none hover:text-white cursor-pointer min-w-[120px]"
                        >
                            {uniqueSizes.map((size: string) => (
                                <option key={size}>{size}</option>
                            ))}
                        </select>
                        <button className="flex items-center px-4 py-2.5 bg-background border border-accent rounded-lg text-sm text-text-muted hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap">
                            <SlidersHorizontal size={16} className="mr-2" />
                            Diğer Filtreler
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {filteredItems.length === 0 && (
                        <div className="col-span-full text-center py-10 text-text-muted">
                            Kayıtlı ürün bulunamadı.
                        </div>
                    )}
                    {filteredItems.map((item: any, index: number) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group bg-surface border border-accent rounded-xl p-4 flex flex-col md:flex-row items-center gap-6 hover:border-primary/50 transition-all duration-300"
                        >
                            {/* Image Placeholder */}
                            <div className={cn("w-full md:w-32 h-32 rounded-lg flex-shrink-0 shadow-inner overflow-hidden", !item.image.startsWith('http') && item.image)}>
                                {item.image.startsWith('http') ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/50 text-xs">
                                        Görsel
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                                <div className="col-span-2 lg:col-span-1">
                                    <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-1">{item.brand}</p>
                                    <h3 className="text-white font-bold text-lg">{item.name}</h3>
                                    <p className="text-text-muted text-sm mt-1">SKU: {item.sku}</p>
                                </div>

                                <div className="flex flex-col justify-center">
                                    <span className="text-text-muted text-xs mb-1">Ebat</span>
                                    <span className="text-white font-medium">{item.size}</span>
                                </div>

                                <div className="flex flex-col justify-center">
                                    <span className="text-text-muted text-xs mb-1">Stok Durumu</span>
                                    <StockBadge stock={item.stock} status={item.status} />
                                </div>

                                <div className="flex flex-col justify-center items-end lg:items-start">
                                    <span className="text-text-muted text-xs mb-1">Liste Fiyatı</span>
                                    <span className="text-white font-bold text-xl">{item.price}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex md:flex-col gap-2 w-full md:w-auto border-t md:border-t-0 md:border-l border-accent pt-4 md:pt-0 md:pl-4 justify-end">
                                <button
                                    onClick={() => handleEditClick(item)}
                                    className="px-4 py-2 text-sm bg-background border border-accent rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors w-full md:w-32"
                                >
                                    Stok Düzenle
                                </button>
                                <button
                                    onClick={() => handleDetailClick(item)}
                                    className="px-4 py-2 text-sm text-text-muted hover:text-primary transition-colors flex items-center justify-center md:justify-start"
                                >
                                    Detaylar
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(item)}
                                    disabled={deleteMutation.isPending}
                                    className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center md:justify-start"
                                >
                                    <Trash2 size={14} className="mr-1" />
                                    Sil
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <SlideOver
                isOpen={isNewProductOpen}
                onClose={() => setIsNewProductOpen(false)}
                title="Yeni Ürün Ekle"
            >
                <NewProductForm onClose={() => setIsNewProductOpen(false)} />
            </SlideOver>

            <SlideOver
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                title="Ürün Detayı"
            >
                <ProductDetail product={selectedProduct} />
            </SlideOver>

            <SlideOver
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Ürün ve Stok Düzenle"
            >
                <EditProductForm product={selectedProduct} onClose={() => setIsEditOpen(false)} />
            </SlideOver>
        </>
    );
}
