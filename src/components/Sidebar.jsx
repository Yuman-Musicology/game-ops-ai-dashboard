import { useState } from 'react';
import { Twitter, MessageCircle, MessageSquare, RefreshCw, ChevronDown } from 'lucide-react';
import { TIME_RANGES } from '../data/mockData';

export default function Sidebar({ twitterOn, discordOn, redditOn, onTwitterToggle, onDiscordToggle, onRedditToggle, onSync, syncing, timeRange, onTimeRangeChange }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-surface-800/80 backdrop-blur flex flex-col font-display">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Data Sources</h2>
        <div className="mt-3 space-y-3">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="flex items-center gap-2 text-sm text-slate-300 group-hover:text-white transition-colors">
              <Twitter className="w-4 h-4 text-accent-cyan" />
              X (Twitter)
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={twitterOn}
              onClick={() => onTwitterToggle(!twitterOn)}
              className={`relative w-10 h-5 rounded-full transition-colors ${twitterOn ? 'bg-accent-cyan/60' : 'bg-surface-600'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${twitterOn ? 'left-5' : 'left-0.5'}`} />
            </button>
          </label>
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="flex items-center gap-2 text-sm text-slate-300 group-hover:text-white transition-colors">
              <MessageCircle className="w-4 h-4 text-indigo-400" />
              Discord Community
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={discordOn}
              onClick={() => onDiscordToggle(!discordOn)}
              className={`relative w-10 h-5 rounded-full transition-colors ${discordOn ? 'bg-indigo-500/60' : 'bg-surface-600'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${discordOn ? 'left-5' : 'left-0.5'}`} />
            </button>
          </label>
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="flex items-center gap-2 text-sm text-slate-300 group-hover:text-white transition-colors">
              <MessageSquare className="w-4 h-4 text-orange-400" />
              Reddit
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={redditOn}
              onClick={() => onRedditToggle(!redditOn)}
              className={`relative w-10 h-5 rounded-full transition-colors ${redditOn ? 'bg-orange-500/60' : 'bg-surface-600'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${redditOn ? 'left-5' : 'left-0.5'}`} />
            </button>
          </label>
        </div>
      </div>

      <div className="p-4 border-b border-white/10">
        <button
          onClick={onSync}
          disabled={syncing}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 hover:bg-accent-cyan/30 hover:border-accent-cyan/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all font-semibold text-sm"
        >
          {syncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Sync Latest Feedback
            </>
          )}
        </button>
      </div>

      <div className="p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Time Range</h2>
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-surface-700 border border-white/10 text-sm text-slate-200 hover:border-white/20 transition-colors"
          >
            {TIME_RANGES.find((t) => t.id === timeRange)?.label ?? 'Last 24H'}
            <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 py-1 rounded-lg bg-surface-700 border border-white/10 shadow-xl z-10">
              {TIME_RANGES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    onTimeRangeChange(t.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left py-2 px-3 text-sm hover:bg-white/5 ${timeRange === t.id ? 'text-accent-cyan' : 'text-slate-300'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
