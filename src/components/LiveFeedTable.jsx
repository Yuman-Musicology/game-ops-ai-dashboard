import { MessageSquare, MessageCircle, X, Smile, Meh, Frown, Minus } from 'lucide-react';

const sentimentConfig = {
  positive: { icon: Smile, color: 'text-accent-green', bg: 'bg-accent-green/20' },
  neutral: { icon: Meh, color: 'text-slate-400', bg: 'bg-slate-500/20' },
  mixed: { icon: Minus, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  negative: { icon: Frown, color: 'text-accent-red', bg: 'bg-accent-red/20' },
};

export default function LiveFeedTable({ feed }) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface-800/60 overflow-hidden flex flex-col h-full min-h-[320px]">
      <div className="px-4 py-3 border-b border-white/10">
        <h3 className="text-sm font-semibold text-slate-300">Live Data Feed</h3>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-surface-800 z-10">
            <tr className="text-left text-slate-400 border-b border-white/10">
              <th className="py-2.5 px-4 w-14">Source</th>
              <th className="py-2.5 px-4">Player Comment</th>
              <th className="py-2.5 px-4 w-36">AI Auto-Tag</th>
              <th className="py-2.5 px-4 w-24">Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {feed.map((row) => {
              const sent = sentimentConfig[row.sentiment?.toLowerCase()] ?? sentimentConfig.neutral;
              const SentIcon = sent.icon;
              return (
                <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-4">
                    {row.source === 'Twitter' && <X className="w-4 h-4 text-accent-cyan" strokeWidth={2.5} aria-label="X (Twitter)" />}
                    {row.source === 'Discord' && <MessageCircle className="w-4 h-4 text-indigo-400" aria-label="Discord" />}
                    {row.source === 'Reddit' && <MessageSquare className="w-4 h-4 text-orange-400" aria-label="Reddit" />}
                  </td>
                  <td className="py-2.5 px-4 text-slate-200 max-w-md truncate" title={row.comment}>
                    {row.comment}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/10 text-slate-300 text-xs font-medium">
                      {row.tag}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${sent.bg} ${sent.color}`}>
                      <SentIcon className="w-3.5 h-3.5" />
                      {row.sentiment}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
