'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import Sidebar from '@/components/Sidebar'

const C = '#00d4ff'
const G = '#ffb74d'
const BG = '#0a0f1e'
const CARD_BG = '#111827'

const _navSections = [
  { title: 'Plan & Discover', items: [{ icon: '🏠', label: 'Dashboard', path: '/dashboard' }, { icon: '🤖', label: 'AI Itinerary', path: '/itinerary' }] },
  { title: 'Book & Travel', items: [{ icon: '✈️', label: 'Flights', path: '/flights' }, { icon: '🏨', label: 'Hotels', path: '/hotels' }, { icon: '🍽️', label: 'Restaurants', path: '/restaurants' }, { icon: '🚌', label: 'Transport', path: '/transport' }] },
  { title: 'Intelligence', items: [{ icon: '🛂', label: 'Visa Guide', path: '/visa' }, { icon: '💱', label: 'Currency', path: '/currency' }, { icon: '🌤️', label: 'Weather+AQI', path: '/weather' }, { icon: '🆘', label: 'Emergency', path: '/emergency' }] },
  { title: 'Discover People', items: [{ icon: '👨‍💼', label: 'Local Guides', path: '/guides' }, { icon: '🤝', label: 'Couch Surfing', path: '/couchsurfing' }] },
  { title: 'My Travel', items: [{ icon: '🏅', label: 'Travel Passport', path: '/passport' }, { icon: '❤️', label: 'Saved Trips', path: '/saved' }, { icon: '📦', label: 'Packing List', path: '/packing' }, { icon: '💰', label: 'Budget Tracker', path: '/budget' }, { icon: '💬', label: 'AI Chat', path: '/chat' }, { icon: '🧠', label: 'Travel IQ', path: '/traveliq' }, { icon: '⚙️', label: 'Settings', path: '/settings' }] },
]

interface CityDetails {
  name: string
  region: string
  country: string
  flag: string
  lat: number
  lng: number
  score: number
  transport_modes: string[]
  best_for: string
  peak_hours: string
  night_service?: boolean
  booking_links: { name: string; url: string }[]
  timezone: string
  timezone_iana?: string
  language: string
  currency: string
  cost_level: string
  safety: string
  best_months: string
  local_tips: string[]
  attractions: string[]
  connectivity: {
    airport: string
    railway: string
    metro_lines: number
    bus_network: string
  }
  overview: string
  transport_tips: string[]
  food: string[]
  shopping: string[]
  nightlife: string[]
  emergency_contacts: { name: string; number: string }[]
  cost_estimates?: {
    metro_single: string
    bus_single: string
    taxi_base: string
    taxi_per_km: string
    daily_pass: string
    weekly_pass: string
  }
  quick_routes?: {
    airport_to_center: string
    center_to_attraction: string
    station_to_market: string
  }
  is_trending?: boolean
  is_new?: boolean
}

