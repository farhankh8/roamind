'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Sidebar from '@/components/Sidebar'

const C = '#63d2ff'
const G = '#ffb74d'
const R = '#ff6b6b'
const BG = '#000814'

const navSections = [
  { title: 'Plan & Discover', items: [{ icon: '🏠', label: 'Dashboard', path: '/dashboard' }, { icon: '🤖', label: 'AI Itinerary', path: '/itinerary' }] },
  { title: 'Book & Travel', items: [{ icon: '✈️', label: 'Flights', path: '/flights' }, { icon: '🏨', label: 'Hotels', path: '/hotels' }, { icon: '🍽️', label: 'Restaurants', path: '/restaurants' }, { icon: '🚌', label: 'Transport', path: '/transport' }] },
  { title: 'Intelligence', items: [{ icon: '🛂', label: 'Visa Guide', path: '/visa' }, { icon: '💱', label: 'Currency', path: '/currency' }, { icon: '🌤️', label: 'Weather+AQI', path: '/weather' }, { icon: '🆘', label: 'Emergency', path: '/emergency' }] },
  { title: 'Discover People', items: [{ icon: '👨‍💼', label: 'Local Guides', path: '/guides' }, { icon: '🤝', label: 'Couch Surfing', path: '/couchsurfing' }] },
  { title: 'My Travel', items: [{ icon: '🏅', label: 'Travel Passport', path: '/passport' }, { icon: '❤️', label: 'Saved Trips', path: '/saved' }, { icon: '📦', label: 'Packing List', path: '/packing' }, { icon: '💰', label: 'Budget Tracker', path: '/budget' }, { icon: '💬', label: 'AI Chat', path: '/chat' }, { icon: '🧠', label: 'Travel IQ', path: '/traveliq' }, { icon: '⚙️', label: 'Settings', path: '/settings' }] },
]

const HOTEL_CATEGORIES = [
  { id: 'business', name: 'Business Hotels', emoji: '🏢' },
  { id: 'beach', name: 'Beach Resorts', emoji: '🌊' },
  { id: 'hill', name: 'Hill Stations', emoji: '🏔️' },
  { id: 'heritage', name: 'Heritage', emoji: '🏛️' },
  { id: 'wellness', name: 'Wellness', emoji: '🧘' },
  { id: 'casino', name: 'Casino', emoji: '🎰' },
  { id: 'eco', name: 'Eco Lodge', emoji: '🌿' },
  { id: 'citycenter', name: 'City Center', emoji: '🏙️' },
]

const HOTEL_LOYALTY_PROGRAMS = [
  { name: 'Marriott Bonvoy', brand: 'Marriott', pointsValue: '₹0.35', perks: 'Free nights, Room upgrades, Late checkout', url: 'https://www.marriott.com/loyalty.mi', icon: '🏨' },
  { name: 'Hilton Honors', brand: 'Hilton', pointsValue: '₹0.30', perks: 'Free WiFi, Late checkout, Points pooling', url: 'https://www.hilton.com/en/loyalty/', icon: '🏰' },
  { name: 'IHG One Rewards', brand: 'IHG', pointsValue: '₹0.25', perks: 'Free breakfast, Room upgrades, Milestone bonuses', url: 'https://www.ihg.com/content/us/en/rewards', icon: '🌟' },
  { name: 'Hyatt World', brand: 'Hyatt', pointsValue: '₹0.40', perks: 'Free nights, Club access, Expedited check-in', url: 'https://www.hyatt.com/en-US/rewards', icon: '🌴' },
  { name: 'Taj InnerCircle', brand: 'Taj Hotels', pointsValue: '₹0.45', perks: 'Free stays, Dining credits, Early check-in', url: 'https://www.tajhotels.com/en-in/taj-innercircle/', icon: '🕌' },
  { name: 'Oberoi One', brand: 'Oberoi', pointsValue: '₹0.50', perks: 'Luxury upgrades, Spa credits, Concierge', url: 'https://www.oberoihotels.com/loyalty/', icon: '💎' },
]

