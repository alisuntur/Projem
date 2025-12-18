import { useQuery } from '@tanstack/react-query';
import { customersApi } from '../services/api';
import { Download, FileText, TrendingUp, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CustomerStatement({ customerId, customerName }: { customerId: number, customerName: string }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['customer-statement', customerId],
        queryFn: () => customersApi.getStatement(customerId),
        enabled: !!customerId
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 text-text-muted">
                <Loader2 className="animate-spin mr-2" /> Yükleniyor...
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center h-64 text-red-400">
                Hesap ekstresi yüklenirken hata oluştu.
            </div>
        );
    }

    const transactions = data.transactions || [];
    const currentBalance = Number(data.customer?.balance || 0);

    // Generate chart data from transactions (group by month)
    const chartData = generateChartData(transactions);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-surface border border-accent rounded-lg">
                <div>
                    <p className="text-text-muted text-sm">Toplam Bakiye</p>
                    <p className={`text-2xl font-bold ${currentBalance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        ₺{currentBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <button className="flex items-center px-4 py-2 bg-background border border-accent rounded-lg text-sm hover:text-white transition-colors">
                    <Download size={16} className="mr-2" />
                    PDF Olarak İndir
                </button>
            </div>

            {/* Customer Visual Analytics */}
            {chartData.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-white flex items-center">
                        <TrendingUp size={16} className="mr-2 text-primary" />
                        Alım Grafiği
                    </h3>
                    <div className="bg-surface border border-accent rounded-lg p-4 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
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
                                    formatter={(value: number) => [`₺${value.toLocaleString('tr-TR')}`, 'Alım'] as [string, string]}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#13a4ec" strokeWidth={2} fillOpacity={1} fill="url(#colorSatis)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

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
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                                        Hesap hareketi bulunamadı.
                                    </td>
                                </tr>
                            )}
                            {transactions.map((trx: any) => (
                                <tr key={trx.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3 text-text-muted">
                                        {new Date(trx.date).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-white">
                                            {trx.type === 'sale' ? 'Sipariş' : trx.type === 'payment' ? 'Tahsilat' : 'İade'}
                                        </div>
                                        <div className="text-xs text-text-muted">{trx.description}</div>
                                    </td>
                                    <td className="px-4 py-3 text-right text-white font-medium">
                                        {trx.debit > 0 ? `₺${trx.debit.toLocaleString('tr-TR')}` : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right text-green-400 font-medium">
                                        {trx.credit > 0 ? `₺${trx.credit.toLocaleString('tr-TR')}` : '-'}
                                    </td>
                                    <td className={`px-4 py-3 text-right font-bold ${trx.balance < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        ₺{trx.balance.toLocaleString('tr-TR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function generateChartData(transactions: any[]) {
    const monthlyData: { [key: string]: number } = {};

    transactions
        .filter(t => t.type === 'sale')
        .forEach(t => {
            const date = new Date(t.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            const monthName = date.toLocaleDateString('tr-TR', { month: 'short' });

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = 0;
            }
            monthlyData[monthKey] += t.amount;
        });

    return Object.entries(monthlyData)
        .slice(-6)
        .map(([key, amount]) => {
            const [year, month] = key.split('-');
            const date = new Date(parseInt(year), parseInt(month));
            return {
                name: date.toLocaleDateString('tr-TR', { month: 'short' }),
                amount
            };
        });
}
