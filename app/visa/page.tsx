'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Sidebar from '@/components/Sidebar'

const C = '#63d2ff'
const G = '#ffb74d'
const R = '#ff6b6b'
const GR = '#51cf66'
const BG = '#000814'

const navSections = [
  { title: 'Plan & Discover', items: [{ icon: '🏠', label: 'Dashboard', path: '/dashboard' }, { icon: '🤖', label: 'AI Itinerary', path: '/itinerary' }] },
  { title: 'Book & Travel', items: [{ icon: '✈️', label: 'Flights', path: '/flights' }, { icon: '🏨', label: 'Hotels', path: '/hotels' }, { icon: '🍽️', label: 'Restaurants', path: '/restaurants' }, { icon: '🚌', label: 'Transport', path: '/transport' }] },
  { title: 'Intelligence', items: [{ icon: '🛂', label: 'Visa Guide', path: '/visa' }, { icon: '💱', label: 'Currency', path: '/currency' }, { icon: '🌤️', label: 'Weather+AQI', path: '/weather' }, { icon: '🆘', label: 'Emergency', path: '/emergency' }] },
  { title: 'Discover People', items: [{ icon: '👨‍💼', label: 'Local Guides', path: '/guides' }, { icon: '🤝', label: 'Couch Surfing', path: '/couchsurfing' }] },
  { title: 'My Travel', items: [{ icon: '🏅', label: 'Travel Passport', path: '/passport' }, { icon: '❤️', label: 'Saved Trips', path: '/saved' }, { icon: '📦', label: 'Packing List', path: '/packing' }, { icon: '💰', label: 'Budget Tracker', path: '/budget' }, { icon: '💬', label: 'AI Chat', path: '/chat' }, { icon: '🧠', label: 'Travel IQ', path: '/traveliq' }, { icon: '⚙️', label: 'Settings', path: '/settings' }] },
]

type VisaType = 'free' | 'on_arrival' | 'e_visa' | 'eta' | 'visa_required' | 'refugee' | 'permits_only'
type Region = 'asia' | 'europe' | 'north_america' | 'south_america' | 'africa' | 'oceania' | 'middle_east' | 'caribbean'

interface VisaInfo {
  visaType: VisaType
  visaName: string
  processingTime: string
  processingDays: number
  maxStay: string
  entryType: string
  fees: string
  feesInr: number
  validity: string
  documents: string[]
  requirements: string[]
  onlineApplyUrl?: string
  embassy?: {
    address: string
    city: string
    phone: string
    email?: string
    website?: string
    hours?: string
  }
  tips: string[]
  color: string
  icon: string
}

interface CountryData {
  name: string
  code: string
  flag: string
  region: Region
  continent: string
  visaRules: {
    [fromCode: string]: VisaInfo
  }
}

interface TripStop {
  countryCode: string
  arrivalDate: string
  departureDate: string
}

interface TravelerProfile {
  passportType: 'regular' | 'official' | 'diplomatic'
  visitedCountries: string[]
  hasUSVisa: boolean
  hasUKVisa: boolean
  hasSchengenVisa: boolean
  frequentFlyer: 'none' | 'silver' | 'gold' | 'platinum'
  nationality: string
}

interface ChatMessage {
  role: 'user' | 'bot'
  text: string
  time: Date
}

