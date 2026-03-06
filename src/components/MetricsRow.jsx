import { MessageSquare, TrendingUp, AlertTriangle } from 'lucide-react';

export default function MetricsRow({ totalMentions, sentimentScore, trendingIssue }) {
  const cards = [
    {
      label: 'Total Mentions',
      value: totalMentions.toLocaleString(),
      icon: MessageSquare,
      color: 'text-accent-cyan',
      bg: 'bg-accent-cyan/10',
      border: 'border-accent-cyan/20',
    },
    {
      label: 'Overall Sentiment Score',
      value: `${sentimentScore}/100`,
      icon: TrendingUp,
      color: sentimentScore >= 60 ? 'text-accent-green' : sentimentScore >= 40 ? 'text-accent-orange' : 'text-accent-red',
      bg: sentimentScore >= 60 ? 'bg-accent-green/10' : sentimentScore >= 40 ? 'bg-accent-orange/10' : 'bg-accent-red/10',
      border: sentimentScore >= 60 ? 'border-accent-green/20' : sentimentScore >= 40 ? 'border-accent-orange/20' : 'border-accent-red/20',
    },
    {
      label: 'Trending Issue',
      value: trendingIssue,
      icon: AlertTriangle,
      color: 'text-accent-orange',
      bg: 'bg-accent-orange/10',
      border: 'border-accent-orange/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-xl border ${card.border} ${card.bg} p-4 flex items-start gap-3`}
          >
            <div className={`p-2 rounded-lg bg-white/5 ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{card.label}</p>
              <p className="mt-1 text-lg font-semibold text-white truncate" title={card.value}>
                {card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
