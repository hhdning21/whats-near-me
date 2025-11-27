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
  eventDate?: Date // For sorting and filtering
}

const studySpots: StudySpot[] = [
  // Libraries
  {
    id: '1',
    name: 'Irving K. Barber Learning Centre',
    description: '',
    location: '1961 East Mall',
    type: 'library',
    capacity: 'High',
    hours: '24/7 during exam periods',
    amenities: ['WiFi', 'Printing', 'Group Rooms', 'Quiet Zones', 'Computers']
  },
  {
    id: '2',
    name: 'Koerner Library',
    description: '',
    location: '1958 Main Mall',
    type: 'library',
    capacity: 'Medium',
    hours: '7:30 AM - 11:00 PM',
    amenities: ['WiFi', 'Printing', 'Quiet Zones', 'Study Carrels', 'Research Support']
  },
  {
    id: '3',
    name: 'Woodward Library',
    description: '',
    location: '2198 Health Sciences Mall',
    type: 'library',
    capacity: 'High',
    hours: '8:00 AM - 10:00 PM',
    amenities: ['WiFi', 'Printing', 'Group Rooms', 'Scientific Resources', 'Study Spaces']
  },
  {
    id: '4',
    name: 'Law Library',
    description: '',
    location: '1822 East Mall',
    type: 'library',
    capacity: 'Medium',
    hours: '8:00 AM - 11:00 PM',
    amenities: ['WiFi', 'Printing', 'Legal Resources', 'Quiet Study', 'Research Support']
  },
  {
    id: '5',
    name: 'Music Library',
    description: '',
    location: '6361 Memorial Road',
    type: 'library',
    capacity: 'Low',
    hours: '9:00 AM - 9:00 PM',
    amenities: ['WiFi', 'Music Collections', 'Listening Stations', 'Quiet Study']
  },
  {
    id: '6',
    name: 'Education Library',
    description: '',
    location: '2125 Main Mall',
    type: 'library',
    capacity: 'Medium',
    hours: '8:30 AM - 9:00 PM',
    amenities: ['WiFi', 'Printing', 'Curriculum Materials', 'Group Study', 'Teaching Resources']
  },
  {
    id: '7',
    name: 'Asian Library',
    description: '',
    location: '1871 West Mall',
    type: 'library',
    capacity: 'Medium',
    hours: '9:00 AM - 8:00 PM',
    amenities: ['WiFi', 'Asian Collections', 'Quiet Study', 'Research Support', 'Multilingual Resources']
  },
  {
    id: '8',
    name: 'Xwi7xwa Library',
    description: '',
    location: '1985 West Mall',
    type: 'library',
    capacity: 'Low',
    hours: '9:00 AM - 5:00 PM',
    amenities: ['WiFi', 'Indigenous Resources', 'Quiet Study', 'Research Support']
  },
  {
    id: '9',
    name: 'David Lam Library',
    description: '',
    location: '2033 Main Mall',
    type: 'library',
    capacity: 'High',
    hours: '8:00 AM - 10:00 PM',
    amenities: ['WiFi', 'Printing', 'Group Rooms', 'Collaborative Spaces', 'Computers']
  },
  {
    id: '10',
    name: 'Rare Books and Special Collections',
    description: '',
    location: '1958 Main Mall',
    type: 'library',
    capacity: 'Low',
    hours: '9:00 AM - 5:00 PM',
    amenities: ['WiFi', 'Special Collections', 'Research Support', 'Quiet Study']
  },
  {
    id: '11',
    name: 'Biological Sciences Library',
    description: '',
    location: '2350 Health Sciences Mall',
    type: 'library',
    capacity: 'Medium',
    hours: '8:00 AM - 9:00 PM',
    amenities: ['WiFi', 'Scientific Resources', 'Group Study', 'Research Support']
  },
  {
    id: '12',
    name: 'Earth Sciences Library',
    description: '',
    location: '6339 Stores Road',
    type: 'library',
    capacity: 'Low',
    hours: '8:30 AM - 8:00 PM',
    amenities: ['WiFi', 'Earth Sciences Resources', 'Quiet Study', 'Research Support']
  },
  // Cafes and other study spaces
  {
    id: '13',
    name: 'Starbucks at UBC',
    description: 'Popular spot for group study sessions with coffee',
    location: 'Student Union Building',
    type: 'cafe',
    capacity: 'Medium',
    hours: '7:00 AM - 9:00 PM',
    amenities: ['WiFi', 'Food', 'Beverages', 'Group Tables']
  },
  {
    id: '14',
    name: 'Rose Garden',
    description: 'Beautiful outdoor space perfect for reading and studying in good weather',
    location: 'Near Main Library',
    type: 'outdoor',
    capacity: 'Low',
    hours: 'Dawn to Dusk',
    amenities: ['Outdoor Seating', 'Scenic Views']
  },
  {
    id: '15',
    name: 'AMS Nest Study Spaces',
    description: 'Convenient study areas in the student union building',
    location: '6133 University Blvd',
    type: 'study_room',
    capacity: 'Medium',
    hours: '7:00 AM - 11:00 PM',
    amenities: ['WiFi', 'Group Rooms', 'Food Nearby']
  }
]

