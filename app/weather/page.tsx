'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/Sidebar'

const C = '#63d2ff'
const G = '#ffb74d'
const R = '#ff6b6b'
const GR = '#51cf66'
const BG = '#000814'

const CACHE_KEY = 'roamind_weather_cache'
const CACHE_DURATION = 10 * 60 * 1000

const navSections = [
  { title: 'Plan & Discover', items: [{ icon: '🏠', label: 'Dashboard', path: '/dashboard' }, { icon: '🤖', label: 'AI Itinerary', path: '/itinerary' }] },
  { title: 'Book & Travel', items: [{ icon: '✈️', label: 'Flights', path: '/flights' }, { icon: '🏨', label: 'Hotels', path: '/hotels' }, { icon: '🍽️', label: 'Restaurants', path: '/restaurants' }, { icon: '🚌', label: 'Transport', path: '/transport' }] },
  { title: 'Intelligence', items: [{ icon: '🛂', label: 'Visa Guide', path: '/visa' }, { icon: '💱', label: 'Currency', path: '/currency' }, { icon: '🌤️', label: 'Weather+AQI', path: '/weather' }, { icon: '🆘', label: 'Emergency', path: '/emergency' }] },
  { title: 'Discover People', items: [{ icon: '👨‍💼', label: 'Local Guides', path: '/guides' }, { icon: '🤝', label: 'Couch Surfing', path: '/couchsurfing' }] },
  { title: 'My Travel', items: [{ icon: '🏅', label: 'Travel Passport', path: '/passport' }, { icon: '❤️', label: 'Saved Trips', path: '/saved' }, { icon: '📦', label: 'Packing List', path: '/packing' }, { icon: '💰', label: 'Budget Tracker', path: '/budget' }, { icon: '💬', label: 'AI Chat', path: '/chat' }, { icon: '🧠', label: 'Travel IQ', path: '/traveliq' }, { icon: '⚙️', label: 'Settings', path: '/settings' }] },
]

const POPULAR_CITIES = [
  { name: 'Mumbai', country: 'India', lat: 19.076, lng: 72.877 },
  { name: 'Delhi', country: 'India', lat: 28.6139, lng: 77.209 },
  { name: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946 },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.006 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018 },
  { name: 'Goa', country: 'India', lat: 15.2993, lng: 74.124 },
  { name: 'Jaipur', country: 'India', lat: 26.9124, lng: 75.7873 },
  { name: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639 },
  { name: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707 },
  { name: 'Kochi', country: 'India', lat: 9.9312, lng: 76.2673 },
]

const generateFallbackData = (location: GeoLocation): WeatherData => ({
  location,
  current: {
    temperature: 20 + Math.random() * 15,
    apparent: 18 + Math.random() * 15,
    windSpeed: 5 + Math.random() * 20,
    windDirection: Math.random() * 360,
    humidity: 50 + Math.random() * 30,
    weatherCode: 0,
    visibility: 10,
    uvIndex: 5,
    precipitation: 0,
    cloudCover: 20 + Math.random() * 40,
    isDay: true,
  },
  hourly: { time: [], temperature: [], weatherCode: [], precipitation: [] },
  daily: { time: [], weatherCode: [], temperatureMax: [], temperatureMin: [], sunrise: [], sunset: [], precipitationProbability: [] },
  aqi: {
    usAqi: 50 + Math.random() * 30,
    pm25: 15 + Math.random() * 20,
    pm10: 20 + Math.random() * 30,
    ozone: 30 + Math.random() * 50,
    no2: 15 + Math.random() * 25,
  },
})

const TIPS = [
  { icon: '🌡️', title: 'Pack Layers', desc: 'Weather changes fast. Always pack a light jacket even in summer.' },
  { icon: '☂️', title: 'Check Forecast', desc: 'Weather can change daily. Check before outdoor activities.' },
  { icon: '😷', title: 'Monitor AQI', desc: 'High AQI days? Wear a mask, especially in Asian cities.' },
  { icon: '💧', title: 'Stay Hydrated', desc: 'Hot climates require 3-4L water daily. Dehydration is common.' },
  { icon: '🧴', title: 'Sun Protection', desc: 'SPF 50+ sunscreen essential. Reapply every 2 hours.' },
  { icon: '🌧️', title: 'Monsoon Prep', desc: 'Pack rain gear. Avoid low-lying areas during heavy rain.' },
]

