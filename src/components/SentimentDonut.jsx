import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-medium">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SentimentDonut({ distribution = [] }) {
  const total = distribution.reduce((s, d) => s + d.value, 0);
  const hasData = total > 0;

  return (
    <div className="rounded-xl border border-white/10 bg-surface-800/60 p-4 h-full min-h-[280px] flex flex-col">
      <h3 className="text-sm font-semibold text-slate-300 mb-2">Sentiment Distribution</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={hasData ? distribution : [{ name: 'No data', value: 1, fill: '#334155' }]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={hasData ? renderCustomLabel : null}
              labelLine={false}
            >
              {(hasData ? distribution : [{ name: 'No data', value: 1, fill: '#334155' }]).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(26, 27, 38, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              formatter={(value, name) => {
                if (!hasData) return [0, name];
                const pct = ((value / total) * 100).toFixed(0);
                return [`${value} (${pct}%)`, name];
              }}
            />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