// Generate events for the next month
const generateEvents = (): CampusEvent[] => {
  const events: CampusEvent[] = []
  const today = new Date()
  const nextMonth = new Date(today)
  nextMonth.setMonth(today.getMonth() + 1)
  
  // Helper to format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  // Wellness Events
  for (let i = 0; i < 4; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i * 7)
    if (date <= nextMonth) {
      events.push({
        id: `wellness-${i + 1}`,
        title: 'Wellness Wednesday',
        description: 'Free yoga and meditation sessions for students',
        date: formatDate(date),
        time: '12:00 PM - 1:00 PM',
        location: 'Student Recreation Centre',
        type: 'wellness',
        eventDate: date
      })
    }
  }

  // Academic Events
  const academicEvents = [
    { title: 'Study Group Meetup', description: 'Connect with other students for group study sessions', time: '2:00 PM - 4:00 PM', location: 'Irving K. Barber Learning Centre' },
    { title: 'Research Methods Workshop', description: 'Learn effective research strategies and citation methods', time: '3:00 PM - 5:00 PM', location: 'Koerner Library' },
    { title: 'Academic Writing Support', description: 'Get help with essay writing and academic papers', time: '1:00 PM - 3:00 PM', location: 'Writing Centre' },
    { title: 'Exam Prep Session', description: 'Prepare for upcoming exams with study techniques', time: '6:00 PM - 8:00 PM', location: 'Student Union Building' }
  ]
  academicEvents.forEach((event, idx) => {
    const date = new Date(today)
    date.setDate(today.getDate() + idx * 5 + 2)
    if (date <= nextMonth) {
      events.push({
        id: `academic-${idx + 1}`,
        ...event,
        date: formatDate(date),
        type: 'academic',
        eventDate: date
      })
    }
  })

  // Social Events
  const socialEvents = [
    { title: 'Student Social Mixer', description: 'Meet new people and make friends', time: '6:00 PM - 8:00 PM', location: 'The Pit Pub' },
    { title: 'Campus Movie Night', description: 'Watch movies with fellow students', time: '7:00 PM - 10:00 PM', location: 'AMS Nest' },
    { title: 'Game Night', description: 'Board games and video games for all', time: '5:00 PM - 9:00 PM', location: 'Student Union Building' },
    { title: 'Coffee Chat', description: 'Casual meetup over coffee and snacks', time: '3:00 PM - 5:00 PM', location: 'Starbucks at UBC' }
  ]
  socialEvents.forEach((event, idx) => {
    const date = new Date(today)
    date.setDate(today.getDate() + idx * 6 + 1)
    if (date <= nextMonth) {
      events.push({
        id: `social-${idx + 1}`,
        ...event,
        date: formatDate(date),
        type: 'social',
        eventDate: date
      })
    }
  })

  // Career Events
  const careerEvents = [
    { title: 'Career Fair', description: 'Meet employers and explore career opportunities', time: '10:00 AM - 3:00 PM', location: 'AMS Nest' },
    { title: 'Resume Workshop', description: 'Learn how to create an effective resume', time: '2:00 PM - 4:00 PM', location: 'Career Centre' },
    { title: 'Networking Event', description: 'Connect with industry professionals', time: '5:00 PM - 7:00 PM', location: 'Robert H. Lee Alumni Centre' },
    { title: 'Interview Skills Workshop', description: 'Practice and improve your interview techniques', time: '1:00 PM - 3:00 PM', location: 'Career Centre' }
  ]
  careerEvents.forEach((event, idx) => {
    const date = new Date(today)
    date.setDate(today.getDate() + idx * 7 + 3)
    if (date <= nextMonth) {
      events.push({
        id: `career-${idx + 1}`,
        ...event,
        date: formatDate(date),
        type: 'career',
        eventDate: date
      })
    }
  })

  // Sort by date
  return events.sort((a, b) => {
    if (a.eventDate && b.eventDate) {
      return a.eventDate.getTime() - b.eventDate.getTime()
    }
    return 0
  })
}

