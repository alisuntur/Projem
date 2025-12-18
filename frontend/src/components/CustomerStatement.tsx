import { Download, FileText, TrendingUp, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TRANSACTIONS = [
    { id: 'TRX-998', type: 'Sipariş', date: '16.12.2024', desc: 'Sipariş #ORD-24-1001', debit: '₺45.200', credit: '-', balance: '₺-124.500' },
    { id: 'TRX-997', type: 'Ödeme', date: '10.12.2024', desc: 'Havale/EFT Ödemesi', debit: '-', credit: '₺20.000', balance: '₺-79.300' },
    { id: 'TRX-996', type: 'Sipariş', date: '05.12.2024', desc: 'Sipariş #ORD-24-0980', debit: '₺15.000', credit: '-', balance: '₺-99.300' },
    { id: 'TRX-995', type: 'İade', date: '01.12.2024', desc: 'İade Faturası #IADE-01', debit: '-', credit: '₺5.000', balance: '₺-84.300' },
];

const CUSTOMER_SALES_DATA = [
    { name: 'Ocak', satis: 12000 },
    { name: 'Şub', satis: 19000 },
    { name: 'Mar', satis: 3000 },
    { name: 'Nis', satis: 25000 },
    { name: 'May', satis: 15000 },
    { name: 'Haz', satis: 40000 },
];

export default function CustomerStatement({ customerName }: { customerName: string }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-surface border border-accent rounded-lg">
                <div>
                    <p className="text-text-muted text-sm">Toplam Bakiye</p>
                    <p className="text-2xl font-bold text-red-500">₺-124.500</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-background border border-accent rounded-lg text-sm hover:text-white transition-colors">
                    <Download size={16} className="mr-2" />
                    PDF Olarak İndir
                </button>
            </div>

            {/* Customer Visual Analytics */}
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white flex items-center">
                    <TrendingUp size={16} className="mr-2 text-primary" />
                    Alım Grafiği (Son 6 Ay)
                </h3>
                <div className="bg-surface border border-accent rounded-lg p-4 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={CUSTOMER_SALES_DATA}>
                            <defs>
                                <linearGradient id="colorSatis" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#13a4ec" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#13a4ec" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2d33" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#6b7280"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10 }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a262c', borderColor: '#1f2d33', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                                itemStyle={{ color: '#13a4ec' }}
                                formatter={(value: number) => [`₺${value}`, 'Alım'] as [string, string]}
                            />
                            <Area type="monotone" dataKey="satis" stroke="#13a4ec" strokeWidth={2} fillOpacity={1} fill="url(#colorSatis)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                    <FileText size={20} className="mr-2 text-primary" />
                    Hesap Hareketleri
                </h3>

                <div className="overflow-hidden border border-accent rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#14232a] text-text-muted font-medium border-b border-accent">
                            <tr>
                                <th className="px-4 py-3">Tarih</th>
                                <th className="px-4 py-3">Açıklama</th>
                                <th className="px-4 py-3 text-right">Borç</th>
                                <th className="px-4 py-3 text-right">Alacak</th>
                                <th className="px-4 py-3 text-right">Bakiye</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-accent">
                            {TRANSACTIONS.map((trx) => (
                                <tr key={trx.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3 text-text-muted">{trx.date}</td>
                                    <td className="px-4 py-3">
                                        <div className="text-white">{trx.type}</div>
                                        <div className="text-xs text-text-muted">{trx.desc}</div>
                                    </td>
                                    <td className="px-4 py-3 text-right text-white font-medium">{trx.debit}</td>
                                    <td className="px-4 py-3 text-right text-green-400 font-medium">{trx.credit}</td>
                                    <td className="px-4 py-3 text-right text-red-400 font-bold">{trx.balance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
