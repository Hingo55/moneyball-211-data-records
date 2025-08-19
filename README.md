# MoneyBall for 211 Data Records

An interactive single-page application for strategic analysis and prioritization of community service record statistics. Transform data analysis from spreadsheets into a dynamic, weighted scoring system.

## 🚀 Features

- **📊 Interactive Statistics Table** - 10 service record statistics with editable scores (1-5 scale)
- **⚖️ Strategic Weighting** - 3 preset strategies + custom slider configuration
- **🎯 Real-time Ranking** - Automatic re-ranking based on weighted scores
- **💾 Data Persistence** - All changes saved to Supabase database
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **🔄 Live Updates** - Real-time synchronization across browser tabs

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase subscriptions

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your project URL and anon key
3. Copy `.env.example` to `.env` and update with your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Create Database Schema

1. Go to your Supabase dashboard → SQL Editor
2. Copy and paste the contents of `service-statistics-schema.sql`
3. Run the script to create tables and insert default data

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5174](http://localhost:5174) to view the app.

## 📊 How It Works

### Statistics & Scoring
- **10 Service Record Statistics**: Verification Date, Referral Count, Record Completeness Score, etc.
- **3 Scoring Dimensions**: Validity (1-5), Relevance (1-5), Actionability (1-5)
- **Editable Scores**: Click dropdown to change any score → auto-saves to database

### Strategic Weighting
- **3 Preset Strategies**: Impact-First (40/40/20), Balanced (33/33/34), Maintenance-First (20/30/50)
- **Custom Sliders**: Adjust weights manually → other sliders auto-adjust to total 100%
- **Real-time Calculation**: `(validity × validity_weight) + (relevance × relevance_weight) + (actionability × actionability_weight)`

### Live Updates
- **Auto-Ranking**: Statistics table re-sorts by weighted score immediately
- **Persistent Data**: All changes save to Supabase automatically
- **Strategy Impact**: Shows average scores of top 3 ranked statistics

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment to any static hosting service.

## 🆘 Troubleshooting

**Connection Issues:**
- Ensure your Supabase URL and anon key are correct in `.env`
- Check that the database tables are created using the provided schema
- Verify your Supabase project is not paused (free tier limitation)

**Local Development:**
- Make sure all dependencies are installed: `npm install`
- Check that no other apps are using the same port
- Verify Node.js version is 18 or higher

---

**Transform your Excel analysis into a powerful, interactive platform! 🚀**