const CITIES_HOTELS = [
  { id: 'mumbai', name: 'Mumbai', emoji: '🇮🇳', hotels: 1250, avgPrice: '₹4,500', rating: 4.6, color: '#ff9800', categories: ['business', 'citycenter'], bestFor: 'Business', neighborhoods: [{ name: 'Bandra', vibe: '🏢', price: '₹6,000', distance: '15km', safety: 4.5 }, { name: 'Colaba', vibe: '🏛️', price: '₹4,500', distance: '2km', safety: 4.8 }, { name: 'Juhu', vibe: '🌊', price: '₹5,500', distance: '18km', safety: 4.7 }, { name: 'Powai', vibe: '🏢', price: '₹4,000', distance: '20km', safety: 4.6 }], tips: 'Best time: Oct-Mar. Avoid monsoon (Jun-Sep).', weather: 'Oct–Mar 🌤️' },
  { id: 'delhi', name: 'Delhi', emoji: '🇮🇳', hotels: 1180, avgPrice: '₹3,800', rating: 4.5, color: '#e53935', categories: ['business', 'citycenter', 'heritage'], bestFor: 'Business', neighborhoods: [{ name: 'Connaught Place', vibe: '🏢', price: '₹4,500', distance: '0km', safety: 4.4 }, { name: 'Karol Bagh', vibe: '🛍️', price: '₹2,800', distance: '3km', safety: 4.2 }, { name: 'Saket', vibe: '🏙️', price: '₹4,200', distance: '8km', safety: 4.6 }, { name: 'Aerocity', vibe: '🏢', price: '₹5,000', distance: '15km', safety: 4.8 }], tips: 'Winter (Dec-Feb) is best. Summer can be extremely hot.', weather: 'Oct–Feb ❄️' },
  { id: 'bangalore', name: 'Bangalore', emoji: '🇮🇳', hotels: 890, avgPrice: '₹3,200', rating: 4.7, color: '#7b1fa2', categories: ['business', 'citycenter', 'wellness'], bestFor: 'Business', neighborhoods: [{ name: 'MG Road', vibe: '🏢', price: '₹4,000', distance: '0km', safety: 4.7 }, { name: 'Koramangala', vibe: '🏙️', price: '₹3,500', distance: '5km', safety: 4.8 }, { name: 'Indiranagar', vibe: '🛍️', price: '₹3,200', distance: '6km', safety: 4.6 }, { name: 'Whitefield', vibe: '🏢', price: '₹3,800', distance: '18km', safety: 4.5 }], tips: 'Pleasant climate year-round. Avoid monsoons for day trips.', weather: 'Oct–Mar 🌤️' },
  { id: 'goa', name: 'Goa', emoji: '🇮🇳', hotels: 1560, avgPrice: '₹5,500', rating: 4.8, color: '#00bcd4', categories: ['beach', 'wellness', 'heritage'], bestFor: 'Honeymoon', neighborhoods: [{ name: 'Benaulim', vibe: '🌊', price: '₹4,500', distance: '8km', safety: 4.9 }, { name: 'Anjuna', vibe: '🎭', price: '₹5,000', distance: '15km', safety: 4.5 }, { name: 'Candolim', vibe: '🏖️', price: '₹6,000', distance: '12km', safety: 4.7 }, { name: 'Dudhsagar', vibe: '🌿', price: '₹3,500', distance: '25km', safety: 4.6 }], tips: 'Oct-May is peak. Monsoon (Jun-Sep) has heavy discounts.', weather: 'Oct–May ☀️' },
  { id: 'dubai', name: 'Dubai', emoji: '🇦🇪', hotels: 2100, avgPrice: 'AED 650', rating: 4.9, color: '#4caf50', categories: ['business', 'luxury', 'casino'], bestFor: 'Luxury', neighborhoods: [{ name: 'Downtown', vibe: '🏙️', price: 'AED 800', distance: '0km', safety: 5.0 }, { name: 'Marina', vibe: '🌊', price: 'AED 700', distance: '5km', safety: 4.9 }, { name: 'Palm Jumeirah', vibe: '🏖️', price: 'AED 900', distance: '10km', safety: 5.0 }, { name: 'Deira', vibe: '🛍️', price: 'AED 400', distance: '8km', safety: 4.7 }], tips: 'Winter (Nov-Mar) is best. Summer extremely hot.', weather: 'Nov–Mar 🌤️' },
  { id: 'paris', name: 'Paris', emoji: '🇫🇷', hotels: 3200, avgPrice: '€280', rating: 4.8, color: '#3f51b5', categories: ['heritage', 'citycenter', 'romantic'], bestFor: 'Romantic', neighborhoods: [{ name: 'Marais', vibe: '🎭', price: '€300', distance: '0km', safety: 4.6 }, { name: 'Saint-Germain', vibe: '🏛️', price: '€320', distance: '2km', safety: 4.8 }, { name: 'Champs-Élysées', vibe: '🛍️', price: '€350', distance: '3km', safety: 4.7 }, { name: 'Montmartre', vibe: '🎨', price: '€220', distance: '4km', safety: 4.5 }], tips: 'Book early for Fashion Week. Avoid Aug when many close.', weather: 'Apr–Oct 🌸' },
  { id: 'london', name: 'London', emoji: '🇬🇧', hotels: 2800, avgPrice: '£220', rating: 4.7, color: '#009688', categories: ['business', 'heritage', 'citycenter'], bestFor: 'Business', neighborhoods: [{ name: 'Covent Garden', vibe: '🎭', price: '£280', distance: '0km', safety: 4.7 }, { name: 'Westminster', vibe: '🏛️', price: '£300', distance: '1km', safety: 4.8 }, { name: 'Shoreditch', vibe: '🎨', price: '£180', distance: '4km', safety: 4.4 }, { name: 'Kensington', vibe: '🏰', price: '£250', distance: '5km', safety: 4.8 }], tips: 'Book for royal events months ahead. Dec has magical Christmas.', weather: 'May–Sep ☀️' },
  { id: 'new_york', name: 'New York', emoji: '🇺🇸', hotels: 3500, avgPrice: '$380', rating: 4.8, color: '#f44336', categories: ['business', 'citycenter', 'culture'], bestFor: 'Business', neighborhoods: [{ name: 'Manhattan', vibe: '🏢', price: '$450', distance: '0km', safety: 4.5 }, { name: 'Brooklyn', vibe: '🎨', price: '$280', distance: '5km', safety: 4.4 }, { name: 'Times Square', vibe: '🎭', price: '$400', distance: '0km', safety: 4.3 }, { name: 'Upper East', vibe: '🏰', price: '$320', distance: '3km', safety: 4.7 }], tips: 'Book Thanksgiving/Christmas months ahead. City never sleeps!', weather: 'Apr–Oct 🌤️' },
  { id: 'tokyo', name: 'Tokyo', emoji: '🇯🇵', hotels: 1900, avgPrice: '¥18,000', rating: 4.9, color: '#e91e63', categories: ['business', 'culture', 'food'], bestFor: 'Culture', neighborhoods: [{ name: 'Shibuya', vibe: '🏙️', price: '¥20,000', distance: '0km', safety: 5.0 }, { name: 'Shinjuku', vibe: '🎭', price: '¥16,000', distance: '2km', safety: 4.8 }, { name: 'Ginza', vibe: '🛍️', price: '¥25,000', distance: '1km', safety: 5.0 }, { name: 'Asakusa', vibe: '🏛️', price: '¥12,000', distance: '5km', safety: 4.9 }], tips: 'Cherry blossom (Mar-Apr) is magical. Book Olympics years early.', weather: 'Mar–May 🌸' },
  { id: 'singapore', name: 'Singapore', emoji: '🇸🇬', hotels: 980, avgPrice: 'SGD 280', rating: 4.8, color: '#ff5722', categories: ['business', 'citycenter', 'family'], bestFor: 'Family', neighborhoods: [{ name: 'Marina Bay', vibe: '🏙️', price: 'SGD 350', distance: '0km', safety: 5.0 }, { name: 'Orchard', vibe: '🛍️', price: 'SGD 300', distance: '2km', safety: 5.0 }, { name: 'Clarke Quay', vibe: '🎭', price: 'SGD 280', distance: '1km', safety: 4.9 }, { name: 'Sentosa', vibe: '🏖️', price: 'SGD 250', distance: '5km', safety: 5.0 }], tips: 'Year-round destination. Chinese New Year books fast.', weather: 'Year-round 🌴' },
  { id: 'bali', name: 'Bali', emoji: '🇮🇩', hotels: 2100, avgPrice: 'IDR 1.2M', rating: 4.7, color: '#0097a7', categories: ['beach', 'wellness', 'heritage'], bestFor: 'Honeymoon', neighborhoods: [{ name: 'Seminyak', vibe: '🏖️', price: 'IDR 1.5M', distance: '5km', safety: 4.8 }, { name: 'Ubud', vibe: '🧘', price: 'IDR 800K', distance: '20km', safety: 4.9 }, { name: 'Kuta', vibe: '🎭', price: 'IDR 900K', distance: '0km', safety: 4.6 }, { name: 'Nusa Dua', vibe: '🌊', price: 'IDR 1.8M', distance: '15km', safety: 4.9 }], tips: 'Dry season (Apr-Oct) best. Balinese New Year (Nyepi) is silent.', weather: 'Apr–Oct ☀️' },
  { id: 'bangkok', name: 'Bangkok', emoji: '🇹🇭', hotels: 1650, avgPrice: 'THB 3,500', rating: 4.6, color: '#ffc107', categories: ['business', 'food', 'culture'], bestFor: 'Budget', neighborhoods: [{ name: 'Sukhumvit', vibe: '🏢', price: 'THB 4,000', distance: '0km', safety: 4.7 }, { name: 'Old City', vibe: '🏛️', price: 'THB 2,500', distance: '3km', safety: 4.5 }, { name: 'Silom', vibe: '🏙️', price: 'THB 3,800', distance: '2km', safety: 4.6 }, { name: 'Khao San', vibe: '🎭', price: 'THB 1,800', distance: '4km', safety: 4.3 }], tips: 'Cool season (Nov-Feb) best. Avoid Songkran if you fear crowds.', weather: 'Nov–Feb 🌤️' },
  { id: 'kolkata', name: 'Kolkata', emoji: '🇮🇳', hotels: 650, avgPrice: '₹3,000', rating: 4.4, color: '#9c27b0', categories: ['heritage', 'culture', 'food'], bestFor: 'Culture', neighborhoods: [{ name: 'Park Street', vibe: '🏛️', price: '₹3,500', distance: '0km', safety: 4.5 }, { name: 'Bhowanipore', vibe: '🏙️', price: '₹2,800', distance: '3km', safety: 4.6 }, { name: 'Salt Lake', vibe: '🏢', price: '₹2,500', distance: '5km', safety: 4.7 }, { name: 'South', vibe: '🛍️', price: '₹3,200', distance: '4km', safety: 4.5 }], tips: 'Winter (Nov-Feb) best. Durga Puja season is magical.', weather: 'Oct–Mar 🌤️' },
  { id: 'chennai', name: 'Chennai', emoji: '🇮🇳', hotels: 720, avgPrice: '₹3,200', rating: 4.5, color: '#673ab7', categories: ['business', 'beach', 'heritage'], bestFor: 'Business', neighborhoods: [{ name: 'Anna Nagar', vibe: '🏙️', price: '₹3,500', distance: '0km', safety: 4.6 }, { name: 'T Nagar', vibe: '🛍️', price: '₹2,800', distance: '2km', safety: 4.5 }, { name: 'Mylapore', vibe: '🏛️', price: '₹3,000', distance: '4km', safety: 4.7 }, { name: 'ECR Beach', vibe: '🌊', price: '₹4,000', distance: '10km', safety: 4.6 }], tips: 'Winter (Nov-Feb) best. Avoid monsoons (Oct-Dec).', weather: 'Nov–Feb 🌤️' },
  { id: 'hyderabad', name: 'Hyderabad', emoji: '🇮🇳', hotels: 580, avgPrice: '₹3,500', rating: 4.6, color: '#03a9f4', categories: ['heritage', 'food', 'business'], bestFor: 'Heritage', neighborhoods: [{ name: 'Banjara Hills', vibe: '🏙️', price: '₹4,200', distance: '0km', safety: 4.7 }, { name: 'Charminar', vibe: '🏛️', price: '₹2,500', distance: '3km', safety: 4.4 }, { name: 'Gachibowli', vibe: '🏢', price: '₹3,800', distance: '8km', safety: 4.8 }, { name: 'Jubilee Hills', vibe: '🛍️', price: '₹4,500', distance: '5km', safety: 4.8 }], tips: 'Winter (Oct-Feb) best. Ramadan has special food experiences.', weather: 'Oct–Feb 🌤️' },
  { id: 'jaipur', name: 'Jaipur', emoji: '🇮🇳', hotels: 480, avgPrice: '₹2,800', rating: 4.7, color: '#ff5722', categories: ['heritage', 'culture', 'family'], bestFor: 'Heritage', neighborhoods: [{ name: 'Pink City', vibe: '🏛️', price: '₹3,200', distance: '0km', safety: 4.5 }, { name: 'MI Road', vibe: '🛍️', price: '₹2,500', distance: '1km', safety: 4.6 }, { name: 'C Scheme', vibe: '🏙️', price: '₹2,800', distance: '2km', safety: 4.7 }, { name: 'Amer', vibe: '🏰', price: '₹2,000', distance: '12km', safety: 4.8 }], tips: 'Oct-Mar best. Avoid summer (Apr-Jun) due to extreme heat.', weather: 'Oct–Mar 🌤️' },
  { id: 'kochi', name: 'Kochi', emoji: '🇮🇳', hotels: 350, avgPrice: '₹3,200', rating: 4.6, color: '#4caf50', categories: ['heritage', 'beach', 'food'], bestFor: 'Heritage', neighborhoods: [{ name: 'Fort Kochi', vibe: '🏛️', price: '₹3,500', distance: '0km', safety: 4.7 }, { name: 'Marine Drive', vibe: '🌊', price: '₹3,800', distance: '2km', safety: 4.8 }, { name: 'Willingdon Island', vibe: '🏢', price: '₹4,000', distance: '5km', safety: 4.9 }, { name: 'Mattancherry', vibe: '🎭', price: '₹2,200', distance: '4km', safety: 4.5 }], tips: 'Oct-Mar best. Monsoon (Jun-Sep) has Ayurveda discounts.', weather: 'Oct–Mar 🌤️' },
  { id: 'udaipur', name: 'Udaipur', emoji: '🇮🇳', hotels: 290, avgPrice: '₹4,000', rating: 4.8, color: '#00bcd4', categories: ['heritage', 'honeymoon', 'lake'], bestFor: 'Honeymoon', neighborhoods: [{ name: 'Lake Pichola', vibe: '💑', price: '₹6,000', distance: '0km', safety: 4.9 }, { name: 'City Palace', vibe: '🏛️', price: '₹4,500', distance: '1km', safety: 4.8 }, { name: 'Fateh Sagar', vibe: '🌿', price: '₹3,500', distance: '2km', safety: 4.7 }, { name: 'Udaipur Downtown', vibe: '🏙️', price: '₹2,800', distance: '3km', safety: 4.6 }], tips: 'Oct-Mar best. Monsoon has lake views. Summer very hot.', weather: 'Oct–Mar 🌤️' },
  { id: 'agra', name: 'Agra', emoji: '🇮🇳', hotels: 220, avgPrice: '₹2,200', rating: 4.5, color: '#ff9800', categories: ['heritage', 'family'], bestFor: 'Heritage', neighborhoods: [{ name: 'Taj Mahal Area', vibe: '🏛️', price: '₹2,800', distance: '0km', safety: 4.6 }, { name: 'Sikandra', vibe: '🏰', price: '₹1,800', distance: '4km', safety: 4.5 }, { name: 'Kinari Bazar', vibe: '🛍️', price: '₹1,500', distance: '2km', safety: 4.3 }, { name: 'Fatabad', vibe: '🏙️', price: '₹2,000', distance: '3km', safety: 4.4 }], tips: 'Oct-Mar best. Avoid Friday for Taj (closed). Winter foggy.', weather: 'Oct–Mar 🌤️' },
  { id: 'varanasi', name: 'Varanasi', emoji: '🇮🇳', hotels: 180, avgPrice: '₹1,800', rating: 4.4, color: '#795548', categories: ['heritage', 'spiritual', 'culture'], bestFor: 'Spiritual', neighborhoods: [{ name: 'Ghats', vibe: '�️', price: '₹2,200', distance: '0km', safety: 4.3 }, { name: 'Assi Ghat', vibe: '🧘', price: '₹2,000', distance: '2km', safety: 4.4 }, { name: 'Lanka', vibe: '🏙️', price: '₹1,500', distance: '4km', safety: 4.5 }, { name: 'Cantonment', vibe: '🏢', price: '₹1,800', distance: '3km', safety: 4.6 }], tips: 'Oct-Mar best. Avoid monsoon. Ganga Aarti is magical.', weather: 'Oct–Mar 🌤️' },
  { id: 'amritsar', name: 'Amritsar', emoji: '🇮🇳', hotels: 160, avgPrice: '₹2,500', rating: 4.6, color: '#f44336', categories: ['heritage', 'spiritual', 'food'], bestFor: 'Spiritual', neighborhoods: [{ name: 'Golden Temple', vibe: '�️', price: '₹3,000', distance: '0km', safety: 4.8 }, { name: 'Mall Road', vibe: '🛍️', price: '₹2,200', distance: '1km', safety: 4.7 }, { name: 'Lawrence Road', vibe: '🏙️', price: '₹2,000', distance: '2km', safety: 4.6 }, { name: 'Ranjit Avenue', vibe: '🏢', price: '₹2,500', distance: '3km', safety: 4.7 }], tips: 'Oct-Mar best. Winter can be very cold. Wagah border ceremony!', weather: 'Oct–Mar ❄️' },
  { id: 'sydney', name: 'Sydney', emoji: '🇦🇺', hotels: 1200, avgPrice: 'AUD 280', rating: 4.7, color: '#2196f3', categories: ['beach', 'citycenter', 'business'], bestFor: 'Beach', neighborhoods: [{ name: 'CBD', vibe: '🏢', price: 'AUD 320', distance: '0km', safety: 4.9 }, { name: 'Bondi', vibe: '🏖️', price: 'AUD 280', distance: '8km', safety: 4.8 }, { name: 'Darling Harbour', vibe: '🎭', price: 'AUD 300', distance: '2km', safety: 4.8 }, { name: 'The Rocks', vibe: '🏛️', price: 'AUD 340', distance: '1km', safety: 4.7 }], tips: 'Dec-Feb is summer/peak. Australian Open (Jan) books fast.', weather: 'Dec–Feb ☀️' },
  { id: 'rome', name: 'Rome', emoji: '🇮🇹', hotels: 1800, avgPrice: '€220', rating: 4.8, color: '#e91e63', categories: ['heritage', 'romantic', 'food'], bestFor: 'Romantic', neighborhoods: [{ name: 'Centro Storico', vibe: '🏛️', price: '€280', distance: '0km', safety: 4.7 }, { name: 'Trastevere', vibe: '🎭', price: '€180', distance: '2km', safety: 4.6 }, { name: 'Vatican', vibe: '🕰️', price: '€200', distance: '3km', safety: 4.8 }, { name: 'Termini', vibe: '🏢', price: '€150', distance: '1km', safety: 4.4 }], tips: 'Apr-Jun, Sep-Oct best. Avoid Aug (heat + closures).', weather: 'Apr–Jun, Sep–Oct 🌸' },
  { id: 'barcelona', name: 'Barcelona', emoji: '🇪🇸', hotels: 1400, avgPrice: '€180', rating: 4.7, color: '#9c27b0', categories: ['beach', 'culture', 'nightlife'], bestFor: 'Culture', neighborhoods: [{ name: 'Las Ramblas', vibe: '🎭', price: '€220', distance: '0km', safety: 4.5 }, { name: 'Gothic Quarter', vibe: '🏛️', price: '€200', distance: '1km', safety: 4.6 }, { name: 'Gràcia', vibe: '🎨', price: '€140', distance: '3km', safety: 4.7 }, { name: 'Barceloneta', vibe: '🏖️', price: '€160', distance: '2km', safety: 4.5 }], tips: 'May-Jun, Sep-Oct best. Avoid La Mercè (Sep) if busy.', weather: 'May–Jun, Sep–Oct ☀️' },
  { id: 'istanbul', name: 'Istanbul', emoji: '🇹🇷', hotels: 1100, avgPrice: 'TRY 2,500', rating: 4.6, color: '#f44336', categories: ['heritage', 'business', 'culture'], bestFor: 'Heritage', neighborhoods: [{ name: 'Sultanahmet', vibe: '🏛️', price: 'TRY 3,000', distance: '0km', safety: 4.7 }, { name: 'Taksim', vibe: '🎭', price: 'TRY 2,800', distance: '3km', safety: 4.5 }, { name: 'Bosphorus', vibe: '🌊', price: 'TRY 3,500', distance: '2km', safety: 4.8 }, { name: 'Grand Bazaar', vibe: '🛍️', price: 'TRY 2,000', distance: '1km', safety: 4.4 }], tips: 'Apr-May, Sep-Nov best. Ramadan has special atmosphere.', weather: 'Apr–May, Sep–Nov 🌤️' },
  { id: 'seoul', name: 'Seoul', emoji: '🇰🇷', hotels: 1300, avgPrice: 'KRW 180K', rating: 4.8, color: '#3f51b5', categories: ['business', 'culture', 'food'], bestFor: 'Culture', neighborhoods: [{ name: 'Myeongdong', vibe: '🛍️', price: 'KRW 220K', distance: '0km', safety: 4.9 }, { name: 'Gangnam', vibe: '🏢', price: 'KRW 200K', distance: '5km', safety: 4.9 }, { name: 'Insadong', vibe: '🎨', price: 'KRW 160K', distance: '3km', safety: 4.8 }, { name: 'Hongdae', vibe: '🎭', price: 'KRW 140K', distance: '4km', safety: 4.7 }], tips: 'Mar-May, Sep-Nov best. Cherry blossom (Mar-Apr) is peak.', weather: 'Mar–May, Sep–Nov 🌸' },
  { id: 'kuala_lumpur', name: 'Kuala Lumpur', emoji: '🇲🇾', hotels: 780, avgPrice: 'MYR 280', rating: 4.6, color: '#009688', categories: ['business', 'citycenter', 'food'], bestFor: 'Business', neighborhoods: [{ name: 'Bukit Bintang', vibe: '🛍️', price: 'MYR 320', distance: '0km', safety: 4.7 }, { name: 'KLCC', vibe: '🏙️', price: 'MYR 350', distance: '1km', safety: 4.8 }, { name: 'Chinatown', vibe: '🏯', price: 'MYR 180', distance: '2km', safety: 4.5 }, { name: 'Little India', vibe: '🎭', price: 'MYR 200', distance: '3km', safety: 4.6 }], tips: 'Year-round. Avoid monsoon (Nov-Dec).', weather: 'Year-round 🌴' },
  { id: 'hong_kong', name: 'Hong Kong', emoji: '🇭🇰', hotels: 920, avgPrice: 'HKD 1,800', rating: 4.7, color: '#ff5722', categories: ['business', 'food', 'shopping'], bestFor: 'Business', neighborhoods: [{ name: 'Central', vibe: '🏢', price: 'HKD 2,200', distance: '0km', safety: 5.0 }, { name: 'Tsim Sha Tsui', vibe: '🛍️', price: 'HKD 1,800', distance: '2km', safety: 4.9 }, { name: 'Mong Kok', vibe: '🎭', price: 'HKD 1,200', distance: '4km', safety: 4.6 }, { name: 'Victoria Peak', vibe: '🏰', price: 'HKD 2,500', distance: '3km', safety: 5.0 }], tips: 'Oct-Dec best. Avoid Chinese New Year (Jan/Feb) if busy.', weather: 'Oct–Dec 🌤️' },
  { id: 'shanghai', name: 'Shanghai', emoji: '🇨🇳', hotels: 1050, avgPrice: 'CNY 880', rating: 4.6, color: '#e91e63', categories: ['business', 'citycenter', 'culture'], bestFor: 'Business', neighborhoods: [{ name: 'The Bund', vibe: '🏙️', price: 'CNY 1,100', distance: '0km', safety: 4.9 }, { name: 'Pudong', vibe: '🏢', price: 'CNY 900', distance: '5km', safety: 5.0 }, { name: 'French Concession', vibe: '🎨', price: 'CNY 750', distance: '4km', safety: 4.8 }, { name: 'Xintiandi', vibe: '🎭', price: 'CNY 850', distance: '3km', safety: 4.8 }], tips: 'Apr-May, Sep-Oct best. Expo years book fast.', weather: 'Apr–May, Sep–Oct 🌸' },
  { id: 'osaka', name: 'Osaka', emoji: '🇯🇵', hotels: 850, avgPrice: '¥15,000', rating: 4.8, color: '#9c27b0', categories: ['food', 'culture', 'family'], bestFor: 'Food', neighborhoods: [{ name: 'Namba', vibe: '🎭', price: '¥18,000', distance: '0km', safety: 4.8 }, { name: 'Umeda', vibe: '🏢', price: '¥16,000', distance: '2km', safety: 4.9 }, { name: 'Dotonbori', vibe: '🍜', price: '¥14,000', distance: '1km', safety: 4.7 }, { name: 'Tennoji', vibe: '🏛️', price: '¥10,000', distance: '4km', safety: 4.6 }], tips: 'Mar-May, Sep-Nov best. Cherry blossom is magical.', weather: 'Mar–May, Sep–Nov 🌸' },
  { id: 'las_vegas', name: 'Las Vegas', emoji: '🇺🇸', hotels: 890, avgPrice: '$180', rating: 4.5, color: '#673ab7', categories: ['casino', 'nightlife', 'entertainment'], bestFor: 'Casino', neighborhoods: [{ name: 'Strip', vibe: '🎰', price: '$220', distance: '0km', safety: 4.4 }, { name: 'Downtown', vibe: '🎭', price: '$120', distance: '3km', safety: 4.2 }, { name: 'The Venetian', vibe: '🏰', price: '$280', distance: '1km', safety: 4.6 }, { name: 'MGM Grand', vibe: '🎰', price: '$200', distance: '1km', safety: 4.5 }], tips: 'Weekdays cheaper. Avoid conventions (check calendar).', weather: 'Year-round ☀️' },
  { id: 'miami', name: 'Miami', emoji: '🇺🇸', hotels: 1100, avgPrice: '$320', rating: 4.7, color: '#00bcd4', categories: ['beach', 'nightlife', 'art'], bestFor: 'Beach', neighborhoods: [{ name: 'South Beach', vibe: '🏖️', price: '$400', distance: '0km', safety: 4.4 }, { name: 'Brickell', vibe: '🏢', price: '$280', distance: '3km', safety: 4.6 }, { name: 'Wynwood', vibe: '🎨', price: '$220', distance: '4km', safety: 4.3 }, { name: 'Coral Gables', vibe: '🏰', price: '$300', distance: '6km', safety: 4.7 }], tips: 'Dec-Apr is peak/season. Avoid hurricane season (Jun-Nov).', weather: 'Dec–Apr ☀️' },
  { id: 'san_francisco', name: 'San Francisco', emoji: '🇺🇸', hotels: 980, avgPrice: '$350', rating: 4.6, color: '#ff5722', categories: ['business', 'culture', 'tech'], bestFor: 'Business', neighborhoods: [{ name: 'Union Square', vibe: '🛍️', price: '$400', distance: '0km', safety: 4.5 }, { name: 'SOMA', vibe: '🏢', price: '$320', distance: '1km', safety: 4.4 }, { name: 'Fisherman\'s Wharf', vibe: '🎭', price: '$300', distance: '2km', safety: 4.6 }, { name: 'Mission District', vibe: '🎨', price: '$250', distance: '3km', safety: 4.3 }], tips: 'Sep-Nov best. Avoid foggy summer if you want sun.', weather: 'Sep–Nov ☀️' },
  { id: 'chicago', name: 'Chicago', emoji: '🇺🇸', hotels: 850, avgPrice: '$280', rating: 4.5, color: '#2196f3', categories: ['business', 'architecture', 'food'], bestFor: 'Architecture', neighborhoods: [{ name: 'Magnificent Mile', vibe: '🛍️', price: '$350', distance: '0km', safety: 4.6 }, { name: 'Loop', vibe: '🏢', price: '$280', distance: '1km', safety: 4.5 }, { name: 'Wicker Park', vibe: '🎨', price: '$200', distance: '4km', safety: 4.4 }, { name: 'Lincoln Park', vibe: '🌳', price: '$240', distance: '5km', safety: 4.7 }], tips: 'Jun-Sep best. Winter (Dec-Feb) has great hotel deals.', weather: 'Jun–Sep ☀️' },
  { id: 'toronto', name: 'Toronto', emoji: '🇨🇦', hotels: 720, avgPrice: 'CAD 280', rating: 4.7, color: '#f44336', categories: ['business', 'cultural', 'food'], bestFor: 'Business', neighborhoods: [{ name: 'Downtown', vibe: '🏢', price: 'CAD 320', distance: '0km', safety: 4.8 }, { name: 'Yorkville', vibe: '🛍️', price: 'CAD 350', distance: '2km', safety: 4.9 }, { name: 'Distillery District', vibe: '🎨', price: 'CAD 280', distance: '1km', safety: 4.8 }, { name: 'Queen West', vibe: '🎭', price: 'CAD 220', distance: '3km', safety: 4.6 }], tips: 'May-Oct best. Winter has indoor attractions.', weather: 'May–Oct ☀️' },
  { id: 'vancouver', name: 'Vancouver', emoji: '🇨🇦', hotels: 580, avgPrice: 'CAD 250', rating: 4.8, color: '#4caf50', categories: ['nature', 'outdoors', 'food'], bestFor: 'Nature', neighborhoods: [{ name: 'Downtown', vibe: '🏙️', price: 'CAD 300', distance: '0km', safety: 4.9 }, { name: 'Gastown', vibe: '🎭', price: 'CAD 250', distance: '1km', safety: 4.7 }, { name: 'Granville Island', vibe: '🎨', price: 'CAD 220', distance: '3km', safety: 4.8 }, { name: 'Kitsilano', vibe: '🏖️', price: 'CAD 200', distance: '5km', safety: 4.8 }], tips: 'May-Sep best. Ski season (Dec-Mar) for mountains.', weather: 'May–Sep ☀️' },
  { id: 'lisbon', name: 'Lisbon', emoji: '🇵🇹', hotels: 650, avgPrice: '€150', rating: 4.7, color: '#ff9800', categories: ['heritage', 'nightlife', 'food'], bestFor: 'Heritage', neighborhoods: [{ name: 'Baixa', vibe: '🏛️', price: '€180', distance: '0km', safety: 4.6 }, { name: 'Alfama', vibe: '🎭', price: '€140', distance: '1km', safety: 4.5 }, { name: 'Bairro Alto', vibe: '🎸', price: '€160', distance: '2km', safety: 4.4 }, { name: 'Belem', vibe: '🏰', price: '€120', distance: '4km', safety: 4.7 }], tips: 'Apr-Oct best. Avoid winter rain. Great fado music!', weather: 'Apr–Oct ☀️' },
  { id: 'amsterdam', name: 'Amsterdam', emoji: '🇳🇱', hotels: 780, avgPrice: '€220', rating: 4.6, color: '#ff5722', categories: ['culture', 'cycling', 'nightlife'], bestFor: 'Culture', neighborhoods: [{ name: 'Dam Square', vibe: '🏛️', price: '€280', distance: '0km', safety: 4.7 }, { name: 'Jordaan', vibe: '🎨', price: '€200', distance: '1km', safety: 4.6 }, { name: 'Vondelpark', vibe: '🌳', price: '€190', distance: '2km', safety: 4.8 }, { name: 'De Pijp', vibe: '🎭', price: '€150', distance: '3km', safety: 4.5 }], tips: 'Apr-Oct best. Tulip season (Mar-May) is magical.', weather: 'Apr–Oct ☀️' },
  { id: 'vienna', name: 'Vienna', emoji: '🇦🇹', hotels: 520, avgPrice: '€180', rating: 4.8, color: '#9c27b0', categories: ['heritage', 'music', 'business'], bestFor: 'Heritage', neighborhoods: [{ name: 'Innere Stadt', vibe: '🏛️', price: '€220', distance: '0km', safety: 4.9 }, { name: 'Leopoldstadt', vibe: '🎭', price: '€180', distance: '1km', safety: 4.8 }, { name: 'Schönbrunn', vibe: '🏰', price: '€150', distance: '3km', safety: 4.8 }, { name: 'Naschmarkt', vibe: '🍜', price: '€160', distance: '2km', safety: 4.7 }], tips: 'Apr-Jun, Sep-Oct best. Christmas markets (Dec) are magical!', weather: 'Apr–Jun, Sep–Oct 🌸' },
  { id: 'prague', name: 'Prague', emoji: '🇨🇿', hotels: 480, avgPrice: '€120', rating: 4.7, color: '#e91e63', categories: ['heritage', 'romantic', 'beer'], bestFor: 'Heritage', neighborhoods: [{ name: 'Old Town', vibe: '🏛️', price: '€150', distance: '0km', safety: 4.8 }, { name: 'Lesser Town', vibe: '🏰', price: '€130', distance: '1km', safety: 4.9 }, { name: 'Vinohrady', vibe: '🎨', price: '€100', distance: '2km', safety: 4.7 }, { name: 'Žižkov', vibe: '🎭', price: '€80', distance: '3km', safety: 4.5 }], tips: 'Apr-Jun, Sep-Oct best. Avoid crowds in Old Town.', weather: 'Apr–Jun, Sep–Oct 🌸' },
  { id: 'budapest', name: 'Budapest', emoji: '🇭🇺', hotels: 420, avgPrice: '€100', rating: 4.6, color: '#673ab7', categories: ['spa', 'heritage', 'nightlife'], bestFor: 'Spa', neighborhoods: [{ name: 'Castle District', vibe: '🏛️', price: '€120', distance: '0km', safety: 4.7 }, { name: 'Party District', vibe: '🎉', price: '€80', distance: '2km', safety: 4.4 }, { name: 'Parliament', vibe: '🏰', price: '€140', distance: '1km', safety: 4.8 }, { name: 'Ruin Bars', vibe: '🎭', price: '€70', distance: '3km', safety: 4.5 }], tips: 'Apr-Jun, Sep-Nov best. Thermal baths year-round!', weather: 'Apr–Jun, Sep–Nov 🌸' },
  { id: 'marrakech', name: 'Marrakech', emoji: '🇲🇦', hotels: 380, avgPrice: 'MAD 1,200', rating: 4.5, color: '#009688', categories: ['heritage', 'souks', 'riad'], bestFor: 'Culture', neighborhoods: [{ name: 'Medina', vibe: '🕌', price: 'MAD 1,000', distance: '0km', safety: 4.4 }, { name: 'Gueliz', vibe: '🏙️', price: 'MAD 1,500', distance: '3km', safety: 4.7 }, { name: 'Palmeraie', vibe: '🌴', price: 'MAD 2,000', distance: '8km', safety: 4.6 }, { name: 'Marrakech Mall', vibe: '🛍️', price: 'MAD 1,300', distance: '5km', safety: 4.8 }], tips: 'Mar-May, Sep-Nov best. Ramadan has special atmosphere.', weather: 'Mar–May, Sep–Nov ☀️' },
  { id: 'cape_town', name: 'Cape Town', emoji: '🇿🇦', hotels: 350, avgPrice: 'ZAR 2,800', rating: 4.8, color: '#4caf50', categories: ['nature', 'beach', 'wine'], bestFor: 'Nature', neighborhoods: [{ name: 'Waterfront', vibe: '🛍️', price: 'ZAR 3,500', distance: '0km', safety: 4.8 }, { name: 'Camps Bay', vibe: '🏖️', price: 'ZAR 3,200', distance: '5km', safety: 4.7 }, { name: 'Table Mountain', vibe: '🏔️', price: 'ZAR 2,500', distance: '3km', safety: 4.8 }, { name: 'Stellenbosch', vibe: '🍷', price: 'ZAR 2,000', distance: '40km', safety: 4.9 }], tips: 'Nov-Mar is summer/peak. Whale watching (Jun-Nov).', weather: 'Nov–Mar ☀️' },
  { id: 'kyoto', name: 'Kyoto', emoji: '🇯🇵', hotels: 620, avgPrice: '¥22,000', rating: 4.9, color: '#f44336', categories: ['heritage', 'temple', 'tradition'], bestFor: 'Heritage', neighborhoods: [{ name: 'Gion', vibe: '🎭', price: '¥28,000', distance: '0km', safety: 4.9 }, { name: 'Higashiyama', vibe: '🏛️', price: '¥20,000', distance: '1km', safety: 4.9 }, { name: 'Arashiyama', vibe: '🎋', price: '¥18,000', distance: '5km', safety: 4.8 }, { name: 'Kawaramachi', vibe: '🛍️', price: '¥16,000', distance: '2km', safety: 4.8 }], tips: 'Mar-May, Oct-Nov best. Cherry blossom is magical.', weather: 'Mar–May, Oct–Nov 🌸' },
  { id: 'santorini', name: 'Santorini', emoji: '🇬🇷', hotels: 450, avgPrice: '€350', rating: 4.9, color: '#2196f3', categories: ['honeymoon', 'romantic', 'beach'], bestFor: 'Honeymoon', neighborhoods: [{ name: 'Oia', vibe: '💑', price: '€500', distance: '0km', safety: 5.0 }, { name: 'Fira', vibe: '🏛️', price: '€350', distance: '3km', safety: 4.9 }, { name: 'Imerovigli', vibe: '💎', price: '€450', distance: '2km', safety: 5.0 }, { name: 'Perissa', vibe: '🏖️', price: '€180', distance: '8km', safety: 4.8 }], tips: 'Apr-Jun, Sep-Oct best. Avoid Aug (crowded).', weather: 'Apr–Jun, Sep–Oct ☀️' },
  { id: 'maldives', name: 'Maldives', emoji: '🇲🇻', hotels: 280, avgPrice: '$550', rating: 4.9, color: '#00bcd4', categories: ['honeymoon', 'beach', 'resort'], bestFor: 'Honeymoon', neighborhoods: [{ name: 'Male', vibe: '🏙️', price: '$300', distance: '0km', safety: 4.9 }, { name: 'North Malé', vibe: '🏝️', price: '$600', distance: '15km', safety: 5.0 }, { name: 'South Malé', vibe: '🌊', price: '$550', distance: '20km', safety: 5.0 }, { name: 'Baa Atoll', vibe: '🤿', price: '$700', distance: '40km', safety: 5.0 }], tips: 'Nov-Apr is dry season. Monsoon (May-Oct) has deals.', weather: 'Nov–Apr ☀️' },
  { id: 'zurich', name: 'Zurich', emoji: '🇨🇭', hotels: 380, avgPrice: 'CHF 280', rating: 4.8, color: '#f44336', categories: ['business', 'lakeside', 'chocolate'], bestFor: 'Business', neighborhoods: [{ name: 'Altstadt', vibe: '🏛️', price: 'CHF 320', distance: '0km', safety: 5.0 }, { name: 'Bahnhofstrasse', vibe: '🛍️', price: 'CHF 350', distance: '1km', safety: 5.0 }, { name: 'Lake Zurich', vibe: '🌊', price: 'CHF 280', distance: '2km', safety: 5.0 }, { name: 'Zürich West', vibe: '🏢', price: 'CHF 220', distance: '3km', safety: 4.9 }], tips: 'Jun-Aug best. Christmas markets (Dec) are magical!', weather: 'Jun–Aug ☀️' },
  { id: 'auckland', name: 'Auckland', emoji: '🇳🇿', hotels: 420, avgPrice: 'NZD 220', rating: 4.7, color: '#2196f3', categories: ['citycenter', 'nature', 'vineyard'], bestFor: 'City', neighborhoods: [{ name: 'CBD', vibe: '🏙️', price: 'NZD 260', distance: '0km', safety: 4.8 }, { name: 'Parnell', vibe: '🏰', price: 'NZD 220', distance: '2km', safety: 4.9 }, { name: 'Ponsonby', vibe: '🎨', price: 'NZD 200', distance: '3km', safety: 4.7 }, { name: 'Mission Bay', vibe: '🏖️', price: 'NZD 180', distance: '5km', safety: 4.8 }], tips: 'Dec-Feb is summer/peak. Waitomo glowworms year-round.', weather: 'Dec–Feb ☀️' },
]

