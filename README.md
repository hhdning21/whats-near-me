# What's Near Me - UBC Student App

A location-based app built for UBC students to discover restaurants, study spots, and campus resources. Built with Next.js, OpenStreetMap, and Tailwind CSS.

## 🍽️ Features

### Restaurant Discovery
- **Location-Based Search**: Find restaurants near you using OpenStreetMap API
- **Category Filtering**: Filter by cuisine type (Chinese, Japanese, Italian, Mexican, Thai, Indian, American, Fast Food, Cafe, Dessert, Vegetarian)
- **Smart Sorting**: Sort restaurants by distance, rating, or name
- **Random Selection**: Can't decide? Let the app randomly pick a restaurant for you!
- **Distance Calculation**: See exactly how far each restaurant is from your location

### UBC Student Wellbeing
- **Study Spots**: Discover the best study locations on campus (libraries, cafes, outdoor spaces)
- **Campus Events**: Stay connected with academic, social, wellness, and career events
- **Wellness Tips**: Access resources and tips for maintaining academic success and personal wellbeing
- **Quick Navigation**: Get directions to study spots and events

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm**, **yarn**, or **pnpm** (comes with Node.js)
- A code editor (we recommend [VS Code](https://code.visualstudio.com/))

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <your-repo-url>
   cd whats-near-me
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see your app!

## 📁 Project Structure

```
whats-near-me/
├── app/                    # Application pages and routes
│   ├── page.tsx           # Home page (/)
│   ├── what-to-eat/       # Restaurant discovery page
│   ├── ubc-wellbeing/     # UBC student resources page
│   ├── layout.tsx         # Root layout (wraps all pages)
│   ├── api/               # API routes
│   │   └── places/        # OpenStreetMap restaurant search API
│   └── globals.css        # Global styles + Tailwind config
├── components/            # Reusable React components
│   └── ui/               # UI components (buttons, cards, etc.)
├── lib/                   # Utility functions and helpers
│   └── utils.ts          # Helper functions
├── public/               # Static files (images, fonts, etc.)
└── README.md             # This file!
```

## 🗺️ How It Works

### Restaurant Search

1. **Allow Location Access**: The app requests your location to find nearby restaurants
2. **Set Search Radius**: Choose how far you want to search (in kilometers)
3. **Filter & Sort**: 
   - Filter by cuisine category
   - Sort by distance (nearest first), rating (highest first), or name (A-Z)
4. **Browse or Random Pick**: 
   - Browse through all results
   - Use the random picker to let the app decide for you!

### OpenStreetMap Integration

The app uses the **Overpass API** (OpenStreetMap's query language) to search for restaurants. This means:
- ✅ No API keys required
- ✅ Free and open-source
- ✅ Community-maintained data
- ✅ Privacy-friendly

## 🎨 Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **OpenStreetMap/Overpass API** - Location and restaurant data
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

## 🛠️ Building Your Web App

### Creating New Pages

Create a new folder in the `app/` directory:

```tsx
// app/projects/page.tsx
export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">My Projects</h1>
      <p className="mt-4">List your projects here!</p>
    </div>
  )
}
```

This automatically creates a route at `/projects`

### Adding Interactivity

Use React hooks for interactive features:

```tsx
'use client' // Add this for client-side interactivity

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Increment
      </button>
    </div>
  )
}
```

### Adding API Routes

Create API endpoints in `app/api/`:

```tsx
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: 'Hello from API!' })
}
```

Access at: `http://localhost:3000/api/hello`

## 🎯 Features for UBC Students

### Study Spots
- Irving K. Barber Learning Centre
- Koerner Library
- Campus cafes and outdoor spaces
- Study rooms and group spaces

### Campus Events
- Wellness Wednesday sessions
- Study group meetups
- Career fairs
- Social mixers

### Wellness Resources
- Study break strategies
- Time management tips
- Social connection resources
- Physical wellness guidance

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Click "Deploy"

Your app will be live in minutes!

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [OpenStreetMap Wiki](https://wiki.openstreetmap.org/)
- [Overpass API Documentation](https://wiki.openstreetmap.org/wiki/Overpass_API)

## 🆘 Common Issues

**Port already in use?**
```bash
# Kill the process on port 3000
npx kill-port 3000
```

**Styles not updating?**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**Module not found?**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## 🎉 Features Overview

- ✅ **No API Keys Required** - Uses free OpenStreetMap data
- ✅ **Privacy-Friendly** - Location data stays on your device
- ✅ **Mobile Responsive** - Works great on all devices
- ✅ **Fast & Lightweight** - Optimized for performance
- ✅ **UBC-Focused** - Built specifically for UBC students
- ✅ **Wellbeing Support** - Resources for student success

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements!

## 📄 License

This project is open source and available under the MIT License.

Happy exploring! 🚀
