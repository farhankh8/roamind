# Roamind — AI Travel Intelligence Platform

> The smartest way for Indian travelers to plan, explore, and experience the world.

## Live Demo
[Add your Vercel URL here]

## What is Roamind?
Roamind is a full-stack AI-powered travel platform built for Indian travelers.
It combines AI itinerary planning, real-time data, and travel tools into one app.

## Features
- AI trip itinerary builder (Gemini powered)
- Flight deals tracker
- Hotel recommendations by budget
- Visa & passport info for Indian passport holders
- Smart packing list
- Travel budget & expense tracker
- Currency converter
- Weather updates
- Emergency contacts for 50+ countries
- Local guides marketplace
- Couchsurfing host network
- Passport badge gamification
- AI travel chat assistant
- Travel IQ quiz
- Restaurant finder (AI powered)
- Saved trips & bucket list

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend | Next.js API Routes |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| AI | Google Gemini, Anthropic Claude |
| Hosting | Vercel |
| Animations | Framer Motion |
| Maps | Leaflet |
| Charts | Chart.js |

## Quick Start

```bash
# Clone the repo
git clone <your-repo-url>
cd romind

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and fill in all API keys

# Run locally
npm run dev
```

Open http://localhost:3000

## Environment Variables

See .env.example for the full list.
Required: Firebase config, Gemini API key, EmailJS keys.

## Project Structure

```
app/          # Next.js App Router pages (43 routes)
components/  # Shared React components
lib/          # Firebase, DB utils, helpers
hooks/        # Custom React hooks
context/      # Auth context provider
types/        # TypeScript interfaces
constants/   # App-wide constants
data/        # Static destination data
```

## Scripts

```bash
npm run dev      # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
npm run typecheck # Run TypeScript check
```

## License
MIT