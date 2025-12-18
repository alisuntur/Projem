import { Edit2, Package, Tag, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ProductDetail({ product }: { product: any }) {
    if (!product) return null;

    return (
        <div className="space-y-8">
            {/* Visual Header */}
            <div className={cn("w-full h-48 rounded-xl flex items-center justify-center relative overflow-hidden shadow-2xl", product.image)}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-primary text-xs font-bold uppercase tracking-wider bg-black/50 px-2 py-1 rounded backdrop-blur-sm">{product.brand}</span>
                            <h2 className="text-3xl font-bold text-white mt-2">{product.name}</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-text-muted text-sm">Liste Fiyatı</p>
                            <p className="text-2xl font-bold text-white">{product.price}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface border border-accent rounded-lg p-4 flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                        <Tag size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-text-muted">SKU Kodu</p>
                        <p className="font-mono text-white">{product.sku}</p>
                    </div>
                </div>
                <div className="bg-surface border border-accent rounded-lg p-4 flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                        <Package size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-text-muted">Ebat</p>
                        <p className="text-white">{product.size}</p>
                    </div>
                </div>
            </div>

            {/* Stock Management */}
            <div className="bg-surface border border-accent rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                        <BarChart3 size={20} className="mr-2 text-primary" />
                        Stok Yönetimi
                    </h3>
                    <span className={cn("px-3 py-1 rounded-full text-xs font-medium",
                        product.stock === 0 ? "bg-red-500/10 text-red-500" :
                            product.stock < 15 ? "bg-yellow-500/10 text-yellow-500" :
                                "bg-green-500/10 text-green-500"
                    )}>
                        {product.status}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <label className="text-xs text-text-muted mb-1 block">Mevcut Stok</label>
                        <input type="number" className="w-full bg-background border border-accent rounded-lg px-4 py-2 text-white text-lg font-bold" defaultValue={product.stock} />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-text-muted mb-1 block">Kritik Seviye</label>
                        <input type="number" className="w-full bg-background border border-accent rounded-lg px-4 py-2 text-text-muted text-lg" defaultValue={15} />
                    </div>
                </div>

                <button className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center justify-center">
                    <Edit2 size={16} className="mr-2" />
                    Stok Güncelle
                </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white">Ürün Açıklaması</h4>
                <p className="text-sm text-text-muted leading-relaxed">
                    Yüksek kaliteli iplikten dokunmuş, leke tutmaz ve antibakteriyel özelliklere sahip modern halı serisi.
                    Yoğun kullanım alanları için uygundur. Tabanı kaymaz lateks kaplamadır.
                </p>
            </div>
        </div>
    );
}
