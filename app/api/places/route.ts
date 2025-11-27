import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const latitude = searchParams.get('lat')
  const longitude = searchParams.get('lng')
  const radius = searchParams.get('radius') // 单位：米
  const type = searchParams.get('type') // 食物类型

  if (!latitude || !longitude || !radius) {
      return Response.json(
        { error: '缺少必需参数: lat, lng, radius' },
        { status: 400 }
      )
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: 'Google Maps API Key 未配置' },
      { status: 500 }
    )
  }

  try {
    // 构建 Google Places API 请求
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
    const params = new URLSearchParams({
      location: `${latitude},${longitude}`,
      radius: radius,
      type: 'restaurant',
      key: apiKey,
    })

    // 如果有食物类型，添加到请求中
    if (type && type !== 'all') {
      params.append('keyword', type)
    }

    const response = await fetch(`${baseUrl}?${params.toString()}`)
    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return Response.json(
        { error: `Google Maps API 错误: ${data.status}`, details: data },
        { status: 500 }
      )
    }

    // 格式化返回数据
    const places = (data.results || []).map((place: any) => ({
      id: place.place_id,
      name: place.name,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      vicinity: place.vicinity,
      geometry: {
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
      },
      types: place.types,
      priceLevel: place.price_level,
      photos: place.photos?.[0]?.photo_reference,
    }))

    return Response.json({ places, total: places.length })
  } catch (error) {
    console.error('Google Maps API 错误:', error)
    return Response.json(
      { error: '调用 Google Maps API 时出错', details: String(error) },
      { status: 500 }
    )
  }
}

