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
import { MapPin, Utensils, Star, Users, Sparkles } from 'lucide-react'

interface Place {
  id: string
  name: string
  rating: number
  userRatingsTotal: number
  vicinity: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  types: string[]
  priceLevel?: number
  photos?: string
}

export default function WhatToEatPage() {
  const [step, setStep] = useState<'distance' | 'type' | 'result'>('distance')
  const [distance, setDistance] = useState<string>('')
  const [foodType, setFoodType] = useState<string>('all')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [restaurants, setRestaurants] = useState<Place[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Place[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Place | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [distanceDialogOpen, setDistanceDialogOpen] = useState(true)
  const [typeDialogOpen, setTypeDialogOpen] = useState(false)

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
        (err) => {
          setError('无法获取您的位置，请确保已允许位置访问权限')
          console.error('位置获取错误:', err)
        }
      )
    } else {
      setError('您的浏览器不支持地理位置功能')
    }
  }, [])

  // 食物类型选项
  const foodTypes = [
    { value: 'all', label: '全部类型' },
    { value: '中餐', label: '中餐' },
    { value: '日料', label: '日料' },
    { value: '韩式', label: '韩式料理' },
    { value: '西餐', label: '西餐' },
    { value: '意大利', label: '意大利菜' },
    { value: '墨西哥', label: '墨西哥菜' },
    { value: '泰国', label: '泰国菜' },
    { value: '印度', label: '印度菜' },
    { value: '火锅', label: '火锅' },
    { value: '烧烤', label: '烧烤' },
    { value: '快餐', label: '快餐' },
    { value: '咖啡', label: '咖啡厅' },
    { value: '甜品', label: '甜品店' },
  ]

  // 处理距离输入
  const handleDistanceSubmit = async () => {
    if (!distance || isNaN(Number(distance)) || Number(distance) <= 0) {
      setError('请输入有效的距离（单位：公里）')
      return
    }

    if (!userLocation) {
      setError('无法获取您的位置')
      return
    }

    setLoading(true)
    setError(null)
    setDistanceDialogOpen(false)

    try {
      // 将公里转换为米
      const radiusInMeters = Number(distance) * 1000

      const response = await fetch(
        `/api/places?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radiusInMeters}&type=all`
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '获取餐厅失败')
      }

      const data = await response.json()
      setRestaurants(data.places || [])
      setFilteredRestaurants(data.places || [])

      if (data.places.length === 0) {
        setError('在指定距离内没有找到餐厅，请尝试增加距离')
        setStep('distance')
        setDistanceDialogOpen(true)
      } else {
        setStep('type')
        setTypeDialogOpen(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取餐厅时出错')
      setStep('distance')
      setDistanceDialogOpen(true)
    } finally {
      setLoading(false)
    }
  }

  // 处理食物类型选择
  const handleTypeSelect = async () => {
    if (!userLocation || !distance) {
      return
    }

    setLoading(true)
    setError(null)
    setTypeDialogOpen(false)

    try {
      const radiusInMeters = Number(distance) * 1000
      const response = await fetch(
        `/api/places?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radiusInMeters}&type=${foodType}`
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '筛选餐厅失败')
      }

      const data = await response.json()
      let filtered = data.places || []

      // 如果选择了特定类型但没有结果，尝试使用关键词匹配
      if (filtered.length === 0 && foodType !== 'all') {
        filtered = restaurants.filter((restaurant) => {
          const nameLower = restaurant.name.toLowerCase()
          const typesLower = restaurant.types.join(' ').toLowerCase()
          const searchTerm = foodType.toLowerCase()
          return nameLower.includes(searchTerm) || typesLower.includes(searchTerm)
        })
      }

      setFilteredRestaurants(filtered)

      if (filtered.length === 0) {
        setError('没有找到符合条件的餐厅，请尝试选择其他类型')
        setStep('type')
        setTypeDialogOpen(true)
      } else {
        // 随机选择一个餐厅
        const randomIndex = Math.floor(Math.random() * filtered.length)
        setSelectedRestaurant(filtered[randomIndex])
        setStep('result')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '筛选餐厅时出错')
      setStep('type')
      setTypeDialogOpen(true)
    } finally {
      setLoading(false)
    }
  }

  // 重新开始
  const handleRestart = () => {
    setStep('distance')
    setDistance('')
    setFoodType('all')
    setRestaurants([])
    setFilteredRestaurants([])
    setSelectedRestaurant(null)
    setError(null)
    setDistanceDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-orange-500" />
            今天吃什么？
          </h1>
          <p className="text-lg text-gray-600">
            让我们帮你找到附近的美食吧！
          </p>
        </div>

        {/* 距离输入对话框 */}
        <Dialog open={distanceDialogOpen} onOpenChange={setDistanceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="text-orange-500" />
                第一步：选择距离
              </DialogTitle>
              <DialogDescription>
                请输入您希望搜索的距离范围（单位：公里）
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                type="number"
                placeholder="例如：2"
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
                disabled={loading || !distance}
                className="w-full"
              >
                {loading ? '搜索中...' : '确认'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 食物类型选择对话框 */}
        <Dialog open={typeDialogOpen} onOpenChange={setTypeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Utensils className="text-orange-500" />
                第二步：选择食物类型
              </DialogTitle>
              <DialogDescription>
                请选择您想吃的食物类型
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select value={foodType} onValueChange={setFoodType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择食物类型" />
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
            <DialogFooter>
              <Button
                onClick={handleTypeSelect}
                disabled={loading}
                className="w-full"
              >
                {loading ? '筛选中...' : '确认'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 错误提示 */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* 结果显示 */}
        {step === 'result' && selectedRestaurant && (
          <Card className="border-2 border-orange-200 shadow-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl mb-2">🎉 推荐餐厅</CardTitle>
              <CardDescription className="text-lg">
                为您找到了 {filteredRestaurants.length} 家符合条件的餐厅
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedRestaurant.name}
                </h2>
                <div className="flex items-center justify-center gap-4 text-gray-600 mb-4">
                  {selectedRestaurant.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-500 fill-yellow-500" size={18} />
                      <span className="font-semibold">{selectedRestaurant.rating}</span>
                    </div>
                  )}
                  {selectedRestaurant.userRatingsTotal && (
                    <div className="flex items-center gap-1">
                      <Users size={18} />
                      <span>{selectedRestaurant.userRatingsTotal} 评价</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700 mb-4">
                  <MapPin size={18} className="text-orange-500" />
                  <span>{selectedRestaurant.vicinity}</span>
                </div>
                {selectedRestaurant.priceLevel && (
                  <div className="text-gray-600">
                    价格等级: {'$'.repeat(selectedRestaurant.priceLevel)}
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-center pt-4">
                <Button onClick={handleRestart} variant="outline" size="lg">
                  重新选择
                </Button>
                <Button
                  onClick={() => {
                    const randomIndex = Math.floor(Math.random() * filteredRestaurants.length)
                    setSelectedRestaurant(filteredRestaurants[randomIndex])
                  }}
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  换一个
                </Button>
                <Button
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${selectedRestaurant.geometry.location.lat},${selectedRestaurant.geometry.location.lng}&query_place_id=${selectedRestaurant.id}`,
                      '_blank'
                    )
                  }}
                  size="lg"
                  variant="default"
                >
                  查看地图
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 加载状态 */}
        {loading && (
          <Card className="mt-6">
            <CardContent className="pt-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                <span>正在搜索餐厅...</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

