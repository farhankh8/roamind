'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const C = '#63d2ff'
const G = '#ffb74d'
const R = '#ff6b6b'
const GR = '#51cf66'
const PURPLE = '#a855f7'
const BG = '#000814'
const GRAY = '#6b7280'

const navSections = [
  { title: 'Plan & Discover', items: [{ icon: '🏠', label: 'Dashboard', path: '/dashboard' }, { icon: '🤖', label: 'AI Itinerary', path: '/itinerary' }] },
  { title: 'Book & Travel', items: [{ icon: '✈️', label: 'Flights', path: '/flights' }, { icon: '🏨', label: 'Hotels', path: '/hotels' }, { icon: '🍽️', label: 'Restaurants', path: '/restaurants' }, { icon: '🚌', label: 'Transport', path: '/transport' }] },
  { title: 'Intelligence', items: [{ icon: '🛂', label: 'Visa Guide', path: '/visa' }, { icon: '💱', label: 'Currency', path: '/currency' }, { icon: '🌤️', label: 'Weather+AQI', path: '/weather' }, { icon: '🆘', label: 'Emergency', path: '/emergency' }] },
  { title: 'Discover People', items: [{ icon: '👨‍💼', label: 'Local Guides', path: '/guides' }, { icon: '🤝', label: 'Couch Surfing', path: '/couchsurfing' }] },
  { title: 'My Travel', items: [{ icon: '🏅', label: 'Travel Passport', path: '/passport' }, { icon: '❤️', label: 'Saved Trips', path: '/saved' }, { icon: '📦', label: 'Packing List', path: '/packing' }, { icon: '💰', label: 'Budget Tracker', path: '/budget' }, { icon: '💬', label: 'AI Chat', path: '/chat' }, { icon: '🧠', label: 'Travel IQ', path: '/traveliq' }, { icon: '⚙️', label: 'Settings', path: '/settings' }] },
]

interface Host {
  id: number
  name: string
  city: string
  country: string
  flag: string
  age: number
  gender: string
  languages: string[]
  languageFlags: string[]
  responseRate: number
  responseTime: string
  reviews: number
  rating: number
  hosting: number
  surfing: number
  references: number
  acceptingGuests: boolean
  verificationLevel: 'basic' | 'phone' | 'id' | 'plus'
  verified: boolean
  plusVerified: boolean
  bio: string
  interests: string[]
  couchType: 'Private Room' | 'Shared Room' | 'Couch'
  maxGuests: number
  location: string
  lastActive: string
  lastActiveDate: Date
  responseCount: number
  memberSince: string
  about: string
  whatIOffer: string
  parking: boolean
  wifi: boolean
  ac: boolean
  laundry: boolean
  breakfast: boolean
  smoking: boolean
  pets: boolean
  region: string
}

interface Platform {
  name: string
  emoji: string
  url: string
  description: string
  stats: string
  isFree: boolean
  badge: string
  color: string
}

interface Region {
  name: string
  emoji: string
  countries: string[]
  hostCount: number
  topCountries: { name: string; flag: string; hostCount: number }[]
}

interface HotDestination {
  city: string
  country: string
  flag: string
  emoji: string
  hostCount: number
  avgRating: number
}

interface Review {
  id: number
  author: string
  authorFlag: string
  authorMemberSince: string
  date: string
  rating: number
  text: string
  type: 'couch' | 'hangout' | 'reference'
}

const PLATFORMS: Platform[] = [
  { name: 'CouchSurfing', emoji: '🌍', url: 'https://couchsurfing.com', description: 'Largest network with 14M+ members worldwide', stats: '14M+ members', isFree: false, badge: 'Freemium', color: '#e74c3c' },
  { name: 'Trustroots', emoji: '🤝', url: 'https://trustroots.org', description: 'Free, open-source, traveler community', stats: '100K+ members', isFree: true, badge: '100% Free', color: '#27ae60' },
  { name: 'BeWelcome', emoji: '💚', url: 'https://bewelcome.org', description: 'Non-profit, community-run hospitality network', stats: '80K+ members', isFree: true, badge: 'Non-Profit', color: '#27ae60' },
  { name: 'Warmshowers', emoji: '🚴', url: 'https://warmshowers.org', description: 'For cyclists, by cyclists - free hosting', stats: '150K+ cyclists', isFree: true, badge: 'Cycling Only', color: '#3498db' },
  { name: 'Servas', emoji: '☮️', url: 'https://servas.org', description: 'Peace-focused, requires interview approval', stats: '13K+ members', isFree: true, badge: 'Interview Required', color: '#9b59b6' },
  { name: 'Pasporta Servo', emoji: '🌐', url: 'https://pasportaservo.org', description: 'Esperanto-speaking hospitality network', stats: '12K+ speakers', isFree: true, badge: 'Esperanto', color: '#1abc9c' },
  { name: 'Hospitality Club', emoji: '🏠', url: 'https://hospitalityclub.org', description: 'Classic hospitality network, still active', stats: '200K+ members', isFree: true, badge: 'Classic', color: '#e67e22' },
  { name: 'Warm Hosts', emoji: '🔥', url: 'https://warmhosts.info', description: 'Alternative network for all travelers', stats: '50K+ hosts', isFree: true, badge: 'Free', color: '#e74c3c' },
]

