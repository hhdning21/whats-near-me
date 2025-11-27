'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Users, 
  Calendar, 
  MapPin, 
  Coffee, 
  Dumbbell, 
  Heart,
  GraduationCap,
  Clock,
  Navigation,
  Utensils
} from 'lucide-react'
import Link from 'next/link'

// UBC Campus coordinates (main campus)
const UBC_CAMPUS = {
  lat: 49.2606,
  lng: -123.2460
}

interface StudySpot {
  id: string
  name: string
  description: string
  location: string
  type: 'library' | 'cafe' | 'outdoor' | 'study_room'
  capacity?: string
  hours?: string
  amenities: string[]
}

interface CampusEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  type: 'academic' | 'social' | 'wellness' | 'career'
}

const studySpots: StudySpot[] = [
  {
    id: '1',
    name: 'Irving K. Barber Learning Centre',
    description: 'Modern library with multiple floors, group study rooms, and quiet zones',
    location: '1961 East Mall',
    type: 'library',
    capacity: 'High',
    hours: '24/7 during exam periods',
    amenities: ['WiFi', 'Printing', 'Group Rooms', 'Quiet Zones']
  },
  {
    id: '2',
    name: 'Koerner Library',
    description: 'Great for quiet individual study with beautiful views',
    location: '1958 Main Mall',
    type: 'library',
    capacity: 'Medium',
    hours: '7:30 AM - 11:00 PM',
    amenities: ['WiFi', 'Printing', 'Quiet Zones', 'Study Carrels']
  },
  {
    id: '3',
    name: 'Starbucks at UBC',
    description: 'Popular spot for group study sessions with coffee',
    location: 'Student Union Building',
    type: 'cafe',
    capacity: 'Medium',
    hours: '7:00 AM - 9:00 PM',
    amenities: ['WiFi', 'Food', 'Beverages', 'Group Tables']
  },
  {
    id: '4',
    name: 'Rose Garden',
    description: 'Beautiful outdoor space perfect for reading and studying in good weather',
    location: 'Near Main Library',
    type: 'outdoor',
    capacity: 'Low',
    hours: 'Dawn to Dusk',
    amenities: ['Outdoor Seating', 'Scenic Views']
  },
  {
    id: '5',
    name: 'AMS Nest Study Spaces',
    description: 'Convenient study areas in the student union building',
    location: '6133 University Blvd',
    type: 'study_room',
    capacity: 'Medium',
    hours: '7:00 AM - 11:00 PM',
    amenities: ['WiFi', 'Group Rooms', 'Food Nearby']
  }
]

const campusEvents: CampusEvent[] = [
  {
    id: '1',
    title: 'Wellness Wednesday',
    description: 'Free yoga and meditation sessions for students',
    date: 'Every Wednesday',
    time: '12:00 PM - 1:00 PM',
    location: 'Student Recreation Centre',
    type: 'wellness'
  },
  {
    id: '2',
    title: 'Study Group Meetup',
    description: 'Connect with other students for group study sessions',
    date: 'Fridays',
    time: '2:00 PM - 4:00 PM',
    location: 'Irving K. Barber Learning Centre',
    type: 'academic'
  },
  {
    id: '3',
    title: 'Career Fair',
    description: 'Meet employers and explore career opportunities',
    date: 'Monthly',
    time: '10:00 AM - 3:00 PM',
    location: 'AMS Nest',
    type: 'career'
  },
  {
    id: '4',
    title: 'Student Social Mixer',
    description: 'Meet new people and make friends',
    date: 'First Friday of each month',
    time: '6:00 PM - 8:00 PM',
    location: 'The Pit Pub',
    type: 'social'
  }
]

const wellnessTips = [
  {
    title: 'Take Regular Breaks',
    description: 'Follow the 50-10 rule: 50 minutes of study, 10 minutes break',
    icon: Clock
  },
  {
    title: 'Stay Hydrated',
    description: 'Keep a water bottle with you and drink regularly throughout the day',
    icon: Heart
  },
  {
    title: 'Exercise Regularly',
    description: 'Visit the UBC Recreation Centre or take a walk around campus',
    icon: Dumbbell
  },
  {
    title: 'Connect with Others',
    description: 'Join study groups or campus clubs to build your social network',
    icon: Users
  },
  {
    title: 'Manage Your Time',
    description: 'Use a planner or app to organize your schedule and avoid burnout',
    icon: Calendar
  },
  {
    title: 'Find Your Study Space',
    description: 'Discover quiet spots on campus that work best for your learning style',
    icon: BookOpen
  }
]

export default function UBCWellbeingPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          // Use UBC campus as default if location unavailable
          setUserLocation(UBC_CAMPUS)
        }
      )
    } else {
      setUserLocation(UBC_CAMPUS)
    }
  }, [])

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)}m`
    return `${(meters / 1000).toFixed(1)}km`
  }

  const getSpotDistance = (spot: StudySpot) => {
    if (!userLocation) return null
    // Approximate coordinates for study spots (in real app, these would be accurate)
    return formatDistance(calculateDistance(userLocation.lat, userLocation.lng, UBC_CAMPUS.lat, UBC_CAMPUS.lng))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <GraduationCap className="text-green-600" />
            UBC Student Wellbeing
          </h1>
          <p className="text-lg text-gray-600">
            Resources and tools to support your academic success and personal wellbeing
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="text-orange-500" />
                Find Food
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Discover restaurants near campus
              </p>
              <Button asChild className="w-full">
                <Link href="/what-to-eat">Explore Restaurants</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="text-blue-500" />
                Study Spots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Find the perfect place to study
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="#study-spots">View Spots</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="text-purple-500" />
                Campus Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Stay connected with campus life
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="#events">View Events</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Wellness Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Wellness Tips</CardTitle>
            <CardDescription>Simple strategies to maintain your wellbeing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wellnessTips.map((tip, index) => {
                const Icon = tip.icon
                return (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <Icon className="h-6 w-6 text-green-600 mb-2" />
                    <h3 className="font-semibold mb-1">{tip.title}</h3>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Study Spots */}
        <div id="study-spots" className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="text-blue-500" />
            Study Spots on Campus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studySpots.map((spot) => (
              <Card key={spot.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{spot.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3" />
                        {spot.location}
                        {userLocation && (
                          <span className="text-xs">• {getSpotDistance(spot)} away</span>
                        )}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{spot.type.replace('_', ' ')}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{spot.description}</p>
                  {spot.hours && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Clock className="h-4 w-4" />
                      {spot.hours}
                    </div>
                  )}
                  {spot.capacity && (
                    <div className="text-sm text-gray-500 mb-3">
                      Capacity: {spot.capacity}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {spot.amenities.map((amenity, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => {
                      window.open(
                        `https://www.openstreetmap.org/?mlat=${UBC_CAMPUS.lat}&mlon=${UBC_CAMPUS.lng}&zoom=15`,
                        '_blank'
                      )
                    }}
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    View on Map
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Campus Events */}
        <div id="events">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="text-purple-500" />
            Upcoming Campus Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campusEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge
                      variant={
                        event.type === 'wellness'
                          ? 'default'
                          : event.type === 'academic'
                          ? 'secondary'
                          : event.type === 'social'
                          ? 'outline'
                          : 'default'
                      }
                    >
                      {event.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

