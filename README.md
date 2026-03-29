# ET RetailX — Chart Pattern Intelligence

ET RetailX is an AI-powered market intelligence prototype built for the **ET AI Hackathon 2026** under **Problem Statement 6: AI for the Indian Investor**.

The platform helps Indian retail investors understand market signals faster by combining technical pattern detection, historical signal framing, and AI-generated plain-English explanations in one interface.

## Problem

Retail investors often react to noise, tips, or fragmented information instead of structured signals. Reading charts, checking indicators, and translating them into actionable decisions takes time and expertise.

This project turns raw market data into an explainable intelligence layer that identifies patterns, highlights possible opportunities, and gives simple investor-friendly analysis.

## Solution

ET RetailX analyzes stock data, detects technical setups such as momentum or reversal signals, and presents them through an interactive dashboard. It also generates a concise AI explanation of what the signal means and what action a retail investor may consider.

The goal is not just to display charts, but to convert them into understandable decision support.

## Features

- Interactive stock dashboard for Indian market tickers.
- Technical signal detection using live/historical market data.
- AI-generated plain-English explanation of current market setup.
- Historical win-rate style signal framing for better interpretability.
- Clean UI for quick demo and investor-friendly presentation.
- Fast prototype workflow suitable for real-time hackathon evaluation.

## Workflow

1. User enters a stock ticker.
2. The system fetches recent stock data.
3. Technical indicators and patterns are computed.
4. A signal is identified from the market data.
5. The AI layer explains the signal in simple language.
6. The dashboard displays chart, metrics, and recommendation context.

## Architecture

The system follows a modular pipeline:

- **Data Layer:** Fetches stock price history for selected ticker.
- **Analysis Layer:** Computes technical indicators and pattern signals.
- **Intelligence Layer:** Converts signal output into plain-English AI insight.
- **Presentation Layer:** Displays charts, metrics, and signal summary to the user.

### Agent/Module Roles

- **Market Data Module:** Collects stock time-series data.
- **Signal Engine:** Detects meaningful technical setups.
- **AI Insight Engine:** Generates human-readable explanation from computed indicators.
- **UI Layer:** Shows output in a structured dashboard for demo and usability.

## Tech Overview

This project was rapidly prototyped to prioritize:
- Fast development
- Strong demo value
- Clear visual storytelling
- Practical investor use case

The implementation chooses tools automatically based on speed, reliability, and demo readiness.

## Demo

- **Pitch Video:** [Add your 3-minute video link here]
- **Live Demo:** [Add Replit/public app link here]
- **GitHub Repository:** [Add repo link here]

## Screenshots

Add 2–3 screenshots here before final submission:

### Dashboard
![Dashboard Screenshot](./assets/dashboard.png)

### AI Insight Panel
![AI Insight Screenshot](./assets/ai_insight.png)

### Signal View
![Signal Screenshot](./assets/signal_view.png)

## Setup Instructions

### 1. Clone the repository
```bash
git clone [YOUR_GITHUB_REPO_URL]
cd [YOUR_REPO_NAME]
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Add environment variables
Create a `.env` file in the root directory and add:

```env
GROQ_API_KEY=your_api_key_here
```

### 4. Run the application
```bash
python main.py
```

Or, if your app uses Streamlit:

```bash
streamlit run main.py
```

## Usage

- Open the app in the browser.
- Enter an NSE stock ticker.
- View detected signal, chart behavior, and AI-generated explanation.
- Use the output as a structured signal-assistance layer for quick investor understanding.

## Impact Model

This project aims to reduce the effort required for a retail investor to interpret technical signals.

### Estimated impact
- Manual chart review time: ~20–45 minutes per stock
- With ET RetailX: ~10–30 seconds per stock
- Faster signal interpretation can improve decision speed and reduce confusion for non-expert investors

### Business relevance
For a media-fintech platform like ET Markets, this can become:
- A sticky investor engagement feature
- A premium intelligence layer
- A daily active user retention tool
- A personalized signal discovery engine

## Real-World Potential

This prototype can be extended into:

- Portfolio-aware signal alerts
- Personalized watchlist intelligence
- Corporate filing + chart signal fusion
- AI-generated market briefings
- Trade journal and decision tracking
- Sector rotation and opportunity radar

## Repository Structure

```bash
artifacts-monorepo/
├── artifacts/              
│   └── api-server/         
├── lib/                    
│   ├── api-spec/           
│   ├── api-client-react/   
│   ├── api-zod/            
│   └── db/                 
├── scripts/                
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     
├── tsconfig.base.json      
├── tsconfig.json           
└── package.json            
```


## Future Improvements

- Add real backtesting engine on historical NSE universe
- Add multi-stock screening
- Add news and filings-based signal correlation
- Add portfolio-level recommendations
- Add user personalization for risk appetite and holding horizon

## Author

**Yashovardhan Thopte**
**Ritik Gupta**
B.S. in Data Science and Applications, IIT Madras

## License

This project is submitted for hackathon evaluation and educational purposes.
