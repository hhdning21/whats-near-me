import type { NextRequest } from 'next/server'

// Restaurant category mappings for OpenStreetMap
const categoryKeywords: Record<string, string[]> = {
  all: ['restaurant', 'cafe', 'fast_food', 'food_court'],
  chinese: ['chinese', 'restaurant'],
  japanese: ['japanese', 'sushi', 'restaurant'],
  korean: ['korean', 'restaurant'],
  italian: ['italian', 'pizza', 'restaurant'],
  mexican: ['mexican', 'restaurant'],
  thai: ['thai', 'restaurant'],
  indian: ['indian', 'restaurant'],
  american: ['american', 'burger', 'restaurant'],
  fast_food: ['fast_food', 'burger', 'pizza'],
  cafe: ['cafe', 'coffee_shop'],
  dessert: ['ice_cream', 'dessert', 'bakery'],
  vegetarian: ['vegetarian', 'vegan', 'restaurant'],
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const latitude = searchParams.get('lat')
  const longitude = searchParams.get('lng')
  const radius = searchParams.get('radius') // in meters
  const type = searchParams.get('type') || 'all' // food category
  const sortBy = searchParams.get('sortBy') || 'distance' // distance, rating, name

  if (!latitude || !longitude || !radius) {
    return Response.json(
      { error: 'Missing required parameters: lat, lng, radius' },
      { status: 400 }
    )
  }

  try {
    // Use Overpass API (OpenStreetMap query language) to find restaurants
    const keywords = categoryKeywords[type] || categoryKeywords.all
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"restaurant|cafe|fast_food|food_court"]["name"](around:${radius},${latitude},${longitude});
        way["amenity"~"restaurant|cafe|fast_food|food_court"]["name"](around:${radius},${latitude},${longitude});
        relation["amenity"~"restaurant|cafe|fast_food|food_court"]["name"](around:${radius},${latitude},${longitude});
      );
      out center meta;
    `

    const overpassUrl = 'https://overpass-api.de/api/interpreter'
    const response = await fetch(overpassUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`,
    })

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.statusText}`)
    }

    const data = await response.json()
    const elements = data.elements || []

    // Format and filter results
    let places = elements
      .filter((element: any) => {
        if (!element.tags?.name) return false
        
        // Filter by category if not 'all'
        if (type !== 'all' && keywords.length > 0) {
          const amenity = (element.tags.amenity || '').toLowerCase()
          const cuisine = (element.tags.cuisine || '').toLowerCase()
          const name = (element.tags.name || '').toLowerCase()
          
          const matchesCategory = keywords.some(keyword => 
            amenity.includes(keyword) || 
            cuisine.includes(keyword) || 
            name.includes(keyword)
          )
          
          if (!matchesCategory) return false
        }
        
        return true
      })
      .map((element: any) => {
        const lat = element.lat || element.center?.lat || parseFloat(latitude)
        const lng = element.lon || element.center?.lon || parseFloat(longitude)
        
        // Calculate distance
        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          lat,
          lng
        )

        // Extract cuisine types
        const cuisine = element.tags.cuisine || ''
        const amenity = element.tags.amenity || ''
        const types = [amenity, cuisine].filter(Boolean)

        return {
          id: element.id.toString(),
          name: element.tags.name || 'Unnamed Restaurant',
          rating: element.tags['stars'] ? parseFloat(element.tags['stars']) : null,
          userRatingsTotal: null, // OSM doesn't have rating counts
          vicinity: element.tags['addr:street'] 
            ? `${element.tags['addr:street']}, ${element.tags['addr:city'] || ''}`.trim()
            : 'Address not available',
          geometry: {
            location: {
              lat,
              lng,
            },
          },
          types,
          cuisine: cuisine || null,
          amenity: amenity || null,
          distance, // in meters
          website: element.tags.website || null,
          phone: element.tags.phone || null,
        }
      })

    // Sort results
    if (sortBy === 'distance') {
      places.sort((a, b) => a.distance - b.distance)
    } else if (sortBy === 'rating') {
      places.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === 'name') {
      places.sort((a, b) => a.name.localeCompare(b.name))
    }

    return Response.json({ places, total: places.length })
  } catch (error) {
    console.error('OpenStreetMap API error:', error)
    return Response.json(
      { error: 'Error fetching places from OpenStreetMap', details: String(error) },
      { status: 500 }
    )
  }
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

