# Real-Time Player Voice & Sentiment Dashboard

A modern, dark-mode dashboard for Game Operations and AI Product Managers to monitor player feedback and sentiment from Twitter and Discord.

## Run locally

```bash
cd dashboard
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Stack

- **React** + **Vite**
- **Tailwind CSS** (dark theme)
- **Recharts** (Donut + Bar charts)
- **Lucide React** (icons)

## Features

- **Sidebar**: Data source toggles (Twitter, Discord), "Sync Latest Feedback" with loading state, Time Range dropdown
- **Top metrics**: Total Mentions, Overall Sentiment Score (0–100), Trending Issue
- **Charts**: Sentiment distribution (donut), Feedback categories (bar)
- **Live feed**: Scrollable table with Source icon, Comment, AI Auto-Tag badge, Sentiment icon

All data is mock; replace with your API when ready.
