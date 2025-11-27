'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Utensils, Star, Users, Sparkles, Shuffle, ArrowLeft, Navigation, Phone, Globe } from 'lucide-react'
import Link from 'next/link'

interface Place {
  id: string
  name: string
  rating: number | null
  userRatingsTotal: number | null
  vicinity: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  types: string[]
  cuisine?: string | null
  amenity?: string | null
  distance?: number
  website?: string | null
  phone?: string | null
}

export default function WhatToEatPage() {
  const [step, setStep] = useState<'distance' | 'browse' | 'result'>('distance')
  const [distance, setDistance] = useState<string>('2')
  const [foodType, setFoodType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('distance')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [restaurants, setRestaurants] = useState<Place[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Place[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Place | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [distanceDialogOpen, setDistanceDialogOpen] = useState(true)
  const [typeDialogOpen, setTypeDialogOpen] = useState(false)

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (err) => {
          setError('Unable to get your location. Please ensure location permissions are enabled.')
          console.error('Location error:', err)
        }
      )
    } else {
      setError('Your browser does not support geolocation')
    }
  }, [])

  // Get cuisine icon
  const getCuisineIcon = (cuisine: string | null | undefined): string => {
    if (!cuisine) return '🍽️'
    const cuisineLower = cuisine.toLowerCase()
    const iconMap: Record<string, string> = {
      'chinese': '🥢',
      'japanese': '🍣',
      'korean': '🍜',
      'italian': '🍝',
      'mexican': '🌮',
      'thai': '🍛',
      'indian': '🍛',
      'american': '🍔',
      'fast_food': '🍟',
      'fast food': '🍟',
      'cafe': '☕',
      'dessert': '🍰',
      'vegetarian': '🥗',
      'western': '🍖',
      'other': '🍽️',
    }
    return iconMap[cuisineLower] || '🍽️'
  }

  // Food type options with icons
  const foodTypes = [
    { value: 'all', label: 'All Types', icon: '🍽️' },
    { value: 'chinese', label: 'Chinese', icon: '🥢' },
    { value: 'japanese', label: 'Japanese', icon: '🍣' },
    { value: 'korean', label: 'Korean', icon: '🍜' },
    { value: 'italian', label: 'Italian', icon: '🍝' },
    { value: 'mexican', label: 'Mexican', icon: '🌮' },
    { value: 'thai', label: 'Thai', icon: '🍛' },
    { value: 'indian', label: 'Indian', icon: '🍛' },
    { value: 'american', label: 'American', icon: '🍔' },
    { value: 'fast_food', label: 'Fast Food', icon: '🍟' },
    { value: 'cafe', label: 'Cafe', icon: '☕' },
    { value: 'dessert', label: 'Dessert', icon: '🍰' },
    { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
  ]

  // Client-side sorting for immediate feedback
  const sortRestaurants = (restaurants: Place[], sortBy: string): Place[] => {
    const sorted = [...restaurants]
    if (sortBy === 'distance') {
      sorted.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    }
    return sorted
  }

  // Handle distance input - close distance dialog and open type dialog
  const handleDistanceSubmit = () => {
    if (!distance || isNaN(Number(distance)) || Number(distance) <= 0) {
      setError('Please enter a valid distance (in kilometers)')
      return
    }

    if (!userLocation) {
      setError('Unable to get your location')
      return
    }

    setError(null)
    setDistanceDialogOpen(false)
    // Open the type selection dialog
    setTypeDialogOpen(true)
  }

  // Handle food type selection and search restaurants
  const handleTypeSelect = async () => {
    if (!userLocation || !distance) {
      setError('Missing required information')
      return
    }

    setLoading(true)
    setError(null)
    setTypeDialogOpen(false)

    try {
      const radiusInMeters = Number(distance) * 1000
      const response = await fetch(
        `/api/places?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radiusInMeters}&type=${foodType}&sortBy=${sortBy}`
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch restaurants')
      }

      const data = await response.json()
      const sortedPlaces = sortRestaurants(data.places || [], sortBy)
      setRestaurants(data.places || [])
      setFilteredRestaurants(sortedPlaces)

      if (data.places.length === 0) {
        setError('No restaurants found matching your criteria. Try selecting a different type or increasing the distance.')
        setStep('distance')
        setDistanceDialogOpen(true)
      } else {
        setStep('browse')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching restaurants')
      setStep('distance')
      setDistanceDialogOpen(true)
    } finally {
      setLoading(false)
    }
  }

  // Handle category filter changes - fetch new data from API
  const handleCategoryChange = async (newCategory: string) => {
    if (!userLocation || !distance) return

    setLoading(true)
    setError(null)

    try {
      const radiusInMeters = Number(distance) * 1000
      const response = await fetch(
        `/api/places?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radiusInMeters}&type=${newCategory}&sortBy=${sortBy}`
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to filter restaurants')
      }

      const data = await response.json()
      const sortedPlaces = sortRestaurants(data.places || [], sortBy)
      setRestaurants(data.places || [])
      setFilteredRestaurants(sortedPlaces)

      if (data.places.length === 0) {
        setError('No restaurants found matching your criteria. Try selecting a different category.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error filtering restaurants')
    } finally {
      setLoading(false)
    }
  }

  // Handle sort changes - sort existing restaurants immediately
  const handleSortChange = (newSortBy: string) => {
    if (filteredRestaurants.length > 0) {
      const sorted = sortRestaurants(filteredRestaurants, newSortBy)
      setFilteredRestaurants(sorted)
    }
  }

  // Random restaurant selection
  const handleRandomSelect = () => {
    if (filteredRestaurants.length === 0) {
      setError('No restaurants available to select from')
      return
    }
    const randomIndex = Math.floor(Math.random() * filteredRestaurants.length)
    setSelectedRestaurant(filteredRestaurants[randomIndex])
    setStep('result')
  }

  // Restart
  const handleRestart = () => {
    setStep('distance')
    setDistance('2')
    setFoodType('all')
    setSortBy('distance')
    setRestaurants([])
    setFilteredRestaurants([])
    setSelectedRestaurant(null)
    setError(null)
    setDistanceDialogOpen(true)
    setTypeDialogOpen(false)
  }

  // Format distance
  const formatDistance = (meters: number | undefined) => {
    if (!meters) return 'N/A'
    if (meters < 1000) return `${Math.round(meters)}m`
    return `${(meters / 1000).toFixed(1)}km`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3 hover:text-blue-600 transition-colors cursor-pointer">
              <Sparkles className="text-blue-500" />
              What's Near Me?
            </h1>
          </Link>
          <p className="text-lg text-gray-600">
            Discover restaurants near you and let us help you decide what to eat today!
          </p>
        </div>

        {/* Distance Input Dialog */}
        <Dialog open={distanceDialogOpen} onOpenChange={setDistanceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="text-blue-500" />
                Step 1: Set Search Distance
              </DialogTitle>
              <DialogDescription>
                Enter the distance range you want to search (in kilometers)
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                type="number"
                placeholder="e.g., 2"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleDistanceSubmit()
                  }
                }}
                className="text-lg"
                min="0.1"
                step="0.1"
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleDistanceSubmit}
                disabled={!distance}
                className="w-full"
              >
                Next: Choose Restaurant Type
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Food Type Selection Dialog */}
        <Dialog open={typeDialogOpen} onOpenChange={setTypeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Utensils className="text-blue-500" />
                Step 2: Choose Restaurant Type
              </DialogTitle>
              <DialogDescription>
                Select the type of cuisine you want to eat
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select value={foodType} onValueChange={setFoodType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select restaurant type" />
                </SelectTrigger>
                <SelectContent>
                  {foodTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="!flex-row !justify-stretch gap-2">
              <Button
                onClick={() => {
                  setTypeDialogOpen(false)
                  setDistanceDialogOpen(true)
                }}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleTypeSelect}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Searching...' : 'Search Restaurants'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Browse Results */}
        {step === 'browse' && (
          <div className="space-y-6">
            {/* Filters and Sort */}
            <Card>
              <CardHeader>
                <CardTitle>Filter & Sort</CardTitle>
                <CardDescription>
                  Found {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={foodType} onValueChange={(value) => {
                      setFoodType(value)
                      handleCategoryChange(value)
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {foodTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              <span>{type.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                    <Select value={sortBy} onValueChange={(value) => {
                      setSortBy(value)
                      handleSortChange(value)
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distance">Distance (Nearest First)</SelectItem>
                        <SelectItem value="rating">Rating (Highest First)</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={handleRandomSelect}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                    size="lg"
                  >
                    <Shuffle className="mr-2 h-4 w-4" />
                    Pick Random Restaurant
                  </Button>
                  <Button
                    onClick={handleRestart}
                    variant="outline"
                    size="lg"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    New Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Restaurant List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRestaurants.map((restaurant) => (
                <Card
                  key={restaurant.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => {
                    setSelectedRestaurant(restaurant)
                    setStep('result')
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {formatDistance(restaurant.distance)} away
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {restaurant.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="text-yellow-500 fill-yellow-500 h-4 w-4" />
                          <span className="text-sm font-medium">{restaurant.rating}</span>
                        </div>
                      )}
                      {restaurant.cuisine && (
                        <Badge variant="secondary" className="text-xs flex items-center gap-1.5 w-fit">
                          <span>{getCuisineIcon(restaurant.cuisine)}</span>
                          <span>{restaurant.cuisine}</span>
                        </Badge>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-2">{restaurant.vicinity}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Result Display */}
        {step === 'result' && selectedRestaurant && (
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl mb-2">🎉 Your Random Pick!</CardTitle>
              <CardDescription className="text-lg">
                Found {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} matching your criteria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedRestaurant.name}
                </h2>
                <div className="flex items-center justify-center gap-4 text-gray-600 mb-4 flex-wrap">
                  {selectedRestaurant.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-500 fill-yellow-500" size={18} />
                      <span className="font-semibold">{selectedRestaurant.rating}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin size={18} className="text-blue-500" />
                    <span>{formatDistance(selectedRestaurant.distance)} away</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700 mb-4">
                  <MapPin size={18} className="text-blue-500" />
                  <span>{selectedRestaurant.vicinity}</span>
                </div>
                {selectedRestaurant.cuisine && (
                  <Badge variant="secondary" className="mb-2 flex items-center gap-1.5 w-fit mx-auto">
                    <span className="text-base">{getCuisineIcon(selectedRestaurant.cuisine)}</span>
                    <span>{selectedRestaurant.cuisine}</span>
                  </Badge>
                )}
                {selectedRestaurant.phone && (
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                    <Phone size={16} />
                    <span className="text-sm">{selectedRestaurant.phone}</span>
                  </div>
                )}
                {selectedRestaurant.website && (
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                    <Globe size={16} />
                    <a
                      href={selectedRestaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-center pt-4 flex-wrap">
                <Button onClick={() => setStep('browse')} variant="outline" size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to List
                </Button>
                <Button
                  onClick={handleRandomSelect}
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Shuffle className="mr-2 h-4 w-4" />
                  Pick Another
                </Button>
                <Button
                  onClick={() => {
                    window.open(
                      `https://www.openstreetmap.org/?mlat=${selectedRestaurant.geometry.location.lat}&mlon=${selectedRestaurant.geometry.location.lng}&zoom=15`,
                      '_blank'
                    )
                  }}
                  size="lg"
                  variant="default"
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  View on Map
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="mt-6">
            <CardContent className="pt-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span>Searching for restaurants...</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
