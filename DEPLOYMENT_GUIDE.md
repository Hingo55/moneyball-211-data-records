# MoneyBall for 211 Data Records - Deployment Guide

## Quick Setup Instructions

### 1. Supabase Database Setup

1. **Create a Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up or log in
   - Create a new project

2. **Set up the Database Schema**
   - In your Supabase dashboard, go to "SQL Editor"
   - Copy and paste the contents of `service-statistics-schema.sql`
   - Click "Run" to create all tables and insert default data

3. **Get Your API Keys**
   - Go to Settings → API in your Supabase dashboard
   - Copy your Project URL and anon/public key

### 2. Environment Configuration

1. **Set up Environment Variables**
   ```bash
   cp .env.example .env
   ```

2. **Update .env file with your Supabase credentials:**
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Open http://localhost:5174 in your browser

### 4. Deployment Options

#### Option A: Netlify (Recommended)

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to netlify.com
   - Or connect your GitHub repo for automatic deployments

3. **Set Environment Variables in Netlify**
   - Go to Site Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

#### Option B: Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

## Features Verification

Once deployed, verify these features work:

### ✅ Calculation Accuracy
- **Formula**: `(validity × validity_weight) + (relevance × relevance_weight) + (actionability × actionability_weight)`
- **Test**: Change any score dropdown → weighted score should recalculate immediately
- **Test**: Move sliders → rankings should update in real-time

### ✅ Data Persistence
- **Test**: Change scores → refresh page → scores should persist
- **Test**: Select preset strategy → scores should save to database
- **Test**: Custom slider weights → should create "Custom Strategy" in database

### ✅ Real-time Updates
- **Test**: Multiple browser tabs → changes in one tab appear in others
- **Test**: Slider totals always equal 100%
- **Test**: Strategy Impact Analysis updates with top 3 rankings

## Database Schema Overview

The application uses two main tables:

1. **service_statistics** - Stores the 10 statistics with their scores and descriptions
2. **strategy_weights** - Stores the 3 preset strategies plus custom strategies
3. **calculated_statistics** (view) - Real-time calculated weighted scores

## Troubleshooting

### Issue: "Loading MoneyBall Data..." won't disappear
- **Cause**: Database connection issue
- **Fix**: Check environment variables and Supabase project status

### Issue: Scores don't save
- **Cause**: Database permissions or network issue
- **Fix**: Check browser console for error messages

### Issue: Calculations seem wrong
- **Cause**: Ensure slider weights total exactly 1.0
- **Check**: Total weight indicator should show green "100.0%"

## Technical Details

### Technology Stack
- **Frontend**: React 18 + Vite
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Real-time**: Supabase real-time subscriptions

### Key Components
- `App.jsx` - Main application logic
- `StatisticsTable` - Interactive table with dropdowns
- `lib/supabase.js` - Database operations
- `service-statistics-schema.sql` - Database schema

### Calculation Logic
The weighted score calculation is performed in multiple places:
1. **Frontend (Real-time)**: For immediate UI updates
2. **Database View**: For consistent server-side calculations
3. **Supabase Function**: For complex queries and aggregations

This ensures accuracy and consistency across all interfaces.