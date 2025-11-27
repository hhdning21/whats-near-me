import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Utensils, GraduationCap, Sparkles, Filter, Shuffle, BookOpen, Users, Calendar, ChefHat, Heart, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-pink-50/30 to-rose-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 flex justify-center items-center gap-3">
            <ChefHat className="h-12 w-12 text-orange-500 animate-bounce" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-600 via-pink-500 to-rose-600 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-poppins)' }}>
              What's Near Me?
            </h1>
            <Sparkles className="h-12 w-12 text-pink-500 animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl text-orange-800/80 mb-4 font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
            🍽️ Discover Your Food Paradise
          </p>
          <p className="text-lg text-orange-700/70 mb-10 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
            Discover delicious restaurants, explore diverse cuisines, and let your taste buds guide you to the perfect meal near UBC campus.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-16">
            <Button size="lg" asChild className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6 rounded-full">
              <Link href="/what-to-eat" className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Find Restaurants
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 text-lg px-8 py-6 rounded-full">
              <Link href="/ubc-wellbeing" className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                UBC Wellbeing
              </Link>
            </Button>
          </div>
        </div>

        {/* Food Icons Decoration */}
        <div className="flex justify-center gap-8 mb-16 text-4xl opacity-60">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>🍕</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🍜</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🍣</span>
          <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🌮</span>
          <span className="animate-bounce" style={{ animationDelay: '0.8s' }}>🍔</span>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            icon={MapPin}
            title="Restaurant Discovery"
            description="Find restaurants near you using OpenStreetMap. Filter by cuisine type, sort by distance or rating, and let us help you decide what to eat!"
            emoji="📍"
          />
          <FeatureCard
            icon={Filter}
            title="Smart Filtering"
            description="Filter restaurants by category (Chinese, Japanese, Italian, and more) and sort by distance, rating, or name to find exactly what you're craving."
            emoji="🔍"
          />
          <FeatureCard
            icon={Shuffle}
            title="Random Selection"
            description="Can't decide? Use our random restaurant picker to help you choose what to eat today. Perfect for when you're feeling indecisive!"
            emoji="🎲"
          />
          <FeatureCard
            icon={Star}
            title="Ratings & Reviews"
            description="See ratings and reviews to make informed decisions. Find the best-rated restaurants near you!"
            emoji="⭐"
          />
          <FeatureCard
            icon={Heart}
            title="Personalized Recommendations"
            description="Get personalized restaurant recommendations based on your location and preferences."
            emoji="❤️"
          />
          <FeatureCard
            icon={ChefHat}
            title="Diverse Cuisines"
            description="Explore a wide variety of cuisines from around the world, all within walking distance of UBC campus."
            emoji="👨‍🍳"
          />
        </div>

        {/* Main Features Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-orange-900" style={{ fontFamily: 'var(--font-poppins)' }}>
            How It Works
          </h2>
          <div className="space-y-8">
            <FeatureStep
              number="1"
              title="Allow Location Access"
              description="Enable location permissions so we can find restaurants and resources near you."
              emoji="📍"
            />
            <FeatureStep
              number="2"
              title="Set Your Search Radius"
              description="Choose how far you're willing to travel (in kilometers) to find the perfect spot."
              emoji="📏"
            />
            <FeatureStep
              number="3"
              title="Filter & Sort"
              description="Filter by cuisine type and sort by distance, rating, or name to narrow down your options."
              emoji="🔍"
            />
            <FeatureStep
              number="4"
              title="Get Recommendations"
              description="Browse results or use our random picker to help you decide what to eat today!"
              emoji="🍽️"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 max-w-3xl mx-auto text-center bg-gradient-to-r from-orange-100/50 to-pink-100/50 rounded-3xl p-12 border-2 border-orange-200/50 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-orange-900" style={{ fontFamily: 'var(--font-poppins)' }}>
            Ready to Explore? 🍴
          </h2>
          <p className="text-lg text-orange-800/80 mb-8 leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
            Start discovering restaurants and resources near you right now! Your next delicious meal is just a click away.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6 rounded-full">
              <Link href="/what-to-eat" className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Find Restaurants
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 text-lg px-8 py-6 rounded-full">
              <Link href="/ubc-wellbeing" className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Explore UBC Resources
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description,
  emoji
}: { 
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  emoji: string
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-2 border-orange-100 hover:border-orange-300 hover:scale-105">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl">{emoji}</div>
        <Icon className="h-8 w-8 text-orange-500" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-orange-900" style={{ fontFamily: 'var(--font-poppins)' }}>{title}</h3>
      <p className="text-orange-700/80 leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>{description}</p>
    </div>
  )
}

function FeatureStep({ 
  number, 
  title, 
  description,
  emoji
}: { 
  number: string
  title: string
  description: string
  emoji: string
}) {
  return (
    <div className="flex gap-4 items-start bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-400 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{emoji}</span>
          <h3 className="text-xl font-bold text-orange-900" style={{ fontFamily: 'var(--font-poppins)' }}>{title}</h3>
        </div>
        <p className="text-orange-700/80 leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>{description}</p>
      </div>
    </div>
  )
}