const COUNTRIES: CountryData[] = [
  { name: 'Afghanistan', code: 'AF', flag: '🇦🇫', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Albania', code: 'AL', flag: '🇦🇱', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Algeria', code: 'DZ', flag: '🇩🇿', region: 'africa', continent: 'Africa', visaRules: {} },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷', region: 'south_america', continent: 'South America', visaRules: {} },
  { name: 'Australia', code: 'AU', flag: '🇦🇺', region: 'oceania', continent: 'Oceania', visaRules: {} },
  { name: 'Austria', code: 'AT', flag: '🇦🇹', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Azerbaijan', code: 'AZ', flag: '🇦🇿', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Bahrain', code: 'BH', flag: '🇧🇭', region: 'middle_east', continent: 'Middle East', visaRules: {} },
  { name: 'Bangladesh', code: 'BD', flag: '🇧🇩', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Belgium', code: 'BE', flag: '🇧🇪', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷', region: 'south_america', continent: 'South America', visaRules: {} },
  { name: 'Cambodia', code: 'KH', flag: '🇰🇭', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', region: 'north_america', continent: 'North America', visaRules: {} },
  { name: 'Chile', code: 'CL', flag: '🇨🇱', region: 'south_america', continent: 'South America', visaRules: {} },
  { name: 'China', code: 'CN', flag: '🇨🇳', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Colombia', code: 'CO', flag: '🇨🇴', region: 'south_america', continent: 'South America', visaRules: {} },
  { name: 'Croatia', code: 'HR', flag: '🇭🇷', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Cuba', code: 'CU', flag: '🇨🇺', region: 'caribbean', continent: 'Caribbean', visaRules: {} },
  { name: 'Cyprus', code: 'CY', flag: '🇨🇾', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Czech Republic', code: 'CZ', flag: '🇨🇿', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Denmark', code: 'DK', flag: '🇩🇰', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Egypt', code: 'EG', flag: '🇪🇬', region: 'africa', continent: 'Africa', visaRules: {} },
  { name: 'Estonia', code: 'EE', flag: '🇪🇪', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Ethiopia', code: 'ET', flag: '🇪🇹', region: 'africa', continent: 'Africa', visaRules: {} },
  { name: 'Finland', code: 'FI', flag: '🇫🇮', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'France', code: 'FR', flag: '🇫🇷', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Georgia', code: 'GE', flag: '🇬🇪', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Ghana', code: 'GH', flag: '🇬🇭', region: 'africa', continent: 'Africa', visaRules: {} },
  { name: 'Greece', code: 'GR', flag: '🇬🇷', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Hungary', code: 'HU', flag: '🇭🇺', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Iceland', code: 'IS', flag: '🇮🇸', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'India', code: 'IN', flag: '🇮🇳', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Indonesia', code: 'ID', flag: '🇮🇩', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Iran', code: 'IR', flag: '🇮🇷', region: 'middle_east', continent: 'Middle East', visaRules: {} },
  { name: 'Iraq', code: 'IQ', flag: '🇮🇶', region: 'middle_east', continent: 'Middle East', visaRules: {} },
  { name: 'Ireland', code: 'IE', flag: '🇮🇪', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Israel', code: 'IL', flag: '🇮🇱', region: 'middle_east', continent: 'Middle East', visaRules: {} },
  { name: 'Italy', code: 'IT', flag: '🇮🇹', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Japan', code: 'JP', flag: '🇯🇵', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Jordan', code: 'JO', flag: '🇯🇴', region: 'middle_east', continent: 'Middle East', visaRules: {} },
  { name: 'Kazakhstan', code: 'KZ', flag: '🇰🇿', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Kenya', code: 'KE', flag: '🇰🇪', region: 'africa', continent: 'Africa', visaRules: {} },
  { name: 'Kuwait', code: 'KW', flag: '🇰🇼', region: 'middle_east', continent: 'Middle East', visaRules: {} },
  { name: 'Laos', code: 'LA', flag: '🇱🇦', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Latvia', code: 'LV', flag: '🇱🇻', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Lebanon', code: 'LB', flag: '🇱🇧', region: 'middle_east', continent: 'Middle East', visaRules: {} },
  { name: 'Lithuania', code: 'LT', flag: '🇱🇹', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Luxembourg', code: 'LU', flag: '🇱🇺', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Malaysia', code: 'MY', flag: '🇲🇾', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Maldives', code: 'MV', flag: '🇲🇻', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Mexico', code: 'MX', flag: '🇲🇽', region: 'north_america', continent: 'North America', visaRules: {} },
  { name: 'Morocco', code: 'MA', flag: '🇲🇦', region: 'africa', continent: 'Africa', visaRules: {} },
  { name: 'Myanmar', code: 'MM', flag: '🇲🇲', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Nepal', code: 'NP', flag: '🇳🇵', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'New Zealand', code: 'NZ', flag: '🇳🇿', region: 'oceania', continent: 'Oceania', visaRules: {} },
  { name: 'Nigeria', code: 'NG', flag: '🇳🇬', region: 'africa', continent: 'Africa', visaRules: {} },
  { name: 'Norway', code: 'NO', flag: '🇳🇴', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Oman', code: 'OM', flag: '🇴🇲', region: 'middle_east', continent: 'Middle East', visaRules: {} },
  { name: 'Pakistan', code: 'PK', flag: '🇵🇰', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Peru', code: 'PE', flag: '🇵🇪', region: 'south_america', continent: 'South America', visaRules: {} },
  { name: 'Philippines', code: 'PH', flag: '🇵🇭', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Poland', code: 'PL', flag: '🇵🇱', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Portugal', code: 'PT', flag: '🇵🇹', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Qatar', code: 'QA', flag: '🇶🇦', region: 'middle_east', continent: 'Middle East', visaRules: {} },
  { name: 'Romania', code: 'RO', flag: '🇷🇴', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Russia', code: 'RU', flag: '🇷🇺', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', region: 'middle_east', continent: 'Middle East', visaRules: {} },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦', region: 'africa', continent: 'Africa', visaRules: {} },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Spain', code: 'ES', flag: '🇪🇸', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Sri Lanka', code: 'LK', flag: '🇱🇰', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Sweden', code: 'SE', flag: '🇸🇪', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Taiwan', code: 'TW', flag: '🇹🇼', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Thailand', code: 'TH', flag: '🇹🇭', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Turkey', code: 'TR', flag: '🇹🇷', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'Ukraine', code: 'UA', flag: '🇺🇦', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'UAE', code: 'AE', flag: '🇦🇪', region: 'middle_east', continent: 'Middle East', visaRules: {} },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', region: 'europe', continent: 'Europe', visaRules: {} },
  { name: 'USA', code: 'US', flag: '🇺🇸', region: 'north_america', continent: 'North America', visaRules: {} },
  { name: 'Uzbekistan', code: 'UZ', flag: '🇺🇿', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Vietnam', code: 'VN', flag: '🇻🇳', region: 'asia', continent: 'Asia', visaRules: {} },
  { name: 'Yemen', code: 'YE', flag: '🇾🇪', region: 'middle_east', continent: 'Middle East', visaRules: {} },
]

const SCHENGEN_COUNTRIES = ['Austria', 'Belgium', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Spain', 'Sweden', 'Switzerland']

const QUICK_QUESTIONS = [
  'Can I extend my visa?',
  'What documents do I need?',
  'Is travel insurance mandatory?',
  'How long does processing take?',
  'Can I work with this visa?',
]

function getDefaultVisaInfo(country: CountryData, fromCountry: CountryData, profile?: TravelerProfile): VisaInfo {
  const indiaRules: { [key: string]: VisaInfo } = {
    'Thailand': { visaType: 'e_visa', visaName: 'Thailand e-Visa (TR Visa)', processingTime: '3-5 business days', processingDays: 5, maxStay: '60 days', entryType: 'Single/Multiple', fees: '₹2,700 (~USD 32)', feesInr: 2700, validity: '90 days from issue', documents: ['Valid passport (6+ months)', 'Passport-size photo', 'Proof of accommodation', 'Round-trip flight itinerary', 'Proof of funds (₹20,000+)', 'Previous passport (if any)'], requirements: ['Online application at evisathailand.com', 'Upload documents digitally', 'Pay fee online', 'Receive e-Visa via email'], onlineApplyUrl: 'https://www.thaievisa.go.th/', tips: ['Apply at least 7 days before travel', 'Double-entry available', 'Can extend 30 days on arrival'], color: '#ffc107', icon: '🟡' },
    'Malaysia': { visaType: 'e_visa', visaName: 'Malaysia e-Visa', processingTime: '1-2 business days', processingDays: 2, maxStay: '30 days', entryType: 'Single', fees: '₹1,800 (~USD 22)', feesInr: 1800, validity: '90 days from issue', documents: ['Valid passport (6+ months)', 'Passport photo (white background)', 'Flight booking confirmation', 'Hotel booking', 'Bank statement (last 3 months)'], requirements: ['Apply at malaysia-visa.gov.my', 'Upload all documents', 'Pay processing fee'], onlineApplyUrl: 'https://www.malaysia-visa.gov.my/', tips: ['Also available on arrival for Indians', 'MyEntry pass required', 'Can extend 30 days'], color: '#9c27b0', icon: '🟣' },
    'Indonesia': { visaType: 'on_arrival', visaName: 'Visa on Arrival (B213)', processingTime: 'On arrival', processingDays: 0, maxStay: '30 days', entryType: 'Single (extendable)', fees: '₹1,800 (~USD 22)', feesInr: 1800, validity: '30 days (extendable to 60 days)', documents: ['Valid passport (6+ months)', 'Return ticket', 'Hotel confirmation', 'USD 35 cash (or equivalent)'], requirements: ['Available at designated airports/ports', 'Pay visa fee at immigration', 'Fill arrival card'], tips: ['Extend at immigration office', 'B211A for longer stays', 'Check designated VOA ports'], color: '#ff5722', icon: '🟠' },
    'Vietnam': { visaType: 'e_visa', visaName: 'Vietnam e-Visa (Evisa)', processingTime: '3-5 business days', processingDays: 5, maxStay: '90 days', entryType: 'Single/Multiple', fees: '₹2,400 (~USD 25)', feesInr: 2400, validity: '90 days', documents: ['Valid passport (6+ months)', 'Digital passport photo', 'Credit/Debit card', 'Travel itinerary'], requirements: ['Apply at evisa.gov.vn', 'Upload photo and passport bio page', 'Pay fee online'], onlineApplyUrl: 'https://evisa.gov.vn/', tips: ['New 90-day e-Visa available', 'Multiple entry option', 'Check entry points'], color: '#f9a825', icon: '🟡' },
    'Singapore': { visaType: 'e_visa', visaName: 'Singapore e-Visa', processingTime: '1-3 business days', processingDays: 3, maxStay: '30 days', entryType: 'Single', fees: '₹1,200 (~USD 15)', feesInr: 1200, validity: '62 days from approval', documents: ['Valid passport (6+ months)', 'Digital photo', 'Flight itinerary', 'Accommodation proof', 'Sufficient funds'], requirements: ['Apply through authorized agents', 'Or use Singapore Embassy online portal'], tips: ['V39A form required', 'Check approved agents list', '96-hour VFTF available'], color: '#f44336', icon: '🔴' },
    'UAE': { visaType: 'on_arrival', visaName: 'Visa on Arrival', processingTime: 'On arrival', processingDays: 0, maxStay: '14 days', entryType: 'Single (extendable)', fees: 'Free', feesInr: 0, validity: '14 days (extendable 14 more)', documents: ['Valid passport (6+ months)', 'Return ticket', 'Hotel booking', 'USD 300-500 cash'], requirements: ['Indian passport holders eligible', 'Valid US/UK/Schengen visa holder also eligible'], tips: ['Extend at Amer centers', 'Multiple options available', 'Dubai transit visa options'], color: '#4caf50', icon: '🟢' },
    'Japan': { visaType: 'e_visa', visaName: 'Japan e-Visa (EREDS)', processingTime: '5-10 business days', processingDays: 10, maxStay: '15-90 days', entryType: 'Single (tourist)', fees: '₹700 (~USD 8)', feesInr: 700, validity: '90 days from issue', documents: ['Valid passport', 'Photo (4.5x4.5cm)', 'Itinerary', 'Proof of funds', 'Bank statements (1 year)', 'Employment letter'], requirements: ['Use designated travel agencies', 'Apply through e-Visa portal', 'Sponsor may be required'], onlineApplyUrl: 'https://www.mofa.go.jp/', tips: ['Must use authorized agents', 'Online application via agencies', 'Tighter requirements for first-timers'], color: '#e53935', icon: '🔴' },
    'UK': { visaType: 'e_visa', visaName: 'UK Standard Visitor Visa', processingTime: '3 weeks (priority: 5 days)', processingDays: 21, maxStay: '6 months', entryType: 'Single/Multiple', fees: '₹11,000 (~USD 130)', feesInr: 11000, validity: '2 years (multiple)', documents: ['Valid passport', 'Photo (45x35mm)', 'Bank statements (6 months)', 'Employment letter', 'Flight itinerary', 'Accommodation proof', 'Travel history'], requirements: ['Online application at gov.uk/visitor-visa', 'Biometrics at VFS center', 'Personal savings proof'], onlineApplyUrl: 'https://www.gov.uk/visitor-visa', tips: ['2-year visa available', 'Can visit UK + Ireland', 'Priority service available'], color: '#e91e63', icon: '🩷' },
    'USA': { visaType: 'visa_required', visaName: 'B1/B2 Tourist Visa', processingTime: '2-6 weeks (varies)', processingDays: 42, maxStay: '6 months', entryType: 'Multiple', fees: '₹13,000 (~USD 185)', feesInr: 13000, validity: '10 years', documents: ['Valid passport', 'DS-160 confirmation', 'Photo (5x5cm)', 'Receipts', 'Interview appointment', 'Supporting documents'], requirements: ['Complete DS-160 online', 'Pay visa fee', 'Schedule interview at US Embassy', 'Biometrics', 'Personal interview'], onlineApplyUrl: 'https://ceac.state.gov/', tips: ['Book interview early', 'Strong ties to home country needed', 'Fill detailed DS-160'], color: '#3f51b5', icon: '🔵' },
    'Australia': { visaType: 'eta', visaName: 'ETA (Subclass 601)', processingTime: 'Minutes to 24 hours', processingDays: 1, maxStay: '3 months per visit', entryType: 'Multiple', fees: 'AUD 20 (~₹1,100)', feesInr: 1100, validity: '12 months or passport expiry', documents: ['Valid passport', 'Credit card for fee'], requirements: ['Use ETA app or website', 'Good character requirements', 'No work allowed (except limited)'], onlineApplyUrl: 'https://www.homeaffairs.gov.au/', tips: ['Must have no visa cancellations', 'Check eligibility carefully', 'ImmiAccount also available'], color: '#2196f3', icon: '🔵' },
    'Canada': { visaType: 'e_visa', visaName: 'Canada eTA', processingTime: 'Minutes to 72 hours', processingDays: 3, maxStay: '6 months', entryType: 'Multiple', fees: 'CAD 7 (~₹450)', feesInr: 450, validity: '5 years or passport expiry', documents: ['Valid passport', 'Credit card', 'Email address'], requirements: ['Apply online at canada.ca/eta', 'Answer eligibility questions', 'Pay processing fee'], onlineApplyUrl: 'https://www.canada.ca/eta', tips: ['Only for air travel', 'Fastest option', 'Linked to passport electronically'], color: '#f44336', icon: '🔴' },
    'France': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple (short stay)', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months beyond trip)', 'Photo (35x45mm)', 'Application form', 'Travel insurance (€30,000+)', 'Flight itinerary', 'Hotel booking', 'Bank statements (3 months)', 'Employment letter'], requirements: ['Apply at France visa center', 'Biometrics required', 'Travel insurance mandatory', 'Proof of accommodation'], onlineApplyUrl: 'https://france-visas.gouv.fr/', embassy: { address: '2/13, Shantipath, Chanakyapuri', city: 'New Delhi - 110021', phone: '+91-11-6660 3400', website: 'https://www.ambafrance-in.org', hours: 'Mon-Fri: 9AM-12PM (Visa)' }, tips: ['Apply 6 weeks before', 'Book slot in advance', 'Insurance must cover whole trip'], color: '#3f51b5', icon: '🔵' },
    'Germany': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple (short stay)', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo (35x45mm)', 'Application form (VIDEX)', 'Travel insurance (€30,000+)', 'Flight tickets', 'Hotel confirmation', 'Bank statements (3 months)', 'Income tax returns'], requirements: ['Apply at German Embassy/VFS', 'Personal appearance may be needed', 'Sufficient funds proof'], onlineApplyUrl: 'https://videx.diplo.de/', embassy: { address: 'Shantipath, Chanakyapuri', city: 'New Delhi - 110021', phone: '+91-11-4411 9900', website: 'https://www.india.diplo.de', hours: 'Mon-Fri: 8:30AM-11:30AM' }, tips: ['Apply early (6+ weeks)', 'Check Germany-specific requirements', 'Blocked account accepted'], color: '#795548', icon: '🟤' },
    'Italy': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple (short stay)', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo (35x45mm, white background)', 'Application form', 'Travel insurance (€30,000+)', 'Round-trip flights', 'Hotel booking', 'Bank statements (6 months)', 'Pay slips (3 months)'], requirements: ['Apply at Italian Embassy/VFS', 'Biometrics required', 'Appointment mandatory'], onlineApplyUrl: 'https://visa.vfsglobal.com/', embassy: { address: '12, Malapanna House, G. Dhawan Marg', city: 'New Delhi - 110001', phone: '+91-11-4423 4300', website: 'https://ambnewdelhi.esteri.it', hours: 'Mon-Fri: 9AM-1PM' }, tips: ['Book appointment early', 'Check regional jurisdiction', 'Nationality-specific rules'], color: '#009688', icon: '🟢' },
    'Spain': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple (short stay)', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo (35x45mm)', 'Application form (TLS website)', 'Travel insurance (€30,000+)', 'Flight itinerary', 'Hotel booking', 'Bank statements (3 months)', 'NOC from employer'], requirements: ['Apply at BLS center', 'Biometrics at center', 'Personal interview'], onlineApplyUrl: 'https://www.blspainvisa.com/', embassy: { address: 'B-6, Maharani Bagh', city: 'New Delhi - 110065', phone: '+91-11-4668 8800', website: 'https://www.exteriores.gob.es', hours: 'Mon-Fri: 9AM-2PM' }, tips: ['Book slot 2-3 weeks ahead', 'Check Spain-specific docs', 'Financial requirements vary'], color: '#ff5722', icon: '🟠' },
    'Netherlands': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple (short stay)', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo (35x45mm)', 'Application form', 'Travel insurance (€30,000+)', 'Flight tickets', 'Hotel booking', 'Bank statements (3 months)', 'Sponsorship letter (if applicable)'], requirements: ['Apply at VFS Netherlands', 'Biometrics required', 'Appointment needed'], onlineApplyUrl: 'https://www.vfsglobal.com/netherlands/india/', embassy: { address: '6th Floor, Shiva Marg', city: 'New Delhi - 110001', phone: '+91-11-4140 7600', website: 'https://www.netherlandsworldwide.nl', hours: 'Mon-Fri: 9AM-12PM' }, tips: ['Use correct VFS center', 'Check processing times', 'Priority visa available'], color: '#ff9800', icon: '🟠' },
    'Switzerland': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple (short stay)', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo (35x45mm)', 'Application form', 'Travel insurance (€30,000+)', 'Flight confirmation', 'Hotel/hostel booking', 'Bank statements (3 months)', 'Proof of employment'], requirements: ['Apply at Swiss Embassy/VFS', 'Biometrics', 'Interview may be required'], onlineApplyUrl: 'https://www.vfsglobal.ch/', embassy: { address: 'No. 10, Mahadev Road', city: 'New Delhi - 110001', phone: '+91-11-4600 1500', website: 'https://www.eda.admin.ch/newdelhi', hours: 'Mon-Fri: 9AM-12PM' }, tips: ['Apply well in advance', 'Swiss franc fee equivalent', 'Check local consulate'], color: '#e53935', icon: '🔴' },
    'Turkey': { visaType: 'e_visa', visaName: 'Turkey e-Visa', processingTime: '24-72 hours', processingDays: 3, maxStay: '90 days', entryType: 'Single (180 days)', fees: 'USD 50 (~₹4,200)', feesInr: 4200, validity: '180 days from issue', documents: ['Valid passport (6+ months)', 'Credit/Debit card', 'Email address', 'Return flight proof'], requirements: ['Apply at evisa.gov.tr', 'Answer eligibility questions', 'Pay visa fee online'], onlineApplyUrl: 'https://www.evisa.gov.tr/en/', tips: ['Multiple entry option', 'Check eligibility first', 'Sticker visa also available'], color: '#f44336', icon: '🔴' },
    'Egypt': { visaType: 'e_visa', visaName: 'Egypt e-Visa', processingTime: '3-7 business days', processingDays: 7, maxStay: '30 days', entryType: 'Single/Multiple', fees: 'USD 25-35 (~₹2,100-2,900)', feesInr: 2500, validity: '90 days from issue', documents: ['Valid passport (6+ months)', 'Passport photo', 'Credit card', 'Travel itinerary'], requirements: ['Apply at visa2egypt.gov.eg', 'Choose single or multiple entry', 'Pay fee online'], onlineApplyUrl: 'https://visa2egypt.gov.eg/', tips: ['Multiple entry costs more', 'Also available on arrival', 'Sinai permits different rules'], color: '#ffc107', icon: '🟡' },
    'Sri Lanka': { visaType: 'eta', visaName: 'Sri Lanka ETA', processingTime: '24-72 hours (instant option)', processingDays: 3, maxStay: '30 days', entryType: 'Double/Multiple', fees: 'USD 35-50 (~₹2,900-4,200)', feesInr: 3500, validity: '180 days from issue', documents: ['Valid passport (6+ months)', 'Credit card', 'Email address'], requirements: ['Apply at eta.gov.lk', 'Choose tourist or business ETA', 'Pay fee online'], onlineApplyUrl: 'https://www.eta.gov.lk/', tips: ['Instant ETA available', 'Can extend on arrival', 'Transit ETA free'], color: '#8bc34a', icon: '🟢' },
    'Nepal': { visaType: 'free', visaName: 'Visa on Arrival (Free)', processingTime: 'On arrival', processingDays: 0, maxStay: 'Multiple (extendable)', entryType: 'Multiple', fees: 'Free', feesInr: 0, validity: 'Up to 150 days/year', documents: ['Valid passport (6+ months)', 'Passport photo', 'Arrival form'], requirements: ['Available at all entry points', 'Fill arrival card', 'No fee for Indian nationals'], tips: ['Indian currency accepted', 'Multiple entry easily', 'Can extend at immigration'], color: '#d32f2f', icon: '🔴' },
    'Maldives': { visaType: 'free', visaName: 'Visa on Arrival (Free)', processingTime: 'On arrival', processingDays: 0, maxStay: '30 days', entryType: 'Single (extendable)', fees: 'Free', feesInr: 0, validity: '30 days (extendable to 90)', documents: ['Valid passport (6+ months)', 'Hotel booking confirmation', 'Return flight ticket', 'Sufficient funds', 'On arrival card'], requirements: ['No advance visa needed', 'Confirmation of accommodation required', 'Return ticket mandatory'], tips: ['Extension easy at immigration', 'Bring USD for fees', 'Aqua hotel bookings accepted'], color: '#00bcd4', icon: '🔵' },
    'South Africa': { visaType: 'e_visa', visaName: 'South Africa e-Visa', processingTime: '5-10 business days', processingDays: 10, maxStay: '30-90 days', entryType: 'Single', fees: 'ZAR 1,350 (~₹6,500)', feesInr: 6500, validity: '90 days', documents: ['Valid passport (2+ pages)', 'Photo', 'Bank statements', 'Employment letter', 'Travel itinerary', 'Accommodation proof'], requirements: ['Apply online (DHA portal)', 'Pay fee', 'Wait for approval'], onlineApplyUrl: 'https://www.dha.gov.za/', tips: ['Check pilot phase eligibility', 'Strong financial proof needed', 'Yellow fever cert if from Africa'], color: '#795548', icon: '🟤' },
    'Kenya': { visaType: 'e_visa', visaName: 'Kenya e-Visa', processingTime: '2-3 business days', processingDays: 3, maxStay: '90 days', entryType: 'Single/Multiple', fees: 'USD 51-100 (~₹4,200-8,300)', feesInr: 6000, validity: '90 days (single), 12 months (multiple)', documents: ['Valid passport (6+ months)', 'Passport photo', 'Yellow fever certificate', 'Travel itinerary', 'Credit card'], requirements: ['Apply at evisa.go.ke', 'Upload documents', 'Pay fee online', 'Print visa approval'], onlineApplyUrl: 'https://evisa.go.ke/', tips: ['Multiple entry recommended', 'East Africa Tourist Visa available', 'Yellow fever mandatory'], color: '#4caf50', icon: '🟢' },
    'Morocco': { visaType: 'free', visaName: 'Visa Free (90 days)', processingTime: 'N/A', processingDays: 0, maxStay: '90 days', entryType: 'Single (extendable)', fees: 'Free', feesInr: 0, validity: '90 days', documents: ['Valid passport (6+ months)', 'Return ticket', 'Hotel booking', 'Sufficient funds'], requirements: ['No advance visa needed for Indians', 'May be asked for proof at border', 'Register for longer stays'], tips: ['Can extend at police station', '90-day reset rule', 'Check airline requirements'], color: '#4caf50', icon: '🟢' },
    'Brazil': { visaType: 'e_visa', visaName: 'Brazil e-Visa', processingTime: '5-10 business days', processingDays: 10, maxStay: '90 days', entryType: 'Multiple', fees: 'USD 44.50 (~₹3,700)', feesInr: 3700, validity: '2 years', documents: ['Valid passport (6+ months)', 'Digital photo', 'Credit card', 'Travel insurance', 'Flight itinerary'], requirements: ['Apply at brazilvisa.com', 'Answer questionnaire', 'Pay fee online'], onlineApplyUrl: 'https://www.brazil.vlx.br/', tips: ['90-day stay per entry', 'Can extend 90 more days', 'Mercosur travel possible'], color: '#4caf50', icon: '🟢' },
    'Russia': { visaType: 'visa_required', visaName: 'Russia Tourist Visa', processingTime: '10-20 business days', processingDays: 20, maxStay: '30 days', entryType: 'Single/Double', fees: '₹5,500 (~USD 65)', feesInr: 5500, validity: '30 days', documents: ['Valid passport (6+ months)', 'Photo (3.5x4.5cm)', 'Visa support letter (from hotel/tour)', 'Travel insurance', 'Application form'], requirements: ['Get invitation letter first', 'Apply at Russian Embassy', 'Personal appearance needed'], tips: ['Invitations often via hotels', 'Check regional consulates', 'Transit visa easier'], color: '#795548', icon: '🟤' },
    'Saudi Arabia': { visaType: 'e_visa', visaName: 'Saudi Arabia e-Visa', processingTime: '24-72 hours', processingDays: 3, maxStay: '90 days', entryType: 'Multiple', fees: 'SAR 535 (~₹12,000)', feesInr: 12000, validity: '1 year', documents: ['Valid passport (6+ months)', 'Photo (white background)', 'Credit card', 'Email address'], requirements: ['Apply at visa.visitsaudi.com', 'Women can travel solo', 'GCC residents eligible'], onlineApplyUrl: 'https://visa.visitsaudi.com/', tips: ['Umrah visa different process', 'Girls under 30 need guardian', 'Insurance included in e-Visa'], color: '#4caf50', icon: '🟢' },
    'Qatar': { visaType: 'free', visaName: 'Visa on Arrival (Free)', processingTime: 'On arrival', processingDays: 0, maxStay: '30 days', entryType: 'Multiple (extendable)', fees: 'Free', feesInr: 0, validity: '30 days (extendable)', documents: ['Valid passport (6+ months)', 'Onward ticket', 'Hotel booking', 'Credit card for hotel'], requirements: ['Available for all nationalities', 'No fee charged', 'Fill arrival card'], tips: ['Hayya card for FIFA events', 'Extension at MoI office', 'Transit visa available'], color: '#9c27b0', icon: '🟣' },
    'Oman': { visaType: 'e_visa', visaName: 'Oman e-Visa', processingTime: '3-5 business days', processingDays: 5, maxStay: '30 days', entryType: 'Single (extendable)', fees: 'OMR 20 (~₹4,400)', feesInr: 4400, validity: '30 days (extendable 30 more)', documents: ['Valid passport (6+ months)', 'Photo', 'Hotel booking', 'Credit card'], requirements: ['Apply at evisa.rop.gov.om', 'Pay fee online', 'Print visa'], onlineApplyUrl: 'https://evisa.rop.gov.om/', tips: ['Also available on arrival', 'Extension possible', 'Tourist visa preferred'], color: '#ff9800', icon: '🟠' },
    'Bahrain': { visaType: 'e_visa', visaName: 'Bahrain e-Visa', processingTime: '1-3 business days', processingDays: 3, maxStay: '14-30 days', entryType: 'Single/Multiple', fees: 'BHD 25-75 (~₹5,500-16,500)', feesInr: 10000, validity: '14 days to 5 years', documents: ['Valid passport (6+ months)', 'Photo', 'Credit card'], requirements: ['Apply at evisa.gov.bh', 'Choose visa type', 'Pay fee'], onlineApplyUrl: 'https://www.evisa.gov.bh/', tips: ['GCC residents easier', '5-year multiple available', 'On arrival also possible'], color: '#9c27b0', icon: '🟣' },
    'Israel': { visaType: 'visa_required', visaName: 'Israel Tourist Visa', processingTime: '5-7 business days', processingDays: 7, maxStay: '90 days', entryType: 'Multiple', fees: '₹1,000 (~USD 12)', feesInr: 1000, validity: '3 months', documents: ['Valid passport (6+ months)', 'Photo (5x5cm)', 'Application form', 'Bank statements', 'Employment letter', 'Travel insurance', 'Flight itinerary'], requirements: ['Apply at Israeli Embassy', 'May need interview', 'Security check process'], embassy: { address: '3, San Martin Marg, Chanakyapuri', city: 'New Delhi - 110021', phone: '+91-11-4610 0100', website: 'https://embassies.gov.il', hours: 'Sun-Thu: 9AM-1PM' }, tips: ['Long security processing', 'Check passport stamps if affected', 'AR 16 months validity needed'], color: '#2196f3', icon: '🔵' },
    'Jordan': { visaType: 'on_arrival', visaName: 'Visa on Arrival', processingTime: 'On arrival', processingDays: 0, maxStay: '30 days', entryType: 'Single (extendable)', fees: 'JOD 40 (~₹4,600)', feesInr: 4600, validity: '30 days', documents: ['Valid passport (6+ months)', 'Onward ticket', 'Hotel booking', 'Cash for fee'], requirements: ['Pay fee at immigration', 'Fill arrival form', 'May ask for hotel'], tips: ['Jordan Pass recommended', 'Pass includes visa + sites', 'Aqaba special economic zone'], color: '#4caf50', icon: '🟢' },
    'Myanmar': { visaType: 'e_visa', visaName: 'Myanmar e-Visa', processingTime: '3-5 business days', processingDays: 5, maxStay: '28 days', entryType: 'Single', fees: 'USD 50 (~₹4,200)', feesInr: 4200, validity: '90 days from issue', documents: ['Valid passport (6+ months)', 'Photo (4x6cm)', 'Credit card', 'Travel itinerary'], requirements: ['Apply at evisa.mip.gov.mm', 'Choose tourist e-Visa', 'Pay fee online'], onlineApplyUrl: 'https://evisa.mip.gov.mm/', tips: ['Only certain entry points', 'Check restricted areas', 'Can extend 2 weeks'], color: '#ff9800', icon: '🟠' },
    'Cambodia': { visaType: 'e_visa', visaName: 'Cambodia e-Visa', processingTime: '3 business days', processingDays: 3, maxStay: '30 days', entryType: 'Single (extendable)', fees: 'USD 30 (~₹2,500)', feesInr: 2500, validity: '90 days from issue', documents: ['Valid passport (6+ months)', 'Photo (4x6cm)', 'Credit card', 'Travel dates'], requirements: ['Apply at evisa.gov.kh', 'Pay fee online', 'Print approval letter'], onlineApplyUrl: 'https://www.evisa.gov.kh/', tips: ['Also available on arrival', 'Extension at immigration', 'Check entry points'], color: '#3f51b5', icon: '🔵' },
    'Laos': { visaType: 'on_arrival', visaName: 'Visa on Arrival', processingTime: 'On arrival', processingDays: 0, maxStay: '30 days', entryType: 'Single (extendable)', fees: 'USD 30 (~₹2,500)', feesInr: 2500, validity: '30 days (extendable)', documents: ['Valid passport (6+ months)', 'Photo (4x6cm)', 'USD cash', 'Hotel booking'], requirements: ['Available at international airports', 'Pay fee at counter', 'Fill arrival card'], tips: ['Extension easy', 'E-Visa also available', 'Check land border restrictions'], color: '#3f51b5', icon: '🔵' },
    'Philippines': { visaType: 'free', visaName: 'Visa Free (30 days)', processingTime: 'N/A', processingDays: 0, maxStay: '22 days', entryType: 'Single (extendable)', fees: 'Free', feesInr: 0, validity: '22 days (extendable to 59)', documents: ['Valid passport (6+ months)', 'Return ticket', 'Hotel booking', 'Sufficient funds'], requirements: ['No advance visa needed', 'May ask for docs at airport', 'Extensions at BI'], tips: ['Can extend at Bureau of Immigration', 'Maximum 59 days stay', 'ACR I-card for longer stays'], color: '#2196f3', icon: '🔵' },
    'South Korea': { visaType: 'e_visa', visaName: 'K-ETA (Korea ETA)', processingTime: '1-2 business days', processingDays: 2, maxStay: '90 days', entryType: 'Multiple', fees: 'KRW 10,000 (~₹640)', feesInr: 640, validity: '2 years', documents: ['Valid passport', 'Credit card', 'Email address'], requirements: ['Apply at k-eta.go.kr', 'Simple online form', 'Quick approval'], onlineApplyUrl: 'https://www.k-eta.go.kr/', tips: ['K-Smart Landing Card also', 'Some countries exempt', 'Transit visa not needed'], color: '#2196f3', icon: '🔵' },
    'Taiwan': { visaType: 'e_visa', visaName: 'Taiwan e-Visa (EDA)', processingTime: '2-3 business days', processingDays: 3, maxStay: '30-90 days', entryType: 'Single/Multiple', fees: 'USD 50-160 (~₹4,200-13,300)', feesInr: 8000, validity: '90 days', documents: ['Valid passport (6+ months)', 'Photo', 'Bank statements', 'Travel itinerary', 'Credit card'], requirements: ['Apply at boca.gov.tw', 'Choose visa category', 'Pay fee'], onlineApplyUrl: 'https://cgi.immigration.gov.tw/', tips: ['Check eligibility first', 'New Southbound Policy', 'Tourist visa possible'], color: '#2196f3', icon: '🔵' },
    'Iran': { visaType: 'visa_required', visaName: 'Iran Tourist Visa', processingTime: '2-4 weeks', processingDays: 28, maxStay: '30 days', entryType: 'Single (extendable)', fees: 'EUR 60-160 (~₹5,400-14,400)', feesInr: 10000, validity: '30 days (extendable)', documents: ['Valid passport (6+ months)', 'Photo (3x4cm)', 'Invitation letter or tour booking', 'Travel insurance', 'Bank guarantee'], requirements: ['Get LOI first (recommended)', 'Apply at Iranian Embassy', 'Sponsor required often'], tips: ['LOI from travel agencies', 'Currency restrictions', 'Female dress code strict'], color: '#795548', icon: '🟤' },
    'Iraq': { visaType: 'visa_required', visaName: 'Iraq Tourist Visa', processingTime: '2-4 weeks', processingDays: 28, maxStay: '30 days', entryType: 'Single', fees: 'USD 80 (~₹6,700)', feesInr: 6700, validity: '30 days', documents: ['Valid passport (6+ months)', 'Photo', 'Invitation letter', 'Travel itinerary', 'Sponsor letter'], requirements: ['Very restricted for tourists', 'Kurdistan region easier', 'Check current advisories'], tips: ['Avoid unless essential', 'Kurdistan visa separate', 'Check travel advisories'], color: '#795548', icon: '🟤' },
    'Yemen': { visaType: 'visa_required', visaName: 'Yemen Visa', processingTime: 'Several weeks', processingDays: 42, maxStay: '30-90 days', entryType: 'Single', fees: 'USD 100-200 (~₹8,300-16,600)', feesInr: 12000, validity: 'Varies', documents: ['Valid passport (6+ months)', 'Photo', 'Invitation letter', 'Sponsor', 'Travel insurance'], requirements: ['Strict restrictions', 'Check current situation', 'Embassy application only'], tips: ['Not recommended currently', 'Sanaa Embassy only', 'Check advisories'], color: '#795548', icon: '🟤' },
    'China': { visaType: 'visa_required', visaName: 'China Tourist Visa (L)', processingTime: '4-7 business days', processingDays: 7, maxStay: '30-60 days', entryType: 'Single/Double/Multiple', fees: '₹3,500 (~USD 42)', feesInr: 3500, validity: 'Up to 10 years', documents: ['Valid passport (6+ months)', 'Photo (48x33mm)', 'Application form', 'Flight/hotel bookings', 'Itinerary', 'Bank statements (3 months)', 'Employment letter'], requirements: ['Apply at Chinese Visa Application Center', 'Personal appearance for biometrics', 'Invitations may help'], onlineApplyUrl: 'https://www.visaforchina.cn/', embassy: { address: '50-D, Shantipath, Chanakyapuri', city: 'New Delhi - 110021', phone: '+91-11-4688 3100', website: 'https://in.china-embassy.gov.cn', hours: 'Mon-Fri: 9AM-12PM' }, tips: ['Group visas possible', '144-hour transit available', 'Sichuan panda base special'], color: '#f44336', icon: '🔴' },
    'New Zealand': { visaType: 'e_visa', visaName: 'NZeTA', processingTime: '1-3 business days', processingDays: 3, maxStay: '9 months', entryType: 'Multiple', fees: 'NZD 23-35 (~₹1,200-1,800)', feesInr: 1500, validity: '2 years', documents: ['Valid passport', 'Credit card', 'Email address'], requirements: ['Apply online (NZeTA app)', 'Answer questions', 'Pay levy + fee'], onlineApplyUrl: 'https://www.immigration.govt.nz/nzeta', tips: ['Must have return ticket', 'Check health requirements', 'eTA linked to passport electronically'], color: '#2196f3', icon: '🔵' },
    'Georgia': { visaType: 'free', visaName: 'Visa Free', processingTime: 'N/A', processingDays: 0, maxStay: '365 days', entryType: 'Multiple', fees: 'Free', feesInr: 0, validity: '1 year (365 days)', documents: ['Valid passport (6+ months)', 'Return ticket', 'Sufficient funds', 'Travel insurance (recommended)'], requirements: ['No advance visa needed', 'Can stay up to 1 year', 'Registration after 90 days'], tips: ['Best visa-free for Indians', 'Can extend stay online', 'Works for all of Georgia'], color: '#9c27b0', icon: '🟣' },
    'Azerbaijan': { visaType: 'e_visa', visaName: 'Azerbaijan ASAN e-Visa', processingTime: '3 business days', processingDays: 3, maxStay: '30 days', entryType: 'Single', fees: 'USD 25 (~₹2,100)', feesInr: 2100, validity: '90 days from issue', documents: ['Valid passport (6+ months)', 'Photo', 'Credit card'], requirements: ['Apply at evisa.gov.az', 'Simple online form', 'Pay fee online'], onlineApplyUrl: 'https://www.evisa.gov.az/', tips: ['Check special economic zones', 'Transit visa easier', 'Multiple entry possible'], color: '#009688', icon: '🟢' },
    'Uzbekistan': { visaType: 'e_visa', visaName: 'Uzbekistan e-Visa', processingTime: '2-3 business days', processingDays: 3, maxStay: '30 days', entryType: 'Single', fees: 'USD 20 (~₹1,700)', feesInr: 1700, validity: '90 days from issue', documents: ['Valid passport (6+ months)', 'Photo', 'Credit card'], requirements: ['Apply at evisa.gov.uz', 'Fill application', 'Pay fee online'], onlineApplyUrl: 'https://e-visa.gov.uz/', tips: ['Most accessible Central Asia', '30-day stay', 'Check air entry points'], color: '#009688', icon: '🟢' },
    'Kazakhstan': { visaType: 'e_visa', visaName: 'Kazakhstan e-Visa', processingTime: '5 business days', processingDays: 5, maxStay: '30 days', entryType: 'Single', fees: 'USD 50-280 (~₹4,200-23,000)', feesInr: 12000, validity: '90 days from issue', documents: ['Valid passport (6+ months)', 'Photo', 'Invitation letter', 'Travel insurance', 'Credit card'], requirements: ['Get invitation first', 'Apply online', 'Check eligible ports'], onlineApplyUrl: 'https://vmp.gov.kz/', tips: ['Most need invitation', 'Astana hub special rules', 'Check e-Visa portal'], color: '#009688', icon: '🟢' },
    'Ghana': { visaType: 'e_visa', visaName: 'Ghana e-Visa', processingTime: '5-10 business days', processingDays: 10, maxStay: '30-90 days', entryType: 'Single/Multiple', fees: 'USD 50-150 (~₹4,200-12,500)', feesInr: 8000, validity: '90 days', documents: ['Valid passport (6+ months)', 'Photo', 'Yellow fever cert', 'Bank statement', 'Travel insurance', 'Credit card'], requirements: ['Apply at ghanaevisa.com', 'Pay fee', 'Wait for approval'], onlineApplyUrl: 'https://www.ghanaevisa.com/', tips: ['Yellow fever mandatory', 'Can extend on arrival', 'Check health requirements'], color: '#4caf50', icon: '🟢' },
    'Ethiopia': { visaType: 'on_arrival', visaName: 'Visa on Arrival', processingTime: 'On arrival', processingDays: 0, maxStay: '30-90 days', entryType: 'Single (extendable)', fees: 'USD 50 (~₹4,200)', feesInr: 4200, validity: '30 days (extendable)', documents: ['Valid passport (6+ months)', 'Photo', 'Yellow fever cert', 'Hotel booking', 'USD cash'], requirements: ['Pay fee at immigration', 'Fill arrival form', 'May need sponsor'], tips: ['e-Visa also available', 'Ethiopian Airlines connections', 'Diaspora special rules'], color: '#4caf50', icon: '🟢' },
    'Nigeria': { visaType: 'e_visa', visaName: 'Nigeria e-Visa', processingTime: '2-4 weeks', processingDays: 28, maxStay: '90 days', entryType: 'Single', fees: 'USD 160 (~₹13,300)', feesInr: 13300, validity: '90 days', documents: ['Valid passport (6+ months)', 'Photo', 'Yellow fever cert', 'Bank statement', 'Travel itinerary', 'Credit card'], requirements: ['Apply at immigration.gov.ng', 'Pay fee online', 'Wait for approval'], onlineApplyUrl: 'https://immigration.gov.ng/', tips: ['Strict requirements', 'Yellow fever mandatory', 'Check processing times'], color: '#4caf50', icon: '🟢' },
    'Colombia': { visaType: 'free', visaName: 'Visa Free (90 days)', processingTime: 'N/A', processingDays: 0, maxStay: '90 days', entryType: 'Multiple', fees: 'Free', feesInr: 0, validity: '90 days (extendable 90 more)', documents: ['Valid passport (6+ months)', 'Return ticket', 'Sufficient funds'], requirements: ['No advance visa for Indians', 'Fill check-MIG form', 'May ask for docs'], tips: ['Can extend online', '90-day reset by leaving', 'PEP restrictions apply'], color: '#ff9800', icon: '🟠' },
    'Peru': { visaType: 'free', visaName: 'Visa Free (180 days)', processingTime: 'N/A', processingDays: 0, maxStay: '183 days', entryType: 'Multiple', fees: 'Free', feesInr: 0, validity: '180 days per entry', documents: ['Valid passport (6+ months)', 'Return ticket', 'Tourist card (TAM)', 'Sufficient funds'], requirements: ['No advance visa needed', 'Fill tourist card at arrival', 'Maximum 183 days per year'], tips: ['Can extend 90 days', 'Buy tourist card TAM', 'Mercosur travel not for Indians'], color: '#ff9800', icon: '🟠' },
    'Argentina': { visaType: 'visa_required', visaName: 'Argentina Tourist Visa', processingTime: '2-4 weeks', processingDays: 28, maxStay: '90 days', entryType: 'Single (extendable)', fees: 'USD 150 (~₹12,500)', feesInr: 12500, validity: '90 days', documents: ['Valid passport (6+ months)', 'Photo', 'Bank statements', 'Employment letter', 'Flight itinerary', 'Hotel booking', 'Travel insurance'], requirements: ['Apply at Argentine Embassy', 'Interview may be needed', 'Strong financial proof'], embassy: { address: 'A-2, Palam Marg, Vasant Vihar', city: 'New Delhi - 110057', phone: '+91-11-4600 0650', website: 'https://www.cindia.mrec.gov.ar', hours: 'Mon-Fri: 10AM-1PM' }, tips: ['Check reciprocity fees', 'Tourist visa standard', 'Online application started'], color: '#3f51b5', icon: '🔵' },
    'Chile': { visaType: 'free', visaName: 'Visa Free (90 days)', processingTime: 'N/A', processingDays: 0, maxStay: '90 days', entryType: 'Multiple', fees: 'Free', feesInr: 0, validity: '90 days (extendable 90 more)', documents: ['Valid passport (6+ months)', 'Return ticket', 'Sufficient funds'], requirements: ['No advance visa needed', 'Fill migration form', 'May ask for documents'], tips: ['Can extend once', 'SOMOS checked', 'Tourist card (FUI) at arrival'], color: '#f44336', icon: '🔴' },
    'Mexico': { visaType: 'visa_required', visaName: 'Mexico Tourist Visa', processingTime: '2-3 weeks', processingDays: 21, maxStay: '180 days', entryType: 'Multiple', fees: 'MXN 1,575 (~₹7,000)', feesInr: 7000, validity: 'Up to 10 years', documents: ['Valid passport (6+ months)', 'Photo', 'Application form', 'Bank statements (3 months)', 'Employment letter', 'Flight itinerary'], requirements: ['Apply at Mexican Embassy', 'Interview may be required', 'Financial proof needed'], onlineApplyUrl: 'https://embamex.sre.gob.mx/india/', embassy: { address: 'B-6, West End Enclave', city: 'New Delhi - 110001', phone: '+91-11-4656 0808', website: 'https://embamex.sre.gob.mx/india', hours: 'Mon-Fri: 9AM-1PM' }, tips: ['US visa helps greatly', 'FMM form at airport', 'Maximum 180 days'], color: '#4caf50', icon: '🟢' },
    'Cuba': { visaType: 'visa_required', visaName: 'Cuba Tourist Card (Visa)', processingTime: '1-2 weeks', processingDays: 14, maxStay: '30-90 days', entryType: 'Single', fees: 'CUC 25-45 (~₹1,900-3,400)', feesInr: 2500, validity: '30 days (extendable)', documents: ['Valid passport (6+ months)', 'Photo', 'Tourist card (purchased)', 'Travel insurance', 'Flight booking'], requirements: ['Buy tourist card from airline/embassy', 'Travel insurance mandatory', 'Health declaration'], tips: ['Tourist card via airlines', 'Travel agency recommended', 'Check direct flight options'], color: '#4caf50', icon: '🟢' },
    'Iceland': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo', 'Travel insurance (€30,000+)', 'Flight/hotel', 'Bank statements', 'Employment letter'], requirements: ['Apply at VFS or Embassy', 'Biometrics required', 'Apply well in advance'], onlineApplyUrl: 'https://utl.is/', tips: ['Gateway to Iceland nature', 'Long processing times', 'Summer peak season busy'], color: '#2196f3', icon: '🔵' },
    'Portugal': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo', 'Travel insurance (€30,000+)', 'Flight/hotel bookings', 'Bank statements (6 months)'], requirements: ['Apply at VFS Portugal', 'Biometrics required', 'Proof of funds'], onlineApplyUrl: 'https://www.vfsglobal.com/portugal/india/', tips: ['Golden Visa different', 'D7 visa for retirees', 'Book appointment early'], color: '#009688', icon: '🟢' },
    'Belgium': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo', 'Travel insurance (€30,000+)', 'Invitation letter', 'Bank statements (3 months)'], requirements: ['Apply at VFS Belgium', 'Biometrics', 'Appointment needed'], onlineApplyUrl: 'https://www.vfsglobal.com/belgium/india/', tips: ['Check Belgium-specific docs', 'Family visa different', 'Regional jurisdiction'], color: '#3f51b5', icon: '🔵' },
    'Austria': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo', 'Travel insurance (€30,000+)', 'Flight/hotel', 'Bank statements', 'Employment proof'], requirements: ['Apply at VFS Austria', 'Biometrics required', 'Personal interview'], onlineApplyUrl: 'https://www.vfsglobal.com/austria/india/', tips: ['Book slot weeks ahead', 'Vienna Opera special', 'Winter sports visa common'], color: '#f44336', icon: '🔴' },
    'Ireland': { visaType: 'visa_required', visaName: 'Ireland Tourist Visa', processingTime: '4-8 weeks', processingDays: 56, maxStay: '90 days', entryType: 'Single/Multiple', fees: '₹7,000 (~EUR 80)', feesInr: 7000, validity: 'Up to 5 years', documents: ['Valid passport (6+ months)', 'Photo', 'Application form', 'Bank statements (6 months)', 'Employment letter', 'Travel insurance', 'Flight/hotel'], requirements: ['Apply at VFS Ireland', 'Biometrics required', 'Interview may be needed'], onlineApplyUrl: 'https://www.vfsglobal.com/ireland/india/', tips: ['British visa not valid', 'INI agreement helps', 'Apply 8+ weeks ahead'], color: '#009688', icon: '🟢' },
    'Poland': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo', 'Travel insurance (€30,000+)', 'Flight/hotel', 'Bank statements (3 months)'], requirements: ['Apply at VFS Poland', 'Biometrics required', 'Sufficient funds'], onlineApplyUrl: 'https://www.vfsglobal.com/poland/india/', tips: ['Processing time varies', 'Economy route option', 'Schengen coverage good'], color: '#f44336', icon: '🔴' },
    'Norway': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo', 'Travel insurance (€30,000+)', 'Flight/hotel', 'Bank statements (3 months)'], requirements: ['Apply at VFS Norway', 'Biometrics required', 'Employment proof'], onlineApplyUrl: 'https://www.vfsglobal.com/norway/india/', tips: ['Northern lights peak', 'Svalbard separate visa', 'Long processing times'], color: '#3f51b5', icon: '🔵' },
    'Sweden': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo', 'Travel insurance (€30,000+)', 'Flight/hotel', 'Bank statements (3 months)'], requirements: ['Apply at VFS Sweden', 'Biometrics required', 'Financial proof'], onlineApplyUrl: 'https://www.vfsglobal.com/sweden/india/', tips: ['Nordic countries together', 'No separate requirements', 'Long summer days'], color: '#ff9800', icon: '🟠' },
    'Denmark': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo', 'Travel insurance (€30,000+)', 'Flight/hotel', 'Bank statements (3 months)'], requirements: ['Apply at VFS Denmark', 'Biometrics required', 'Sponsor letter if needed'], onlineApplyUrl: 'https://www.vfsglobal.com/denmark/india/', tips: ['Tivoli Gardens access', 'Greenland separate rules', 'Apply early'], color: '#f44336', icon: '🔴' },
    'Finland': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo', 'Travel insurance (€30,000+)', 'Flight/hotel', 'Bank statements (3 months)'], requirements: ['Apply at VFS Finland', 'Biometrics required', 'Santa village reason'], onlineApplyUrl: 'https://www.vfsglobal.com/finland/india/', tips: ['Northern lights visa', 'Santa Claus Village special', 'Arctic experiences'], color: '#3f51b5', icon: '🔵' },
    'Estonia': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo', 'Travel insurance (€30,000+)', 'Flight/hotel', 'Bank statements (3 months)'], requirements: ['Apply at VFS Estonia', 'Biometrics required', 'Digital nomad visa separate'], onlineApplyUrl: 'https://www.vfsglobal.com/estonia/india/', tips: ['Digital nomad visa available', 'E-residency program', 'Baltic route popular'], color: '#3f51b5', icon: '🔵' },
    'Latvia': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo', 'Travel insurance (€30,000+)', 'Flight/hotel', 'Bank statements (3 months)'], requirements: ['Apply at VFS Latvia', 'Biometrics required', 'Baltic route combined'], onlineApplyUrl: 'https://www.vfsglobal.com/latvia/india/', tips: ['Often faster than others', 'Riga nightlife', 'Soviet heritage sites'], color: '#9c27b0', icon: '🟣' },
    'Lithuania': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo', 'Travel insurance (€30,000+)', 'Flight/hotel', 'Bank statements (3 months)'], requirements: ['Apply at VFS Lithuania', 'Biometrics required', 'Hill of Crosses special'], onlineApplyUrl: 'https://www.vfsglobal.com/lithuania/india/', tips: ['Baltic route popular', 'Budget-friendly Schengen', 'Nature experiences'], color: '#4caf50', icon: '🟢' },
    'Croatia': { visaType: 'e_visa', visaName: 'Croatia Visa (Soon Schengen)', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days', entryType: 'Multiple', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo', 'Travel insurance (€30,000+)', 'Flight/hotel', 'Bank statements (3 months)'], requirements: ['Apply at VFS Croatia', 'Biometrics required', 'Will join Schengen'], onlineApplyUrl: 'https://www.vfsglobal.com/croatia/india/', tips: ['Dubrovnik peak season', 'Soon Schengen member', 'Game of Thrones fans'], color: '#f44336', icon: '🔴' },
    'Romania': { visaType: 'e_visa', visaName: 'Romanian Visa (Will join Schengen)', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days', entryType: 'Multiple', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo', 'Travel insurance (€30,000+)', 'Flight/hotel', 'Bank statements (3 months)'], requirements: ['Apply at VFS Romania', 'Biometrics required', 'Joining Schengen soon'], onlineApplyUrl: 'https://www.vfsglobal.com/romania/india/', tips: ['Dracula tourism', 'Black Sea coast', 'Soon Schengen'], color: '#ff9800', icon: '🟠' },
    'Cyprus': { visaType: 'e_visa', visaName: 'Cyprus Visa', processingTime: '5-10 business days', processingDays: 10, maxStay: '90 days', entryType: 'Single/Multiple', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo', 'Travel insurance (€30,000+)', 'Flight/hotel', 'Bank statements (3 months)'], requirements: ['Apply at VFS Cyprus', 'Biometrics required', 'EU country not Schengen'], onlineApplyUrl: 'https://www.vfsglobal.com/cyprus/india/', tips: ['Split island rules', 'South Cyprus visa only', 'Turkish side separate'], color: '#3f51b5', icon: '🔵' },
    'Hungary': { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple', fees: '₹6,500 (~EUR 80)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo', 'Travel insurance (€30,000+)', 'Flight/hotel', 'Bank statements (3 months)'], requirements: ['Apply at VFS Hungary', 'Biometrics required', 'Budapest thermal baths'], onlineApplyUrl: 'https://www.vfsglobal.com/hungary/india/', tips: ['Good success rate', 'Eastern European route', 'Danube river trips'], color: '#4caf50', icon: '🟢' },
    'Ukraine': { visaType: 'visa_required', visaName: 'Ukraine Tourist Visa', processingTime: '10-15 business days', processingDays: 15, maxStay: '30-90 days', entryType: 'Single (extendable)', fees: 'USD 65 (~₹5,400)', feesInr: 5400, validity: '90 days', documents: ['Valid passport (6+ months)', 'Photo', 'Invitation letter', 'Travel insurance', 'Bank statements', 'Application form'], requirements: ['Get invitation first', 'Apply at Ukrainian Embassy', 'Check current situation'], tips: ['Currently not recommended', 'Separate rules for Crimea', 'Check travel advisories'], color: '#3f51b5', icon: '🔵' },
    'Albania': { visaType: 'free', visaName: 'Visa Free (90 days)', processingTime: 'N/A', processingDays: 0, maxStay: '90 days', entryType: 'Multiple', fees: 'Free', feesInr: 0, validity: '90 days', documents: ['Valid passport (6+ months)', 'Return ticket', 'Hotel booking', 'Sufficient funds'], requirements: ['No advance visa needed', 'Check eligibility', '90-day limit per entry'], tips: ['Italian influence visible', 'Riviera beaches', 'Best in summer'], color: '#009688', icon: '🟢' },
    'Pakistan': { visaType: 'visa_required', visaName: 'Pakistan Tourist Visa', processingTime: '2-4 weeks', processingDays: 28, maxStay: '30-90 days', entryType: 'Single/Multiple', fees: 'USD 25-200 (~₹2,100-16,600)', feesInr: 8000, validity: 'Varies', documents: ['Valid passport (6+ months)', 'Photo', 'Application form', 'NOC if needed', 'Travel itinerary', 'Invitation letter'], requirements: ['Apply online or at Embassy', 'NOC for certain areas', 'Check restricted zones'], onlineApplyUrl: 'https://visa.nadra.gov.pk/', tips: ['Online application easier', 'POEA for workers', 'Check current rules'], color: '#4caf50', icon: '🟢' },
    'Bangladesh': { visaType: 'on_arrival', visaName: 'Visa on Arrival', processingTime: 'On arrival', processingDays: 0, maxStay: '30 days', entryType: 'Single', fees: 'USD 51 (~₹4,300)', feesInr: 4300, validity: '30 days', documents: ['Valid passport (6+ months)', 'Photo', 'Return ticket', 'USD cash', 'Hotel booking'], requirements: ['Available at airports', 'Pay fee at immigration', 'Fill arrival form'], tips: ['Check current rules', 'e-Visa also available', 'SAARC simplified'], color: '#4caf50', icon: '🟢' },
    'Afghanistan': { visaType: 'visa_required', visaName: 'Afghanistan Visa', processingTime: 'Several weeks', processingDays: 42, maxStay: '30 days', entryType: 'Single', fees: 'USD 80-150', feesInr: 10000, validity: '30 days', documents: ['Valid passport (6+ months)', 'Photo', 'Invitation/LOI', 'Sponsor letter', 'Travel insurance'], requirements: ['Strict restrictions', 'Get LOI from sponsor', 'Check current advisories'], tips: ['Not recommended', 'Special permits needed', 'Check every time'], color: '#795548', icon: '🟤' },
    'Algeria': { visaType: 'visa_required', visaName: 'Algeria Visa', processingTime: '2-4 weeks', processingDays: 28, maxStay: '90 days', entryType: 'Single', fees: 'EUR 50-100', feesInr: 8000, validity: '90 days', documents: ['Valid passport (6+ months)', 'Photo', 'Invitation letter', 'Hotel booking', 'Travel insurance'], requirements: ['Sponsor/invitation required', 'Apply at Embassy', 'Restricted for tourists'], tips: ['Most closed to tourists', 'Special exceptions rare', 'Check advisories'], color: '#795548', icon: '🟤' },
  }

  if (fromCountry.code === 'IN') {
    if (indiaRules[country.name]) {
      let info = { ...indiaRules[country.name] }
      if (profile?.hasUSVisa && info.visaType === 'visa_required') {
        info.tips = [...info.tips, 'US visa holder - some countries may offer easier entry']
      }
      if (profile?.hasSchengenVisa && SCHENGEN_COUNTRIES.includes(country.name)) {
        info.processingTime = '5-10 days (faster with Schengen)'
        info.tips = [...info.tips, 'Schengen visa may help with processing']
      }
      return info
    }
  }

  if (SCHENGEN_COUNTRIES.includes(country.name)) {
    return { visaType: 'e_visa', visaName: 'Schengen Visa', processingTime: '15-30 days', processingDays: 30, maxStay: '90 days in 180 days', entryType: 'Multiple', fees: '€80 (~₹6,500)', feesInr: 6500, validity: 'Up to 5 years', documents: ['Valid passport (3+ months)', 'Photo (35x45mm)', 'Travel insurance (€30,000+)', 'Flight itinerary', 'Hotel booking', 'Bank statements (3 months)', 'Employment letter'], requirements: ['Apply at Schengen country Embassy', 'Biometrics required', 'Apply 6+ weeks before'], tips: ['Any Schengen country first', 'Insurance mandatory', 'Check country-specific rules'], color: '#3f51b5', icon: '🔵' }
  }

  return { visaType: 'visa_required', visaName: 'Tourist Visa Required', processingTime: 'Varies', processingDays: 30, maxStay: 'Varies', entryType: 'Check with Embassy', fees: 'Varies', feesInr: 0, validity: 'Check Embassy', documents: ['Valid passport', 'Photos', 'Application form', 'Travel insurance', 'Financial documents', 'Flight/hotel booking'], requirements: ['Contact nearest Embassy', 'Check specific requirements', 'Apply well in advance'], tips: ['Check official sources', 'Processing times vary', 'Apply early'], color: '#795548', icon: '🟤' }
}