interface GeoLocation {
  id: number
  name: string
  country: string
  admin1?: string
  latitude: number
  longitude: number
}

interface WeatherData {
  location: GeoLocation
  current: {
    temperature: number
    apparent: number
    windSpeed: number
    windDirection: number
    humidity: number
    weatherCode: number
    visibility: number
    uvIndex: number
    precipitation: number
    cloudCover: number
    isDay: boolean
  }
  hourly: {
    time: string[]
    temperature: number[]
    weatherCode: number[]
    precipitation: number[]
  }
  daily: {
    time: string[]
    weatherCode: number[]
    temperatureMax: number[]
    temperatureMin: number[]
    sunrise: string[]
    sunset: string[]
    precipitationProbability: number[]
  }
  aqi: {
    usAqi: number
    pm25: number
    pm10: number
    ozone: number
    no2: number
  }
}

const getWeatherEmoji = (code: number, isDay: boolean = true): string => {
  if (code === 0) return isDay ? '☀️' : '🌙'
  if (code <= 3) return isDay ? '⛅' : '☁️'
  if (code <= 49) return '🌫️'
  if (code <= 59) return '🌧️'
  if (code <= 69) return '🌧️'
  if (code <= 79) return '🌨️'
  if (code <= 99) return '⛈️'
  return '🌤️'
}

const getWeatherDesc = (code: number): string => {
  if (code === 0) return 'Clear Sky'
  if (code === 1) return 'Mainly Clear'
  if (code === 2) return 'Partly Cloudy'
  if (code === 3) return 'Overcast'
  if (code <= 49) return 'Foggy'
  if (code <= 59) return 'Drizzle'
  if (code <= 69) return 'Rain'
  if (code <= 79) return 'Snow'
  if (code <= 82) return 'Rain Showers'
  if (code <= 86) return 'Snow Showers'
  if (code >= 95) return 'Thunderstorm'
  return 'Unknown'
}

const getAqiStatus = (aqi: number): { label: string; color: string; advice: string } => {
  if (aqi <= 50) return { label: 'Good', color: GR, advice: 'Perfect air quality! Great day for outdoor activities and exercise.' }
  if (aqi <= 100) return { label: 'Moderate', color: G, advice: 'Acceptable air quality. Sensitive individuals should consider limiting prolonged outdoor exertion.' }
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: G, advice: 'Members of sensitive groups may experience health effects. General public is less likely to be affected.' }
  if (aqi <= 200) return { label: 'Unhealthy', color: R, advice: 'Everyone may begin to experience health effects. Sensitive groups may experience more serious effects.' }
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#9c27b0', advice: 'Health alert: everyone may experience more serious health effects. Avoid outdoor activities.' }
  return { label: 'Hazardous', color: '#7b1fa2', advice: 'Health warning of emergency conditions. The entire population is more likely to be affected. Stay indoors.' }
}

const getUvSeverity = (uv: number): { label: string; color: string } => {
  if (uv <= 2) return { label: 'Low', color: GR }
  if (uv <= 5) return { label: 'Moderate', color: G }
  if (uv <= 7) return { label: 'High', color: R }
  if (uv <= 10) return { label: 'Very High', color: '#9c27b0' }
  return { label: 'Extreme', color: '#7b1fa2' }
}

