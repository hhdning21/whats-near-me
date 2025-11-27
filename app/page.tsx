import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Utensils, GraduationCap, Sparkles, Filter, Shuffle, BookOpen, Users, Calendar } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            What's Near Me?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover restaurants, study spots, and resources near you. Built for UBC students to enhance campus life and wellbeing.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link href="/what-to-eat">
                <Utensils className="mr-2 h-5 w-5" />
                Find Restaurants
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/ubc-wellbeing">
                <GraduationCap className="mr-2 h-5 w-5" />
                UBC Wellbeing
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            icon={MapPin}
            title="Restaurant Discovery"
            description="Find restaurants near you using OpenStreetMap. Filter by cuisine type, sort by distance or rating, and let us help you decide what to eat!"
          />
          <FeatureCard
            icon={Filter}
            title="Smart Filtering"
            description="Filter restaurants by category (Chinese, Japanese, Italian, and more) and sort by distance, rating, or name to find exactly what you're craving."
          />
          <FeatureCard
            icon={Shuffle}
            title="Random Selection"
            description="Can't decide? Use our random restaurant picker to help you choose what to eat today. Perfect for when you're feeling indecisive!"
          />
          <FeatureCard
            icon={BookOpen}
            title="Study Spots"
            description="Discover the best study locations on UBC campus, from quiet libraries to cozy cafes. Find your perfect study environment."
          />
          <FeatureCard
            icon={Users}
            title="Campus Events"
            description="Stay connected with campus life. Find study groups, wellness events, career fairs, and social mixers happening around UBC."
          />
          <FeatureCard
            icon={Sparkles}
            title="Wellbeing Resources"
            description="Access wellness tips, study strategies, and resources designed to support UBC students' academic success and personal wellbeing."
          />
        </div>

        {/* Main Features Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <FeatureStep
              number="1"
              title="Allow Location Access"
              description="Enable location permissions so we can find restaurants and resources near you."
            />
            <FeatureStep
              number="2"
              title="Set Your Search Radius"
              description="Choose how far you're willing to travel (in kilometers) to find the perfect spot."
            />
            <FeatureStep
              number="3"
              title="Filter & Sort"
              description="Filter by cuisine type and sort by distance, rating, or name to narrow down your options."
            />
            <FeatureStep
              number="4"
              title="Get Recommendations"
              description="Browse results or use our random picker to help you decide what to eat today!"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Start discovering restaurants and resources near you right now!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link href="/what-to-eat">
                <Utensils className="mr-2 h-5 w-5" />
                Find Restaurants
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/ubc-wellbeing">
                <GraduationCap className="mr-2 h-5 w-5" />
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
  description 
}: { 
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string 
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <Icon className="h-8 w-8 text-blue-500 mb-3" />
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function FeatureStep({ 
  number, 
  title, 
  description 
}: { 
  number: string
  title: string
  description: string 
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}