const campusEvents: CampusEvent[] = generateEvents()

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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/30 to-amber-100/50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-700 via-orange-700 to-amber-800 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3 hover:from-amber-800 hover:via-orange-800 hover:to-amber-900 transition-all cursor-pointer drop-shadow-sm" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, letterSpacing: '-0.02em' }}>
              <GraduationCap className="text-amber-700" />
              UBC Student Wellbeing
            </h1>
          </Link>
          <p className="text-lg text-amber-900/70 font-medium leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 400 }}>
            Resources and tools to support your academic success and personal wellbeing
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-amber-200/50 bg-gradient-to-br from-white to-amber-50/50 hover:border-amber-300 hover:scale-105">
            <CardHeader className="bg-gradient-to-r from-amber-100/50 to-orange-100/50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-amber-900" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>
                <Utensils className="text-amber-700" />
                Find Food
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-amber-900/70 mb-4 font-medium leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                Discover restaurants near campus
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md">
                <Link href="/what-to-eat">Explore Restaurants</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-amber-200/50 bg-gradient-to-br from-white to-amber-50/50 hover:border-amber-300 hover:scale-105">
            <CardHeader className="bg-gradient-to-r from-amber-100/50 to-orange-100/50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <MapPin className="text-amber-700" />
                Study Spots
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-amber-900/70 mb-4 font-medium">
                Find the perfect place to study
              </p>
              <Button asChild variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400">
                <a href="#study-spots">View Spots</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-amber-200/50 bg-gradient-to-br from-white to-amber-50/50 hover:border-amber-300 hover:scale-105">
            <CardHeader className="bg-gradient-to-r from-amber-100/50 to-orange-100/50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Calendar className="text-amber-700" />
                Campus Events
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-amber-900/70 mb-4 font-medium">
                Stay connected with campus life
              </p>
              <Button asChild variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400">
                <a href="#events">View Events</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Wellness Tips */}
        <Card className="mb-10 border-2 border-amber-200/50 bg-gradient-to-br from-white to-amber-50/30 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-100/50 to-orange-100/50 rounded-t-lg border-b border-amber-200/50">
            <CardTitle className="text-amber-900" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>Wellness Tips</CardTitle>
            <CardDescription className="text-amber-800/70" style={{ fontFamily: 'var(--font-inter)' }}>Simple strategies to maintain your wellbeing</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {wellnessTips.map((tip, index) => {
                const Icon = tip.icon
                return (
                  <div key={index} className="p-5 border-2 border-amber-200/50 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-amber-50/30 hover:border-amber-300 hover:scale-105">
                    <Icon className="h-7 w-7 text-amber-700 mb-3" />
                    <h3 className="font-semibold mb-2 text-amber-900" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>{tip.title}</h3>
                    <p className="text-sm text-amber-900/70 leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>{tip.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Study Spots */}
        <div id="study-spots" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-amber-900" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>
            <BookOpen className="text-amber-700" />
            Study Spots on Campus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {studySpots.map((spot) => (
              <Card key={spot.id} className="hover:shadow-xl transition-all duration-300 border-2 border-amber-200/50 bg-gradient-to-br from-white to-amber-50/30 hover:border-amber-300 hover:scale-[1.02]">
                <CardHeader className="bg-gradient-to-r from-amber-100/50 to-orange-100/50 rounded-t-lg border-b border-amber-200/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-amber-900 mb-2" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>{spot.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1 text-amber-800/70" style={{ fontFamily: 'var(--font-inter)' }}>
                        <MapPin className="h-3 w-3 text-amber-700" />
                        {spot.location}
                        {userLocation && (
                          <span className="text-xs font-medium">• {getSpotDistance(spot)} away</span>
                        )}
                      </CardDescription>
                    </div>
                    <Badge className="bg-amber-700/10 text-amber-800 border-amber-300/50 font-medium">{spot.type.replace('_', ' ')}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {spot.description && spot.type !== 'library' && (
                    <p className="text-sm text-amber-900/80 mb-4 leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>{spot.description}</p>
                  )}
                  {spot.hours && (
                    <div className="flex items-center gap-2 text-sm text-amber-800/70 mb-3 bg-amber-50/50 p-2 rounded-lg">
                      <Clock className="h-4 w-4 text-amber-700" />
                      <span className="font-medium">{spot.hours}</span>
                    </div>
                  )}
                  {spot.capacity && (
                    <div className="text-sm text-amber-800/70 mb-4 font-medium">
                      Capacity: <span className="text-amber-900">{spot.capacity}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {spot.amenities.map((amenity, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-amber-300/50 text-amber-800 bg-amber-50/50">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 font-medium"
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
        <div id="events" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-amber-900" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>
            <Calendar className="text-amber-700" />
            Upcoming Campus Events
          </h2>
          
          {/* Events grouped by type */}
          {(['wellness', 'academic', 'social', 'career'] as const).map((eventType) => {
            const typeEvents = campusEvents.filter(e => e.type === eventType)
            if (typeEvents.length === 0) return null

            const typeLabels = {
              wellness: 'Wellness Events',
              academic: 'Academic Events',
              social: 'Social Events',
              career: 'Career Events'
            }

            const typeIcons = {
              wellness: Heart,
              academic: BookOpen,
              social: Users,
              career: GraduationCap
            }

            const Icon = typeIcons[eventType]

            return (
              <div key={eventType} className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-amber-800" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>
                  <Icon className="h-6 w-6 text-amber-700" />
                  {typeLabels[eventType]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {typeEvents.map((event) => {
                    const badgeColors = {
                      wellness: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-700',
                      academic: 'bg-amber-100 text-amber-900 border-amber-300',
                      social: 'bg-orange-100 text-orange-900 border-orange-300',
                      career: 'bg-amber-200 text-amber-900 border-amber-400'
                    }
                    return (
                      <Card key={event.id} className="hover:shadow-xl transition-all duration-300 border-2 border-amber-200/50 bg-gradient-to-br from-white to-amber-50/30 hover:border-amber-300 hover:scale-[1.02]">
                        <CardHeader className="bg-gradient-to-r from-amber-100/50 to-orange-100/50 rounded-t-lg border-b border-amber-200/50">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg text-amber-900" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>{event.title}</CardTitle>
                            <Badge className={`${badgeColors[event.type]} border font-medium`}>
                              {event.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <p className="text-sm text-amber-900/80 mb-4 leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>{event.description}</p>
                          <div className="space-y-2 text-sm bg-amber-50/50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-amber-800/80">
                              <Calendar className="h-4 w-4 text-amber-700" />
                              <span className="font-medium">{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-amber-800/80">
                              <Clock className="h-4 w-4 text-amber-700" />
                              <span className="font-medium">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-amber-800/80">
                              <MapPin className="h-4 w-4 text-amber-700" />
                              <span className="font-medium">{event.location}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Back to Home */}
        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 font-medium px-8 py-6 text-lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