const REGIONS: Region[] = [
  { name: 'Europe', emoji: '🇪🇺', countries: ['Portugal', 'Spain', 'France', 'Germany', 'Italy', 'Netherlands', 'UK', 'Greece', 'Croatia', 'Czech Republic', 'Poland', 'Hungary', 'Austria', 'Switzerland', 'Belgium', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland'], hostCount: 3245, topCountries: [{ name: 'France', flag: '🇫🇷', hostCount: 428 }, { name: 'Spain', flag: '🇪🇸', hostCount: 312 }, { name: 'Germany', flag: '🇩🇪', hostCount: 356 }] },
  { name: 'Asia', emoji: '🌏', countries: ['Japan', 'Thailand', 'Indonesia', 'Vietnam', 'Philippines', 'Malaysia', 'Singapore', 'India', 'South Korea', 'Taiwan', 'Hong Kong', 'China'], hostCount: 1456, topCountries: [{ name: 'Japan', flag: '🇯🇵', hostCount: 234 }, { name: 'Thailand', flag: '🇹🇭', hostCount: 201 }, { name: 'Indonesia', flag: '🇮🇩', hostCount: 167 }] },
  { name: 'Americas', emoji: '🌎', countries: ['USA', 'Canada', 'Brazil', 'Mexico', 'Argentina', 'Colombia', 'Peru', 'Chile', 'Uruguay', 'Cuba'], hostCount: 1678, topCountries: [{ name: 'USA', flag: '🇺🇸', hostCount: 512 }, { name: 'Brazil', flag: '🇧🇷', hostCount: 178 }, { name: 'Mexico', flag: '🇲🇽', hostCount: 156 }] },
  { name: 'Oceania', emoji: '🏝️', countries: ['Australia', 'New Zealand'], hostCount: 345, topCountries: [{ name: 'Australia', flag: '🇦🇺', hostCount: 267 }, { name: 'New Zealand', flag: '🇳🇿', hostCount: 78 }] },
  { name: 'Africa', emoji: '🌍', countries: ['South Africa', 'Morocco', 'Egypt', 'Kenya', 'Nigeria', 'Ghana', 'Ethiopia'], hostCount: 234, topCountries: [{ name: 'Morocco', flag: '🇲🇦', hostCount: 67 }, { name: 'South Africa', flag: '🇿🇦', hostCount: 56 }, { name: 'Egypt', flag: '🇪🇬', hostCount: 45 }] },
  { name: 'Middle East', emoji: '🕌', countries: ['Turkey', 'UAE', 'Israel', 'Egypt'], hostCount: 269, topCountries: [{ name: 'Turkey', flag: '🇹🇷', hostCount: 145 }, { name: 'Israel', flag: '🇮🇱', hostCount: 56 }, { name: 'UAE', flag: '🇦🇪', hostCount: 23 }] },
]

const HOT_DESTINATIONS: HotDestination[] = [
  { city: 'Lisbon', country: 'Portugal', flag: '🇵🇹', emoji: '🏛️', hostCount: 245, avgRating: 4.9 },
  { city: 'Barcelona', country: 'Spain', flag: '🇪🇸', emoji: '🏖️', hostCount: 312, avgRating: 4.8 },
  { city: 'Paris', country: 'France', flag: '🇫🇷', emoji: '🗼', hostCount: 428, avgRating: 4.85 },
  { city: 'Tokyo', country: 'Japan', flag: '🇯🇵', emoji: '⛩️', hostCount: 234, avgRating: 4.92 },
  { city: 'Bali', country: 'Indonesia', flag: '🇮🇩', emoji: '🌴', hostCount: 167, avgRating: 4.86 },
  { city: 'Berlin', country: 'Germany', flag: '🇩🇪', emoji: '🎨', hostCount: 356, avgRating: 4.7 },
  { city: 'Medellín', country: 'Colombia', flag: '🇨🇴', emoji: '🌺', hostCount: 89, avgRating: 4.87 },
  { city: 'Bangkok', country: 'Thailand', flag: '🇹🇭', emoji: '🛕', hostCount: 201, avgRating: 4.91 },
]

const COUNTRIES_WITH_HOSTS = [
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', city: 'Lisbon', hostCount: 245, region: 'Europe' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', city: 'Barcelona', hostCount: 312, region: 'Europe' },
  { code: 'FR', name: 'France', flag: '🇫🇷', city: 'Paris', hostCount: 428, region: 'Europe' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', city: 'Berlin', hostCount: 356, region: 'Europe' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', city: 'Rome', hostCount: 289, region: 'Europe' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', city: 'Amsterdam', hostCount: 198, region: 'Europe' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', city: 'London', hostCount: 387, region: 'Europe' },
  { code: 'US', name: 'United States', flag: '🇺🇸', city: 'New York', hostCount: 512, region: 'Americas' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', city: 'Tokyo', hostCount: 234, region: 'Asia' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', city: 'Sydney', hostCount: 267, region: 'Oceania' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', city: 'Vancouver', hostCount: 189, region: 'Americas' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', city: 'Rio', hostCount: 178, region: 'Americas' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', city: 'Mexico City', hostCount: 156, region: 'Americas' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', city: 'Buenos Aires', hostCount: 134, region: 'Americas' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', city: 'Bangkok', hostCount: 201, region: 'Asia' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', city: 'Bali', hostCount: 167, region: 'Asia' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', city: 'Hanoi', hostCount: 123, region: 'Asia' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', city: 'Manila', hostCount: 89, region: 'Asia' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', city: 'Kuala Lumpur', hostCount: 76, region: 'Asia' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', city: 'Singapore', hostCount: 45, region: 'Asia' },
  { code: 'IN', name: 'India', flag: '🇮🇳', city: 'Goa', hostCount: 112, region: 'Asia' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', city: 'Istanbul', hostCount: 145, region: 'Middle East' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', city: 'Athens', hostCount: 98, region: 'Europe' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', city: 'Dubrovnik', hostCount: 67, region: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', city: 'Prague', hostCount: 112, region: 'Europe' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', city: 'Krakow', hostCount: 89, region: 'Europe' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', city: 'Budapest', hostCount: 78, region: 'Europe' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', city: 'Vienna', hostCount: 87, region: 'Europe' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', city: 'Zurich', hostCount: 56, region: 'Europe' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', city: 'Brussels', hostCount: 67, region: 'Europe' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', city: 'Stockholm', hostCount: 78, region: 'Europe' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', city: 'Oslo', hostCount: 45, region: 'Europe' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', city: 'Copenhagen', hostCount: 54, region: 'Europe' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', city: 'Helsinki', hostCount: 34, region: 'Europe' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', city: 'Dublin', hostCount: 89, region: 'Europe' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', city: 'Auckland', hostCount: 78, region: 'Oceania' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', city: 'Cape Town', hostCount: 56, region: 'Africa' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', city: 'Seoul', hostCount: 89, region: 'Asia' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', city: 'Taipei', hostCount: 67, region: 'Asia' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', city: 'Hong Kong', hostCount: 34, region: 'Asia' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', city: 'Dubai', hostCount: 23, region: 'Middle East' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', city: 'Tel Aviv', hostCount: 56, region: 'Middle East' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', city: 'Cairo', hostCount: 45, region: 'Africa' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', city: 'Marrakech', hostCount: 67, region: 'Africa' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', city: 'Medellin', hostCount: 89, region: 'Americas' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', city: 'Lima', hostCount: 56, region: 'Americas' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', city: 'Santiago', hostCount: 45, region: 'Americas' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', city: 'Montevideo', hostCount: 23, region: 'Americas' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', city: 'Havana', hostCount: 34, region: 'Americas' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸', city: 'Belgrade', hostCount: 45, region: 'Europe' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', city: 'Bucharest', hostCount: 34, region: 'Europe' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', city: 'Sofia', hostCount: 28, region: 'Europe' },
]

const COUNTRIES_WITHOUT_HOSTS = [
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', message: 'We are still building our community in Pakistan. Be the first to connect with travelers!' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', message: 'Our community is growing! Check back soon for hosts in Saudi Arabia.' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', message: 'We are working on expanding to Iran. Stay tuned for updates!' },
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', message: 'Our community is not yet available in Afghanistan, but we hope to connect soon!' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', message: 'We are not yet active in Iraq, but international connections are growing!' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾', message: 'Our community is not yet established in Syria. We hope to connect travelers soon!' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪', message: 'We are not yet active in Yemen, but travel connections are changing!' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', message: 'Kuwait is not yet part of our network, but we are expanding!' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', message: 'Qatar is coming soon to our community. Check back later!' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', message: 'Bahrain is not yet in our network, but growing fast!' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', message: 'Oman is not yet connected, but we are working on it!' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲', message: 'We are not yet active in Central Asia. Stay tuned!' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', message: 'Uzbekistan community is growing! Check back soon.' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', message: 'Kazakhstan is not yet in our network. We hope to connect soon!' },
]

const LANGUAGE_FLAGS: { [key: string]: string } = {
  'English': '🇬🇧', 'Spanish': '🇪🇸', 'French': '🇫🇷', 'German': '🇩🇪', 'Portuguese': '🇵🇹',
  'Italian': '🇮🇹', 'Japanese': '🇯🇵', 'Chinese': '🇨🇳', 'Korean': '🇰🇷', 'Arabic': '🇸🇦',
  'Russian': '🇷🇺', 'Dutch': '🇳🇱', 'Swedish': '🇸🇪', 'Norwegian': '🇳🇴', 'Danish': '🇩🇰',
  'Finnish': '🇫🇮', 'Polish': '🇵🇱', 'Greek': '🇬🇷', 'Turkish': '🇹🇷', 'Thai': '🇹🇭',
  'Vietnamese': '🇻🇳', 'Indonesian': '🇮🇩', 'Malay': '🇲🇾', 'Hindi': '🇮🇳', 'Hebrew': '🇮🇱',
  'Hungarian': '🇭🇺', 'Czech': '🇨🇿', 'Romanian': '🇷🇴', 'Croatian': '🇭🇷', 'Catalan': '🏴',
}

const ALL_INTERESTS = ['Surfing', 'Hiking', 'Photography', 'Music', 'Cooking', 'Art', 'Wine', 'Beer', 'Nightlife', 'Beach', 'Yoga', 'Meditation', 'History', 'Architecture', 'Cycling', 'Skiing', 'Wildlife', 'Photography', 'Design', 'Fashion', 'Literature', 'Football', 'Cinema', 'Theatre', 'Dance', 'Salsa', 'Tango', 'Jazz', 'Craft Beer', 'Coffee', 'Street Food', 'Markets', 'Temples', 'Museums', 'Gardens', 'Hot Springs', 'Northern Lights', 'Safari', 'Kayaking', 'Sailing', 'Fishing', 'Golf', 'Tennis', 'Running', 'Climbing']

const generateLastActiveDate = (lastActive: string): Date => {
  const now = new Date()
  if (lastActive.includes('now')) return now
  if (lastActive.includes('hour')) {
    const hours = parseInt(lastActive) || 1
    return new Date(now.getTime() - hours * 60 * 60 * 1000)
  }
  if (lastActive.includes('day')) {
    const days = parseInt(lastActive) || 1
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  }
  if (lastActive.includes('week')) {
    const weeks = parseInt(lastActive) || 1
    return new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000)
  }
  return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
}

const SAMPLE_HOSTS: Host[] = [
  { id: 1, name: 'Sofia M.', city: 'Lisbon', country: 'Portugal', flag: '🇵🇹', age: 28, gender: 'Female', languages: ['Portuguese', 'English', 'Spanish'], languageFlags: ['🇵🇹', '🇬🇧', '🇪🇸'], responseRate: 98, responseTime: 'within an hour', reviews: 47, rating: 4.9, hosting: 52, surfing: 12, references: 34, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Digital nomad who loves hosting travelers from around the world!', interests: ['Surfing', 'Photography', 'Music', 'Cooking'], couchType: 'Private Room', maxGuests: 2, location: 'Alfama District', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 156, memberSince: '2019', about: 'I love sharing stories over coffee and showing guests the hidden gems of Lisbon. My apartment is in the heart of Alfama with amazing views!', whatIOffer: 'City tours, local recommendations, Portuguese lessons', parking: false, wifi: true, ac: true, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Europe' },
  { id: 2, name: 'Marco R.', city: 'Barcelona', country: 'Spain', flag: '🇪🇸', age: 34, gender: 'Male', languages: ['Spanish', 'Catalan', 'English', 'Italian'], languageFlags: ['🇪🇸', '🏴', '🇬🇧', '🇮🇹'], responseRate: 95, responseTime: 'within a few hours', reviews: 89, rating: 4.8, hosting: 124, surfing: 8, references: 67, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Architect by day, musician by night. Born and raised in Barcelona!', interests: ['Architecture', 'Music', 'Beach Life', 'Tapas'], couchType: 'Couch', maxGuests: 2, location: 'Gràcia', lastActive: '2 hours ago', lastActiveDate: generateLastActiveDate('2 hours ago'), responseCount: 234, memberSince: '2017', about: 'I have a spare couch in my spacious apartment in the trendy Gràcia neighborhood. Perfect for exploring Barcelona!', whatIOffer: 'Walking tours, concert recommendations, local bars', parking: true, wifi: true, ac: true, laundry: true, breakfast: false, smoking: true, pets: true, region: 'Europe' },
  { id: 3, name: 'Emma L.', city: 'Paris', country: 'France', flag: '🇫🇷', age: 26, gender: 'Female', languages: ['French', 'English', 'German'], languageFlags: ['🇫🇷', '🇬🇧', '🇩🇪'], responseRate: 99, responseTime: 'within an hour', reviews: 67, rating: 4.95, hosting: 78, surfing: 23, references: 45, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Fashion designer with a passion for travel and meeting new people.', interests: ['Fashion', 'Art', 'Wine', 'Cooking'], couchType: 'Private Room', maxGuests: 1, location: 'Le Marais', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 189, memberSince: '2020', about: 'My apartment is in the beautiful Le Marais district, close to all major attractions. I love hosting and sharing French culture!', whatIOffer: 'Fashion tips, art gallery tours, wine tasting', parking: false, wifi: true, ac: false, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Europe' },
  { id: 4, name: 'Lars K.', city: 'Berlin', country: 'Germany', flag: '🇩🇪', age: 31, gender: 'Male', languages: ['German', 'English', 'Dutch'], languageFlags: ['🇩🇪', '🇬🇧', '🇳🇱'], responseRate: 92, responseTime: 'within a day', reviews: 34, rating: 4.7, hosting: 45, surfing: 15, references: 28, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Tech entrepreneur who loves the Berlin startup scene and nightlife.', interests: ['Tech', 'Nightlife', 'Cycling', 'Beer'], couchType: 'Shared Room', maxGuests: 3, location: 'Kreuzberg', lastActive: '30 minutes ago', lastActiveDate: generateLastActiveDate('30 minutes ago'), responseCount: 98, memberSince: '2021', about: 'My place is super central in Kreuzberg. Great for experiencing Berlin like a local!', whatIOffer: 'Startup scene tours, club recommendations, bike rentals', parking: true, wifi: true, ac: false, laundry: true, breakfast: false, smoking: true, pets: false, region: 'Europe' },
  { id: 5, name: 'Giulia T.', city: 'Rome', country: 'Italy', flag: '🇮🇹', age: 29, gender: 'Female', languages: ['Italian', 'English', 'French'], languageFlags: ['🇮🇹', '🇬🇧', '🇫🇷'], responseRate: 97, responseTime: 'within an hour', reviews: 56, rating: 4.85, hosting: 67, surfing: 9, references: 41, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'History teacher who loves sharing Roman secrets with travelers!', interests: ['History', 'Art', 'Cooking', 'Walking'], couchType: 'Private Room', maxGuests: 2, location: 'Trastevere', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 145, memberSince: '2018', about: 'My apartment is in charming Trastevere. Ill show you the real Rome beyond the tourist spots!', whatIOffer: 'Historical tours, food tours, pasta making class', parking: false, wifi: true, ac: true, laundry: true, breakfast: true, smoking: false, pets: true, region: 'Europe' },
  { id: 6, name: 'Yuki T.', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', age: 27, gender: 'Female', languages: ['Japanese', 'English'], languageFlags: ['🇯🇵', '🇬🇧'], responseRate: 94, responseTime: 'within a few hours', reviews: 78, rating: 4.92, hosting: 89, surfing: 4, references: 52, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Graphic designer obsessed with ramen, anime, and Japanese traditions.', interests: ['Ramen', 'Anime', 'Traditional Arts', 'Pop Culture'], couchType: 'Private Room', maxGuests: 2, location: 'Shibuya', lastActive: '1 hour ago', lastActiveDate: generateLastActiveDate('1 hour ago'), responseCount: 178, memberSince: '2019', about: 'My modern apartment is in the heart of Shibuya. Perfect base for exploring Tokyo!', whatIOffer: 'Ramen tour, anime spots, hidden temples', parking: false, wifi: true, ac: true, laundry: true, breakfast: false, smoking: false, pets: false, region: 'Asia' },
  { id: 7, name: 'Ana P.', city: 'Rio de Janeiro', country: 'Brazil', flag: '🇧🇷', age: 25, gender: 'Female', languages: ['Portuguese', 'English', 'Spanish'], languageFlags: ['🇧🇷', '🇬🇧', '🇪🇸'], responseRate: 96, responseTime: 'within an hour', reviews: 41, rating: 4.88, hosting: 56, surfing: 18, references: 33, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Beach lover and dancer who cant stop smiling!', interests: ['Samba', 'Beach', 'Soccer', 'Caipirinha'], couchType: 'Couch', maxGuests: 2, location: 'Copacabana', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 123, memberSince: '2020', about: 'My place is 2 blocks from Copacabana beach! Lets dance samba together!', whatIOffer: 'Beach tours, samba lessons, soccer games', parking: false, wifi: true, ac: true, laundry: true, breakfast: true, smoking: true, pets: false, region: 'Americas' },
  { id: 8, name: 'Carlos M.', city: 'Mexico City', country: 'Mexico', flag: '🇲🇽', age: 33, gender: 'Male', languages: ['Spanish', 'English'], languageFlags: ['🇲🇽', '🇬🇧'], responseRate: 91, responseTime: 'within a day', reviews: 29, rating: 4.75, hosting: 38, surfing: 11, references: 24, acceptingGuests: true, verificationLevel: 'phone', verified: true, plusVerified: false, bio: 'Chef specializing in authentic Mexican cuisine. Food is my love language!', interests: ['Cooking', 'Street Food', 'Art', 'Football'], couchType: 'Private Room', maxGuests: 3, location: 'Coyoacán', lastActive: '3 hours ago', lastActiveDate: generateLastActiveDate('3 hours ago'), responseCount: 89, memberSince: '2018', about: 'I cook the best tacos in Coyoacán! My place is colorful and full of art.', whatIOffer: 'Cooking classes, street food tours, mezcal tasting', parking: true, wifi: true, ac: true, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Americas' },
  { id: 9, name: 'Nina W.', city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', age: 30, gender: 'Female', languages: ['Dutch', 'English', 'German', 'French'], languageFlags: ['🇳🇱', '🇬🇧', '🇩🇪', '🇫🇷'], responseRate: 98, responseTime: 'within an hour', reviews: 62, rating: 4.91, hosting: 73, surfing: 6, references: 48, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Cycling enthusiast and museum lover. Amsterdam is my playground!', interests: ['Cycling', 'Museums', 'Art', 'Tulips'], couchType: 'Private Room', maxGuests: 2, location: 'Jordaan', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 156, memberSince: '2017', about: 'My canal house in Jordaan is cozy and perfectly located. Lets bike through the city!', whatIOffer: 'Bike tours, museum passes, cheese tasting', parking: false, wifi: true, ac: false, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Europe' },
  { id: 10, name: 'James O.', city: 'London', country: 'United Kingdom', flag: '🇬🇧', age: 36, gender: 'Male', languages: ['English'], languageFlags: ['🇬🇧'], responseRate: 93, responseTime: 'within a few hours', reviews: 45, rating: 4.78, hosting: 58, surfing: 7, references: 36, acceptingGuests: false, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Theatre director with a passion for British humor and pub culture.', interests: ['Theatre', 'Football', 'Pubs', 'History'], couchType: 'Couch', maxGuests: 2, location: 'Shoreditch', lastActive: '2 hours ago', lastActiveDate: generateLastActiveDate('2 hours ago'), responseCount: 112, memberSince: '2019', about: 'My place in Shoreditch is perfect for exploring Londons nightlife!', whatIOffer: 'West End tours, pub crawls, theatre tickets', parking: false, wifi: true, ac: false, laundry: true, breakfast: false, smoking: true, pets: false, region: 'Europe' },
  { id: 11, name: 'Kim J.', city: 'Seoul', country: 'South Korea', flag: '🇰🇷', age: 28, gender: 'Female', languages: ['Korean', 'English', 'Japanese'], languageFlags: ['🇰🇷', '🇬🇧', '🇯🇵'], responseRate: 96, responseTime: 'within an hour', reviews: 53, rating: 4.89, hosting: 64, surfing: 14, references: 42, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'K-pop fan and foodie exploring Seouls incredible food scene!', interests: ['K-Pop', 'K-Food', 'K-Drama', 'Shopping'], couchType: 'Private Room', maxGuests: 2, location: 'Hongdae', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 134, memberSince: '2020', about: 'My apartment is in Hongdae, perfect for experiencing Seouls youth culture!', whatIOffer: 'K-pop tours, BBQ experiences, market visits', parking: false, wifi: true, ac: true, laundry: true, breakfast: false, smoking: false, pets: false, region: 'Asia' },
  { id: 12, name: 'Maria S.', city: 'Athens', country: 'Greece', flag: '🇬🇷', age: 32, gender: 'Female', languages: ['Greek', 'English', 'French'], languageFlags: ['🇬🇷', '🇬🇧', '🇫🇷'], responseRate: 95, responseTime: 'within a few hours', reviews: 38, rating: 4.82, hosting: 47, surfing: 8, references: 31, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Archaeologist who loves sharing ancient Greek history with visitors!', interests: ['History', 'Archaeology', 'Meditation', 'Olive Oil'], couchType: 'Private Room', maxGuests: 2, location: 'Plaka', lastActive: '45 minutes ago', lastActiveDate: generateLastActiveDate('45 minutes ago'), responseCount: 98, memberSince: '2018', about: 'My home in Plaka has Acropolis views! Lets explore ancient Athens together.', whatIOffer: 'Historical tours, sunset spots, local tavernas', parking: false, wifi: true, ac: true, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Europe' },
  { id: 13, name: 'Priya S.', city: 'Goa', country: 'India', flag: '🇮🇳', age: 27, gender: 'Female', languages: ['Hindi', 'English', 'Konkani'], languageFlags: ['🇮🇳', '🇬🇧', '🏴'], responseRate: 94, responseTime: 'within a day', reviews: 29, rating: 4.76, hosting: 34, surfing: 12, references: 22, acceptingGuests: true, verificationLevel: 'phone', verified: true, plusVerified: false, bio: 'Yoga instructor by the beach. Peace, love, and Chai!', interests: ['Yoga', 'Beach Life', 'Meditation', 'Indian Cuisine'], couchType: 'Private Room', maxGuests: 3, location: 'Anjuna', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 78, memberSince: '2021', about: 'My beachside home is perfect for relaxation and yoga retreats!', whatIOffer: 'Yoga sessions, beach tours, spice markets', parking: true, wifi: true, ac: true, laundry: true, breakfast: true, smoking: true, pets: true, region: 'Asia' },
  { id: 14, name: 'Max B.', city: 'Prague', country: 'Czech Republic', flag: '🇨🇿', age: 29, gender: 'Male', languages: ['Czech', 'English', 'German'], languageFlags: ['🇨🇿', '🇬🇧', '🇩🇪'], responseRate: 90, responseTime: 'within a day', reviews: 31, rating: 4.71, hosting: 41, surfing: 9, references: 26, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Craft beer brewer who knows all the best pubs in Prague!', interests: ['Beer', 'History', 'Music', 'Chess'], couchType: 'Couch', maxGuests: 2, location: 'Vinohrady', lastActive: '3 hours ago', lastActiveDate: generateLastActiveDate('3 hours ago'), responseCount: 87, memberSince: '2019', about: 'My apartment is in trendy Vinohrady. Lets explore Pragues beer scene!', whatIOffer: 'Pub tours, brewery visits, jazz clubs', parking: false, wifi: true, ac: false, laundry: true, breakfast: false, smoking: true, pets: false, region: 'Europe' },
  { id: 15, name: 'Sarah K.', city: 'Sydney', country: 'Australia', flag: '🇦🇺', age: 31, gender: 'Female', languages: ['English'], languageFlags: ['🇦🇺'], responseRate: 97, responseTime: 'within an hour', reviews: 54, rating: 4.87, hosting: 62, surfing: 5, references: 39, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Surf instructor and beach lover. Australian sun is my energy!', interests: ['Surfing', 'Beach', 'Hiking', 'Barbecue'], couchType: 'Private Room', maxGuests: 2, location: 'Bondi', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 145, memberSince: '2018', about: 'Wake up to Bondi views! Ill teach you to surf if you want!', whatIOffer: 'Surf lessons, coastal walks, BBQ nights', parking: false, wifi: true, ac: true, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Oceania' },
  { id: 16, name: 'Tom H.', city: 'New York', country: 'United States', flag: '🇺🇸', age: 35, gender: 'Male', languages: ['English', 'Spanish'], languageFlags: ['🇺🇸', '🇪🇸'], responseRate: 88, responseTime: 'within a day', reviews: 41, rating: 4.69, hosting: 56, surfing: 3, references: 32, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Broadway producer who loves showing travelers the best of NYC!', interests: ['Broadway', 'Jazz', 'Food', 'Art'], couchType: 'Couch', maxGuests: 2, location: 'Brooklyn', lastActive: '1 hour ago', lastActiveDate: generateLastActiveDate('1 hour ago'), responseCount: 112, memberSince: '2017', about: 'My Brooklyn apartment is the perfect NYC base. Lets catch a show!', whatIOffer: 'Broadway tickets, jazz clubs, pizza tours', parking: false, wifi: true, ac: true, laundry: true, breakfast: false, smoking: false, pets: false, region: 'Americas' },
  { id: 17, name: 'Wayan B.', city: 'Bali', country: 'Indonesia', flag: '🇮🇩', age: 26, gender: 'Male', languages: ['Indonesian', 'English', 'Balinese'], languageFlags: ['🇮🇩', '🇬🇧', '🏴'], responseRate: 99, responseTime: 'within an hour', reviews: 89, rating: 4.96, hosting: 112, surfing: 0, references: 67, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Traditional healer and musician. Balinese culture is my life!', interests: ['Traditional Arts', 'Temple Ceremonies', 'Rice Fields', 'Music'], couchType: 'Private Room', maxGuests: 4, location: 'Ubud', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 234, memberSince: '2016', about: 'My traditional Balinese home is surrounded by rice fields. Experience authentic Bali!', whatIOffer: 'Temple tours, traditional ceremonies, cooking classes', parking: true, wifi: true, ac: false, laundry: true, breakfast: true, smoking: true, pets: false, region: 'Asia' },
  { id: 18, name: 'Sven L.', city: 'Stockholm', country: 'Sweden', flag: '🇸🇪', age: 33, gender: 'Male', languages: ['Swedish', 'English', 'Norwegian'], languageFlags: ['🇸🇪', '🇬🇧', '🇳🇴'], responseRate: 93, responseTime: 'within a few hours', reviews: 36, rating: 4.74, hosting: 44, surfing: 6, references: 29, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Furniture designer who appreciates Nordic simplicity and fika!', interests: ['Design', 'Fika', 'Archipelago', 'Hockey'], couchType: 'Private Room', maxGuests: 2, location: 'Södermalm', lastActive: '2 hours ago', lastActiveDate: generateLastActiveDate('2 hours ago'), responseCount: 98, memberSince: '2019', about: 'My Södermalm apartment is cozy and full of Swedish design. Fika every morning!', whatIOffer: 'Archipelago tours, design walks, fika sessions', parking: false, wifi: true, ac: false, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Europe' },
  { id: 19, name: 'Chen W.', city: 'Taipei', country: 'Taiwan', flag: '🇹🇼', age: 28, gender: 'Female', languages: ['Mandarin', 'Taiwanese', 'English', 'Japanese'], languageFlags: ['🇹🇼', '🇨🇳', '🇬🇧', '🇯🇵'], responseRate: 96, responseTime: 'within an hour', reviews: 47, rating: 4.88, hosting: 58, surfing: 11, references: 38, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Night market food expert and bubble tea connoisseur!', interests: ['Night Markets', 'Bubble Tea', 'Temples', 'Cycling'], couchType: 'Private Room', maxGuests: 2, location: 'Ximending', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 134, memberSince: '2020', about: 'My apartment is in the heart of Ximending. Night markets are my backyard!', whatIOffer: 'Night market tours, temple visits, hot springs', parking: false, wifi: true, ac: true, laundry: true, breakfast: false, smoking: false, pets: false, region: 'Asia' },
  { id: 20, name: 'Fatima A.', city: 'Istanbul', country: 'Turkey', flag: '🇹🇷', age: 30, gender: 'Female', languages: ['Turkish', 'English', 'Arabic'], languageFlags: ['🇹🇷', '🇬🇧', '🇸🇦'], responseRate: 95, responseTime: 'within a few hours', reviews: 43, rating: 4.84, hosting: 52, surfing: 8, references: 35, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Spice merchant and historian. Istanbul is where worlds meet!', interests: ['Spice Markets', 'History', 'Turkish Bath', 'Calligraphy'], couchType: 'Private Room', maxGuests: 3, location: 'Sultanahmet', lastActive: '30 minutes ago', lastActiveDate: generateLastActiveDate('30 minutes ago'), responseCount: 123, memberSince: '2018', about: 'My Ottoman-style apartment is steps from the Blue Mosque. Welcome to Istanbul!', whatIOffer: 'Spice tours, hamam experiences, Bosphorus cruises', parking: false, wifi: true, ac: true, laundry: true, breakfast: true, smoking: true, pets: false, region: 'Middle East' },
  { id: 21, name: 'Pedro S.', city: 'Buenos Aires', country: 'Argentina', flag: '🇦🇷', age: 29, gender: 'Male', languages: ['Spanish', 'English', 'Portuguese'], languageFlags: ['🇦🇷', '🇬🇧', '🇵🇹'], responseRate: 94, responseTime: 'within an hour', reviews: 38, rating: 4.79, hosting: 49, surfing: 13, references: 31, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Tango dancer who never stops moving. Passion is my middle name!', interests: ['Tango', 'Asado', 'Football', 'Wine'], couchType: 'Couch', maxGuests: 3, location: 'San Telmo', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 112, memberSince: '2019', about: 'My place in San Telmo is perfect for tango enthusiasts! Lets dance!', whatIOffer: 'Tango shows, asado nights, football matches', parking: false, wifi: true, ac: true, laundry: true, breakfast: false, smoking: true, pets: false, region: 'Americas' },
  { id: 22, name: 'Lee M.', city: 'Vancouver', country: 'Canada', flag: '🇨🇦', age: 32, gender: 'Male', languages: ['English', 'French', 'Mandarin'], languageFlags: ['🇨🇦', '🇫🇷', '🇨🇳'], responseRate: 92, responseTime: 'within a day', reviews: 34, rating: 4.73, hosting: 42, surfing: 7, references: 28, acceptingGuests: true, verificationLevel: 'phone', verified: true, plusVerified: false, bio: 'Mountain lover and craft beer enthusiast in the Pacific Northwest!', interests: ['Hiking', 'Skiing', 'Craft Beer', 'Kayaking'], couchType: 'Private Room', maxGuests: 2, location: 'Gastown', lastActive: '4 hours ago', lastActiveDate: generateLastActiveDate('4 hours ago'), responseCount: 89, memberSince: '2018', about: 'My apartment is in historic Gastown. Mountains and ocean at your doorstep!', whatIOffer: 'Hiking tours, brewery passes, ski trips', parking: true, wifi: true, ac: false, laundry: true, breakfast: true, smoking: false, pets: true, region: 'Americas' },
  { id: 23, name: 'Aisha K.', city: 'Cape Town', country: 'South Africa', flag: '🇿🇦', age: 27, gender: 'Female', languages: ['English', 'Afrikaans', 'Xhosa'], languageFlags: ['🇿🇦', '🏴', '🇿🇦'], responseRate: 97, responseTime: 'within an hour', reviews: 41, rating: 4.86, hosting: 53, surfing: 16, references: 34, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Wildlife photographer who knows all the hidden gems of the Cape!', interests: ['Wildlife', 'Photography', 'Wine', 'Hiking'], couchType: 'Private Room', maxGuests: 2, location: 'Gardens', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 127, memberSince: '2020', about: 'My home has stunning Table Mountain views. Safari adventures await!', whatIOffer: 'Safari trips, wine tours, photography outings', parking: true, wifi: true, ac: true, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Africa' },
  { id: 24, name: 'Noah van B.', city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', age: 34, gender: 'Male', languages: ['Dutch', 'English'], languageFlags: ['🇳🇱', '🇬🇧'], responseRate: 91, responseTime: 'within a few hours', reviews: 28, rating: 4.68, hosting: 35, surfing: 4, references: 22, acceptingGuests: true, verificationLevel: 'phone', verified: true, plusVerified: false, bio: 'Canal boat captain and marijuana guide in the Amsterdam scene!', interests: ['Canals', 'Cannabis Culture', 'Art', 'Cycling'], couchType: 'Couch', maxGuests: 2, location: 'Nieuwmarkt', lastActive: '2 hours ago', lastActiveDate: generateLastActiveDate('2 hours ago'), responseCount: 78, memberSince: '2019', about: 'Sleep on my boat! Experience Amsterdam from the water!', whatIOffer: 'Canal tours, coffee shop guidance, art museums', parking: false, wifi: true, ac: false, laundry: false, breakfast: false, smoking: true, pets: false, region: 'Europe' },
  { id: 25, name: 'Isabella R.', city: 'Marrakech', country: 'Morocco', flag: '🇲🇦', age: 29, gender: 'Female', languages: ['Arabic', 'French', 'English', 'Spanish'], languageFlags: ['🇲🇦', '🇫🇷', '🇬🇧', '🇪🇸'], responseRate: 98, responseTime: 'within an hour', reviews: 67, rating: 4.93, hosting: 78, surfing: 9, references: 52, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Riad owner and cooking enthusiast. Moroccan hospitality is my tradition!', interests: ['Cooking', 'Markets', 'Architecture', 'Hammam'], couchType: 'Private Room', maxGuests: 4, location: 'Medina', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 189, memberSince: '2017', about: 'My traditional riad in the heart of the Medina. An authentic Moroccan experience!', whatIOffer: 'Cooking classes, market tours, hammam visits', parking: false, wifi: true, ac: false, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Africa' },
  { id: 26, name: 'Andres M.', city: 'Medellín', country: 'Colombia', flag: '🇨🇴', age: 31, gender: 'Male', languages: ['Spanish', 'English'], languageFlags: ['🇨🇴', '🇬🇧'], responseRate: 96, responseTime: 'within an hour', reviews: 52, rating: 4.87, hosting: 64, surfing: 18, references: 43, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Coffee farmer and salsa lover. Paisa warmth is contagious!', interests: ['Coffee', 'Salsa', 'Nature', 'Arepas'], couchType: 'Private Room', maxGuests: 3, location: 'El Poblado', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 156, memberSince: '2019', about: 'My place in El Poblado is perfect for exploring the city of eternal spring!', whatIOffer: 'Coffee tours, salsa lessons, nature hikes', parking: true, wifi: true, ac: true, laundry: true, breakfast: true, smoking: true, pets: false, region: 'Americas' },
  { id: 27, name: 'Hana S.', city: 'Dubrovnik', country: 'Croatia', flag: '🇭🇷', age: 26, gender: 'Female', languages: ['Croatian', 'English', 'Italian'], languageFlags: ['🇭🇷', '🇬🇧', '🇮🇹'], responseRate: 95, responseTime: 'within a few hours', reviews: 39, rating: 4.81, hosting: 47, surfing: 11, references: 32, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Sailing instructor and Game of Thrones locations guide!', interests: ['Sailing', 'History', 'Islands', 'Seafood'], couchType: 'Private Room', maxGuests: 2, location: 'Old Town', lastActive: '1 hour ago', lastActiveDate: generateLastActiveDate('1 hour ago'), responseCount: 112, memberSince: '2020', about: 'My apartment overlooks the old city walls. Perfect Game of Thrones location!', whatIOffer: 'Island hopping, sailing trips, seafood tours', parking: false, wifi: true, ac: true, laundry: true, breakfast: false, smoking: false, pets: false, region: 'Europe' },
  { id: 28, name: 'Kenji A.', city: 'Kyoto', country: 'Japan', flag: '🇯🇵', age: 38, gender: 'Male', languages: ['Japanese', 'English'], languageFlags: ['🇯🇵', '🇬🇧'], responseRate: 93, responseTime: 'within a day', reviews: 61, rating: 4.9, hosting: 78, surfing: 2, references: 48, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Tea ceremony master and temple guide. Tradition is my life!', interests: ['Tea Ceremony', 'Temples', 'Gardens', 'Calligraphy'], couchType: 'Private Room', maxGuests: 2, location: 'Higashiyama', lastActive: '3 hours ago', lastActiveDate: generateLastActiveDate('3 hours ago'), responseCount: 167, memberSince: '2016', about: 'My machiya is in historic Higashiyama. Experience authentic Kyoto!', whatIOffer: 'Tea ceremonies, temple tours, kimono rentals', parking: false, wifi: true, ac: false, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Asia' },
  { id: 29, name: 'Valentina R.', city: 'Buenos Aires', country: 'Argentina', flag: '🇦🇷', age: 25, gender: 'Female', languages: ['Spanish', 'English', 'Italian'], languageFlags: ['🇦🇷', '🇬🇧', '🇮🇹'], responseRate: 97, responseTime: 'within an hour', reviews: 34, rating: 4.83, hosting: 41, surfing: 15, references: 28, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Art student who loves exploring BA street art and creative scenes!', interests: ['Street Art', 'Galleries', 'Cafe Culture', 'Football'], couchType: 'Couch', maxGuests: 2, location: 'Palermo', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 98, memberSince: '2021', about: 'My Palermo loft is surrounded by cafes and street art. BA creative hub!', whatIOffer: 'Street art tours, gallery visits, football matches', parking: false, wifi: true, ac: true, laundry: true, breakfast: false, smoking: true, pets: false, region: 'Americas' },
  { id: 30, name: 'Pavel K.', city: 'Prague', country: 'Czech Republic', flag: '🇨🇿', age: 27, gender: 'Male', languages: ['Czech', 'English', 'Slovak'], languageFlags: ['🇨🇿', '🇬🇧', '🇸🇰'], responseRate: 94, responseTime: 'within a few hours', reviews: 26, rating: 4.72, hosting: 33, surfing: 8, references: 21, acceptingGuests: true, verificationLevel: 'phone', verified: true, plusVerified: false, bio: 'Jazz musician who plays at the best Prague jazz clubs!', interests: ['Jazz', 'Beer', 'Medieval History', 'Board Games'], couchType: 'Couch', maxGuests: 2, location: 'Malá Strana', lastActive: '2 hours ago', lastActiveDate: generateLastActiveDate('2 hours ago'), responseCount: 76, memberSince: '2020', about: 'My place near the Charles Bridge has jazz in its veins!', whatIOffer: 'Jazz club tours, beer halls, castle visits', parking: false, wifi: true, ac: false, laundry: true, breakfast: false, smoking: true, pets: false, region: 'Europe' },
  { id: 31, name: 'Mia F.', city: 'Copenhagen', country: 'Denmark', flag: '🇩🇰', age: 29, gender: 'Female', languages: ['Danish', 'English', 'Swedish'], languageFlags: ['🇩🇰', '🇬🇧', '🇸🇪'], responseRate: 96, responseTime: 'within an hour', reviews: 44, rating: 4.85, hosting: 52, surfing: 7, references: 36, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Bicycle tour guide and hygge enthusiast. Danish coziness is real!', interests: ['Cycling', 'Hygge', 'Design', 'Nordic Cuisine'], couchType: 'Private Room', maxGuests: 2, location: 'Nørrebro', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 123, memberSince: '2019', about: 'My Nørrebro apartment is perfectly located for exploring Copenhagen by bike!', whatIOffer: 'Bike tours, hygge sessions, food markets', parking: false, wifi: true, ac: false, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Europe' },
  { id: 32, name: 'Bruno S.', city: 'Lisbon', country: 'Portugal', flag: '🇵🇹', age: 33, gender: 'Male', languages: ['Portuguese', 'English', 'Spanish', 'French'], languageFlags: ['🇵🇹', '🇬🇧', '🇪🇸', '🇫🇷'], responseRate: 95, responseTime: 'within a few hours', reviews: 51, rating: 4.82, hosting: 63, surfing: 5, references: 42, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Fado musician and Lisbon expert. This city is my passion!', interests: ['Fado', 'Pastéis de Nata', 'Sailing', 'History'], couchType: 'Private Room', maxGuests: 2, location: 'Bairro Alto', lastActive: '1 hour ago', lastActiveDate: generateLastActiveDate('1 hour ago'), responseCount: 145, memberSince: '2018', about: 'My Bairro Alto home is where fado echoes and sunsets are magic!', whatIOffer: 'Fado nights, sailing trips, pastéis tours', parking: false, wifi: true, ac: true, laundry: true, breakfast: true, smoking: true, pets: false, region: 'Europe' },
  { id: 33, name: 'Zara H.', city: 'Dublin', country: 'Ireland', flag: '🇮🇪', age: 30, gender: 'Female', languages: ['English', 'Irish'], languageFlags: ['🇮🇪', '🇬🇧'], responseRate: 98, responseTime: 'within an hour', reviews: 58, rating: 4.9, hosting: 71, surfing: 9, references: 47, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Writer and pub enthusiast. Irish craic is the best!', interests: ['Literature', 'Pub Culture', 'Traditional Music', 'Guinness'], couchType: 'Private Room', maxGuests: 2, location: 'Temple Bar', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 167, memberSince: '2017', about: 'My Temple Bar apartment is in the heart of Dublin nightlife!', whatIOffer: 'Pub crawls, literary tours, trad sessions', parking: false, wifi: true, ac: false, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Europe' },
  { id: 34, name: 'Ravi P.', city: 'Delhi', country: 'India', flag: '🇮🇳', age: 28, gender: 'Male', languages: ['Hindi', 'English', 'Punjabi'], languageFlags: ['🇮🇳', '🇬🇧', '🏴'], responseRate: 93, responseTime: 'within a day', reviews: 31, rating: 4.76, hosting: 39, surfing: 14, references: 25, acceptingGuests: true, verificationLevel: 'phone', verified: true, plusVerified: false, bio: 'Street food guide who knows every chaat corner of Delhi!', interests: ['Street Food', 'History', 'Cricket', 'Bollywood'], couchType: 'Private Room', maxGuests: 3, location: 'Hauz Khas', lastActive: '3 hours ago', lastActiveDate: generateLastActiveDate('3 hours ago'), responseCount: 89, memberSince: '2020', about: 'My Hauz Khas home is surrounded by cafes and history. Food adventures await!', whatIOffer: 'Food tours, historical walks, Bollywood experiences', parking: true, wifi: true, ac: true, laundry: true, breakfast: true, smoking: true, pets: false, region: 'Asia' },
  { id: 35, name: 'Sakura Y.', city: 'Osaka', country: 'Japan', flag: '🇯🇵', age: 26, gender: 'Female', languages: ['Japanese', 'English', 'Korean'], languageFlags: ['🇯🇵', '🇬🇧', '🇰🇷'], responseRate: 97, responseTime: 'within an hour', reviews: 48, rating: 4.88, hosting: 56, surfing: 6, references: 39, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Okonomiyaki chef and party guide. Osakas energy is unstoppable!', interests: ['Food', 'Nightlife', 'Comedy', 'Shopping'], couchType: 'Private Room', maxGuests: 2, location: 'Namba', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 134, memberSince: '2019', about: 'My Namba apartment is perfect for foodies and night owls!', whatIOffer: 'Okonomiyaki lessons, bar hopping, comedy shows', parking: false, wifi: true, ac: true, laundry: true, breakfast: false, smoking: false, pets: false, region: 'Asia' },
  { id: 36, name: 'Diego R.', city: 'Mexico City', country: 'Mexico', flag: '🇲🇽', age: 32, gender: 'Male', languages: ['Spanish', 'English'], languageFlags: ['🇲🇽', '🇬🇧'], responseRate: 92, responseTime: 'within a few hours', reviews: 37, rating: 4.77, hosting: 46, surfing: 10, references: 30, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Lucha libre wrestler and muralist. Mexican art is everywhere!', interests: ['Lucha Libre', 'Muralism', 'Mezcal', 'Mole'], couchType: 'Couch', maxGuests: 2, location: 'Coyoacán', lastActive: '2 hours ago', lastActiveDate: generateLastActiveDate('2 hours ago'), responseCount: 102, memberSince: '2019', about: 'My colorful Coyoacán place is full of art and lucha memorabilia!', whatIOffer: 'Lucha tickets, mural tours, mezcal tasting', parking: true, wifi: true, ac: true, laundry: true, breakfast: false, smoking: true, pets: true, region: 'Americas' },
  { id: 37, name: 'Elena P.', city: 'Budapest', country: 'Hungary', flag: '🇭🇺', age: 29, gender: 'Female', languages: ['Hungarian', 'English', 'German'], languageFlags: ['🇭🇺', '🇬🇧', '🇩🇪'], responseRate: 95, responseTime: 'within an hour', reviews: 43, rating: 4.84, hosting: 54, surfing: 12, references: 36, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Thermal bath expert and ruin bar explorer. Budapest is magical!', interests: ['Thermal Baths', 'Ruin Bars', 'Architecture', 'Wine'], couchType: 'Private Room', maxGuests: 2, location: 'District VII', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 127, memberSince: '2018', about: 'My District VII apartment is walking distance to all the ruin bars!', whatIOffer: 'Bath tours, ruin bar crawls, wine experiences', parking: false, wifi: true, ac: false, laundry: true, breakfast: true, smoking: true, pets: false, region: 'Europe' },
  { id: 38, name: 'Liam O.', city: 'Dublin', country: 'Ireland', flag: '🇮🇪', age: 35, gender: 'Male', languages: ['English', 'Irish Gaelic'], languageFlags: ['🇮🇪', '🏴'], responseRate: 90, responseTime: 'within a day', reviews: 29, rating: 4.71, hosting: 38, surfing: 4, references: 24, acceptingGuests: false, verificationLevel: 'phone', verified: true, plusVerified: false, bio: 'Traditional musician and whiskey connoisseur. Sláinte!', interests: ['Irish Music', 'Whiskey', 'GAA', 'Fishing'], couchType: 'Couch', maxGuests: 2, location: 'Rathmines', lastActive: '4 hours ago', lastActiveDate: generateLastActiveDate('4 hours ago'), responseCount: 78, memberSince: '2019', about: 'My home has trad sessions every Friday. Come for the craic!', whatIOffer: 'Whiskey distillery tours, trad sessions, match tickets', parking: true, wifi: true, ac: false, laundry: true, breakfast: false, smoking: true, pets: true, region: 'Europe' },
  { id: 39, name: 'Mei L.', city: 'Bangkok', country: 'Thailand', flag: '🇹🇭', age: 27, gender: 'Female', languages: ['Thai', 'English', 'Mandarin'], languageFlags: ['🇹🇭', '🇬🇧', '🇨🇳'], responseRate: 98, responseTime: 'within an hour', reviews: 62, rating: 4.91, hosting: 78, surfing: 8, references: 51, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Thai cooking instructor and temple enthusiast. Thai hospitality is unmatched!', interests: ['Thai Cooking', 'Temples', 'Markets', 'Massage'], couchType: 'Private Room', maxGuests: 2, location: 'Old Town', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 178, memberSince: '2018', about: 'My Old Town home is perfect for exploring Bangkoks history!', whatIOffer: 'Cooking classes, temple tours, market visits', parking: false, wifi: true, ac: true, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Asia' },
  { id: 40, name: 'Tomasz W.', city: 'Krakow', country: 'Poland', flag: '🇵🇱', age: 31, gender: 'Male', languages: ['Polish', 'English', 'German'], languageFlags: ['🇵🇱', '🇬🇧', '🇩🇪'], responseRate: 94, responseTime: 'within a few hours', reviews: 35, rating: 4.79, hosting: 44, surfing: 7, references: 29, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'History buff and pierogi master. Polish culture is fascinating!', interests: ['History', 'Pierogi', 'Communism', 'Mountains'], couchType: 'Private Room', maxGuests: 3, location: 'Kazimierz', lastActive: '2 hours ago', lastActiveDate: generateLastActiveDate('2 hours ago'), responseCount: 98, memberSince: '2020', about: 'My Kazimierz apartment is in the Jewish Quarter. History everywhere!', whatIOffer: 'Auschwitz tours, pierogi making, salt mines', parking: false, wifi: true, ac: false, laundry: true, breakfast: false, smoking: true, pets: false, region: 'Europe' },
  { id: 41, name: 'Jade T.', city: 'Auckland', country: 'New Zealand', flag: '🇳🇿', age: 28, gender: 'Female', languages: ['English', 'Māori'], languageFlags: ['🇳🇿', '🏴'], responseRate: 96, responseTime: 'within an hour', reviews: 39, rating: 4.83, hosting: 48, surfing: 10, references: 32, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Maori culture guide and nature lover. NZ is paradise!', interests: ['Maori Culture', 'Hiking', 'Wine', 'Beaches'], couchType: 'Private Room', maxGuests: 2, location: 'Ponsonby', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 112, memberSince: '2019', about: 'My Ponsonby home is perfect for exploring Auckland and beyond!', whatIOffer: 'Maori experiences, volcano hikes, wine tours', parking: true, wifi: true, ac: true, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Oceania' },
  { id: 42, name: 'Raj K.', city: 'Kathmandu', country: 'Nepal', flag: '🇳🇵', age: 29, gender: 'Male', languages: ['Nepali', 'English', 'Hindi'], languageFlags: ['🇳🇵', '🇬🇧', '🇮🇳'], responseRate: 97, responseTime: 'within an hour', reviews: 44, rating: 4.86, hosting: 56, surfing: 6, references: 37, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Trekking guide and Himalayan expert. Mountains are my home!', interests: ['Trekking', 'Buddhism', 'Mountain Life', 'Yoga'], couchType: 'Private Room', maxGuests: 3, location: 'Thamel', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 134, memberSince: '2018', about: 'My Thamel home is the perfect base for Himalayan adventures!', whatIOffer: 'Trek planning, temple tours, yoga sessions', parking: false, wifi: true, ac: false, laundry: true, breakfast: true, smoking: true, pets: false, region: 'Asia' },
  { id: 43, name: 'Clara M.', city: 'Hanoi', country: 'Vietnam', flag: '🇻🇳', age: 26, gender: 'Female', languages: ['Vietnamese', 'English', 'French'], languageFlags: ['🇻🇳', '🇬🇧', '🇫🇷'], responseRate: 98, responseTime: 'within an hour', reviews: 51, rating: 4.89, hosting: 63, surfing: 14, references: 42, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Pho master and cyclo rider. Hanoi street food is incredible!', interests: ['Street Food', 'Cyclo Tours', 'History', 'Coffee'], couchType: 'Private Room', maxGuests: 2, location: 'Old Quarter', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 156, memberSince: '2019', about: 'My Old Quarter home is surrounded by the best pho in Hanoi!', whatIOffer: 'Food tours, cyclo rides, coffee experiences', parking: false, wifi: true, ac: true, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Asia' },
  { id: 44, name: 'Omar H.', city: 'Tel Aviv', country: 'Israel', flag: '🇮🇱', age: 30, gender: 'Male', languages: ['Hebrew', 'English', 'Arabic'], languageFlags: ['🇮🇱', '🇬🇧', '🇸🇦'], responseRate: 94, responseTime: 'within a few hours', reviews: 36, rating: 4.78, hosting: 45, surfing: 8, references: 30, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Beach volleyball player and startup enthusiast. Tel Aviv never sleeps!', interests: ['Beach Life', 'Tech', 'Nightlife', 'History'], couchType: 'Couch', maxGuests: 2, location: 'Florentin', lastActive: '2 hours ago', lastActiveDate: generateLastActiveDate('2 hours ago'), responseCount: 102, memberSince: '2020', about: 'My Florentin apartment is in the heart of Tel Avivs creative scene!', whatIOffer: 'Beach days, startup tours, nightlife guides', parking: false, wifi: true, ac: true, laundry: true, breakfast: false, smoking: true, pets: false, region: 'Middle East' },
  { id: 45, name: 'Rosa G.', city: 'Cairo', country: 'Egypt', flag: '🇪🇬', age: 33, gender: 'Female', languages: ['Arabic', 'English', 'French'], languageFlags: ['🇪🇬', '🇬🇧', '🇫🇷'], responseRate: 93, responseTime: 'within a day', reviews: 28, rating: 4.74, hosting: 35, surfing: 5, references: 23, acceptingGuests: true, verificationLevel: 'phone', verified: true, plusVerified: false, bio: 'Archaeologist and pyramid expert. Egyptian history is fascinating!', interests: ['Archaeology', 'Ancient History', 'Nile Cruises', 'Spices'], couchType: 'Private Room', maxGuests: 3, location: 'Zamalek', lastActive: '3 hours ago', lastActiveDate: generateLastActiveDate('3 hours ago'), responseCount: 78, memberSince: '2019', about: 'My Zamalek apartment has views of the Nile. Pyramids await!', whatIOffer: 'Pyramid tours, Nile cruises, museum visits', parking: true, wifi: true, ac: true, laundry: true, breakfast: true, smoking: true, pets: false, region: 'Africa' },
  { id: 46, name: 'Henrik L.', city: 'Oslo', country: 'Norway', flag: '🇳🇴', age: 34, gender: 'Male', languages: ['Norwegian', 'English', 'Swedish'], languageFlags: ['🇳🇴', '🇬🇧', '🇸🇪'], responseRate: 91, responseTime: 'within a day', reviews: 24, rating: 4.69, hosting: 31, surfing: 3, references: 20, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Fjords photographer and outdoor adventurer. Norway is stunning!', interests: ['Fjords', 'Photography', 'Skiing', 'Northern Lights'], couchType: 'Private Room', maxGuests: 2, location: 'Grünerløkka', lastActive: '5 hours ago', lastActiveDate: generateLastActiveDate('5 hours ago'), responseCount: 67, memberSince: '2020', about: 'My Grünerløkka home is perfect for exploring Norwegian nature!', whatIOffer: 'Fjord trips, hiking guides, aurora hunting', parking: true, wifi: true, ac: false, laundry: true, breakfast: false, smoking: false, pets: false, region: 'Europe' },
  { id: 47, name: 'Lucia V.', city: 'Lima', country: 'Peru', flag: '🇵🇪', age: 28, gender: 'Female', languages: ['Spanish', 'English', 'Quechua'], languageFlags: ['🇵🇪', '🇬🇧', '🏴'], responseRate: 96, responseTime: 'within an hour', reviews: 41, rating: 4.85, hosting: 52, surfing: 11, references: 34, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Ceviche chef and Andean culture guide. Peruvian cuisine is world-class!', interests: ['Ceviche', 'Andean Culture', 'Machu Picchu', 'Textiles'], couchType: 'Private Room', maxGuests: 2, location: 'Miraflores', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 123, memberSince: '2019', about: 'My Miraflores apartment has ocean views. Peruvian food heaven!', whatIOffer: 'Cooking classes, market tours, Inca ruins', parking: false, wifi: true, ac: true, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Americas' },
  { id: 48, name: 'Bjorn S.', city: 'Reykjavik', country: 'Iceland', flag: '🇮🇸', age: 31, gender: 'Male', languages: ['Icelandic', 'English', 'Danish'], languageFlags: ['🇮🇸', '🇬🇧', '🇩🇰'], responseRate: 95, responseTime: 'within a few hours', reviews: 38, rating: 4.82, hosting: 47, surfing: 2, references: 31, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Northern lights hunter and hot spring lover. Iceland is magical!', interests: ['Northern Lights', 'Hot Springs', 'Glaciers', 'Vikings'], couchType: 'Private Room', maxGuests: 2, location: '101 Reykjavik', lastActive: '1 hour ago', lastActiveDate: generateLastActiveDate('1 hour ago'), responseCount: 108, memberSince: '2018', about: 'My downtown apartment is perfect for aurora hunting adventures!', whatIOffer: 'Northern lights tours, hot spring trips, glacier hikes', parking: true, wifi: true, ac: false, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Europe' },
  { id: 49, name: 'Yara M.', city: 'Belgrade', country: 'Serbia', flag: '🇷🇸', age: 27, gender: 'Female', languages: ['Serbian', 'English', 'Spanish'], languageFlags: ['🇷🇸', '🇬🇧', '🇪🇸'], responseRate: 97, responseTime: 'within an hour', reviews: 33, rating: 4.8, hosting: 41, surfing: 9, references: 27, acceptingGuests: true, verificationLevel: 'id', verified: true, plusVerified: false, bio: 'Nightclub promoter and rakija expert. Belgrade nightlife is legendary!', interests: ['Nightlife', 'Rakija', 'History', 'Football'], couchType: 'Couch', maxGuests: 3, location: 'Savamala', lastActive: 'Online now', lastActiveDate: generateLastActiveDate('Online now'), responseCount: 98, memberSince: '2020', about: 'My Savamala loft is in the heart of Belgrade nightlife!', whatIOffer: 'Club tours, rakija tasting, fortress visits', parking: false, wifi: true, ac: true, laundry: true, breakfast: false, smoking: true, pets: false, region: 'Europe' },
  { id: 50, name: 'Eva L.', city: 'Vienna', country: 'Austria', flag: '🇦🇹', age: 35, gender: 'Female', languages: ['German', 'English', 'Italian'], languageFlags: ['🇦🇹', '🇬🇧', '🇮🇹'], responseRate: 94, responseTime: 'within a few hours', reviews: 46, rating: 4.84, hosting: 57, surfing: 4, references: 38, acceptingGuests: true, verificationLevel: 'plus', verified: true, plusVerified: true, bio: 'Classical music expert and coffeehouse regular. Viennese elegance!', interests: ['Classical Music', 'Coffee Houses', 'Art History', 'Wine'], couchType: 'Private Room', maxGuests: 2, location: 'Innere Stadt', lastActive: '2 hours ago', lastActiveDate: generateLastActiveDate('2 hours ago'), responseCount: 134, memberSince: '2017', about: 'My Innere Stadt apartment is steps from the opera. Musical Vienna!', whatIOffer: 'Opera tickets, coffee house tours, art walks', parking: false, wifi: true, ac: false, laundry: true, breakfast: true, smoking: false, pets: false, region: 'Europe' },
]

const SAMPLE_REVIEWS: Review[] = [
  { id: 1, author: 'Traveler123', authorFlag: '🇺🇸', authorMemberSince: '2020', date: '2 weeks ago', rating: 5, text: 'Amazing host! The apartment was perfect and they showed me hidden gems only locals know about. Highly recommended!', type: 'couch' },
  { id: 2, author: 'NomadKate', authorFlag: '🇬🇧', authorMemberSince: '2019', date: '1 month ago', rating: 5, text: 'Best couch surfing experience ever! The cultural exchange was incredible. Made a friend for life.', type: 'hangout' },
  { id: 3, author: 'BackpackerMike', authorFlag: '🇨🇦', authorMemberSince: '2021', date: '3 months ago', rating: 4, text: 'Great stay, very clean and comfortable. The neighborhood is vibrant with lots of restaurants nearby.', type: 'couch' },
  { id: 4, author: 'SoloJane', authorFlag: '🇦🇺', authorMemberSince: '2018', date: '2 months ago', rating: 5, text: 'The breakfast was delicious and the conversation even better! Perfect introduction to the city.', type: 'couch' },
  { id: 5, author: 'WorldExplorer', authorFlag: '🇧🇷', authorMemberSince: '2017', date: '1 month ago', rating: 5, text: 'Exceptional hospitality. They picked me up from the station and even had a welcome snack ready!', type: 'reference' },
  { id: 6, author: 'GlobeTrotter', authorFlag: '🇩🇪', authorMemberSince: '2019', date: '3 weeks ago', rating: 4, text: 'Great experience overall. Very accommodating and friendly. Would definitely stay again!', type: 'couch' },
  { id: 7, author: 'AsianNomad', authorFlag: '🇯🇵', authorMemberSince: '2020', date: '1 month ago', rating: 5, text: 'Incredible cultural exchange. Learned so much about local traditions and food!', type: 'hangout' },
]

const SAFETY_TIPS = [
  { icon: '🔍', title: 'Research Your Host', desc: 'Read reviews carefully. Look for hosts with multiple positive reviews and references.' },
  { icon: '💬', title: 'Communicate First', desc: 'Exchange messages before confirming. Ask questions about their place, neighborhood, and house rules.' },
  { icon: '📍', title: 'Share Your Plans', desc: 'Tell a friend where youre staying. Share your hosts contact info and address.' },
  { icon: '🪪', title: 'Verify Identity', desc: 'Look for verified members with ID checks. Couchsurfing.com has verification badges.' },
  { icon: '🚨', title: 'Trust Your Gut', desc: 'If something feels off, dont go. Your safety is more important than being polite.' },
  { icon: '📱', title: 'Keep Phone Charged', desc: 'Have your phone charged and emergency numbers ready. Keep a power bank handy.' },
  { icon: '🍷', title: 'Moderate Alcohol', desc: 'Keep a clear mind, especially on the first meeting. Know your limits.' },
  { icon: '🔒', title: 'Secure Valuables', desc: 'Use hotel-style safes if available. Keep passport and money secure.' },
  { icon: '🤝', title: 'Meet in Public First', desc: 'For first-time meets, suggest a public place like a cafe before going to their place.' },
  { icon: '👩‍💼', title: 'Solo Female Tips', desc: 'For solo female travelers: Check reviews specifically from female travelers. Look for hosts with references from women.' },
]

const CS_TIPS = [
  { icon: '💌', title: 'Personalize Your Request', desc: 'Dont send generic copy-paste requests. Mention specific things you read in their profile.' },
  { icon: '🤗', title: 'Give More Than You Take', desc: 'Offer to cook, help with projects, or share something from your culture.' },
  { icon: '🌟', title: 'Leave a Review', desc: 'Write thoughtful reviews after your stay. It helps the whole community.' },
  { icon: '🎁', title: 'Bring a Small Gift', desc: 'Something from your country or a bottle of wine shows appreciation.' },
  { icon: '🙏', title: 'Be Grateful', desc: 'Send a thank you message after your stay. A small gesture means a lot.' },
  { icon: '🌍', title: 'Pay It Forward', desc: 'When you can, host others. The community grows when everyone participates.' },
  { icon: '🎭', title: 'Embrace Cultural Exchange', desc: 'Couch surfing is about connection, not just free accommodation.' },
  { icon: '⏰', title: 'Respect Their Time', desc: 'Ask about their schedule. Dont overstay or make them feel obligated.' },
  { icon: '✨', title: 'Keep Your Space Clean', desc: 'Treat their home like you would your own. Leave it cleaner than you found it.' },
  { icon: '📸', title: 'Share the Experience', desc: 'Post photos and stories. Help inspire others to couch surf.' },
]

const VERIFICATION_LEVELS = [
  { level: 'basic', label: 'Basic', icon: '✉️', color: GRAY, bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.3)', desc: 'Email verified only' },
  { level: 'phone', label: 'Phone', icon: '📱', color: C, bg: 'rgba(99,210,255,0.1)', border: 'rgba(99,210,255,0.3)', desc: 'Phone number verified' },
  { level: 'id', label: 'ID Verified', icon: '🪪', color: G, bg: 'rgba(255,183,77,0.1)', border: 'rgba(255,183,77,0.3)', desc: 'Government ID verified' },
  { level: 'plus', label: 'Plus Verified', icon: '⭐', color: PURPLE, bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.3)', desc: 'Premium trusted host' },
]

const REQUEST_TEMPLATES = [
  { id: 'weekend', label: 'Weekend Visit', emoji: '🛋️', template: (name: string, city: string) => `Hi ${name}!\n\nI'm planning a weekend trip to ${city} and I'd love to experience the city like a local. Your profile caught my attention because of your interests in [their interests].\n\nI'd be arriving on [date] and staying for about [nights] nights. I'm a clean, respectful guest and happy to help with cooking or chores.\n\nLooking forward to hearing from you!` },
  { id: 'passing', label: 'Passing Through', emoji: '✈️', template: (name: string, city: string) => `Hi ${name}!\n\nI'm just passing through ${city} and looking for a place to crash for the night. My flight/train is at [time] on [date].\n\nI promise to be quiet and out of your way! Just need somewhere to sleep and maybe grab breakfast before I head out.\n\nThanks for considering!` },
  { id: 'cultural', label: 'Cultural Exchange', emoji: '🌍', template: (name: string, city: string) => `Hi ${name}!\n\nI'm really excited about visiting ${city} and would love to learn about the local culture from a local! Your profile mentions [interest] which I find fascinating.\n\nI'm happy to share stories from my country and maybe cook something from my culture for you.\n\nI have [number] guests and will be there from [date] to [date].\n\nWould love to connect!` },
]

const REST_FEATURES = [
  { icon: '🛏️', title: 'Comfortable Sleeping Options', desc: 'From private rooms to shared spaces, find what suits your comfort level.' },
  { icon: '🚿', title: 'Amenities Available', desc: 'Check amenities like WiFi, AC, laundry, and parking before booking.' },
  { icon: '🍳', title: 'Breakfast Included', desc: 'Many hosts offer breakfast! Great way to start the day and chat.' },
  { icon: '🔑', title: 'Flexible Check-in', desc: 'Most hosts are flexible. Communicate your arrival time in advance.' },
  { icon: '🏠', title: 'Entire Place Options', desc: 'Some hosts offer their entire place when theyre away. Privacy guaranteed!' },
  { icon: '🐾', title: 'Pet-Friendly Hosts', desc: 'Traveling with a furry friend? Some hosts welcome pets!' },
]

export default function CouchSurfing() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string | null; displayName: string | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/couchsurfing')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [filteredHosts, setFilteredHosts] = useState<Host[]>(SAMPLE_HOSTS.slice(0, 12))
  const [selectedHost, setSelectedHost] = useState<Host | null>(null)
  const [showHostModal, setShowHostModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'discover' | 'saved' | 'requests'>('discover')
  const [savedHosts, setSavedHosts] = useState<number[]>([])
  const [pendingRequests, setPendingRequests] = useState<{ hostId: number; hostName: string; city: string; date: string }[]>([])
  const [showNoHostsMessage, setShowNoHostsMessage] = useState(false)
  const [noHostsCountry, setNoHostsCountry] = useState<string | null>(null)
  const [showMessageForm, setShowMessageForm] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [filterVerified, setFilterVerified] = useState(false)
  const [filterPlus, setFilterPlus] = useState(false)
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'response'>('rating')
  const [showSafetyModal, setShowSafetyModal] = useState(false)
  const [hoveredHost, setHoveredHost] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showTripPlanner, setShowTripPlanner] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [displayCount, setDisplayCount] = useState(12)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [showBecomeHost, setShowBecomeHost] = useState(false)
  const [showVerificationInfo, setShowVerificationInfo] = useState(false)
  const [reviewFilter, setReviewFilter] = useState<'all' | 'couch' | 'hangout' | 'reference'>('all')
  const [showShareModal, setShowShareModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportHostId, setReportHostId] = useState<number | null>(null)
  const [messagePreview, setMessagePreview] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [arrivalDate, setArrivalDate] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [numGuests, setNumGuests] = useState(1)
  const [filterGender, setFilterGender] = useState<string>('any')
  const [filterCouchType, setFilterCouchType] = useState<string>('all')
  const [filterMaxGuests, setFilterMaxGuests] = useState<number>(0)
  const [filterMinResponse, setFilterMinResponse] = useState<number>(0)
  const [filterAmenities, setFilterAmenities] = useState<{ [key: string]: boolean }>({ wifi: false, ac: false, breakfast: false, laundry: false, parking: false, pets: false, smoking: false })
  const [filterLastActive, setFilterLastActive] = useState<string>('any')
  const [tripCity, setTripCity] = useState('')
  const [tripInterests, setTripInterests] = useState<string[]>([])
  const [tripNights, setTripNights] = useState(3)
  const [userKarma, setUserKarma] = useState(247)
  const [showPlatforms, setShowPlatforms] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    filterHosts()
  }, [selectedCountry, selectedCity, filterVerified, filterPlus, sortBy, selectedRegion, filterGender, filterCouchType, filterMaxGuests, filterMinResponse, filterLastActive, filterAmenities])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
      if (contentRef.current) {
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 500)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const allCountries = [...COUNTRIES_WITH_HOSTS.map(c => c.name), ...COUNTRIES_WITHOUT_HOSTS.map(c => c.name)]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length >= 2) {
      const matches = allCountries.filter(c => c.toLowerCase().includes(query.toLowerCase()))
      setSearchResults(matches)
      setShowDropdown(true)
    } else {
      setSearchResults([])
      setShowDropdown(false)
    }
  }

  const selectCountry = (countryName: string) => {
    setSearchQuery(countryName)
    setShowDropdown(false)
    setSearchResults([])
    setSelectedRegion(null)

    const hasHosts = COUNTRIES_WITH_HOSTS.find(c => c.name === countryName)
    const noHosts = COUNTRIES_WITHOUT_HOSTS.find(c => c.name === countryName)

    if (noHosts) {
      setShowNoHostsMessage(true)
      setNoHostsCountry(countryName)
      setSelectedCountry(null)
      setSelectedCity(null)
      setFilteredHosts([])
      return
    }

    if (hasHosts) {
      setShowNoHostsMessage(false)
      setNoHostsCountry(null)
      setSelectedCountry(countryName)
      setSelectedCity(hasHosts.city)
      const countryHosts = SAMPLE_HOSTS.filter(h => h.country === countryName)
      setFilteredHosts(countryHosts.length > 0 ? countryHosts : SAMPLE_HOSTS.slice(0, 12))
    }
  }

  const selectRegion = (regionName: string) => {
    setSelectedRegion(regionName === selectedRegion ? null : regionName)
    setSelectedCountry(null)
    setSearchQuery('')
  }

  const filterHosts = useCallback(() => {
    let result = [...SAMPLE_HOSTS]

    if (selectedCountry) {
      result = result.filter(h => h.country === selectedCountry)
    }

    if (selectedRegion) {
      result = result.filter(h => h.region === selectedRegion)
    }

    if (filterVerified) {
      result = result.filter(h => h.verified)
    }

    if (filterPlus) {
      result = result.filter(h => h.plusVerified)
    }

    if (filterGender !== 'any') {
      result = result.filter(h => h.gender === filterGender)
    }

    if (filterCouchType !== 'all') {
      result = result.filter(h => h.couchType === filterCouchType)
    }

    if (filterMaxGuests > 0) {
      result = result.filter(h => h.maxGuests >= filterMaxGuests)
    }

    if (filterMinResponse > 0) {
      result = result.filter(h => h.responseRate >= filterMinResponse)
    }

    if (filterLastActive !== 'any') {
      const now = new Date()
      if (filterLastActive === 'today') {
        result = result.filter(h => h.lastActive.includes('now') || h.lastActive.includes('hour') || h.lastActive.includes('minute'))
      } else if (filterLastActive === 'week') {
        result = result.filter(h => {
          const daysDiff = (now.getTime() - h.lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
          return daysDiff <= 7
        })
      } else if (filterLastActive === 'month') {
        result = result.filter(h => {
          const daysDiff = (now.getTime() - h.lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
          return daysDiff <= 30
        })
      }
    }

    Object.entries(filterAmenities).forEach(([key, value]) => {
      if (value) {
        result = result.filter(h => {
          const amenityValue = h[key as keyof Host]
          return amenityValue === true
        })
      }
    })

    if (tripInterests.length > 0) {
      result = result.filter(h => h.interests.some(i => tripInterests.includes(i)))
    }

    if (tripCity) {
      result = result.filter(h => h.city.toLowerCase().includes(tripCity.toLowerCase()) || h.country.toLowerCase().includes(tripCity.toLowerCase()))
    }

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        result.sort((a, b) => b.reviews - a.reviews)
        break
      case 'response':
        result.sort((a, b) => b.responseRate - a.responseRate)
        break
    }

    setFilteredHosts(result)
  }, [selectedCountry, selectedCity, filterVerified, filterPlus, sortBy, selectedRegion, filterGender, filterCouchType, filterMaxGuests, filterMinResponse, filterLastActive, filterAmenities, tripCity, tripInterests])

  const activeFilterCount = () => {
    let count = 0
    if (filterVerified) count++
    if (filterPlus) count++
    if (filterGender !== 'any') count++
    if (filterCouchType !== 'all') count++
    if (filterMaxGuests > 0) count++
    if (filterMinResponse > 0) count++
    if (filterLastActive !== 'any') count++
    if (Object.values(filterAmenities).some(v => v)) count++
    return count
  }

  const toggleSaveHost = (hostId: number) => {
    if (savedHosts.includes(hostId)) {
      setSavedHosts(savedHosts.filter(id => id !== hostId))
      showToastMsg('Host removed from saved')
    } else {
      setSavedHosts([...savedHosts, hostId])
      showToastMsg('Host saved!')
    }
  }

  const viewHostDetails = (host: Host) => {
    setSelectedHost(host)
    setShowHostModal(true)
  }

  const calculateTrustScore = (host: Host): number => {
    const ratingScore = (host.rating / 5) * 40
    const responseScore = (host.responseRate / 100) * 25
    const reviewsScore = Math.min(host.reviews / 50, 1) * 20
    const tenureScore = (2024 - parseInt(host.memberSince)) * 3
    const verifiedBonus = host.verified ? 10 : 0
    const plusBonus = host.plusVerified ? 5 : 0
    return Math.min(100, Math.round(ratingScore + responseScore + reviewsScore + tenureScore + verifiedBonus + plusBonus))
  }

  const hasRedFlags = (host: Host): { flag: boolean; reason: string } => {
    if (host.responseRate < 80) return { flag: true, reason: 'Low response rate' }
    const daysSinceActive = (new Date().getTime() - host.lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceActive > 180) return { flag: true, reason: 'Not active for 6+ months' }
    if (!host.acceptingGuests) return { flag: true, reason: 'Not accepting guests' }
    return { flag: false, reason: '' }
  }

  const applyTemplate = (templateId: string) => {
    if (!selectedHost) return
    const template = REQUEST_TEMPLATES.find(t => t.id === templateId)
    if (template) {
      setMessageText(template.template(selectedHost.name.split(' ')[0], selectedHost.city))
      setSelectedTemplate(templateId)
    }
  }

  const sendHostRequest = () => {
    if (!selectedHost) return
    const newRequest = {
      hostId: selectedHost.id,
      hostName: selectedHost.name,
      city: selectedHost.city,
      date: arrivalDate || new Date().toISOString().split('T')[0]
    }
    setPendingRequests([...pendingRequests, newRequest])
    showToastMsg(`Request sent to ${selectedHost.name}!`)
    setShowMessageForm(false)
    setShowHostModal(false)
    setMessageText('')
    setSelectedTemplate(null)
    setArrivalDate('')
    setDepartureDate('')
    setNumGuests(1)
    setActiveTab('requests')
  }

  const shareHost = () => {
    if (!selectedHost) return
    navigator.clipboard.writeText(`Check out ${selectedHost.name} on Roamind! ${selectedHost.city}, ${selectedHost.country} - Rating: ${selectedHost.rating}`)
    showToastMsg('Link copied to clipboard!')
    setShowShareModal(false)
  }

  const reportHost = (hostId: number) => {
    showToastMsg('Report submitted. Thank you for keeping our community safe.')
    setShowReportModal(false)
    setReportHostId(null)
  }

  const applyTripFilter = () => {
    filterHosts()
    showToastMsg(`${filteredHosts.length} hosts match your trip preferences!`)
    setShowTripPlanner(false)
  }

  const clearAllFilters = () => {
    setFilterVerified(false)
    setFilterPlus(false)
    setFilterGender('any')
    setFilterCouchType('all')
    setFilterMaxGuests(0)
    setFilterMinResponse(0)
    setFilterLastActive('any')
    setFilterAmenities({ wifi: false, ac: false, breakfast: false, laundry: false, parking: false, pets: false, smoking: false })
    setSelectedCountry(null)
    setSelectedCity(null)
    setSelectedRegion(null)
    setSearchQuery('')
    showToastMsg('All filters cleared')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showToastMsg = (msg: string) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const nav = (path: string) => { setActivePath(path); router.push(path) }
  const handleLogout = async () => { const { signOut } = await import('firebase/auth'); await signOut(auth); router.push('/landing') }

  const loadMore = () => {
    setDisplayCount(prev => prev + 12)
  }

  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, border: '2px solid rgba(99,210,255,0.15)', borderTopColor: C, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()

  const getCouchTypeColor = (type: string) => {
    switch (type) {
      case 'Private Room': return { bg: 'rgba(99,210,255,0.15)', color: C, border: 'rgba(99,210,255,0.3)' }
      case 'Shared Room': return { bg: 'rgba(255,183,77,0.15)', color: G, border: 'rgba(255,183,77,0.3)' }
      case 'Couch': return { bg: 'rgba(168,85,247,0.15)', color: PURPLE, border: 'rgba(168,85,247,0.3)' }
      default: return { bg: 'rgba(255,255,255,0.1)', color: '#fff', border: 'rgba(255,255,255,0.2)' }
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: BG, color: '#fff', fontFamily: "'Outfit',sans-serif", overflow: 'hidden' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: sidebarOpen ? 256 : 64, minWidth: sidebarOpen ? 256 : 64, background: '#05090f', borderRight: '1px solid rgba(99,210,255,0.07)', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', overflow: 'hidden', flexShrink: 0, zIndex: 50 }}>
        <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(99,210,255,0.07)', flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,rgba(99,210,255,0.2),rgba(255,183,77,0.15))', border: '1px solid rgba(99,210,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🌍</div>
          {sidebarOpen && <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 900, background: 'linear-gradient(130deg,#fff 30%,#63d2ff 70%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', whiteSpace: 'nowrap' }}>Roamind</span>}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
          {navSections.map((section, si) => (
            <div key={si} style={{ marginBottom: 8 }}>
              {sidebarOpen && <div style={{ fontSize: 9.5, letterSpacing: 2.5, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', padding: '8px 8px 6px', fontWeight: 600 }}>{section.title}</div>}
              {section.items.map(item => (
                <button key={item.path} onClick={() => nav(item.path)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: sidebarOpen ? '9px 10px' : '9px 0', justifyContent: sidebarOpen ? 'flex-start' : 'center', background: activePath === item.path ? 'rgba(99,210,255,0.1)' : 'transparent', border: activePath === item.path ? '1px solid rgba(99,210,255,0.18)' : '1px solid transparent', borderRadius: 9, cursor: 'pointer', marginBottom: 2, transition: 'all 0.18s' }}
                  onMouseEnter={e => { if (activePath !== item.path) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)' } }}
                  onMouseLeave={e => { if (activePath !== item.path) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.border = '1px solid transparent' } }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                  {sidebarOpen && <span style={{ fontSize: 12.5, fontWeight: activePath === item.path ? 600 : 400, color: activePath === item.path ? C : 'rgba(255,255,255,0.52)', whiteSpace: 'nowrap' }}>{item.label}</span>}
                  {sidebarOpen && activePath === item.path && <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: C }} />}
                </button>
              ))}
              {si < navSections.length - 1 && <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '8px 0' }} />}
            </div>
          ))}
        </div>

        <div style={{ padding: '10px', borderTop: '1px solid rgba(99,210,255,0.07)', flexShrink: 0 }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, marginBottom: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000814', flexShrink: 0 }}>{avatar}</div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.displayName?.split(' ')[0] || 'Traveler'}</div>
                <div style={{ fontSize: 10, color: GR, display: 'flex', alignItems: 'center', gap: 4 }}>⭐ {userKarma} Karma</div>
              </div>
            </div>
          )}
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '8px 10px' : '8px 0', background: 'rgba(255,60,60,0.06)', border: '1px solid rgba(255,60,60,0.12)', borderRadius: 9, cursor: 'pointer', color: 'rgba(255,100,100,0.75)', fontSize: 12, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,60,60,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,60,60,0.06)'}>
            <span style={{ fontSize: 14 }}>🚪</span>{sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* TOP BAR */}
        <div style={{ height: 62, padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(99,210,255,0.07)', background: 'rgba(0,5,14,0.9)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer', fontSize: 15, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}>☰</button>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>🤝 Couch Surfing</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)' }}>Connect with hosts worldwide</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,183,77,0.1)', border: '1px solid rgba(255,183,77,0.25)', borderRadius: 10 }}>
              <span style={{ fontSize: 14 }}>⭐</span>
              <span style={{ fontSize: 11, color: G, fontWeight: 600 }}>{userKarma}</span>
            </div>
            <button onClick={() => setShowSafetyModal(true)} style={{ padding: '6px 12px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)', borderRadius: 10, color: R, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              🛡️ Safety
            </button>
            <button onClick={() => setShowPlatforms(!showPlatforms)} style={{ padding: '6px 12px', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.25)', borderRadius: 10, color: C, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              🌐 Platforms
            </button>
            {savedHosts.length > 0 && (
              <div style={{ padding: '6px 12px', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 10, color: PURPLE, fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
                ❤️ {savedHosts.length} Saved
              </div>
            )}
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000814', cursor: 'pointer', flexShrink: 0 }}>{avatar}</div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>

          {/* DIRECT PLATFORM LINKS */}
          <div style={{ background: 'rgba(99,210,255,0.05)', border: '1px solid rgba(99,210,255,0.1)', borderRadius: 14, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C, marginRight: 8 }}>🌐 Top Platforms:</span>
            <a href="https://couchsurfing.com" target="_blank" rel="noopener noreferrer" style={{ padding: '5px 12px', background: 'rgba(231,76,60,0.15)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 100, color: '#e74c3c', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>🌍 CouchSurfing</a>
            <a href="https://trustroots.org" target="_blank" rel="noopener noreferrer" style={{ padding: '5px 12px', background: 'rgba(39,174,96,0.15)', border: '1px solid rgba(39,174,96,0.3)', borderRadius: 100, color: '#27ae60', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>🤝 Trustroots</a>
            <a href="https://bewelcome.org" target="_blank" rel="noopener noreferrer" style={{ padding: '5px 12px', background: 'rgba(39,174,96,0.15)', border: '1px solid rgba(39,174,96,0.3)', borderRadius: 100, color: '#27ae60', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>💚 BeWelcome</a>
            <a href="https://warmshowers.org" target="_blank" rel="noopener noreferrer" style={{ padding: '5px 12px', background: 'rgba(52,152,219,0.15)', border: '1px solid rgba(52,152,219,0.3)', borderRadius: 100, color: '#3498db', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>🚴 Warmshowers</a>
            <a href="https://servas.org" target="_blank" rel="noopener noreferrer" style={{ padding: '5px 12px', background: 'rgba(155,89,182,0.15)', border: '1px solid rgba(155,89,182,0.3)', borderRadius: 100, color: '#9b59b6', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>☮️ Servas</a>
            <a href="https://pasportaservo.org" target="_blank" rel="noopener noreferrer" style={{ padding: '5px 12px', background: 'rgba(26,188,156,0.15)', border: '1px solid rgba(26,188,156,0.3)', borderRadius: 100, color: '#1abc9c', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>🌐 Pasporta Servo</a>
            <a href="https://hospitalityclub.org" target="_blank" rel="noopener noreferrer" style={{ padding: '5px 12px', background: 'rgba(230,126,34,0.15)', border: '1px solid rgba(230,126,34,0.3)', borderRadius: 100, color: '#e67e22', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>🏠 HospitalityClub</a>
            <a href="https://warmhosts.info" target="_blank" rel="noopener noreferrer" style={{ padding: '5px 12px', background: 'rgba(231,76,60,0.15)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 100, color: '#e74c3c', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>🔥 Warm Hosts</a>
          </div>

          {/* PLATFORMS SECTION */}
          {showPlatforms && (
            <div style={{ background: 'linear-gradient(135deg,rgba(99,210,255,0.08) 0%,rgba(168,85,247,0.05) 100%)', border: '1px solid rgba(99,210,255,0.12)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                🌐 Top Couchsurfing Platforms
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {PLATFORMS.map((platform, i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${platform.color}30`, borderRadius: 14, padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ fontSize: 36 }}>{platform.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{platform.name}</span>
                        <span style={{ padding: '2px 8px', background: platform.isFree ? 'rgba(81,207,102,0.15)' : 'rgba(255,183,77,0.15)', borderRadius: 100, fontSize: 9, color: platform.isFree ? GR : G, fontWeight: 600 }}>
                          {platform.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{platform.description}</div>
                      <div style={{ fontSize: 12, color: C, fontWeight: 600 }}>{platform.stats}</div>
                    </div>
                    <a href={platform.url} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 14px', background: platform.color, borderRadius: 8, color: '#fff', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>
                      Visit
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HERO SECTION */}
          <div style={{ background: 'linear-gradient(135deg,rgba(99,210,255,0.08) 0%,rgba(168,85,247,0.06) 50%,rgba(255,183,77,0.05) 100%)', border: '1px solid rgba(99,210,255,0.12)', borderRadius: 24, padding: 32, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'radial-gradient(circle,rgba(99,210,255,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 40 }}>🌍</span>
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, margin: 0, background: 'linear-gradient(130deg,#fff,#63d2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Find Your Perfect Host</h1>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 24, maxWidth: 600 }}>
                Connect with friendly locals worldwide. Experience authentic hospitality, make lifelong friends, and travel on any budget!
              </p>

              {/* SEARCH BAR */}
              <div style={{ position: 'relative', maxWidth: 500, marginBottom: 20 }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 14, padding: '4px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                    placeholder="Search any country or city..."
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 15, padding: '12px 0' }}
                  />
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(''); setShowDropdown(false); setSelectedCountry(null); setSelectedCity(null); setShowNoHostsMessage(false); setSelectedRegion(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 16 }}>✕</button>
                  )}
                </div>
                {showDropdown && searchResults.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#05090f', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 12, marginTop: 4, maxHeight: 300, overflow: 'auto', boxShadow: '0 16px 40px rgba(0,0,0,0.5)', zIndex: 100 }}>
                    {searchResults.map((result, i) => {
                      const hasHost = COUNTRIES_WITH_HOSTS.find(c => c.name === result)
                      const noHost = COUNTRIES_WITHOUT_HOSTS.find(c => c.name === result)
                      return (
                        <div key={i} onClick={() => selectCountry(result)} style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,210,255,0.1)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <span style={{ fontSize: 18 }}>{hasHost?.flag || noHost?.flag}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{result}</div>
                            <div style={{ fontSize: 11, color: hasHost ? GR : R }}>
                              {hasHost ? `🌟 ${hasHost.hostCount} hosts available` : '📭 No hosts yet in this area'}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* FILTER TABS */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('discover')} style={{ padding: '8px 16px', background: activeTab === 'discover' ? C : 'rgba(255,255,255,0.05)', border: `1px solid ${activeTab === 'discover' ? C : 'rgba(255,255,255,0.1)'}`, borderRadius: 100, color: activeTab === 'discover' ? '#000814' : '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  🌍 Discover
                </button>
                <button onClick={() => setActiveTab('saved')} style={{ padding: '8px 16px', background: activeTab === 'saved' ? PURPLE : 'rgba(255,255,255,0.05)', border: `1px solid ${activeTab === 'saved' ? PURPLE : 'rgba(255,255,255,0.1)'}`, borderRadius: 100, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  ❤️ Saved ({savedHosts.length})
                </button>
                <button onClick={() => setActiveTab('requests')} style={{ padding: '8px 16px', background: activeTab === 'requests' ? G : 'rgba(255,255,255,0.05)', border: `1px solid ${activeTab === 'requests' ? G : 'rgba(255,255,255,0.1)'}`, borderRadius: 100, color: activeTab === 'requests' ? '#000814' : '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  ✉️ Requests ({pendingRequests.length})
                </button>
              </div>

              {/* QUICK FILTERS */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={() => setShowFilters(!showFilters)} style={{ padding: '8px 14px', background: showFilters ? 'rgba(99,210,255,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${showFilters ? C : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  🔽 Advanced Filters {activeFilterCount() > 0 && <span style={{ background: C, color: '#000814', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{activeFilterCount()}</span>}
                </button>
                <button onClick={() => setShowTripPlanner(!showTripPlanner)} style={{ padding: '8px 14px', background: showTripPlanner ? 'rgba(255,183,77,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${showTripPlanner ? G : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  📅 Trip Planner
                </button>
                <button onClick={() => setShowVerificationInfo(true)} style={{ padding: '8px 14px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: 10, color: PURPLE, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  ⭐ Verification Levels
                </button>
                <button onClick={() => setShowBecomeHost(true)} style={{ padding: '8px 14px', background: 'rgba(81,207,102,0.1)', border: '1px solid rgba(81,207,102,0.25)', borderRadius: 10, color: GR, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  🏠 Become a Host
                </button>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  <button onClick={() => setFilterVerified(!filterVerified)} style={{ padding: '8px 12px', background: filterVerified ? 'rgba(81,207,102,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${filterVerified ? GR : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, color: filterVerified ? GR : '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    ✓ Verified
                  </button>
                  <button onClick={() => setFilterPlus(!filterPlus)} style={{ padding: '8px 12px', background: filterPlus ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${filterPlus ? PURPLE : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, color: filterPlus ? PURPLE : '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    ⭐ Plus
                  </button>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'rating' | 'reviews' | 'response')} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 11, cursor: 'pointer' }}>
                    <option value="rating">⭐ Rating</option>
                    <option value="reviews">📝 Reviews</option>
                    <option value="response">⚡ Response</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ADVANCED FILTERS PANEL */}
          {showFilters && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,210,255,0.1)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>🔽 Advanced Filters</h3>
                <button onClick={clearAllFilters} style={{ padding: '4px 12px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 8, color: R, fontSize: 11, cursor: 'pointer' }}>
                  Clear All
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Gender</label>
                  <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}>
                    <option value="any">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Couch Type</label>
                  <select value={filterCouchType} onChange={(e) => setFilterCouchType(e.target.value)} style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}>
                    <option value="all">All Types</option>
                    <option value="Private Room">Private Room</option>
                    <option value="Shared Room">Shared Room</option>
                    <option value="Couch">Couch</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Min Guests</label>
                  <select value={filterMaxGuests} onChange={(e) => setFilterMaxGuests(parseInt(e.target.value))} style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}>
                    <option value="0">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Min Response Rate</label>
                  <select value={filterMinResponse} onChange={(e) => setFilterMinResponse(parseInt(e.target.value))} style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}>
                    <option value="0">Any</option>
                    <option value="80">80%+</option>
                    <option value="90">90%+</option>
                    <option value="95">95%+</option>
                    <option value="99">99%+</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Last Active</label>
                  <select value={filterLastActive} onChange={(e) => setFilterLastActive(e.target.value)} style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}>
                    <option value="any">Any</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 8 }}>Amenities</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Object.entries(filterAmenities).map(([key, value]) => (
                    <button key={key} onClick={() => setFilterAmenities({ ...filterAmenities, [key]: !value })} style={{ padding: '6px 12px', background: value ? 'rgba(99,210,255,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${value ? C : 'rgba(255,255,255,0.1)'}`, borderRadius: 100, color: value ? C : '#fff', fontSize: 11, cursor: 'pointer' }}>
                      {key === 'wifi' && '📶 '}{key === 'ac' && '❄️ '}{key === 'breakfast' && '🍳 '}{key === 'laundry' && '👕 '}{key === 'parking' && '🅿️ '}{key === 'pets' && '🐾 '}{key === 'smoking' && '🚬 '} {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TRIP PLANNER PANEL */}
          {showTripPlanner && (
            <div style={{ background: 'linear-gradient(135deg,rgba(255,183,77,0.08) 0%,rgba(255,183,77,0.03) 100%)', border: '1px solid rgba(255,183,77,0.15)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                📅 Plan My Trip
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Where are you going?</label>
                  <input type="text" value={tripCity} onChange={(e) => setTripCity(e.target.value)} placeholder="City or country..." style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,183,77,0.3)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>How many nights?</label>
                  <input type="number" value={tripNights} onChange={(e) => setTripNights(parseInt(e.target.value) || 1)} min="1" max="30" style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,183,77,0.3)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 8 }}>My Interests</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {ALL_INTERESTS.slice(0, 20).map(interest => (
                    <button key={interest} onClick={() => setTripInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest])} style={{ padding: '4px 10px', background: tripInterests.includes(interest) ? 'rgba(255,183,77,0.3)' : 'rgba(255,255,255,0.05)', border: `1px solid ${tripInterests.includes(interest) ? G : 'rgba(255,255,255,0.1)'}`, borderRadius: 100, color: tripInterests.includes(interest) ? G : '#fff', fontSize: 10, cursor: 'pointer' }}>
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button onClick={applyTripFilter} style={{ padding: '10px 20px', background: G, border: 'none', borderRadius: 10, color: '#000814', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  🔍 Find Matching Hosts
                </button>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                  {filteredHosts.length} hosts match your trip
                </span>
              </div>
            </div>
          )}

          {/* REGIONS SECTION */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🗺️ Browse by Region</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
              {REGIONS.map((region, i) => (
                <button key={i} onClick={() => selectRegion(region.name)} style={{ padding: 16, background: selectedRegion === region.name ? 'rgba(99,210,255,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedRegion === region.name ? C : 'rgba(255,255,255,0.08)'}`, borderRadius: 14, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{region.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{region.name}</div>
                  <div style={{ fontSize: 12, color: C, marginBottom: 8 }}>{region.hostCount.toLocaleString()} hosts</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                    {region.topCountries.map(c => `${c.flag} `).join('')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* HOT DESTINATIONS */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🔥 Hot Destinations This Month</h2>
            <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }}>
              {HOT_DESTINATIONS.map((dest, i) => (
                <div key={i} onClick={() => selectCountry(dest.country)} style={{ minWidth: 160, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 14, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.08)'; e.currentTarget.style.border = '1px solid rgba(255,107,107,0.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{dest.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{dest.city}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{dest.flag} {dest.country}</div>
                  <div style={{ display: 'flex', gap: 8, fontSize: 10 }}>
                    <span style={{ color: C }}>🏠 {dest.hostCount}</span>
                    <span style={{ color: G }}>⭐ {dest.avgRating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NO HOSTS MESSAGE */}
          {showNoHostsMessage && (
            <div style={{ background: 'linear-gradient(135deg,rgba(255,183,77,0.1) 0%,rgba(255,107,107,0.05) 100%)', border: '1px solid rgba(255,183,77,0.2)', borderRadius: 20, padding: 40, marginBottom: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🏠</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, marginBottom: 12, color: G }}>No hosts available yet in {noHostsCountry}!</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 500, margin: '0 auto 20px' }}>
                We are still building our community in this area. Our friendly travelers and hosts are expanding every day!
              </p>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 20, maxWidth: 400, margin: '0 auto' }}>
                <div style={{ fontSize: 16, marginBottom: 12 }}>💡 Here are some nearby alternatives:</div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {COUNTRIES_WITH_HOSTS.slice(0, 4).map(c => (
                    <button key={c.code} onClick={() => selectCountry(c.name)} style={{ padding: '8px 16px', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 100, color: C, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {c.flag} {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                🌟 Want to be the first host in {noHostsCountry}? Sign up and start hosting!
              </div>
            </div>
          )}

          {/* SAVED HOSTS VIEW */}
          {activeTab === 'saved' && (
            <div style={{ marginBottom: 24 }}>
              {savedHosts.length === 0 ? (
                <div style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: 16, padding: 40, textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>❤️</div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No saved hosts yet</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Click the heart icon on any host to save them for later!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                  {SAMPLE_HOSTS.filter(h => savedHosts.includes(h.id)).map(host => (
                    <HostCard key={host.id} host={host} onView={() => viewHostDetails(host)} onSave={() => toggleSaveHost(host.id)} onReport={() => { setReportHostId(host.id); setShowReportModal(true) }} isSaved={true} isHovered={hoveredHost === host.id} onHover={() => setHoveredHost(host.id)} onLeave={() => setHoveredHost(null)} getCouchTypeColor={getCouchTypeColor} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REQUESTS VIEW */}
          {activeTab === 'requests' && (
            <div style={{ marginBottom: 24 }}>
              {pendingRequests.length === 0 ? (
                <div style={{ background: 'rgba(255,183,77,0.05)', border: '1px solid rgba(255,183,77,0.15)', borderRadius: 16, padding: 40, textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✉️</div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No pending requests</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Send a hosting request to a host to see it here!</p>
                </div>
              ) : (
                <div style={{ background: 'rgba(255,183,77,0.05)', border: '1px solid rgba(255,183,77,0.15)', borderRadius: 16, padding: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    ⏳ Pending Requests ({pendingRequests.length})
                  </h3>
                  {pendingRequests.map((request, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>To: {request.hostName}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{request.city} • Sent: {request.date}</div>
                      </div>
                      <span style={{ padding: '4px 12px', background: 'rgba(255,183,77,0.2)', border: '1px solid rgba(255,183,77,0.3)', borderRadius: 100, color: G, fontSize: 11, fontWeight: 600 }}>Pending</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HOSTS GRID */}
          {activeTab === 'discover' && !showNoHostsMessage && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, margin: 0 }}>
                  {selectedRegion ? `${selectedRegion} Region` : selectedCountry ? `${selectedCountry} Hosts` : 'Featured Hosts'}
                </h2>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{filteredHosts.length} hosts found</span>
              </div>

              {filteredHosts.length === 0 ? (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 40, textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>No hosts match your filters</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Try adjusting your filters or search for a different location</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
                    {filteredHosts.slice(0, displayCount).map(host => (
                      <HostCard 
                        key={host.id} 
                        host={host} 
                        onView={() => viewHostDetails(host)} 
                        onSave={() => toggleSaveHost(host.id)} 
                        onReport={() => { setReportHostId(host.id); setShowReportModal(true) }}
                        isSaved={savedHosts.includes(host.id)}
                        isHovered={hoveredHost === host.id}
                        onHover={() => setHoveredHost(host.id)}
                        onLeave={() => setHoveredHost(null)}
                        getCouchTypeColor={getCouchTypeColor}
                      />
                    ))}
                  </div>
                  {displayCount < filteredHosts.length && (
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                      <button onClick={loadMore} style={{ padding: '12px 32px', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.25)', borderRadius: 12, color: C, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        Load More ({filteredHosts.length - displayCount} more)
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* VERIFICATION TIERS */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              ⭐ Host Verification Levels
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {VERIFICATION_LEVELS.map((level, i) => (
                <div key={i} style={{ background: level.bg, border: `1px solid ${level.border}`, borderRadius: 14, padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{level.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: level.color, marginBottom: 4 }}>{level.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{level.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* REST FEATURES SECTION */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>🛋️ Comfort & Amenities</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {REST_FEATURES.map((feature, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18, display: 'flex', gap: 14, transition: 'all 0.2s' }}>
                  <span style={{ fontSize: 32 }}>{feature.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{feature.title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SAFETY TIPS */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              🛡️ Safety Tips
            </h2>
            <div style={{ background: 'linear-gradient(135deg,rgba(255,107,107,0.08) 0%,rgba(255,107,107,0.03) 100%)', border: '1px solid rgba(255,107,107,0.15)', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                {SAFETY_TIPS.map((tip, i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16, display: 'flex', gap: 12, transition: 'all 0.2s' }}>
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{tip.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{tip.title}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{tip.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: 12, background: 'rgba(255,107,107,0.1)', borderRadius: 10 }}>
                <a href="https://couchsurfing.com/about/safety" target="_blank" rel="noopener noreferrer" style={{ color: R, fontSize: 12, textDecoration: 'none' }}>
                  📖 Read CouchSurfing Safety Guidelines →
                </a>
              </div>
            </div>
          </div>

          {/* COUCH SURFING TIPS */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              💡 Couch Surfing Etiquette
            </h2>
            <div style={{ background: 'linear-gradient(135deg,rgba(99,210,255,0.08) 0%,rgba(99,210,255,0.03) 100%)', border: '1px solid rgba(99,210,255,0.12)', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                {CS_TIPS.map((tip, i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16, display: 'flex', gap: 12, transition: 'all 0.2s' }}>
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{tip.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{tip.title}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{tip.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TOP HOSTS THIS MONTH */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              🏆 Top Hosts This Month
            </h2>
            <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }}>
              {SAMPLE_HOSTS.filter(h => h.reviews >= 50).slice(0, 5).map((host, i) => (
                <div key={host.id} style={{ minWidth: 180, background: 'linear-gradient(135deg,rgba(255,183,77,0.1) 0%,rgba(255,183,77,0.05) 100%)', border: '1px solid rgba(255,183,77,0.2)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</div>
                  <div style={{ width: 50, height: 50, borderRadius: '50%', background: `linear-gradient(135deg,${C},${PURPLE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#000814', margin: '0 auto 8px' }}>
                    {host.name.charAt(0)}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{host.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{host.city}</div>
                  <div style={{ fontSize: 11, color: G, marginTop: 4 }}>⭐ {host.rating} • {host.reviews} reviews</div>
                </div>
              ))}
            </div>
          </div>

          {/* COUNTRIES SECTION */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>🌍 Explore by Country</h2>
            
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: GR }}>🌟 Countries with Hosts ({COUNTRIES_WITH_HOSTS.length})</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {COUNTRIES_WITH_HOSTS.map(country => (
                  <button key={country.code} onClick={() => selectCountry(country.name)} style={{ padding: '8px 14px', background: selectedCountry === country.name ? `${GR}25` : 'rgba(255,255,255,0.05)', border: `1px solid ${selectedCountry === country.name ? GR : 'rgba(255,255,255,0.1)'}`, borderRadius: 100, color: selectedCountry === country.name ? GR : '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                    {country.flag} {country.name} <span style={{ fontSize: 10, opacity: 0.6 }}>({country.hostCount})</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: G }}>📭 Growing Communities ({COUNTRIES_WITHOUT_HOSTS.length})</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {COUNTRIES_WITHOUT_HOSTS.map(country => (
                  <button key={country.code} onClick={() => selectCountry(country.name)} style={{ padding: '8px 14px', background: 'rgba(255,183,77,0.08)', border: '1px solid rgba(255,183,77,0.2)', borderRadius: 100, color: G, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                    {country.flag} {country.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* HOST DETAILS MODAL */}
      {showHostModal && selectedHost && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }} onClick={() => setShowHostModal(false)}>
          <div style={{ background: '#05090f', borderRadius: 24, maxWidth: 750, width: '100%', maxHeight: '90vh', overflow: 'auto', border: '1px solid rgba(99,210,255,0.15)' }} onClick={e => e.stopPropagation()}>
            {/* HEADER */}
            <div style={{ background: 'linear-gradient(135deg,rgba(99,210,255,0.1) 0%,rgba(168,85,247,0.08) 100%)', padding: 24, borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg,${C},${PURPLE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: '#000814' }}>
                      {selectedHost.name.charAt(0)}
                    </div>
                    {selectedHost.lastActive.includes('now') && (
                      <div style={{ position: 'absolute', bottom: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: GR, border: '3px solid #05090f' }} />
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 20, fontWeight: 700 }}>{selectedHost.name}</span>
                      {selectedHost.plusVerified && <span style={{ fontSize: 16, color: PURPLE }}>⭐</span>}
                      {selectedHost.verified && <span style={{ fontSize: 14, color: G }}>✓ ID</span>}
                      {VERIFICATION_LEVELS.find(v => v.level === selectedHost.verificationLevel) && (
                        <span style={{ padding: '2px 8px', background: VERIFICATION_LEVELS.find(v => v.level === selectedHost.verificationLevel)?.bg, border: `1px solid ${VERIFICATION_LEVELS.find(v => v.level === selectedHost.verificationLevel)?.border}`, borderRadius: 100, fontSize: 10, color: VERIFICATION_LEVELS.find(v => v.level === selectedHost.verificationLevel)?.color }}>
                          {VERIFICATION_LEVELS.find(v => v.level === selectedHost.verificationLevel)?.icon} {VERIFICATION_LEVELS.find(v => v.level === selectedHost.verificationLevel)?.label}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                      {selectedHost.city}, {selectedHost.country} {selectedHost.flag}
                    </div>
                    <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                      <span>{selectedHost.age} yrs</span>
                      <span>•</span>
                      <span>{selectedHost.gender}</span>
                      <span>•</span>
                      <span style={{ color: selectedHost.acceptingGuests ? GR : R }}>{selectedHost.acceptingGuests ? '✅ Accepting Guests' : '❌ Not Available'}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setShowShareModal(true)} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12, cursor: 'pointer' }}>🔗 Share</button>
                  <button onClick={() => setShowHostModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 24, cursor: 'pointer' }}>✕</button>
                </div>
              </div>
            </div>

            {/* RED FLAGS WARNING */}
            {hasRedFlags(selectedHost).flag && (
              <div style={{ margin: 16, padding: 12, background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>🚨</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: R }}>Red Flag Detected</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{hasRedFlags(selectedHost).reason}</div>
                </div>
              </div>
            )}

            {/* TRUST SCORE */}
            <div style={{ margin: 16, padding: 16, background: 'rgba(99,210,255,0.05)', border: '1px solid rgba(99,210,255,0.1)', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Trust Score</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: calculateTrustScore(selectedHost) >= 80 ? GR : calculateTrustScore(selectedHost) >= 60 ? G : R }}>
                  {calculateTrustScore(selectedHost)}/100
                </span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${calculateTrustScore(selectedHost)}%`, background: calculateTrustScore(selectedHost) >= 80 ? GR : calculateTrustScore(selectedHost) >= 60 ? G : R, borderRadius: 4, transition: 'width 0.5s ease' }} />
              </div>
            </div>

            {/* STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: '0 20px 20px' }}>
              <div style={{ textAlign: 'center', padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: C }}>{selectedHost.rating}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Rating</div>
              </div>
              <div style={{ textAlign: 'center', padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: G }}>{selectedHost.reviews}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Reviews</div>
              </div>
              <div style={{ textAlign: 'center', padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: GR }}>{selectedHost.hosting}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Times Hosted</div>
              </div>
              <div style={{ textAlign: 'center', padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: PURPLE }}>{selectedHost.responseRate}%</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Response</div>
              </div>
            </div>

            {/* CONTENT */}
            <div style={{ padding: '0 24px 24px' }}>
              {/* BADGES */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 12px', background: getCouchTypeColor(selectedHost.couchType).bg, border: `1px solid ${getCouchTypeColor(selectedHost.couchType).border}`, borderRadius: 100, fontSize: 11, color: getCouchTypeColor(selectedHost.couchType).color }}>
                  {selectedHost.couchType}
                </span>
                <span style={{ padding: '4px 12px', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 100, fontSize: 11, color: C }}>
                  👥 Max {selectedHost.maxGuests} guest{selectedHost.maxGuests > 1 ? 's' : ''}
                </span>
                <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                  📍 {selectedHost.location}
                </span>
                <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                  📅 Member since {selectedHost.memberSince}
                </span>
                {selectedHost.reviews >= 50 && (
                  <span style={{ padding: '4px 12px', background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.25)', borderRadius: 100, fontSize: 11, color: R }}>
                    🔥 Popular ({selectedHost.reviews}+ reviews)
                  </span>
                )}
                {selectedHost.responseTime === 'within an hour' && (
                  <span style={{ padding: '4px 12px', background: 'rgba(81,207,102,0.15)', border: '1px solid rgba(81,207,102,0.25)', borderRadius: 100, fontSize: 11, color: GR }}>
                    💬 Quick Responder
                  </span>
                )}
              </div>

              {/* LANGUAGES */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Languages</h4>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedHost.languageFlags.map((flag, i) => (
                    <span key={i} style={{ padding: '4px 12px', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 100, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>{flag}</span>
                      <span>{selectedHost.languages[i]}</span>
                    </span>
                  ))}
                  {selectedHost.languages.length > 3 && (
                    <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                      +{selectedHost.languages.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* INTERESTS */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Interests</h4>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedHost.interests.map((interest, i) => (
                    <span key={i} style={{ padding: '4px 12px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 100, fontSize: 12, color: PURPLE }}>{interest}</span>
                  ))}
                </div>
              </div>

              {/* ABOUT */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>About</h4>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{selectedHost.about}</p>
              </div>

              {/* WHAT THEY OFFER */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>What I Offer</h4>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{selectedHost.whatIOffer}</p>
              </div>

              {/* AMENITIES */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Amenities</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {[
                    { label: '📶 WiFi', value: selectedHost.wifi },
                    { label: '❄️ AC', value: selectedHost.ac },
                    { label: '👕 Laundry', value: selectedHost.laundry },
                    { label: '🍳 Breakfast', value: selectedHost.breakfast },
                    { label: '🅿️ Parking', value: selectedHost.parking },
                    { label: '🚬 Smoking', value: selectedHost.smoking },
                    { label: '🐾 Pets', value: selectedHost.pets },
                  ].map((amenity, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: amenity.value ? 'rgba(81,207,102,0.1)' : 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                      <span style={{ color: amenity.value ? GR : 'rgba(255,255,255,0.3)' }}>{amenity.value ? '✓' : '✗'}</span>
                      <span style={{ fontSize: 12, color: amenity.value ? GR : 'rgba(255,255,255,0.4)' }}>{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* REVIEWS */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Recent Reviews</h4>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  {(['all', 'couch', 'hangout', 'reference'] as const).map(type => (
                    <button key={type} onClick={() => setReviewFilter(type)} style={{ padding: '4px 10px', background: reviewFilter === type ? 'rgba(99,210,255,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${reviewFilter === type ? C : 'rgba(255,255,255,0.1)'}`, borderRadius: 100, color: '#fff', fontSize: 10, cursor: 'pointer' }}>
                      {type === 'all' ? 'All' : type === 'couch' ? '🛋️ Stay' : type === 'hangout' ? '☕ Hangout' : '📝 Reference'}
                    </button>
                  ))}
                </div>
                {SAMPLE_REVIEWS.filter(r => reviewFilter === 'all' || r.type === reviewFilter).slice(0, 3).map(review => (
                  <div key={review.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 14, marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 16 }}>{review.authorFlag}</span>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{review.author}</span>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Since {review.authorMemberSince}</span>
                      </div>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{review.date}</span>
                    </div>
                    <div style={{ fontSize: 10, color: G, marginBottom: 4 }}>{'⭐'.repeat(review.rating)}</div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{review.text}</p>
                  </div>
                ))}
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  onClick={() => setShowMessageForm(true)}
                  style={{ flex: 1, padding: '14px 24px', background: `linear-gradient(135deg,${C},#3bb8e8)`, border: 'none', borderRadius: 12, color: '#000814', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  ✉️ Send Request
                </button>
                <button 
                  onClick={() => toggleSaveHost(selectedHost.id)}
                  style={{ padding: '14px 20px', background: savedHosts.includes(selectedHost.id) ? 'rgba(255,107,107,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${savedHosts.includes(selectedHost.id) ? R : 'rgba(255,255,255,0.1)'}`, borderRadius: 12, color: savedHosts.includes(selectedHost.id) ? R : '#fff', fontSize: 14, cursor: 'pointer' }}>
                  {savedHosts.includes(selectedHost.id) ? '❤️' : '🤍'}
                </button>
              </div>

              {/* MESSAGE FORM */}
              {showMessageForm && (
                <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 20 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Send Hosting Request</h4>
                  
                  {/* TEMPLATES */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 8 }}>Use a template (optional)</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {REQUEST_TEMPLATES.map(template => (
                        <button key={template.id} onClick={() => applyTemplate(template.id)} style={{ padding: '6px 12px', background: selectedTemplate === template.id ? 'rgba(99,210,255,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${selectedTemplate === template.id ? C : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, color: '#fff', fontSize: 11, cursor: 'pointer' }}>
                          {template.emoji} {template.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* DATES */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                    <div>
                      <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Arrival Date</label>
                      <input type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Departure Date</label>
                      <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Guests</label>
                      <input type="number" value={numGuests} onChange={(e) => setNumGuests(parseInt(e.target.value) || 1)} min="1" max={selectedHost.maxGuests} style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                    </div>
                  </div>

                  {/* MESSAGE */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Message</label>
                      <button onClick={() => setMessagePreview(!messagePreview)} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', fontSize: 10, cursor: 'pointer' }}>
                        {messagePreview ? '✏️ Edit' : '👁️ Preview'}
                      </button>
                    </div>
                    {messagePreview ? (
                      <div style={{ padding: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 8, fontSize: 12, color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap', minHeight: 120 }}>
                        {messageText || 'Your message will appear here...'}
                      </div>
                    ) : (
                      <textarea 
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value.slice(0, 500))}
                        placeholder={`Hi ${selectedHost.name.split(' ')[0]}! I'm planning to visit ${selectedHost.city} and would love to stay with you...`}
                        style={{ width: '100%', height: 120, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 10, padding: 14, color: '#fff', fontSize: 13, resize: 'none', outline: 'none' }}
                      />
                    )}
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textAlign: 'right', marginTop: 4 }}>{messageText.length}/500 characters</div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={sendHostRequest} style={{ flex: 1, padding: '12px 20px', background: C, border: 'none', borderRadius: 10, color: '#000814', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      Send Request
                    </button>
                    <button onClick={() => { setShowMessageForm(false); setSelectedTemplate(null); setMessageText('') }} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 13, cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShareModal && selectedHost && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 20 }} onClick={() => setShowShareModal(false)}>
          <div style={{ background: '#05090f', borderRadius: 16, padding: 24, maxWidth: 400, border: '1px solid rgba(99,210,255,0.15)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🔗 Share Host Profile</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>Share this host with your friends or save for later!</p>
            <button onClick={shareHost} style={{ width: '100%', padding: '12px 20px', background: C, border: 'none', borderRadius: 10, color: '#000814', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 12 }}>
              📋 Copy Link to Clipboard
            </button>
            <button onClick={() => setShowShareModal(false)} style={{ width: '100%', padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 13, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {showReportModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 20 }} onClick={() => setShowReportModal(false)}>
          <div style={{ background: '#05090f', borderRadius: 16, padding: 24, maxWidth: 400, border: '1px solid rgba(255,107,107,0.3)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: R }}>🚨 Report This Profile</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>Help us keep the community safe by reporting suspicious behavior.</p>
            <button onClick={() => reportHost(reportHostId!)} style={{ width: '100%', padding: '12px 20px', background: R, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 12 }}>
              Submit Report
            </button>
            <button onClick={() => setShowReportModal(false)} style={{ width: '100%', padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 13, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* VERIFICATION INFO MODAL */}
      {showVerificationInfo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }} onClick={() => setShowVerificationInfo(false)}>
          <div style={{ background: '#05090f', borderRadius: 24, maxWidth: 600, width: '100%', maxHeight: '90vh', overflow: 'auto', border: '1px solid rgba(168,85,247,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: 24, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: PURPLE }}>⭐ Host Verification Levels</h2>
            </div>
            <div style={{ padding: 24 }}>
              {VERIFICATION_LEVELS.map((level, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20, padding: 16, background: level.bg, border: `1px solid ${level.border}`, borderRadius: 12 }}>
                  <span style={{ fontSize: 40 }}>{level.icon}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: level.color, marginBottom: 4 }}>{level.label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{level.desc}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                      {level.level === 'basic' && 'Basic trust level. Only email verification.'}
                      {level.level === 'phone' && 'Phone number verified. More trustworthy than email-only.'}
                      {level.level === 'id' && 'Government ID verified. High trust level, recommended.'}
                      {level.level === 'plus' && 'Premium trusted hosts. Extensive verification, references, and track record.'}
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setShowVerificationInfo(false)} style={{ width: '100%', padding: '12px 20px', background: PURPLE, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 12 }}>
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BECOME A HOST MODAL */}
      {showBecomeHost && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }} onClick={() => setShowBecomeHost(false)}>
          <div style={{ background: '#05090f', borderRadius: 24, maxWidth: 700, width: '100%', maxHeight: '90vh', overflow: 'auto', border: '1px solid rgba(81,207,102,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: 24, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(135deg,rgba(81,207,102,0.1) 0%,rgba(81,207,102,0.05) 100%)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: GR }}>🏠 Become a Host</h2>
            </div>
            <div style={{ padding: 24 }}>
              {/* BENEFITS */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: GR }}>✨ Benefits of Hosting</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {[
                    { icon: '🌍', title: 'Meet People', desc: 'Connect with travelers from around the world' },
                    { icon: '🎭', title: 'Cultural Exchange', desc: 'Share your culture and learn about others' },
                    { icon: '⭐', title: 'Karma Points', desc: 'Earn karma for hosting - helps when you travel' },
                    { icon: '🤝', title: 'Build Network', desc: 'Make lifelong friends from every continent' },
                  ].map((benefit, i) => (
                    <div key={i} style={{ background: 'rgba(81,207,102,0.05)', border: '1px solid rgba(81,207,102,0.15)', borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{benefit.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{benefit.title}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{benefit.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3-STEP PROCESS */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: G }}>📝 How to Start</h3>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[
                    { step: '1', title: 'Create Profile', desc: 'Add photos and bio' },
                    { step: '2', title: 'Set Availability', desc: 'List your couch/room' },
                    { step: '3', title: 'Accept Requests', desc: 'Start hosting!' },
                  ].map((item, i) => (
                    <div key={i} style={{ flex: 1, textAlign: 'center', padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#000814', margin: '0 auto 8px' }}>{item.step}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STATS */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <div style={{ flex: 1, textAlign: 'center', padding: 16, background: 'rgba(99,210,255,0.1)', borderRadius: 10 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C }}>2M+</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Hosts Worldwide</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: 16, background: 'rgba(255,183,77,0.1)', borderRadius: 10 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: G }}>500K+</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Connections Monthly</div>
                </div>
              </div>

              <button style={{ width: '100%', padding: '14px 24px', background: GR, border: 'none', borderRadius: 12, color: '#000814', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                🚀 Start Hosting Today
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAFETY MODAL */}
      {showSafetyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }} onClick={() => setShowSafetyModal(false)}>
          <div style={{ background: '#05090f', borderRadius: 24, maxWidth: 600, width: '100%', maxHeight: '90vh', overflow: 'auto', border: '1px solid rgba(255,107,107,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: 24, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: R }}>🛡️ Safety Guidelines</h2>
              <button onClick={() => setShowSafetyModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 24, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              {SAFETY_TIPS.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 20, padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 12 }}>
                  <span style={{ fontSize: 32, flexShrink: 0 }}>{tip.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{tip.title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{tip.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: 16, background: 'rgba(255,107,107,0.1)', borderRadius: 12, border: '1px solid rgba(255,107,107,0.2)' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: R, marginBottom: 8 }}>🚨 Emergency</div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>If you ever feel unsafe, leave immediately and contact local authorities. Your safety is the #1 priority.</p>
              </div>
              <div style={{ marginTop: 16, padding: 12, background: 'rgba(99,210,255,0.1)', borderRadius: 10 }}>
                <a href="https://couchsurfing.com/about/safety" target="_blank" rel="noopener noreferrer" style={{ color: C, fontSize: 12, textDecoration: 'none' }}>
                  📖 Read CouchSurfing Safety Guidelines →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {showToast && (
        <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: '#05090f', border: '1px solid rgba(99,210,255,0.3)', borderRadius: 12, padding: '12px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 300 }}>
          <span style={{ fontSize: 14, color: C }}>{toastMessage}</span>
        </div>
      )}

      {/* BACK TO TOP */}
      {showBackToTop && (
        <button onClick={scrollToTop} style={{ position: 'fixed', bottom: 20, right: 20, width: 50, height: 50, borderRadius: '50%', background: C, border: 'none', color: '#000814', fontSize: 20, cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,210,255,0.4)', zIndex: 100 }}>
          ↑
        </button>
      )}
    </div>
  )
}

function HostCard({ host, onView, onSave, onReport, isSaved, isHovered, onHover, onLeave, getCouchTypeColor }: { host: Host; onView: () => void; onSave: () => void; onReport: () => void; isSaved: boolean; isHovered: boolean; onHover: () => void; onLeave: () => void; getCouchTypeColor: (type: string) => { bg: string; color: string; border: string } }) {
  const C = '#63d2ff'
  const G = '#ffb74d'
  const R = '#ff6b6b'
  const GR = '#51cf66'
  const PURPLE = '#a855f7'

  return (
    <div 
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ 
        background: isHovered ? 'rgba(99,210,255,0.08)' : 'rgba(255,255,255,0.03)', 
        border: `1px solid ${isHovered ? 'rgba(99,210,255,0.2)' : 'rgba(255,255,255,0.08)'}`, 
        borderRadius: 18, 
        padding: 20, 
        transition: 'all 0.25s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {/* REPORT BUTTON */}
      <button onClick={(e) => { e.stopPropagation(); onReport() }} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 10, color: 'rgba(255,255,255,0.3)', cursor: 'pointer', opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}>
        🚩
      </button>

      <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: `linear-gradient(135deg,${C},${PURPLE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#000814', flexShrink: 0 }}>
            {host.name.charAt(0)}
          </div>
          {host.lastActive.includes('now') && (
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: '50%', background: GR, border: '2px solid #000814' }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{host.name}</span>
            {host.plusVerified && <span style={{ fontSize: 12, color: PURPLE }}>⭐</span>}
            {host.verified && <span style={{ fontSize: 11, color: G }}>✓</span>}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
            📍 {host.city}, {host.country} {host.flag}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: host.acceptingGuests ? GR : R }}>
              {host.acceptingGuests ? '✅ Accepting' : '❌ Unavailable'}
            </span>
            <span style={{ fontSize: 11, color: host.lastActive.includes('now') ? GR : 'rgba(255,255,255,0.3)' }}>
              {host.lastActive}
            </span>
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onSave() }} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: 4 }}>
          {isSaved ? '❤️' : '🤍'}
        </button>
      </div>

      {/* BADGES */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        <span style={{ padding: '2px 8px', background: getCouchTypeColor(host.couchType).bg, border: `1px solid ${getCouchTypeColor(host.couchType).border}`, borderRadius: 100, fontSize: 10, color: getCouchTypeColor(host.couchType).color }}>
          {host.couchType}
        </span>
        <span style={{ padding: '2px 8px', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 100, fontSize: 10, color: C }}>
          👥 {host.maxGuests}
        </span>
        {host.reviews >= 50 && (
          <span style={{ padding: '2px 8px', background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.25)', borderRadius: 100, fontSize: 10, color: R }}>
            🔥 Popular
          </span>
        )}
        {host.responseTime === 'within an hour' && (
          <span style={{ padding: '2px 8px', background: 'rgba(81,207,102,0.15)', border: '1px solid rgba(81,207,102,0.25)', borderRadius: 100, fontSize: 10, color: GR }}>
            💬 Quick
          </span>
        )}
      </div>

      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 14, lineHeight: 1.5, minHeight: 36, overflow: 'hidden' }}>
        {host.bio}
      </div>

      {/* LANGUAGE FLAGS */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {host.languageFlags.slice(0, 3).map((flag, i) => (
          <span key={i} style={{ fontSize: 16 }}>{flag}</span>
        ))}
        {host.languages.length > 3 && (
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', alignSelf: 'center' }}>+{host.languages.length - 3}</span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {host.wifi && <span style={{ fontSize: 14 }}>📶</span>}
        {host.ac && <span style={{ fontSize: 14 }}>❄️</span>}
        {host.breakfast && <span style={{ fontSize: 14 }}>🍳</span>}
        {host.laundry && <span style={{ fontSize: 14 }}>👕</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C }}>{host.rating}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>rating</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: G }}>{host.reviews}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>reviews</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: GR }}>{host.responseRate}%</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>response</div>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onView() }}
          style={{ padding: '8px 16px', background: C, border: 'none', borderRadius: 8, color: '#000814', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          View Profile →
        </button>
      </div>
    </div>
  )
}
