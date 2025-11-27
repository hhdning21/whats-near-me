// UBC campus restaurant data model and sample data

export type CuisineType = 'korean' | 'chinese' | 'japanese' | 'western' | 'indian' | 'mexican' | 'cafe' | 'fast-food' | 'other'

export interface Restaurant {
  id: string
  name: string
  cuisine: CuisineType
  cuisineLabel: string
  description: string
  location: {
    building: string
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  rating: number
  priceRange: '$' | '$$' | '$$$'
  image?: string
  hours?: string
  phone?: string
}

// UBC main building coordinates (for distance calculation)
export const UBC_CENTERS = {
  // UBC main campus center point (near Student Union Building)
  main: { lat: 49.2606, lng: -123.2460 },
  // Other common reference points
  library: { lat: 49.2603, lng: -123.2465 },
  bookstore: { lat: 49.2608, lng: -123.2462 },
}

// Calculate distance between two points (using Haversine formula, returns meters)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000 // Earth radius (meters)
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Sample restaurant data
export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Korean BBQ House',
    cuisine: 'korean',
    cuisineLabel: 'Korean',
    description: 'Authentic Korean BBQ and stone pot rice, affordable prices',
    location: {
      building: 'Student Union Building',
      address: '6133 University Blvd',
      coordinates: { lat: 49.2606, lng: -123.2460 },
    },
    rating: 4.5,
    priceRange: '$$',
    hours: '11:00 AM - 9:00 PM',
    phone: '(604) 123-4567',
  },
  {
    id: '2',
    name: 'Golden Dragon',
    cuisine: 'chinese',
    cuisineLabel: 'Chinese',
    description: 'Classic Cantonese and Sichuan cuisine, perfect for gatherings',
    location: {
      building: 'University Village',
      address: '5728 University Blvd',
      coordinates: { lat: 49.2620, lng: -123.2450 },
    },
    rating: 4.3,
    priceRange: '$$',
    hours: '10:30 AM - 10:00 PM',
    phone: '(604) 234-5678',
  },
  {
    id: '3',
    name: 'Sushi Express',
    cuisine: 'japanese',
    cuisineLabel: 'Japanese',
    description: 'Fresh sushi and Japanese ramen, quick service',
    location: {
      building: 'Student Union Building',
      address: '6133 University Blvd',
      coordinates: { lat: 49.2605, lng: -123.2461 },
    },
    rating: 4.6,
    priceRange: '$$',
    hours: '11:30 AM - 8:30 PM',
    phone: '(604) 345-6789',
  },
  {
    id: '4',
    name: 'The Point Grill',
    cuisine: 'western',
    cuisineLabel: 'Western',
    description: 'American burgers and steaks, student favorite',
    location: {
      building: 'Student Union Building',
      address: '6133 University Blvd',
      coordinates: { lat: 49.2607, lng: -123.2459 },
    },
    rating: 4.2,
    priceRange: '$$',
    hours: '10:00 AM - 10:00 PM',
    phone: '(604) 456-7890',
  },
  {
    id: '5',
    name: 'Curry Corner',
    cuisine: 'indian',
    cuisineLabel: 'Indian',
    description: 'Authentic Indian curry and naan bread',
    location: {
      building: 'University Village',
      address: '5728 University Blvd',
      coordinates: { lat: 49.2618, lng: -123.2452 },
    },
    rating: 4.4,
    priceRange: '$',
    hours: '12:00 PM - 9:00 PM',
    phone: '(604) 567-8901',
  },
  {
    id: '6',
    name: 'Taco Loco',
    cuisine: 'mexican',
    cuisineLabel: 'Mexican',
    description: 'Freshly made Mexican tacos and nachos',
    location: {
      building: 'Student Union Building',
      address: '6133 University Blvd',
      coordinates: { lat: 49.2604, lng: -123.2462 },
    },
    rating: 4.1,
    priceRange: '$',
    hours: '11:00 AM - 8:00 PM',
    phone: '(604) 678-9012',
  },
  {
    id: '7',
    name: 'Blue Chip Cookies',
    cuisine: 'cafe',
    cuisineLabel: 'Cafe',
    description: 'Freshly baked cookies and premium coffee',
    location: {
      building: 'Student Union Building',
      address: '6133 University Blvd',
      coordinates: { lat: 49.2608, lng: -123.2458 },
    },
    rating: 4.0,
    priceRange: '$',
    hours: '7:00 AM - 7:00 PM',
    phone: '(604) 789-0123',
  },
  {
    id: '8',
    name: 'Subway',
    cuisine: 'fast-food',
    cuisineLabel: 'Fast Food',
    description: 'Fresh sandwiches and salads',
    location: {
      building: 'Student Union Building',
      address: '6133 University Blvd',
      coordinates: { lat: 49.2609, lng: -123.2457 },
    },
    rating: 3.8,
    priceRange: '$',
    hours: '7:00 AM - 10:00 PM',
    phone: '(604) 890-1234',
  },
  {
    id: '9',
    name: 'Panda Express',
    cuisine: 'chinese',
    cuisineLabel: 'Chinese',
    description: 'American-style Chinese fast food, quick and convenient',
    location: {
      building: 'University Village',
      address: '5728 University Blvd',
      coordinates: { lat: 49.2622, lng: -123.2448 },
    },
    rating: 3.9,
    priceRange: '$',
    hours: '10:00 AM - 9:00 PM',
    phone: '(604) 901-2345',
  },
  {
    id: '10',
    name: 'Tim Hortons',
    cuisine: 'cafe',
    cuisineLabel: 'Cafe',
    description: 'Classic Canadian coffee and donuts',
    location: {
      building: 'Student Union Building',
      address: '6133 University Blvd',
      coordinates: { lat: 49.2610, lng: -123.2456 },
    },
    rating: 4.0,
    priceRange: '$',
    hours: '6:00 AM - 11:00 PM',
    phone: '(604) 012-3456',
  },
  {
    id: '11',
    name: 'Bento Sushi',
    cuisine: 'japanese',
    cuisineLabel: 'Japanese',
    description: 'Japanese bento boxes and sushi rolls',
    location: {
      building: 'University Village',
      address: '5728 University Blvd',
      coordinates: { lat: 49.2624, lng: -123.2446 },
    },
    rating: 4.2,
    priceRange: '$$',
    hours: '11:00 AM - 8:00 PM',
    phone: '(604) 123-7890',
  },
  {
    id: '12',
    name: 'The Gallery',
    cuisine: 'western',
    cuisineLabel: 'Western',
    description: 'Fine Western cuisine, perfect for dates',
    location: {
      building: 'Student Union Building',
      address: '6133 University Blvd',
      coordinates: { lat: 49.2603, lng: -123.2463 },
    },
    rating: 4.7,
    priceRange: '$$$',
    hours: '5:00 PM - 10:00 PM',
    phone: '(604) 234-8901',
  },
]

// Get all cuisine types
export function getCuisineTypes(): { value: CuisineType; label: string }[] {
  const types = new Map<CuisineType, string>()
  restaurants.forEach((r) => {
    types.set(r.cuisine, r.cuisineLabel)
  })
  return Array.from(types.entries()).map(([value, label]) => ({ value, label }))
}


