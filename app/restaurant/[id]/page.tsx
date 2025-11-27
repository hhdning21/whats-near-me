'use client'

import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { restaurants, calculateDistance, UBC_CENTERS } from '@/lib/restaurants'
import { MapPin, Star, Clock, Phone, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function RestaurantPage() {
  const params = useParams()
  const id = params.id as string
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const restaurant = restaurants.find((r) => r.id === id)

  // 获取用户位置
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
          setUserLocation(UBC_CENTERS.main)
        }
      )
    } else {
      setUserLocation(UBC_CENTERS.main)
    }
  }, [])

  if (!restaurant) {
    notFound()
  }

  const distance =
    userLocation
      ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          restaurant.location.coordinates.lat,
          restaurant.location.coordinates.lng
        )
      : null

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}米`
    }
    return `${(meters / 1000).toFixed(1)}公里`
  }

  // Get cuisine icon
  const getCuisineIcon = (cuisine: string): string => {
    const iconMap: Record<string, string> = {
      'chinese': '🥢',
      'japanese': '🍣',
      'korean': '🍜',
      'italian': '🍝',
      'mexican': '🌮',
      'thai': '🍛',
      'indian': '🍛',
      'american': '🍔',
      'fast-food': '🍟',
      'fast_food': '🍟',
      'cafe': '☕',
      'dessert': '🍰',
      'vegetarian': '🥗',
      'western': '🍖',
      'other': '🍽️',
    }
    return iconMap[cuisine.toLowerCase()] || '🍽️'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">餐厅详情</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-2 mb-2">
              <CardTitle className="text-2xl">{restaurant.name}</CardTitle>
              <Badge variant="secondary" className="text-sm flex items-center gap-1.5">
                <span className="text-base">{getCuisineIcon(restaurant.cuisine)}</span>
                <span>{restaurant.cuisineLabel}</span>
              </Badge>
            </div>
            <CardDescription className="text-base">{restaurant.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 评分和价格 */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-semibold">{restaurant.rating}</span>
              </div>
              <div className="text-lg font-medium">{restaurant.priceRange}</div>
              {distance !== null && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="size-4" />
                  <span>{formatDistance(distance)}</span>
                </div>
              )}
            </div>

            {/* 位置信息 */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="size-5" />
                位置
              </h3>
              <div className="pl-7 space-y-1">
                <p className="font-medium">{restaurant.location.building}</p>
                <p className="text-sm text-muted-foreground">{restaurant.location.address}</p>
              </div>
            </div>

            {/* 营业时间 */}
            {restaurant.hours && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="size-5" />
                  营业时间
                </h3>
                <p className="pl-7">{restaurant.hours}</p>
              </div>
            )}

            {/* 联系电话 */}
            {restaurant.phone && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Phone className="size-5" />
                  联系电话
                </h3>
                <a href={`tel:${restaurant.phone}`} className="pl-7 text-primary hover:underline">
                  {restaurant.phone}
                </a>
              </div>
            )}

            {/* 地图链接（可以集成Google Maps） */}
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${restaurant.location.coordinates.lat},${restaurant.location.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  在 Google Maps 中查看
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

