import { useState, useCallback, useMemo } from 'react';
import { Activity } from 'lucide-react';
import Sidebar from './components/Sidebar';
import MetricsRow from './components/MetricsRow';
import SentimentDonut from './components/SentimentDonut';
import CategoryBarChart from './components/CategoryBarChart';
import LiveFeedTable from './components/LiveFeedTable';
import mockFeedbackData from './data/mock_feedback.json';

const SENTIMENT_COLORS = {
  Positive: '#9ece6a',
  Negative: '#f7768e',
  Mixed: '#e0af68',
};

const CATEGORY_COLORS = {
  'Lore & Character': '#7dcfff',
  '3D Art & Animation': '#bb9af7',
  'Gacha & Commercial': '#ff9e64',
  'System & Progression': '#9ece6a',
  'Combat & Balance': '#e0af68',
  'Bugs & Performance': '#f7768e',
};

function App() {
  const [twitterOn, setTwitterOn] = useState(true);
  const [discordOn, setDiscordOn] = useState(true);
  const [redditOn, setRedditOn] = useState(true);
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [appliedTimeRange, setAppliedTimeRange] = useState('24h');

  const handleSync = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setAppliedTimeRange(selectedTimeRange);
      setFeedback(mockFeedbackData);
      setIsLoading(false);
    }, 1500);
  }, [selectedTimeRange]);

  const timeFilteredFeedback = useMemo(() => {
    if (feedback.length === 0) return [];
    if (appliedTimeRange === '7d') return feedback;
    if (appliedTimeRange === '24h') return feedback.slice(0, 15);
    if (appliedTimeRange === '1h') return feedback.slice(0, 5);
    return feedback;
  }, [feedback, appliedTimeRange]);

  const filteredFeedback = useMemo(() => {
    return timeFilteredFeedback.filter((item) => {
      if (item.source === 'Twitter') return twitterOn;
      if (item.source === 'Discord') return discordOn;
      if (item.source === 'Reddit') return redditOn;
      return false;
    });
  }, [timeFilteredFeedback, twitterOn, discordOn, redditOn]);

  const sentimentDistribution = useMemo(() => {
    const counts = { Positive: 0, Negative: 0, Mixed: 0 };
    filteredFeedback.forEach((item) => {
      if (counts.hasOwnProperty(item.actual_sentiment)) {
        counts[item.actual_sentiment] += 1;
      }
    });
    return [
      { name: 'Positive', value: counts.Positive, fill: SENTIMENT_COLORS.Positive },
      { name: 'Negative', value: counts.Negative, fill: SENTIMENT_COLORS.Negative },
      { name: 'Mixed', value: counts.Mixed, fill: SENTIMENT_COLORS.Mixed },
    ];
  }, [filteredFeedback]);

  const categoryData = useMemo(() => {
    const counts = {};
    filteredFeedback.forEach((item) => {
      const cat = item.actual_category;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        count,
        fill: CATEGORY_COLORS[name] || '#565f89',
      }));
  }, [filteredFeedback]);

  const topMetrics = useMemo(() => {
    const total = filteredFeedback.length;
    if (total === 0) {
      return { totalMentions: 0, sentimentScore: 0, trendingIssue: '—' };
    }
    const pos = sentimentDistribution[0].value;
    const neg = sentimentDistribution[1].value;
    const mixed = sentimentDistribution[2].value;
    const rawScore = (pos * 100 + mixed * 50 + neg * 0) / total;
    const trending = categoryData[0]?.name || '—';
    return {
      totalMentions: total,
      sentimentScore: Math.round(rawScore),
      trendingIssue: trending,
    };
  }, [filteredFeedback.length, sentimentDistribution, categoryData]);

  const tableFeed = useMemo(
    () =>
      filteredFeedback.map((item) => ({
        id: item.id,
        source: item.source,
        comment: item.text,
        tag: item.actual_category,
        sentiment: item.actual_sentiment,
      })),
    [filteredFeedback]
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--bg-base)]">
      <Sidebar
        twitterOn={twitterOn}
        discordOn={discordOn}
        redditOn={redditOn}
        onTwitterToggle={setTwitterOn}
        onDiscordToggle={setDiscordOn}
        onRedditToggle={setRedditOn}
        onSync={handleSync}
        syncing={isLoading}
        timeRange={selectedTimeRange}
        onTimeRangeChange={setSelectedTimeRange}
      />
      <main className="flex-1 overflow-auto p-4 lg:p-6">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Activity className="w-4 h-4 text-accent-cyan" />
            <span className="text-xs font-medium uppercase tracking-wider">Game Ops · AI Product</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-white tracking-tight">
            Real-Time Player Voice & Sentiment Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Monitor community feedback and sentiment across Twitter and Discord
          </p>
        </header>

        <section className="mb-6">
          <MetricsRow
            totalMentions={topMetrics.totalMentions}
            sentimentScore={topMetrics.sentimentScore}
            trendingIssue={topMetrics.trendingIssue}
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SentimentDonut distribution={sentimentDistribution} />
          <CategoryBarChart categories={categoryData} />
        </div>

        <section className="min-h-[320px]">
          <LiveFeedTable feed={tableFeed} />
        </section>
      </main>
    </div>
  );
}

export default App;