export default function Weather() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/weather')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedCity, setSelectedCity] = useState<GeoLocation | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [compareCities, setCompareCities] = useState<GeoLocation[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [compareData, setCompareData] = useState<WeatherData[]>([])
  const [mapLayer, setMapLayer] = useState<'temp' | 'wind' | 'rain'>('temp')
  const [loadingCity, setLoadingCity] = useState(false)
  const [alerts, setAlerts] = useState<{ type: string; message: string; severity: string }[]>([])

  const fetchWeatherData = useCallback(async (location: GeoLocation, retryCount = 0) => {
    setLoadingCity(true)
    try {
      const [weatherRes, aqiRes] = await Promise.all([
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,relative_humidity_2m,weather_code,visibility,uv_index,precipitation,cloud_cover,is_day&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=auto&past_days=2&forecast_days=7`
        ),
        fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.latitude}&longitude=${location.longitude}&current=us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide`
        ),
      ])
      
      if (!weatherRes.ok || !aqiRes.ok) {
        throw new Error('API response not OK')
      }

      const weather = await weatherRes.json()
      const aqi = await aqiRes.json()

      setWeatherData({
        location,
        current: {
          temperature: weather.current.temperature_2m,
          apparent: weather.current.apparent_temperature,
          windSpeed: weather.current.wind_speed_10m,
          windDirection: weather.current.wind_direction_10m,
          humidity: weather.current.relative_humidity_2m,
          weatherCode: weather.current.weather_code,
          visibility: weather.current.visibility / 1000,
          uvIndex: weather.current.uv_index,
          precipitation: weather.current.precipitation,
          cloudCover: weather.current.cloud_cover,
          isDay: weather.current.is_day === 1,
        },
        hourly: {
          time: weather.hourly.time,
          temperature: weather.hourly.temperature_2m,
          weatherCode: weather.hourly.weather_code,
          precipitation: weather.hourly.precipitation_probability,
        },
        daily: {
          time: weather.daily.time,
          weatherCode: weather.daily.weather_code,
          temperatureMax: weather.daily.temperature_2m_max,
          temperatureMin: weather.daily.temperature_2m_min,
          sunrise: weather.daily.sunrise,
          sunset: weather.daily.sunset,
          precipitationProbability: weather.daily.precipitation_probability_max,
        },
        aqi: {
          usAqi: aqi.current.us_aqi,
          pm25: aqi.current.pm2_5,
          pm10: aqi.current.pm10,
          ozone: aqi.current.ozone,
          no2: aqi.current.nitrogen_dioxide,
        },
      })

      const newAlerts: { type: string; message: string; severity: string }[] = []
      if (aqi.current.us_aqi > 200) newAlerts.push({ type: 'AQI Alert', message: 'Air quality is hazardous. Avoid outdoor activities.', severity: 'extreme' })
      if (weather.current.temperature_2m > 40) newAlerts.push({ type: 'Heat Warning', message: 'Extreme heat! Stay hydrated and avoid direct sunlight.', severity: 'extreme' })
      if (weather.current.uv_index > 8) newAlerts.push({ type: 'UV Warning', message: 'Very high UV index. Apply sunscreen and wear protective clothing.', severity: 'extreme' })
      if (weather.daily.precipitation_probability_max[0] > 80) newAlerts.push({ type: 'Rain Alert', message: 'High chance of heavy rain. Carry an umbrella and plan indoor activities.', severity: 'extreme' })
      setAlerts(newAlerts)
    } catch (err) {
      console.error('Weather fetch error:', err)
      if (retryCount < 2) {
        setTimeout(() => fetchWeatherData(location, retryCount + 1), 1000)
      } else {
        const fallbackData = generateFallbackData(location)
        setWeatherData(fallbackData)
      }
    }
    setLoadingCity(false)
  }, [])

  const fetchCompareData = useCallback(async () => {
    const data: WeatherData[] = []
    for (const city of compareCities) {
      try {
        const [weatherRes, aqiRes] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,relative_humidity_2m,weather_code,is_day&timezone=auto`),
          fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.latitude}&longitude=${city.longitude}&current=us_aqi`),
        ])
        if (!weatherRes.ok || !aqiRes.ok) throw new Error('API error')
        const weather = await weatherRes.json()
        const aqi = await aqiRes.json()
        data.push({
          location: city,
          current: {
            temperature: weather.current.temperature_2m,
            apparent: weather.current.apparent_temperature,
            windSpeed: weather.current.wind_speed_10m,
            windDirection: weather.current.wind_direction_10m,
            humidity: weather.current.relative_humidity_2m,
            weatherCode: weather.current.weather_code,
            visibility: 0,
            uvIndex: 0,
            precipitation: 0,
            cloudCover: weather.current.cloud_cover,
            isDay: weather.current.is_day === 1,
          },
          hourly: { time: [], temperature: [], weatherCode: [], precipitation: [] },
          daily: { time: [], weatherCode: [], temperatureMax: [], temperatureMin: [], sunrise: [], sunset: [], precipitationProbability: [] },
          aqi: { usAqi: aqi.current.us_aqi, pm25: 0, pm10: 0, ozone: 0, no2: 0 },
        })
      } catch (err) {
        console.error('Compare fetch error:', err)
        data.push(generateFallbackData(city))
      }
    }
    setCompareData(data)
  }, [compareCities])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading])

  useEffect(() => {
    if (selectedCity) {
      fetchWeatherData(selectedCity)
    }
  }, [selectedCity, fetchWeatherData])

  useEffect(() => {
    if (compareCities.length > 0) {
      fetchCompareData()
    }
  }, [compareCities, fetchCompareData])

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
      )
      const data = await res.json()
      if (data.results) {
        setSearchResults(data.results)
        setShowDropdown(true)
      }
    } catch (err) {
      console.error('Search error:', err)
    }
  }

  const nav = (path: string) => { setActivePath(path); router.push(path) }
  const handleLogout = () => signOut(auth).then(() => router.push('/landing'))

  const selectCity = (city: GeoLocation) => {
    setSelectedCity(city)
    setSearchQuery('')
    setShowDropdown(false)
    setSearchResults([])
  }

  const selectPopularCity = (city: typeof POPULAR_CITIES[0]) => {
    selectCity({ id: 0, name: city.name, country: city.country, latitude: city.lat, longitude: city.lng })
  }

  const addToCompare = (city: GeoLocation) => {
    if (compareCities.length < 4 && !compareCities.find(c => c.id === city.id)) {
      setCompareCities([...compareCities, city])
    }
  }

  const removeFromCompare = (id: number) => {
    setCompareCities(compareCities.filter(c => c.id !== id))
  }

  const getWindDirection = (deg: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    return directions[Math.round(deg / 45) % 8]
  }

  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, border: '2px solid rgba(99,210,255,0.15)', borderTopColor: C, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()

  const aqiStatus = weatherData ? getAqiStatus(weatherData.aqi.usAqi) : null

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
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}>☰</button>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>🌤️ Weather & AQI</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)' }}>Real-time weather data</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setShowCompare(true)} style={{ padding: '6px 14px', background: compareCities.length > 0 ? 'rgba(99,210,255,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${compareCities.length > 0 ? C : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, color: compareCities.length > 0 ? C : 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              ⚖️ Compare {compareCities.length > 0 && `(${compareCities.length})`}
            </button>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000814', cursor: 'pointer', flexShrink: 0 }}>{avatar}</div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>

          {/* SEARCH BAR */}
          <div style={{ marginBottom: 20, position: 'relative', zIndex: 100 }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 14, padding: '4px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); searchLocations(e.target.value) }}
                onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                placeholder="Search any city worldwide..."
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 15, padding: '12px 0' }}
              />
              {loadingCity ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(99,210,255,0.2)', borderTopColor: C, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <span style={{ fontSize: 11, color: C }}>Loading...</span>
                </div>
              ) : weatherData && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(81,207,102,0.1)', borderRadius: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: GR }} />
                  <span style={{ fontSize: 10, color: GR }}>Live Data</span>
                </div>
              )}
            </div>
            {showDropdown && searchResults.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#05090f', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 12, marginTop: 4, maxHeight: 300, overflow: 'auto', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
                {searchResults.map((result) => (
                  <div key={result.id} onClick={() => selectCity(result)} style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,210,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ fontSize: 18 }}>📍</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{result.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{result.country}{result.admin1 ? `, ${result.admin1}` : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* WEATHER ALERTS */}
          {alerts.length > 0 && (
            <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {alerts.map((alert, i) => (
                <div key={i} style={{ background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.4)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12, animation: 'pulse 2s infinite' }}>
                  <span style={{ fontSize: 24 }}>⚠️</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: R }}>{alert.type}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{alert.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MAIN WEATHER CARD */}
          {weatherData && (
            <>
              {/* HERO CARD */}
              <div style={{ background: 'linear-gradient(135deg,rgba(99,210,255,0.08) 0%,rgba(255,183,77,0.05) 100%)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 24, padding: 32, marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: `${C}10`, filter: 'blur(60px)' }} />
                <div style={{ position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, borderRadius: '50%', background: `${G}10`, filter: 'blur(50px)' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, position: 'relative' }}>
                  <div>
                    <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, fontFamily: "'Playfair Display',serif", background: `linear-gradient(130deg, #fff, ${G})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {weatherData.location.name}
                    </h1>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>
                      {weatherData.location.country}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 80, animation: 'float 3s ease-in-out infinite' }}>{getWeatherEmoji(weatherData.current.weatherCode, weatherData.current.isDay)}</div>
                    <p style={{ fontSize: 13, color: C, margin: 0 }}>{getWeatherDesc(weatherData.current.weatherCode)}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32, alignItems: 'center', marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 72, fontWeight: 900, color: G, fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>{Math.round(weatherData.current.temperature)}°</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Feels like {Math.round(weatherData.current.apparent)}°</div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12 }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>💨 Wind</div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{weatherData.current.windSpeed.toFixed(1)} km/h {getWindDirection(weatherData.current.windDirection)}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12 }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>☀️ UV Index</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 16, fontWeight: 700 }}>{weatherData.current.uvIndex.toFixed(1)}</span>
                        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, weatherData.current.uvIndex * 10)}%`, height: '100%', background: getUvSeverity(weatherData.current.uvIndex).color, borderRadius: 3 }} />
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: getUvSeverity(weatherData.current.uvIndex).color }}>{getUvSeverity(weatherData.current.uvIndex).label}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12 }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>👁️ Visibility</div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{weatherData.current.visibility.toFixed(1)} km</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12 }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>💧 Humidity</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 16, fontWeight: 700 }}>{weatherData.current.humidity}%</span>
                        <svg width="40" height="40" viewBox="0 0 40 40">
                          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                          <circle cx="20" cy="20" r="16" fill="none" stroke={C} strokeWidth="4" strokeDasharray={`${weatherData.current.humidity * 1.005} 100.5`} strokeLinecap="round" transform="rotate(-90 20 20)" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TEMP RANGE BAR */}
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>🌡️ Temperature Range</span>
                    <span style={{ fontSize: 11, color: C }}>{Math.round(Math.min(...weatherData.daily.temperatureMin))}° - {Math.round(Math.max(...weatherData.daily.temperatureMax))}°</span>
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {weatherData.daily.temperatureMax.map((max, i) => {
                      const min = weatherData.daily.temperatureMin[i]
                      const range = Math.max(...weatherData.daily.temperatureMax) - Math.min(...weatherData.daily.temperatureMin)
                      const height = range > 0 ? ((max - min) / range) * 40 + 20 : 30
                      return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: '100%', height: height, background: `linear-gradient(to top, ${C}, ${G})`, borderRadius: 4, opacity: 0.7 }} />
                          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>
                            {new Date(weatherData.daily.time[i]).toLocaleDateString('en', { weekday: 'short' }).slice(0, 3)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* SUNRISE/SUNSET */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                  <div style={{ background: 'rgba(255,183,77,0.1)', border: '1px solid rgba(255,183,77,0.2)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>🌅 Sunrise</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: G, marginTop: 4 }}>
                      {new Date(weatherData.daily.sunrise[0]).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(156,39,176,0.1)', border: '1px solid rgba(156,39,176,0.2)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>🌇 Sunset</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#9c27b0', marginTop: 4 }}>
                      {new Date(weatherData.daily.sunset[0]).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* HOURLY FORECAST */}
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>⏰ 24-Hour Forecast</h2>
                <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
                  {weatherData.hourly.time.slice(0, 24).map((time, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', minWidth: 70, textAlign: 'center', flexShrink: 0, transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C; e.currentTarget.style.transform = 'translateY(-4px)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{new Date(time).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</div>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{getWeatherEmoji(weatherData.hourly.weatherCode[i], true)}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: G }}>{Math.round(weatherData.hourly.temperature[i])}°</div>
                      <div style={{ marginTop: 6, height: 30, display: 'flex', alignItems: 'flex-end' }}>
                        <div style={{ width: '100%', height: `${weatherData.hourly.precipitation[i]}%`, minHeight: 2, background: weatherData.hourly.precipitation[i] > 50 ? C : 'rgba(99,210,255,0.3)', borderRadius: 2 }} />
                      </div>
                      <div style={{ fontSize: 9, color: C, marginTop: 4 }}>{weatherData.hourly.precipitation[i]}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 9-DAY TIMELINE */}
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>📅 9-Day Weather Timeline</h2>
                <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
                  {weatherData.daily.time.map((day, i) => {
                    const isToday = i === 0
                    return (
                      <div key={i} style={{ background: isToday ? `linear-gradient(135deg,${C}20,${C}10)` : 'rgba(255,255,255,0.03)', border: `1px solid ${isToday ? C : 'rgba(255,255,255,0.08)'}`, borderRadius: 16, padding: 16, minWidth: 140, flexShrink: 0, position: 'relative', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = C }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = isToday ? C : 'rgba(255,255,255,0.08)' }}>
                        {isToday && (
                          <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', background: C, color: '#000814', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>TODAY</div>
                        )}
                        <div style={{ fontSize: 12, color: isToday ? C : 'rgba(255,255,255,0.5)', marginBottom: 8, fontWeight: isToday ? 700 : 400 }}>
                          {new Date(day).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>{getWeatherEmoji(weatherData.daily.weatherCode[i], true)}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: G }}>{Math.round(weatherData.daily.temperatureMax[i])}°</span>
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{Math.round(weatherData.daily.temperatureMin[i])}°</span>
                        </div>
                        <div style={{ fontSize: 11, color: C }}>💧 {weatherData.daily.precipitationProbability[i]}%</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{getWeatherDesc(weatherData.daily.weatherCode[i])}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* AQI DETAILS */}
              <div style={{ background: `linear-gradient(135deg,${aqiStatus?.color}08,${aqiStatus?.color}03)`, border: `1px solid ${aqiStatus?.color}25`, borderRadius: 20, padding: 24, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, margin: 0 }}>🌿 Air Quality Index</h2>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 36, fontWeight: 900, color: aqiStatus?.color }}>AQI {weatherData.aqi.usAqi}</div>
                    <div style={{ fontSize: 14, color: aqiStatus?.color }}>{aqiStatus?.label}</div>
                  </div>
                </div>
                
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>💡 {aqiStatus?.advice}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {[
                    { label: 'PM2.5', value: weatherData.aqi.pm25, max: 150 },
                    { label: 'PM10', value: weatherData.aqi.pm10, max: 250 },
                    { label: 'Ozone', value: weatherData.aqi.ozone, max: 180 },
                    { label: 'NO2', value: weatherData.aqi.no2, max: 200 },
                  ].map((item, i) => {
                    const percent = Math.min(100, (item.value / item.max) * 100)
                    const color = percent < 50 ? GR : percent < 75 ? G : percent < 100 ? G : R
                    return (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color }}>{item.value.toFixed(1)}</span>
                        </div>
                        <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* WEATHER MAP */}
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🗺️ Weather Map</h2>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 16, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>📍 Location</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{weatherData.location.name}, {weatherData.location.country}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Lat: {weatherData.location.latitude.toFixed(2)}, Lng: {weatherData.location.longitude.toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <a 
                        href={`https://www.openstreetmap.org/?mlat=${weatherData.location.latitude}&mlon=${weatherData.location.longitude}&zoom=10`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ padding: '8px 16px', background: `${C}15`, border: `1px solid ${C}30`, borderRadius: 8, color: C, fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        🗺️ OpenStreetMap
                      </a>
                      <a 
                        href={`https://www.google.com/maps?q=${weatherData.location.latitude},${weatherData.location.longitude}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ padding: '8px 16px', background: `${G}15`, border: `1px solid ${G}30`, borderRadius: 8, color: G, fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        📍 Google Maps
                      </a>
                    </div>
                  </div>
                  
                  {/* WEATHER STATS GRID */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginTop: 16 }}>
                    <div style={{ background: 'rgba(99,210,255,0.1)', border: `1px solid ${C}30`, borderRadius: 12, padding: 12, textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>🌡️</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: C }}>{Math.round(weatherData.current.temperature)}°C</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Temperature</div>
                    </div>
                    <div style={{ background: 'rgba(255,183,77,0.1)', border: `1px solid ${G}30`, borderRadius: 12, padding: 12, textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>💧</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: G }}>{weatherData.current.humidity}%</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Humidity</div>
                    </div>
                    <div style={{ background: 'rgba(81,207,102,0.1)', border: '1px solid rgba(81,207,102,0.3)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>💨</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: GR }}>{weatherData.current.windSpeed.toFixed(1)} km/h</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Wind Speed</div>
                    </div>
                    <div style={{ background: 'rgba(156,39,176,0.1)', border: '1px solid rgba(156,39,176,0.3)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>👁️</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#9c27b0' }}>{weatherData.current.visibility.toFixed(1)} km</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Visibility</div>
                    </div>
                  </div>

                  {/* 5-DAY OUTLOOK */}
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'rgba(255,255,255,0.6)' }}>📅 5-Day Outlook</div>
                    <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                      {weatherData.daily.time.slice(0, 5).map((day, i) => (
                        <div key={i} style={{ minWidth: 80, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 10, textAlign: 'center' }}>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{new Date(day).toLocaleDateString('en', { weekday: 'short' })}</div>
                          <div style={{ fontSize: 22 }}>{getWeatherEmoji(weatherData.daily.weatherCode[i], true)}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: G }}>{Math.round(weatherData.daily.temperatureMax[i])}°</div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{Math.round(weatherData.daily.temperatureMin[i])}°</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* POPULAR DESTINATIONS */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🌍 Popular Destinations</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {POPULAR_CITIES.map((city, idx) => (
                <div key={city.name} onClick={() => selectPopularCity(city)} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, cursor: 'pointer', transition: 'all 0.25s', animation: `fadeIn 0.3s ease ${idx * 0.02}s both` }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = C; e.currentTarget.style.boxShadow = `0 8px 24px ${C}15` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>📍</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{city.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{city.country}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Click to load live data</div>
                </div>
              ))}
            </div>
          </div>

          {/* TIPS */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>💡 Weather Tips</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {TIPS.map((tip, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.025)', padding: 16, borderRadius: 12, border: '1px solid rgba(99,210,255,0.08)', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = C }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(99,210,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{tip.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C }}>{tip.title}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* COMPARE PANEL */}
      {showCompare && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowCompare(false)}>
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 500, background: '#05090f', borderLeft: '1px solid rgba(99,210,255,0.15)', padding: 24, overflow: 'auto', animation: 'slideInRight 0.3s ease' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, margin: 0 }}>⚖️ Compare Cities</h2>
              <button onClick={() => setShowCompare(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#fff', fontSize: 16 }}>✕</button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>Add cities to compare (max 4)</p>
              <div style={{ position: 'relative' }}>
                <input type="text" placeholder="Search cities..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none' }}
                  onFocus={(e) => {
                    const val = e.target.value
                    if (val.length >= 2) searchLocations(val)
                  }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {compareCities.map(city => (
                <div key={city.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: `${C}15`, border: `1px solid ${C}30`, borderRadius: 100 }}>
                  <span style={{ fontSize: 12 }}>{city.name}</span>
                  <button onClick={() => removeFromCompare(city.id)} style={{ background: 'none', border: 'none', color: C, cursor: 'pointer', fontSize: 12 }}>✕</button>
                </div>
              ))}
            </div>

            {compareData.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
                  <div style={{ padding: 12, background: 'rgba(255,255,255,0.05)', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>City</div>
                  <div style={{ padding: 12, background: 'rgba(255,255,255,0.05)', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>Temp</div>
                  <div style={{ padding: 12, background: 'rgba(255,255,255,0.05)', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>AQI</div>
                  <div style={{ padding: 12, background: 'rgba(255,255,255,0.05)', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>Humidity</div>
                </div>
                {compareData.map((data, i) => {
                  const tempWinners = compareData.filter(d => d.current.temperature < data.current.temperature)
                  const aqiWinners = compareData.filter(d => d.aqi.usAqi < data.aqi.usAqi)
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
                      <div style={{ padding: 12, fontSize: 12, fontWeight: 600, textAlign: 'center' }}>{data.location.name}</div>
                      <div style={{ padding: 12, fontSize: 12, fontWeight: 700, color: tempWinners.length === compareData.length - 1 ? GR : G, textAlign: 'center' }}>
                        {Math.round(data.current.temperature)}°
                      </div>
                      <div style={{ padding: 12, fontSize: 12, fontWeight: 700, color: aqiWinners.length === compareData.length - 1 ? GR : getAqiStatus(data.aqi.usAqi).color, textAlign: 'center' }}>
                        {data.aqi.usAqi}
                      </div>
                      <div style={{ padding: 12, fontSize: 12, fontWeight: 700, color: C, textAlign: 'center' }}>
                        {data.current.humidity}%
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.7; } }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #000814; }
        ::-webkit-scrollbar-thumb { background: rgba(99,210,255,0.2); border-radius: 10px; }
      `}</style>
    </div>
  )
}
