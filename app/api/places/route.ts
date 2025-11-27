import type { NextRequest } from 'next/server'

// Restaurant category mappings for OpenStreetMap
const categoryKeywords: Record<string, string[]> = {
  all: ['restaurant', 'cafe', 'fast_food', 'food_court'],
  chinese: ['chinese'],
  japanese: ['japanese', 'sushi'],
  korean: ['korean'],
  italian: ['italian', 'pizza'],
  mexican: ['mexican'],
  thai: ['thai'],
  indian: ['indian'],
  american: ['american', 'burger'],
  fast_food: ['fast_food', 'burger'],
  cafe: ['cafe', 'coffee_shop'],
  dessert: ['ice_cream', 'dessert', 'bakery'],
  vegetarian: ['vegetarian', 'vegan'],
}

// Primary keywords that must match for strict filtering
const primaryKeywords: Record<string, string[]> = {
  chinese: ['chinese'],
  japanese: ['japanese', 'sushi'],
  korean: ['korean'],
  italian: ['italian'],
  mexican: ['mexican'],
  thai: ['thai'],
  indian: ['indian'],
  american: ['american'],
  fast_food: ['fast_food'],
  cafe: ['cafe', 'coffee_shop'],
  dessert: ['dessert', 'ice_cream', 'bakery'],
  vegetarian: ['vegetarian', 'vegan'],
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
        
        // Filter by category if not 'all' - strict matching
        if (type !== 'all') {
          const amenity = (element.tags.amenity || '').toLowerCase()
          const cuisine = (element.tags.cuisine || '').toLowerCase()
          const name = (element.tags.name || '').toLowerCase()
          
          // Get primary keywords for this category
          const primaryKeys = primaryKeywords[type] || []
          
          // Strict matching: must match at least one primary keyword
          // Priority: cuisine > amenity > name (for specific keywords only)
          const matchesCategory = primaryKeys.some(keyword => {
            // First priority: cuisine tag (most reliable)
            if (cuisine && cuisine.includes(keyword)) {
              return true
            }
            // Second priority: amenity tag
            if (amenity && amenity.includes(keyword)) {
              return true
            }
            // Third priority: name (only for specific cuisine keywords, not generic terms)
            if (keyword !== 'restaurant' && keyword !== 'cafe' && name.includes(keyword)) {
              return true
            }
            return false
          })
          
          // If no match found, exclude this restaurant
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
      places.sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0))
    } else if (sortBy === 'rating') {
      places.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === 'name') {
      places.sort((a: any, b: any) => a.name.localeCompare(b.name))
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

