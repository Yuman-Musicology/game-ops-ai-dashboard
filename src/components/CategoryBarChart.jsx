import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CategoryBarChart({ categories = [] }) {
  const hasData = categories.length > 0;
  const chartData = hasData ? categories : [{ name: 'No data', count: 0, fill: '#334155' }];

  return (
    <div className="rounded-xl border border-white/10 bg-surface-800/60 p-4 h-full min-h-[280px] flex flex-col">
      <h3 className="text-sm font-semibold text-slate-300 mb-2">Feedback Categories</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} width={120} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(26, 27, 38, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              formatter={(value) => [value, 'Mentions']}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