const BOOKING_PLATFORMS = [
  { name: 'Booking.com', url: 'https://www.booking.com', icon: '🏨', color: '#003580', rating: '⭐ 8.5' },
  { name: 'Agoda', url: 'https://www.agoda.com', icon: '🌟', color: '#ff6b6b', rating: '⭐ 8.7' },
  { name: 'MakeMyTrip', url: 'https://www.makemytrip.com', icon: '🟠', color: '#ff6b00', rating: '⭐ 8.2' },
  { name: 'Goibibo', url: 'https://www.goibibo.com', icon: '🟡', color: '#ffcc00', rating: '⭐ 8.0' },
  { name: 'Airbnb', url: 'https://www.airbnb.com', icon: '🏡', color: '#ff5a5f', rating: '⭐ 8.8' },
  { name: 'Hotels.com', url: 'https://www.hotels.com', icon: '🏩', color: '#003580', rating: '⭐ 8.4' },
  { name: 'OYO', url: 'https://www.oyorooms.com', icon: '🛏️', color: '#ff384c', rating: '⭐ 7.8' },
  { name: 'Expedia', url: 'https://www.expedia.com', icon: '✈️', color: '#003580', rating: '⭐ 8.3' },
]

const TIPS_HOTELS = [
  { icon: '💰', title: 'Book Early', desc: 'Hotels are 30-50% cheaper when booked 2-3 weeks ahead.' },
  { icon: '🕐', title: 'Check-in Time', desc: 'Most hotels have 2 PM check-in. Early check-in often available.' },
  { icon: '🔄', title: 'Free Cancellation', desc: 'Always book with free cancellation. Plans change!' },
  { icon: '⭐', title: 'Read Recent Reviews', desc: 'Look at reviews from the last 3 months only.' },
  { icon: '📍', title: 'Location Matters', desc: 'A cheap hotel far from center costs more in transport.' },
  { icon: '🛡️', title: 'Compare Direct', desc: 'Sometimes booking direct gets better rates or upgrades.' },
]