function getVisaTypeIcon(type: VisaType) {
  switch (type) {
    case 'free': return { icon: '✅', label: 'Visa Free', color: '#51cf66' }
    case 'on_arrival': return { icon: '✈️', label: 'On Arrival', color: '#ffc107' }
    case 'e_visa': return { icon: '💻', label: 'e-Visa', color: '#2196f3' }
    case 'eta': return { icon: '📱', label: 'ETA', color: '#9c27b0' }
    case 'visa_required': return { icon: '📝', label: 'Visa Required', color: '#ff9800' }
    case 'refugee': return { icon: '🏠', label: 'Refugee', color: '#795548' }
    case 'permits_only': return { icon: '📋', label: 'Permits Only', color: '#607d8b' }
  }
}

export default function Visa() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/visa')
  const [selectedFrom, setSelectedFrom] = useState<string>('')
  const [selectedTo, setSelectedTo] = useState<string>('')
  const [searchFrom, setSearchFrom] = useState('')
  const [searchTo, setSearchTo] = useState('')
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [selectedVisa, setSelectedVisa] = useState<VisaInfo | null>(null)
  const [activeTab, setActiveTab] = useState<'search' | 'multi' | 'all' | 'timeline'>('search')
  const [showDocModal, setShowDocModal] = useState(false)
  
  // NEW: AI Chat State
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: "Hi! I'm your Visa Assistant 🛂 Ask me anything about visa requirements, documents, processing times, or travel restrictions!", time: new Date() }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  
  // NEW: Multi-Stop Trip State
  const [tripStops, setTripStops] = useState<TripStop[]>([
    { countryCode: '', arrivalDate: '', departureDate: '' }
  ])
  
  // NEW: Profile State
  const [showProfile, setShowProfile] = useState(false)
  const [profile, setProfile] = useState<TravelerProfile>({
    passportType: 'regular',
    visitedCountries: [],
    hasUSVisa: false,
    hasUKVisa: false,
    hasSchengenVisa: false,
    frequentFlyer: 'none',
    nationality: 'Indian'
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // NEW: Load profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('roamind_visa_profile')
    if (saved) setProfile(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('roamind_visa_profile', JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const nav = (path: string) => { setActivePath(path); router.push(path) }
  const handleLogout = () => signOut(auth).then(() => router.push('/landing'))

  const filteredFrom = COUNTRIES.filter(c => c.name.toLowerCase().includes(searchFrom.toLowerCase()) || c.code.toLowerCase().includes(searchFrom.toLowerCase()))
  const filteredTo = COUNTRIES.filter(c => c.name.toLowerCase().includes(searchTo.toLowerCase()) || c.code.toLowerCase().includes(searchTo.toLowerCase()))

  const fromCountry = COUNTRIES.find(c => c.code === selectedFrom)
  const toCountry = COUNTRIES.find(c => c.code === selectedTo)
  
  const visaInfo = selectedFrom && selectedTo ? getDefaultVisaInfo(toCountry!, fromCountry!, profile) : null

  // NEW: Send chat message
  const sendChatMessage = async (msg: string) => {
    if (!msg.trim() || chatLoading) return
    const userMsg = msg.trim()
    setChatMessages(p => [...p, { role: 'user', text: userMsg, time: new Date() }])
    setChatInput('')
    setChatLoading(true)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are Roamind Visa Assistant. Context: User is from ${fromCountry?.name || 'a selected country'} traveling to ${toCountry?.name || 'a destination'}. ${visaInfo ? `Visa type: ${visaInfo.visaName}, Processing: ${visaInfo.processingTime}, Max stay: ${visaInfo.maxStay}, Fees: ${visaInfo.fees}` : ''}. Profile: ${profile.hasUSVisa ? 'Has US Visa' : ''}, ${profile.hasUKVisa ? 'Has UK Visa' : ''}, ${profile.hasSchengenVisa ? 'Has Schengen Visa' : ''}. Answer concisely and helpfully about: ${userMsg}`
          }]
        })
      })
      const d = await res.json()
      setChatMessages(p => [...p, { role: 'bot', text: d.content?.[0]?.text || 'Sorry, I need more context. Please select countries first!', time: new Date() }])
    } catch {
      setChatMessages(p => [...p, { role: 'bot', text: "Connection issue! Please try again 🌐", time: new Date() }])
    }
    setChatLoading(false)
  }

  // NEW: Multi-stop trip functions
  const addTripStop = () => {
    if (tripStops.length < 8) {
      setTripStops([...tripStops, { countryCode: '', arrivalDate: '', departureDate: '' }])
    }
  }

  const removeTripStop = (idx: number) => {
    setTripStops(tripStops.filter((_, i) => i !== idx))
  }

  const updateTripStop = (idx: number, field: keyof TripStop, value: string) => {
    const updated = [...tripStops]
    updated[idx] = { ...updated[idx], [field]: value }
    setTripStops(updated)
  }

  const getTotalVisaCost = () => {
    return tripStops.reduce((sum, stop) => {
      const country = COUNTRIES.find(c => c.code === stop.countryCode)
      if (country && fromCountry) {
        const info = getDefaultVisaInfo(country, fromCountry, profile)
        return sum + (info.feesInr || 0)
      }
      return sum
    }, 0)
  }

  const getMultiStopVisaInfo = () => {
    return tripStops.map(stop => {
      const country = COUNTRIES.find(c => c.code === stop.countryCode)
      if (!country || !fromCountry) return null
      return { country, info: getDefaultVisaInfo(country, fromCountry, profile) }
    }).filter(Boolean)
  }

  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, border: '2px solid rgba(99,210,255,0.15)', borderTopColor: C, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()
  
  // NEW: Profile benefits
  const profileBenefits: { badge: string; benefit: string }[] = []
  if (profile.hasUSVisa) profileBenefits.push({ badge: '🇺🇸 US Visa Holder', benefit: 'Easier entry to Philippines, easier UAE visa' })
  if (profile.hasUKVisa) profileBenefits.push({ badge: '🇬🇧 UK Visa Holder', benefit: 'Faster processing in some countries' })
  if (profile.hasSchengenVisa) profileBenefits.push({ badge: '🇪🇺 Schengen Visa', benefit: 'Faster Schengen country processing' })
  if (profile.frequentFlyer !== 'none') profileBenefits.push({ badge: '✈️ Frequent Flyer', benefit: 'Priority processing in some countries' })

  return (
    <div style={{ display: 'flex', height: '100vh', background: BG, color: '#fff', fontFamily: "'Outfit',sans-serif", overflow: 'hidden' }}>
      
      <Sidebar sidebarOpen={sidebarOpen} activePath={activePath} user={user} onLogout={handleLogout} />

      {/* MAIN CONTENT - ORIGINAL + NEW TABS */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* TOP BAR - ORIGINAL */}
        <div style={{ height: 62, padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(99,210,255,0.07)', background: 'rgba(0,5,14,0.9)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer', fontSize: 15, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
            >☰</button>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>🛂 Visa Guide</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)' }}>Check visa requirements instantly</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* NEW: Profile button */}
            <button onClick={() => setShowProfile(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: profileBenefits.length > 0 ? 'rgba(81,207,102,0.1)' : 'rgba(99,210,255,0.05)', border: `1px solid ${profileBenefits.length > 0 ? 'rgba(81,207,102,0.3)' : 'rgba(99,210,255,0.12)'}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}>
              <span style={{ fontSize: 12 }}>👤</span>
              <span style={{ fontSize: 11, color: profileBenefits.length > 0 ? '#51cf66' : 'rgba(255,255,255,0.45)' }}>{profileBenefits.length > 0 ? `${profileBenefits.length} Benefits` : 'My Profile'}</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(99,210,255,0.05)', border: '1px solid rgba(99,210,255,0.12)', borderRadius: 10 }}>
              <span style={{ fontSize: 12 }}>🌍</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{COUNTRIES.length} Countries</span>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000814', cursor: 'pointer', flexShrink: 0 }}>{avatar}</div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>

          {/* TABS - ORIGINAL + NEW TABS */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('search')} style={{ padding: '10px 24px', background: activeTab === 'search' ? 'rgba(99,210,255,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeTab === 'search' ? C : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, color: activeTab === 'search' ? C : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              🔍 Check Visa Requirements
            </button>
            <button onClick={() => setActiveTab('multi')} style={{ padding: '10px 24px', background: activeTab === 'multi' ? 'rgba(255,183,77,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeTab === 'multi' ? G : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, color: activeTab === 'multi' ? G : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              🛫 Multi-Stop Trip
            </button>
            <button onClick={() => setActiveTab('all')} style={{ padding: '10px 24px', background: activeTab === 'all' ? 'rgba(81,207,102,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeTab === 'all' ? '#51cf66' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, color: activeTab === 'all' ? '#51cf66' : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              📋 All Countries
            </button>
            <button onClick={() => setActiveTab('timeline')} style={{ padding: '10px 24px', background: activeTab === 'timeline' ? 'rgba(156,39,176,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeTab === 'timeline' ? '#9c27b0' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, color: activeTab === 'timeline' ? '#9c27b0' : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              📅 Timeline Calculator
            </button>
          </div>

          {/* TAB 1: CHECK VISA - ORIGINAL */}
          {activeTab === 'search' && (
            <>
              <div style={{ background: 'linear-gradient(135deg,rgba(99,210,255,0.08) 0%,rgba(255,183,77,0.05) 100%)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, marginBottom: 6 }}>🛂 Check Your Visa</h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>Select your country and destination to see visa requirements</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', marginBottom: 20 }}>
                  {/* FROM */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>I am from</label>
                    <div onClick={() => { setShowFromDropdown(!showFromDropdown); setShowToDropdown(false) }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s' }}>
                      {fromCountry ? <><span style={{ fontSize: 24 }}>{fromCountry.flag}</span><span style={{ fontSize: 15, fontWeight: 600 }}>{fromCountry.name}</span></> : <span style={{ color: 'rgba(255,255,255,0.3)' }}>Select country...</span>}
                    </div>
                    {showFromDropdown && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#0a0f1a', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 12, padding: 8, zIndex: 100, maxHeight: 300, overflow: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                        <input type="text" value={searchFrom} onChange={e => setSearchFrom(e.target.value)} placeholder="Search country..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 13, outline: 'none', marginBottom: 8 }} />
                        {filteredFrom.map(c => (
                          <div key={c.code} onClick={() => { setSelectedFrom(c.code); setShowFromDropdown(false); setSearchFrom(''); setSelectedVisa(null) }} style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,210,255,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <span style={{ fontSize: 20 }}>{c.flag}</span>
                            <span style={{ fontSize: 13 }}>{c.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ARROW */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(99,210,255,0.1)', border: '2px solid rgba(99,210,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✈️</div>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>TRAVELING TO</span>
                  </div>

                  {/* TO */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Visiting</label>
                    <div onClick={() => { setShowToDropdown(!showToDropdown); setShowFromDropdown(false) }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,183,77,0.2)', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s' }}>
                      {toCountry ? <><span style={{ fontSize: 24 }}>{toCountry.flag}</span><span style={{ fontSize: 15, fontWeight: 600 }}>{toCountry.name}</span></> : <span style={{ color: 'rgba(255,255,255,0.3)' }}>Select country...</span>}
                    </div>
                    {showToDropdown && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#0a0f1a', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 12, padding: 8, zIndex: 100, maxHeight: 300, overflow: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                        <input type="text" value={searchTo} onChange={e => setSearchTo(e.target.value)} placeholder="Search country..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 13, outline: 'none', marginBottom: 8 }} />
                        {filteredTo.map(c => (
                          <div key={c.code} onClick={() => { setSelectedTo(c.code); setShowToDropdown(false); setSearchTo(''); setSelectedVisa(null) }} style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,183,77,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <span style={{ fontSize: 20 }}>{c.flag}</span>
                            <span style={{ fontSize: 13 }}>{c.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* RESULT - ORIGINAL */}
                {visaInfo && fromCountry && toCountry && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,210,255,0.1)', borderRadius: 16, padding: 20, animation: 'fadeIn 0.4s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                      <div style={{ fontSize: 64 }}>{toCountry.flag}</div>
                      <div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 4 }}>VISA REQUIREMENT</div>
                        <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Playfair Display',serif" }}>{visaInfo.visaName}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                          <span style={{ fontSize: 28 }}>{getVisaTypeIcon(visaInfo.visaType).icon}</span>
                          <span style={{ fontSize: 13, color: getVisaTypeIcon(visaInfo.visaType).color, fontWeight: 600 }}>{getVisaTypeIcon(visaInfo.visaType).label}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                      {[
                        { icon: '⏱️', label: 'Processing', value: visaInfo.processingTime, color: C },
                        { icon: '📅', label: 'Max Stay', value: visaInfo.maxStay, color: G },
                        { icon: '🔄', label: 'Entry', value: visaInfo.entryType, color: '#9c27b0' },
                        { icon: '💰', label: 'Fees', value: visaInfo.fees, color: '#51cf66' },
                      ].map((item, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}20`, borderRadius: 12, padding: 14, textAlign: 'center' }}>
                          <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{item.label}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* APPLY BUTTONS */}
                    {visaInfo.onlineApplyUrl && (
                      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                        <a href={visaInfo.onlineApplyUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '14px 24px', background: 'linear-gradient(135deg, #63d2ff, #2196f3)', border: 'none', borderRadius: 12, color: '#000814', fontSize: 14, fontWeight: 700, textAlign: 'center', textDecoration: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(99,210,255,0.3)' }}>
                          🌐 Apply Online Now
                        </a>
                        <button onClick={() => setShowDocModal(true)} style={{ padding: '14px 24px', background: 'rgba(255,183,77,0.1)', border: '1px solid rgba(255,183,77,0.3)', borderRadius: 12, color: G, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                          📋 Documents
                        </button>
                      </div>
                    )}

                    {/* ACCORDIONS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {/* DOCUMENTS */}
                      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
                        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setSelectedVisa(selectedVisa === visaInfo ? null : visaInfo)}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 18 }}>📄</span>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>Required Documents</span>
                          </div>
                          <span style={{ color: 'rgba(255,255,255,0.4)' }}>{selectedVisa === visaInfo ? '▲' : '▼'}</span>
                        </div>
                        {selectedVisa === visaInfo && (
                          <div style={{ padding: '0 16px 14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none' }}>
                              {visaInfo.documents.map((doc, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: 12.5, color: 'rgba(255,255,255,0.7)' }}>
                                  <span style={{ color: C, flexShrink: 0 }}>✓</span>
                                  {doc}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* REQUIREMENTS */}
                      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                          <span style={{ fontSize: 18 }}>📝</span>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>Requirements</span>
                        </div>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                          {visaInfo.requirements.map((req, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                              <span style={{ color: G }}>•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* TIPS */}
                      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                          <span style={{ fontSize: 18 }}>💡</span>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>Pro Tips</span>
                        </div>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                          {visaInfo.tips.map((tip, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                              <span style={{ color: '#51cf66' }}>★</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* EMBASSY INFO */}
                      {visaInfo.embassy && (
                        <div style={{ background: 'rgba(255,183,77,0.05)', border: '1px solid rgba(255,183,77,0.15)', borderRadius: 12, padding: 14 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <span style={{ fontSize: 18 }}>🏛️</span>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>Embassy in India</span>
                          </div>
                          <div style={{ display: 'grid', gap: 8 }}>
                            <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                              <span style={{ color: 'rgba(255,255,255,0.4)', width: 70 }}>Address:</span>
                              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{visaInfo.embassy.address}, {visaInfo.embassy.city}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                              <span style={{ color: 'rgba(255,255,255,0.4)', width: 70 }}>Phone:</span>
                              <span style={{ color: C }}>{visaInfo.embassy.phone}</span>
                            </div>
                            {visaInfo.embassy.website && (
                              <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                                <span style={{ color: 'rgba(255,255,255,0.4)', width: 70 }}>Website:</span>
                                <a href={visaInfo.embassy.website} target="_blank" rel="noopener noreferrer" style={{ color: C, textDecoration: 'none' }}>{visaInfo.embassy.website}</a>
                              </div>
                            )}
                            {visaInfo.embassy.hours && (
                              <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                                <span style={{ color: 'rgba(255,255,255,0.4)', width: 70 }}>Hours:</span>
                                <span style={{ color: 'rgba(255,255,255,0.8)' }}>{visaInfo.embassy.hours}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!selectedFrom && !selectedTo && (
                  <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🛂</div>
                    <div style={{ fontSize: 15 }}>Select your country and destination to see visa requirements</div>
                  </div>
                )}
              </div>

              {/* QUICK STATS - ORIGINAL */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { icon: '✅', label: 'Visa Free', value: '25+', color: '#51cf66' },
                  { icon: '✈️', label: 'On Arrival', value: '15+', color: '#ffc107' },
                  { icon: '💻', label: 'e-Visa', value: '35+', color: '#2196f3' },
                  { icon: '📝', label: 'Visa Required', value: '20+', color: '#ff9800' },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${s.color}16`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.3s', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = `${s.color}30` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = `${s.color}16` }}>
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: `${s.color}12`, border: `1px solid ${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.32)', marginTop: 3 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* POPULAR ROUTES - ORIGINAL */}
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🔥 Popular Routes from India</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 20 }}>
                {[
                  { from: '🇮🇳 India', to: '🇹🇭 Thailand', type: 'e-Visa', time: '3-5 days', color: '#ffc107' },
                  { from: '🇮🇳 India', to: '🇲🇾 Malaysia', type: 'On Arrival', time: 'Instant', color: '#9c27b0' },
                  { from: '🇮🇳 India', to: '🇸🇬 Singapore', type: 'e-Visa', time: '1-3 days', color: '#f44336' },
                  { from: '🇮🇳 India', to: '🇦🇪 UAE', type: 'On Arrival', time: 'Instant', color: '#4caf50' },
                  { from: '🇮🇳 India', to: '🇻🇳 Vietnam', type: 'e-Visa', time: '3-5 days', color: '#f9a825' },
                  { from: '🇮🇳 India', to: '🇹🇷 Turkey', type: 'e-Visa', time: '24 hours', color: '#f44336' },
                  { from: '🇮🇳 India', to: '🇯🇵 Japan', type: 'e-Visa', time: '5-10 days', color: '#e53935' },
                  { from: '🇮🇳 India', to: '🇰🇷 South Korea', type: 'ETA', time: '1-2 days', color: '#2196f3' },
                ].map((route, i) => (
                  <div key={i} onClick={() => { setSelectedFrom('IN'); setSelectedTo(route.to.includes('Thailand') ? 'TH' : route.to.includes('Malaysia') ? 'MY' : route.to.includes('Singapore') ? 'SG' : route.to.includes('UAE') ? 'AE' : route.to.includes('Vietnam') ? 'VN' : route.to.includes('Turkey') ? 'TR' : route.to.includes('Japan') ? 'JP' : 'KR') }} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 14, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = route.color; e.currentTarget.style.background = `${route.color}08` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 18 }}>{route.from}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
                      <span style={{ fontSize: 18 }}>{route.to}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: route.color, fontWeight: 600, background: `${route.color}15`, padding: '3px 8px', borderRadius: 100 }}>{route.type}</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>⏱️ {route.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* NEW: Profile Benefits Banner */}
              {profileBenefits.length > 0 && (
                <div style={{ background: 'rgba(81,207,102,0.08)', border: '1px solid rgba(81,207,102,0.25)', borderRadius: 12, padding: 14, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#51cf66', marginBottom: 10 }}>🎯 Profile Benefits Detected</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {profileBenefits.map((b, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12 }}>
                        <span style={{ fontSize: 16 }}>{b.badge.split(' ')[0]}</span>
                        <div><span style={{ fontWeight: 600, color: '#fff' }}>{b.badge.slice(2)}</span> - <span style={{ color: 'rgba(255,255,255,0.6)' }}>{b.benefit}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* NEW TAB 2: MULTI-STOP TRIP */}
          {activeTab === 'multi' && (
            <div style={{ background: 'linear-gradient(135deg,rgba(255,183,77,0.08) 0%,rgba(99,210,255,0.05) 100%)', border: '1px solid rgba(255,183,77,0.15)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, marginBottom: 6 }}>🛫 Multi-Stop Trip Planner</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Plan up to 8 destinations and see all visa requirements at once</p>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Your Origin Country</label>
                <select value={selectedFrom} onChange={e => setSelectedFrom(e.target.value)} style={{ width: '100%', maxWidth: 300, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none' }}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                </select>
              </div>

              {tripStops.map((stop, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, marginBottom: 12, position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${C}20`, border: `1px solid ${C}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: C }}>{idx + 1}</div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Stop {idx + 1}</span>
                    </div>
                    {tripStops.length > 1 && (
                      <button onClick={() => removeTripStop(idx)} style={{ background: 'rgba(255,59,48,0.1)', border: 'none', borderRadius: 6, padding: '4px 10px', color: '#ff6b6b', fontSize: 12, cursor: 'pointer' }}>Remove</button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Destination</label>
                      <select value={stop.countryCode} onChange={e => updateTripStop(idx, 'countryCode', e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 13, outline: 'none' }}>
                        <option value="">Select...</option>
                        {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Arrival</label>
                      <input type="date" value={stop.arrivalDate} onChange={e => updateTripStop(idx, 'arrivalDate', e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Departure</label>
                      <input type="date" value={stop.departureDate} onChange={e => updateTripStop(idx, 'departureDate', e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
                    </div>
                  </div>
                </div>
              ))}

              {tripStops.length < 8 && (
                <button onClick={addTripStop} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = C }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}>
                  + Add Another Stop (max 8)
                </button>
              )}

              {/* RESULTS */}
              {getMultiStopVisaInfo().length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📊 Visa Summary</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
                    <div style={{ background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>💰</div>
                      <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Playfair Display',serif", color: C }}>₹{getTotalVisaCost().toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Total Visa Cost (INR)</div>
                    </div>
                    <div style={{ background: 'rgba(255,183,77,0.1)', border: '1px solid rgba(255,183,77,0.2)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>🌍</div>
                      <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Playfair Display',serif", color: G }}>{getMultiStopVisaInfo().length}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Countries</div>
                    </div>
                  </div>

                  {getMultiStopVisaInfo().map((item, idx) => item && (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.info.color}30`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <span style={{ fontSize: 32 }}>{item.country.flag}</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{item.country.name}</div>
                          <div style={{ fontSize: 11, color: item.info.color }}>{getVisaTypeIcon(item.info.visaType).icon} {item.info.visaName}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: item.info.feesInr > 0 ? '#51cf66' : 'rgba(255,255,255,0.4)' }}>{item.info.fees}</div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{item.info.processingTime}</div>
                        </div>
                      </div>
                      {item.info.onlineApplyUrl && (
                        <a href={item.info.onlineApplyUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '8px 16px', background: 'linear-gradient(135deg, #63d2ff, #2196f3)', border: 'none', borderRadius: 8, color: '#000814', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                          Apply Now →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* NEW TAB 4: VISA TIMELINE CALCULATOR */}
          {activeTab === 'timeline' && (
            <div style={{ background: 'linear-gradient(135deg,rgba(156,39,176,0.08) 0%,rgba(99,210,255,0.05) 100%)', border: '1px solid rgba(156,39,176,0.15)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, marginBottom: 6 }}>📅 Visa Timeline Calculator</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Enter your travel dates to see when to apply for each visa</p>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Your Origin Country</label>
                <select value={selectedFrom} onChange={e => setSelectedFrom(e.target.value)} style={{ width: '100%', maxWidth: 300, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none' }}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Select Destination</label>
                <select value={selectedTo} onChange={e => setSelectedTo(e.target.value)} style={{ width: '100%', maxWidth: 300, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,183,77,0.2)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none' }}>
                  <option value="">Select country...</option>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                </select>
              </div>

              {visaInfo && fromCountry && toCountry && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(156,39,176,0.2)', borderRadius: 16, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                    <span style={{ fontSize: 48 }}>{toCountry.flag}</span>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 900, fontFamily: "'Playfair Display',serif" }}>{visaInfo.visaName}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{toCountry.name}</div>
                    </div>
                  </div>

                  {/* TIMELINE DATE INPUTS */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Travel Start Date</label>
                      <input type="date" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Travel End Date</label>
                      <input type="date" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none' }} />
                    </div>
                  </div>

                  {/* KEY DATES */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
                    <div style={{ background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.25)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>🚀</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>EARLIEST APPLY</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C }}>{visaInfo.processingDays > 0 ? `Today` : 'On Arrival'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,183,77,0.1)', border: '1px solid rgba(255,183,77,0.25)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>⚠️</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>APPLY BY</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: G }}>
                        {visaInfo.processingDays > 0 ? `${visaInfo.processingDays} days before travel` : 'Not Required'}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(156,39,176,0.1)', border: '1px solid rgba(156,39,176,0.25)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>VISA VALID FOR</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#9c27b0' }}>{visaInfo.validity}</div>
                    </div>
                  </div>

                  {/* PROCESSING TIME INFO */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: 18 }}>⏱️</span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>Processing Details</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Standard</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{visaInfo.processingTime}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Max Stay</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{visaInfo.maxStay}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Entry Type</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{visaInfo.entryType}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Fees</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#51cf66' }}>{visaInfo.fees}</div>
                      </div>
                    </div>
                  </div>

                  {/* GANTT STYLE TIMELINE */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      📊 Visa Application Timeline
                    </div>
                    
                    {/* TIMELINE BAR */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Application Window</span>
                        <span style={{ fontSize: 11, color: C }}>Today → Travel Date</span>
                      </div>
                      <div style={{ height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                        <div style={{ 
                          position: 'absolute', 
                          left: 0, 
                          top: 0, 
                          height: '100%', 
                          width: visaInfo.processingDays > 0 ? `${Math.max(10, 100 - (visaInfo.processingDays * 1.5))}%` : '100%',
                          background: visaInfo.processingDays > 7 ? 'linear-gradient(90deg, #51cf66, #4ade80)' : visaInfo.processingDays > 3 ? 'linear-gradient(90deg, #ffb74d, #ffc107)' : 'linear-gradient(90deg, #ff6b6b, #ff5252)',
                          borderRadius: 6,
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Apply Now</span>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Travel Date</span>
                      </div>
                    </div>

                    {/* PROCESSING PHASE */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Processing Phase</span>
                        <span style={{ fontSize: 11, color: G }}>{visaInfo.processingDays > 0 ? `${visaInfo.processingDays} days` : 'Instant'}</span>
                      </div>
                      <div style={{ height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                        <div style={{ 
                          position: 'absolute', 
                          left: '20%', 
                          top: 0, 
                          height: '100%', 
                          width: '60%', 
                          background: 'linear-gradient(90deg, #63d2ff, #2196f3)',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: 8, color: '#000814', fontWeight: 700 }}>PROCESSING</span>
                        </div>
                      </div>
                    </div>

                    {/* TRAVEL PHASE */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Travel Period</span>
                        <span style={{ fontSize: 11, color: '#9c27b0' }}>{visaInfo.maxStay}</span>
                      </div>
                      <div style={{ height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                        <div style={{ 
                          position: 'absolute', 
                          right: 0, 
                          top: 0, 
                          height: '100%', 
                          width: '80%', 
                          background: 'linear-gradient(90deg, #9c27b0, #e91e63)',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: 8
                        }}>
                          <span style={{ fontSize: 8, color: '#fff', fontWeight: 700 }}>TRAVEL</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* URGENCY BADGES */}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ 
                      padding: '10px 16px', 
                      background: visaInfo.processingDays > 7 ? 'rgba(81,207,102,0.1)' : visaInfo.processingDays > 3 ? 'rgba(255,183,77,0.1)' : 'rgba(255,107,107,0.1)', 
                      border: `1px solid ${visaInfo.processingDays > 7 ? 'rgba(81,207,102,0.3)' : visaInfo.processingDays > 3 ? 'rgba(255,183,77,0.3)' : 'rgba(255,107,107,0.3)'}`,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      <span style={{ fontSize: 18 }}>
                        {visaInfo.processingDays > 7 ? '🟢' : visaInfo.processingDays > 3 ? '🟡' : '🔴'}
                      </span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: visaInfo.processingDays > 7 ? '#51cf66' : visaInfo.processingDays > 3 ? '#ffb74d' : '#ff6b6b' }}>
                          {visaInfo.processingDays > 7 ? 'Comfortable Timeline' : visaInfo.processingDays > 3 ? 'Apply Soon' : 'Urgent Action Required'}
                        </div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                          {visaInfo.processingDays > 0 ? `${visaInfo.processingDays} days processing time` : 'No pre-visa needed'}
                        </div>
                      </div>
                    </div>

                    {visaInfo.onlineApplyUrl && (
                      <a href={visaInfo.onlineApplyUrl} target="_blank" rel="noopener noreferrer" style={{ 
                        padding: '10px 20px', 
                        background: 'linear-gradient(135deg, #63d2ff, #2196f3)', 
                        border: 'none', 
                        borderRadius: 10,
                        color: '#000814',
                        fontSize: 13,
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer'
                      }}>
                        🌐 Apply Now
                      </a>
                    )}
                  </div>

                  {/* TIPS FOR TIMING */}
                  <div style={{ marginTop: 24, background: 'rgba(255,183,77,0.05)', border: '1px solid rgba(255,183,77,0.15)', borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: 18 }}>💡</span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>Timing Tips</span>
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                      {visaInfo.tips.map((tip, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                          <span style={{ color: G }}>•</span>
                          {tip}
                        </li>
                      ))}
                      <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                        <span style={{ color: G }}>•</span>
                        Apply at least {visaInfo.processingDays > 0 ? visaInfo.processingDays + 7 : 3} days before your travel date
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {!selectedFrom && !selectedTo && (
                <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
                  <div style={{ fontSize: 15 }}>Select your origin and destination to calculate visa timeline</div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ALL COUNTRIES - ORIGINAL */}
          {activeTab === 'all' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
              {COUNTRIES.map((country, idx) => (
                <div key={country.code} onClick={() => { setSelectedTo(country.code); setActiveTab('search') }} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 16, transition: 'all 0.25s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = C; e.currentTarget.style.background = 'rgba(99,210,255,0.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 36 }}>{country.flag}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{country.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{country.continent}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DOCS MODAL - ORIGINAL */}
      {showDocModal && visaInfo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={() => setShowDocModal(false)}>
          <div style={{ background: '#05090f', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 20, padding: 24, maxWidth: 500, width: '100%', maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900 }}>📋 Required Documents</h3>
              <button onClick={() => setShowDocModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#fff', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {visaInfo.documents.map((doc, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${C}15`, border: `1px solid ${C}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: C, flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ fontSize: 13 }}>{doc}</span>
                </div>
              ))}
            </div>
            {visaInfo.onlineApplyUrl && (
              <a href={visaInfo.onlineApplyUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 20, padding: '14px 24px', background: 'linear-gradient(135deg, #63d2ff, #2196f3)', border: 'none', borderRadius: 12, color: '#000814', fontSize: 14, fontWeight: 700, textAlign: 'center', textDecoration: 'none', cursor: 'pointer' }}>
                🌐 Apply for Visa Now
              </a>
            )}
          </div>
        </div>
      )}

      {/* NEW: AI CHAT BOT */}
      <div style={{ position: 'fixed', bottom: 22, right: 22, zIndex: 1000 }}>
        {chatOpen && (
          <div style={{ position: 'absolute', bottom: 64, right: 0, width: 380, height: 520, background: '#05090f', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.65)', animation: 'slideUp 0.3s ease' }}>
            <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg,rgba(99,210,255,0.1),rgba(255,183,77,0.07))', borderBottom: '1px solid rgba(99,210,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🛂</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Visa Assistant</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80' }} />Online
                  </div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 7, width: 26, height: 26, cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {chatMessages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 7, alignItems: 'flex-end' }}>
                  {m.role === 'bot' && <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>🛂</div>}
                  <div style={{ maxWidth: '78%', padding: '9px 13px', borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px', background: m.role === 'user' ? 'linear-gradient(135deg,#ffb74d,#ff8f00)' : 'rgba(255,255,255,0.055)', border: m.role === 'bot' ? '1px solid rgba(99,210,255,0.1)' : 'none', fontSize: 12.5, color: m.role === 'user' ? '#000814' : 'rgba(255,255,255,0.82)', lineHeight: 1.55 }}>{m.text}</div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🛂</div>
                  <div style={{ padding: '9px 13px', background: 'rgba(255,255,255,0.055)', borderRadius: '14px 14px 14px 3px', border: '1px solid rgba(99,210,255,0.1)', display: 'flex', gap: 4, alignItems: 'center' }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#63d2ff', animation: 'bounce 1.2s ease infinite', animationDelay: `${i*0.2}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div style={{ padding: '8px 12px 12px', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                {QUICK_QUESTIONS.slice(0, 3).map((q, i) => (
                  <button key={i} onClick={() => sendChatMessage(q)} style={{ fontSize: 10, padding: '4px 10px', background: 'rgba(99,210,255,0.08)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 100, color: C, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>{q}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 11, padding: '5px 5px 5px 12px', alignItems: 'center' }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChatMessage(chatInput)} placeholder="Ask about visas..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 12.5, fontFamily: "'Outfit',sans-serif" }} />
                <button onClick={() => sendChatMessage(chatInput)} disabled={!chatInput.trim() || chatLoading} style={{ width: 30, height: 30, borderRadius: 7, background: chatInput.trim() ? 'linear-gradient(135deg,#63d2ff,#3bb8e8)' : 'rgba(255,255,255,0.05)', border: 'none', cursor: chatInput.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, transition: 'all 0.2s', flexShrink: 0 }}>→</button>
              </div>
            </div>
          </div>
        )}
        <button onClick={() => setChatOpen(!chatOpen)} style={{ width: 54, height: 54, borderRadius: '50%', background: chatOpen ? 'rgba(99,210,255,0.12)' : 'linear-gradient(135deg,#63d2ff,#3bb8e8)', border: chatOpen ? '1px solid rgba(99,210,255,0.3)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 6px 28px rgba(99,210,255,0.28)', transition: 'all 0.3s' }}>
          {chatOpen ? '✕' : '💬'}
        </button>
      </div>

      {/* NEW: PROFILE SLIDE-IN PANEL */}
      {showProfile && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }} onClick={() => setShowProfile(false)}>
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 400, background: '#05090f', borderLeft: '1px solid rgba(99,210,255,0.15)', padding: 24, overflow: 'auto', animation: 'slideIn 0.3s ease' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900 }}>👤 Traveler Profile</h3>
              <button onClick={() => setShowProfile(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#fff', fontSize: 16 }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Passport Type</label>
                <select value={profile.passportType} onChange={e => setProfile({ ...profile, passportType: e.target.value as any })} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none' }}>
                  <option value="regular">Regular Passport</option>
                  <option value="official">Official Passport</option>
                  <option value="diplomatic">Diplomatic Passport</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Nationality</label>
                <select value={profile.nationality} onChange={e => setProfile({ ...profile, nationality: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none' }}>
                  <option value="Indian">🇮🇳 Indian</option>
                  <option value="American">🇺🇸 American</option>
                  <option value="British">🇬🇧 British</option>
                  <option value="Other">🌍 Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>Existing Visas</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { key: 'hasUSVisa', label: '🇺🇸 Valid US Visa (B1/B2)', benefit: 'Visa-free to Philippines, easier UAE' },
                    { key: 'hasUKVisa', label: '🇬🇧 Valid UK Visa', benefit: 'Faster processing in some countries' },
                    { key: 'hasSchengenVisa', label: '🇪🇺 Valid Schengen Visa', benefit: 'Faster Schengen processing' },
                  ].map(item => (
                    <label key={item.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = C}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'}>
                      <input type="checkbox" checked={profile[item.key as keyof TravelerProfile] as boolean} onChange={e => setProfile({ ...profile, [item.key]: e.target.checked })} style={{ width: 18, height: 18, accentColor: C, marginTop: 2 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: '#51cf66', marginTop: 2 }}>→ {item.benefit}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Frequent Flyer Status</label>
                <select value={profile.frequentFlyer} onChange={e => setProfile({ ...profile, frequentFlyer: e.target.value as any })} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none' }}>
                  <option value="none">None</option>
                  <option value="silver">Silver ✈️</option>
                  <option value="gold">Gold ✈️</option>
                  <option value="platinum">Platinum ✈️</option>
                </select>
              </div>

              {profileBenefits.length > 0 && (
                <div style={{ background: 'rgba(81,207,102,0.08)', border: '1px solid rgba(81,207,102,0.25)', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#51cf66', marginBottom: 12 }}>🎯 Your Benefits</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {profileBenefits.map((b, i) => (
                      <div key={i} style={{ fontSize: 12 }}>
                        <span style={{ fontWeight: 600, color: '#fff' }}>{b.badge}</span>
                        <div style={{ color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{b.benefit}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => { localStorage.removeItem('roamind_visa_profile'); setProfile({ passportType: 'regular', visitedCountries: [], hasUSVisa: false, hasUKVisa: false, hasSchengenVisa: false, frequentFlyer: 'none', nationality: 'Indian' }) }} style={{ padding: '12px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 10, color: '#ff6b6b', fontSize: 13, cursor: 'pointer' }}>
                Reset Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #000814; }
        ::-webkit-scrollbar-thumb { background: rgba(99,210,255,0.2); border-radius: 10px; }
      `}</style>
    </div>
  )
}
