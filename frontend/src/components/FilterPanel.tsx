export default function FilterPanel() {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white">Sipariş Durumu</h3>
                <div className="space-y-2">
                    {['Bekliyor', 'Üretimde', 'Kargoda', 'Teslim Edildi'].map((status) => (
                        <label key={status} className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input type="checkbox" className="peer w-5 h-5 border-2 border-text-muted rounded bg-transparent checked:bg-primary checked:border-primary transition-colors appearance-none" />
                                <svg className="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <span className="text-text-muted group-hover:text-white transition-colors text-sm">{status}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-accent">
                <h3 className="text-sm font-semibold text-white">Marka</h3>
                <div className="space-y-2">
                    {['Merinos', 'Padişah', 'Diğer'].map((brand) => (
                        <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input type="checkbox" className="peer w-5 h-5 border-2 border-text-muted rounded bg-transparent checked:bg-primary checked:border-primary transition-colors appearance-none" />
                                <svg className="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <span className="text-text-muted group-hover:text-white transition-colors text-sm">{brand}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-accent">
                <h3 className="text-sm font-semibold text-white">Tarih Aralığı</h3>
                <div className="grid grid-cols-2 gap-2">
                    <input type="date" className="bg-background border border-accent rounded-lg px-3 py-2 text-sm text-text-muted" />
                    <input type="date" className="bg-background border border-accent rounded-lg px-3 py-2 text-sm text-text-muted" />
                </div>
            </div>

            <div className="pt-6 border-t border-accent">
                <button className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium">
                    Filtreleri Uygula
                </button>
            </div>
        </div>
    );
}