export default function Hotels() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/hotels')
  
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'all' | 'india' | 'international'>('all')

  // Feature 4: Hotel Category Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Feature 1: Hotel Detail Modal
  const [detailCity, setDetailCity] = useState<typeof CITIES_HOTELS[0] | null>(null)

  // Feature 2: Price Calendar Widget
  const [priceCalendarCity, setPriceCalendarCity] = useState<string | null>(null)
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')

  // Feature 3: Smart Budget Planner
  const [showBudgetPlanner, setShowBudgetPlanner] = useState(false)
  const [budgetPlannerData, setBudgetPlannerData] = useState({ city: '', nights: 3, guests: 2, level: 'comfort' })

  // Feature 5: Loyalty Program Tracker
  const [loyaltyNights, setLoyaltyNights] = useState(10)
  const [loyaltyAvgPrice, setLoyaltyAvgPrice] = useState(5000)

  // Feature 7: Real-time Availability Badges
  const getAvailabilityBadge = (cityName: string) => {
    const hash = cityName.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
    const month = new Date().getMonth()
    const combined = Math.abs(hash + month)
    const type = combined % 3
    if (type === 0) return { status: 'High Demand', color: R, msg: 'Prices up 23% this week', icon: '🔴' }
    if (type === 1) return { status: 'Moderate', color: G, msg: 'Good availability', icon: '🟡' }
    return { status: 'Great Deals', color: '#4caf50', msg: 'Prices down 15%, book now', icon: '🟢' }
  }

  // Feature 8: Travel Style Quiz
  const [travelStyle, setTravelStyle] = useState<string | null>(null)
  const [showQuiz, setShowQuiz] = useState(true)

  // Feature 9: City Comparison
  const [compareList, setCompareList] = useState<typeof CITIES_HOTELS[0][]>([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  // Feature 10: Deal of the Day
  const dealOfTheDay = useMemo(() => {
    const dayOfMonth = new Date().getDate()
    return CITIES_HOTELS[dayOfMonth % CITIES_HOTELS.length]
  }, [])

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDetailCity(null)
        setPriceCalendarCity(null)
        setShowBudgetPlanner(false)
        setShowCompareModal(false)
        setShowQuiz(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Load quiz state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hotelsTravelStyle')
      if (saved) {
        setTravelStyle(saved)
        setShowQuiz(false)
      }
    } catch (e) { console.log('localStorage not available') }
  }, [])

  // Handle travel style selection
  const handleTravelStyleSelect = (style: string) => {
    setTravelStyle(style)
    try {
      localStorage.setItem('hotelsTravelStyle', style)
    } catch (e) { console.log('localStorage not available') }
    setShowQuiz(false)
  }

  // Filter cities based on categories and travel style
  const filteredCities = CITIES_HOTELS.filter(city => {
    const matchesView = viewMode === 'india' ? city.emoji === '🇮🇳' : viewMode === 'international' ? city.emoji !== '🇮🇳' : true
    const matchesSearch = !searchQuery || city.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategories = selectedCategories.length === 0 || selectedCategories.some(cat => city.categories.includes(cat))
    return matchesView && matchesSearch && matchesCategories
  }).sort((a, b) => {
    // Prioritize travel style matching
    if (!travelStyle) return 0
    const styleMap: Record<string, string[]> = {
      'budget': ['jaipur', 'agra', 'varanasi', 'bangkok', 'kolkata'],
      'business': ['mumbai', 'delhi', 'bangalore', 'dubai', 'london', 'new_york', 'singapore'],
      'family': ['goa', 'bali', 'singapore', 'bangkok', 'dubai'],
      'romantic': ['paris', 'rome', 'santorini', 'maldives', 'kyoto', 'udaipur', 'bali']
    }
    const aPriority = styleMap[travelStyle]?.indexOf(a.id) ?? 999
    const bPriority = styleMap[travelStyle]?.indexOf(b.id) ?? 999
    return aPriority - bPriority
  })

  // Get price multiplier for calendar
  const getPriceMultiplier = (month: number) => {
    if (month >= 10 || month <= 2) return 1.3 // Peak season
    if (month >= 6 && month <= 8) return 0.9 // Monsoon/off-season
    return 1.0 // Shoulder season
  }

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    )
  }

  const toggleCompareCity = (city: typeof CITIES_HOTELS[0]) => {
    if (compareList.find(c => c.id === city.id)) {
      setCompareList(compareList.filter(c => c.id !== city.id))
    } else if (compareList.length < 3) {
      setCompareList([...compareList, city])
    }
  }

  const isInCompareList = (id: string) => !!compareList.find(c => c.id === id)

  // Calculate budget
  const calculateBudget = () => {
    const cityData = CITIES_HOTELS.find(c => c.id === budgetPlannerData.city)
    if (!cityData) return null
    const basePrice = parseInt(cityData.avgPrice.replace(/[^0-9]/g, '')) || 3000
    const multiplier = budgetPlannerData.level === 'economy' ? 0.7 : budgetPlannerData.level === 'luxury' ? 1.5 : 1.0
    const total = basePrice * multiplier * budgetPlannerData.nights * budgetPlannerData.guests
    const savings = Math.round(total * 0.25)
    return { total, savings, perNight: basePrice * multiplier, platform: budgetPlannerData.level === 'economy' ? 'MakeMyTrip' : budgetPlannerData.level === 'luxury' ? 'Booking.com' : 'Agoda' }
  }

  const budgetResult = calculateBudget()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const nav = (path: string) => { setActivePath(path); router.push(path) }
  const handleLogout = () => signOut(auth).then(() => router.push('/landing'))

  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 44, height: 44, border: '2px solid rgba(99,210,255,0.15)', borderTopColor: C, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()

  return (
    <div style={{ display: 'flex', height: '100vh', background: BG, color: '#fff', fontFamily: "'Outfit',sans-serif", overflow: 'hidden' }}>
      <Sidebar sidebarOpen={sidebarOpen} activePath={activePath} user={user} onLogout={handleLogout} />

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* TOP BAR */}
        <div style={{ height: 62, padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(99,210,255,0.07)', background: 'rgba(0,5,14,0.9)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer', fontSize: 15, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
            >☰</button>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>🏨 Hotels & Stays</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)' }}>Find the perfect stay</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(255,183,77,0.05)', border: '1px solid rgba(255,183,77,0.12)', borderRadius: 10 }}>
              <span style={{ fontSize: 12 }}>🏨</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>25,000+ Hotels</span>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000814', cursor: 'pointer', flexShrink: 0 }}>{avatar}</div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>

          {/* STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { icon: '🌆', label: 'Cities Covered', value: '50+', color: G },
              { icon: '🏨', label: 'Hotels Listed', value: '25K+', color: C },
              { icon: '💰', label: 'Avg Savings', value: '30%', color: '#51cf66' },
              { icon: '⭐', label: 'Avg Rating', value: '4.7', color: G },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${s.color}16`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.3s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.border = `1px solid ${s.color}30`; e.currentTarget.style.boxShadow = `0 8px 28px ${s.color}0e` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.border = `1px solid ${s.color}16`; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ width: 42, height: 42, borderRadius: 11, background: `${s.color}12`, border: `1px solid ${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.32)', marginTop: 3 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* SEARCH & FILTERS */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,210,255,0.08)', borderRadius: 16, padding: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <input
                type="text"
                placeholder="🔍 Search cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.12)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', marginRight: 12 }}
              />
              <button onClick={() => setShowCompareModal(true)} disabled={compareList.length < 2} style={{ background: compareList.length >= 2 ? `linear-gradient(135deg, ${G}, #ff9800)` : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, padding: '10px 16px', fontSize: 12, fontWeight: 600, color: compareList.length >= 2 ? '#000814' : 'rgba(255,255,255,0.3)', cursor: compareList.length >= 2 ? 'pointer' : 'not-allowed' }}>
                ⚖️ Compare ({compareList.length})
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setSelectedCity(''); setViewMode('all') }} style={{ flex: 1, background: viewMode === 'all' && !selectedCity ? 'rgba(99,210,255,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${viewMode === 'all' && !selectedCity ? C : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '10px 16px', color: viewMode === 'all' && !selectedCity ? C : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                🌍 All Cities
              </button>
              <button onClick={() => { setSelectedCity(''); setViewMode('india') }} style={{ flex: 1, background: viewMode === 'india' ? 'rgba(255,183,77,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${viewMode === 'india' ? G : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '10px 16px', color: viewMode === 'india' ? G : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                🇮🇳 India ({CITIES_HOTELS.filter(c => c.emoji === '🇮🇳').length})
              </button>
              <button onClick={() => { setSelectedCity(''); setViewMode('international') }} style={{ flex: 1, background: viewMode === 'international' ? 'rgba(99,210,255,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${viewMode === 'international' ? C : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '10px 16px', color: viewMode === 'international' ? C : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                ✈️ International ({CITIES_HOTELS.filter(c => c.emoji !== '🇮🇳').length})
              </button>
            </div>
          </div>

          {/* Feature 8: Travel Style Quiz Banner */}
          {showQuiz && (
            <div style={{ background: 'linear-gradient(135deg, rgba(99,210,255,0.15), rgba(255,183,77,0.15))', border: `1px solid ${C}30`, borderRadius: 16, padding: 20, marginBottom: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>✨ What kind of traveler are you?</div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { id: 'budget', icon: '🎒', label: 'Budget Backpacker' },
                  { id: 'business', icon: '💼', label: 'Business Traveler' },
                  { id: 'family', icon: '👨‍👩‍👧', label: 'Family Vacationer' },
                  { id: 'romantic', icon: '💑', label: 'Romantic Getaway' },
                ].map(style => (
                  <button key={style.id} onClick={() => handleTravelStyleSelect(style.id)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 20px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 24 }}>{style.icon}</span>
                    <span style={{ fontSize: 11, color: '#fff' }}>{style.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Travel Style Chip */}
          {travelStyle && !showQuiz && (
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Showing results for:</span>
              <span style={{ background: `${C}20`, padding: '4px 12px', borderRadius: 20, fontSize: 12, color: C, display: 'flex', alignItems: 'center', gap: 6 }}>
                {travelStyle === 'budget' ? '🎒 Budget' : travelStyle === 'business' ? '💼 Business' : travelStyle === 'family' ? '👨‍👩‍👧 Family' : '💑 Romantic'}
                <button onClick={() => { setTravelStyle(''); try { localStorage.removeItem('hotelsTravelStyle') } catch(e) {} }} style={{ background: 'none', border: 'none', color: C, cursor: 'pointer', fontSize: 14 }}>✕</button>
              </span>
            </div>
          )}

          {/* Feature 4: Hotel Category Filters */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 10, fontWeight: 500 }}>Filter by Category</h3>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'thin' }}>
              {HOTEL_CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => toggleCategory(cat.id)}
                  style={{ whiteSpace: 'nowrap', padding: '8px 14px', background: selectedCategories.includes(cat.id) ? C : 'rgba(255,255,255,0.05)', border: `1px solid ${selectedCategories.includes(cat.id) ? C : 'rgba(255,255,255,0.1)'}`, borderRadius: 20, fontSize: 12, color: selectedCategories.includes(cat.id) ? '#000814' : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Feature 10: Deal of the Day Card */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚡ Today's Hot Deal
            </h2>
            <div style={{ background: `linear-gradient(135deg, ${dealOfTheDay.color}40, ${dealOfTheDay.color}10)`, border: `1px solid ${dealOfTheDay.color}40`, borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', gap: 16, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,107,107,0.9)', padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 700, color: '#fff' }}>🔥 Up to 40% off</div>
              <div style={{ fontSize: 48 }}>{dealOfTheDay.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{dealOfTheDay.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Deal expires in <CountdownTimer /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>{dealOfTheDay.avgPrice}</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: G }}>{dealOfTheDay.avgPrice}</span>
                </div>
              </div>
              <a href={`https://www.booking.com/searchresults.html?dest=${dealOfTheDay.name}`} target="_blank" rel="noopener noreferrer" style={{ background: `linear-gradient(135deg, ${G}, #ff9800)`, color: '#000814', padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                Grab This Deal
              </a>
            </div>
          </div>

          {/* CITIES GRID */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              {selectedCity ? `📍 ${CITIES_HOTELS.find(c => c.id === selectedCity)?.name} Hotels` : `🌆 ${viewMode === 'india' ? 'Indian' : viewMode === 'international' ? 'International' : 'All'} Cities`}
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>({filteredCities.length})</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {filteredCities.map((city, idx) => {
                const badge = getAvailabilityBadge(city.name)
                return (
                <div
                  key={city.id}
                  style={{
                    background: selectedCity === city.id 
                      ? `linear-gradient(135deg, ${city.color}20, ${city.color}10)` 
                      : 'rgba(255,255,255,0.025)',
                    border: `1px solid ${selectedCity === city.id ? city.color : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 14,
                    padding: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    animation: `fadeIn 0.3s ease ${idx * 0.02}s both`,
                    position: 'relative',
                  }}
                  onClick={() => { setDetailCity(city); setSelectedCity(city.id) }}
                  onMouseEnter={e => { if (selectedCity !== city.id) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 10px 28px ${city.color}15` } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {/* Feature 7: Availability Pulse Badge */}
                  <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: badge.color, animation: 'pulse 2s infinite' }} />
                    <span style={{ fontSize: 8, color: badge.color }}>{badge.status}</span>
                  </div>

                  {/* Feature 9: Compare Checkbox */}
                  <button onClick={(e) => { e.stopPropagation(); toggleCompareCity(city) }} style={{ position: 'absolute', top: 8, right: 8, background: isInCompareList(city.id) ? 'rgba(255,107,107,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isInCompareList(city.id) ? R : 'rgba(255,255,255,0.1)'}`, borderRadius: 20, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, zIndex: 5 }}>
                    {isInCompareList(city.id) ? '✓' : '+'}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, marginTop: 10 }}>
                    <span style={{ fontSize: 26 }}>{city.emoji}</span>
                    <div style={{ fontSize: 13, fontWeight: 700, color: selectedCity === city.id ? city.color : '#fff' }}>{city.name}</div>
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>⭐ {city.rating} · {city.hotels.toLocaleString()} hotels</div>
                  <div style={{ fontSize: 12, color: G, fontWeight: 700 }}>From {city.avgPrice}</div>
                  
                  {/* Feature 2: Price Calendar Button */}
                  <button onClick={(e) => { e.stopPropagation(); setPriceCalendarCity(priceCalendarCity === city.id ? null : city.id) }} style={{ marginTop: 8, width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px', fontSize: 10, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                    📅 Check Prices
                  </button>

                  {/* Feature 2: Price Calendar Popover */}
                  {priceCalendarCity === city.id && (
                    <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, background: '#0a1628', border: `1px solid ${C}30`, borderRadius: 12, padding: 12, marginBottom: 8, zIndex: 20, boxShadow: '0 -8px 32px rgba(0,0,0,0.5)' }}>
                      <div style={{ fontSize: 10, color: C, marginBottom: 8, fontWeight: 600 }}>Select Dates</div>
                      <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 6, padding: 6, color: '#fff', fontSize: 11, marginBottom: 6 }} />
                      <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 6, padding: 6, color: '#fff', fontSize: 11, marginBottom: 8 }} />
                      {checkInDate && checkOutDate && (
                        <>
                          <div style={{ fontSize: 11, color: G, textAlign: 'center', marginBottom: 8 }}>
                            ~{city.avgPrice}/night avg
                          </div>
                          <a href={`https://www.booking.com/searchresults.html?dest=${city.name}&checkin=${checkInDate}&checkout=${checkOutDate}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: C, color: '#000814', textAlign: 'center', padding: '8px', borderRadius: 8, fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>
                            Search Hotels
                          </a>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )})}
            </div>
            {selectedCity && (
              <button onClick={() => { setSelectedCity(''); setDetailCity(null) }} style={{ marginTop: 14, background: 'rgba(99,210,255,0.08)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 10, padding: '8px 16px', color: C, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,210,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,210,255,0.08)'}
              >← Back to All Cities</button>
            )}
          </div>

          {/* BOOKING PLATFORMS */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>📅 Hotel Booking Platforms</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {BOOKING_PLATFORMS.map((platform, idx) => (
                <a key={idx} href={platform.url} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${platform.color}30`, borderRadius: 14, padding: 16, textDecoration: 'none', transition: 'all 0.25s', display: 'block' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = platform.color; e.currentTarget.style.boxShadow = `0 10px 28px ${platform.color}15` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = `${platform.color}30`; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ fontSize: 30, marginBottom: 10 }}>{platform.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{platform.name}</div>
                  <div style={{ fontSize: 11, color: platform.color }}>{platform.rating}</div>
                </a>
              ))}
            </div>
          </div>

          {/* Feature 5: Loyalty Program Tracker */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🎖️ Hotel Loyalty Programs</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 16 }}>
              {HOTEL_LOYALTY_PROGRAMS.map((prog, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = G }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 28 }}>{prog.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{prog.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{prog.brand}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: G, marginBottom: 6 }}>1 point ≈ {prog.pointsValue}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>{prog.perks}</div>
                  <a href={prog.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: 'rgba(255,255,255,0.1)', color: C, textAlign: 'center', padding: '8px', borderRadius: 8, fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>
                    Join Free
                  </a>
                </div>
              ))}
            </div>
            {/* Points Calculator */}
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 12 }}>💡 Points Calculator</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 4 }}>Nights/year</label>
                  <input type="number" value={loyaltyNights} onChange={(e) => setLoyaltyNights(parseInt(e.target.value) || 0)} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 14 }} />
                </div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 4 }}>Avg price/night (₹)</label>
                  <input type="number" value={loyaltyAvgPrice} onChange={(e) => setLoyaltyAvgPrice(parseInt(e.target.value) || 0)} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 14 }} />
                </div>
              </div>
              <div style={{ background: `${G}15`, padding: '12px', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>You'd earn approximately</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: G }}>~{Math.round(loyaltyNights * loyaltyAvgPrice * 10)} points</div>
                <div style={{ fontSize: 11, color: C }}>= ~₹{Math.round(loyaltyNights * loyaltyAvgPrice * 10 * 0.35)} value</div>
              </div>
            </div>
          </div>

          {/* TIPS */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>💡 Hotel Booking Tips</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {TIPS_HOTELS.map((tip, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.025)', padding: 14, borderRadius: 12, border: '1px solid rgba(99,210,255,0.08)', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = C }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(99,210,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{tip.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C }}>{tip.title}</span>
                  </div>
                  <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Feature 3: Smart Budget Planner Floating Button */}
      <button onClick={() => setShowBudgetPlanner(true)} style={{ position: 'fixed', bottom: 20, right: 20, background: `linear-gradient(135deg, ${G}, #ff9800)`, border: 'none', borderRadius: 50, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', zIndex: 50, fontSize: 24 }}>
        💰
      </button>

      {/* Feature 3: Smart Budget Planner Modal */}
      {showBudgetPlanner && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,5,14,0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowBudgetPlanner(false)}>
          <div style={{ background: '#0a1628', border: `1px solid ${G}30`, borderRadius: 20, maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowBudgetPlanner(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 50, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: '#fff' }}>✕</button>
            <div style={{ padding: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 20, textAlign: 'center' }}>💰 Smart Budget Planner</h2>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Destination</label>
                <select value={budgetPlannerData.city} onChange={(e) => setBudgetPlannerData({...budgetPlannerData, city: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14 }}>
                  <option value="" style={{ background: '#05090f' }}>Select a city</option>
                  {CITIES_HOTELS.map(c => <option key={c.id} value={c.id} style={{ background: '#05090f' }}>{c.emoji} {c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Nights</label>
                  <input type="number" value={budgetPlannerData.nights} onChange={(e) => setBudgetPlannerData({...budgetPlannerData, nights: parseInt(e.target.value) || 1})} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Guests</label>
                  <input type="number" value={budgetPlannerData.guests} onChange={(e) => setBudgetPlannerData({...budgetPlannerData, guests: parseInt(e.target.value) || 1})} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14 }} />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Budget Level</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['economy', 'comfort', 'luxury'].map(level => (
                    <button key={level} onClick={() => setBudgetPlannerData({...budgetPlannerData, level})} style={{ flex: 1, background: budgetPlannerData.level === level ? C : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, padding: '12px', fontSize: 12, color: budgetPlannerData.level === level ? '#000814' : '#fff', cursor: 'pointer', textTransform: 'capitalize' }}>
                      {level === 'economy' ? '💵 Economy' : level === 'comfort' ? '🏨 Comfort' : '💎 Luxury'}
                    </button>
                  ))}
                </div>
              </div>
              {budgetResult && (
                <div style={{ background: `${G}15`, border: `1px solid ${G}30`, borderRadius: 16, padding: 20 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 8 }}>₹{budgetResult.total.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 16 }}>Total estimated cost</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, fontSize: 11 }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 8 }}>
                      <div style={{ color: 'rgba(255,255,255,0.5)' }}>Per night</div>
                      <div style={{ color: G, fontWeight: 600 }}>₹{budgetResult.perNight.toLocaleString()}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 8 }}>
                      <div style={{ color: 'rgba(255,255,255,0.5)' }}>Nights × Guests</div>
                      <div style={{ color: G, fontWeight: 600 }}>{budgetPlannerData.nights} × {budgetPlannerData.guests}</div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(76,175,80,0.2)', padding: 12, borderRadius: 10, textAlign: 'center', marginBottom: 16 }}>
                    <span style={{ color: '#4caf50', fontWeight: 600 }}>You could save ~₹{budgetResult.savings.toLocaleString()} by booking now vs peak season</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 12 }}>Suggested platform: <span style={{ color: C, fontWeight: 600 }}>{budgetResult.platform}</span></div>
                  <a href={`https://www.booking.com/searchresults.html?dest=${CITIES_HOTELS.find(c => c.id === budgetPlannerData.city)?.name}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: `linear-gradient(135deg, ${C}, #3bb8e8)`, color: '#000814', textAlign: 'center', padding: '14px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                    Search Hotels
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feature 1: Hotel Detail Modal */}
      {detailCity && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,5,14,0.95)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setDetailCity(null)}>
          <div style={{ background: '#0a1628', border: `1px solid ${detailCity.color}30`, borderRadius: 20, maxWidth: 700, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setDetailCity(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 50, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: '#fff', zIndex: 10 }}>✕</button>
            
            {/* Hero */}
            <div style={{ height: 160, background: `linear-gradient(135deg, ${detailCity.color}40, ${detailCity.color}10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <span style={{ fontSize: 64, marginBottom: 8 }}>{detailCity.emoji}</span>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0 }}>{detailCity.name}</h2>
              <span style={{ fontSize: 12, color: C, marginTop: 4 }}>{detailCity.weather}</span>
            </div>
            
            <div style={{ padding: 20 }}>
              {/* Best For Tags */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ background: `${C}20`, padding: '4px 12px', borderRadius: 20, fontSize: 11, color: C }}>Best for: {detailCity.bestFor}</span>
                {detailCity.categories.map(cat => (
                  <span key={cat} style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 20, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                    {HOTEL_CATEGORIES.find(c => c.id === cat)?.emoji} {HOTEL_CATEGORIES.find(c => c.id === cat)?.name}
                  </span>
                ))}
              </div>

              {/* Top Hotels */}
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12 }}>🏨 Top Hotels in {detailCity.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
                {[
                  { name: `${detailCity.name} Grand Hotel`, stars: 5, price: detailCity.avgPrice, tags: ['Luxury', 'Pool'] },
                  { name: `${detailCity.name} Inn`, stars: 4, price: detailCity.avgPrice.replace(/[\d,]/g, s => String(Number(s) * 0.6)), tags: ['Comfort', 'WiFi'] },
                  { name: `${detailCity.name} Budget Stay`, stars: 3, price: detailCity.avgPrice.replace(/[\d,]/g, s => String(Number(s) * 0.4)), tags: ['Budget', 'Clean'] },
                  { name: `${detailCity.name} Resort`, stars: 4, price: detailCity.avgPrice.replace(/[\d,]/g, s => String(Number(s) * 0.8)), tags: ['Family', 'Spa'] },
                ].map((hotel, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{hotel.name}</div>
                    <div style={{ fontSize: 10, color: G, marginBottom: 6 }}>{'★'.repeat(hotel.stars)}{'☆'.repeat(5-hotel.stars)}</div>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
                      {hotel.tags.map(t => <span key={t} style={{ fontSize: 8, background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 4 }}>{t}</span>)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: G, fontWeight: 700 }}>From {hotel.price}</span>
                      <a href={`https://www.booking.com/searchresults.html?dest=${detailCity.name}`} target="_blank" rel="noopener noreferrer" style={{ background: C, color: '#000814', padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, textDecoration: 'none' }}>Book</a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature 6: Neighbourhood Heat Map */}
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12 }}>📍 Best Areas to Stay</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
                {detailCity.neighborhoods?.map((n, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 14 }}>{n.vibe}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{n.name}</span>
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>From {n.price}/night</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>📍 {n.distance} from center · {'★'.repeat(Math.round(n.safety))} safety</div>
                  </div>
                ))}
              </div>

              {/* Travel Tips */}
              <div style={{ background: `${C}10`, border: `1px solid ${C}20`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C, marginBottom: 6 }}>💡 Travel Tip</div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>{detailCity.tips}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature 9: City Comparison Modal */}
      {showCompareModal && compareList.length >= 2 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,5,14,0.95)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowCompareModal(false)}>
          <div style={{ background: '#0a1628', border: `1px solid ${G}30`, borderRadius: 20, maxWidth: 800, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowCompareModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 50, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: '#fff', zIndex: 10 }}>✕</button>
            <div style={{ padding: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 20, textAlign: 'center' }}>⚖️ Compare Cities</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: 12, textAlign: 'left', color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Feature</th>
                      {compareList.map(c => (
                        <th key={c.id} style={{ padding: 12, textAlign: 'center', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', minWidth: 150 }}>
                          <div style={{ fontSize: 32 }}>{c.emoji}</div>
                          <div style={{ fontWeight: 700, marginTop: 4 }}>{c.name}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: 12, color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Avg price/night</td>
                      {compareList.map(c => <td key={c.id} style={{ padding: 12, textAlign: 'center', color: G, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{c.avgPrice}</td>)}
                    </tr>
                    <tr>
                      <td style={{ padding: 12, color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Hotel count</td>
                      {compareList.map(c => <td key={c.id} style={{ padding: 12, textAlign: 'center', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{c.hotels.toLocaleString()}</td>)}
                    </tr>
                    <tr>
                      <td style={{ padding: 12, color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Rating</td>
                      {compareList.map(c => <td key={c.id} style={{ padding: 12, textAlign: 'center', color: G, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>★ {c.rating}</td>)}
                    </tr>
                    <tr>
                      <td style={{ padding: 12, color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Best for</td>
                      {compareList.map(c => <td key={c.id} style={{ padding: 12, textAlign: 'center', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{c.bestFor}</td>)}
                    </tr>
                    <tr>
                      <td style={{ padding: 12, color: 'rgba(255,255,255,0.5)' }}>Peak season</td>
                      {compareList.map(c => <td key={c.id} style={{ padding: 12, textAlign: 'center', color: '#fff' }}>{c.weather}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  )
}

// Countdown Timer Component
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0)
      const diff = midnight.getTime() - now.getTime()
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      }
    }
    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])
  
  return <span style={{ fontFamily: 'monospace' }}>{String(timeLeft.hours).padStart(2,'0')}:{String(timeLeft.minutes).padStart(2,'0')}:{String(timeLeft.seconds).padStart(2,'0')}</span>
}