const CITIES: CityDetails[] = [
  // ============ INDIAN CITIES (25) ============
  {
    name: 'Mumbai', region: 'India', country: 'India', flag: '🇮🇳', lat: 19.076, lng: 72.878, score: 85, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['metro', 'bus', 'train', 'taxi', 'ferry', 'auto'], best_for: 'Business & Finance', peak_hours: '08:00-10:00,17:00-20:00', night_service: true,
    booking_links: [{ name: 'Mumbai Metro', url: 'https://mmrconline.org' }, { name: 'Best Bus', url: 'https://bestunder.org' }, { name: 'Indian Railway', url: 'https://irctc.co.in' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Hindi, Marathi, English', currency: '₹ INR', cost_level: 'Moderate', safety: 'Moderate', best_months: 'Oct-Mar',
    local_tips: ['Use Mumbai Metro for fast travel', 'Auto rickshaws are cheap but negotiate', 'Local trains are crowded at peak', 'Uber/Ola widely available'],
    attractions: ['Gateway of India', 'Marine Drive', 'Bandra-Worli Sea Link', 'Colaba Causeway', 'Elephanta Caves', 'Juhu Beach'],
    connectivity: { airport: 'BOM Chhatrapati Shivaji', railway: 'CST, Kurla, Dadar', metro_lines: 3, bus_network: 'Best Undertaking' },
    overview: 'Mumbai, the financial capital of India, is a bustling metropolis known for its business hubs, Bollywood film industry, and iconic landmarks.',
    transport_tips: ['Purchase Mumbai Metro card for seamless travel', 'Avoid local train rush hours (8-10AM, 5-8PM)', 'Black & yellow taxis are cheapest'],
    food: ['Vada Pav', 'Pav Bhaji', 'Bhelpuri', 'Poha', 'Kheema Pav'], shopping: ['Colaba Causeway', 'Linking Road', 'Crawford Market'], nightlife: ['Marine Drive', 'Bandra Bandstand'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '102' }],
    cost_estimates: { metro_single: '₹10-40', bus_single: '₹5-15', taxi_base: '₹25', taxi_per_km: '₹14', daily_pass: '₹100', weekly_pass: '₹500' },
    quick_routes: { airport_to_center: 'Chhatrapati Shivaji Airport → Gateway of India', center_to_attraction: 'Marine Drive → Bandra-Worli Sea Link', station_to_market: 'CST Station → Crawford Market' },
    is_trending: true, is_new: false
  },
  {
    name: 'Delhi', region: 'India', country: 'India', flag: '🇮🇳', lat: 28.704, lng: 77.102, score: 82, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['metro', 'bus', 'auto', 'taxi', 'train'], best_for: 'Heritage & Culture', peak_hours: '08:00-11:00,17:00-21:00', night_service: true,
    booking_links: [{ name: 'DMRC Metro', url: 'https://delhimetrorail.com' }, { name: 'DTC Bus', url: 'https://dtc.nic.in' }, { name: 'Indian Railway', url: 'https://irctc.co.in' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Hindi, English, Punjabi', currency: '₹ INR', cost_level: 'Budget', safety: 'Moderate', best_months: 'Oct-Mar',
    local_tips: ['Delhi Metro is excellent and cheap', 'Yellow/Amber line is busiest', 'Use DTC buses for cheap travel', 'Uber/Ola reliable'],
    attractions: ['Red Fort', 'India Gate', 'Qutub Minar', 'Humayun Tomb', 'Akshardham', 'Lotus Temple'],
    connectivity: { airport: 'DEL Indira Gandhi', railway: 'New Delhi, Old Delhi', metro_lines: 10, bus_network: 'DTC' },
    overview: 'Delhi, the capital of India, is a historic city blending ancient monuments with modern infrastructure.',
    transport_tips: ['Buy Delhi Metro Smart Card for discounts', 'Airport Express Line is fastest', 'Auto rickshaws need negotiation'],
    food: ['Chole Bhature', 'Paranthas', 'Butter Chicken', 'Kebabs'], shopping: ['Chandni Chowk', 'Sarojini Nagar', 'Karol Bagh'], nightlife: ['Hauz Khas', 'Connaught Place'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '102' }],
    cost_estimates: { metro_single: '₹8-50', bus_single: '₹5-20', taxi_base: '₹25', taxi_per_km: '₹12', daily_pass: '₹200', weekly_pass: '₹800' },
    quick_routes: { airport_to_center: 'IGI Airport → Connaught Place', center_to_attraction: 'Rajiv Chowk → Red Fort', station_to_market: 'New Delhi Station → Chandni Chowk' },
    is_trending: false, is_new: false
  },
  {
    name: 'Bangalore', region: 'India', country: 'India', flag: '🇮🇳', lat: 12.972, lng: 77.594, score: 78, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['metro', 'bus', 'taxi', 'bike', 'auto'], best_for: 'Tech Hub', peak_hours: '08:00-10:00,17:00-20:00', night_service: true,
    booking_links: [{ name: 'BMTC', url: 'https://mybmtc.karnataka.gov.in' }, { name: 'Namma Metro', url: 'https://bangaloremetrorail.com' }, { name: 'Rapido', url: 'https://www.rapido.bike' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Kannada, English, Hindi', currency: '₹ INR', cost_level: 'Moderate-High', safety: 'Good', best_months: 'Oct-Feb',
    local_tips: ['BMTC Volvo buses are comfortable', 'Namma Metro covers key areas', 'Traffic is bad, plan accordingly', 'Metro timing: 5AM-11PM'],
    attractions: ['Bangalore Palace', 'Cubbon Park', 'Lalbagh', 'MG Road', 'Bannerghatta National Park'],
    connectivity: { airport: 'BLR Kempegowda', railway: 'Yeswantpur, Krantivira', metro_lines: 2, bus_network: 'BMTC' },
    overview: 'Bangalore, the Silicon Valley of India, is a cosmopolitan city known for its pleasant weather and tech parks.',
    transport_tips: ['Use BMTC Vajra buses for comfort', 'Namma Metro Purple & Green lines', 'Bike rentals available via app'],
    food: ['Bisi Bele Bath', 'Ragi Mudde', 'Mango Payasam', 'Masala Dosa'], shopping: ['UB City', 'Commercial Street', 'Brigade Road'], nightlife: ['Indiranagar', 'Koramangala'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: '₹15-45', bus_single: '₹5-25', taxi_base: '₹30', taxi_per_km: '₹15', daily_pass: '₹120', weekly_pass: '₹600' },
    quick_routes: { airport_to_center: 'Kempegowda Airport → MG Road', center_to_attraction: 'UB City → Cubbon Park', station_to_market: 'Yeswantpur Station → Commercial Street' },
    is_trending: false, is_new: false
  },
  {
    name: 'Chennai', region: 'India', country: 'India', flag: '🇮🇳', lat: 13.082, lng: 80.271, score: 75, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['metro', 'bus', 'train', 'taxi', 'auto'], best_for: 'Film Industry', peak_hours: '08:00-10:00,17:00-19:00', night_service: false,
    booking_links: [{ name: 'CMRL Metro', url: 'https://cmrl.in' }, { name: 'MTC Bus', url: 'https://mtcbus.org' }, { name: 'Indian Railway', url: 'https://irctc.co.in' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Tamil, English', currency: '₹ INR', cost_level: 'Budget', safety: 'Good', best_months: 'Nov-Feb',
    local_tips: ['Metro Rail connects key areas', 'MTC buses cover entire city', 'Suburban trains are reliable', 'Beach road is scenic'],
    attractions: ['Marina Beach', 'Kapaleeshwarar Temple', 'Fort St. George', 'Mahabalipuram'],
    connectivity: { airport: 'MAA International', railway: 'Chennai Central', metro_lines: 2, bus_network: 'MTC' },
    overview: 'Chennai, the cultural capital of South India, is known for its classical dance forms and vibrant film industry.',
    transport_tips: ['CMRL Metro is clean and fast', 'Suburban trains (MEMU) connect suburbs', 'MTC buses are cheapest'],
    food: ['Idli', 'Dosa', 'Pongal', 'Filter Coffee'], shopping: ['T Nagar', 'Express Avenue', 'Marina Beach'], nightlife: ['Marina Beach', 'ECR Beaches'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: '₹10-40', bus_single: '₹5-15', taxi_base: '₹25', taxi_per_km: '₹12', daily_pass: '₹80', weekly_pass: '₹400' },
    quick_routes: { airport_to_center: 'Chennai Airport → Marina Beach', center_to_attraction: 'T Nagar → Kapaleeshwarar Temple', station_to_market: 'Chennai Central → T Nagar' },
    is_trending: false, is_new: false
  },
  {
    name: 'Hyderabad', region: 'India', country: 'India', flag: '🇮🇳', lat: 17.385, lng: 78.486, score: 73, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['metro', 'bus', 'taxi', 'auto', 'train'], best_for: 'IT & Cyberabad', peak_hours: '09:00-11:00,18:00-20:00', night_service: true,
    booking_links: [{ name: 'TSRTC', url: 'https://tsrtc.telangana.gov.in' }, { name: 'L&T Metro', url: 'https://hydmetrolrt.com' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Telugu, Urdu, Hindi', currency: '₹ INR', cost_level: 'Budget', safety: 'Good', best_months: 'Oct-Mar',
    local_tips: ['L&T Metro is fast and clean', 'TSRTC buses are everywhere', 'Auto rickshaws are cheap', 'MMTS for suburban rail'],
    attractions: ['Charminar', 'Golconda Fort', 'Hussaini Sagar', 'Salar Jung Museum'],
    connectivity: { airport: 'HYD Rajiv Gandhi', railway: 'Secunderabad', metro_lines: 3, bus_network: 'TSRTC' },
    overview: 'Hyderabad, the City of Pearls, is known for its rich Nizam heritage and IT hub (Cyberabad).',
    transport_tips: ['L&T Metro Red Line covers IT corridor', 'MMTS for suburban travel', 'TSRTC Express buses for intercity'],
    food: ['Hyderabadi Biryani', 'Haleem', 'Qubani Ka Meetha', 'Tahri'], shopping: ['Charminar Market', 'Laad Bazaar'], nightlife: ['Jubilee Hills', 'Banjara Hills'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: '₹10-35', bus_single: '₹5-12', taxi_base: '₹25', taxi_per_km: '₹13', daily_pass: '₹100', weekly_pass: '₹450' },
    quick_routes: { airport_to_center: 'RGIA Airport → Charminar', center_to_attraction: 'Secunderabad → Golconda Fort', station_to_market: 'Kachiguda Station → Laad Bazaar' },
    is_trending: false, is_new: false
  },
  {
    name: 'Kolkata', region: 'India', country: 'India', flag: '🇮🇳', lat: 22.572, lng: 88.363, score: 77, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['metro', 'bus', 'tram', 'taxi', 'ferry', 'auto'], best_for: 'Education & Culture', peak_hours: '07:00-10:00,16:00-19:00', night_service: false,
    booking_links: [{ name: 'Kolkata Metro', url: 'https://kolmetrorail.gov.in' }, { name: 'CTC Bus', url: 'https://ctcbustc.org' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Bengali, English, Hindi', currency: '₹ INR', cost_level: 'Budget', safety: 'Moderate', best_months: 'Oct-Mar',
    local_tips: ['Oldest metro in India', 'Tram rides are tourist attraction', 'Yellow taxis are iconic', 'Ferry across Hooghly is cheap'],
    attractions: ['Victoria Memorial', 'Howrah Bridge', 'Indian Museum', 'Kalighat Temple'],
    connectivity: { airport: 'CCU Netaji Subhas', railway: 'Howrah, Sealdah', metro_lines: 3, bus_network: 'CTC' },
    overview: 'Kolkata, the Cultural Capital of India, is known for its literary heritage and colonial architecture.',
    transport_tips: ['Kolkata Metro is oldest in India', 'Yellow ambassador taxis iconic', 'Tram rides are tourist attraction'],
    food: ['Rosogolla', 'Rasgulla', 'Kathi Roll', 'Phuchka'], shopping: ['New Market', 'Gariahat', 'South City Mall'], nightlife: ['Park Street', 'Camac Street'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '102' }],
    cost_estimates: { metro_single: '₹8-25', bus_single: '₹5-10', taxi_base: '₹25', taxi_per_km: '₹14', daily_pass: '₹60', weekly_pass: '₹300' },
    quick_routes: { airport_to_center: 'Netaji Airport → Park Street', center_to_attraction: 'Howrah → Victoria Memorial', station_to_market: 'Sealdah Station → New Market' },
    is_trending: false, is_new: false
  },
  {
    name: 'Pune', region: 'India', country: 'India', flag: '🇮🇳', lat: 18.520, lng: 73.856, score: 70, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'bike', 'metro', 'auto'], best_for: 'Education & IT', peak_hours: '08:00-10:00,18:00-20:00', night_service: true,
    booking_links: [{ name: 'PMPML', url: 'https://pmpml.org' }, { name: 'Pune Metro', url: 'https://punemetrorail.org' }, { name: 'Rapido', url: 'https://www.rapido.bike' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Marathi, Hindi, English', currency: '₹ INR', cost_level: 'Budget', safety: 'Good', best_months: 'Oct-Feb',
    local_tips: ['PMPML buses are cheap', 'Metro recently started', 'Bike rentals popular', 'Auto rickshaws available'],
    attractions: ['Shaniwar Wada', 'Aga Khan Palace', 'Sinhagad Fort', 'Khadakwasla Dam'],
    connectivity: { airport: 'PNQ Lohegaon', railway: 'Pune Junction', metro_lines: 2, bus_network: 'PMPML' },
    overview: 'Pune is a major educational hub and IT center with pleasant weather and rich history.',
    transport_tips: ['PMPML buses are cheap', 'Metro recently started', 'Bike rentals popular'],
    food: ['Misal Pav', 'Pav Bhaji', 'Vada Pav'], shopping: ['MG Road', 'Koregaon Park', 'Phoenix Mall'], nightlife: ['Koregaon Park', 'Viman Nagar'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: '₹10-30', bus_single: '₹5-12', taxi_base: '₹25', taxi_per_km: '₹12', daily_pass: '₹80', weekly_pass: '₹400' },
    quick_routes: { airport_to_center: 'PNQ Airport → Shaniwar Wada', center_to_attraction: 'Deccan → Aga Khan Palace', station_to_market: 'Pune Station → MG Road' },
    is_trending: false, is_new: false
  },
  {
    name: 'Ahmedabad', region: 'India', country: 'India', flag: '🇮🇳', lat: 23.022, lng: 72.571, score: 72, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'metro', 'taxi', 'auto'], best_for: 'Textile Hub', peak_hours: '08:00-10:00,17:00-19:00', night_service: false,
    booking_links: [{ name: 'AMTS', url: 'https://amts.in' }, { name: 'Gujarat Metro', url: 'https://gujaratmetrorail.com' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Gujarati, Hindi, English', currency: '₹ INR', cost_level: 'Budget', safety: 'Good', best_months: 'Nov-Feb',
    local_tips: ['Metro is modern and clean', 'AMTS buses cover city', 'Auto rickshaws cheap', 'BRTS dedicated lanes'],
    attractions: ['Sabarmati Ashram', 'Kankaria Lake', 'Adalaj Stepwell', 'Sidi Saiyyed Ni Jaali'],
    connectivity: { airport: 'AMD Sardar Vallabhbhai Patel', railway: 'Ahmedabad Junction', metro_lines: 2, bus_network: 'AMTS, DBRT' },
    overview: 'Ahmedabad is a major textile hub and one of India\'s fastest growing cities.',
    transport_tips: ['Metro is modern and clean', 'AMTS buses cover city', 'BRTS dedicated lanes'],
    food: ['Dhokla', 'Thepla', 'Khandvi', 'Fafda'], shopping: ['Law Garden', 'Manek Chowk', 'CG Road'], nightlife: ['SG Highway', 'Prahlad Nagar'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: '₹10-35', bus_single: '₹5-10', taxi_base: '₹25', taxi_per_km: '₹12', daily_pass: '₹70', weekly_pass: '₹350' },
    quick_routes: { airport_to_center: 'AMD Airport → Sabarmati Ashram', center_to_attraction: 'CG Road → Kankaria Lake', station_to_market: 'Ahmedabad Station → Law Garden' },
    is_trending: false, is_new: false
  },
  {
    name: 'Jaipur', region: 'India', country: 'India', flag: '🇮🇳', lat: 26.912, lng: 75.787, score: 68, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'auto', 'metro'], best_for: 'Tourism', peak_hours: '09:00-11:00,18:00-20:00', night_service: false,
    booking_links: [{ name: 'JCTSL', url: 'https://rtc.rajasthan.gov.in' }, { name: 'Jaipur Metro', url: 'https://jaipurmetrorail.in' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Rajasthani, Hindi, English', currency: '₹ INR', cost_level: 'Budget', safety: 'Good', best_months: 'Oct-Dec, Feb-Mar',
    local_tips: ['Metro covers old city', 'Auto rickshaws everywhere', 'Tourist buses available', 'BEST for city tour'],
    attractions: ['Hawa Mahal', 'Amer Fort', 'City Palace', 'Jantar Mantar'],
    connectivity: { airport: 'JAI Jaipur International', railway: 'Jaipur Junction', metro_lines: 2, bus_network: 'JCTSL' },
    overview: 'Jaipur, the Pink City, is known for its royal heritage and stunning architecture.',
    transport_tips: ['Metro covers old city', 'Auto rickshaws everywhere', 'Tourist buses available'],
    food: ['Dal Baati Churma', 'Ghewar', 'Laal Maas', 'Pyaaz Kachori'], shopping: ['Johari Bazaar', 'Bapu Bazaar', 'Chandpole Bazaar'], nightlife: ['C Scheme', 'MI Road'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: '₹10-30', bus_single: '₹5-10', taxi_base: '₹25', taxi_per_km: '₹12', daily_pass: '₹80', weekly_pass: '₹400' },
    quick_routes: { airport_to_center: 'Jaipur Airport → Hawa Mahal', center_to_attraction: 'MI Road → Amer Fort', station_to_market: 'Jaipur Station → Johari Bazaar' },
    is_trending: false, is_new: false
  },
  {
    name: 'Kochi', region: 'India', country: 'India', flag: '🇮🇳', lat: 9.931, lng: 76.267, score: 71, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['metro', 'bus', 'ferry', 'taxi', 'auto'], best_for: 'Port & Trade', peak_hours: '08:00-10:00,17:00-19:00', night_service: false,
    booking_links: [{ name: 'Kochi Metro', url: 'https://kochimetro.org' }, { name: 'KSRTC', url: 'https://ksrtconline.com' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Malayalam, English, Hindi', currency: '₹ INR', cost_level: 'Budget-Moderate', safety: 'Good', best_months: 'Sep-Mar',
    local_tips: ['Metro is excellent', 'Water taxis available', 'Ferry is scenic', 'KSRTC buses comfortable'],
    attractions: ['Fort Kochi', 'Mattancherry', 'Marine Drive', 'Hill Palace'],
    connectivity: { airport: 'COK Cochin International', railway: 'Ernakulam Town', metro_lines: 3, bus_network: 'KSRTC, Kochi Bus' },
    overview: 'Kochi is a major port city in Kerala known for its backwaters and trading history.',
    transport_tips: ['Metro is excellent', 'Water taxis available', 'Ferry is scenic'],
    food: ['Kerala Sadya', 'Appam', 'Idiyappam', 'Fish Curry'], shopping: ['MG Road', 'Broadway', 'Lulu Mall'], nightlife: ['Fort Kochi', 'Marine Drive'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: '₹10-40', bus_single: '₹5-15', taxi_base: '₹30', taxi_per_km: '₹15', daily_pass: '₹90', weekly_pass: '₹450' },
    quick_routes: { airport_to_center: 'Cochin Airport → Marine Drive', center_to_attraction: 'Ernakulam → Fort Kochi', station_to_market: 'Ernakulam Town → Lulu Mall' },
    is_trending: false, is_new: false
  },
  {
    name: 'Lucknow', region: 'India', country: 'India', flag: '🇮🇳', lat: 26.846, lng: 80.946, score: 65, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'auto', 'metro'], best_for: 'Culture & Politics', peak_hours: '08:00-10:00,17:00-19:00', night_service: false,
    booking_links: [{ name: 'Lucknow Metro', url: 'https://lucknowmetro.org' }, { name: 'UPSRTC', url: 'https://upsrtc.gov.in' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Hindi, Urdu, English', currency: '₹ INR', cost_level: 'Budget', safety: 'Good', best_months: 'Oct-Mar',
    local_tips: ['Metro is clean & fast', 'Auto rickshaws cheap', 'Tonga for tourists', 'Charbagh station'],
    attractions: ['Bara Imambara', 'Hazratganj', 'Rumi Darwaza', 'Chowk'],
    connectivity: { airport: 'LKO', railway: 'Charbagh', metro_lines: 1, bus_network: 'UPSRTC' },
    overview: 'Lucknow, the City of Nawabs, is known for its rich culture, cuisine, and historical monuments.',
    transport_tips: ['Metro is clean & fast', 'Auto rickshaws cheap', 'Tonga for tourists'],
    food: ['Tunday Kababi', 'Lucknowi Biryani', 'Kulcha', 'Sheermal'], shopping: ['Hazratganj', 'Aminabad', 'Chowk'], nightlife: ['Hazratganj', 'Gomti Nagar'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: '₹10-25', bus_single: '₹5-10', taxi_base: '₹25', taxi_per_km: '₹10', daily_pass: '₹60', weekly_pass: '₹300' },
    quick_routes: { airport_to_center: 'LKO Airport → Hazratganj', center_to_attraction: 'Charbagh → Bara Imambara', station_to_market: 'Lucknow Station → Aminabad' },
    is_trending: false, is_new: false
  },
  {
    name: 'Chandigarh', region: 'India', country: 'India', flag: '🇮🇳', lat: 30.733, lng: 76.779, score: 76, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'metro', 'auto'], best_for: 'Planned City', peak_hours: '08:00-10:00,17:00-19:00', night_service: false,
    booking_links: [{ name: 'Chandigarh Bus', url: 'https://chdbus.com' }, { name: 'Chandigarh Metro', url: 'https://chandigarhmetro.com' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Punjabi, Hindi, English', currency: '₹ INR', cost_level: 'Moderate', safety: 'Very Safe', best_months: 'Oct-Mar',
    local_tips: ['Very planned city', 'Metro is clean', 'Sector 17 for shopping', 'Autos available'],
    attractions: ['Rock Garden', 'Sukhna Lake', 'Rose Garden', 'Elante Mall'],
    connectivity: { airport: 'IXC', railway: 'Chandigarh Junction', metro_lines: 2, bus_network: 'Chandigarh Bus' },
    overview: 'Chandigarh is a beautifully planned city known for its architecture and cleanliness.',
    transport_tips: ['Very planned city', 'Metro is clean', 'Sector 17 for shopping'],
    food: ['Sarson Da Saag', 'Makki Di Roti', 'Butter Chicken', 'Lassi'], shopping: ['Sector 17', 'Elante Mall', 'Sector 22'], nightlife: ['Sector 17', 'Sector 26'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: '₹10-30', bus_single: '₹5-10', taxi_base: '₹25', taxi_per_km: '₹12', daily_pass: '₹80', weekly_pass: '₹400' },
    quick_routes: { airport_to_center: 'Chandigarh Airport → Sector 17', center_to_attraction: 'Sector 17 → Rock Garden', station_to_market: 'Chandigarh Station → Elante Mall' },
    is_trending: false, is_new: false
  },
  {
    name: 'Goa', region: 'India', country: 'India', flag: '🇮🇳', lat: 15.299, lng: 74.124, score: 58, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'bike', 'ferry', 'scooter'], best_for: 'Tourism & Beach', peak_hours: '10:00-12:00,18:00-21:00', night_service: true,
    booking_links: [{ name: 'Kadamba', url: 'https://ktcl.goa.nic.in' }, { name: 'Goa Tourism', url: 'https://goa-tourism.com' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Rapido', url: 'https://www.rapido.bike' }],
    timezone: 'IST (UTC+5:30)', language: 'Konkani, Portuguese, English', currency: '₹ INR', cost_level: 'Moderate', safety: 'Good', best_months: 'Oct-Mar',
    local_tips: ['Kadamba buses cheap', 'Rent scooters common', 'Taxis are pricey', 'Ferry to islands'],
    attractions: ['Baga Beach', 'Calangute', 'Dudhsagar Falls', 'Fort Aguada'],
    connectivity: { airport: 'GOI', railway: 'Madgaon, Vasco', metro_lines: 0, bus_network: 'Kadamba' },
    overview: 'Goa is India\'s beach paradise known for its Portuguese heritage and party culture.',
    transport_tips: ['Kadamba buses cheap', 'Rent scooters common', 'Taxis are pricey'],
    food: ['Fish Curry Rice', 'Prawns Ghee Roast', 'Bebinca', 'Feni'], shopping: ['Anjuna Flea Market', 'Mapusa Market', 'Margao'], nightlife: ['Baga Beach', 'Anjuna', 'Palolem'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '₹10-50', taxi_base: '₹50', taxi_per_km: '₹20', daily_pass: '₹200', weekly_pass: '₹1000' },
    quick_routes: { airport_to_center: 'GOI Airport → Calangute Beach', center_to_attraction: 'Mapusa → Fort Aguada', station_to_market: 'Madgaon Station → Anjuna' },
    is_trending: false, is_new: false
  },
  {
    name: 'Mysore', region: 'India', country: 'India', flag: '🇮🇳', lat: 12.295, lng: 76.639, score: 60, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'auto'], best_for: 'Heritage', peak_hours: '09:00-11:00,17:00-19:00', night_service: false,
    booking_links: [{ name: 'KSRTC', url: 'https://ksrtc.karnataka.gov.in' }, { name: 'Mysore Tourism', url: 'https://mysore.gov.in' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Kannada, English', currency: '₹ INR', cost_level: 'Budget', safety: 'Very Safe', best_months: 'Oct-Mar',
    local_tips: ['Tourist-friendly', 'Auto rickshaws cheap', 'Palace on weekends', 'Chamundi Hill'],
    attractions: ['Mysore Palace', 'Chamundi Temple', 'Brindavan Gardens', 'Mysore Zoo'],
    connectivity: { airport: 'MYQ', railway: 'Mysore Junction', metro_lines: 0, bus_network: 'KSRTC' },
    overview: 'Mysore is a heritage city known for its royal palace and silk industry.',
    transport_tips: ['Tourist-friendly', 'Auto rickshaws cheap', 'Palace on weekends'],
    food: ['Mysore Masala Dosa', 'Idli Vada', 'Mysore Pak', 'Filter Coffee'], shopping: ['Devaraja Market', 'MG Road', 'Sri Chamundeshwari'], nightlife: ['Mysore Palace', 'Brindavan Gardens'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '₹5-15', taxi_base: '₹25', taxi_per_km: '₹10', daily_pass: '₹50', weekly_pass: '₹250' },
    quick_routes: { airport_to_center: 'Mysore Airport → Mysore Palace', center_to_attraction: 'Devaraja Market → Chamundi Hill', station_to_market: 'Mysore Station → Devaraja Market' },
    is_trending: false, is_new: false
  },
  {
    name: 'Varanasi', region: 'India', country: 'India', flag: '🇮🇳', lat: 25.317, lng: 82.973, score: 55, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'auto', 'ferry'], best_for: 'Spiritual Tourism', peak_hours: '06:00-09:00,17:00-20:00', night_service: false,
    booking_links: [{ name: 'UPSRTC', url: 'https://upsrtc.gov.in' }, { name: 'Varanasi Tourism', url: 'https://varanasi.nic.in' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Hindi, English', currency: '₹ INR', cost_level: 'Budget', safety: 'Moderate', best_months: 'Oct-Mar',
    local_tips: ['Auto rickshaws for getting around', 'Boat rides on Ganges', 'Morning boat for Ganga Aarti', 'Cycle rickshaws in narrow lanes'],
    attractions: ['Kashi Vishwanath Temple', 'Ghats of Varanasi', 'Sarnath', 'Ramnagar Fort'],
    connectivity: { airport: 'VNS', railway: 'Varanasi Junction', metro_lines: 0, bus_network: 'UPSRTC' },
    overview: 'Varanasi is one of the oldest continuously inhabited cities and a major spiritual center.',
    transport_tips: ['Auto rickshaws for getting around', 'Boat rides on Ganges', 'Cycle rickshaws in narrow lanes'],
    food: ['Banarasi Paan', 'Chhena Ghi', 'Tamatar Chaat', 'Lassi'], shopping: ['Godowlia Chowk', 'Thatheri Bazaar', ' Vishwanath Temple'], nightlife: ['Ghats (evening)', 'Aarti'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '102' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '₹5-10', taxi_base: '₹25', taxi_per_km: '₹10', daily_pass: '₹40', weekly_pass: '₹200' },
    quick_routes: { airport_to_center: 'Varanasi Airport → Kashi Vishwanath', center_to_attraction: 'Godowlia → Dashashwamedh Ghat', station_to_market: 'Varanasi Station → Godowlia Chowk' },
    is_trending: false, is_new: false
  },
  {
    name: 'Shimla', region: 'India', country: 'India', flag: '🇮🇳', lat: 31.104, lng: 77.173, score: 62, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'toy train'], best_for: 'Hill Station', peak_hours: '10:00-13:00,15:00-18:00', night_service: false,
    booking_links: [{ name: 'HRTC', url: 'https://hrtcdm.org' }, { name: 'IRCTC', url: 'https://irctc.co.in' }],
    timezone: 'IST (UTC+5:30)', language: 'Hindi, English', currency: '₹ INR', cost_level: 'Moderate', safety: 'Good', best_months: 'Mar-Jun, Sep-Nov',
    local_tips: ['Kalka-Shimla toy train is scenic', 'Auto taxis available', 'Mall Road for shopping', 'Summer Hill walk'],
    attractions: ['The Mall', 'Jakhoo Temple', 'Christ Church', 'Ridge'],
    connectivity: { airport: 'SLV', railway: 'Kalka (narrow gauge)', metro_lines: 0, bus_network: 'HRTC' },
    overview: 'Shimla, the Queen of Hills, is a charming hill station with colonial heritage.',
    transport_tips: ['Kalka-Shimla toy train is scenic', 'Auto taxis available', 'Mall Road for shopping'],
    food: ['Channa Madira', 'Dham', 'Apple Pie', 'Hot Chocolate'],
    shopping: ['The Mall', 'Lakkar Bazaar', 'Shimla Shopping'],
    nightlife: ['The Mall', 'Cafe'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '₹10-30', taxi_base: '₹50', taxi_per_km: '₹15', daily_pass: '₹150', weekly_pass: '₹700' },
    quick_routes: { airport_to_center: 'Shimla Airport → The Mall', center_to_attraction: 'Mall Road → Jakhoo Temple', station_to_market: 'Kalka Station → The Mall' },
    is_trending: false, is_new: false
  },
  {
    name: 'Srinagar', region: 'India', country: 'India', flag: '🇮🇳', lat: 34.083, lng: 74.797, score: 58, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'shikara', 'auto'], best_for: 'Tourism & Nature', peak_hours: '10:00-13:00,16:00-19:00', night_service: false,
    booking_links: [{ name: 'JKSRTC', url: 'https://jkrtc.org' }, { name: 'Kashmir Tourism', url: 'https://kashmirtourism.gov.in' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Kashmiri, Urdu, Hindi', currency: '₹ INR', cost_level: 'Moderate', safety: 'Moderate', best_months: 'Apr-Oct',
    local_tips: ['Shikara rides on Dal Lake', 'Houseboat stays', 'Gulmarg day trip', 'Mughal Gardens'],
    attractions: ['Dal Lake', 'Mughal Gardens', 'Shalimar Bagh', 'Hazratbal Shrine'],
    connectivity: { airport: 'SXR Sheikh-ul-Alam', railway: 'Jammu Tawi (via)', metro_lines: 0, bus_network: 'JKSRTC' },
    overview: 'Srinagar is known for its stunning lakes, houseboats, and Mughal gardens.',
    transport_tips: ['Shikara rides on Dal Lake', 'Houseboat stays', 'Gulmarg day trip'],
    food: ['Rogan Josh', 'Yakhni', 'Wazwan', 'Kahwa'], shopping: ['Lal Chowk', ' Residency Road', 'Maharaj Bazar'], nightlife: ['Shikara evening', 'Houseboat'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '102' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '₹10-25', taxi_base: '₹50', taxi_per_km: '₹15', daily_pass: '₹200', weekly_pass: '₹1000' },
    quick_routes: { airport_to_center: 'Srinagar Airport → Dal Lake', center_to_attraction: 'Lal Chowk → Mughal Gardens', station_to_market: 'Jammu Tawi → Dal Lake' },
    is_trending: false, is_new: false
  },
  {
    name: 'Rishikesh', region: 'India', country: 'India', flag: '🇮🇳', lat: 30.086, lng: 78.267, score: 63, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'auto'], best_for: 'Yoga & Adventure', peak_hours: '06:00-09:00,17:00-20:00', night_service: false,
    booking_links: [{ name: 'UKRTC', url: 'https://ukroadways.com' }, { name: 'Rishikesh Tourism', url: 'https://rishikesh.nic.in' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Hindi, English', currency: '₹ INR', cost_level: 'Budget', safety: 'Good', best_months: 'Feb-Jun, Sep-Nov',
    local_tips: ['Ganga Aarti at Triveni Ghat', 'Yoga ashrams', 'River rafting', 'Beatles Ashram'],
    attractions: ['Laxman Jhula', 'Triveni Ghat', 'Beatles Ashram', 'Neelkanth Mahadev'],
    connectivity: { airport: 'DED Jolly Grant', railway: 'Haridwar (nearby)', metro_lines: 0, bus_network: 'UKRTC' },
    overview: 'Rishikesh is the Yoga Capital of the world and a hub for adventure sports.',
    transport_tips: ['Ganga Aarti at Triveni Ghat', 'Yoga ashrams', 'River rafting'],
    food: ['Ayurvedic Cuisine', 'Pahadi Food', 'Chai', 'Ragi'], shopping: ['Laxman Jhula Market', 'Triveni Market'], nightlife: ['Ganga Aarti', 'Cafe'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '₹5-15', taxi_base: '₹30', taxi_per_km: '₹12', daily_pass: '₹100', weekly_pass: '₹500' },
    quick_routes: { airport_to_center: 'Jolly Grant Airport → Laxman Jhula', center_to_attraction: 'Triveni Ghat → Beatles Ashram', station_to_market: 'Haridwar Station → Rishikesh' },
    is_trending: false, is_new: false
  },
  {
    name: 'Udaipur', region: 'India', country: 'India', flag: '🇮🇳', lat: 24.585, lng: 73.682, score: 67, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'auto'], best_for: 'Lake City', peak_hours: '09:00-12:00,16:00-19:00', night_service: false,
    booking_links: [{ name: 'Rajasthan Roadways', url: 'https://rtc.rajasthan.gov.in' }, { name: 'Udaipur Tourism', url: 'https://udaipur.gov.in' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Rajasthani, Hindi, English', currency: '₹ INR', cost_level: 'Moderate', safety: 'Good', best_months: 'Sep-Mar',
    local_tips: ['City Palace boat ride', 'Lake Pichola sunset', 'Fateh Sagar', 'Bagore Ki Haveli'],
    attractions: ['City Palace', 'Lake Pichola', 'Fateh Sagar', 'Jag Mandir'],
    connectivity: { airport: 'UDR', railway: 'Udaipur City', metro_lines: 0, bus_network: 'Rajasthan Roadways' },
    overview: 'Udaipur, the City of Lakes, is known for its royal palaces and beautiful lakes.',
    transport_tips: ['City Palace boat ride', 'Lake Pichola sunset', 'Fateh Sagar'],
    food: ['Dal Baati Churma', 'Ghewar', 'Kachori', 'Panchratna Dal'], shopping: ['Hathipole Market', 'Lake Palace Road', 'Bada Bazaar'], nightlife: ['Lake Pichola', 'City Palace'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '₹5-15', taxi_base: '₹30', taxi_per_km: '₹12', daily_pass: '₹100', weekly_pass: '₹500' },
    quick_routes: { airport_to_center: 'Udaipur Airport → City Palace', center_to_attraction: 'Hathipole → Lake Pichola', station_to_market: 'Udaipur Station → Hathipole' },
    is_trending: false, is_new: false
  },
  {
    name: 'Amritsar', region: 'India', country: 'India', flag: '🇮🇳', lat: 31.634, lng: 74.872, score: 64, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'auto'], best_for: 'Religious Tourism', peak_hours: '05:00-08:00,17:00-21:00', night_service: true,
    booking_links: [{ name: 'PSTDC', url: 'https://pstdc.com' }, { name: 'Amritsar Tourism', url: 'https://amritsartourism.com' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Punjabi, Hindi, English', currency: '₹ INR', cost_level: 'Budget', safety: 'Good', best_months: 'Oct-Mar',
    local_tips: ['Golden Temple visit (early morning)', 'Wagah Border ceremony', 'Jallianwala Bagh', 'Langar at Golden Temple'],
    attractions: ['Golden Temple', 'Wagah Border', 'Jallianwala Bagh', 'Durgiana Temple'],
    connectivity: { airport: 'ATQ Sri Guru Ram Dass Jee', railway: 'Amritsar Junction', metro_lines: 0, bus_network: 'PSTDC' },
    overview: 'Amritsar is a major spiritual center with the iconic Golden Temple.',
    transport_tips: ['Golden Temple visit (early morning)', 'Wagah Border ceremony', 'Langar at Golden Temple'],
    food: ['Amritsari Kulcha', 'Lassi', 'Fish', 'Makki Di Roti'], shopping: ['Lawrence Road', 'Hall Bazaar', 'Gobindgarh Fort'], nightlife: ['Golden Temple (evening)', 'Lawrence Road'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '₹5-10', taxi_base: '₹25', taxi_per_km: '₹10', daily_pass: '₹60', weekly_pass: '₹300' },
    quick_routes: { airport_to_center: 'ATQ Airport → Golden Temple', center_to_attraction: 'Lawrence Road → Wagah Border', station_to_market: 'Amritsar Station → Hall Bazaar' },
    is_trending: false, is_new: false
  },
  {
    name: 'Agra', region: 'India', country: 'India', flag: '🇮🇳', lat: 27.176, lng: 78.008, score: 57, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'auto', 'train'], best_for: 'Tourism', peak_hours: '08:00-10:00,16:00-19:00', night_service: false,
    booking_links: [{ name: 'UPSRTC', url: 'https://upsrtc.gov.in' }, { name: 'Indian Railway', url: 'https://irctc.co.in' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Hindi, English', currency: '₹ INR', cost_level: 'Budget', safety: 'Moderate', best_months: 'Oct-Mar',
    local_tips: ['Taj Mahal at sunrise', 'Agra Fort', 'Fatehpur Sikri day trip', 'Tonga rides near Taj'],
    attractions: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri', 'Itimad-ud-Daulah'],
    connectivity: { airport: 'AGR', railway: 'Agra Cantonment', metro_lines: 0, bus_network: 'UPSRTC' },
    overview: 'Agra is world-famous for the Taj Mahal and other Mughal monuments.',
    transport_tips: ['Taj Mahal at sunrise', 'Agra Fort', 'Fatehpur Sikri day trip'],
    food: ['Petha', 'Dal Moth', 'Agra Chaat', 'Bedai'], shopping: ['Sadar Bazaar', 'Kinari Bazaar', 'Taj Mahal Road'], nightlife: ['Taj (sunset)', 'MG Road'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '102' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '₹5-10', taxi_base: '₹30', taxi_per_km: '₹12', daily_pass: '₹150', weekly_pass: '₹700' },
    quick_routes: { airport_to_center: 'Agra Airport → Taj Mahal', center_to_attraction: 'Sadar Bazaar → Agra Fort', station_to_market: 'Agra Station → Kinari Bazaar' },
    is_trending: false, is_new: false
  },
  {
    name: 'Darjeeling', region: 'India', country: 'India', flag: '🇮🇳', lat: 27.036, lng: 88.263, score: 61, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'toy train', 'ropeway'], best_for: 'Hill Station', peak_hours: '09:00-12:00,14:00-17:00', night_service: false,
    booking_links: [{ name: 'West Bengal Transport', url: 'https://wbbtcl.com' }, { name: 'Darjeeling Tourism', url: 'https://darjeeling.gov.in' }],
    timezone: 'IST (UTC+5:30)', language: 'Nepali, Hindi, English', currency: '₹ INR', cost_level: 'Moderate', safety: 'Good', best_months: 'Mar-Jun, Sep-Nov',
    local_tips: ['Toy Train ride', 'Sunrise at Tiger Hill', 'Tea gardens', 'Peace Pagoda'],
    attractions: ['Tiger Hill', 'Toy Train', 'Batasia Loop', 'Mall Road'],
    connectivity: { airport: 'IXB Bagdogra', railway: 'New Jalpaiguri', metro_lines: 0, bus_network: 'West Bengal Transport' },
    overview: 'Darjeeling is famous for its tea gardens and the UNESCO Toy Train.',
    transport_tips: ['Toy Train ride', 'Sunrise at Tiger Hill', 'Tea gardens'],
    food: ['Momos', 'Thukpa', 'Tea & Snacks', 'Sel Roti'], shopping: ['Mall Road', 'Chowk Bazaar', 'Tea Gardens'], nightlife: ['Mall Road', 'Cafe'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '102' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '₹10-30', taxi_base: '₹50', taxi_per_km: '₹15', daily_pass: '₹150', weekly_pass: '₹700' },
    quick_routes: { airport_to_center: 'Bagdogra Airport → Darjeeling Mall', center_to_attraction: 'Mall Road → Tiger Hill', station_to_market: 'NJP Station → Darjeeling' },
    is_trending: false, is_new: false
  },
  {
    name: 'Leh', region: 'India', country: 'India', flag: '🇮🇳', lat: 34.152, lng: 77.576, score: 52, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'jeep'], best_for: 'Adventure & Nature', peak_hours: '09:00-12:00,14:00-17:00', night_service: false,
    booking_links: [{ name: 'JKSRTC', url: 'https://jkrtc.org' }, { name: 'Leh Tourism', url: 'https://leh.nic.in' }],
    timezone: 'IST (UTC+5:30)', language: 'Ladakhi, Hindi, English', currency: '₹ INR', cost_level: 'Moderate-High', safety: 'Good', best_months: 'May-Sep',
    local_tips: ['Pangong Lake day trip', 'Khardung La pass', 'Magnetic Hill', 'Shanti Stupa'],
    attractions: ['Pangong Lake', 'Khardung La', 'Magnetic Hill', 'Hemis Monastery'],
    connectivity: { airport: 'IXL Kushok Bakula', railway: 'Leh (new)', metro_lines: 0, bus_network: 'JKSRTC' },
    overview: 'Leh is a high-altitude desert known for stunning mountain landscapes.',
    transport_tips: ['Pangong Lake day trip', 'Khardung La pass', 'Acclimatize first'],
    food: ['Momos', 'Thukpa', 'Butter Tea', 'Apricot'], shopping: ['Main Market', 'Leh Bazaar'], nightlife: ['Leh Market', 'Cafe'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '102' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '₹50-200', taxi_base: '₹100', taxi_per_km: '₹30', daily_pass: '₹500', weekly_pass: '₹2500' },
    quick_routes: { airport_to_center: 'Leh Airport → Main Market', center_to_attraction: 'Leh → Pangong Lake', station_to_market: 'Leh → Leh Bazaar' },
    is_trending: false, is_new: false
  },
  {
    name: 'Madurai', region: 'India', country: 'India', flag: '🇮🇳', lat: 9.925, lng: 78.119, score: 66, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'auto', 'train'], best_for: 'Temple City', peak_hours: '06:00-09:00,17:00-20:00', night_service: false,
    booking_links: [{ name: 'TNSTC', url: 'https://tnstc.in' }, { name: 'Madurai Tourism', url: 'https://maduraitourism.org' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Tamil, English', currency: '₹ INR', cost_level: 'Budget', safety: 'Good', best_months: 'Oct-Mar',
    local_tips: ['Meenakshi Temple visit', 'Thirumalai Nayakar Palace', 'Sunset at Mariamman Temple', 'Anna Nagar Tower'],
    attractions: ['Meenakshi Temple', 'Thirumalai Nayakar Palace', 'Gandhi Museum', 'Vaigai Dam'],
    connectivity: { airport: 'IXM', railway: 'Madurai Junction', metro_lines: 0, bus_network: 'TNSTC' },
    overview: 'Madurai is one of the oldest continuously inhabited cities and a major pilgrimage center.',
    transport_tips: ['Meenakshi Temple visit', 'Thirumalai Nayakar Palace', 'Anna Nagar Tower'],
    food: ['Idli', 'Dosa', 'Parotta', 'Jigarthanda'], shopping: ['Vaigai Market', 'Town Hall Road', 'Masi Street'], nightlife: ['Meenakshi Temple', 'Vaigai'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '₹5-15', taxi_base: '₹25', taxi_per_km: '₹10', daily_pass: '₹50', weekly_pass: '₹250' },
    quick_routes: { airport_to_center: 'Madurai Airport → Meenakshi Temple', center_to_attraction: 'Town Hall → Thirumalai Palace', station_to_market: 'Madurai Station → Vaigai Market' },
    is_trending: false, is_new: false
  },
  {
    name: 'Vijayawada', region: 'India', country: 'India', flag: '🇮🇳', lat: 16.506, lng: 80.648, score: 68, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'auto', 'train', 'metro'], best_for: 'Business Hub', peak_hours: '08:00-10:00,17:00-19:00', night_service: false,
    booking_links: [{ name: 'APSRTC', url: 'https://apsrtc.gov.in' }, { name: 'Vijayawada Tourism', url: 'https://vijayawada.gov.in' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Telugu, English', currency: '₹ INR', cost_level: 'Budget', safety: 'Good', best_months: 'Oct-Mar',
    local_tips: ['Kanaka Durga Temple', 'Prakasam Barrage', 'Bhavani Island', 'Undavalli Caves'],
    attractions: ['Kanaka Durga Temple', 'Prakasam Barrage', 'Undavalli Caves', 'Gandhi Hill'],
    connectivity: { airport: 'VGA', railway: 'Vijayawada Junction', metro_lines: 1, bus_network: 'APSRTC' },
    overview: 'Vijayawada is a major city in Andhra Pradesh known for its rich culture.',
    transport_tips: ['Kanaka Durga Temple', 'Prakasam Barrage', 'Undavalli Caves'],
    food: ['Pulihora', 'Gongura Chicken', 'Dosa', 'Pesarattu'], shopping: ['Besant Road', 'MG Road', 'PVP Square'], nightlife: ['River View', 'MG Road'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: '₹10-30', bus_single: '₹5-15', taxi_base: '₹25', taxi_per_km: '₹12', daily_pass: '₹70', weekly_pass: '₹350' },
    quick_routes: { airport_to_center: 'Vijayawada Airport → MG Road', center_to_attraction: 'MG Road → Kanaka Durga Temple', station_to_market: 'Vijayawada Station → Besant Road' },
    is_trending: false, is_new: false
  },
  {
    name: 'Guwahati', region: 'India', country: 'India', flag: '🇮🇳', lat: 26.144, lng: 91.736, score: 63, timezone_iana: 'Asia/Kolkata',
    transport_modes: ['bus', 'taxi', 'auto', 'metro', 'ferry'], best_for: 'Gateway to Northeast', peak_hours: '08:00-10:00,17:00-19:00', night_service: true,
    booking_links: [{ name: 'ASTC', url: 'https://astc.in' }, { name: 'Guwahati Metro', url: 'https://guwahatimetro.com' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Ola', url: 'https://www.olacabs.com' }],
    timezone: 'IST (UTC+5:30)', language: 'Assamese, Hindi, English', currency: '₹ INR', cost_level: 'Budget', safety: 'Good', best_months: 'Oct-Apr',
    local_tips: ['Kamakhya Temple', 'Guwahati Zoo', 'Brahmaputra Cruise', 'Sualsuk Ali'],
    attractions: ['Kamakhya Temple', 'Guwahati Zoo', 'Umananda Temple', 'Brahmaputra River'],
    connectivity: { airport: 'GAU Lokapriya Gopinath Bordoloi', railway: 'Guwahati Junction', metro_lines: 2, bus_network: 'ASTC' },
    overview: 'Guwahati is the gateway to Northeast India and a major cultural center.',
    transport_tips: ['Kamakhya Temple', 'Guwahati Zoo', 'Brahmaputra Cruise'],
    food: ['Khar', 'Masor Tenga', 'Paroti', 'Assam Tea'], shopping: ['Paltan Bazaar', 'GS Road', 'Nehu Market'], nightlife: ['GS Road', 'Brahmaputra'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '108' }],
    cost_estimates: { metro_single: '₹10-30', bus_single: '₹5-15', taxi_base: '₹25', taxi_per_km: '₹12', daily_pass: '₹80', weekly_pass: '₹400' },
    quick_routes: { airport_to_center: 'GAU Airport → GS Road', center_to_attraction: 'Paltan Bazaar → Kamakhya Temple', station_to_market: 'Guwahati Station → Paltan Bazaar' },
    is_trending: false, is_new: false
  },
  // ============ INTERNATIONAL CITIES (29) ============
  {
    name: 'London', region: 'Europe', country: 'UK', flag: '🇬🇧', lat: 51.507, lng: -0.127, score: 95, timezone_iana: 'Europe/London',
    transport_modes: ['metro', 'bus', 'train', 'taxi', 'bike', 'ferry'], best_for: 'Global Finance', peak_hours: '07:30-09:30,17:00-19:00', night_service: true,
    booking_links: [{ name: 'TfL', url: 'https://tfl.gov.uk' }, { name: 'Trainline', url: 'https://thetrainline.com' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Bolt', url: 'https://bolt.eu' }, { name: 'Citymapper', url: 'https://citymapper.com' }],
    timezone: 'GMT/BST (UTC+0/+1)', language: 'English', currency: '£ GBP', cost_level: 'Very High', safety: 'Good', best_months: 'May-Sep',
    local_tips: ['Oyster card for all transport', 'Avoid rush hours', 'Night Tube on weekends', 'Boris Bikes available'],
    attractions: ['Big Ben', 'Tower Bridge', 'British Museum', 'Buckingham Palace', 'Tower of London', 'London Eye'],
    connectivity: { airport: 'LHR, LGW, STN, LTN', railway: "King's Cross, Paddington", metro_lines: 11, bus_network: 'TfL Bus' },
    overview: 'London, a global capital of finance, culture, and history, offers world-class museums and royal palaces.',
    transport_tips: ['Oyster card or Contactless payment', 'Travelcard for unlimited rides', 'Night Tube Friday-Saturday'],
    food: ['Fish & Chips', 'Full English Breakfast', 'Afternoon Tea', 'Chicken Tikka Masala'], shopping: ['Oxford Street', 'Regent Street', 'Harrods'], nightlife: ['Soho', 'Shoreditch', 'Camden'],
    emergency_contacts: [{ name: 'Emergency', number: '999' }, { name: 'Police', number: '101' }],
    cost_estimates: { metro_single: '£2.40-6.70', bus_single: '£1.75', taxi_base: '£3.20', taxi_per_km: '£2.60', daily_pass: '£7.70', weekly_pass: '£36.10' },
    quick_routes: { airport_to_center: 'Heathrow Airport → Central London', center_to_attraction: 'Kings Cross → Tower Bridge', station_to_market: 'Liverpool St → Camden Market' },
    is_trending: true, is_new: false
  },
  {
    name: 'Tokyo', region: 'Asia', country: 'Japan', flag: '🇯🇵', lat: 35.676, lng: 139.650, score: 98, timezone_iana: 'Asia/Tokyo',
    transport_modes: ['metro', 'train', 'bus', 'taxi', 'bike'], best_for: 'Technology', peak_hours: '08:00-09:30,18:00-20:00', night_service: true,
    booking_links: [{ name: 'Tokyo Metro', url: 'https://tokyometro.jp' }, { name: 'JR Pass', url: 'https://japanrailpass.com' }, { name: 'Suica', url: 'https://jreast.co.jp' }, { name: 'Google Maps', url: 'https://maps.google.com' }],
    timezone: 'JST (UTC+9)', language: 'Japanese, English', currency: '¥ JPY', cost_level: 'High', safety: 'Very Safe', best_months: 'Mar-May, Oct-Nov',
    local_tips: ['JR Pass for tourists', 'Metro is punctual to second', 'Suica card for all transport', 'Avoid rush 8-9AM'],
    attractions: ['Tokyo Tower', 'Senso-ji Temple', 'Shibuya Crossing', 'Tokyo Skytree', 'Meiji Shrine', 'Akihabara'],
    connectivity: { airport: 'NRT Narita, HND Haneda', railway: 'Tokyo Station', metro_lines: 13, bus_network: 'Toei, JR' },
    overview: 'Tokyo, a futuristic metropolis, blends ancient temples with cutting-edge technology.',
    transport_tips: ['Japan Rail Pass essential for tourists', 'Suica/Pasmo IC cards', 'Metro runs until midnight'],
    food: ['Sushi', 'Ramen', 'Tempura', 'Okonomiyaki'], shopping: ['Shibuya', 'Shinjuku', 'Ginza', 'Akihabara'], nightlife: ['Shinjuku', 'Roppongi', 'Shibuya'],
    emergency_contacts: [{ name: 'Police', number: '110' }, { name: 'Ambulance', number: '119' }],
    cost_estimates: { metro_single: '¥170-320', bus_single: '¥220', taxi_base: '¥500', taxi_per_km: '¥90', daily_pass: '¥1500', weekly_pass: '¥7000' },
    quick_routes: { airport_to_center: 'Narita Airport → Tokyo Station', center_to_attraction: 'Shinjuku → Senso-ji Temple', station_to_market: 'Tokyo Station → Akihabara' },
    is_trending: true, is_new: false
  },
  {
    name: 'Singapore', region: 'Asia', country: 'Singapore', flag: '🇸🇬', lat: 1.352, lng: 103.819, score: 94, timezone_iana: 'Asia/Singapore',
    transport_modes: ['metro', 'bus', 'taxi'], best_for: 'Business Hub', peak_hours: '08:00-09:00,18:00-19:00', night_service: false,
    booking_links: [{ name: 'LTA', url: 'https://lta.gov.sg' }, { name: 'SBS Transit', url: 'https://sbstransit.com.sg' }, { name: 'Grab', url: 'https://www.grab.com' }, { name: 'Gojek', url: 'https://www.gojek.com' }],
    timezone: 'SGT (UTC+8)', language: 'English, Mandarin, Malay', currency: 'S$ SGD', cost_level: 'High', safety: 'Very Safe', best_months: 'Feb-Apr',
    local_tips: ['EZ-Link card essential', 'MRT is excellent', 'Taxi/Grab cheap', 'No rush hour like other cities'],
    attractions: ['Marina Bay Sands', 'Gardens by the Bay', 'Sentosa Island', 'Orchard Road', 'Universal Studios'],
    connectivity: { airport: 'SIN Changi', railway: 'Raffles Place', metro_lines: 6, bus_network: 'SBS, SMRT' },
    overview: 'Singapore is a clean and safe city-state with world-class attractions and diverse food.',
    transport_tips: ['EZ-Link card for MRT & bus', 'Grab is widely available', 'MRT covers all major areas'],
    food: ['Chili Crab', 'Hainanese Chicken Rice', 'Laksa', 'Kaya Toast'], shopping: ['Orchard Road', 'Marina Bay Sands', 'Chinatown'], nightlife: ['Clarke Quay', 'Marina Bay', 'Orchard Road'],
    emergency_contacts: [{ name: 'Police', number: '999' }, { name: 'Ambulance', number: '995' }],
    cost_estimates: { metro_single: 'S$1.40-2.10', bus_single: 'S$0.90-2.20', taxi_base: 'S$3.20', taxi_per_km: 'S$0.50', daily_pass: 'S$10', weekly_pass: 'S$45' },
    quick_routes: { airport_to_center: 'Changi Airport → Marina Bay', center_to_attraction: 'Raffles Place → Gardens by the Bay', station_to_market: 'Orchard → Chinatown' },
    is_trending: true, is_new: false
  },
  {
    name: 'New York', region: 'Americas', country: 'USA', flag: '🇺🇸', lat: 40.712, lng: -74.006, score: 90, timezone_iana: 'America/New_York',
    transport_modes: ['metro', 'bus', 'taxi', 'ferry', 'bike'], best_for: 'Finance & Media', peak_hours: '07:30-09:30,17:00-19:00', night_service: true,
    booking_links: [{ name: 'MTA', url: 'https://mta.info' }, { name: 'Amtrak', url: 'https://amtrak.com' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Lyft', url: 'https://www.lyft.com' }, { name: 'Citymapper', url: 'https://citymapper.com' }],
    timezone: 'EST/EDT (UTC-5/-4)', language: 'English, Spanish', currency: '$ USD', cost_level: 'Very High', safety: 'Moderate', best_months: 'Apr-Jun, Sep-Nov',
    local_tips: ['MetroCard for subway/bus', 'Subway runs 24/7', 'Yellow cabs iconic', 'Citi Bike everywhere'],
    attractions: ['Statue of Liberty', 'Central Park', 'Times Square', 'Empire State Building', 'Brooklyn Bridge'],
    connectivity: { airport: 'JFK, LGA, EWR', railway: 'Penn Station, Grand Central', metro_lines: 27, bus_network: 'MTA' },
    overview: 'New York City, The Big Apple, is a global hub for finance, media, arts, and entertainment.',
    transport_tips: ['MetroCard or OMNY for subway', 'Subway operates 24/7', 'NYC Ferry to boroughs'],
    food: ['Pizza', 'Bagels', 'Cheesecake', 'NYC Biryani'], shopping: ['Fifth Avenue', 'SoHo', 'Brooklyn Flea'], nightlife: ['Times Square', 'Williamsburg', 'Greenwich Village'],
    emergency_contacts: [{ name: 'Emergency', number: '911' }, { name: 'Non-Emergency', number: '311' }],
    cost_estimates: { metro_single: '$2.90', bus_single: '$2.75', taxi_base: '$3.50', taxi_per_km: '$2.50', daily_pass: '$7.50', weekly_pass: '$33' },
    quick_routes: { airport_to_center: 'JFK Airport → Times Square', center_to_attraction: 'Grand Central → Central Park', station_to_market: 'Penn Station → Chelsea Market' },
    is_trending: true, is_new: false
  },
  {
    name: 'Paris', region: 'Europe', country: 'France', flag: '🇫🇷', lat: 48.856, lng: 2.352, score: 92, timezone_iana: 'Europe/Paris',
    transport_modes: ['metro', 'bus', 'train', 'bike', 'taxi'], best_for: 'Tourism & Culture', peak_hours: '08:00-09:30,17:30-19:30', night_service: false,
    booking_links: [{ name: 'RATP', url: 'https://ratp.fr' }, { name: 'SNCF', url: 'https://sncf.com' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Bolt', url: 'https://bolt.eu' }],
    timezone: 'CET/CEST (UTC+1/+2)', language: 'French, English', currency: '€ EUR', cost_level: 'High', safety: 'Moderate', best_months: 'Apr-Jun, Sep-Oct',
    local_tips: ['Navigo pass for all transport', 'Metro is fastest way', 'Vélib for bikes', 'Avoid metro at night alone'],
    attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Champs-Élysées', 'Arc de Triomphe'],
    connectivity: { airport: 'CDG Charles de Gaulle, ORY Orly', railway: 'Gare du Nord', metro_lines: 16, bus_network: 'RATP' },
    overview: 'Paris, the City of Light, is famous for art, fashion, gastronomy, and iconic landmarks.',
    transport_tips: ['Navigo Découverte card', 'Metro is fastest transport', 'RER B to airports'],
    food: ['Croissants', 'Baguettes', 'Crème Brûlée', 'Coq au Vin'], shopping: ['Champs-Élysées', 'Le Marais', 'Galeries Lafayette'], nightlife: ['Champs-Élysées', 'Le Marais', 'Latin Quarter'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '17' }],
    cost_estimates: { metro_single: '€1.90-2.50', bus_single: '€2.00', taxi_base: '€4.10', taxi_per_km: '€1.30', daily_pass: '€7.50', weekly_pass: '€22.80' },
    quick_routes: { airport_to_center: 'CDG Airport → Champs-Élysées', center_to_attraction: 'Châtelet → Eiffel Tower', station_to_market: 'Gare du Nord → Le Marais' },
    is_trending: true, is_new: false
  },
  {
    name: 'Dubai', region: 'Middle East', country: 'UAE', flag: '🇦🇪', lat: 25.204, lng: 55.270, score: 88, timezone_iana: 'Asia/Dubai',
    transport_modes: ['metro', 'bus', 'taxi', 'tram'], best_for: 'Business & Shopping', peak_hours: '07:30-09:00,17:00-19:00', night_service: true,
    booking_links: [{ name: 'RTA', url: 'https://rta.ae' }, { name: 'Dubai Metro', url: 'https://dubaimetro.com' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Careem', url: 'https://www.careem.com' }],
    timezone: 'GST (UTC+4)', language: 'Arabic, English, Hindi', currency: 'د.إ AED', cost_level: 'High', safety: 'Very Safe', best_months: 'Nov-Mar',
    local_tips: ['Nol card for metro/bus', 'Metro has Gold Class', 'Taxi/Uber cheap', 'Dubai Tram connects metro'],
    attractions: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall', 'Dubai Marina', 'Desert Safari'],
    connectivity: { airport: 'DXB, DWC', railway: 'Union Station', metro_lines: 3, bus_network: 'RTA' },
    overview: 'Dubai is a futuristic city in the desert with luxury shopping and ultramodern architecture.',
    transport_tips: ['Nol card essential for metro', 'Metro has Gold & Women cabin', 'Taxi meters start low'],
    food: ['Shawarma', 'Falafel', 'Emirati cuisine', 'Seafood'], shopping: ['Dubai Mall', 'Mall of Emirates', 'Gold Souk'], nightlife: ['Dubai Marina', 'JBR Beach', 'Downtown Dubai'],
    emergency_contacts: [{ name: 'Police', number: '999' }, { name: 'Ambulance', number: '998' }],
    cost_estimates: { metro_single: 'AED 4-8', bus_single: 'AED 3-7', taxi_base: 'AED 12', taxi_per_km: 'AED 2.5', daily_pass: 'AED 22', weekly_pass: 'AED 80' },
    quick_routes: { airport_to_center: 'DXB Airport → Burj Khalifa', center_to_attraction: 'Dubai Mall → Palm Jumeirah', station_to_market: 'Union Station → Gold Souk' },
    is_trending: false, is_new: false
  },
  {
    name: 'Sydney', region: 'Oceania', country: 'Australia', flag: '🇦🇺', lat: -33.868, lng: 151.209, score: 86, timezone_iana: 'Australia/Sydney',
    transport_modes: ['metro', 'bus', 'ferry', 'train', 'taxi'], best_for: 'Harbor City', peak_hours: '07:30-09:00,17:00-18:30', night_service: true,
    booking_links: [{ name: 'Transport NSW', url: 'https://transportnsw.info' }, { name: 'Uber', url: 'https://uber.com' }, { name: '13 CABS', url: 'https://www.13cabs.com.au' }, { name: 'Citymapper', url: 'https://citymapper.com' }],
    timezone: 'AEST/AEDT (UTC+10/+11)', language: 'English', currency: '$ AUD', cost_level: 'High', safety: 'Good', best_months: 'Sep-Nov, Mar-May',
    local_tips: ['Opal card for all transport', 'Ferry to Manly is scenic', 'Metro recently expanded', 'Light rail available'],
    attractions: ['Sydney Opera House', 'Harbour Bridge', 'Bondi Beach', 'Taronga Zoo', 'Blue Mountains'],
    connectivity: { airport: 'SYD Kingsford Smith', railway: 'Central Station', metro_lines: 1, bus_network: 'Sydney Bus' },
    overview: 'Sydney is famous for its stunning harbor, iconic Opera House, and beautiful beaches.',
    transport_tips: ['Opal card for all transport', 'Ferries are scenic transport', 'Metro M1 line new'],
    food: ['Tim Tam Slam', 'Vegemite', 'Meat Pie', 'Fresh Seafood'], shopping: ['Queen Victoria Building', 'Pitt Street Mall', 'Bondi Markets'], nightlife: ['The Rocks', 'Darling Harbour', 'Oxford Street'],
    emergency_contacts: [{ name: 'Emergency', number: '000' }, { name: 'Police', number: '131 444' }],
    cost_estimates: { metro_single: 'A$3.60-4.90', bus_single: 'A$2.40-4.50', taxi_base: 'A$4.20', taxi_per_km: 'A$2.75', daily_pass: 'A$8.65', weekly_pass: 'A$50' },
    quick_routes: { airport_to_center: 'SYD Airport → Circular Quay', center_to_attraction: 'Central → Bondi Beach', station_to_market: 'Central → Paddington Market' },
    is_trending: false, is_new: false
  },
  {
    name: 'Berlin', region: 'Europe', country: 'Germany', flag: '🇩🇪', lat: 52.520, lng: 13.405, score: 89, timezone_iana: 'Europe/Berlin',
    transport_modes: ['metro', 'bus', 'tram', 'train', 'bike'], best_for: 'Arts & History', peak_hours: '08:00-09:30,16:30-18:30', night_service: true,
    booking_links: [{ name: 'BVG', url: 'https://bvg.de' }, { name: 'DB', url: 'https://bahn.com' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Bolt', url: 'https://bolt.eu' }],
    timezone: 'CET/CEST (UTC+1/+2)', language: 'German, English', currency: '€ EUR', cost_level: 'Moderate', safety: 'Good', best_months: 'May-Sep',
    local_tips: ['BVG app for tickets', 'U-Bahn + S-Bahn extensive', 'Fahrrad for bikes', 'Tickets must be validated'],
    attractions: ['Brandenburg Gate', 'Berlin Wall', 'Museum Island', 'Checkpoint Charlie', 'East Side Gallery'],
    connectivity: { airport: 'BER Berlin Brandenburg', railway: 'Hauptbahnhof', metro_lines: 10, bus_network: 'BVG' },
    overview: 'Berlin is a city of art, history, and vibrant nightlife with rich WWII history.',
    transport_tips: ['BVG tickets via app', 'U-Bahn (subway) + S-Bahn (train)', 'Fahrrad (bike) everywhere'],
    food: ['Currywurst', 'Döner Kebab', 'Schnitzel', 'Brezen'], shopping: ['Kurfürstendamm', 'Mitte', 'Hackescher Markt'], nightlife: ['Kreuzberg', 'Friedrichshain', 'Berghain'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '110' }],
    cost_estimates: { metro_single: '€2.90-3.80', bus_single: '€2.90', taxi_base: '€4.00', taxi_per_km: '€2.50', daily_pass: '€8.80', weekly_pass: '€33' },
    quick_routes: { airport_to_center: 'BER Airport → Brandenburg Gate', center_to_attraction: 'Mitte → East Side Gallery', station_to_market: 'Hauptbahnhof → Hackescher Markt' },
    is_trending: false, is_new: false
  },
  {
    name: 'Hong Kong', region: 'Asia', country: 'China', flag: '🇭🇰', lat: 22.319, lng: 114.169, score: 91, timezone_iana: 'Asia/Hong_Kong',
    transport_modes: ['metro', 'bus', 'ferry', 'taxi', 'tram'], best_for: 'Finance & Shopping', peak_hours: '08:00-09:30,18:00-20:00', night_service: true,
    booking_links: [{ name: 'MTR', url: 'https://mtr.com.hk' }, { name: 'Octopus', url: 'https://octopus.com.hk' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Citymapper', url: 'https://citymapper.com' }],
    timezone: 'HKT (UTC+8)', language: 'Cantonese, English, Mandarin', currency: '$ HKD', cost_level: 'High', safety: 'Very Safe', best_months: 'Oct-Dec, Mar-May',
    local_tips: ['Octopus card essential', 'MTR is world-class', 'Tram for old Hong Kong', 'Minibuses are fast'],
    attractions: ['Victoria Peak', 'Disneyland', 'Temple Street', 'Star Ferry', 'Victoria Harbour'],
    connectivity: { airport: 'HKG', railway: 'CentralStation', metro_lines: 10, bus_network: 'KMB, NWFB' },
    overview: 'Hong Kong is a bustling metropolis known for its finance, shopping, and stunning harbor.',
    transport_tips: ['Octopus card essential', 'MTR is world-class', 'Tram for old Hong Kong'],
    food: ['Dim Sum', 'Egg Waffles', 'Hong Kong Style', 'Seafood'], shopping: ['Causeway Bay', 'Tsim Sha Tsui', 'Central'], nightlife: ['Lan Kwai Fong', 'SoHo', 'Tsim Sha Tsui'],
    emergency_contacts: [{ name: 'Police', number: '999' }, { name: 'Fire', number: '992' }],
    cost_estimates: { metro_single: 'HK$10-60', bus_single: 'HK$3-50', taxi_base: 'HK$29', taxi_per_km: 'HK$4', daily_pass: 'HK$65', weekly_pass: 'HK$300' },
    quick_routes: { airport_to_center: 'HKG Airport → Central', center_to_attraction: 'Central → Victoria Peak', station_to_market: 'Tsim Sha Tsui → Temple Street' },
    is_trending: false, is_new: false
  },
  {
    name: 'Seoul', region: 'Asia', country: 'South Korea', flag: '🇰🇷', lat: 37.566, lng: 126.978, score: 93, timezone_iana: 'Asia/Seoul',
    transport_modes: ['metro', 'bus', 'taxi', 'train'], best_for: 'K-Culture & Tech', peak_hours: '08:00-09:30,18:00-20:00', night_service: true,
    booking_links: [{ name: 'T-Money', url: 'https://t-money.co.kr' }, { name: 'Korail', url: 'https://korail.co.kr' }, { name: 'Kakao T', url: 'https://www.kakaot.com' }, { name: 'Citymapper', url: 'https://citymapper.com' }],
    timezone: 'KST (UTC+9)', language: 'Korean, English', currency: '₩ KRW', cost_level: 'Moderate', safety: 'Very Safe', best_months: 'Mar-May, Sep-Nov',
    local_tips: ['T-Money card everywhere', 'Metro is color-coded', 'KTX for intercity', 'Bus system extensive'],
    attractions: ['Bukchon Hanok', 'N Seoul Tower', 'Myeongdong', 'Gyeongbokgung', 'Insadong'],
    connectivity: { airport: 'ICN Incheon, GMP Gimpo', railway: 'Seoul Station', metro_lines: 23, bus_network: 'Seoul Bus' },
    overview: 'Seoul is a dynamic city blending ancient palaces with cutting-edge K-culture.',
    transport_tips: ['T-Money card everywhere', 'Metro is color-coded', 'KTX for intercity travel'],
    food: ['Kimchi', 'Bibimbap', 'Korean BBQ', 'Tteokbokki'], shopping: ['Myeongdong', 'Insadong', 'Gangnam'], nightlife: ['Hongdae', 'Gangnam', 'Itaewon'],
    emergency_contacts: [{ name: 'Police', number: '112' }, { name: 'Ambulance', number: '119' }],
    cost_estimates: { metro_single: '₩1350-2250', bus_single: '₩1350', taxi_base: '₩4800', taxi_per_km: '₩1100', daily_pass: '₩12000', weekly_pass: '₩50000' },
    quick_routes: { airport_to_center: 'Incheon Airport → Seoul Station', center_to_attraction: 'Myeongdong → N Seoul Tower', station_to_market: 'Gangnam → COEX Mall' },
    is_trending: true, is_new: false
  },
  {
    name: 'Bangkok', region: 'Asia', country: 'Thailand', flag: '🇹🇭', lat: 13.756, lng: 100.501, score: 72, timezone_iana: 'Asia/Bangkok',
    transport_modes: ['metro', 'bus', 'taxi', 'boat', 'tuktuk'], best_for: 'Street Food & Temples', peak_hours: '07:00-09:00,16:30-19:30', night_service: false,
    booking_links: [{ name: 'BTS', url: 'https://bts.co.th' }, { name: 'MRT', url: 'https://mrt.co.th' }, { name: 'Grab', url: 'https://grab.com' }],
    timezone: 'ICT (UTC+7)', language: 'Thai, English', currency: '฿ THB', cost_level: 'Budget', safety: 'Moderate', best_months: 'Nov-Feb',
    local_tips: ['BTS + MRT avoid traffic', 'River boat scenic', 'Tuktuk tourist price', 'Grab taxi app'],
    attractions: ['Grand Palace', 'Wat Pho', 'Chatuchak Market', 'Khao San Road', 'Wat Arun'],
    connectivity: { airport: 'BKK Suvarnabhumi', railway: 'Hua Lamphong', metro_lines: 3, bus_network: 'BMTA' },
    overview: 'Bangkok is known for ornate temples, vibrant street life, and excellent street food.',
    transport_tips: ['BTS Skytrain avoids traffic', 'MRT subway comprehensive', 'Chao Phraya Express Boat'],
    food: ['Pad Thai', 'Tom Yum Goong', 'Green Curry', 'Mango Sticky Rice'], shopping: ['Chatuchak Weekend Market', 'MBK Center', 'Siam Paragon'], nightlife: ['Khao San Road', 'Sukhumvit', 'Rooftop Bars'],
    emergency_contacts: [{ name: 'Police', number: '191' }, { name: 'Tourist Police', number: '1155' }],
    cost_estimates: { metro_single: '฿15-65', bus_single: '฿8-25', taxi_base: '฿35', taxi_per_km: '฿12', daily_pass: '฿150', weekly_pass: '฿700' },
    quick_routes: { airport_to_center: 'Suvarnabhumi → Khao San Road', center_to_attraction: 'Silom → Chatuchak Market', station_to_market: 'Hua Lamphong → Yaowarat' },
    is_trending: false, is_new: false
  },
  {
    name: 'Rome', region: 'Europe', country: 'Italy', flag: '🇮🇹', lat: 41.902, lng: 12.496, score: 82, timezone_iana: 'Europe/Rome',
    transport_modes: ['metro', 'bus', 'tram', 'taxi'], best_for: 'Ancient History', peak_hours: '08:00-10:00,17:00-19:30', night_service: false,
    booking_links: [{ name: 'ATAC', url: 'https://atac.roma.it' }, { name: 'Trenitalia', url: 'https://trenitalia.com' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'CET/CEST (UTC+1/+2)', language: 'Italian, English', currency: '€ EUR', cost_level: 'High', safety: 'Moderate', best_months: 'Apr-Jun, Sep-Oct',
    local_tips: ['Roma Pass for transport', 'Metro limited but useful', 'Bus network extensive', 'Tickets must be validated'],
    attractions: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Pantheon', 'Roman Forum'],
    connectivity: { airport: 'FCO Leonardo da Vinci, CIA Ciampino', railway: 'Roma Termini', metro_lines: 3, bus_network: 'ATAC' },
    overview: 'Rome is the Eternal City with ancient history, Vatican, and incredible architecture.',
    transport_tips: ['Roma Pass for transport', 'Metro limited but useful', 'Bus network extensive'],
    food: ['Pasta Carbonara', 'Pizza', 'Gelato', 'Supplì'], shopping: ['Via del Corso', 'Via Condotti', 'Campo de\' Fiori'], nightlife: ['Trastevere', 'Testaccio', 'Centro Storico'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '113' }],
    cost_estimates: { metro_single: '€1.50', bus_single: '€1.50', taxi_base: '€3', taxi_per_km: '€1.60', daily_pass: '€7', weekly_pass: '€24' },
    quick_routes: { airport_to_center: 'FCO → Termini Station', center_to_attraction: 'Termini → Colosseum', station_to_market: 'Roma Termini → Porta Portese' },
    is_trending: false, is_new: false
  },
  {
    name: 'Barcelona', region: 'Europe', country: 'Spain', flag: '🇪🇸', lat: 41.387, lng: 2.173, score: 85, timezone_iana: 'Europe/Madrid',
    transport_modes: ['metro', 'bus', 'tram', 'taxi', 'bike'], best_for: 'Gaudí & Beach', peak_hours: '08:00-09:30,17:30-19:30', night_service: false,
    booking_links: [{ name: 'TMB', url: 'https://tmb.cat' }, { name: 'Renfe', url: 'https://renfe.com' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'CET/CEST (UTC+1/+2)', language: 'Spanish, Catalan, English', currency: '€ EUR', cost_level: 'Moderate', safety: 'Generally safe, watch for pickpockets in tourist areas', best_months: 'May-Jun, Sep-Oct',
    local_tips: ['T-Casual card for 10 trips', 'Metro is excellent', 'Aerobús from airport', 'Bike sharing available'],
    attractions: ['Sagrada Familia', 'Park Güell', 'La Rambla', 'Gothic Quarter', 'Casa Batlló'],
    connectivity: { airport: 'BCN El Prat', railway: 'Sants', metro_lines: 12, bus_network: 'TMB' },
    overview: 'Barcelona is famous for Gaudi architecture, beaches, and vibrant Mediterranean culture.',
    transport_tips: ['T-Casual card for 10 trips', 'Metro is excellent', 'Aerobús from airport'],
    food: ['Paella', 'Tapas', 'Catalan cuisine', 'Crema Catalana'], shopping: ['La Rambla', 'Passeig de Gràcia', 'Barri Gòtic'], nightlife: ['La Rambla', 'Barceloneta', 'Gràcia'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '088' }],
    cost_estimates: { metro_single: '€2.40', bus_single: '€2.40', taxi_base: '€4.50', taxi_per_km: '€1.50', daily_pass: '€10.50', weekly_pass: '€35' },
    quick_routes: { airport_to_center: 'El Prat → Sagrada Familia', center_to_attraction: 'Passeig de Gràcia → Park Güell', station_to_market: 'Sants → La Boqueria' },
    is_trending: false, is_new: false
  },
  {
    name: 'Amsterdam', region: 'Europe', country: 'Netherlands', flag: '🇳🇱', lat: 52.367, lng: 4.904, score: 87, timezone_iana: 'Europe/Amsterdam',
    transport_modes: ['metro', 'bus', 'tram', 'bike', 'ferry'], best_for: 'Cycling & Canals', peak_hours: '08:00-09:30,17:00-18:30', night_service: true,
    booking_links: [{ name: 'GVB', url: 'https://gvb.nl' }, { name: 'NS', url: 'https://ns.nl' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'CET/CEST (UTC+1/+2)', language: 'Dutch, English', currency: '€ EUR', cost_level: 'High', safety: 'Good', best_months: 'Apr-Oct',
    local_tips: ['OV-chipkaart for all', 'GVB trams extensive', 'Bike lanes everywhere', 'Ferry is free'],
    attractions: ['Anne Frank House', 'Rijksmuseum', 'Van Gogh Museum', 'Vondelpark', 'Keukenhof'],
    connectivity: { airport: 'AMS Schiphol', railway: 'Centraal Station', metro_lines: 5, bus_network: 'GVB' },
    overview: 'Amsterdam is known for cycling, canals, museums, and liberal culture.',
    transport_tips: ['OV-chipkaart for all', 'GVB trams extensive', 'Bike lanes everywhere'],
    food: ['Poffertjes', 'Stroopwafel', 'Dutch cheese', 'Oliebollen'], shopping: ['Kalverstraat', 'De Negen Straatjes', 'Albert Cuyp Market'], nightlife: ['Leidseplein', 'Rembrandtplein', 'Red Light District'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '0900-8844' }],
    cost_estimates: { metro_single: '€2.10', bus_single: '€2.10', taxi_base: '€3.35', taxi_per_km: '€2.10', daily_pass: '8.50', weekly_pass: '€40' },
    quick_routes: { airport_to_center: 'Schiphol → Centraal Station', center_to_attraction: 'Centraal → Anne Frank House', station_to_market: 'Centraal → Albert Cuyp Market' },
    is_trending: true, is_new: false
  },
  {
    name: 'Istanbul', region: 'Europe', country: 'Turkey', flag: '🇹🇷', lat: 41.008, lng: 28.978, score: 80, timezone_iana: 'Europe/Istanbul',
    transport_modes: ['metro', 'bus', 'ferry', 'tram', 'taxi'], best_for: 'East Meets West', peak_hours: '08:00-10:00,17:00-20:00', night_service: true,
    booking_links: [{ name: 'Istanbulkart', url: 'https://istanbulkart.istanbul' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'TRT (UTC+3)', language: 'Turkish, English', currency: '₺ TRY', cost_level: 'Budget-Moderate', safety: 'Moderate', best_months: 'Apr-May, Sep-Oct',
    local_tips: ['Istanbulkart essential', 'Ferry is scenic & cheap', 'Tram for old city', 'Metro expanding fast'],
    attractions: ['Hagia Sophia', 'Blue Mosque', 'Grand Bazaar', 'Bosphorus', 'Topkapi Palace'],
    connectivity: { airport: 'IST Istanbul, SAW Sabiha Gökçen', railway: 'Sirkeci', metro_lines: 7, bus_network: 'IETT' },
    overview: 'Istanbul is where East meets West, with rich history spanning two continents.',
    transport_tips: ['Istanbulkart essential', 'Ferry is scenic & cheap', 'Tram for old city'],
    food: ['Kebab', 'Baklava', 'Lahmacun', 'Turkish Delight'], shopping: ['Grand Bazaar', 'Spice Bazaar', 'Istiklal Avenue'], nightlife: ['Bosphorus', 'Istiklal Avenue', 'Rooftop Bars'],
    emergency_contacts: [{ name: 'Police', number: '155' }, { name: 'Ambulance', number: '112' }],
    cost_estimates: { metro_single: '₺8', bus_single: '₺6', taxi_base: '₺25', taxi_per_km: '₺10', daily_pass: '₺40', weekly_pass: '₺200' },
    quick_routes: { airport_to_center: 'IST Airport → Sultanahmet', center_to_attraction: 'Galata → Grand Bazaar', station_to_market: 'Sirkeci → Egyptian Bazaar' },
    is_trending: false, is_new: false
  },
  {
    name: 'Toronto', region: 'Americas', country: 'Canada', flag: '🇨🇦', lat: 43.653, lng: -79.383, score: 84, timezone_iana: 'America/Toronto',
    transport_modes: ['metro', 'bus', 'tram', 'taxi'], best_for: 'Diverse Culture', peak_hours: '08:00-09:30,17:00-19:00', night_service: true,
    booking_links: [{ name: 'TTC', url: 'https://ttc.ca' }, { name: 'GO Transit', url: 'https://gotransit.com' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'EST/EDT (UTC-5/-4)', language: 'English, French', currency: '$ CAD', cost_level: 'High', safety: 'Good', best_months: 'May-Sep',
    local_tips: ['Presto card for all', 'TTC subway extensive', 'Streetcar along queen', 'UP Express to airport'],
    attractions: ['CN Tower', 'Royal Ontario Museum', 'Distillery District', 'Toronto Islands', 'Casa Loma'],
    connectivity: { airport: 'YYZ Pearson, YTZ Billy Bishop', railway: 'Union Station', metro_lines: 4, bus_network: 'TTC' },
    overview: 'Toronto is Canada\'s largest city known for its diversity and skyscrapers.',
    transport_tips: ['Presto card for all', 'TTC subway extensive', 'UP Express to airport'],
    food: ['Poutine', 'Peameal Bacon Sandwich', 'Nanaimo Bar', 'Global Cuisine'], shopping: ['Yorkville', 'Eaton Centre', 'Distillery District'], nightlife: ['King Street West', 'Queen West', 'Harbourfront'],
    emergency_contacts: [{ name: 'Emergency', number: '911' }, { name: 'Non-Emergency', number: '416-808-2222' }],
    cost_estimates: { metro_single: 'C$3.25', bus_single: 'C$3.25', taxi_base: 'C$4.25', taxi_per_km: 'C$1.75', daily_pass: 'C$13.50', weekly_pass: 'C$44.75' },
    quick_routes: { airport_to_center: 'Pearson → Union Station', center_to_attraction: 'Union → CN Tower', station_to_market: 'Union Station → Eaton Centre' },
    is_trending: false, is_new: false
  },
  {
    name: 'Los Angeles', region: 'Americas', country: 'USA', flag: '🇺🇸', lat: 34.052, lng: -118.243, score: 75, timezone_iana: 'America/Los_Angeles',
    transport_modes: ['bus', 'metro', 'taxi', 'bike'], best_for: 'Hollywood & Beach', peak_hours: '07:00-09:30,16:00-19:00', night_service: false,
    booking_links: [{ name: 'Metro LA', url: 'https://metro.net' }, { name: 'Amtrak', url: 'https://amtrak.com' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Lyft', url: 'https://lyft.com' }],
    timezone: 'PST/PDT (UTC-8/-7)', language: 'English, Spanish', currency: '$ USD', cost_level: 'High', safety: 'Moderate', best_months: 'Mar-May, Sep-Nov',
    local_tips: ['Metro expanding', 'Tap card for all', 'Traffic is notorious', 'Ride share recommended'],
    attractions: ['Hollywood Sign', 'Griffith Observatory', 'Santa Monica', 'Venice Beach', 'Universal Studios'],
    connectivity: { airport: 'LAX', railway: 'Union Station', metro_lines: 6, bus_network: 'Metro LA' },
    overview: 'LA is the entertainment capital with beaches, Hollywood, and car-centric culture.',
    transport_tips: ['Metro expanding', 'Tap card for all', 'Traffic is notorious'],
    food: ['Tacos', 'In-N-Out Burger', 'Korean BBQ', 'Avocado Toast'], shopping: ['Rodeo Drive', 'The Grove', 'Melrose Avenue'], nightlife: ['Hollywood', 'Santa Monica', 'West Hollywood'],
    emergency_contacts: [{ name: 'Emergency', number: '911' }, { name: 'LAPD', number: '877-275-5273' }],
    cost_estimates: { metro_single: '$1.75', bus_single: '$1.75', taxi_base: '$3', taxi_per_km: '$2.70', daily_pass: '$7', weekly_pass: 'N/A' },
    quick_routes: { airport_to_center: 'LAX → Santa Monica', center_to_attraction: 'Downtown → Hollywood Sign', station_to_market: 'Union Station → Olvera Street' },
    is_trending: false, is_new: false
  },
  {
    name: 'San Francisco', region: 'Americas', country: 'USA', flag: '🇺🇸', lat: 37.774, lng: -122.419, score: 83, timezone_iana: 'America/Los_Angeles',
    transport_modes: ['metro', 'bus', 'taxi', 'bike', 'tram'], best_for: 'Tech & Bay', peak_hours: '07:30-09:30,16:30-18:30', night_service: false,
    booking_links: [{ name: 'Muni', url: 'https://sFMTA.com' }, { name: 'BART', url: 'https://bart.gov' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Lyft', url: 'https://lyft.com' }],
    timezone: 'PST/PDT (UTC-8/-7)', language: 'English, Chinese', currency: '$ USD', cost_level: 'Very High', safety: 'Moderate', best_months: 'Sep-Nov, Mar-May',
    local_tips: ['Clipper card for all transport', 'Cable cars are tourist attraction', 'BART for east bay', 'Ride share common'],
    attractions: ['Golden Gate Bridge', 'Alcatraz', 'Fisherman\'s Wharf', 'Chinatown', 'Golden Gate Park'],
    connectivity: { airport: 'SFO, OAK', railway: '4th & King', metro_lines: 2, bus_network: 'Muni' },
    overview: 'San Francisco is known for tech, Golden Gate Bridge, and progressive culture.',
    transport_tips: ['Clipper card for all', 'Cable cars are tourist attraction', 'BART for east bay'],
    food: ['Sourdough Bread', 'Clam Chowder', 'Mission Burritos', 'Dungeness Crab'], shopping: ['Union Square', 'Chinatown', 'Ferry Building'], nightlife: ['Mission District', 'SoMa', 'North Beach'],
    emergency_contacts: [{ name: 'Emergency', number: '911' }, { name: 'SFPD', number: '415-553-0123' }],
    cost_estimates: { metro_single: '$3.50', bus_single: '$3.50', taxi_base: '$3.50', taxi_per_km: '$2.75', daily_pass: '$5', weekly_pass: '$22' },
    quick_routes: { airport_to_center: 'SFO → Downtown', center_to_attraction: 'Powell St → Fisherman\'s Wharf', station_to_market: '4th & King → Ferry Building' },
    is_trending: false, is_new: false
  },
  {
    name: 'Chicago', region: 'Americas', country: 'USA', flag: '🇺🇸', lat: 41.878, lng: -87.629, score: 83, timezone_iana: 'America/Chicago',
    transport_modes: ['metro', 'bus', 'taxi', 'bike'], best_for: 'Architecture', peak_hours: '07:30-09:00,16:30-18:30', night_service: true,
    booking_links: [{ name: 'CTA', url: 'https://cta.gov' }, { name: 'Metra', url: 'https://metrarail.com' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'CST/CDT (UTC-6/-5)', language: 'English, Spanish', currency: '$ USD', cost_level: 'Moderate-High', safety: 'Moderate', best_months: 'May-Sep',
    local_tips: ['Ventra card for all', 'L train elevated', 'Divvy bikes available', 'Metra for suburbs'],
    attractions: ['Willis Tower', 'Millennium Park', 'Navy Pier', 'Art Institute', 'Magnificent Mile'],
    connectivity: { airport: 'ORD, MDW', railway: 'Union Station', metro_lines: 8, bus_network: 'CTA' },
    overview: 'Chicago is known for architecture, deep-dish pizza, and music (blues/jazz).',
    transport_tips: ['Ventra card for all', 'L train elevated', 'Divvy bikes available'],
    food: ['Deep Dish Pizza', 'Chicago Dog', 'Italian Beef', 'Garrett Popcorn'], shopping: ['Magnificent Mile', 'State Street', 'Water Tower Place'], nightlife: ['River North', 'Wicker Park', 'Lincoln Park'],
    emergency_contacts: [{ name: 'Emergency', number: '911' }, { name: 'Non-Emergency', number: '311' }],
    cost_estimates: { metro_single: '$2.50', bus_single: '$2.50', taxi_base: '$3.25', taxi_per_km: '$2.65', daily_pass: '$10', weekly_pass: 'N/A' },
    quick_routes: { airport_to_center: 'ORD → Millennium Park', center_to_attraction: 'Millennium Park → Navy Pier', station_to_market: 'Union Station → Magnificent Mile' },
    is_trending: false, is_new: false
  },
  {
    name: 'Miami', region: 'Americas', country: 'USA', flag: '🇺🇸', lat: 25.761, lng: -80.191, score: 76, timezone_iana: 'America/New_York',
    transport_modes: ['metro', 'bus', 'taxi', 'ferry'], best_for: 'Beaches & Nightlife', peak_hours: '07:30-09:30,16:30-19:00', night_service: false,
    booking_links: [{ name: 'Miami Dade Transit', url: 'https://miamidade.gov/transit' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Lyft', url: 'https://lyft.com' }],
    timezone: 'EST/EDT (UTC-5/-4)', language: 'English, Spanish', currency: '$ USD', cost_level: 'High', safety: 'Moderate', best_months: 'Dec-Apr',
    local_tips: ['Easytrip for tolls', 'Metromover is free', 'Brightline to Orlando', 'Ride share popular'],
    attractions: ['South Beach', 'Wynwood Walls', 'Little Havana', 'Bayside Marketplace', 'Key West'],
    connectivity: { airport: 'MIA, FLL', railway: 'Metrorail', metro_lines: 2, bus_network: 'MDT' },
    overview: 'Miami is famous for beaches, nightlife, and Cuban culture.',
    transport_tips: ['Easytrip for tolls', 'Metromover is free', 'Brightline to Orlando'],
    food: ['Cuban Sandwich', 'Stone Crabs', 'Arepas', 'Key Lime Pie'], shopping: ['Aventura Mall', 'Design District', 'Bayside'], nightlife: ['South Beach', 'Wynwood', 'Brickell'],
    emergency_contacts: [{ name: 'Emergency', number: '911' }, { name: 'Police', number: '305-603-6640' }],
    cost_estimates: { metro_single: '$2.35', bus_single: '$2.35', taxi_base: '$3', taxi_per_km: '$2.40', daily_pass: '$5.65', weekly_pass: 'N/A' },
    quick_routes: { airport_to_center: 'MIA → South Beach', center_to_attraction: 'Downtown → Little Havana', station_to_market: 'Metrorail → Bayside' },
    is_trending: true, is_new: false
  },
  {
    name: 'Bali', region: 'Asia', country: 'Indonesia', flag: '🇮🇩', lat: -8.340, lng: 115.092, score: 74, timezone_iana: 'Asia/Makassar',
    transport_modes: ['bus', 'taxi', 'scooter', 'car'], best_for: 'Beaches & Temples', peak_hours: '08:00-10:00,17:00-19:00', night_service: true,
    booking_links: [{ name: 'Kura Kura', url: 'https://kurakurabus.com' }, { name: 'Grab', url: 'https://grab.com' }, { name: 'GoJek', url: 'https://gojek.com' }],
    timezone: 'WITA (UTC+8)', language: 'Indonesian, English', currency: 'Rp IDR', cost_level: 'Budget-Moderate', safety: 'Good', best_months: 'Apr-Oct',
    local_tips: ['Rent scooter popular', 'Grab/GoJek for transport', 'Traffic chaotic in tourist areas', 'Bluebird taxis reliable'],
    attractions: ['Uluwatu Temple', 'Tanah Lot', 'Ubud Monkey Forest', 'Seminyak Beach', 'Mount Batur'],
    connectivity: { airport: 'DPS Ngurah Rai', railway: 'N/A', metro_lines: 0, bus_network: 'Perama' },
    overview: 'Bali is a tropical paradise known for temples, beaches, and spiritual retreats.',
    transport_tips: ['Rent scooter popular', 'Grab/GoJek for transport', 'Bluebird taxis reliable'],
    food: ['Nasi Goreng', 'Satay', 'Babi Guling', 'Lawar'], shopping: ['Ubud Market', 'Seminyak', 'Kuta Beach'], nightlife: ['Kuta', 'Seminyak', 'Ubud'],
    emergency_contacts: [{ name: 'Police', number: '110' }, { name: 'Ambulance', number: '118' }],
    cost_estimates: { metro_single: 'N/A', bus_single: 'Rp 10K-50K', taxi_base: 'Rp 25K', taxi_per_km: 'Rp 5K', daily_pass: 'Rp 300K', weekly_pass: 'Rp 1.5M' },
    quick_routes: { airport_to_center: 'Ngurah Rai → Kuta Beach', center_to_attraction: 'Kuta → Uluwatu Temple', station_to_market: 'Kuta → Ubud Market' },
    is_trending: true, is_new: false
  },
  {
    name: 'Kuala Lumpur', region: 'Asia', country: 'Malaysia', flag: '🇲🇾', lat: 3.139, lng: 101.686, score: 78, timezone_iana: 'Asia/Kuala_Lumpur',
    transport_modes: ['metro', 'bus', 'taxi', 'train'], best_for: 'Multicultural', peak_hours: '07:30-09:00,17:30-19:30', night_service: true,
    booking_links: [{ name: 'Rapid KL', url: 'https://myrapid.com.my' }, { name: 'KLIA Ekspres', url: 'https://kliaekspres.com' }, { name: 'Grab', url: 'https://grab.com' }],
    timezone: 'MYT (UTC+8)', language: 'Malay, English, Mandarin', currency: 'RM MYR', cost_level: 'Budget', safety: 'Good', best_months: 'May-Jul, Dec-Feb',
    local_tips: ['MyRapid card for metro/bus', 'LRT and MRT expanding', 'Monorail for city center', 'Airport train is fast'],
    attractions: ['Petronas Towers', 'Batu Caves', 'Merdeka Square', 'KLCC', 'Bukit Bintang'],
    connectivity: { airport: 'KUL Kuala Lumpur, SUB', railway: 'KL Sentral', metro_lines: 5, bus_network: 'Rapid KL' },
    overview: 'Kuala Lumpur is a multicultural city with modern skyscrapers and colonial heritage.',
    transport_tips: ['MyRapid card for metro/bus', 'LRT and MRT expanding', 'Monorail for city center'],
    food: ['Nasi Lemak', 'Roti Canai', 'Satay', 'Cendol'], shopping: ['Bukit Bintang', 'Petronas Towers', 'Central Market'], nightlife: ['Bukit Bintang', 'Changkat', 'KLCC'],
    emergency_contacts: [{ name: 'Police', number: '999' }, { name: 'Ambulance', number: '999' }],
    cost_estimates: { metro_single: 'RM 1-6', bus_single: 'RM 1-3', taxi_base: 'RM 3', taxi_per_km: 'RM 1.50', daily_pass: 'RM 15', weekly_pass: 'RM 50' },
    quick_routes: { airport_to_center: 'KLIA → Petronas Towers', center_to_attraction: 'Bukit Bintang → Petronas', station_to_market: 'KL Sentral → Central Market' },
    is_trending: false, is_new: false
  },
  {
    name: 'Phuket', region: 'Asia', country: 'Thailand', flag: '🇹🇭', lat: 7.880, lng: 98.392, score: 71, timezone_iana: 'Asia/Bangkok',
    transport_modes: ['bus', 'taxi', 'scooter', 'ferry'], best_for: 'Beaches & Islands', peak_hours: '10:00-13:00,16:00-19:00', night_service: true,
    booking_links: [{ name: 'Phuket Smart Bus', url: 'phuketsmartbus.com' }, { name: 'Andaman Emu', url: 'andamanemubus.com' }, { name: 'Grab', url: 'https://grab.com' }],
    timezone: 'ICT (UTC+7)', language: 'Thai, English', currency: '฿ THB', cost_level: 'Moderate', safety: 'Good', best_months: 'Nov-Apr',
    local_tips: ['Rent scooter common', 'Songthaew (shared taxi)', 'Ferry to Phi Phi Islands', 'Tuktuk for short trips'],
    attractions: ['Patong Beach', 'Big Buddha', 'Phuket Old Town', 'Phi Phi Islands', 'James Bond Island'],
    connectivity: { airport: 'HKT Phuket', railway: 'Phuket (new)', metro_lines: 0, bus_network: 'Smart Bus' },
    overview: 'Phuket is Thailand\'s largest island known for beaches and island hopping.',
    transport_tips: ['Rent scooter common', 'Songthaew (shared taxi)', 'Ferry to Phi Phi Islands'],
    food: ['Pad Thai', 'Fresh Seafood', 'Som Tam', 'Mango Sticky Rice'], shopping: ['Patong Bangla Road', 'Phuket Old Town', 'Jungceylon'], nightlife: ['Patong Beach', 'Bangla Road', 'Kata Beach'],
    emergency_contacts: [{ name: 'Police', number: '1669' }, { name: 'Tourist Police', number: '1155' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '฿30-100', taxi_base: '฿50', taxi_per_km: '฿15', daily_pass: '฿400', weekly_pass: '฿2000' },
    quick_routes: { airport_to_center: 'Phuket Airport → Patong Beach', center_to_attraction: 'Patong → Big Buddha', station_to_market: 'Phuket Town → Old Town' },
    is_trending: true, is_new: false
  },
  {
    name: 'Melbourne', region: 'Oceania', country: 'Australia', flag: '🇦🇺', lat: -37.813, lng: 144.963, score: 85, timezone_iana: 'Australia/Melbourne',
    transport_modes: ['tram', 'bus', 'train', 'bike'], best_for: 'Coffee & Sports', peak_hours: '08:00-09:00,17:00-18:30', night_service: true,
    booking_links: [{ name: 'PTV', url: 'https://ptv.vic.gov.au' }, { name: 'V/Line', url: 'https://vline.com.au' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'AEST/AEDT (UTC+10/+11)', language: 'English', currency: '$ AUD', cost_level: 'High', safety: 'Good', best_months: 'Nov-Mar',
    local_tips: ['Myki card essential', 'Tram network largest', 'Train to suburbs', 'Free tram zone'],
    attractions: ['Federation Square', 'Royal Botanic Gardens', 'St Kilda Beach', 'Queen Victoria Market', 'Great Ocean Road'],
    connectivity: { airport: 'MEL', railway: 'Southern Cross', metro_lines: 2, bus_network: 'PTV' },
    overview: 'Melbourne is known for coffee culture, sports, and diverse arts scene.',
    transport_tips: ['Myki card essential', 'Tram network largest', 'Free tram zone in CBD'],
    food: ['Avocado Toast', 'Flat White', 'Meat Pie', 'Tim Tams'], shopping: ['Collins Street', 'Chapel Street', 'Queen Victoria Market'], nightlife: ['Fitzroy', 'Collingwood', 'St Kilda'],
    emergency_contacts: [{ name: 'Emergency', number: '000' }, { name: 'Police', number: '131 444' }],
    cost_estimates: { metro_single: 'A$4.50', bus_single: 'A$4.50', taxi_base: 'A$4.20', taxi_per_km: 'A$2.19', daily_pass: 'A$9.70', weekly_pass: 'A$43' },
    quick_routes: { airport_to_center: 'MEL Airport → CBD', center_to_attraction: 'Flinders St → Queen Victoria Market', station_to_market: 'Southern Cross → St Kilda' },
    is_trending: false, is_new: false
  },
  {
    name: 'Auckland', region: 'Oceania', country: 'New Zealand', flag: '🇳🇿', lat: -36.848, lng: 174.763, score: 82, timezone_iana: 'Pacific/Auckland',
    transport_modes: ['bus', 'train', 'ferry', 'taxi'], best_for: 'City & Nature', peak_hours: '07:30-09:00,17:00-18:30', night_service: false,
    booking_links: [{ name: 'AT', url: 'https://at.govt.nz' }, { name: 'Train', url: 'https://at.govt.nz/trains' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'NZST/NZDST (UTC+12/+13)', language: 'English, Maori', currency: '$ NZD', cost_level: 'High', safety: 'Very Safe', best_months: 'Dec-Feb',
    local_tips: ['AT HOP card for all', 'Ferries to islands', 'Train to Pukekohe', 'Airport bus'],
    attractions: ['Sky Tower', 'Waiheke Island', 'Waitemata Harbour', 'Rangitoto Island', 'One Tree Hill'],
    connectivity: { airport: 'AKL Auckland', railway: 'Britomart', metro_lines: 1, bus_network: 'AT' },
    overview: 'Auckland is a stunning harbor city with access to beaches, islands, and nature.',
    transport_tips: ['AT HOP card for all', 'Ferries to islands', 'Train to Pukekohe'],
    food: ['Fish and Chips', 'Pavlova', 'Kiwifruit', 'Hangi'], shopping: ['Queen Street', 'Parnell', 'Sylvia Park'], nightlife: ['Parnell', 'K Road', 'Viaduct Harbour'],
    emergency_contacts: [{ name: 'Emergency', number: '111' }, { name: 'Police', number: '105' }],
    cost_estimates: { metro_single: 'NZ$2', bus_single: 'NZ$2', taxi_base: 'NZ$3.50', taxi_per_km: 'NZ$2.20', daily_pass: 'NZ$8', weekly_pass: 'NZ$35' },
    quick_routes: { airport_to_center: 'AKL Airport → Queen Street', center_to_attraction: 'Britomart → Viaduct Harbour', station_to_market: 'Auckland Station → Queen Street' },
    is_trending: false, is_new: false
  },
  {
    name: 'Moscow', region: 'Europe', country: 'Russia', flag: '🇷🇺', lat: 55.755, lng: 37.617, score: 84, timezone_iana: 'Europe/Moscow',
    transport_modes: ['metro', 'bus', 'taxi', 'train'], best_for: 'Russian Culture', peak_hours: '08:00-09:30,18:00-20:00', night_service: false,
    booking_links: [{ name: 'Moscow Metro', url: 'https://mosmetro.ru' }, { name: 'Yandex', url: 'https://taxi.yandex.ru' }],
    timezone: 'MSK (UTC+3)', language: 'Russian, English', currency: '₽ RUB', cost_level: 'Moderate', safety: 'Good', best_months: 'May-Sep',
    local_tips: ['Troika card for all', 'Metro is beautiful', 'Yandex Taxi reliable', 'Metro deep underground'],
    attractions: ['Red Square', 'St. Basil\'s Cathedral', 'Kremlin', 'Moscow Metro', 'GUM'],
    connectivity: { airport: 'SVO, DME, VKO', railway: 'Leningrad Station', metro_lines: 14, bus_network: 'Moscow Bus' },
    overview: 'Moscow is known for stunning architecture, metro stations, and Soviet history.',
    transport_tips: ['Troika card for all', 'Metro is beautiful', 'Yandex Taxi reliable'],
    food: ['Borscht', 'Pelmeni', 'Beef Stroganoff', 'Blini'], shopping: ['GUM', 'TSUM', 'Arbat Street'], nightlife: ['Patriarch Ponds', 'Tverskaya Street', 'Moscow City'],
    emergency_contacts: [{ name: 'Police', number: '102' }, { name: 'Ambulance', number: '103' }],
    cost_estimates: { metro_single: '₽57', bus_single: '₽50', taxi_base: '₽200', taxi_per_km: '₽25', daily_pass: '₽250', weekly_pass: '₽1200' },
    quick_routes: { airport_to_center: 'SVO Airport → Red Square', center_to_attraction: 'Teatralnaya → GUM', station_to_market: 'Leningrad Station → Arbat' },
    is_trending: false, is_new: false
  },
  {
    name: 'Cairo', region: 'Africa', country: 'Egypt', flag: '🇪🇬', lat: 30.044, lng: 31.235, score: 65, timezone_iana: 'Africa/Cairo',
    transport_modes: ['metro', 'bus', 'taxi', 'microbus'], best_for: 'Pyramids & History', peak_hours: '07:30-09:30,15:00-18:00', night_service: false,
    booking_links: [{ name: 'Cairo Metro', url: 'https://cairo_metro.gov.eg' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Careem', url: 'https://careem.com' }],
    timezone: 'EET (UTC+2)', language: 'Arabic, English, French', currency: 'E£ EGP', cost_level: 'Budget', safety: 'Moderate', best_months: 'Oct-Apr',
    local_tips: ['Metro only in Cairo', 'Uber/Careem recommended', 'Microbus is chaotic', 'Traffic is extreme'],
    attractions: ['Pyramids of Giza', 'Egyptian Museum', 'Khan el-Khalili', 'Nile Cruise', 'Saqqara'],
    connectivity: { airport: 'CAI', railway: 'Ramses Station', metro_lines: 3, bus_network: 'Cairo Bus' },
    overview: 'Cairo is the gateway to ancient Egypt with the pyramids and rich history.',
    transport_tips: ['Metro only in Cairo', 'Uber/Careem recommended', 'Microbus is chaotic'],
    food: ['Koshari', 'Fool', 'Shawarma', 'Egyptian Desserts'], shopping: ['Khan el-Khalili', 'Nile City', 'Salah Salem'], nightlife: ['Zamalek', 'Maadi', 'Downtown Cairo'],
    emergency_contacts: [{ name: 'Police', number: '122' }, { name: 'Ambulance', number: '123' }],
    cost_estimates: { metro_single: 'E£8', bus_single: 'E£5', taxi_base: 'E£15', taxi_per_km: 'E£4', daily_pass: 'E£30', weekly_pass: 'E£150' },
    quick_routes: { airport_to_center: 'CAI Airport → Tahrir Square', center_to_attraction: 'Tahrir → Pyramids', station_to_market: 'Ramses Station → Khan el-Khalili' },
    is_trending: false, is_new: false
  },
  {
    name: 'Cape Town', region: 'Africa', country: 'South Africa', flag: '🇿🇦', lat: -33.924, lng: 18.424, score: 77, timezone_iana: 'Africa/Johannesburg',
    transport_modes: ['bus', 'taxi', 'train', 'Uber'], best_for: 'Nature & Wine', peak_hours: '07:00-09:00,17:00-19:00', night_service: false,
    booking_links: [{ name: 'MyCiti', url: 'https://myciti.org.za' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'SAST (UTC+2)', language: 'English, Afrikaans, Xhosa', currency: 'R ZAR', cost_level: 'Moderate', safety: 'Moderate', best_months: 'Nov-Mar',
    local_tips: ['MyCiti buses for tourists', 'Uber is safe and common', 'Rental car recommended', 'Table Mountain cable car'],
    attractions: ['Table Mountain', 'Robben Island', 'Cape Winelands', 'Camps Bay', 'Kirstenbosch'],
    connectivity: { airport: 'CPT', railway: 'Cape Town Station', metro_lines: 0, bus_network: 'MyCiti' },
    overview: 'Cape Town offers stunning nature, beaches, and world-class wine regions.',
    transport_tips: ['MyCiti buses for tourists', 'Uber is safe and common', 'Rental car recommended'],
    food: ['Bobotie', 'Biltong', 'Cape Malay Curry', 'Wine'], shopping: ['V&A Waterfront', 'Camp\'s Bay', 'Kirstenbosch'], nightlife: ['Long Street', 'K Woodstock', 'V&A Waterfront'],
    emergency_contacts: [{ name: 'Emergency', number: '10111' }, { name: 'Police', number: '10111' }],
    cost_estimates: { metro_single: 'N/A', bus_single: 'R18-40', taxi_base: 'R30', taxi_per_km: 'R12', daily_pass: 'R100', weekly_pass: 'R450' },
    quick_routes: { airport_to_center: 'CPT Airport → V&A Waterfront', center_to_attraction: 'CBD → Table Mountain', station_to_market: 'Station → Camps Bay' },
    is_trending: true, is_new: false
  },
  {
    name: 'Mexico City', region: 'Americas', country: 'Mexico', flag: '🇲🇽', lat: 19.432, lng: -99.133, score: 76, timezone_iana: 'America/Mexico_City',
    transport_modes: ['metro', 'bus', 'taxi', 'metrobus'], best_for: 'Culture & Cuisine', peak_hours: '07:00-10:00,16:00-20:00', night_service: true,
    booking_links: [{ name: 'STC Metro', url: 'https://metro.cdmx.gob.mx' }, { name: 'Metrobús', url: 'https://metrobus.cdmx.gob.mx' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'CST (UTC-6)', language: 'Spanish, English', currency: '$ MXN', cost_level: 'Budget', safety: 'Moderate', best_months: 'Mar-May',
    local_tips: ['Metro is cheap & efficient', 'Metrobus for major avenues', 'Uber/DiDi safe', 'Avoid rush hours'],
    attractions: ['Zócalo', 'Chapultepec', 'Frida Kahlo Museum', 'Xochimilco', 'Teotihuacan'],
    connectivity: { airport: 'MEX, TLC', railway: 'Buenavista', metro_lines: 12, bus_network: 'STP, MB' },
    overview: 'Mexico City is a massive metropolis with rich culture and incredible food.',
    transport_tips: ['Metro is cheap & efficient', 'Metrobus for major avenues', 'Uber/DiDi safe'],
    food: ['Tacos', 'Mole', 'Tamales', 'Churros'], shopping: ['Zona Rosa', 'Condesa', 'Roma'], nightlife: ['Condesa', 'Roma', 'Zona Rosa'],
    emergency_contacts: [{ name: 'Emergency', number: '911' }, { name: 'Tourist Police', number: '078' }],
    cost_estimates: { metro_single: '$5 MXN', bus_single: '$5 MXN', taxi_base: '$40 MXN', taxi_per_km: '$10 MXN', daily_pass: '$90 MXN', weekly_pass: '$310 MXN' },
    quick_routes: { airport_to_center: 'MEX Airport → Zócalo', center_to_attraction: 'Zócalo → Chapultepec', station_to_market: 'Buenavista → Roma' },
    is_trending: true, is_new: false
  },
  {
    name: 'São Paulo', region: 'Americas', country: 'Brazil', flag: '🇧🇷', lat: -23.550, lng: -46.633, score: 79, timezone_iana: 'America/Sao_Paulo',
    transport_modes: ['metro', 'bus', 'taxi', 'bike'], best_for: 'Business & Carnival', peak_hours: '07:00-09:00,17:30-20:00', night_service: false,
    booking_links: [{ name: 'SPTrans', url: 'https://sptrans.com.br' }, { name: 'CPTM', url: 'https://cptm.sp.gov.br' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'BRT (UTC-3)', language: 'Portuguese, English', currency: 'R$ BRL', cost_level: 'Moderate', safety: 'Moderate', best_months: 'Mar-May, Sep-Nov',
    local_tips: ['Metro is safe & clean', '99 app for taxis', 'Bus network extensive', 'Avoid night travel'],
    attractions: ['Av. Paulista', 'Ibirapuera Park', 'Sé Cathedral', 'Mercado Municipal', 'Liberdade'],
    connectivity: { airport: 'GRU, CGH', railway: 'Luz Station', metro_lines: 6, bus_network: 'SPTrans' },
    overview: 'São Paulo is Brazil\'s largest city known for business and cultural diversity.',
    transport_tips: ['Metro is safe & clean', '99 app for taxis', 'Bus network extensive'],
    food: ['Feijoada', 'P brigadeiro', 'Pastel de Queijo', 'Acai'], shopping: ['Paulista Avenue', 'Liberdade', 'Shopping Iguatemi'], nightlife: ['Vila Madalena', 'Pinheiros', 'Paulista Avenue'],
    emergency_contacts: [{ name: 'Emergency', number: '190' }, { name: 'Civil Police', number: '197' }],
    cost_estimates: { metro_single: 'R$4.40', bus_single: 'R$4.40', taxi_base: 'R$5.50', taxi_per_km: 'R$2.75', daily_pass: 'R$15', weekly_pass: 'R$70' },
    quick_routes: { airport_to_center: 'GRU Airport → Paulista', center_to_attraction: 'Paulista → Ibirapuera', station_to_market: 'Luz Station → Mercado Municipal' },
    is_trending: false, is_new: false
  },
  {
    name: 'Buenos Aires', region: 'Americas', country: 'Argentina', flag: '🇦🇷', lat: -34.603, lng: -58.381, score: 78, timezone_iana: 'America/Argentina/Buenos_Aires',
    transport_modes: ['metro', 'bus', 'taxi', 'train'], best_for: 'Tango & Culture', peak_hours: '08:00-10:00,18:00-20:00', night_service: false,
    booking_links: [{ name: 'Subte', url: 'https://buenosaires.gob.ar/subte' }, { name: 'Trenes', url: 'https://trenesargentinos.gob.ar' }],
    timezone: 'ART (UTC-3)', language: 'Spanish, English', currency: '$ ARS', cost_level: 'Budget', safety: 'Moderate', best_months: 'Sep-Nov, Mar-May',
    local_tips: ['Subte (metro) is best', 'Buenos Aires Card for tourists', 'Bus network extensive', 'Safe in tourist areas'],
    attractions: ['La Boca', 'Plaza de Mayo', 'Recoleta Cemetery', 'Palermo', 'San Telmo'],
    connectivity: { airport: 'EZE, AEP', railway: 'Retiro', metro_lines: 6, bus_network: 'Metrobus' },
    overview: 'Buenos Aires is the Paris of South America with tango and European architecture.',
    transport_tips: ['Subte (metro) is best', 'Buenos Aires Card for tourists', 'Bus network extensive'],
    food: ['Asado', 'Empanadas', 'Dulce de Leche', 'Milanesa'], shopping: ['Palermo SoHo', 'Florida Street', 'Recoleta'], nightlife: ['Palermo', 'San Telmo', 'La Boca'],
    emergency_contacts: [{ name: 'Emergency', number: '911' }, { name: 'Police', number: '101' }],
    cost_estimates: { metro_single: '$50 ARS', bus_single: '$50 ARS', taxi_base: '$150 ARS', taxi_per_km: '$30 ARS', daily_pass: '$330 ARS', weekly_pass: 'N/A' },
    quick_routes: { airport_to_center: 'EZE Airport → Plaza de Mayo', center_to_attraction: 'Plaza de Mayo → San Telmo', station_to_market: 'Retiro → Palermo' },
    is_trending: false, is_new: false
  },
  {
    name: 'Vienna', region: 'Europe', country: 'Austria', flag: '🇦🇹', lat: 48.208, lng: 16.373, score: 90, timezone_iana: 'Europe/Vienna',
    transport_modes: ['metro', 'bus', 'tram', 'taxi', 'train'], best_for: 'Music & Art', peak_hours: '08:00-09:30,17:00-18:30', night_service: true,
    booking_links: [{ name: 'Wiener Linien', url: 'https://wienerlinien.at' }, { name: 'OBB', url: 'https://obb.com' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'CET/CEST (UTC+1/+2)', language: 'German, English', currency: '€ EUR', cost_level: 'High', safety: 'Very Safe', best_months: 'Apr-Oct',
    local_tips: ['Wiener Linien app', 'U-Bahn excellent', 'Tram routes scenic', 'Citybikes free'],
    attractions: ['Schönbrunn Palace', 'St. Stephen\'s Cathedral', 'Belvedere Palace', 'Hofburg', 'Danube'],
    connectivity: { airport: 'VIE', railway: 'Hauptbahnhof', metro_lines: 5, bus_network: 'Wiener Linien' },
    overview: 'Vienna is known for music, art, and stunning imperial palaces.',
    transport_tips: ['Wiener Linien app', 'U-Bahn excellent', 'Tram routes scenic'],
    food: ['Wiener Schnitzel', 'Apfelstrudel', 'Sachertorte', 'Kaiser rolls'], shopping: ['Kärntner Straße', 'Mariahilfer Straße', 'Naschmarkt'], nightlife: ['Innere Stadt', 'Leopoldstadt', 'Boho'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '133' }],
    cost_estimates: { metro_single: '€2.40', bus_single: '€2.40', taxi_base: '€4.50', taxi_per_km: '€2.30', daily_pass: '€8', weekly_pass: '€38' },
    quick_routes: { airport_to_center: 'VIE Airport → Stephansplatz', center_to_attraction: 'Innere Stadt → Schönbrunn', station_to_market: 'Hauptbahnhof → Naschmarkt' },
    is_trending: false, is_new: false
  },
  {
    name: 'Prague', region: 'Europe', country: 'Czech Republic', flag: '🇨🇿', lat: 50.075, lng: 14.438, score: 86, timezone_iana: 'Europe/Prague',
    transport_modes: ['metro', 'bus', 'tram', 'taxi'], best_for: 'Architecture & Beer', peak_hours: '08:00-10:00,16:00-18:30', night_service: true,
    booking_links: [{ name: 'DPP', url: 'https://dpp.cz' }, { name: 'Czech Rail', url: 'https://cd.cz' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'CET/CEST (UTC+1/+2)', language: 'Czech, English', currency: 'Kč CZK', cost_level: 'Moderate', safety: 'Good', best_months: 'Apr-Jun, Sep-Oct',
    local_tips: ['Prague Card includes transport', 'Metro, tram, bus extensive', 'Walking is best in old town', 'Uber available'],
    attractions: ['Charles Bridge', 'Prague Castle', 'Old Town Square', 'St. Vitus Cathedral', 'Astronomical Clock'],
    connectivity: { airport: 'PRG', railway: 'Hlavní nádraží', metro_lines: 3, bus_network: 'DPP' },
    overview: 'Prague is a fairy-tale city with stunning Gothic and Baroque architecture.',
    transport_tips: ['Prague Card includes transport', 'Metro, tram, bus extensive', 'Walking is best'],
    food: ['Goulash', 'Trdelník', 'Svíčková', 'Pilsner Beer'], shopping: ['Na Příkopě', 'Palladium', 'Havelská Market'], nightlife: ['Old Town', 'Žižkov', 'Vinohrady'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '158' }],
    cost_estimates: { metro_single: 'Kč40', bus_single: 'Kč40', taxi_base: 'Kč80', taxi_per_km: 'Kč28', daily_pass: 'Kč120', weekly_pass: 'Kč310' },
    quick_routes: { airport_to_center: 'PRG Airport → Old Town', center_to_attraction: 'Old Town → Prague Castle', station_to_market: 'Hlavní Nádraží → Wenceslas Square' },
    is_trending: true, is_new: false
  },
  {
    name: 'Budapest', region: 'Europe', country: 'Hungary', flag: '🇭🇺', lat: 47.497, lng: 19.040, score: 81, timezone_iana: 'Europe/Budapest',
    transport_modes: ['metro', 'bus', 'tram', 'taxi'], best_for: 'Spas & Nightlife', peak_hours: '08:00-10:00,17:00-19:00', night_service: true,
    booking_links: [{ name: 'BKK', url: 'https://bkk.hu' }, { name: 'MAV', url: 'https://mav.hu' }, { name: 'Bolt', url: 'https://bolt.eu' }],
    timezone: 'CET/CEST (UTC+1/+2)', language: 'Hungarian, English', currency: 'Ft HUF', cost_level: 'Budget', safety: 'Good', best_months: 'Apr-Jun, Sep-Oct',
    local_tips: ['Budapest Card for transport', 'Metro is oldest in Europe', 'Thermal baths popular', 'Ruins bars famous'],
    attractions: ['Parliament Building', 'Buda Castle', 'Szechenyi Thermal Bath', 'Chain Bridge', 'Fisherman\'s Bastion'],
    connectivity: { airport: 'BUD', railway: 'Keleti Station', metro_lines: 4, bus_network: 'BKK' },
    overview: 'Budapest is known for thermal baths, Parliament building, and vibrant nightlife.',
    transport_tips: ['Budapest Card for transport', 'Metro is oldest in Europe', 'Thermal baths popular'],
    food: ['Goulash', 'Langos', 'Paprika Chicken', 'Hungarian Wine'], shopping: ['Váci Street', 'Andrássy Avenue', 'Great Market Hall'], nightlife: ['Ruins Bars', 'Jewish Quarter', 'Danube waterfront'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '107' }],
    cost_estimates: { metro_single: 'Ft350', bus_single: 'Ft350', taxi_base: 'Ft700', taxi_per_km: 'Ft300', daily_pass: 'Ft1650', weekly_pass: 'Ft4950' },
    quick_routes: { airport_to_center: 'BUD Airport → Deák Square', center_to_attraction: 'Deák → Buda Castle', station_to_market: 'Keleti → Great Market Hall' },
    is_trending: false, is_new: false
  },
  {
    name: 'Lisbon', region: 'Europe', country: 'Portugal', flag: '🇵🇹', lat: 38.722, lng: -9.139, score: 84, timezone_iana: 'Europe/Lisbon',
    transport_modes: ['metro', 'bus', 'tram', 'ferry', 'taxi'], best_for: 'Ocean & Culture', peak_hours: '08:00-10:00,17:00-19:00', night_service: true,
    booking_links: [{ name: 'Carris', url: 'https://carris.pt' }, { name: 'CP', url: 'https://cp.pt' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'WET/WEST (UTC+0/+1)', language: 'Portuguese, English', currency: '€ EUR', cost_level: 'Moderate', safety: 'Good', best_months: 'Mar-May, Sep-Oct',
    local_tips: ['Viva Viagem card essential', 'Tram 28 is tourist attraction', 'Metro covers city', 'Ferry to Cacilhas'],
    attractions: ['Belém Tower', 'Jerónimos Monastery', 'Alfama District', 'Time Out Market', 'Sintra day trip'],
    connectivity: { airport: 'LIS', railway: 'Oriente', metro_lines: 4, bus_network: 'Carris' },
    overview: 'Lisbon is a hilly coastal city with colorful buildings and rich maritime history.',
    transport_tips: ['Viva Viagem card essential', 'Tram 28 is tourist attraction', 'Metro covers city'],
    food: ['Bacalhau', 'Pastéis de Nata', 'Sardines', 'Ginjinha'], shopping: ['Chiado', 'Baixa', 'Time Out Market'], nightlife: ['Bairro Alto', 'Cais do Sodré', 'Alfama'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '808 200 112' }],
    cost_estimates: { metro_single: '€1.80', bus_single: '€2', taxi_base: '€3.50', taxi_per_km: '€1.50', daily_pass: '€6.40', weekly_pass: '€33.30' },
    quick_routes: { airport_to_center: 'LIS Airport → Baixa', center_to_attraction: 'Baixa → Alfama', station_to_market: 'Oriente → Time Out Market' },
    is_trending: true, is_new: false
  },
  {
    name: 'Athens', region: 'Europe', country: 'Greece', flag: '🇬🇷', lat: 37.983, lng: 23.727, score: 77, timezone_iana: 'Europe/Athens',
    transport_modes: ['metro', 'bus', 'tram', 'taxi'], best_for: 'Ancient History', peak_hours: '08:00-10:00,17:00-19:00', night_service: false,
    booking_links: [{ name: 'Athens Metro', url: 'https://ametro.gr' }, { name: 'OSE', url: 'https://ose.gr' }, { name: 'Beat', url: 'https://beat.gr' }],
    timezone: 'EET/EEST (UTC+2/+3)', language: 'Greek, English', currency: '€ EUR', cost_level: 'Moderate', safety: 'Good', best_months: 'Apr-Jun, Sep-Oct',
    local_tips: ['Athens Transport Ticket', 'Metro to archaeological sites', 'Avoid strike days', 'Acropolis early morning'],
    attractions: ['Acropolis', 'Parthenon', 'Plaka District', 'Ancient Agora', 'National Archaeological Museum'],
    connectivity: { airport: 'ATH', railway: 'Larisis Station', metro_lines: 3, bus_network: 'OSY' },
    overview: 'Athens is the cradle of Western civilization with ancient ruins and Mediterranean vibe.',
    transport_tips: ['Athens Transport Ticket', 'Metro to archaeological sites', 'Acropolis early morning'],
    food: ['Moussaka', 'Souvlaki', 'Greek Salad', 'Baklava'], shopping: ['Monastiraki', 'Plaka', 'Ermou Street'], nightlife: ['Psyrri', 'Gazi', 'Plaka'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '100' }],
    cost_estimates: { metro_single: '€1.40', bus_single: '€1.40', taxi_base: '€3.50', taxi_per_km: '€0.90', daily_pass: '€4.50', weekly_pass: '€20' },
    quick_routes: { airport_to_center: 'ATH Airport → Syntagma', center_to_attraction: 'Syntagma → Acropolis', station_to_market: 'Larisis → Monastiraki' },
    is_trending: false, is_new: false
  },
  {
    name: 'Zurich', region: 'Europe', country: 'Switzerland', flag: '🇨🇭', lat: 47.376, lng: 8.541, score: 94, timezone_iana: 'Europe/Zurich',
    transport_modes: ['tram', 'bus', 'train', 'taxi', 'boat'], best_for: 'Banking & Alps', peak_hours: '08:00-09:00,17:30-18:30', night_service: true,
    booking_links: [{ name: 'ZVV', url: 'https://zvv.ch' }, { name: 'SBB', url: 'https://sbb.ch' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'CET/CEST (UTC+1/+2)', language: 'German, English, French', currency: 'CHF', cost_level: 'Very High', safety: 'Very Safe', best_months: 'Jun-Sep, Dec-Mar',
    local_tips: ['Swiss Travel Pass', 'Tram + S-Bahn excellent', 'SBB app for trains', 'Boat scenic in summer'],
    attractions: ['Lake Zurich', 'Mount Pilatus', 'Bahnhofstrasse', 'Old Town', 'Uetliberg'],
    connectivity: { airport: 'ZRH', railway: 'Zürich HB', metro_lines: 3, bus_network: 'ZVV' },
    overview: 'Zurich is a global banking hub with stunning alpine scenery and excellent quality of life.',
    transport_tips: ['Swiss Travel Pass', 'Tram + S-Bahn excellent', 'SBB app for trains'],
    food: ['Fondue', 'Raclette', 'Zürcher Geschnetzeltes', 'Swiss Chocolate'], shopping: ['Bahnhofstrasse', 'Old Town', 'Löwenbräu'], nightlife: ['Kreis 1', 'Langstrasse', 'Zürich West'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '117' }],
    cost_estimates: { metro_single: 'CHF 4.40', bus_single: 'CHF 4.40', taxi_base: 'CHF 6', taxi_per_km: 'CHF 3.50', daily_pass: 'CHF 8.80', weekly_pass: 'CHF 36' },
    quick_routes: { airport_to_center: 'ZRH Airport → HB Station', center_to_attraction: 'HB → Bahnhofstrasse', station_to_market: 'Zürich HB → Niederdorf' },
    is_trending: false, is_new: false
  },
  {
    name: 'Stockholm', region: 'Europe', country: 'Sweden', flag: '🇸🇪', lat: 59.329, lng: 18.068, score: 88, timezone_iana: 'Europe/Stockholm',
    transport_modes: ['metro', 'bus', 'tram', 'ferry', 'taxi'], best_for: 'Design & Nature', peak_hours: '08:00-09:30,17:00-18:30', night_service: true,
    booking_links: [{ name: 'SL', url: 'https://sl.se' }, { name: 'SJ', url: 'https://sj.se' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'CET/CEST (UTC+1/+2)', language: 'Swedish, English', currency: 'kr SEK', cost_level: 'High', safety: 'Very Safe', best_months: 'May-Aug',
    local_tips: ['SL card essential', 'Metro is called Tunnelbana', 'Ferries to archipelago', 'Walkable city center'],
    attractions: ['Vasa Museum', 'Gamla Stan', 'ABBA Museum', 'Royal Palace', 'Skansen'],
    connectivity: { airport: 'ARN, BMA', railway: 'Stockholm Central', metro_lines: 3, bus_network: 'SL' },
    overview: 'Stockholm is built on islands with stunning architecture and innovative design.',
    transport_tips: ['SL card essential', 'Metro is called Tunnelbana', 'Ferries to archipelago'],
    food: ['Meatballs', 'Gravlax', 'Smörgåstårta', 'Cinnamon Buns'], shopping: ['Drottninggatan', 'Södermalm', 'NK'], nightlife: ['Södermalm', 'Stureplan', 'Gamla Stan'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '114 14' }],
    cost_estimates: { metro_single: 'kr40', bus_single: 'kr40', taxi_base: 'kr60', taxi_per_km: 'kr18', daily_pass: 'kr130', weekly_pass: 'kr440' },
    quick_routes: { airport_to_center: 'ARN Airport → Central Station', center_to_attraction: 'Central → Gamla Stan', station_to_market: 'Stockholm C → Södermalm' },
    is_trending: false, is_new: false
  },
  {
    name: 'Copenhagen', region: 'Europe', country: 'Denmark', flag: '🇩🇰', lat: 55.676, lng: 12.568, score: 89, timezone_iana: 'Europe/Copenhagen',
    transport_modes: ['metro', 'bus', 'train', 'bike', 'ferry'], best_for: 'Cycling & Design', peak_hours: '08:00-09:30,17:00-18:30', night_service: true,
    booking_links: [{ name: 'DOT', url: 'https://dinoffentligetransport.dk' }, { name: 'DSB', url: 'https://dsb.dk' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'CET/CEST (UTC+1/+2)', language: 'Danish, English', currency: 'kr DKK', cost_level: 'Very High', safety: 'Very Safe', best_months: 'May-Aug',
    local_tips: ['Copenhagen Card', 'City bike everywhere', 'Metro is excellent', 'Ferry to Sweden'],
    attractions: ['Little Mermaid', 'Tivoli Gardens', 'Nyhavn', 'Christiania', 'Rosenborg Castle'],
    connectivity: { airport: 'CPH', railway: 'København H', metro_lines: 4, bus_network: 'DOT' },
    overview: 'Copenhagen is a cycling city with minimalist design and happy residents.',
    transport_tips: ['Copenhagen Card', 'City bike everywhere', 'Metro is excellent'],
    food: ['Smørrebrød', 'Hot Dog', 'Danish Pastry', 'Frikadell'], shopping: ['Strøget', 'Vesterbro', 'Torvehallerne'], nightlife: ['Vesterbro', 'Nørrebro', 'Nyhavn'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '114' }],
    cost_estimates: { metro_single: 'kr24', bus_single: 'kr24', taxi_base: 'kr40', taxi_per_km: 'kr16', daily_pass: 'kr130', weekly_pass: 'kr440' },
    quick_routes: { airport_to_center: 'CPH Airport → Central Station', center_to_attraction: 'Central → Nyhavn', station_to_market: 'København H → Strøget' },
    is_trending: false, is_new: false
  },
  {
    name: 'Brussels', region: 'Europe', country: 'Belgium', flag: '🇧🇪', lat: 50.850, lng: 4.351, score: 82, timezone_iana: 'Europe/Brussels',
    transport_modes: ['metro', 'bus', 'tram', 'train', 'taxi'], best_for: 'EU & Chocolate', peak_hours: '08:00-09:30,17:00-18:30', night_service: true,
    booking_links: [{ name: 'STIB', url: 'https://stib-mivb.be' }, { name: 'SNCB', url: 'https://sncb.be' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'CET/CEST (UTC+1/+2)', language: 'French, Dutch, English', currency: '€ EUR', cost_level: 'High', safety: 'Good', best_months: 'May-Sep',
    local_tips: ['MOBIB card for transport', 'Metro covers main areas', 'Walking is easy', 'Grand Place at night'],
    attractions: ['Grand Place', 'Atomium', 'Manneken Pis', 'Royal Palace', 'Chocolate Museum'],
    connectivity: { airport: 'BRU', railway: 'Bruxelles-Central', metro_lines: 4, bus_network: 'STIB' },
    overview: 'Brussels is the EU capital with stunning architecture and famous chocolates.',
    transport_tips: ['MOBIB card for transport', 'Metro covers main areas', 'Walking is easy'],
    food: ['Waffles', 'Mussels', 'Frites', 'Chocolate'], shopping: ['Galeries Royales', 'Maalbeek', 'Sablon'], nightlife: ['St-Géry', 'Les Halles', 'Ixelles'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '101' }],
    cost_estimates: { metro_single: '€2.10', bus_single: '€2.10', taxi_base: '€5', taxi_per_km: '€2', daily_pass: '€7.50', weekly_pass: '€30' },
    quick_routes: { airport_to_center: 'BRU Airport → Grand Place', center_to_attraction: 'Central → Atomium', station_to_market: 'Bruxelles-Central → Sablon' },
    is_trending: false, is_new: false
  },
  {
    name: 'Munich', region: 'Europe', country: 'Germany', flag: '🇩🇪', lat: 48.135, lng: 11.582, score: 87, timezone_iana: 'Europe/Berlin',
    transport_modes: ['metro', 'bus', 'tram', 'train', 'taxi'], best_for: 'Beer & BMW', peak_hours: '08:00-09:30,17:00-18:30', night_service: true,
    booking_links: [{ name: 'MVV', url: 'https://mvv-muenchen.de' }, { name: 'DB', url: 'https://bahn.com' }, { name: 'Bolt', url: 'https://bolt.eu' }],
    timezone: 'CET/CEST (UTC+1/+2)', language: 'German, English', currency: '€ EUR', cost_level: 'Moderate-High', safety: 'Good', best_months: 'May-Sep',
    local_tips: ['MVV Isarcard for transport', 'U-Bahn + S-Bahn extensive', 'Bike lanes everywhere', 'Oktoberfest transport tips'],
    attractions: ['Marienplatz', 'BMW Museum', 'English Garden', 'Hofbräuhaus', 'Neuschwanstein day trip'],
    connectivity: { airport: 'MUC', railway: 'Hauptbahnhof', metro_lines: 8, bus_network: 'MVV' },
    overview: 'Munich is known for beer gardens, BMW, and proximity to the Alps.',
    transport_tips: ['MVV Isarcard for transport', 'U-Bahn + S-Bahn extensive', 'Bike lanes everywhere'],
    food: ['Weisswurst', 'Brezn', 'Schnitzel', 'Weissbier'], shopping: ['Maximilianstraße', 'Kaufingerstraße', 'Viktualienmarkt'], nightlife: ['Maxvorstadt', 'Glockenbachviertel', 'Haidhausen'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '110' }],
    cost_estimates: { metro_single: '€3.30', bus_single: '€3.30', taxi_base: '€5', taxi_per_km: '€2.40', daily_pass: '€8.80', weekly_pass: '€38' },
    quick_routes: { airport_to_center: 'MUC Airport → Marienplatz', center_to_attraction: 'Marienplatz → English Garden', station_to_market: 'Hauptbahnhof → Viktualienmarkt' },
    is_trending: false, is_new: false
  },
  {
    name: 'Madrid', region: 'Europe', country: 'Spain', flag: '🇪🇸', lat: 40.416, lng: -3.703, score: 87, timezone_iana: 'Europe/Madrid',
    transport_modes: ['metro', 'bus', 'train', 'taxi'], best_for: 'Flamenco & Royal', peak_hours: '08:00-09:30,17:30-19:30', night_service: true,
    booking_links: [{ name: 'EMT', url: 'https://emtmadrid.es' }, { name: 'Renfe', url: 'https://renfe.com' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'CET/CEST (UTC+1/+2)', language: 'Spanish, English', currency: '€ EUR', cost_level: 'Moderate', safety: 'Good', best_months: 'Apr-Jun, Sep-Oct',
    local_tips: ['Metro covers everything', '10-ticket for discount', 'EMT bus app', 'Renfe for day trips'],
    attractions: ['Royal Palace', 'Prado Museum', 'Retiro Park', 'Gran Vía', 'Santiago Bernabéu'],
    connectivity: { airport: 'MAD Barajas', railway: 'Atocha', metro_lines: 12, bus_network: 'EMT' },
    overview: 'Madrid is Spain\'s capital with world-class art, royal palaces, and vibrant nightlife.',
    transport_tips: ['Metro covers everything', '10-ticket for discount', 'Renfe for day trips'],
    food: ['Paella', 'Tapas', 'Jamón Ibérico', 'Churros'], shopping: ['Gran Vía', 'Salamanca', 'El Rastro'], nightlife: ['Chueca', 'Malasaña', 'Lavapiés'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '091' }],
    cost_estimates: { metro_single: '€1.50-2', bus_single: '€1.50', taxi_base: '€4', taxi_per_km: '€1.35', daily_pass: '€8.80', weekly_pass: '€36' },
    quick_routes: { airport_to_center: 'MAD Airport → Gran Via', center_to_attraction: 'Sol → Prado Museum', station_to_market: 'Atocha → El Rastro' },
    is_trending: false, is_new: false
  },
  {
    name: 'Manchester', region: 'Europe', country: 'UK', flag: '🇬🇧', lat: 53.480, lng: -2.242, score: 81, timezone_iana: 'Europe/London',
    transport_modes: ['metro', 'bus', 'train', 'taxi'], best_for: 'Football & Music', peak_hours: '08:00-09:30,17:00-18:30', night_service: true,
    booking_links: [{ name: 'TfGM', url: 'https://tfgm.com' }, { name: 'Northern Rail', url: 'https://northernrailway.co.uk' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'GMT/BST (UTC+0/+1)', language: 'English', currency: '£ GBP', cost_level: 'Moderate', safety: 'Moderate', best_months: 'May-Sep',
    local_tips: ['Metrolink tram essential', 'Bee Network bus new', 'Northern Rail for suburbs', 'Oxford Road Station'],
    attractions: ['Old Trafford', 'Science and Industry Museum', 'Canal Street', 'Manchester Art Gallery', 'Northern Quarter'],
    connectivity: { airport: 'MAN', railway: 'Piccadilly', metro_lines: 7, bus_network: 'Bee Network' },
    overview: 'Manchester is known for football, music, and industrial heritage.',
    transport_tips: ['Metrolink tram essential', 'Bee Network bus new', 'Northern Rail for suburbs'],
    food: ['Fish and Chips', 'Cottage Pie', 'Manchester Tart', 'Curry'], shopping: ['Arndale Centre', 'Northern Quarter', 'King Street'], nightlife: ['Canal Street', 'Northern Quarter', 'Deansgate'],
    emergency_contacts: [{ name: 'Emergency', number: '999' }, { name: 'Police', number: '101' }],
    cost_estimates: { metro_single: '£2.60', bus_single: '£2', taxi_base: '£3.50', taxi_per_km: '£1.80', daily_pass: '£7', weekly_pass: '£28' },
    quick_routes: { airport_to_center: 'MAN Airport → Piccadilly', center_to_attraction: 'Piccadilly → Old Trafford', station_to_market: 'Piccadilly → Northern Quarter' },
    is_trending: false, is_new: false
  },
  {
    name: 'Edinburgh', region: 'Europe', country: 'UK', flag: '🇬🇧', lat: 55.953, lng: -3.188, score: 85, timezone_iana: 'Europe/London',
    transport_modes: ['bus', 'train', 'taxi'], best_for: 'History & Festivals', peak_hours: '08:00-10:00,17:00-19:00', night_service: true,
    booking_links: [{ name: 'Lothian', url: 'https://lothianbuses.com' }, { name: 'ScotRail', url: 'https://scotrail.co.uk' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'GMT/BST (UTC+0/+1)', language: 'English, Scots', currency: '£ GBP', cost_level: 'Moderate-High', safety: 'Good', best_months: 'Jun-Aug',
    local_tips: ['Lothian buses best', 'Edinburgh Festival busy', 'Walkable old town', 'Arthur\'s Seat hike'],
    attractions: ['Edinburgh Castle', 'Royal Mile', 'Holyrood Palace', 'Arthur\'s Seat', 'Royal Botanic Garden'],
    connectivity: { airport: 'EDI', railway: 'Waverley', metro_lines: 0, bus_network: 'Lothian' },
    overview: 'Edinburgh is Scotland\'s capital with medieval architecture and famous festivals.',
    transport_tips: ['Lothian buses best', 'Edinburgh Festival busy', 'Walkable old town'],
    food: ['Haggis', 'Cullen Skink', 'Shortbread', 'Whisky'], shopping: ['Princess Street', 'Royal Mile', 'Grassmarket'], nightlife: ['Old Town', 'Leith', 'West End'],
    emergency_contacts: [{ name: 'Emergency', number: '999' }, { name: 'Police', number: '101' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '£1.80', taxi_base: '£4', taxi_per_km: '£2', daily_pass: '£5', weekly_pass: '£20' },
    quick_routes: { airport_to_center: 'EDI Airport → Waverley', center_to_attraction: 'Waverley → Edinburgh Castle', station_to_market: 'Waverley → Royal Mile' },
    is_trending: false, is_new: false
  },
  {
    name: 'Geneva', region: 'Europe', country: 'Switzerland', flag: '🇨🇭', lat: 46.204, lng: 6.143, score: 91, timezone_iana: 'Europe/Zurich',
    transport_modes: ['tram', 'bus', 'train', 'boat', 'taxi'], best_for: 'Diplomacy & Lakes', peak_hours: '08:00-09:30,17:00-18:30', night_service: true,
    booking_links: [{ name: 'TPG', url: 'https://tpg.ch' }, { name: 'SBB', url: 'https://sbb.ch' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'CET/CEST (UTC+1/+2)', language: 'French, English, German', currency: 'CHF', cost_level: 'Very High', safety: 'Very Safe', best_months: 'Jun-Sep',
    local_tips: ['Geneva Transport Card free', 'Tram + bus extensive', 'Lake boat scenic', 'UN Palace tour'],
    attractions: ['Lake Geneva', 'Jet d\'Eau', 'Old Town', 'Palais des Nations', 'Patek Philippe Museum'],
    connectivity: { airport: 'GVA', railway: 'Cornavin', metro_lines: 0, bus_network: 'TPG' },
    overview: 'Geneva is a diplomatic hub with stunning lake, luxury watches, and humanitarian organizations.',
    transport_tips: ['Geneva Transport Card free', 'Tram + bus extensive', 'Lake boat scenic'],
    food: ['Fondue', 'Raclette', 'Lake Fish', 'Chocolate'], shopping: ['Rue du Rhône', 'Plainpalais', 'Lausanne'], nightlife: ['Carouge', 'Plainpalais', 'Cologny'],
    emergency_contacts: [{ name: 'Emergency', number: '112' }, { name: 'Police', number: '117' }],
    cost_estimates: { metro_single: 'N/A', bus_single: 'CHF 3', taxi_base: 'CHF 6', taxi_per_km: 'CHF 3.50', daily_pass: 'CHF 10', weekly_pass: 'CHF 40' },
    quick_routes: { airport_to_center: 'GVA Airport → Cornavin', center_to_attraction: 'Cornavin → Jet d\'Eau', station_to_market: 'Cornavin → Old Town' },
    is_trending: false, is_new: false
  },
  // ============ NEW CITIES (20) ============
  {
    name: 'Jakarta', region: 'Asia', country: 'Indonesia', flag: '🇮🇩', lat: -6.208, lng: 106.846, score: 72, timezone_iana: 'Asia/Jakarta',
    transport_modes: ['metro', 'bus', 'taxi', 'train'], best_for: 'Business & Culture', peak_hours: '07:00-09:00,17:00-19:00', night_service: false,
    booking_links: [{ name: 'MRT Jakarta', url: 'https://jakartamrt.com' }, { name: 'KAI', url: 'https://kai.id' }, { name: 'Gojek', url: 'https://gojek.com' }],
    timezone: 'WIB (UTC+7)', language: 'Indonesian, English', currency: 'Rp IDR', cost_level: 'Budget', safety: 'Moderate', best_months: 'May-Oct',
    local_tips: ['MRT is new and clean', 'TransJakarta busways', 'Ride apps like Gojek common', 'Traffic is legendary'],
    attractions: ['Monas', 'Kota Tua', 'Ancol', 'Taman Mini', 'Bundaran HI'],
    connectivity: { airport: 'CGK Soekarno-Hatta', railway: 'Gambir', metro_lines: 2, bus_network: 'TransJakarta' },
    overview: 'Jakarta is Indonesia\'s capital with business districts and colonial heritage.',
    transport_tips: ['MRT is new and clean', 'TransJakarta busways', 'Ride apps like Gojek common'],
    food: ['Nasi Goreng', 'Sate', 'Gado-gado', 'Bubur'], shopping: ['Grand Indonesia', 'Plaza Indonesia', 'Pasar Baru'], nightlife: ['Kemang', 'SCBD', 'Pantai Indah Kapuk'],
    emergency_contacts: [{ name: 'Police', number: '110' }, { name: 'Ambulance', number: '118' }],
    cost_estimates: { metro_single: 'Rp 3K-10K', bus_single: 'Rp 3.5K', taxi_base: 'Rp 10K', taxi_per_km: 'Rp 3K', daily_pass: 'Rp 30K', weekly_pass: 'Rp 150K' },
    quick_routes: { airport_to_center: 'CGK Airport → Bundaran HI', center_to_attraction: 'Monas → Kota Tua', station_to_market: 'Gambir → Pasar Baru' },
    is_trending: false, is_new: true
  },
  {
    name: 'Manila', region: 'Asia', country: 'Philippines', flag: '🇵🇭', lat: 14.599, lng: 120.984, score: 68, timezone_iana: 'Asia/Manila',
    transport_modes: ['metro', 'bus', 'jeepney', 'taxi', 'ferry'], best_for: 'Beaches & Heritage', peak_hours: '07:00-09:00,17:00-19:00', night_service: false,
    booking_links: [{ name: 'MRT3', url: 'https://dotr.gov.ph' }, { name: 'Grab', url: 'https://grab.com' }],
    timezone: 'PHT (UTC+8)', language: 'Filipino, English', currency: '₱ PHP', cost_level: 'Budget', safety: 'Moderate', best_months: 'Dec-May',
    local_tips: ['Jeepneys are iconic', 'MRT/LRT for rail', 'Grab for taxis', 'Traffic is chaotic'],
    attractions: ['Intramuros', 'Rizal Park', 'Binondo', 'SM Mall', 'Roxas Boulevard'],
    connectivity: { airport: 'MNL Ninoy Aquino', railway: 'Tutuban', metro_lines: 3, bus_network: 'Various' },
    overview: 'Manila is a bustling metropolis with Spanish colonial heritage and vibrant street culture.',
    transport_tips: ['Jeepneys are iconic', 'MRT/LRT for rail', 'Grab for taxis'],
    food: ['Adobo', 'Sinigang', 'Lechon', 'Halo-halo'], shopping: ['Divisoria', 'SM Mall', 'Greenbelt'], nightlife: ['Malate', 'Poblacion', 'Bonifacio High Street'],
    emergency_contacts: [{ name: 'Police', number: '117' }, { name: 'Ambulance', number: '911' }],
    cost_estimates: { metro_single: '₱15-25', bus_single: '₱15-30', taxi_base: '₱40', taxi_per_km: '₱12', daily_pass: '₱100', weekly_pass: '₹500' },
    quick_routes: { airport_to_center: 'MNL Airport → Intramuros', center_to_attraction: 'Rizal Park → Binondo', station_to_market: 'Tutuban → Divisoria' },
    is_trending: false, is_new: true
  },
  {
    name: 'Taipei', region: 'Asia', country: 'Taiwan', flag: '🇹🇼', lat: 25.033, lng: 121.565, score: 88, timezone_iana: 'Asia/Taipei',
    transport_modes: ['metro', 'bus', 'taxi', 'bike', 'train'], best_for: 'Night Markets & Tech', peak_hours: '08:00-09:30,17:30-19:00', night_service: true,
    booking_links: [{ name: 'Metro Taipei', url: 'https://metro.taipei' }, { name: 'THSR', url: 'https://thsr.gov.tw' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'CST (UTC+8)', language: 'Mandarin, Taiwanese', currency: 'NT$ TWD', cost_level: 'Moderate', safety: 'Very Safe', best_months: 'Oct-Apr',
    local_tips: ['EasyCard essential', 'Metro is punctual', 'YouBike everywhere', 'Night markets amazing'],
    attractions: ['Taipei 101', 'National Palace Museum', 'Shilin Night Market', 'Ximending', ' Elephant Mountain'],
    connectivity: { airport: 'TPE Taoyuan, TSA Songshan', railway: 'Taipei Main Station', metro_lines: 7, bus_network: 'Taipei Bus' },
    overview: 'Taipei blends modern tech with traditional temples and amazing night markets.',
    transport_tips: ['EasyCard essential', 'Metro is punctual', 'YouBike everywhere'],
    food: ['Bubble Tea', 'Beef Noodles', 'Xiao Long Bao', 'Stinky Tofu'], shopping: ['Ximending', 'Tonghua Street', '地下街'], nightlife: ['Shilin', 'Ximending', 'Raohe Night Market'],
    emergency_contacts: [{ name: 'Emergency', number: '119' }, { name: 'Police', number: '110' }],
    cost_estimates: { metro_single: 'NT$20-65', bus_single: 'NT$15-30', taxi_base: 'NT$70', taxi_per_km: 'NT$20', daily_pass: 'NT$150', weekly_pass: 'NT$600' },
    quick_routes: { airport_to_center: 'TPE Airport → Taipei 101', center_to_attraction: 'Taipei Main → Shilin Night Market', station_to_market: 'MRT → Ximending' },
    is_trending: true, is_new: true
  },
  {
    name: 'Osaka', region: 'Asia', country: 'Japan', flag: '🇯🇵', lat: 34.693, lng: 135.502, score: 86, timezone_iana: 'Asia/Tokyo',
    transport_modes: ['metro', 'bus', 'train', 'taxi', 'bike'], best_for: 'Food & Entertainment', peak_hours: '08:00-10:00,17:30-20:00', night_service: true,
    booking_links: [{ name: 'Osaka Metro', url: 'https://osaka-metropolitan.jp' }, { name: 'JR Pass', url: 'https://japanrailpass.com' }, { name: 'Uber', url: 'https://uber.com' }],
    timezone: 'JST (UTC+9)', language: 'Japanese, English', currency: '¥ JPY', cost_level: 'Moderate', safety: 'Very Safe', best_months: 'Mar-May, Sep-Nov',
    local_tips: ['ICOCA card for all', 'Metro is excellent', 'JR train network', 'Dotonbori at night'],
    attractions: ['Dotonbori', 'Osaka Castle', 'Universal Studios', 'Shinsaibashi', 'Umeda Sky Building'],
    connectivity: { airport: 'KIX Kansai, ITM Itami', railway: 'Osaka Station', metro_lines: 9, bus_network: 'Osaka City Bus' },
    overview: 'Osaka is Japan\'s kitchen with amazing food, nightlife, and Universal Studios.',
    transport_tips: ['ICOCA card for all', 'Metro is excellent', 'JR train network'],
    food: ['Takoyaki', 'Okonomiyaki', 'Kushikatsu', 'Matcha'], shopping: ['Shinsaibashi', 'Umeda', 'Namba'], nightlife: ['Dotonbori', 'Namba', 'Umeda'],
    emergency_contacts: [{ name: 'Police', number: '110' }, { name: 'Ambulance', number: '119' }],
    cost_estimates: { metro_single: '¥180-280', bus_single: '¥210', taxi_base: '¥680', taxi_per_km: '¥80', daily_pass: '¥800', weekly_pass: '¥3000' },
    quick_routes: { airport_to_center: 'KIX Airport → Namba', center_to_attraction: 'Namba → Dotonbori', station_to_market: 'Osaka Station → Shinsaibashi' },
    is_trending: false, is_new: true
  },
  {
    name: 'Shanghai', region: 'Asia', country: 'China', flag: '🇨🇳', lat: 31.230, lng: 121.473, score: 85, timezone_iana: 'Asia/Shanghai',
    transport_modes: ['metro', 'bus', 'taxi', 'maglev', 'ferry'], best_for: 'Finance & Culture', peak_hours: '08:00-09:30,17:30-19:30', night_service: true,
    booking_links: [{ name: 'Shanghai Metro', url: 'https://shmetro.com' }, { name: 'Didi', url: 'https://didiglobal.com' }],
    timezone: 'CST (UTC+8)', language: 'Mandarin, Shanghainese', currency: '¥ CNY', cost_level: 'Moderate', safety: 'Good', best_months: 'Apr-Jun, Sep-Nov',
    local_tips: ['Metro is extensive', 'Shanghai Transit Card', 'Maglev to airport', 'Didi for taxis'],
    attractions: ['The Bund', 'Pearl Tower', 'Yu Garden', 'Nanjing Road', 'French Concession'],
    connectivity: { airport: 'PVG Pudong, SHA Hongqiao', railway: 'Shanghai Station', metro_lines: 19, bus_network: 'Shanghai Bus' },
    overview: 'Shanghai blends colonial architecture with futuristic skyline and vibrant culture.',
    transport_tips: ['Metro is extensive', 'Shanghai Transit Card', 'Maglev to airport'],
    food: ['Xiaolongbao', 'Shengjianbao', 'Hairtail', 'Sweet and Sour Pork'], shopping: ['Nanjing Road', 'Huaihai Road', 'Xintiandi'], nightlife: ['The Bund', 'French Concession', 'Xintiandi'],
    emergency_contacts: [{ name: 'Police', number: '110' }, { name: 'Ambulance', number: '120' }],
    cost_estimates: { metro_single: '¥3-9', bus_single: '¥2', taxi_base: '¥14', taxi_per_km: '¥2.70', daily_pass: '¥18', weekly_pass: '¥70' },
    quick_routes: { airport_to_center: 'PVG Airport → The Bund', center_to_attraction: 'Nanjing Road → Yu Garden', station_to_market: 'Shanghai Station → Nanjing Road' },
    is_trending: false, is_new: true
  },
  {
    name: 'Beijing', region: 'Asia', country: 'China', flag: '🇨🇳', lat: 39.904, lng: 116.408, score: 82, timezone_iana: 'Asia/Shanghai',
    transport_modes: ['metro', 'bus', 'taxi', 'train'], best_for: 'History & Politics', peak_hours: '07:30-09:00,17:30-19:00', night_service: false,
    booking_links: [{ name: 'Beijing Metro', url: 'https://bjsubway.com' }, { name: 'Didi', url: 'https://didiglobal.com' }],
    timezone: 'CST (UTC+8)', language: 'Mandarin', currency: '¥ CNY', cost_level: 'Moderate', safety: 'Good', best_months: 'Apr-Jun, Sep-Oct',
    local_tips: ['Metro is extensive', 'Yikatong card', 'Beijing card for tourists', 'Taxi apps common'],
    attractions: ['Great Wall', 'Forbidden City', 'Tiananmen Square', 'Temple of Heaven', 'Summer Palace'],
    connectivity: { airport: 'PEK Capital, PKX Daxing', railway: 'Beijing Station', metro_lines: 27, bus_network: 'Beijing Bus' },
    overview: 'Beijing is China\'s capital with ancient landmarks and modern development.',
    transport_tips: ['Metro is extensive', 'Yikatong card', 'Beijing card for tourists'],
    food: ['Peking Duck', 'Jianbing', 'Dim Sum', 'Mongolian Hotpot'], shopping: ['Wangfujing', 'Silk Street', 'Sanlitun'], nightlife: ['Sanlitun', 'Houhai', 'Guomao'],
    emergency_contacts: [{ name: 'Police', number: '110' }, { name: 'Ambulance', number: '120' }],
    cost_estimates: { metro_single: '¥3-10', bus_single: '¥2', taxi_base: '¥13', taxi_per_km: '¥2.30', daily_pass: '¥15', weekly_pass: '¥65' },
    quick_routes: { airport_to_center: 'PEK Airport → Tiananmen', center_to_attraction: 'Tiananmen → Forbidden City', station_to_market: 'Beijing Station → Wangfujing' },
    is_trending: false, is_new: true
  },
  {
    name: 'Tel Aviv', region: 'Middle East', country: 'Israel', flag: '🇮🇱', lat: 32.085, lng: 34.781, score: 83, timezone_iana: 'Asia/Jerusalem',
    transport_modes: ['bus', 'taxi', 'bike', 'train'], best_for: 'Beaches & Tech', peak_hours: '08:00-10:00,17:00-19:00', night_service: true,
    booking_links: [{ name: 'Rav-Kav', url: 'https://ravkavonline.co.il' }, { name: 'Gett', url: 'https://gett.com' }],
    timezone: 'IST (UTC+2)', language: 'Hebrew, Arabic, English', currency: '₪ ILS', cost_level: 'High', safety: 'Good', best_months: 'Mar-May, Sep-Nov',
    local_tips: ['Rav-Kav card essential', 'Bus is main transport', 'Tel-O-Fun bikes', 'Train to airport'],
    attractions: ['Old Jaffa', 'Beaches', 'Rothschild Blvd', 'Carmel Market', 'Basel'],
    connectivity: { airport: 'TLV Ben Gurion', railway: 'Tel Aviv Center', metro_lines: 0, bus_network: 'Egged' },
    overview: 'Tel Aviv is Israel\'s tech hub with beautiful beaches and vibrant nightlife.',
    transport_tips: ['Rav-Kav card essential', 'Bus is main transport', 'Tel-O-Fun bikes'],
    food: ['Falafel', 'Hummus', 'Shakshuka', 'Sabich'], shopping: ['Carmel Market', 'Dizengoff', 'Rothschild'], nightlife: ['Rothschild', 'Florentine', 'The Port'],
    emergency_contacts: [{ name: 'Emergency', number: '101' }, { name: 'Police', number: '100' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '₪5.90', taxi_base: '₪12', taxi_per_km: '₪3.50', daily_pass: '₪13.50', weekly_pass: '₪65' },
    quick_routes: { airport_to_center: 'TLV Airport → Rothschild', center_to_attraction: 'Rothschild → Old Jaffa', station_to_market: 'Tel Aviv Station → Carmel Market' },
    is_trending: false, is_new: true
  },
  {
    name: 'Riyadh', region: 'Middle East', country: 'Saudi Arabia', flag: '🇸🇦', lat: 24.713, lng: 46.675, score: 74, timezone_iana: 'Asia/Riyadh',
    transport_modes: ['bus', 'taxi', 'car'], best_for: 'Business & Heritage', peak_hours: '07:00-10:00,15:00-18:00', night_service: false,
    booking_links: [{ name: 'Riyadh Metro', url: 'https://riyadhmetro.sa' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Careem', url: 'https://careem.com' }],
    timezone: 'AST (UTC+3)', language: 'Arabic, English', currency: '﷼ SAR', cost_level: 'High', safety: 'Good', best_months: 'Oct-Mar',
    local_tips: ['Metro under construction', 'Uber/Careem common', 'Car is main transport', 'No women driving (yet)'],
    attractions: ['Kingdom Centre', 'Masmak Fortress', 'National Museum', 'Al Masmak', 'Riyadh Zoo'],
    connectivity: { airport: 'RUH King Khalid', railway: 'Riyadh Station', metro_lines: 0, bus_network: 'SAPTCO' },
    overview: 'Riyadh is Saudi Arabia\'s capital with rapid modernization and historic sites.',
    transport_tips: ['Metro under construction', 'Uber/Careem common', 'Car is main transport'],
    food: ['Kabsa', 'Shawarma', 'Mandazi', 'Dates'], shopping: ['Kingdom Centre', 'Riyadh Gallery', 'Al Oroug'], nightlife: ['Diplomatic Quarter', 'Kingdom Centre', 'U Walk'],
    emergency_contacts: [{ name: 'Emergency', number: '999' }, { name: 'Ambulance', number: '997' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '﷼5', taxi_base: '﷼12', taxi_per_km: '﷼1.50', daily_pass: 'N/A', weekly_pass: 'N/A' },
    quick_routes: { airport_to_center: 'RUH Airport → Kingdom Centre', center_to_attraction: 'Downtown → Masmak Fortress', station_to_market: 'Riyadh Station → Kingdom Centre' },
    is_trending: false, is_new: true
  },
  {
    name: 'Doha', region: 'Middle East', country: 'Qatar', flag: '🇶🇦', lat: 25.286, lng: 51.533, score: 80, timezone_iana: 'Asia/Qatar',
    transport_modes: ['metro', 'bus', 'taxi'], best_for: 'Luxury & Culture', peak_hours: '07:30-09:00,17:00-19:00', night_service: true,
    booking_links: [{ name: 'M Doha', url: 'https://mrc.gov.qa' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Careem', url: 'https://careem.com' }],
    timezone: 'AST (UTC+3)', language: 'Arabic, English', currency: '﷼ QAR', cost_level: 'Very High', safety: 'Very Safe', best_months: 'Nov-Mar',
    local_tips: ['Karwa taxi app', 'Metro is new', 'No alcohol (mostly)', 'Air-conditioned everything'],
    attractions: ['Museum of Islamic Art', 'Souq Waqif', 'The Pearl', 'Corniche', 'Katara'],
    connectivity: { airport: 'DOH Hamad', railway: 'Msheireb', metro_lines: 3, bus_network: 'Mowasalat' },
    overview: 'Doha is Qatar\'s capital with stunning museums and luxury shopping.',
    transport_tips: ['Karwa taxi app', 'Metro is new', 'Air-conditioned everything'],
    food: ['Hummus', 'Machboos', 'Umm Ali', 'Falafel'], shopping: ['Villaggio', 'The Pearl', 'City Center'], nightlife: ['The Pearl', 'Katara', 'West Bay'],
    emergency_contacts: [{ name: 'Emergency', number: '999' }, { name: 'Ambulance', number: '999' }],
    cost_estimates: { metro_single: '﷼2-10', bus_single: '﷼3', taxi_base: '﷼12', taxi_per_km: '﷼1.80', daily_pass: '﷼20', weekly_pass: '﷼80' },
    quick_routes: { airport_to_center: 'DOH Airport → Corniche', center_to_attraction: 'Corniche → Museum of Islamic Art', station_to_market: 'Msheireb → Souq Waqif' },
    is_trending: false, is_new: true
  },
  {
    name: 'Nairobi', region: 'Africa', country: 'Kenya', flag: '🇰🇪', lat: -1.292, lng: 36.821, score: 68, timezone_iana: 'Africa/Nairobi',
    transport_modes: ['bus', 'matatu', 'taxi', 'Uber'], best_for: 'Safari Gateway', peak_hours: '07:00-09:00,17:00-19:00', night_service: false,
    booking_links: [{ name: 'KBus', url: 'https://kbs.co.ke' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Little', url: 'https://littleapp.co' }],
    timezone: 'EAT (UTC+3)', language: 'Swahili, English', currency: 'KSh KES', cost_level: 'Budget', safety: 'Moderate', best_months: 'Jul-Oct, Jan-Feb',
    local_tips: ['Matatus are iconic', 'Uber safe and common', 'Bolt for alternatives', 'Nairobi traffic bad'],
    attractions: ['Nairobi National Park', 'Giraffe Manor', 'Karen Blixen', 'Carnivore', 'Kenyatta Avenue'],
    connectivity: { airport: 'NBO Jomo Kenyatta', railway: 'Nairobi Central', metro_lines: 0, bus_network: 'KBS' },
    overview: 'Nairobi is Kenya\'s capital with safari access and vibrant urban culture.',
    transport_tips: ['Matatus are iconic', 'Uber safe and common', 'Bolt for alternatives'],
    food: ['Nyama Choma', 'Ugali', 'Sukuma Wiki', 'Chai'], shopping: ['Westlands', 'Karen', 'Gateway Mall'], nightlife: ['Westlands', 'Kilimani', 'Nairobi CBD'],
    emergency_contacts: [{ name: 'Police', number: '999' }, { name: 'Ambulance', number: '999' }],
    cost_estimates: { metro_single: 'N/A', bus_single: 'KSh 50-150', taxi_base: 'KSh 300', taxi_per_km: 'KSh 50', daily_pass: 'KSh 1000', weekly_pass: 'KSh 5000' },
    quick_routes: { airport_to_center: 'NBO Airport → CBD', center_to_attraction: 'CBD → Nairobi National Park', station_to_market: 'Nairobi Station → Westlands' },
    is_trending: false, is_new: true
  },
  {
    name: 'Lagos', region: 'Africa', country: 'Nigeria', flag: '🇳🇬', lat: 6.524, lng: 3.379, score: 62, timezone_iana: 'Africa/Lagos',
    transport_modes: ['bus', 'taxi', 'boat', 'Uber'], best_for: 'Music & Business', peak_hours: '07:00-09:30,17:00-20:00', night_service: false,
    booking_links: [{ name: 'Lagos Bus', url: 'https://lamata.gov.ng' }, { name: 'Uber', url: 'https://uber.com' }, { name: 'Bolt', url: 'https://bolt.eu' }],
    timezone: 'WAT (UTC+1)', language: 'English, Yoruba', currency: '₦ NGN', cost_level: 'Budget', safety: 'Moderate', best_months: 'Nov-Feb',
    local_tips: ['Uber/Bolt recommended', 'BRT buses for cheap', 'Traffic is extreme', 'Lagos is car-focused'],
    attractions: ['Victoria Island', 'Lagos Lagoon', 'National Museum', 'Tarkwa Bay', 'Eko Atlantic'],
    connectivity: { airport: 'LOS Murtala Muhammed', railway: 'Lagos Terminal', metro_lines: 0, bus_network: 'LAMATA' },
    overview: 'Lagos is Nigeria\'s largest city with vibrant music scene and business hub.',
    transport_tips: ['Uber/Bolt recommended', 'BRT buses for cheap', 'Traffic is extreme'],
    food: ['Jollof Rice', 'Suya', 'Puff Puff', 'Eba'], shopping: ['Balogun Market', 'The Palms', 'Ikeja City Mall'], nightlife: ['Victoria Island', 'Lekki', 'Ikoyi'],
    emergency_contacts: [{ name: 'Police', number: '199' }, { name: 'Ambulance', number: '199' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '₦200-500', taxi_base: '₦500', taxi_per_km: '₦100', daily_pass: '₦2000', weekly_pass: '₦10000' },
    quick_routes: { airport_to_center: 'LOS Airport → Victoria Island', center_to_attraction: 'VI → Lagos Lagoon', station_to_market: 'Lagos Station → Balogun Market' },
    is_trending: false, is_new: true
  },
  {
    name: 'Casablanca', region: 'Africa', country: 'Morocco', flag: '🇲🇦', lat: 33.573, lng: -7.589, score: 70, timezone_iana: 'Africa/Casablanca',
    transport_modes: ['tram', 'bus', 'taxi', 'train'], best_for: 'Business & Architecture', peak_hours: '08:00-10:00,17:00-19:00', night_service: false,
    booking_links: [{ name: 'Casabus', url: 'https://casabus.ma' }, { name: 'ONCF', url: 'https://oncf.ma' }, { name: 'Careem', url: 'https://careem.com' }],
    timezone: 'WET (UTC+1)', language: 'Arabic, French, Berber', currency: 'MAD', cost_level: 'Budget', safety: 'Moderate', best_months: 'Mar-May, Sep-Nov',
    local_tips: ['Tramway is modern', 'Petit taxis city only', 'Grand taxis for intercity', 'Petit taxi meter'],
    attractions: ['Hassan II Mosque', 'Corniche', 'Old Medina', 'Rick\'s Cafe', 'Ain Diab'],
    connectivity: { airport: 'CMN Mohammed V', railway: 'Casa Voyageurs', metro_lines: 2, bus_network: 'Casabus' },
    overview: 'Casablanca is Morocco\'s largest city with stunning mosque and French colonial architecture.',
    transport_tips: ['Tramway is modern', 'Petit taxis city only', 'Grand taxis for intercity'],
    food: ['Couscous', 'Tajine', 'Fish Sardines', 'Harira'], shopping: ['Habous Quarter', 'Morocco Mall', 'Anfa Place'], nightlife: ['Corniche', 'Maarif', 'Ain Diab'],
    emergency_contacts: [{ name: 'Police', number: '19' }, { name: 'Ambulance', number: '15' }],
    cost_estimates: { metro_single: 'N/A', bus_single: 'MAD 6', taxi_base: 'MAD 15', taxi_per_km: 'MAD 3', daily_pass: 'MAD 30', weekly_pass: 'MAD 150' },
    quick_routes: { airport_to_center: 'CMN Airport → Hassan II Mosque', center_to_attraction: 'Casa Voyageurs → Corniche', station_to_market: 'Casa Voyageurs → Habous' },
    is_trending: false, is_new: true
  },
  {
    name: 'Lahore', region: 'Asia', country: 'Pakistan', flag: '🇵🇰', lat: 31.549, lng: 74.343, score: 67, timezone_iana: 'Asia/Karachi',
    transport_modes: ['bus', 'taxi', 'auto', 'metro'], best_for: 'History & Food', peak_hours: '08:00-10:00,17:00-19:00', night_service: true,
    booking_links: [{ name: 'Lahore Metro', url: 'https://lmrc.gov.pk' }, { name: 'Careem', url: 'https://careem.com' }],
    timezone: 'PKT (UTC+5)', language: 'Punjabi, Urdu, English', currency: '₨ PKR', cost_level: 'Budget', safety: 'Moderate', best_months: 'Oct-Mar',
    local_tips: ['Orange Metro is new', 'Auto rickshaws common', 'Careem for ride-share', 'Food scene is amazing'],
    attractions: ['Badshahi Mosque', 'Lahore Fort', 'Food Street', 'Minar-e-Pakistan', 'Shalimar Gardens'],
    connectivity: { airport: 'LHE Allama Iqbal', railway: 'Lahore Junction', metro_lines: 1, bus_network: 'Punjab Road' },
    overview: 'Lahore is Pakistan\'s cultural capital with Mughal architecture and incredible food.',
    transport_tips: ['Orange Metro is new', 'Auto rickshaws common', 'Careem for ride-share'],
    food: ['Biryani', 'Nihari', 'Halwa Puri', 'Tikka'], shopping: ['Anarkali', 'MM Alam Road', 'Packages Mall'], nightlife: ['Mall Road', 'Gulberg', 'Food Street'],
    emergency_contacts: [{ name: 'Police', number: '15' }, { name: 'Ambulance', number: '115' }],
    cost_estimates: { metro_single: '₨30-50', bus_single: '₨20-40', taxi_base: '₨100', taxi_per_km: '₨20', daily_pass: '₨200', weekly_pass: '₨1000' },
    quick_routes: { airport_to_center: 'LHE Airport → Mall Road', center_to_attraction: 'Mall Road → Badshahi Mosque', station_to_market: 'Lahore Junction → Anarkali' },
    is_trending: false, is_new: true
  },
  {
    name: 'Dhaka', region: 'Asia', country: 'Bangladesh', flag: '🇧🇩', lat: 23.810, lng: 90.412, score: 58, timezone_iana: 'Asia/Dhaka',
    transport_modes: ['bus', 'taxi', 'auto', 'CNG'], best_for: 'Culture & Rivers', peak_hours: '08:00-10:00,17:00-20:00', night_service: false,
    booking_links: [{ name: 'BRTC', url: 'https://brtc.gov.bd' }, { name: 'Pathao', url: 'https://pathao.com' }],
    timezone: 'BST (UTC+6)', language: 'Bengali, English', currency: '৳ BDT', cost_level: 'Budget', safety: 'Moderate', best_months: 'Oct-Mar',
    local_tips: ['Traffic is extreme', 'CNG auto rickshaws', 'Pathao for rides', 'Bus is main transport'],
    attractions: ['Lalbagh Fort', 'Ahsanullah Monani', 'Bangladesh National Museum', 'Dhanmondi Lake', 'Gulshan'],
    connectivity: { airport: 'DAC Hazrat Shahjalal', railway: ' Dhaka', metro_lines: 0, bus_network: 'BRTC' },
    overview: 'Dhaka is Bangladesh\'s capital with vibrant street life and river culture.',
    transport_tips: ['Traffic is extreme', 'CNG auto rickshaws', 'Pathao for rides'],
    food: ['Biryani', 'Pitha', 'Hilsha Fish', 'Fuchka'], shopping: ['New Market', 'Gulshan', 'Dhanmondi'], nightlife: ['Gulshan', 'Banani', 'Dhanmondi'],
    emergency_contacts: [{ name: 'Police', number: '999' }, { name: 'Ambulance', number: '199' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '৳20-50', taxi_base: '৳50', taxi_per_km: '৳15', daily_pass: '৳300', weekly_pass: '৳1500' },
    quick_routes: { airport_to_center: 'DAC Airport → Gulshan', center_to_attraction: 'Gulshan → Lalbagh Fort', station_to_market: 'Dhaka Station → New Market' },
    is_trending: false, is_new: true
  },
  {
    name: 'Colombo', region: 'Asia', country: 'Sri Lanka', flag: '🇱🇰', lat: 6.927, lng: 79.861, score: 72, timezone_iana: 'Asia/Colombo',
    transport_modes: ['bus', 'taxi', 'train', 'tuktuk'], best_for: 'Beaches & Heritage', peak_hours: '07:30-09:00,17:00-19:00', night_service: false,
    booking_links: [{ name: 'SLTB', url: 'https://sltdb.gov.lk' }, { name: 'PickMe', url: 'https://pickme.lk' }],
    timezone: 'IST (UTC+5:30)', language: 'Sinhala, Tamil, English', currency: 'Rs LKR', cost_level: 'Budget', safety: 'Good', best_months: 'Dec-Mar',
    local_tips: ['Tuktuks iconic', 'PickMe for ride-share', 'Train to Kandy scenic', 'Bus is main'],
    attractions: ['Gangaramaya', 'Galle Face Green', 'Mount Lavinia', 'National Museum', 'Independence Square'],
    connectivity: { airport: 'CMB Bandaranaike', railway: 'Fort Station', metro_lines: 0, bus_network: 'SLTB' },
    overview: 'Colombo is Sri Lanka\'s commercial capital with colonial heritage and beaches.',
    transport_tips: ['Tuktuks iconic', 'PickMe for ride-share', 'Train to Kandy scenic'],
    food: ['Kottu Roti', 'Hoppers', 'String Hoppers', 'Pol Sambol'], shopping: ['Galle Face', 'Pettah Market', 'ODEL'], nightlife: ['Galle Face', 'Mount Lavinia', 'Colombo 7'],
    emergency_contacts: [{ name: 'Police', number: '119' }, { name: 'Ambulance', number: '110' }],
    cost_estimates: { metro_single: 'N/A', bus_single: 'Rs 30-80', taxi_base: 'Rs 200', taxi_per_km: 'Rs 40', daily_pass: 'Rs 500', weekly_pass: 'Rs 2500' },
    quick_routes: { airport_to_center: 'CMB Airport → Fort', center_to_attraction: 'Fort → Galle Face Green', station_to_market: 'Fort Station → Pettah' },
    is_trending: false, is_new: true
  },
  {
    name: 'Ho Chi Minh City', region: 'Asia', country: 'Vietnam', flag: '🇻🇳', lat: 10.823, lng: 106.629, score: 76, timezone_iana: 'Asia/Ho_Chi_Minh',
    transport_modes: ['bus', 'taxi', 'motorbike', 'Grab'], best_for: 'History & Food', peak_hours: '07:00-09:00,17:00-19:00', night_service: true,
    booking_links: [{ name: 'Mai Linh', url: 'https://mailinh.vn' }, { name: 'Grab', url: 'https://grab.com' }],
    timezone: 'ICT (UTC+7)', language: 'Vietnamese, English', currency: '₫ VND', cost_level: 'Budget', safety: 'Good', best_months: 'Dec-Mar',
    local_tips: ['Motorbikes dominate', 'Grab for safe transport', 'Crosswalk challenging', 'War Remnants Museum'],
    attractions: ['Reunification Palace', 'Ben Thanh Market', 'War Remnants Museum', 'Notre Dame', 'Bui Vien'],
    connectivity: { airport: 'SGN Tan Son Nhat', railway: 'Saigon Station', metro_lines: 0, bus_network: 'Mai Linh' },
    overview: 'Ho Chi Minh City is Vietnam\'s largest city with French colonial and wartime history.',
    transport_tips: ['Motorbikes dominate', 'Grab for safe transport', 'Crosswalk challenging'],
    food: ['Pho', 'Banh Mi', 'Com Tam', 'Fresh Spring Rolls'], shopping: ['Ben Thanh Market', 'Saigon Square', 'Diamond Plaza'], nightlife: ['District 1', 'Pham Ngu Lao', 'Rooftop Bars'],
    emergency_contacts: [{ name: 'Police', number: '113' }, { name: 'Ambulance', number: '115' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '₫7K-20K', taxi_base: '₫15K', taxi_per_km: '₫10K', daily_pass: '₫50K', weekly_pass: '₫250K' },
    quick_routes: { airport_to_center: 'SGN Airport → District 1', center_to_attraction: 'Ben Thanh → Reunification Palace', station_to_market: 'Saigon Station → Ben Thanh' },
    is_trending: true, is_new: true
  },
  {
    name: 'Kathmandu', region: 'Asia', country: 'Nepal', flag: '🇳🇵', lat: 27.717, lng: 85.317, score: 58, timezone_iana: 'Asia/Kathmandu',
    transport_modes: ['bus', 'taxi', 'auto'], best_for: 'Temples & Trekking', peak_hours: '09:00-11:00,17:00-19:00', night_service: false,
    booking_links: [{ name: 'Sajha', url: 'https://sajhabus.com' }, { name: 'Pathao', url: 'https://pathao.com' }],
    timezone: 'NPT (UTC+5:45)', language: 'Nepali, English', currency: 'Rs NPR', cost_level: 'Budget', safety: 'Good', best_months: 'Mar-May, Sep-Nov',
    local_tips: ['Traffic chaotic', 'Auto rickshaws', 'Walking often faster', 'Thamel for tourists'],
    attractions: ['Durbar Square', 'Swayambhunath', 'Boudhanath', 'Thamel', 'Pashupatinath'],
    connectivity: { airport: 'KTM Tribhuvan', railway: 'N/A', metro_lines: 0, bus_network: 'Sajha' },
    overview: 'Kathmandu is Nepal\'s capital with ancient temples and trekking gateway.',
    transport_tips: ['Traffic chaotic', 'Auto rickshaws', 'Walking often faster'],
    food: ['Dal Bhat', 'Momos', 'Sekuwa', 'Chatamari'], shopping: ['Thamel', 'Asan', 'New Road'], nightlife: ['Thamel', 'Lazimpat', 'Jhamsikhel'],
    emergency_contacts: [{ name: 'Police', number: '100' }, { name: 'Ambulance', number: '102' }],
    cost_estimates: { metro_single: 'N/A', bus_single: 'Rs 20-50', taxi_base: 'Rs 100', taxi_per_km: 'Rs 25', daily_pass: 'Rs 300', weekly_pass: 'Rs 1500' },
    quick_routes: { airport_to_center: 'KTM Airport → Thamel', center_to_attraction: 'Thamel → Durbar Square', station_to_market: 'Bus Park → Thamel' },
    is_trending: false, is_new: true
  },
  {
    name: 'Addis Ababa', region: 'Africa', country: 'Ethiopia', flag: '🇪🇹', lat: 9.032, lng: 38.746, score: 55, timezone_iana: 'Africa/Addis_Ababa',
    transport_modes: ['bus', 'taxi', ' Bajaj'], best_for: 'Coffee & History', peak_hours: '08:00-10:00,17:00-19:00', night_service: false,
    booking_links: [{ name: 'Addis Ababa LRT', url: 'https://aacm.gov.et' }, { name: 'Ride', url: 'https://ride.co' }],
    timezone: 'EAT (UTC+3)', language: 'Amharic, English', currency: 'Br ETB', cost_level: 'Budget', safety: 'Moderate', best_months: 'Oct-Jun',
    local_tips: ['Light rail is new', 'Bajaj (three-wheeler)', 'Ride app for taxis', 'City is high altitude'],
    attractions: ['Entoto Mountain', 'National Museum', 'Merkato Market', 'Holy Trinity Cathedral', 'Ethio-German Park'],
    connectivity: { airport: 'ADD Bole', railway: 'Addis Ababa', metro_lines: 1, bus_network: 'Anbessa' },
    overview: 'Addis Ababa is Ethiopia\'s capital and the headquarters of the African Union.',
    transport_tips: ['Light rail is new', 'Bajaj (three-wheeler)', 'Ride app for taxis'],
    food: ['Injera', 'Tibs', 'Shiro', 'Coffee Ceremony'], shopping: ['Merkato', 'Shiro Meda', 'Bole Road'], nightlife: ['Bole', 'Kazanchis', 'Piazza'],
    emergency_contacts: [{ name: 'Police', number: '991' }, { name: 'Ambulance', number: '907' }],
    cost_estimates: { metro_single: 'Br 6-10', bus_single: 'Br 3-8', taxi_base: 'Br 50', taxi_per_km: 'Br 15', daily_pass: 'Br 50', weekly_pass: 'Br 200' },
    quick_routes: { airport_to_center: 'ADD Airport → Piazza', center_to_attraction: 'Piazza → National Museum', station_to_market: 'Light Rail → Merkato' },
    is_trending: false, is_new: true
  },
  {
    name: 'Karachi', region: 'Asia', country: 'Pakistan', flag: '🇵🇰', lat: 24.860, lng: 67.010, score: 60, timezone_iana: 'Asia/Karachi',
    transport_modes: ['bus', 'taxi', 'auto', 'rickshaw'], best_for: 'Business & Beach', peak_hours: '08:00-10:00,17:00-19:00', night_service: true,
    booking_links: [{ name: 'Green Bus', url: 'https://greenbus.pk' }, { name: 'Careem', url: 'https://careem.com' }],
    timezone: 'PKT (UTC+5)', language: 'Urdu, Sindhi, English', currency: '₨ PKR', cost_level: 'Budget', safety: 'Moderate', best_months: 'Nov-Mar',
    local_tips: ['Traffic heavy', 'Careem recommended', 'Auto rickshaws common', 'Food is excellent'],
    attractions: ['Mazar-e-Quaid', 'Clifton Beach', 'Frere Hall', 'Port Grand', 'Karachi Zoo'],
    connectivity: { airport: 'KHI Jinnah', railway: ' Karachi Cantt', metro_lines: 0, bus_network: 'Green Bus' },
    overview: 'Karachi is Pakistan\'s largest city with port history and diverse culture.',
    transport_tips: ['Traffic heavy', 'Careem recommended', 'Auto rickshaws common'],
    food: ['Biryani', 'Nihari', 'Sajji', 'Kheer'], shopping: ['Empress Market', 'Clifton', 'Dolmen Mall'], nightlife: ['Clifton', 'PECHS', 'Shahrah-e-Faisal'],
    emergency_contacts: [{ name: 'Police', number: '15' }, { name: 'Ambulance', number: '115' }],
    cost_estimates: { metro_single: 'N/A', bus_single: 'Rs 20-50', taxi_base: 'Rs 100', taxi_per_km: 'Rs 20', daily_pass: 'Rs 300', weekly_pass: 'Rs 1500' },
    quick_routes: { airport_to_center: 'KHI Airport → Clifton', center_to_attraction: 'Clifton → Mazar-e-Quaid', station_to_market: 'Karachi Cantt → Empress Market' },
    is_trending: false, is_new: true
  },
  {
    name: 'Hanoi', region: 'Asia', country: 'Vietnam', flag: '🇻🇳', lat: 21.028, lng: 105.854, score: 74, timezone_iana: 'Asia/Ho_Chi_Minh',
    transport_modes: ['bus', 'taxi', 'motorbike', 'Grab'], best_for: 'History & Food', peak_hours: '07:30-09:00,17:00-19:00', night_service: true,
    booking_links: [{ name: 'Grab', url: 'https://grab.com' }, { name: 'Mai Linh', url: 'https://mailinh.vn' }],
    timezone: 'ICT (UTC+7)', language: 'Vietnamese, English', currency: '₫ VND', cost_level: 'Budget', safety: 'Good', best_months: 'Oct-Apr',
    local_tips: ['Motorbikes everywhere', 'Crossing streets skill', 'Grab for tourists', 'Old Quarter walkable'],
    attractions: ['Ho Chi Minh Mausoleum', 'Old Quarter', 'One Pillar Pagoda', 'Hoan Kiem Lake', 'Temple of Literature'],
    connectivity: { airport: 'HAN Noi Bai', railway: 'Hanoi Station', metro_lines: 0, bus_network: 'Hanoi Bus' },
    overview: 'Hanoi is Vietnam\'s capital with ancient temples and French colonial architecture.',
    transport_tips: ['Motorbikes everywhere', 'Crossing streets skill', 'Grab for tourists'],
    food: ['Pho', 'Bun Cha', 'Egg Coffee', 'Banh Cuon'], shopping: ['Old Quarter', 'Hang Da', 'Vincom Center'], nightlife: ['Old Quarter', 'Ta Hien', 'West Lake'],
    emergency_contacts: [{ name: 'Police', number: '113' }, { name: 'Ambulance', number: '115' }],
    cost_estimates: { metro_single: 'N/A', bus_single: '₫7K-15K', taxi_base: '₫20K', taxi_per_km: '₫12K', daily_pass: '₫50K', weekly_pass: '₫250K' },
    quick_routes: { airport_to_center: 'HAN Airport → Old Quarter', center_to_attraction: 'Old Quarter → Ho Chi Minh Mausoleum', station_to_market: 'Hanoi Station → Old Quarter' },
    is_trending: false, is_new: true
  },
]

const TRANSPORT_ICONS: Record<string, string> = {
  metro: '🚇', train: '🚆', bus: '🚌', taxi: '🚕', ferry: '⛴️', bike: '🚲', tram: '🚊', auto: '🛺', boat: '🛶', tuktuk: '🛺', maglev: '🚄', metrobus: '🚌',
}

const REGIONS = [
  { id: 'all', label: 'All', flag: '🌐' },
  { id: 'India', label: 'India', flag: '🇮🇳' },
  { id: 'Asia', label: 'Asia', flag: '🌏' },
  { id: 'Europe', label: 'Europe', flag: '🏰' },
  { id: 'Americas', label: 'Americas', flag: '🗽' },
  { id: 'Oceania', label: 'Oceania', flag: '🇦🇺' },
  { id: 'Africa', label: 'Africa', flag: '🌍' },
  { id: 'Middle East', label: 'Middle East', flag: '🕌' },
]

const SORT_OPTIONS = [
  { id: 'score', label: 'Best Score' },
  { id: 'name_asc', label: 'A–Z' },
  { id: 'name_desc', label: 'Z–A' },
  { id: 'modes', label: 'Most Transit Modes' },
]

function getLiveStatus(city: CityDetails): { status: 'running' | 'closed' | 'peak', label: string } {
  const now = new Date()
  const localHour = now.getUTCHours() + (city.lng / 15)
  const hour = (localHour + 24) % 24
  
  const isPeak = city.peak_hours.split(',').some(range => {
    const [start, end] = range.trim().split('-').map(h => parseInt(h))
    return hour >= start && hour < end
  })
  
  const isOperating = hour >= 5 && hour < 24
  
  if (isPeak) return { status: 'peak', label: 'Peak Hours Now' }
  if (!isOperating) return { status: 'closed', label: 'Closed' }
  return { status: 'running', label: 'Running' }
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#51cf66'
  if (score >= 60) return '#ffb74d'
  return '#ff6b6b'
}

export default function Transport() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/transport')
  
  const [viewMode, setViewMode] = useState<'all' | 'favorites' | 'compare'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [sortBy, setSortBy] = useState('score')
  const [showMap, setShowMap] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [compareSlots, setCompareSlots] = useState<(CityDetails | null)[]>([null, null])
  const [mapHoveredCity, setMapHoveredCity] = useState<string | null>(null)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [selectedCity, setSelectedCity] = useState<CityDetails | null>(null)
  const [showCityModal, setShowCityModal] = useState(false)
  const [filterPills, setFilterPills] = useState<Record<string, boolean>>({})
  const [tripCities, setTripCities] = useState<string[]>([])
  const [animatedStats, setAnimatedStats] = useState({ cities: 0, regions: 0, countries: 0, avgScore: 0 })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('transport_favorites')
      if (stored) setFavorites(JSON.parse(stored))
      setTimeout(() => setShowSkeleton(false), 1500)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && favorites.length > 0) {
      window.localStorage.setItem('transport_favorites', JSON.stringify(favorites))
    }
  }, [favorites])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('roamind_trip_cities')
      if (stored) setTripCities(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && tripCities.length > 0) {
      window.localStorage.setItem('roamind_trip_cities', JSON.stringify(tripCities))
    }
  }, [tripCities])

  useEffect(() => {
    const uniqueCountries = new Set(CITIES.map(c => c.country)).size
    const avgScore = Math.round(CITIES.reduce((acc, c) => acc + c.score, 0) / CITIES.length)
    let progress = { cities: 0, regions: 0, countries: 0, avgScore: 0 }
    const interval = setInterval(() => {
      progress = {
        cities: Math.min(progress.cities + 1, CITIES.length),
        regions: Math.min(progress.regions + 0.1, REGIONS.length - 1),
        countries: Math.min(progress.countries + 1, uniqueCountries),
        avgScore: Math.min(progress.avgScore + 1, avgScore)
      }
      setAnimatedStats({ ...progress })
      if (progress.cities >= CITIES.length && progress.regions >= REGIONS.length - 1 && progress.countries >= uniqueCountries && progress.avgScore >= avgScore) {
        clearInterval(interval)
      }
    }, 20)
    return () => clearInterval(interval)
  }, [])

  const nav = (_path: string) => {}
  const handleLogout = async () => { const { signOut } = await import('firebase/auth'); await signOut(auth); router.push('/landing') }

  const toggleFavorite = (cityName: string) => {
    setFavorites(prev => prev.includes(cityName) ? prev.filter(f => f !== cityName) : [...prev, cityName])
  }

  const addToCompare = (city: CityDetails) => {
    if (!compareSlots[0]) {
      setCompareSlots([city, null])
    } else if (!compareSlots[1]) {
      setCompareSlots([compareSlots[0], city])
    } else {
      setCompareSlots([city, compareSlots[1]])
    }
  }

  const clearCompare = () => setCompareSlots([null, null])

  const toggleTripCity = (cityName: string) => {
    setTripCities(prev => prev.includes(cityName) ? prev.filter(c => c !== cityName) : [...prev, cityName])
  }

  const toggleFilterPill = (filter: string) => {
    setFilterPills(prev => ({ ...prev, [filter]: !prev[filter] }))
  }

  const openCityDetails = (city: CityDetails) => {
    setSelectedCity(city)
    setShowCityModal(true)
  }

  const filteredCities = useMemo(() => {
    let result = [...CITIES]
    
    if (viewMode === 'favorites') {
      result = result.filter(c => favorites.includes(c.name))
    }
    
    if (selectedRegion !== 'all') {
      result = result.filter(c => c.region === selectedRegion)
    }
    
    if (searchQuery) {
      result = result.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    
    if (filterPills.hasMetro) {
      result = result.filter(c => c.transport_modes.includes('metro'))
    }
    if (filterPills.hasFerry) {
      result = result.filter(c => c.transport_modes.includes('ferry') || c.transport_modes.includes('boat'))
    }
    if (filterPills.budget) {
      result = result.filter(c => c.cost_level === 'Budget' || c.cost_level === 'Budget-Moderate')
    }
    if (filterPills.verySafe) {
      result = result.filter(c => c.safety === 'Very Safe')
    }
    if (filterPills.nightService) {
      result = result.filter(c => c.night_service === true)
    }
    if (filterPills.trending) {
      result = result.filter(c => c.is_trending === true)
    }
    
    switch (sortBy) {
      case 'score': result.sort((a, b) => b.score - a.score); break
      case 'name_asc': result.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'name_desc': result.sort((a, b) => b.name.localeCompare(a.name)); break
      case 'modes': result.sort((a, b) => b.transport_modes.length - a.transport_modes.length); break
    }
    
    return result
  }, [viewMode, favorites, selectedRegion, searchQuery, sortBy, filterPills])

  const paginatedCities = useMemo(() => {
    const start = (currentPage - 1) * 12
    return filteredCities.slice(start, start + 12)
  }, [filteredCities, currentPage])

  const totalPages = Math.ceil(filteredCities.length / 12)

  const compareDelta = compareSlots[0] && compareSlots[1] 
    ? compareSlots[1].score - compareSlots[0].score 
    : 0

  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, border: '2px solid rgba(0,212,255,0.15)', borderTopColor: C, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
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
        <div style={{ height: 62, padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,212,255,0.07)', background: 'rgba(0,5,14,0.9)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer', fontSize: 15, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
            >☰</button>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>🚏 Transport Explorer</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)' }}>{CITIES.length} cities worldwide</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setShowMap(!showMap)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: showMap ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${showMap ? C : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, color: showMap ? C : 'rgba(255,255,255,0.6)', fontSize: 11, cursor: 'pointer', transition: 'all 0.2s' }}>
              {showMap ? '📊 Grid View' : '🗺️ Map View'}
            </button>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000814', cursor: 'pointer', flexShrink: 0 }}>{avatar}</div>
          </div>
        </div>

        {/* VIEW TABS */}
        <div style={{ padding: '12px 22px', display: 'flex', gap: 8, borderBottom: '1px solid rgba(0,212,255,0.07)', flexShrink: 0 }}>
          {[
            { id: 'all' as const, icon: '🌍', label: 'All Cities' },
            { id: 'favorites' as const, icon: '❤️', label: `Favorites (${favorites.length})` },
            { id: 'compare' as const, icon: '⚖️', label: 'Compare' },
          ].map(tab => (
            <button key={tab.id} onClick={() => { setViewMode(tab.id); setCurrentPage(1) }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: viewMode === tab.id ? 'rgba(0,212,255,0.12)' : 'transparent', border: `1px solid ${viewMode === tab.id ? C : 'rgba(255,255,255,0.08)'}`, borderRadius: 20, color: viewMode === tab.id ? C : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: viewMode === tab.id ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s' }}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* HERO STATS BAR */}
        <div style={{ padding: '8px 22px', display: 'flex', gap: 16, background: 'rgba(0,212,255,0.03)', borderBottom: '1px solid rgba(0,212,255,0.05)', flexShrink: 0, flexWrap: 'wrap' }}>
          {[
            { icon: '🌆', label: 'Cities', value: animatedStats.cities, suffix: '' },
            { icon: '🗺️', label: 'Regions', value: Math.floor(animatedStats.regions), suffix: '' },
            { icon: '🌍', label: 'Countries', value: animatedStats.countries, suffix: '' },
            { icon: '⭐', label: 'Avg Score', value: animatedStats.avgScore, suffix: '/100' },
            { icon: '🚌', label: 'Night Service', value: CITIES.filter(c => c.night_service).length, suffix: ' cities' },
          ].map((stat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
              <span>{stat.icon}</span>
              <span style={{ fontWeight: 700, color: '#fff' }}>{stat.value}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}{stat.suffix}</span>
            </div>
          ))}
          {tripCities.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, marginLeft: 'auto' }}>
              <span>📋</span>
              <span style={{ fontWeight: 700, color: G }}>{tripCities.length}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Trip planned</span>
            </div>
          )}
        </div>

        {/* SEARCH & FILTERS */}
        <div style={{ padding: '12px 22px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid rgba(0,212,255,0.05)', flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.5 }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search cities..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              style={{ width: '100%', padding: '10px 14px 10px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none', fontFamily: "'Outfit',sans-serif" }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {REGIONS.map(region => (
              <button key={region.id} onClick={() => { setSelectedRegion(region.id); setCurrentPage(1) }} style={{ padding: '6px 12px', background: selectedRegion === region.id ? C : 'rgba(255,255,255,0.05)', border: `1px solid ${selectedRegion === region.id ? C : 'rgba(255,255,255,0.1)'}`, borderRadius: 16, color: selectedRegion === region.id ? '#000' : 'rgba(255,255,255,0.6)', fontSize: 11, cursor: 'pointer', transition: 'all 0.2s', fontWeight: selectedRegion === region.id ? 600 : 400 }}>
                {region.flag} {region.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {[
              { id: 'hasMetro', icon: '🚇', label: 'Metro' },
              { id: 'hasFerry', icon: '⛴️', label: 'Ferry' },
              { id: 'budget', icon: '💰', label: 'Budget' },
              { id: 'verySafe', icon: '🛡️', label: 'Safe' },
              { id: 'nightService', icon: '🌙', label: 'Night' },
              { id: 'trending', icon: '📈', label: 'Trending' },
            ].map(pill => (
              <button key={pill.id} onClick={() => { toggleFilterPill(pill.id); setCurrentPage(1) }} style={{ padding: '4px 10px', background: filterPills[pill.id] ? 'rgba(255,183,77,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${filterPills[pill.id] ? G : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, color: filterPills[pill.id] ? G : 'rgba(255,255,255,0.45)', fontSize: 10, cursor: 'pointer', transition: 'all 0.2s' }}>
                {pill.icon} {pill.label}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12, outline: 'none', cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
            {SORT_OPTIONS.map(opt => <option key={opt.id} value={opt.id} style={{ background: '#111827' }}>{opt.label}</option>)}
          </select>
        </div>

        {/* CONTENT AREA */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>
          
          {/* MAP VIEW */}
          {showMap && (
            <div style={{ position: 'relative', width: '100%', height: 500, background: '#0d1421', borderRadius: 16, border: '1px solid rgba(0,212,255,0.1)', overflow: 'hidden', marginBottom: 20 }}>
              <svg viewBox="0 0 1000 500" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a2744" />
                    <stop offset="100%" stopColor="#0d1421" />
                  </linearGradient>
                </defs>
                <rect fill="url(#mapGrad)" width="1000" height="500" />
                
                {CITIES.map(city => {
                  const x = ((city.lng + 180) / 360) * 1000
                  const y = ((90 - city.lat) / 180) * 500
                  const color = getScoreColor(city.score)
                  const isHovered = mapHoveredCity === city.name
                  return (
                    <g key={city.name}>
                      <circle cx={x} cy={y} r={isHovered ? 10 : 6} fill={color} opacity={isHovered ? 1 : 0.7} style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                        onMouseEnter={() => setMapHoveredCity(city.name)}
                        onMouseLeave={() => setMapHoveredCity(null)}
                        onClick={() => openCityDetails(city)}
                      >
                        <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
                      </circle>
                      {isHovered && (
                        <g>
                          <rect x={x - 60} y={y - 45} width={120} height={40} rx={6} fill="#111827" stroke={color} />
                          <text x={x} y={y - 30} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">{city.flag} {city.name}</text>
                          <text x={x} y={y - 15} textAnchor="middle" fill={color} fontSize="10">Score: {city.score}</text>
                        </g>
                      )}
                    </g>
                  )
                })}
              </svg>
              <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 8, fontSize: 9, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 4 }}>
                <span style={{ color: '#51cf66' }}>● High (80+)</span>
                <span style={{ color: '#ffb74d' }}>● Mid (60-79)</span>
                <span style={{ color: '#ff6b6b' }}>● Low (&lt;60)</span>
              </div>
            </div>
          )}

          {/* GRID VIEW / FAVORITES / COMPARE */}
          {viewMode === 'compare' ? (
            <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[0, 1].map(idx => (
                  <div key={idx} style={{ flex: 1, minWidth: 280, background: CARD_BG, border: '1px solid rgba(0,212,255,0.15)', borderRadius: 16, padding: 20 }}>
                    {compareSlots[idx] ? (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <div>
                            <div style={{ fontSize: 28 }}>{compareSlots[idx]!.flag}</div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>{compareSlots[idx]!.name}</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{compareSlots[idx]!.country}</div>
                          </div>
                          <button onClick={() => setCompareSlots(prev => { const n = [...prev]; n[idx] = null; return n })} style={{ background: 'rgba(255,100,100,0.1)', border: 'none', borderRadius: 6, padding: '4px 8px', color: '#ff6b6b', cursor: 'pointer', fontSize: 12 }}>✕</button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                          <span style={{ fontSize: 36, fontWeight: 800, color: getScoreColor(compareSlots[idx]!.score) }}>{compareSlots[idx]!.score}</span>
                          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>/ 100</span>
                          {idx === 1 && compareSlots[0] && (
                            <span style={{ fontSize: 14, fontWeight: 700, color: compareDelta >= 0 ? '#51cf66' : '#ff6b6b' }}>
                              {compareDelta >= 0 ? '+' : ''}{compareDelta} pts
                            </span>
                          )}
                        </div>
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Best For</div>
                          <div style={{ fontSize: 12, color: C }}>{compareSlots[idx]!.best_for}</div>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Peak Hours</div>
                          <div style={{ fontSize: 11, color: G }}>{compareSlots[idx]!.peak_hours}</div>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Transport</div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {compareSlots[idx]!.transport_modes.map(m => (
                              <span key={m} style={{ fontSize: 16, background: 'rgba(0,212,255,0.1)', padding: '4px 6px', borderRadius: 6 }}>{TRANSPORT_ICONS[m] || '🚐'}</span>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => openCityDetails(compareSlots[idx]!)} style={{ marginTop: 8, width: '100%', padding: '10px', background: 'rgba(0,212,255,0.15)', border: `1px solid ${C}`, borderRadius: 8, color: C, cursor: 'pointer', fontSize: 12 }}>
                          📖 View Full Details
                        </button>
                      </div>
                    ) : (
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, color: 'rgba(255,255,255,0.3)' }}>
                        <span style={{ fontSize: 32, marginBottom: 8 }}>⚖️</span>
                        <div style={{ fontSize: 12 }}>Pick a city to compare</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {(compareSlots[0] || compareSlots[1]) && (
                <button onClick={clearCompare} style={{ alignSelf: 'center', padding: '8px 20px', background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: 20, color: '#ff6b6b', cursor: 'pointer', fontSize: 12 }}>Clear Compare</button>
              )}
            </div>
          ) : (
            <>
              {viewMode === 'favorites' && favorites.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>
                  <span style={{ fontSize: 64, marginBottom: 16 }}>💔</span>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No favorites yet</div>
                  <div style={{ fontSize: 13 }}>Tap 🤍 on any city card to save it here!</div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, marginBottom: 20 }}>
                    {showSkeleton ? (
                      Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} style={{ background: CARD_BG, borderRadius: 16, padding: 16, animation: `shimmer 1.5s infinite`, animationDelay: `${i * 0.1}s` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.1)' }} />
                            <div>
                              <div style={{ width: 80, height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.1)', marginBottom: 6 }} />
                              <div style={{ width: 50, height: 10, borderRadius: 4, background: 'rgba(255,255,255,0.05)' }} />
                            </div>
                          </div>
                          <div style={{ width: 60, height: 10, borderRadius: 4, background: 'rgba(255,255,255,0.05)', marginBottom: 8 }} />
                          <div style={{ display: 'flex', gap: 6 }}>
                            <div style={{ width: 30, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.05)' }} />
                            <div style={{ width: 30, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.05)' }} />
                            <div style={{ width: 30, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.05)' }} />
                          </div>
                        </div>
                      ))
                    ) : (
                      paginatedCities.map((city, idx) => {
                        const liveStatus = getLiveStatus(city)
                        const isFav = favorites.includes(city.name)
                        const isInCompare = compareSlots.some(s => s?.name === city.name)
                        return (
                          <div key={city.name} onClick={() => openCityDetails(city)} style={{ background: CARD_BG, border: `1px solid ${isInCompare ? '#ffd700' : 'rgba(0,212,255,0.08)'}`, borderRadius: 16, padding: 16, transition: 'all 0.25s', animation: `fadeIn 0.3s ease ${idx * 0.04}s both`, cursor: 'pointer', boxShadow: isInCompare ? '0 0 20px rgba(255,215,0,0.2)' : 'none' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = C; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,212,255,0.15)' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = isInCompare ? '#ffd700' : 'rgba(0,212,255,0.08)'; e.currentTarget.style.boxShadow = isInCompare ? '0 0 20px rgba(255,215,0,0.2)' : 'none' }}
                          >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 32 }}>{city.flag}</span>
                                <div>
                                  <div style={{ fontSize: 15, fontWeight: 700 }}>{city.name}</div>
                                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{city.country}</div>
                                  {(city.is_trending || city.is_new) && (
                                    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                                      {city.is_trending && <span style={{ fontSize: 9, background: 'rgba(255,183,77,0.2)', color: G, padding: '2px 6px', borderRadius: 8, fontWeight: 600 }}>📈 Trending</span>}
                                      {city.is_new && <span style={{ fontSize: 9, background: 'rgba(0,212,255,0.2)', color: C, padding: '2px 6px', borderRadius: 8, fontWeight: 600 }}>✨ New</span>}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button onClick={(e) => { e.stopPropagation(); toggleTripCity(city.name) }} style={{ background: tripCities.includes(city.name) ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} aria-label={tripCities.includes(city.name) ? 'Remove from trip' : 'Add to trip'}>
                                  {tripCities.includes(city.name) ? '📋' : '➕'}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); toggleFavorite(city.name) }} style={{ background: isFav ? 'rgba(255,100,100,0.15)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}>
                                  {isFav ? '❤️' : '🤍'}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); addToCompare(city) }} style={{ background: isInCompare ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', opacity: isInCompare ? 1 : 0.6 }} aria-label="Add to compare">
                                  ⚖️
                                </button>
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 18, fontWeight: 800, color: getScoreColor(city.score) }}>{city.score}</span>
                                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>/100</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {city.night_service && <span style={{ fontSize: 10, color: G, background: 'rgba(255,183,77,0.1)', padding: '2px 6px', borderRadius: 4 }}>🌙 Night</span>}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: liveStatus.status === 'running' ? '#51cf66' : liveStatus.status === 'peak' ? '#ffb74d' : '#ff6b6b' }} />
                                  <span style={{ fontSize: 10, color: liveStatus.status === 'peak' ? '#ffb74d' : 'rgba(255,255,255,0.5)' }}>{liveStatus.label}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div style={{ fontSize: 10, color: C, marginBottom: 8, background: 'rgba(0,212,255,0.08)', padding: '4px 8px', borderRadius: 6, display: 'inline-block' }}>🏷️ {city.best_for}</div>
                            
                            <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                              {city.transport_modes.slice(0, 5).map(m => (
                                <span key={m} style={{ fontSize: 14, background: 'rgba(255,255,255,0.05)', padding: '3px 6px', borderRadius: 6 }} title={m}>{TRANSPORT_ICONS[m] || '🚐'}</span>
                              ))}
                              {city.transport_modes.length > 5 && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', alignSelf: 'center' }}>+{city.transport_modes.length - 5}</span>}
                            </div>
                            
                            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>⏰ {city.peak_hours}</div>
                            <div style={{ fontSize: 10, color: C, marginTop: 8 }}>👆 Tap for full details</div>
                          </div>
                        )
                      })
                    )}
                  </div>
                  
                  {totalPages > 1 && !showSkeleton && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                      <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: currentPage === 1 ? 'rgba(255,255,255,0.2)' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: 12 }}>← Prev</button>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Page {currentPage} of {totalPages}</span>
                      <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: currentPage === totalPages ? 'rgba(255,255,255,0.2)' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: 12 }}>Next →</button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* CITY DETAILS MODAL */}
      {showCityModal && selectedCity && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }} onClick={() => setShowCityModal(false)}>
          <div style={{ background: CARD_BG, borderRadius: 24, maxWidth: 700, width: '100%', maxHeight: '90vh', overflow: 'auto', border: '1px solid rgba(0,212,255,0.3)', boxShadow: '0 0 60px rgba(0,212,255,0.2)' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: 24, background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(255,183,77,0.15))', borderBottom: '1px solid rgba(0,212,255,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                  <span style={{ fontSize: 48 }}>{selectedCity.flag}</span>
                  <div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0, fontFamily: "'Playfair Display',serif" }}>{selectedCity.name}</h2>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{selectedCity.country} • {selectedCity.region}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowCityModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, width: 40, height: 40, cursor: 'pointer', color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Score & Live Status */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 800, color: getScoreColor(selectedCity.score) }}>{selectedCity.score}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Transport Score</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: getLiveStatus(selectedCity).status === 'running' ? '#51cf66' : getLiveStatus(selectedCity).status === 'peak' ? '#ffb74d' : '#ff6b6b' }} />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{getLiveStatus(selectedCity).label}</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Current Status</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: G }}>🏷️ {selectedCity.best_for}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Best For</div>
                </div>
              </div>

              {/* Overview */}
              <div style={{ background: 'rgba(0,212,255,0.08)', borderRadius: 14, padding: 16, marginBottom: 24, border: '1px solid rgba(0,212,255,0.1)' }}>
                <h3 style={{ fontSize: 12, color: C, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>📝 City Overview</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>{selectedCity.overview}</p>
              </div>

              {/* City Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>⏰ Timezone</div>
                  <div style={{ fontSize: 12 }}>{selectedCity.timezone}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>🗣️ Language</div>
                  <div style={{ fontSize: 12 }}>{selectedCity.language}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>💰 Currency</div>
                  <div style={{ fontSize: 12 }}>{selectedCity.currency}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>💵 Cost Level</div>
                  <div style={{ fontSize: 12, color: selectedCity.cost_level === 'Budget' ? '#51cf66' : selectedCity.cost_level === 'Very High' ? '#ff6b6b' : G }}>{selectedCity.cost_level}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>🛡️ Safety</div>
                  <div style={{ fontSize: 12, color: selectedCity.safety === 'Very Safe' ? '#51cf66' : selectedCity.safety === 'Good' ? '#ffb74d' : '#ff6b6b' }}>{selectedCity.safety}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>📅 Best Months</div>
                  <div style={{ fontSize: 12 }}>{selectedCity.best_months}</div>
                </div>
              </div>

              {/* Transport Modes */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>🚏 Transport Modes</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedCity.transport_modes.map(m => (
                    <span key={m} style={{ fontSize: 14, background: 'rgba(0,212,255,0.15)', color: C, padding: '8px 14px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {TRANSPORT_ICONS[m] || '🚐'} {m.charAt(0).toUpperCase() + m.slice(1)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Peak Hours */}
              <div style={{ background: 'rgba(255,183,77,0.1)', border: '1px solid rgba(255,183,77,0.2)', borderRadius: 12, padding: 14, marginBottom: 24 }}>
                <div style={{ fontSize: 10, color: G, marginBottom: 4 }}>⏰ Peak Hours</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedCity.peak_hours}</div>
              </div>

              {/* Connectivity */}
              {selectedCity.connectivity && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>🔗 Connectivity</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>✈️ Airport</div>
                      <div style={{ fontSize: 12 }}>{selectedCity.connectivity.airport}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>🚆 Railway</div>
                      <div style={{ fontSize: 12 }}>{selectedCity.connectivity.railway}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>🚇 Metro Lines</div>
                      <div style={{ fontSize: 12 }}>{selectedCity.connectivity.metro_lines}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>🚌 Bus Network</div>
                      <div style={{ fontSize: 12 }}>{selectedCity.connectivity.bus_network}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Local Tips */}
              {selectedCity.local_tips && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>💡 Local Tips</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedCity.local_tips.map((tip, i) => (
                      <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, borderLeft: `3px solid ${C}` }}>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attractions */}
              {selectedCity.attractions && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>🏛️ Top Attractions</h3>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selectedCity.attractions.map((attr, i) => (
                      <span key={i} style={{ fontSize: 11, background: 'rgba(0,212,255,0.1)', color: C, padding: '6px 12px', borderRadius: 12 }}>{attr}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Food */}
              {selectedCity.food && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>🍜 Must Try Food</h3>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selectedCity.food.map((f, i) => (
                      <span key={i} style={{ fontSize: 11, background: 'rgba(255,183,77,0.1)', color: G, padding: '6px 12px', borderRadius: 12 }}>{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Emergency Contacts */}
              {selectedCity.emergency_contacts && (
                <div style={{ background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.2)', borderRadius: 12, padding: 14, marginBottom: 24 }}>
                  <h3 style={{ fontSize: 12, color: '#ff6b6b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>🆘 Emergency Contacts</h3>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {selectedCity.emergency_contacts.map((contact, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{contact.name}:</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#ff6b6b' }}>{contact.number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Route Links */}
              {selectedCity.quick_routes && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>🗺️ Quick Routes (Google Maps)</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {Object.entries(selectedCity.quick_routes).map(([key, route]) => {
                      const labels: Record<string, string> = { airport_to_center: 'Airport → Center', center_to_attraction: 'Center → Attraction', station_to_market: 'Station → Market' }
                      const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(route as string)}`
                      return (
                        <a key={key} href={googleUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, background: 'rgba(0,212,255,0.1)', color: C, padding: '10px 14px', borderRadius: 8, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(0,212,255,0.2)' }}>
                          <span>📍</span>
                          <span>{labels[key] || key}: {route as string}</span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Cost Estimates */}
              {selectedCity.cost_estimates && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>💵 Estimated Costs</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 10 }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>🚇 Metro (Single)</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedCity.cost_estimates.metro_single}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 10 }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>🚌 Bus (Single)</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedCity.cost_estimates.bus_single}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 10 }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>🚕 Taxi (Base)</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedCity.cost_estimates.taxi_base}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 10 }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>🚕 Taxi (Per KM)</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedCity.cost_estimates.taxi_per_km}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 10 }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>🎫 Daily Pass</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedCity.cost_estimates.daily_pass}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 10 }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>🎫 Weekly Pass</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedCity.cost_estimates.weekly_pass}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Links */}
              <div>
                <h3 style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>🎫 Book Transport</h3>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {selectedCity.booking_links.map(link => (
                    <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, background: 'rgba(0,212,255,0.2)', color: C, padding: '12px 18px', borderRadius: 10, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.4)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,212,255,0.2)'}
                    >🔗 {link.name}</a>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button onClick={() => { toggleFavorite(selectedCity.name); setShowCityModal(false) }} style={{ flex: 1, padding: '12px', background: favorites.includes(selectedCity.name) ? 'rgba(255,100,100,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${favorites.includes(selectedCity.name) ? '#ff6b6b' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, color: favorites.includes(selectedCity.name) ? '#ff6b6b' : '#fff', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {favorites.includes(selectedCity.name) ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                </button>
                <button onClick={() => { addToCompare(selectedCity); setShowCityModal(false) }} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  ⚖️ Add to Compare
                </button>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button onClick={() => {
                  const guide = `🚏 ${selectedCity.name} Transport Guide\n\n📍 ${selectedCity.country} | Score: ${selectedCity.score}/100\n🏷️ Best For: ${selectedCity.best_for}\n\n🚇 Transport Modes:\n${selectedCity.transport_modes.map(m => `- ${m}`).join('\n')}\n\n⏰ Peak Hours: ${selectedCity.peak_hours}\n💵 Cost Level: ${selectedCity.cost_level}\n\n🗺️ Quick Routes:\n${selectedCity.quick_routes ? Object.entries(selectedCity.quick_routes).map(([k, v]) => `- ${k}: ${v}`).join('\n') : 'N/A'}\n\n🎫 Booking Links:\n${selectedCity.booking_links.map(l => `- ${l.name}: ${l.url}`).join('\n')}`
                  navigator.clipboard.writeText(guide)
                  alert('City guide copied to clipboard!')
                }} style={{ flex: 1, padding: '12px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 10, color: C, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  📋 Export City Guide
                </button>
                <button onClick={() => { toggleTripCity(selectedCity.name); setShowCityModal(false) }} style={{ flex: 1, padding: '12px', background: tripCities.includes(selectedCity.name) ? 'rgba(255,183,77,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${tripCities.includes(selectedCity.name) ? G : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, color: tripCities.includes(selectedCity.name) ? G : '#fff', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {tripCities.includes(selectedCity.name) ? '📋 Remove from Trip' : '➕ Add to Trip'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{opacity:0.5}50%{opacity:0.8}100%{opacity:0.5}}
      `}</style>
    </div>
  )
}
