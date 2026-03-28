import { Restaurant } from './types'

export const CITIES_INDIA = [
  { id: 'mumbai', name: 'Mumbai', sub: 'Maharashtra', emoji: '🇮🇳', type: 'City' },
  { id: 'delhi', name: 'Delhi / New Delhi', sub: 'India', emoji: '🇮🇳', type: 'City' },
  { id: 'bangalore', name: 'Bangalore', sub: 'Karnataka', emoji: '🇮🇳', type: 'City' },
  { id: 'chennai', name: 'Chennai', sub: 'Tamil Nadu', emoji: '🇮🇳', type: 'City' },
  { id: 'kolkata', name: 'Kolkata', sub: 'West Bengal', emoji: '🇮🇳', type: 'City' },
  { id: 'hyderabad', name: 'Hyderabad', sub: 'Telangana', emoji: '🇮🇳', type: 'City' },
  { id: 'pune', name: 'Pune', sub: 'Maharashtra', emoji: '🇮🇳', type: 'City' },
  { id: 'ahmedabad', name: 'Ahmedabad', sub: 'Gujarat', emoji: '🇮🇳', type: 'City' },
  { id: 'jaipur', name: 'Jaipur', sub: 'Rajasthan', emoji: '🇮🇳', type: 'City' },
  { id: 'lucknow', name: 'Lucknow', sub: 'Uttar Pradesh', emoji: '🇮🇳', type: 'City' },
  { id: 'goa', name: 'Goa', sub: 'Beach Paradise', emoji: '🇮🇳', type: 'State' },
  { id: 'udaipur', name: 'Udaipur', sub: 'Rajasthan', emoji: '🇮🇳', type: 'City' },
  { id: 'amritsar', name: 'Amritsar', sub: 'Punjab', emoji: '🇮🇳', type: 'City' },
  { id: 'kochi', name: 'Kochi / Cochin', sub: 'Kerala', emoji: '🇮🇳', type: 'City' },
  { id: 'varanasi', name: 'Varanasi', sub: 'Uttar Pradesh', emoji: '🇮🇳', type: 'City' },
  { id: 'chandigarh', name: 'Chandigarh', sub: 'Punjab/Haryana', emoji: '🇮🇳', type: 'City' },
  { id: 'agra', name: 'Agra', sub: 'Uttar Pradesh', emoji: '🇮🇳', type: 'City' },
  { id: 'jodhpur', name: 'Jodhpur', sub: 'Rajasthan', emoji: '🇮🇳', type: 'City' },
  { id: 'mysore', name: 'Mysore', sub: 'Karnataka', emoji: '🇮🇳', type: 'City' },
  { id: 'vadodara', name: 'Vadodara', sub: 'Gujarat', emoji: '🇮🇳', type: 'City' },
  { id: 'surat', name: 'Surat', sub: 'Gujarat', emoji: '🇮🇳', type: 'City' },
  { id: 'indore', name: 'Indore', sub: 'Madhya Pradesh', emoji: '🇮🇳', type: 'City' },
  { id: 'bhopal', name: 'Bhopal', sub: 'Madhya Pradesh', emoji: '🇮🇳', type: 'City' },
  { id: 'patna', name: 'Patna', sub: 'Bihar', emoji: '🇮🇳', type: 'City' },
  { id: 'guwahati', name: 'Guwahati', sub: 'Assam', emoji: '🇮🇳', type: 'City' },
  { id: 'bhubaneswar', name: 'Bhubaneswar', sub: 'Odisha', emoji: '🇮🇳', type: 'City' },
  { id: 'dehradun', name: 'Dehradun', sub: 'Uttarakhand', emoji: '🇮🇳', type: 'City' },
  { id: 'shimla', name: 'Shimla', sub: 'Himachal Pradesh', emoji: '🇮🇳', type: 'City' },
  { id: 'srinagar', name: 'Srinagar', sub: 'Jammu & Kashmir', emoji: '🇮🇳', type: 'City' },
  { id: 'panaji', name: 'Panaji / Goa', sub: 'Goa', emoji: '🇮🇳', type: 'City' },
  { id: 'nagpur', name: 'Nagpur', sub: 'Maharashtra', emoji: '🇮🇳', type: 'City' },
  { id: 'kanpur', name: 'Kanpur', sub: 'Uttar Pradesh', emoji: '🇮🇳', type: 'City' },
  { id: 'coimbatore', name: 'Coimbatore', sub: 'Tamil Nadu', emoji: '🇮🇳', type: 'City' },
  { id: 'madurai', name: 'Madurai', sub: 'Tamil Nadu', emoji: '🇮🇳', type: 'City' },
  { id: 'visakhapatnam', name: 'Visakhapatnam', sub: 'Andhra Pradesh', emoji: '🇮🇳', type: 'City' },
  { id: 'raipur', name: 'Raipur', sub: 'Chhattisgarh', emoji: '🇮🇳', type: 'City' },
  { id: 'ludhiana', name: 'Ludhiana', sub: 'Punjab', emoji: '🇮🇳', type: 'City' },
  { id: 'jalandhar', name: 'Jalandhar', sub: 'Punjab', emoji: '🇮🇳', type: 'City' },
  { id: 'mangalore', name: 'Mangalore', sub: 'Karnataka', emoji: '🇮🇳', type: 'City' },
  { id: 'tirupati', name: 'Tirupati', sub: 'Andhra Pradesh', emoji: '🇮🇳', type: 'City' },
  { id: 'ranchi', name: 'Ranchi', sub: 'Jharkhand', emoji: '🇮🇳', type: 'City' },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', sub: 'Kerala', emoji: '🇮🇳', type: 'City' },
  { id: 'jamshedpur', name: 'Jamshedpur', sub: 'Jharkhand', emoji: '🇮🇳', type: 'City' },
  { id: 'cuttack', name: 'Cuttack', sub: 'Odisha', emoji: '🇮🇳', type: 'City' },
  { id: 'salem', name: 'Salem', sub: 'Tamil Nadu', emoji: '🇮🇳', type: 'City' },
  { id: 'tiruchirappalli', name: 'Tiruchirappalli', sub: 'Tamil Nadu', emoji: '🇮🇳', type: 'City' },
  { id: 'bellary', name: 'Bellary / Hampi', sub: 'Karnataka', emoji: '🇮🇳', type: 'City' },
  { id: 'jammu', name: 'Jammu', sub: 'Jammu & Kashmir', emoji: '🇮🇳', type: 'City' },
  { id: 'gulbarga', name: 'Gulbarga', sub: 'Karnataka', emoji: '🇮🇳', type: 'City' },
  { id: 'kolhapur', name: 'Kolhapur', sub: 'Maharashtra', emoji: '🇮🇳', type: 'City' },
  { id: 'nashik', name: 'Nashik', sub: 'Maharashtra', emoji: '🇮🇳', type: 'City' },
]

export const CITIES_INTERNATIONAL = [
  { id: 'paris', name: 'Paris', sub: 'France', emoji: '🇫🇷', type: 'City' },
  { id: 'london', name: 'London', sub: 'United Kingdom', emoji: '🇬🇧', type: 'City' },
  { id: 'new_york', name: 'New York City', sub: 'USA', emoji: '🇺🇸', type: 'City' },
  { id: 'tokyo', name: 'Tokyo', sub: 'Japan', emoji: '🇯🇵', type: 'City' },
  { id: 'rome', name: 'Rome', sub: 'Italy', emoji: '🇮🇹', type: 'City' },
  { id: 'dubai', name: 'Dubai', sub: 'UAE', emoji: '🇦🇪', type: 'City' },
  { id: 'bangkok', name: 'Bangkok', sub: 'Thailand', emoji: '🇹🇭', type: 'City' },
  { id: 'singapore', name: 'Singapore', sub: 'Singapore', emoji: '🇸🇬', type: 'City' },
  { id: 'barcelona', name: 'Barcelona', sub: 'Spain', emoji: '🇪🇸', type: 'City' },
  { id: 'istanbul', name: 'Istanbul', sub: 'Turkey', emoji: '🇹🇷', type: 'City' },
  { id: 'los_angeles', name: 'Los Angeles', sub: 'USA', emoji: '🇺🇸', type: 'City' },
  { id: 'milan', name: 'Milan', sub: 'Italy', emoji: '🇮🇹', type: 'City' },
  { id: 'amsterdam', name: 'Amsterdam', sub: 'Netherlands', emoji: '🇳🇱', type: 'City' },
  { id: 'vienna', name: 'Vienna', sub: 'Austria', emoji: '🇦🇹', type: 'City' },
  { id: 'prague', name: 'Prague', sub: 'Czech Republic', emoji: '🇨🇿', type: 'City' },
  { id: 'hong_kong', name: 'Hong Kong', sub: 'China', emoji: '🇭🇰', type: 'City' },
  { id: 'sydney', name: 'Sydney', sub: 'Australia', emoji: '🇦🇺', type: 'City' },
  { id: 'melbourne', name: 'Melbourne', sub: 'Australia', emoji: '🇦🇺', type: 'City' },
  { id: 'berlin', name: 'Berlin', sub: 'Germany', emoji: '🇩🇪', type: 'City' },
  { id: 'bali', name: 'Bali', sub: 'Indonesia', emoji: '🇮🇩', type: 'Island' },
  { id: 'seoul', name: 'Seoul', sub: 'South Korea', emoji: '🇰🇷', type: 'City' },
  { id: 'osaka', name: 'Osaka', sub: 'Japan', emoji: '🇯🇵', type: 'City' },
  { id: 'kyoto', name: 'Kyoto', sub: 'Japan', emoji: '🇯🇵', type: 'City' },
  { id: 'beijing', name: 'Beijing', sub: 'China', emoji: '🇨🇳', type: 'City' },
  { id: 'shanghai', name: 'Shanghai', sub: 'China', emoji: '🇨🇳', type: 'City' },
  { id: 'mexico_city', name: 'Mexico City', sub: 'Mexico', emoji: '🇲🇽', type: 'City' },
  { id: 'rio_de_janeiro', name: 'Rio de Janeiro', sub: 'Brazil', emoji: '🇧🇷', type: 'City' },
  { id: 'sao_paulo', name: 'Sao Paulo', sub: 'Brazil', emoji: '🇧🇷', type: 'City' },
  { id: 'cape_town', name: 'Cape Town', sub: 'South Africa', emoji: '🇿🇦', type: 'City' },
  { id: 'marrakech', name: 'Marrakech', sub: 'Morocco', emoji: '🇲🇦', type: 'City' },
  { id: 'cairo', name: 'Cairo', sub: 'Egypt', emoji: '🇪🇬', type: 'City' },
  { id: 'lisbon', name: 'Lisbon', sub: 'Portugal', emoji: '🇵🇹', type: 'City' },
  { id: 'madrid', name: 'Madrid', sub: 'Spain', emoji: '🇪🇸', type: 'City' },
  { id: 'copenhagen', name: 'Copenhagen', sub: 'Denmark', emoji: '🇩🇰', type: 'City' },
  { id: 'stockholm', name: 'Stockholm', sub: 'Sweden', emoji: '🇸🇪', type: 'City' },
  { id: 'budapest', name: 'Budapest', sub: 'Hungary', emoji: '🇭🇺', type: 'City' },
  { id: 'athens', name: 'Athens', sub: 'Greece', emoji: '🇬🇷', type: 'City' },
  { id: 'santorini', name: 'Santorini', sub: 'Greece', emoji: '🇬🇷', type: 'Island' },
  { id: 'dublin', name: 'Dublin', sub: 'Ireland', emoji: '🇮🇪', type: 'City' },
  { id: 'edinburgh', name: 'Edinburgh', sub: 'Scotland', emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', type: 'City' },
  { id: 'san_francisco', name: 'San Francisco', sub: 'USA', emoji: '🇺🇸', type: 'City' },
  { id: 'chicago', name: 'Chicago', sub: 'USA', emoji: '🇺🇸', type: 'City' },
  { id: 'las_vegas', name: 'Las Vegas', sub: 'USA', emoji: '🇺🇸', type: 'City' },
  { id: 'toronto', name: 'Toronto', sub: 'Canada', emoji: '🇨🇦', type: 'City' },
  { id: 'vancouver', name: 'Vancouver', sub: 'Canada', emoji: '🇨🇦', type: 'City' },
  { id: 'montreal', name: 'Montreal', sub: 'Canada', emoji: '🇨🇦', type: 'City' },
  { id: 'lima', name: 'Lima', sub: 'Peru', emoji: '🇵🇪', type: 'City' },
  { id: 'buenos_aires', name: 'Buenos Aires', sub: 'Argentina', emoji: '🇦🇷', type: 'City' },
  { id: 'miami', name: 'Miami', sub: 'USA', emoji: '🇺🇸', type: 'City' },
  { id: 'amman', name: 'Amman', sub: 'Jordan', emoji: '🇯🇴', type: 'City' },
  { id: 'tel_aviv', name: 'Tel Aviv', sub: 'Israel', emoji: '🇮🇱', type: 'City' },
  { id: 'krakow', name: 'Krakow', sub: 'Poland', emoji: '🇵🇱', type: 'City' },
]

export const ALL_CITIES = [...CITIES_INDIA, ...CITIES_INTERNATIONAL]

export const RESTAURANTS_BY_CITY: Record<string, Restaurant[]> = {
  // MUMBAI
  mumbai: [
    { id: 'trishna', name: 'Trishna', location: 'Fort, Mumbai', cuisine: 'Seafood · Coastal Indian', cuisineType: 'indian', diet: ['nonveg'], budget: 'upscale', rating: 4.8, price: '₹₹₹', emoji: '🦀', mustTry: 'Butter Garlic Crab', desc: 'Legendary Mumbai seafood institution since 1970s.', michelin: false, book: 'https://www.zomato.com/mumbai/trishna-fort', gmapUrl: 'https://maps.google.com/?q=Trishna+Restaurant+Mumbai+Fort' },
    { id: 'bademiya', name: 'Bade Miya', location: 'Colaba, Mumbai', cuisine: 'Street Food · Kebabs', cuisineType: 'indian', diet: ['nonveg', 'halal'], budget: 'cheap', rating: 4.6, price: '₹', emoji: '🍢', mustTry: 'Seekh Kebab Roll', desc: 'Legendary Colaba street stall. Best late-night kebabs.', michelin: false, book: 'https://www.zomato.com/mumbai/bademiya-colaba', gmapUrl: 'https://maps.google.com/?q=Bade+Miya+Colaba+Mumbai' },
    { id: 'leopold', name: 'Leopold Cafe', location: 'Colaba, Mumbai', cuisine: 'Continental · Indian', cuisineType: 'multi', diet: ['multi'], budget: 'mid', rating: 4.5, price: '₹₹', emoji: '☕', mustTry: 'Chicken Tikka Pau', desc: 'Mumbai icon since 1871.', michelin: false, book: 'https://www.zomato.com/mumbai/leopold-cafe-and-bar-colaba', gmapUrl: 'https://maps.google.com/?q=Leopold+Cafe+Colaba+Mumbai' },
    { id: 'oh_holy_cow', name: 'Oh! Holy Cow', location: 'Bandra West, Mumbai', cuisine: 'Burgers · American', cuisineType: 'american', diet: ['veg'], budget: 'mid', rating: 4.7, price: '₹₹', emoji: '🍔', mustTry: 'Smash Burger', desc: 'Bandra\'s favorite vegetarian burger joint.', michelin: false, book: 'https://www.zomato.com/mumbai/oh-holy-cow-bandra-west', gmapUrl: 'https://maps.google.com/?q=Oh+Holy+Cow+Bandra+Mumbai' },
    { id: 'southern', name: 'Southern Spice', location: 'Juhu, Mumbai', cuisine: 'South Indian', cuisineType: 'indian', diet: ['veg'], budget: 'mid', rating: 4.6, price: '₹₹', emoji: '🍛', mustTry: 'Chettinad Chicken', desc: 'Authentic South Indian flavors.', michelin: false, book: 'https://www.zomato.com/mumbai/southern-spice-juhu', gmapUrl: 'https://maps.google.com/?q=Southern+Spice+Juhu+Mumbai' },
    { id: 'koh', name: 'Koh', location: 'Marine Drive, Mumbai', cuisine: 'Thai', cuisineType: 'thai', diet: ['nonveg'], budget: 'upscale', rating: 4.7, price: '₹₹₹', emoji: '🥘', mustTry: 'Tom Yum Soup', desc: 'Best Thai food in Mumbai with sea view.', michelin: false, book: 'https://www.zomato.com/mumbai/koh-marine-drive', gmapUrl: 'https://maps.google.com/?q=Koh+Restaurant+Marine+Drive+Mumbai' },
    { id: 'bagdhani', name: 'Bagdhani Fine Dine', location: 'Dadar, Mumbai', cuisine: 'Maharashtrian', cuisineType: 'indian', diet: ['veg'], budget: 'cheap', rating: 4.5, price: '₹', emoji: '🥘', mustTry: 'Misal Pav', desc: 'Best Misal Pav in Mumbai since 1960.', michelin: false, book: 'https://www.zomato.com/mumbai/bagdhani-fine-dine-dadar', gmapUrl: 'https://maps.google.com/?q=Bagdhani+Fine+Dine+Dadar+Mumbai' },
    { id: 'malt_berry', name: 'Malt & Berry', location: 'Powai, Mumbai', cuisine: 'Continental · Cafe', cuisineType: 'cafe', diet: ['veg'], budget: 'mid', rating: 4.8, price: '₹₹', emoji: '🧁', mustTry: 'Cheesecake', desc: 'Instagram-famous cafe with amazing desserts.', michelin: false, book: 'https://www.zomato.com/mumbai/malt-berry-powai', gmapUrl: 'https://maps.google.com/?q=Malt+And+Berry+Powai+Mumbai' },
    { id: 'bastian', name: 'Bastian', location: 'Bandra West, Mumbai', cuisine: 'Seafood · Asian', cuisineType: 'seafood', diet: ['nonveg'], budget: 'upscale', rating: 4.9, price: '₹₹₹', emoji: '🦐', mustTry: 'Lobster', desc: 'Celebrity restaurant. Best lobster in town.', michelin: false, book: 'https://www.zomato.com/mumbai/bastian-bandra-west', gmapUrl: 'https://maps.google.com/?q=Bastian+Bandra+Mumbai' },
    { id: 'saa', name: 'Saa', location: 'Bandra West, Mumbai', cuisine: 'Modern Indian', cuisineType: 'indian', diet: ['multi'], budget: 'upscale', rating: 4.8, price: '₹₹₹', emoji: '✨', mustTry: 'Tasting Menu', desc: 'Michelin-guide restaurant. Modern Indian fine dining.', michelin: true, stars: '⭐', book: 'https://www.zomato.com/mumbai/saa-bandra-west', gmapUrl: 'https://maps.google.com/?q=Saa+Restaurant+Bandra+Mumbai' },
    { id: 'kyan', name: 'Kyan', location: 'Worli, Mumbai', cuisine: 'Modern European', cuisineType: 'european', diet: ['multi'], budget: 'upscale', rating: 4.7, price: '₹₹₹', emoji: '🌊', mustTry: 'Seafood Platter', desc: 'Waterfront dining with stunning views.', michelin: false, book: 'https://www.zomato.com/mumbai/kyan-worli', gmapUrl: 'https://maps.google.com/?q=Kyan+Restaurant+Worli+Mumbai' },
    { id: 'p Bellevue', name: 'P Bellevue', location: 'Bandra West, Mumbai', cuisine: 'Continental · Bar', cuisineType: 'multi', diet: ['multi'], budget: 'mid', rating: 4.6, price: '₹₹', emoji: '🍷', mustTry: 'Cocktails', desc: 'Bandra favorite with great rooftop views.', michelin: false, book: 'https://www.zomato.com/mumbai/p-bellevue-bandra-west', gmapUrl: 'https://maps.google.com/?q=P+Bellevue+Bandra+Mumbai' },
    { id: 'copper_rose', name: 'Copper Rose', location: 'Kurla West, Mumbai', cuisine: 'Continental · Cafe', cuisineType: 'cafe', diet: ['veg'], budget: 'mid', rating: 4.7, price: '₹₹', emoji: '🌹', mustTry: 'Pasta', desc: 'Beautiful cafe with great brunch.', michelin: false, book: 'https://www.zomato.com/mumbai/copper-rose-kurla-west', gmapUrl: 'https://maps.google.com/?q=Copper+Rose+Kurla+Mumbai' },
    { id: 'prithvi', name: 'Prithvi Cafe', location: 'Juhu, Mumbai', cuisine: 'Cafe · Multi-cuisine', cuisineType: 'cafe', diet: ['multi'], budget: 'mid', rating: 4.8, price: '₹₹', emoji: '☕', mustTry: 'Pancakes', desc: 'Classic Mumbai cafe near Prithvi Theatre.', michelin: false, book: 'https://www.zomato.com/mumbai/prithvi-cafe-juhu', gmapUrl: 'https://maps.google.com/?q=Prithvi+Cafe+Juhu+Mumbai' },
    { id: 'veronica', name: 'Veronica', location: 'Bandra West, Mumbai', cuisine: 'European · Bar', cuisineType: 'european', diet: ['multi'], budget: 'upscale', rating: 4.7, price: '₹₹₹', emoji: '🍸', mustTry: 'Tasting Platter', desc: 'Premium bar and restaurant in Bandra.', michelin: false, book: 'https://www.zomato.com/mumbai/veronica-bandra-west', gmapUrl: 'https://maps.google.com/?q=Veronica+Bandra+Mumbai' },
    { id: 'salt_water', name: 'Salt Water Cafe', location: 'Bandra West, Mumbai', cuisine: 'Cafe · Brunch', cuisineType: 'cafe', diet: ['multi'], budget: 'mid', rating: 4.6, price: '₹₹', emoji: '🌊', mustTry: 'Eggs Benedict', desc: 'Popular brunch spot in Bandra.', michelin: false, book: 'https://www.zomato.com/mumbai/salt-water-cafe-bandra-west', gmapUrl: 'https://maps.google.com/?q=Salt+Water+Cafe+Bandra+Mumbai' },
    { id: 'jofood', name: 'Jo\u2019s Bistro', location: 'Andheri West, Mumbai', cuisine: 'Italian · European', cuisineType: 'italian', diet: ['multi'], budget: 'mid', rating: 4.5, price: '₹₹', emoji: '🍝', mustTry: 'Wood-fired Pizza', desc: 'Popular Italian bistro in Andheri.', michelin: false, book: 'https://www.zomato.com/mumbai/jos-bistro-andheri-west', gmapUrl: 'https://maps.google.com/?q=Jos+Bistro+Andheri+Mumbai' },
    { id: 'the_ghoul', name: 'The Ghoul', location: 'Bandra West, Mumbai', cuisine: 'Indian · Bar', cuisineType: 'indian', diet: ['multi'], budget: 'upscale', rating: 4.6, price: '₹₹₹', emoji: '🍛', mustTry: 'Butter Chicken', desc: 'Trendy Indian restaurant with great cocktails.', michelin: false, book: 'https://www.zomato.com/mumbai/the-ghoul-bandra-west', gmapUrl: 'https://maps.google.com/?q=The+Ghoul+Bandra+Mumbai' },
    { id: 'basil', name: 'Basil', location: 'Colaba, Mumbai', cuisine: 'Continental · Multi-cuisine', cuisineType: 'multi', diet: ['multi'], budget: 'mid', rating: 4.5, price: '₹₹', emoji: '🌿', mustTry: 'Pasta', desc: 'Popular Colaba restaurant near Gateway.', michelin: false, book: 'https://www.zomato.com/mumbai/basil-colaba', gmapUrl: 'https://maps.google.com/?q=Basil+Restaurant+Colaba+Mumbai' },
    { id: 'baniana', name: 'Baniana', location: 'Bandra West, Mumbai', cuisine: 'Asian · Thai', cuisineType: 'thai', diet: ['nonveg'], budget: 'upscale', rating: 4.7, price: '₹₹₹', emoji: '🍜', mustTry: 'Thai Green Curry', desc: 'Authentic Thai flavors in Bandra.', michelin: false, book: 'https://www.zomato.com/mumbai/baniana-bandra-west', gmapUrl: 'https://maps.google.com/?q=Baniana+Bandra+Mumbai' },
    { id: 'art_house', name: 'The Art House', location: 'Colaba, Mumbai', cuisine: 'Continental · Cafe', cuisineType: 'cafe', diet: ['multi'], budget: 'mid', rating: 4.6, price: '₹₹', emoji: '🎨', mustTry: 'Brunch Platter', desc: 'Bohemian cafe with great food.', michelin: false, book: 'https://www.zomato.com/mumbai/the-art-house-colaba', gmapUrl: 'https://maps.google.com/?q=The+Art+House+Colaba+Mumbai' },
    { id: 'c Toss', name: 'C Toss', location: 'Powai, Mumbai', cuisine: 'Japanese · Sushi', cuisineType: 'japanese', diet: ['nonveg'], budget: 'upscale', rating: 4.8, price: '₹₹₹', emoji: '🍣', mustTry: 'Dragon Roll', desc: 'Best sushi in Mumbai.', michelin: false, book: 'https://www.zomato.com/mumbai/c-toss-powai', gmapUrl: 'https://maps.google.com/?q=C+Toss+Powai+Mumbai' },
    { id: 'maya', name: 'Maya', location: 'Bandra West, Mumbai', cuisine: 'Indian · Modern', cuisineType: 'indian', diet: ['multi'], budget: 'upscale', rating: 4.7, price: '₹₹₹', emoji: '✨', mustTry: 'Tandoori Platter', desc: 'Stylish Indian restaurant.', michelin: false, book: 'https://www.zomato.com/mumbai/maya-bandra-west', gmapUrl: 'https://maps.google.com/?q=Maya+Restaurant+Bandra+Mumbai' },
    { id: 'global', name: 'Global Kitchen', location: 'Andheri East, Mumbai', cuisine: 'Multi-cuisine · Buffet', cuisineType: 'multi', diet: ['multi'], budget: 'mid', rating: 4.4, price: '₹₹', emoji: '🍽️', mustTry: 'Sunday Brunch', desc: 'Popular for Sunday brunch buffets.', michelin: false, book: 'https://www.zomato.com/mumbai/global-kitchen-andheri-east', gmapUrl: 'https://maps.google.com/?q=Global+Kitchen+Andheri+Mumbai' },
    { id: 'squares', name: 'Squares', location: 'Lower Parel, Mumbai', cuisine: 'Continental · Bar', cuisineType: 'multi', diet: ['multi'], budget: 'upscale', rating: 4.6, price: '₹₹₹', emoji: '🍸', mustTry: 'Grilled Chicken', desc: 'Popular Lower Parel restaurant.', michelin: false, book: 'https://www.zomato.com/mumbai/squares-lower-parel', gmapUrl: 'https://maps.google.com/?q=Squares+Restaurant+Lower+Parel+Mumbai' },
    { id: 'zenzi', name: 'Zenzi', location: 'Bandra West, Mumbai', cuisine: 'European · Cafe', cuisineType: 'european', diet: ['multi'], budget: 'mid', rating: 4.5, price: '₹₹', emoji: '☕', mustTry: 'Sandwiches', desc: 'Cozy cafe in the heart of Bandra.', michelin: false, book: 'https://www.zomato.com/mumbai/zenzi-bandra-west', gmapUrl: 'https://maps.google.com/?q=Zenzi+Bandra+Mumbai' },
  ],

  // DELHI
  delhi: [
    { id: 'indian_acc', name: 'Indian Accent', location: 'The Manor, New Delhi', cuisine: 'Modern Indian', cuisineType: 'indian', diet: ['multi'], budget: 'luxury', rating: 4.9, price: '₹₹₹₹', emoji: '🌟', mustTry: 'Tasting Menu', desc: 'Asia\'s 50 Best. Chef Manish Mehrotra\'s genius.', michelin: true, stars: '⭐', book: 'https://www.indianaccent.com', gmapUrl: 'https://maps.google.com/?q=Indian+Accent+The+Manor+Delhi' },
    { id: 'bukhara', name: 'Bukhara', location: 'ITC Maurya, Delhi', cuisine: 'North Indian · Frontier', cuisineType: 'indian', diet: ['nonveg'], budget: 'luxury', rating: 4.8, price: '₹₹₹', emoji: '🔥', mustTry: 'Dal Bukhara', desc: 'World\'s most awarded. Dal Bukhara simmered 18 hours.', michelin: false, book: 'https://www.itchotels.com/en/restaurants/bukhara', gmapUrl: 'https://maps.google.com/?q=Bukhara+ITC+Maurya+Delhi' },
    { id: 'karims', name: "Karim's", location: 'Jama Masjid, Delhi', cuisine: 'Mughlai', cuisineType: 'indian', diet: ['nonveg', 'halal'], budget: 'cheap', rating: 4.7, price: '₹', emoji: '🍛', mustTry: 'Mutton Burra Kebab', desc: 'Since 1913. Authentic Mughal kebabs.', michelin: false, book: 'https://www.zomato.com/delhi-ncr/karims-jama-masjid', gmapUrl: 'https://maps.google.com/?q=Karims+Restaurant+Jama+Masjid+Delhi' },
    { id: 'gulshan', name: 'Gulshan Ji Parantha', location: 'Chandni Chowk, Delhi', cuisine: 'Street Food · Parantha', cuisineType: 'indian', diet: ['veg'], budget: 'cheap', rating: 4.4, price: '₹', emoji: '🫓', mustTry: 'Paneer Parantha', desc: 'Famous parantha wallah since 1879.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Gulshan+Parantha+Chandni+Chowk+Delhi' },
    { id: 'dum_pukht', name: 'Dum Pukht', location: 'The Claridges, Delhi', cuisine: 'Awadhi · Biryani', cuisineType: 'indian', diet: ['nonveg'], budget: 'upscale', rating: 4.8, price: '₹₹₹', emoji: '🍖', mustTry: 'Dum Biryani', desc: 'Slow-cooked Awadhi cuisine. Royal dining.', michelin: false, book: 'https://www.claridges.com/restaurants/dum-pukht.php', gmapUrl: 'https://maps.google.com/?q=Dum+Pukht+The+Claridges+Delhi' },
    { id: 'big_yellow', name: 'Big Yellow Door', location: 'Hauz Khas, Delhi', cuisine: 'Italian · Cafe', cuisineType: 'italian', diet: ['multi'], budget: 'mid', rating: 4.6, price: '₹₹', emoji: '🍝', mustTry: 'Pasta', desc: 'Hauz Khas village icon. Great brunch spot.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Big+Yellow+Door+Hauz+Khas+Delhi' },
    { id: 'cafe_lota', name: 'Cafe Lota', location: 'Humayun\'s Tomb, Delhi', cuisine: 'Modern Indian', cuisineType: 'indian', diet: ['veg'], budget: 'mid', rating: 4.7, price: '₹₹', emoji: '🌿', mustTry: 'Lota Fritters', desc: 'Beautiful setting. Modern Indian snacks.', michelin: false, book: 'https://www.cafelota.com', gmapUrl: 'https://maps.google.com/?q=Cafe+Lota+Humayuns+Tomb+Delhi' },
    { id: 'havemore', name: 'Havemore', location: 'Saket, Delhi', cuisine: 'Punjabi · North Indian', cuisineType: 'indian', diet: ['veg'], budget: 'mid', rating: 4.5, price: '₹₹', emoji: '🥘', mustTry: 'Dal Makhani', desc: 'Popular vegetarian Punjabi food.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Havemore+Saket+Delhi' },
    { id: 'spice_kitchen', name: 'Spice Kitchen', location: 'The Leela Palace, Delhi', cuisine: 'Modern Indian', cuisineType: 'indian', diet: ['multi'], budget: 'luxury', rating: 4.9, price: '₹₹₹₹', emoji: '👑', mustTry: 'Tasting Menu', desc: 'Michelin-recommended. Royal Indian dining.', michelin: true, stars: '⭐', book: 'https://www.theleela.com/delhi/dining/spice-kitchen', gmapUrl: 'https://maps.google.com/?q=Spice+Kitchen+The+Leela+Palace+Delhi' },
    { id: 'amour', name: 'Amour', location: 'Vasant Kunj, Delhi', cuisine: 'European · Mediterranean', cuisineType: 'european', diet: ['multi'], budget: 'upscale', rating: 4.8, price: '₹₹₹', emoji: '🍷', mustTry: 'Grilled Sea Bass', desc: 'Romantic fine dining. European cuisine.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Amour+Restaurant+Vasant+Kunj+Delhi' },
    { id: 'diggin', name: 'Diggin', location: 'Chanakyapuri, Delhi', cuisine: 'Italian · Cafe', cuisineType: 'italian', diet: ['multi'], budget: 'mid', rating: 4.6, price: '₹₹', emoji: '🍕', mustTry: 'Wood-fired Pizza', desc: 'Beautiful garden cafe.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Diggin+Chanakyapuri+Delhi' },
    { id: 'dhanes', name: "Dhan Dhan", location: 'Nehru Place, Delhi', cuisine: 'Punjabi · North Indian', cuisineType: 'indian', diet: ['veg'], budget: 'mid', rating: 4.5, price: '₹₹', emoji: '🥘', mustTry: 'Paneer Butter Masala', desc: 'Popular vegetarian restaurant.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Dhan+Dhan+Nehru+Place+Delhi' },
    { id: 'jamun', name: 'Jamun', location: 'Nehru Place, Delhi', cuisine: 'Modern Indian', cuisineType: 'indian', diet: ['veg'], budget: 'upscale', rating: 4.7, price: '₹₹₹', emoji: '🍇', mustTry: 'Tasting Menu', desc: 'Vegetarian fine dining.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Jamun+Restaurant+Nehru+Place+Delhi' },
    { id: 'paar', name: 'Paar', location: 'The Claridges, Delhi', cuisine: 'Modern Indian', cuisineType: 'indian', diet: ['multi'], budget: 'luxury', rating: 4.8, price: '₹₹₹₹', emoji: '🌟', mustTry: 'Tasting Menu', desc: 'Michelin-guide. Chef Ganguly\'s modern Indian.', michelin: true, stars: '⭐', book: 'https://www.claridges.com/restaurants/paar.php', gmapUrl: 'https://maps.google.com/?q=Paar+The+Claridges+Delhi' },
    { id: 'moma', name: 'Moma', location: 'Connaught Place, Delhi', cuisine: 'European · Lounge', cuisineType: 'european', diet: ['multi'], budget: 'upscale', rating: 4.6, price: '₹₹₹', emoji: '🍸', mustTry: 'Cocktails', desc: 'Popular lounge in Connaught Place.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Moma+Connaught+Place+Delhi' },
    { id: 'sauced', name: 'Sauced', location: 'Hauz Khas, Delhi', cuisine: 'American · Burgers', cuisineType: 'american', diet: ['nonveg'], budget: 'mid', rating: 4.5, price: '₹₹', emoji: '🍔', mustTry: 'Smash Burger', desc: 'Best burgers in South Delhi.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Sauced+Hauz+Khas+Delhi' },
    { id: 'caterva', name: 'Caterva', location: 'Aerocity, Delhi', cuisine: 'North Indian · Multi-cuisine', cuisineType: 'indian', diet: ['multi'], budget: 'mid', rating: 4.4, price: '₹₹', emoji: '🍛', mustTry: 'Butter Chicken', desc: 'Popular near airport.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Caterva+Aerocity+Delhi' },
    { id: 'mixe', name: 'Mix', location: 'The Leela Palace, Delhi', cuisine: 'International Buffet', cuisineType: 'multi', diet: ['multi'], budget: 'luxury', rating: 4.7, price: '₹₹₹₹', emoji: '🍽️', mustTry: 'Sunday Brunch', desc: 'Best Sunday brunch in Delhi.', michelin: false, book: 'https://www.theleela.com/delhi/dining/mix', gmapUrl: 'https://maps.google.com/?q=Mix+The+Leela+Palace+Delhi' },
    { id: 'daniels', name: "Daniels", location: 'Connaught Place, Delhi', cuisine: 'European · Cafe', cuisineType: 'european', diet: ['multi'], budget: 'mid', rating: 4.5, price: '₹₹', emoji: '☕', mustTry: 'Pasta', desc: 'Classic CP cafe.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Daniels+Connaught+Place+Delhi' },
    { id: 'le_pain', name: 'Le Pain Quotidien', location: 'Mehrauli, Delhi', cuisine: 'European · Bakery', cuisineType: 'cafe', diet: ['veg'], budget: 'mid', rating: 4.6, price: '₹₹', emoji: '🥐', mustTry: 'Avocado Toast', desc: 'Bakery chain with great breakfast.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Le+Pain+Quotidien+Delhi' },
    { id: 'olive', name: 'Olive', location: 'Mehrauli, Delhi', cuisine: 'Mediterranean · Bar', cuisineType: 'mediterranean', diet: ['multi'], budget: 'upscale', rating: 4.7, price: '₹₹₹', emoji: '🫒', mustTry: 'Mezze Platter', desc: 'Trendy Mediterranean restaurant.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Olive+Restaurant+Delhi' },
    { id: 'chutne', name: 'Chutne', location: 'Nehru Place, Delhi', cuisine: 'North Indian · Snacks', cuisineType: 'indian', diet: ['veg'], budget: 'mid', rating: 4.5, price: '₹₹', emoji: '🍛', mustTry: 'Chaat', desc: 'Famous for chaat and snacks.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Chutne+Nehru+Place+Delhi' },
    { id: 'rajinder', name: 'Rajinder Da Dhaba', location: 'Safdarjung, Delhi', cuisine: 'Punjabi · Mutton', cuisineType: 'indian', diet: ['nonveg'], budget: 'mid', rating: 4.8, price: '₹₹', emoji: '🥩', mustTry: 'Mutton Curry', desc: 'Best mutton in Delhi. No-frills dhaba.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Rajinder+Da+Dhaba+Delhi' },
    { id: 'vfor', name: 'VFor', location: 'Saket, Delhi', cuisine: 'Italian · Pizza', cuisineType: 'italian', diet: ['veg'], budget: 'mid', rating: 4.6, price: '₹₹', emoji: '🍕', mustTry: 'Margherita Pizza', desc: 'Popular vegetarian Italian.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=VFor+Saket+Delhi' },
    { id: 'saravana', name: 'Saravana Bhavan', location: 'Connaught Place, Delhi', cuisine: 'South Indian · Vegetarian', cuisineType: 'indian', diet: ['veg', 'halal'], budget: 'cheap', rating: 4.4, price: '₹', emoji: '🍛', mustTry: 'Masala Dosa', desc: 'Pure vegetarian South Indian.', michelin: false, book: 'https://www.saravanabhavan.com', gmapUrl: 'https://maps.google.com/?q=Saravana+Bhavan+Delhi' },
    { id: 'masala_arts', name: 'Masala Art', location: 'AIIMS, Delhi', cuisine: 'North Indian · Fine Dining', cuisineType: 'indian', diet: ['multi'], budget: 'upscale', rating: 4.7, price: '₹₹₹', emoji: '🎨', mustTry: 'Dal Makhani', desc: 'Michelin-guide restaurant.', michelin: true, stars: '⭐', book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Masala+Art+AIIMS+Delhi' },
  ],

  // BANGALORE
  bangalore: [
    { id: 'mlr', name: 'M LR', location: 'Indiranagar, Bangalore', cuisine: 'Multi-cuisine', cuisineType: 'multi', diet: ['multi'], budget: 'upscale', rating: 4.7, price: '₹₹₹', emoji: '🍽️', mustTry: 'Tasting Menu', desc: 'Michelin-guide. Fine dining experience.', michelin: true, stars: '⭐', book: 'https://www.zomato.com/bangalore/mlr-indiranagar', gmapUrl: 'https://maps.google.com/?q=MLR+Restaurant+Indiranagar+Bangalore' },
    { id: 'vidyarthi', name: 'Vidyarthi Bhavan', location: 'Gandhi Bazaar, Bangalore', cuisine: 'South Indian', cuisineType: 'indian', diet: ['veg'], budget: 'cheap', rating: 4.6, price: '₹', emoji: '🍛', mustTry: 'Benne Masala Dosa', desc: 'Legendary since 1920. Best masala dosa.', michelin: false, book: 'https://www.zomato.com/bangalore/vidyarthi-bhavan-gandhi-bazaar', gmapUrl: 'https://maps.google.com/?q=Vidyarthi+Bhavan+Gandhi+Bazaar+Bangalore' },
    { id: 'mlezive', name: 'Mlezive', location: 'Koramangala, Bangalore', cuisine: 'Modern European', cuisineType: 'european', diet: ['multi'], budget: 'upscale', rating: 4.8, price: '₹₹₹', emoji: '✨', mustTry: 'Tasting Menu', desc: 'Modern European fine dining.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Mlezive+Koramangala+Bangalore' },
    { id: ' fatty', name: 'The Fatty Bao', location: 'Indiranagar, Bangalore', cuisine: 'Asian · Pan-Indian', cuisineType: 'asian', diet: ['multi'], budget: 'mid', rating: 4.5, price: '₹₹', emoji: '🥡', mustTry: 'Bao Buns', desc: 'Popular Asian fusion restaurant.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=The+Fatty+Bao+Indiranagar+Bangalore' },
    { id: 'toit', name: 'Toit Brewpub', location: 'Indiranagar, Bangalore', cuisine: 'Brepub · Pizza', cuisineType: 'multi', diet: ['multi'], budget: 'mid', rating: 4.6, price: '₹₹', emoji: '🍺', mustTry: 'Wood-fired Pizza', desc: 'First brewpub in Bangalore.', michelin: false, book: 'https://www.toit.in', gmapUrl: 'https://maps.google.com/?q=Toit+Brewpub+Indiranagar+Bangalore' },
    { id: 'bbq', name: 'Barbeque Nation', location: 'Multiple Locations, Bangalore', cuisine: 'BBQ · Buffet', cuisineType: 'multi', diet: ['nonveg'], budget: 'mid', rating: 4.4, price: '₹₹', emoji: '🍖', mustTry: 'Unlimited BBQ', desc: 'Popular BBQ buffet chain.', michelin: false, book: 'https://www.barbequenation.com', gmapUrl: 'https://maps.google.com/?q=Barbeque+Nation+Bangalore' },
    { id: 'meghana', name: 'Meghana Foods', location: 'Sarjapur Road, Bangalore', cuisine: 'Biryani · Andhra', cuisineType: 'indian', diet: ['nonveg'], budget: 'mid', rating: 4.7, price: '₹₹', emoji: '🍗', mustTry: 'Khyati Biryani', desc: 'Best biryani in Bangalore.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Meghana+Foods+Bangalore' },
    { id: 'tru', name: 'Truffles', location: 'Koramangala, Bangalore', cuisine: 'American · Burgers', cuisineType: 'american', diet: ['nonveg'], budget: 'mid', rating: 4.6, price: '₹₹', emoji: '🍔', mustTry: 'Chicken Wings', desc: 'Koramangala favorite since 1992.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Truffles+Koramangala+Bangalore' },
    { id: 'vandalur', name: 'Vandalur', location: 'Whitefield, Bangalore', cuisine: 'Multi-cuisine', cuisineType: 'multi', diet: ['multi'], budget: 'upscale', rating: 4.5, price: '₹₹₹', emoji: '🍽️', mustTry: 'Paneer Dishes', desc: 'Popular in Whitefield area.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Vandalur+Restaurant+Whitefield+Bangalore' },
    { id: 'matic', name: 'matic Kitchen', location: 'Indiranagar, Bangalore', cuisine: 'Multi-cuisine', cuisineType: 'multi', diet: ['multi'], budget: 'upscale', rating: 4.8, price: '₹₹₹', emoji: '🌟', mustTry: 'Tasting Menu', desc: 'Michelin-guide. Chef\'s table experience.', michelin: true, stars: '⭐', book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=atic+Kitchen+Indiranagar+Bangalore' },
    { id: 's Specialty', name: 'S Specialty', location: 'MG Road, Bangalore', cuisine: 'Multi-cuisine', cuisineType: 'multi', diet: ['multi'], budget: 'luxury', rating: 4.7, price: '₹₹₹₹', emoji: '👑', mustTry: 'Tasting Menu', desc: 'Fine dining at The Ritz-Carlton.', michelin: false, book: 'https://www.ritzcarlton.com', gmapUrl: 'https://maps.google.com/?q=S+Specialty+MG+Road+Bangalore' },
    { id: 'l_cafe', name: 'L Cafe', location: 'Koramangala, Bangalore', cuisine: 'Cafe · Multi-cuisine', cuisineType: 'cafe', diet: ['multi'], budget: 'mid', rating: 4.5, price: '₹₹', emoji: '☕', mustTry: 'Pancakes', desc: 'Popular brunch cafe.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=L+Cafe+Koramangala+Bangalore' },
    { id: 'grass', name: 'Grass & Grain', location: 'Residency Road, Bangalore', cuisine: 'Continental · Bar', cuisineType: 'european', diet: ['multi'], budget: 'upscale', rating: 4.6, price: '₹₹₹', emoji: '🥩', mustTry: 'Steak', desc: 'Premium dining in Residency Road.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Grass+And+Grain+Bangalore' },
    { id: 'harima', name: 'Harima', location: 'Koramangala, Bangalore', cuisine: 'Japanese · Sushi', cuisineType: 'japanese', diet: ['nonveg'], budget: 'upscale', rating: 4.7, price: '₹₹₹', emoji: '🍣', mustTry: 'Sushi Platter', desc: 'Best Japanese in Bangalore.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Harima+Koramangala+Bangalore' },
    { id: 'mamagoto', name: 'Mamagoto', location: 'Koramangala, Bangalore', cuisine: 'Pan-Asian', cuisineType: 'asian', diet: ['multi'], budget: 'mid', rating: 4.5, price: '₹₹', emoji: '🥡', mustTry: 'Dim Sum', desc: 'Popular Pan-Asian restaurant.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Mamagoto+Koramangala+Bangalore' },
    { id: 'bflat', name: 'BFlat', location: 'Indiranagar, Bangalore', cuisine: 'Continental · Bar', cuisineType: 'european', diet: ['multi'], budget: 'mid', rating: 4.6, price: '₹₹', emoji: '🍸', mustTry: 'Cocktails', desc: 'Popular bar and restaurant.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=BFlat+Indiranagar+Bangalore' },
    { id: 'arsenal', name: 'Arsenal Tactical', location: 'MG Road, Bangalore', cuisine: 'Continental · Bar', cuisineType: 'multi', diet: ['multi'], budget: 'upscale', rating: 4.5, price: '₹₹₹', emoji: '🍷', mustTry: 'Tasting Platter', desc: 'Upscale bar near MG Road.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Arsenal+Tactical+MG+Road+Bangalore' },
    { id: 'tao', name: 'Tao', location: 'Lavelle Road, Bangalore', cuisine: 'Pan-Asian', cuisineType: 'asian', diet: ['multi'], budget: 'upscale', rating: 4.6, price: '₹₹₹', emoji: '🥢', mustTry: 'Dragon Roll', desc: 'Popular Asian fine dining.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Tao+Restaurant+Lavelle+Road+Bangalore' },
    { id: 'smoor', name: 'Smoor', location: 'Koramangala, Bangalore', cuisine: 'Desserts · Cafe', cuisineType: 'dessert', diet: ['veg'], budget: 'mid', rating: 4.7, price: '₹₹', emoji: '🧁', mustTry: 'Chocolate Pastries', desc: 'Famous for chocolates and pastries.', michelin: false, book: 'https://www.smoor.in', gmapUrl: 'https://maps.google.com/?q=Smoor+Koramangala+Bangalore' },
    { id: 'butter', name: 'Butter & Bloom', location: 'Indiranagar, Bangalore', cuisine: 'Bakery · Cafe', cuisineType: 'cafe', diet: ['veg'], budget: 'mid', rating: 4.8, price: '₹₹', emoji: '🥐', mustTry: 'Croissants', desc: 'Best bakery in Bangalore.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Butter+And+Bloom+Indiranagar+Bangalore' },
    { id: 'fenny', name: "Fenny's Kitchen", location: 'Koramangala, Bangalore', cuisine: 'Multi-cuisine', cuisineType: 'multi', diet: ['multi'], budget: 'upscale', rating: 4.6, price: '₹₹₹', emoji: '🍽️', mustTry: 'Tasting Menu', desc: 'Michelin-guide experience.', michelin: true, stars: '⭐', book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Fennys+Kitchen+Koramangala+Bangalore' },
    { id: 'noon', name: 'Noon', location: 'Indiranagar, Bangalore', cuisine: 'European · Modern', cuisineType: 'european', diet: ['multi'], budget: 'upscale', rating: 4.7, price: '₹₹₹', emoji: '☀️', mustTry: 'Tasting Menu', desc: 'Modern European fine dining.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Noon+Restaurant+Indiranagar+Bangalore' },
    { id: 'eden', name: 'Eden', location: 'Koramangala, Bangalore', cuisine: 'Mediterranean', cuisineType: 'mediterranean', diet: ['veg'], budget: 'mid', rating: 4.5, price: '₹₹', emoji: '🫒', mustTry: 'Falafel', desc: 'Popular Mediterranean vegetarian.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Eden+Restaurant+Koramangala+Bangalore' },
    { id: 'shiro', name: 'Shiro', location: 'Sadashivnagar, Bangalore', cuisine: 'Japanese · Pan-Asian', cuisineType: 'japanese', diet: ['multi'], budget: 'upscale', rating: 4.6, price: '₹₹₹', emoji: '🏮', mustTry: 'Sushi', desc: 'Popular Japanese restaurant.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Shiro+Restaurant+Bangalore' },
    { id: 'sm Brau', name: 'Sm Brau', location: 'Koramangala, Bangalore', cuisine: 'German · Brewpub', cuisineType: 'multi', diet: ['nonveg'], budget: 'mid', rating: 4.5, price: '₹₹', emoji: '🍺', mustTry: 'German Sausages', desc: 'German food and beer.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Sm+Brau+Koramangala+Bangalore' },
    { id: 'teresa', name: "Teresa's", location: 'Residency Road, Bangalore', cuisine: 'Multi-cuisine', cuisineType: 'multi', diet: ['multi'], budget: 'upscale', rating: 4.6, price: '₹₹₹', emoji: '🍽️', mustTry: 'Pasta', desc: 'Classic fine dining restaurant.', michelin: false, book: 'https://www.zomato.com', gmapUrl: 'https://maps.google.com/?q=Teresas+Restaurant+Bangalore' },
  ],

  // PARIS
  paris: [
    { id: 'le_comptoir', name: 'Le Comptoir du Pantheon', location: 'Latin Quarter, Paris', cuisine: 'French · Bistro', cuisineType: 'french', diet: ['multi'], budget: 'mid', rating: 4.6, price: '€€', emoji: '🥐', mustTry: 'Duck Confit', desc: 'Classic Parisian bistro near Pantheon.', michelin: false, book: 'https://www.thefork.fr/restaurant/le-comptoir-du-pantheon', gmapUrl: 'https://maps.google.com/?q=Le+Comptoir+du+Pantheon+Paris' },
    { id: 'cafe_de_flore', name: 'Cafe de Flore', location: 'Saint-Germain, Paris', cuisine: 'French · Cafe', cuisineType: 'cafe', diet: ['multi'], budget: 'mid', rating: 4.5, price: '€€', emoji: '☕', mustTry: 'Croissant', desc: 'Legendary since 1887. Sartre & Simone de Beauvoir haunt.', michelin: false, book: 'https://www.cafedeflore.fr', gmapUrl: 'https://maps.google.com/?q=Cafe+de+Flore+Paris' },
    { id: 'l_ami_jean', name: "L'Ami Jean", location: '7th Arrondissement, Paris', cuisine: 'Basque · French', cuisineType: 'french', diet: ['multi'], budget: 'upscale', rating: 4.8, price: '€€€', emoji: '🍷', mustTry: 'Rice Pudding', desc: 'Basque food. Legendary rice pudding.', michelin: false, book: 'https://www.lamijean-paris.com', gmapUrl: 'https://maps.google.com/?q=LAmi+Jean+Paris' },
    { id: 'pierre_herme', name: 'Pierre Hermé', location: 'Multiple Locations, Paris', cuisine: 'Pastry · Macarons', cuisineType: 'dessert', diet: ['veg'], budget: 'mid', rating: 4.9, price: '€', emoji: '🧁', mustTry: 'Macarons', desc: 'World\'s best macarons. Chef is pastry god.', michelin: false, book: 'https://www.pierreherme.com', gmapUrl: 'https://maps.google.com/?q=Pierre+Herme+Paris' },
    { id: 'les_halles', name: 'Les Halles', location: 'Châtelet, Paris', cuisine: 'French · Steak', cuisineType: 'french', diet: ['nonveg'], budget: 'upscale', rating: 4.4, price: '€€€', emoji: '🥩', mustTry: 'Steak Frites', desc: 'Famous for steaks. Classic Parisian experience.', michelin: false, book: 'https://www.leshalles.net', gmapUrl: 'https://maps.google.com/?q=Les+Halles+Paris' },
    { id: 'le_jules_verne', name: 'Le Jules Verne', location: 'Eiffel Tower, Paris', cuisine: 'Modern French', cuisineType: 'french', diet: ['multi'], budget: 'luxury', rating: 4.7, price: '€€€€', emoji: '🗼', mustTry: 'Tasting Menu', desc: 'Michelin star on Eiffel Tower. Stunning views.', michelin: true, stars: '⭐', book: 'https://www.restaurants-toureiffel.com', gmapUrl: 'https://maps.google.com/?q=Le+Jules+Verne+Eiffel+Tower+Paris' },
    { id: 'pink_mamma', name: 'Pink Mamma', location: 'Bastille, Paris', cuisine: 'Italian · Tripey', cuisineType: 'italian', diet: ['nonveg'], budget: 'mid', rating: 4.7, price: '€€', emoji: '🍕', mustTry: 'Steak Tartare', desc: 'Instagrammable decor. Amazing Italian food.', michelin: false, book: 'https://www.bigmamma.com', gmapUrl: 'https://maps.google.com/?q=Pink+Mamma+Paris' },
    { id: 'chez_janis', name: 'Chez Janis', location: '10th Arrondissement, Paris', cuisine: 'French · Bistro', cuisineType: 'french', diet: ['multi'], budget: 'mid', rating: 4.8, price: '€€', emoji: '🍷', mustTry: 'Tartare', desc: 'Natural wine bar. Local favorite.', michelin: false, book: 'https://www.chezjanis.com', gmapUrl: 'https://maps.google.com/?q=Chez+Janis+Paris' },
    { id: 'bouillon_chartier', name: 'Bouillon Chartier', location: '9th Arrondissement, Paris', cuisine: 'French · Traditional', cuisineType: 'french', diet: ['multi'], budget: 'cheap', rating: 4.3, price: '€', emoji: '🥘', mustTry: 'Escargots', desc: 'Historic since 1896. Very affordable.', michelin: false, book: 'https://www.bouillon-chartier.com', gmapUrl: 'https://maps.google.com/?q=Bouillon+Chartier+Paris' },
    { id: 'cafe_de_la_paix', name: 'Cafe de la Paix', location: 'Opera, Paris', cuisine: 'French · Haussmann', cuisineType: 'french', diet: ['multi'], budget: 'upscale', rating: 4.5, price: '€€€', emoji: '🏛️', mustTry: 'Omelette', desc: 'Iconic Paris cafe near Opera.', michelin: false, book: 'https://www.cafedelapaix.com', gmapUrl: 'https://maps.google.com/?q=Cafe+de+la+Paix+Paris' },
    { id: 'le_cygne', name: 'Le Cygne', location: '2nd Arrondissement, Paris', cuisine: 'French · Fine Dining', cuisineType: 'french', diet: ['multi'], budget: 'luxury', rating: 4.9, price: '€€€€', emoji: '🦢', mustTry: 'Tasting Menu', desc: 'Michelin 2 stars. Exceptional French cuisine.', michelin: true, stars: '⭐⭐', book: 'https://www.thefork.fr/restaurant/le-cygne', gmapUrl: 'https://maps.google.com/?q=Le+Cygne+Paris' },
    { id: 'le_bouillon', name: 'Le Bouillon', location: '9th Arrondissement, Paris', cuisine: 'French · Modern', cuisineType: 'french', diet: ['multi'], budget: 'mid', rating: 4.6, price: '€€', emoji: '🥣', mustTry: 'Beef Bourguignon', desc: 'Modern take on classic French dishes.', michelin: false, book: 'https://www.thefork.fr', gmapUrl: 'https://maps.google.com/?q=Le+Bouillon+Paris' },
    { id: 'rench_montorgueil', name: 'Le Comptoir du Pain', location: 'Montorgueil, Paris', cuisine: 'Bakery · French', cuisineType: 'cafe', diet: ['veg'], budget: 'cheap', rating: 4.5, price: '€', emoji: '🥖', mustTry: 'Croissants', desc: 'Best bakery bread in Paris.', michelin: false, book: 'https://www.comptoirdupain.com', gmapUrl: 'https://maps.google.com/?q=Le+Comptoir+du+Pain+Paris' },
    { id: 'umami', name: 'Umami', location: 'Marais, Paris', cuisine: 'French · Asian Fusion', cuisineType: 'asian', diet: ['multi'], budget: 'upscale', rating: 4.6, price: '€€€', emoji: '🍜', mustTry: 'Duck Magret', desc: 'French-Asian fusion in Le Marais.', michelin: false, book: 'https://www.thefork.fr', gmapUrl: 'https://maps.google.com/?q=Umami+Restaurant+Paris' },
    { id: 'jadis', name: 'Jadis', location: '20th Arrondissement, Paris', cuisine: 'French · Bistro', cuisineType: 'french', diet: ['multi'], budget: 'mid', rating: 4.7, price: '€€', emoji: '🍷', mustTry: 'Cheese Board', desc: 'Natural wine and local produce.', michelin: false, book: 'https://www.thefork.fr', gmapUrl: 'https://maps.google.com/?q=Jadis+Restaurant+Paris' },
    { id: 'sALA', name: 'SALLY', location: 'Saint-Germain, Paris', cuisine: 'Bakery · Desserts', cuisineType: 'dessert', diet: ['veg'], budget: 'mid', rating: 4.8, price: '€€', emoji: '🧁', mustTry: 'Cookies', desc: 'Best cookies in Paris.', michelin: false, book: 'https://www.salley-paris.com', gmapUrl: 'https://maps.google.com/?q=SALLY+Cookies+Paris' },
    { id: 'le_vraymonde', name: 'Le Vraymont', location: '6th Arrondissement, Paris', cuisine: 'French · Fine Dining', cuisineType: 'french', diet: ['multi'], budget: 'luxury', rating: 4.8, price: '€€€€', emoji: '⭐', mustTry: 'Tasting Menu', desc: 'Michelin 2 stars. Romantic dining.', michelin: true, stars: '⭐⭐', book: 'https://www.thefork.fr', gmapUrl: 'https://maps.google.com/?q=Le+Vraymont+Paris' },
    { id: 'claus', name: 'Claus', location: 'Tuileries, Paris', cuisine: 'French · Breakfast', cuisineType: 'cafe', diet: ['multi'], budget: 'mid', rating: 4.5, price: '€€', emoji: '🥞', mustTry: 'Breakfast', desc: 'Best breakfast in Paris.', michelin: false, book: 'https://www.claus-paris.com', gmapUrl: 'https://maps.google.com/?q=Claus+Restaurant+Paris' },
    { id: 'septime', name: 'Septime', location: '11th Arrondissement, Paris', cuisine: 'French · Modern', cuisineType: 'french', diet: ['multi'], budget: 'upscale', rating: 4.9, price: '€€€', emoji: '🌿', mustTry: 'Tasting Menu', desc: 'Michelin star. Very hard to book.', michelin: true, stars: '⭐', book: 'https://septime-charonne.fr', gmapUrl: 'https://maps.google.com/?q=Septime+Paris' },
    { id: 'apicius', name: 'Apicius', location: '8th Arrondissement, Paris', cuisine: 'French · Fine Dining', cuisineType: 'french', diet: ['multi'], budget: 'luxury', rating: 4.8, price: '€€€€', emoji: '🏆', mustTry: 'Tasting Menu', desc: 'Michelin 2 stars. Haute cuisine.', michelin: true, stars: '⭐⭐', book: 'https://www.apicius-restaurant.com', gmapUrl: 'https://maps.google.com/?q=Apicius+Paris' },
    { id: 'allard', name: 'Allard', location: 'Saint-Germain, Paris', cuisine: 'French · Bistro', cuisineType: 'french', diet: ['multi'], budget: 'upscale', rating: 4.6, price: '€€€', emoji: '🥘', mustTry: 'Frog Legs', desc: 'Historic bistro. Classic French.', michelin: false, book: 'https://www.allard-paris.fr', gmapUrl: 'https://maps.google.com/?q=Allard+Paris' },
    { id: 'rose_bakery', name: 'Rose Bakery', location: 'Saint-Germain, Paris', cuisine: 'British · Bakery', cuisineType: 'cafe', diet: ['veg'], budget: 'cheap', rating: 4.5, price: '€', emoji: '🥧', mustTry: 'Scones', desc: 'British-style bakery.', michelin: false, book: 'https://www.rosebakerystore.com', gmapUrl: 'https://maps.google.com/?q=Rose+Bakery+Paris' },
    { id: 'cafe_marly', name: 'Cafe Marly', location: 'Louvre, Paris', cuisine: 'French · Cafe', cuisineType: 'french', diet: ['multi'], budget: 'upscale', rating: 4.4, price: '€€€', emoji: '🏛️', mustTry: 'Tarte Tatin', desc: 'Iconic cafe facing the Louvre.', michelin: false, book: 'https://www.cafemarly.com', gmapUrl: 'https://maps.google.com/?q=Cafe+Marly+Paris' },
    { id: 'le_dome', name: 'Le Dome', location: 'Montparnasse, Paris', cuisine: 'French · Seafood', cuisineType: 'french', diet: ['seafood'], budget: 'upscale', rating: 4.6, price: '€€€', emoji: '🦞', mustTry: 'Langoustines', desc: 'Classic seafood restaurant.', michelin: false, book: 'https://www.ledome-paris.com', gmapUrl: 'https://maps.google.com/?q=Le+Dome+Paris' },
    { id: 'passage', name: 'Passage 53', location: '2nd Arrondissement, Paris', cuisine: 'French · Modern Asian', cuisineType: 'french', diet: ['multi'], budget: 'luxury', rating: 4.9, price: '€€€€', emoji: '🌟', mustTry: 'Tasting Menu', desc: 'Michelin 2 stars. Unique flavors.', michelin: true, stars: '⭐⭐', book: 'https://www.passage53.fr', gmapUrl: 'https://maps.google.com/?q=Passage+53+Paris' },
    { id: 'josephine', name: 'Chez Josephine', location: 'Montmartre, Paris', cuisine: 'French · Bistro', cuisineType: 'french', diet: ['multi'], budget: 'mid', rating: 4.5, price: '€€', emoji: '🥂', mustTry: 'Onion Soup', desc: 'Classic bistro in Montmartre.', michelin: false, book: 'https://www.thefork.fr', gmapUrl: 'https://maps.google.com/?q=Chez+Josephine+Paris' },
  ],

  // LONDON
  london: [
    { id: 'dishoom_london', name: 'Dishoom', location: 'Multiple Locations, London', cuisine: 'Indian · Bombay Cafe', cuisineType: 'indian', diet: ['multi'], budget: 'mid', rating: 4.7, price: '££', emoji: '🍛', mustTry: 'Bunny Chow', desc: 'Best Indian food in London. Always packed.', michelin: false, book: 'https://www.dishoom.com', gmapUrl: 'https://maps.google.com/?q=Dishoom+London' },
    { id: 'burger_lobster', name: 'Burger & Lobster', location: 'Mayfair, London', cuisine: 'Surf & Turf', cuisineType: 'seafood', diet: ['nonveg'], budget: 'upscale', rating: 4.6, price: '£££', emoji: '🦞', mustTry: 'The Burger', desc: 'Simple menu. Best lobster rolls in London.', michelin: false, book: 'https://www.burgerandlobster.com', gmapUrl: 'https://maps.google.com/?q=Burger+And+Lobster+London' },
    { id: 'sketch_london', name: 'Sketch', location: 'Mayfair, London', cuisine: 'French · Modern European', cuisineType: 'european', diet: ['multi'], budget: 'luxury', rating: 4.8, price: '££££', emoji: '🎨', mustTry: 'Afternoon Tea', desc: 'Instagram-famous decor. 2 Michelin stars.', michelin: true, stars: '⭐⭐', book: 'https://www.sketch.london', gmapUrl: 'https://maps.google.com/?q=Sketch+London' },
    { id: 'clove_club', name: 'The Clove Club', location: 'Shoreditch, London', cuisine: 'Modern British', cuisineType: 'british', diet: ['multi'], budget: 'luxury', rating: 4.8, price: '£££', emoji: '✨', mustTry: 'Tasting Menu', desc: 'Michelin star. Best modern British cuisine.', michelin: true, stars: '⭐', book: 'https://www.thecloveclub.com', gmapUrl: 'https://maps.google.com/?q=The+Clove+Club+London' },
    { id: 'bridge_tavern', name: 'The Bridge Tavern', location: 'Wapping, London', cuisine: 'British · Pub', cuisineType: 'british', diet: ['multi'], budget: 'cheap', rating: 4.5, price: '£', emoji: '🍺', mustTry: 'Fish & Chips', desc: 'Riverside pub near Tower Bridge.', michelin: false, book: 'https://www.thebridgeltavern.co.uk', gmapUrl: 'https://maps.google.com/?q=The+Bridge+Tavern+London' },
    { id: 'flat_iron_london', name: 'Flat Iron', location: 'Multiple Locations, London', cuisine: 'Steakhouse', cuisineType: 'steakhouse', diet: ['nonveg'], budget: 'mid', rating: 4.7, price: '££', emoji: '🥩', mustTry: 'Flat Iron Steak', desc: 'Affordable great steaks. £10 steak with excellent sides.', michelin: false, book: 'https://flatiron.co.uk', gmapUrl: 'https://maps.google.com/?q=Flat+Iron+London' },
    { id: 'gymkhana_london', name: 'Gymkhana', location: 'Mayfair, London', cuisine: 'Indian · Colonial', cuisineType: 'indian', diet: ['nonveg'], budget: 'upscale', rating: 4.8, price: '£££', emoji: '🏏', mustTry: 'Lamb Rogan Josh', desc: 'Michelin-starred. Colonial-era Indian cuisine.', michelin: true, stars: '⭐', book: 'https://www.gymkhanalondon.com', gmapUrl: 'https://maps.google.com/?q=Gymkhana+London' },
    { id: 'da_michele_london', name: 'Da Michele', location: 'Stoke Newington, London', cuisine: 'Neapolitan Pizza', cuisineType: 'italian', diet: ['veg'], budget: 'cheap', rating: 4.8, price: '£', emoji: '🍕', mustTry: 'Margherita', desc: 'Authentic Naples pizza. No compromises.', michelin: false, book: 'https://www.damichele.co.uk', gmapUrl: 'https://maps.google.com/?q=Da+Michele+London' },
    { id: 'dabbous', name: 'Dabbous', location: 'Fitzrovia, London', cuisine: 'Modern European', cuisineType: 'european', diet: ['multi'], budget: 'upscale', rating: 4.7, price: '£££', emoji: '🌿', mustTry: 'Tasting Menu', desc: 'Michelin star. Exceptional cooking.', michelin: true, stars: '⭐', book: 'https://www.dabbous.co.uk', gmapUrl: 'https://maps.google.com/?q=Dabbous+London' },
    { id: 'tyg', name: 'The Breakfast Club', location: 'Multiple Locations, London', cuisine: 'American · Breakfast', cuisineType: 'american', diet: ['multi'], budget: 'mid', rating: 4.5, price: '££', emoji: '🥞', mustTry: 'Full English', desc: 'Best breakfast spots in London.', michelin: false, book: 'https://www.thebreakfastclub.co.uk', gmapUrl: 'https://maps.google.com/?q=The+Breakfast+Club+London' },
    { id: 'momo', name: 'Momo', location: 'Mayfair, London', cuisine: 'Moroccan · North African', cuisineType: 'middle-eastern', diet: ['halal'], budget: 'upscale', rating: 4.6, price: '£££', emoji: '🥙', mustTry: 'Tagine', desc: 'Authentic Moroccan cuisine.', michelin: false, book: 'https://www.momorestaurant.com', gmapUrl: 'https://maps.google.com/?q=Momo+Restaurant+London' },
    { id: 'hoppers', name: 'Hoppers', location: 'Multiple Locations, London', cuisine: 'Sri Lankan', cuisineType: 'indian', diet: ['multi'], budget: 'mid', rating: 4.7, price: '££', emoji: '🍛', mustTry: 'Hoppers', desc: 'Michelin Bib Gourmand. Sri Lankan specialties.', michelin: true, stars: '⭐', book: 'https://www.hopperslondon.com', gmapUrl: 'https://maps.google.com/?q=Hoppers+London' },
    { id: 'smoking', name: 'The Smoking Goat', location: 'Shoreditch, London', cuisine: 'Thai · BBQ', cuisineType: 'thai', diet: ['nonveg'], budget: 'mid', rating: 4.8, price: '££', emoji: '🔥', mustTry: 'Crying Tiger', desc: 'Thai BBQ. Incredible flavors.', michelin: false, book: 'https://www.thesmokinggoatbar.com', gmapUrl: 'https://maps.google.com/?q=The+Smoking+Goat+London' },
    { id: 'black_ax', name: 'Black Axe Mangal', location: 'Peckham, London', cuisine: 'Turkish · Mangal', cuisineType: 'middle-eastern', diet: ['nonveg'], budget: 'upscale', rating: 4.9, price: '£££', emoji: '🔥', mustTry: 'Lamb Flatbread', desc: 'Michelin star. Epic Turkish BBQ.', michelin: true, stars: '⭐', book: 'https://www.blackaxemangal.com', gmapUrl: 'https://maps.google.com/?q=Black+Axe+Mangal+London' },
    { id: 'lima_london', name: 'Lima', location: 'Soho, London', cuisine: 'Peruvian', cuisineType: 'peruvian', diet: ['multi'], budget: 'upscale', rating: 4.7, price: '£££', emoji: '🇵🇪', mustTry: 'Ceviche', desc: 'Michelin star. Modern Peruvian cuisine.', michelin: true, stars: '⭐', book: 'https://www.limalondon.com', gmapUrl: 'https://maps.google.com/?q=Lima+London' },
    { id: 'fera', name: 'Fera at Claridges', location: 'Mayfair, London', cuisine: 'Modern British', cuisineType: 'british', diet: ['multi'], budget: 'luxury', rating: 4.8, price: '££££', emoji: '✨', mustTry: 'Tasting Menu', desc: 'Michelin star at Claridges hotel.', michelin: true, stars: '⭐', book: 'https://www.claridges.co.uk', gmapUrl: 'https://maps.google.com/?q=Fera+at+Claridges+London' },
    { id: 'imperial', name: 'Imperial Treasure', location: 'Multiple Locations, London', cuisine: 'Chinese · Fine Dining', cuisineType: 'chinese', diet: ['nonveg'], budget: 'upscale', rating: 4.6, price: '£££', emoji: '🥢', mustTry: 'Peking Duck', desc: 'Michelin-starred Chinese fine dining.', michelin: true, stars: '⭐', book: 'https://www.imperialtreasure.com', gmapUrl: 'https://maps.google.com/?q=Imperial+Treasure+London' },
    { id: 'the_pelican', name: 'The Pelican', location: 'Notting Hill, London', cuisine: 'British · Gastropub', cuisineType: 'british', diet: ['multi'], budget: 'mid', rating: 4.7, price: '££', emoji: '🍺', mustTry: 'Sunday Roast', desc: 'Excellent gastropub in Notting Hill.', michelin: false, book: 'https://www.thepelican.co.uk', gmapUrl: 'https://maps.google.com/?q=The+Pelican+London' },
    { id: 'bancone', name: 'Bancone', location: 'Soho, London', cuisine: 'Italian', cuisineType: 'italian', diet: ['veg'], budget: 'mid', rating: 4.8, price: '££', emoji: '🍝', mustTry: 'Egg Yolk Pasta', desc: 'Michelin Bib Gourmand. Handmade pasta.', michelin: true, stars: '⭐', book: 'https://www.bancone.co.uk', gmapUrl: 'https://maps.google.com/?q=Bancone+London' },
    { id: 'liebling', name: 'Liebling', location: 'Soho, London', cuisine: 'European · Wine Bar', cuisineType: 'european', diet: ['multi'], budget: 'mid', rating: 4.6, price: '££', emoji: '🍷', mustTry: 'Wiener Schnitzel', desc: 'Austrian-inspired wine bar.', michelin: false, book: 'https://www.liebling.co.uk', gmapUrl: 'https://maps.google.com/?q=Liebling+London' },
    { id: 'j_sheekey', name: 'J. Sheekey', location: 'West End, London', cuisine: 'Seafood', cuisineType: 'seafood', diet: ['nonveg'], budget: 'upscale', rating: 4.7, price: '£££', emoji: '🐟', mustTry: 'Fish & Chips', desc: 'Legendary seafood restaurant since 1890s.', michelin: false, book: 'https://www.j-sheekey.co.uk', gmapUrl: 'https://maps.google.com/?q=J+Sheekey+London' },
    { id: 'rivington', name: 'Rivington Grill', location: 'Shoreditch, London', cuisine: 'British · Grill', cuisineType: 'british', diet: ['multi'], budget: 'mid', rating: 4.5, price: '££', emoji: '🥩', mustTry: 'Steak', desc: 'Shoreditch institution.', michelin: false, book: 'https://www.rivingtongrill.co.uk', gmapUrl: 'https://maps.google.com/?q=Rivington+Grill+London' },
    { id: 'st_john', name: 'St. John', location: 'Farringdon, London', cuisine: 'British · Nose-to-tail', cuisineType: 'british', diet: ['nonveg'], budget: 'mid', rating: 4.7, price: '££', emoji: '🥖', mustTry: 'Bone Marrow', desc: 'Michelin star. Pioneering nose-to-tail dining.', michelin: true, stars: '⭐', book: 'https://www.stjohnrestaurant.com', gmapUrl: 'https://maps.google.com/?q=St+John+London' },
    { id: 'palme', name: 'Palme', location: 'Shoreditch, London', cuisine: 'European · Modern', cuisineType: 'european', diet: ['multi'], budget: 'upscale', rating: 4.8, price: '£££', emoji: '🌿', mustTry: 'Tasting Menu', desc: 'Michelin Guide. Modern European.', michelin: true, stars: '⭐', book: 'https://www.palme-london.com', gmapUrl: 'https://maps.google.com/?q=Palme+London' },
    { id: 'core', name: 'Core by Clare Smyth', location: 'Notting Hill, London', cuisine: 'Modern British', cuisineType: 'british', diet: ['multi'], budget: 'luxury', rating: 4.9, price: '££££', emoji: '🌟', mustTry: 'Tasting Menu', desc: '3 Michelin stars. First British woman to hold 3 stars.', michelin: true, stars: '⭐⭐⭐', book: 'https://www.corebyclaresmyth.com', gmapUrl: 'https://maps.google.com/?q=Core+by+Clare+Smyth+London' },
    { id: 'trullo', name: 'Trullo', location: 'Islington, London', cuisine: 'Italian', cuisineType: 'italian', diet: ['multi'], budget: 'mid', rating: 4.7, price: '££', emoji: '🍝', mustTry: 'Pasta', desc: 'Michelin Bib Gourmand. Excellent pasta.', michelin: true, stars: '⭐', book: 'https://www.trullocafe.com', gmapUrl: 'https://maps.google.com/?q=Trullo+London' },
  ],

  // NEW YORK
  new_york: [
    { id: 'katz_deli', name: "Katz's Delicatessen", location: 'Lower East Side, NYC', cuisine: 'Jewish · Deli', cuisineType: 'american', diet: ['nonveg'], budget: 'mid', rating: 4.6, price: '$$', emoji: '🥪', mustTry: 'Pastrami Sandwich', desc: 'Since 1888. Famous from When Harry Met Sally.', michelin: false, book: 'https://www.katzsdelicatessen.com', gmapUrl: 'https://maps.google.com/?q=Katzs+Delicatessen+NYC' },
    { id: 'peter_luger', name: "Peter Luger", location: 'Williamsburg, Brooklyn', cuisine: 'Steakhouse', cuisineType: 'steakhouse', diet: ['nonveg'], budget: 'upscale', rating: 4.7, price: '$$$', emoji: '🥩', mustTry: 'Dry-Aged Steak', desc: 'Best steak in NYC since 1887. Cash only.', michelin: true, stars: '⭐', book: 'https://www.peterluger.com', gmapUrl: 'https://maps.google.com/?q=Peter+Luger+NYC' },
    { id: 'momofuku_ko', name: 'Momofuku Ko', location: 'East Village, NYC', cuisine: 'Modern Asian · Omakase', cuisineType: 'asian', diet: ['multi'], budget: 'luxury', rating: 4.8, price: '$$$', emoji: '🍜', mustTry: 'Tasting Menu', desc: 'David Chang. Michelin star. Only 8 seats.', michelin: true, stars: '⭐', book: 'https://momofukuko.com', gmapUrl: 'https://maps.google.com/?q=Momofuku+Ko+NYC' },
    { id: 'russ_daughters', name: "Russ & Daughters", location: 'Lower East Side, NYC', cuisine: 'Jewish · Appetizing', cuisineType: 'jewish', diet: ['nonveg'], budget: 'mid', rating: 4.7, price: '$$', emoji: '🥯', mustTry: 'Nova Scotia Salmon', desc: 'Since 1914. Best bagels and smoked fish.', michelin: false, book: 'https://www.russanddaughters.com', gmapUrl: 'https://maps.google.com/?q=Russ+And+Daughters+NYC' },
    { id: 'gran_electric', name: "Gramercy Tavern", location: 'Gramercy, NYC', cuisine: 'American · Tavern', cuisineType: 'american', diet: ['multi'], budget: 'upscale', rating: 4.7, price: '$$$', emoji: '🌿', mustTry: 'Apple Pie', desc: 'Michelin star. Danny Meyer\'s beloved NYC institution.', michelin: true, stars: '⭐', book: 'https://www.gramercytavern.com', gmapUrl: 'https://maps.google.com/?q=Gramercy+Tavern+NYC' },
    { id: 'carbone', name: 'Carbone', location: 'West Village, NYC', cuisine: 'Italian-American', cuisineType: 'italian', diet: ['nonveg'], budget: 'upscale', rating: 4.7, price: '$$$', emoji: '🍝', mustTry: 'Spaghetti alla Vigata', desc: 'Michelin star. Classic Italian-American. Book months ahead.', michelin: true, stars: '⭐', book: 'https://www.carbanenyc.com', gmapUrl: 'https://maps.google.com/?q=Carbone+NYC' },
    { id: 'jungsik', name: 'Jungsik', location: 'TriBeCa, NYC', cuisine: 'Korean Fine Dining', cuisineType: 'korean', diet: ['multi'], budget: 'luxury', rating: 4.9, price: '$$$$', emoji: '🇰🇷', mustTry: 'Kimbap Tasting', desc: '2 Michelin stars. Modern Korean cuisine.', michelin: true, stars: '⭐⭐', book: 'https://jungsik.com', gmapUrl: 'https://maps.google.com/?q=Jungsik+NYC' },
    { id: 'prince_street', name: "Prince Street Pizza", location: 'SoHo, NYC', cuisine: 'Pizza · Sicilian', cuisineType: 'italian', diet: ['nonveg'], budget: 'cheap', rating: 4.7, price: '$', emoji: '🍕', mustTry: 'Spicy Spring Square', desc: 'Best Sicilian pizza in NYC. Cash only.', michelin: false, book: 'https://www.princestreetpizza.com', gmapUrl: 'https://maps.google.com/?q=Prince+Street+Pizza+NYC' },
    { id: 'emporio', name: 'Emporio', location: 'Tribeca, NYC', cuisine: 'Italian · Grape', cuisineType: 'italian', diet: ['multi'], budget: 'upscale', rating: 4.6, price: '$$$', emoji: '🍷', mustTry: 'Cacio e Pepe', desc: 'Michelin Bib Gourmand. Roman pasta.', michelin: true, stars: '⭐', book: 'https://www.emporiony.com', gmapUrl: 'https://maps.google.com/?q=Emporio+NYC' },
    { id: 'balthazar', name: 'Balthazar', location: 'SoHo, NYC', cuisine: 'French · Brasserie', cuisineType: 'french', diet: ['multi'], budget: 'upscale', rating: 4.5, price: '$$$', emoji: '🥐', mustTry: 'Steak Frites', desc: 'Iconic French brasserie. Keith McNally.', michelin: false, book: 'https://www.balthazarny.com', gmapUrl: 'https://maps.google.com/?q=Balthazar+NYC' },
    { id: 'locanda', name: 'Locanda', location: 'West Village, NYC', cuisine: 'Italian', cuisineType: 'italian', diet: ['multi'], budget: 'upscale', rating: 4.7, price: '$$$', emoji: '🍝', mustTry: 'Tasting Menu', desc: 'Michelin star. Venetian cuisine.', michelin: true, stars: '⭐', book: 'https://www.locanda-nyc.com', gmapUrl: 'https://maps.google.com/?q=Locanda+NYC' },
    { id: 'estela', name: 'Estela', location: 'NoLIta, NYC', cuisine: 'Modern American', cuisineType: 'american', diet: ['multi'], budget: 'upscale', rating: 4.8, price: '$$$', emoji: '🌿', mustTry: 'Burrata', desc: 'Michelin star. Incredible small plates.', michelin: true, stars: '⭐', book: 'https://www.estelanyc.com', gmapUrl: 'https://maps.google.com/?q=Estela+NYC' },
    { id: 'nusr_et_nyc', name: 'Nusr-Et', location: 'Upper East Side, NYC', cuisine: 'Steakhouse', cuisineType: 'steakhouse', diet: ['nonveg'], budget: 'luxury', rating: 4.5, price: '$$$$', emoji: '🥩', mustTry: 'Gold Burger', desc: 'Salt Bae\'s famous restaurant.', michelin: false, book: 'https://www.nusr-et.com', gmapUrl: 'https://maps.google.com/?q=Nusr+Et+NYC' },
    { id: 'del_posto', name: 'Del Posto', location: 'Meatpacking, NYC', cuisine: 'Italian', cuisineType: 'italian', diet: ['multi'], budget: 'luxury', rating: 4.7, price: '$$$$', emoji: '🍝', mustTry: 'Tasting Menu', desc: 'Michelin star. Babbo owners.', michelin: true, stars: '⭐', book: 'https://www.delposto.com', gmapUrl: 'https://maps.google.com/?q=Del+Posto+NYC' },
    { id: 'don Angie', name: 'Don Angie', location: 'West Village, NYC', cuisine: 'Italian-American', cuisineType: 'italian', diet: ['nonveg'], budget: 'upscale', rating: 4.8, price: '$$$', emoji: '🍖', mustTry: 'Sausage Parm', desc: 'Michelin star. Italian-American comfort.', michelin: true, stars: '⭐', book: 'https://www.donangie.com', gmapUrl: 'https://maps.google.com/?q=Don+Angie+NYC' },
    { id: 'atomix', name: 'Atomix', location: 'Upper East Side, NYC', cuisine: 'Korean · Fine Dining', cuisineType: 'korean', diet: ['multi'], budget: 'luxury', rating: 4.9, price: '$$$$', emoji: '🌟', mustTry: 'Tasting Menu', desc: '2 Michelin stars. Korean fine dining.', michelin: true, stars: '⭐⭐', book: 'https://www.atomix.nyc', gmapUrl: 'https://maps.google.com/?q=Atomix+NYC' },
    { id: 'fraunces', name: 'Fraunces', location: 'Brooklyn, NYC', cuisine: 'American · Historic', cuisineType: 'american', diet: ['multi'], budget: 'upscale', rating: 4.7, price: '$$$', emoji: '🏛️', mustTry: 'Mussels', desc: 'Historic building. Excellent food.', michelin: false, book: 'https://www.frauncesrestaurant.com', gmapUrl: 'https://maps.google.com/?q=Fraunces+Brooklyn+NYC' },
    { id: 'tanoreen', name: 'Tanoreen', location: 'Bay Ridge, Brooklyn', cuisine: 'Middle Eastern · Palestinian', cuisineType: 'middle-eastern', diet: ['halal'], budget: 'mid', rating: 4.8, price: '$$', emoji: '🥙', mustTry: 'Maqluba', desc: 'Michelin star. Palestinian cuisine.', michelin: true, stars: '⭐', book: 'https://www.tanoreen.com', gmapUrl: 'https://maps.google.com/?q=Tanoreen+Brooklyn+NYC' },
    { id: 'le_reve', name: 'Le Reve', location: 'West Village, NYC', cuisine: 'French · Fine Dining', cuisineType: 'french', diet: ['multi'], budget: 'luxury', rating: 4.9, price: '$$$$', emoji: '✨', mustTry: 'Tasting Menu', desc: 'Michelin 2 stars. Exceptional French.', michelin: true, stars: '⭐⭐', book: 'https://www.lereve-nyc.com', gmapUrl: 'https://maps.google.com/?q=Le+Reve+NYC' },
    { id: 'viet_corn', name: 'Vietnamese Food', location: 'Multiple Locations, NYC', cuisine: 'Vietnamese', cuisineType: 'vietnamese', diet: ['veg'], budget: 'cheap', rating: 4.5, price: '$', emoji: '🍜', mustTry: 'Pho', desc: 'Best pho in NYC.', michelin: false, book: 'https://www.google.com/maps/search/pho+nyc', gmapUrl: 'https://maps.google.com/?q=Best+Pho+NYC' },
    { id: 'shake_shack', name: 'Shake Shack', location: 'Multiple Locations, NYC', cuisine: 'Burgers · Fast Food', cuisineType: 'american', diet: ['multi'], budget: 'cheap', rating: 4.4, price: '$', emoji: '🍔', mustTry: 'Shack Burger', desc: 'NYC-born burger chain. Now worldwide.', michelin: false, book: 'https://www.shakeshack.com', gmapUrl: 'https://maps.google.com/?q=Shake+Shack+NYC' },
    { id: 'nishi', name: 'Nishi', location: 'East Village, NYC', cuisine: 'Japanese · Italian Fusion', cuisineType: 'japanese', diet: ['nonveg'], budget: 'upscale', rating: 4.7, price: '$$$', emoji: '🍝', mustTry: 'Pizza Pasta', desc: 'Michelin star. Unique fusion.', michelin: true, stars: '⭐', book: 'https://www.momofuku.com', gmapUrl: 'https://maps.google.com/?q=Nishi+NYC' },
    { id: 'lilia', name: 'Lilia', location: 'Williamsburg, Brooklyn', cuisine: 'Italian', cuisineType: 'italian', diet: ['veg'], budget: 'upscale', rating: 4.8, price: '$$$', emoji: '🌿', mustTry: 'Cacio e Pepe', desc: 'Michelin star. Best pasta in Brooklyn.', michelin: true, stars: '⭐', book: 'https://www.lilialittleitaly.com', gmapUrl: 'https://maps.google.com/?q=Lilia+Brooklyn+NYC' },
    { id: 'masa', name: 'Masa', location: 'Time Warner Center, NYC', cuisine: 'Japanese · Omakase', cuisineType: 'japanese', diet: ['nonveg'], budget: 'luxury', rating: 4.9, price: '$$$$', emoji: '🍣', mustTry: 'Omakase', desc: '3 Michelin stars. Most expensive in NYC.', michelin: true, stars: '⭐⭐⭐', book: 'https://www.masa-nyc.com', gmapUrl: 'https://maps.google.com/?q=Masa+NYC' },
    { id: 'ichiran_nyc', name: 'Ichiban Ramen', location: 'Multiple Locations, NYC', cuisine: 'Ramen', cuisineType: 'japanese', diet: ['nonveg'], budget: 'mid', rating: 4.5, price: '$$', emoji: '🍜', mustTry: 'Tonkotsu Ramen', desc: 'Japanese ramen chain. Solo dining.', michelin: false, book: 'https://ichiranyc.com', gmapUrl: 'https://maps.google.com/?q=Ichiban+Ramen+NYC' },
    { id: 'veselka', name: 'Veselka', location: 'East Village, NYC', cuisine: 'Ukrainian', cuisineType: 'eastern-european', diet: ['multi'], budget: 'cheap', rating: 4.5, price: '$', emoji: '🥟', mustTry: 'Pierogies', desc: 'Since 1954. Best pierogies in NYC.', michelin: false, book: 'https://www.veselka.com', gmapUrl: 'https://maps.google.com/?q=Veselka+NYC' },
  ],

  // TOKYO
  tokyo: [
    { id: 'ichiran', name: 'Ichiran Ramen', location: 'Shibuya, Tokyo', cuisine: 'Ramen', cuisineType: 'japanese', diet: ['nonveg'], budget: 'cheap', rating: 4.6, price: '¥', emoji: '🍜', mustTry: 'Tonkotsu Ramen', desc: 'Solo dining booths. Famous customized ramen.', michelin: false, book: 'https://en.ichiran.com', gmapUrl: 'https://maps.google.com/?q=Ichiran+Shibuya+Tokyo' },
    { id: 'afuri', name: 'Afuri Ramen', location: 'Shibuya, Tokyo', cuisine: 'Yuzu Ramen', cuisineType: 'japanese', diet: ['veg'], budget: 'cheap', rating: 4.7, price: '¥', emoji: '🍋', mustTry: 'Yuzu Shio Ramen', desc: 'Light yuzu broth. Vegetarian option available.', michelin: false, book: 'https://afuri.com', gmapUrl: 'https://maps.google.com/?q=Afuri+Ramen+Tokyo' },
    { id: 'tsukiji_outer', name: 'Tsukiji Outer Market', location: 'Tsukiji, Tokyo', cuisine: 'Seafood · Market', cuisineType: 'japanese', diet: ['nonveg'], budget: 'mid', rating: 4.7, price: '¥¥', emoji: '🦐', mustTry: 'Fresh Sushi', desc: 'Freshest sushi breakfast before tourist crowds.', michelin: false, book: 'https://www.tsukiji.or.jp', gmapUrl: 'https://maps.google.com/?q=Tsukiji+Outer+Market+Tokyo' },
    { id: 'gonpachi', name: 'Gonpachi', location: 'Nishi-Azabu, Tokyo', cuisine: 'Izakaya · Traditional', cuisineType: 'japanese', diet: ['multi'], budget: 'mid', rating: 4.5, price: '¥¥', emoji: '🍶', mustTry: 'Handmade Soba', desc: 'The restaurant that inspired Kill Bill\'s iconic scene.', michelin: false, book: 'https://www.gonpachi.jp', gmapUrl: 'https://maps.google.com/?q=Gonpachi+Tokyo' },
    { id: 'tempura_kondo', name: 'Tempura Kondo', location: 'Ginza, Tokyo', cuisine: 'Tempura', cuisineType: 'japanese', diet: ['nonveg'], budget: 'luxury', rating: 4.9, price: '¥¥¥¥', emoji: '🍤', mustTry: 'Tempura Omakase', desc: 'Michelin star. Master Kondo\'s legendary tempura.', michelin: true, stars: '⭐', book: 'https://www.tempura-kondo.com', gmapUrl: 'https://maps.google.com/?q=Tempura+Kondo+Ginza+Tokyo' },
    { id: 'ginza_kojyu', name: 'Ginza Kojyu', location: 'Ginza, Tokyo', cuisine: 'Kaiseki', cuisineType: 'japanese', diet: ['multi'], budget: 'luxury', rating: 4.8, price: '¥¥¥¥', emoji: '🎋', mustTry: 'Seasonal Kaiseki', desc: 'Traditional kaiseki. 3 Michelin stars.', michelin: true, stars: '⭐⭐⭐', book: 'https://www.ginza-kojyu.com', gmapUrl: 'https://maps.google.com/?q=Ginza+Kojyu+Tokyo' },
    { id: 'maguro_abura', name: 'Maguro Abura Soba', location: 'Shinjuku, Tokyo', cuisine: 'Soba · Ramen', cuisineType: 'japanese', diet: ['nonveg'], budget: 'cheap', rating: 4.8, price: '¥', emoji: '🍜', mustTry: 'Red Dragon Ramen', desc: 'Famous red dragon ramen. Instagram-famous.', michelin: false, book: 'https://www.maguroboutique.com', gmapUrl: 'https://maps.google.com/?q=Maguro+Abura+Soba+Tokyo' },
    { id: 'sushi_kono', name: 'Sushi Kono', location: 'Shibuya, Tokyo', cuisine: 'Omakase Sushi', cuisineType: 'japanese', diet: ['nonveg', 'seafood'], budget: 'upscale', rating: 4.8, price: '¥¥¥', emoji: '🍣', mustTry: 'Omakase Course', desc: 'Michelin star. Excellent sushi.', michelin: true, stars: '⭐', book: 'https://www.sushikono.com', gmapUrl: 'https://maps.google.com/?q=Sushi+Kono+Tokyo' },
    { id: 'sukiyabashi_jiro', name: 'Sukiyabashi Jiro', location: 'Ginza, Tokyo', cuisine: 'Omakase Sushi', cuisineType: 'japanese', diet: ['nonveg', 'seafood'], budget: 'luxury', rating: 5.0, price: '¥¥¥¥', emoji: '🍣', mustTry: 'Omakase Course', desc: '3 Michelin stars. The sushi temple.', michelin: true, stars: '⭐⭐⭐', book: 'https://www.tableall.com', gmapUrl: 'https://maps.google.com/?q=Sukiyabashi+Jiro+Tokyo' },
    { id: 'narisawa_tokyo', name: 'Narisawa', location: 'Aoyama, Tokyo', cuisine: 'Innovative Japanese', cuisineType: 'japanese', diet: ['multi'], budget: 'luxury', rating: 4.9, price: '¥¥¥¥', emoji: '🌲', mustTry: 'Satoyama Tasting', desc: 'Asia\'s 50 Best. 2 Michelin stars.', michelin: true, stars: '⭐⭐', book: 'https://www.narisawa-yoshihiro.com', gmapUrl: 'https://maps.google.com/?q=Narisawa+Tokyo' },
    { id: 'den_tokyo', name: 'Den', location: 'Jingumae, Tokyo', cuisine: 'Modern Kaiseki', cuisineType: 'japanese', diet: ['multi'], budget: 'upscale', rating: 4.8, price: '¥¥¥', emoji: '🍶', mustTry: 'Kikunoi Course', desc: '2 Michelin stars. Chef Zaiyu Hasegawa.', michelin: true, stars: '⭐⭐', book: 'https://www.tokyo-dentle.com', gmapUrl: 'https://maps.google.com/?q=Den+Restaurant+Tokyo' },
    { id: 'florilege', name: 'Florilege', location: 'Shinjuku, Tokyo', cuisine: 'French-Japanese Fusion', cuisineType: 'french', diet: ['multi'], budget: 'luxury', rating: 4.9, price: '¥¥¥¥', emoji: '🌸', mustTry: 'Tasting Menu', desc: '2 Michelin stars. French-Japanese fusion.', michelin: true, stars: '⭐⭐', book: 'https://www.aoyama-florilege.jp', gmapUrl: 'https://maps.google.com/?q=Florilege+Tokyo' },
    { id: 'kyubey', name: 'Kyubey', location: 'Ginza, Tokyo', cuisine: 'Sushi', cuisineType: 'japanese', diet: ['nonveg', 'seafood'], budget: 'upscale', rating: 4.7, price: '¥¥¥', emoji: '🍣', mustTry: 'Omakase', desc: 'Ginza institution. High-quality sushi.', michelin: false, book: 'https://www.kyubey.info', gmapUrl: 'https://maps.google.com/?q=Kyubey+Ginza+Tokyo' },
    { id: 'tai_hen', name: 'Taihei Honten', location: 'Shibuya, Tokyo', cuisine: 'Tempura', cuisineType: 'japanese', diet: ['nonveg'], budget: 'upscale', rating: 4.8, price: '¥¥¥', emoji: '🍤', mustTry: 'Tempura Course', desc: 'Michelin star. Casual tempura.', michelin: true, stars: '⭐', book: 'https://www.taihei-honten.com', gmapUrl: 'https://maps.google.com/?q=Taihei+Honten+Tokyo' },
    { id: 'butagumi', name: 'Butagumi', location: 'Nishi-Azabu, Tokyo', cuisine: 'Tonkatsu', cuisineType: 'japanese', diet: ['nonveg'], budget: 'upscale', rating: 4.7, price: '¥¥¥', emoji: '🐖', mustTry: 'Rosu Katsu', desc: 'Best tonkatsu in Tokyo.', michelin: false, book: 'https://www.butagumi.com', gmapUrl: 'https://maps.google.com/?q=Butagumi+Tokyo' },
    { id: 'gombe', name: 'Gombe', location: 'Ginza, Tokyo', cuisine: 'Omakase', cuisineType: 'japanese', diet: ['nonveg'], budget: 'luxury', rating: 4.8, price: '¥¥¥¥', emoji: '🍣', mustTry: 'Omakase Course', desc: 'Michelin star. Intimate sushi counter.', michelin: true, stars: '⭐', book: 'https://www.gombe.jp', gmapUrl: 'https://maps.google.com/?q=Gombe+Tokyo' },
    { id: 'nakajima', name: 'Nakajima', location: 'Odaiba, Tokyo', cuisine: 'Kaiseki', cuisineType: 'japanese', diet: ['multi'], budget: 'luxury', rating: 4.9, price: '¥¥¥¥', emoji: '🎋', mustTry: 'Seasonal Kaiseki', desc: '3 Michelin stars. Exceptional kaiseki.', michelin: true, stars: '⭐⭐⭐', book: 'https://www.nakajima-seibu.co.jp', gmapUrl: 'https://maps.google.com/?q=Nakajima+Kaiseki+Tokyo' },
    { id: 'shinagawa', name: 'Shinagawa', location: 'Minato, Tokyo', cuisine: 'Sushi', cuisineType: 'japanese', diet: ['nonveg'], budget: 'upscale', rating: 4.7, price: '¥¥¥', emoji: '🍣', mustTry: 'Omakase', desc: 'Michelin star. Elegant sushi.', michelin: true, stars: '⭐', book: 'https://www.shinagawa-sushi.com', gmapUrl: 'https://maps.google.com/?q=Shinagawa+Sushi+Tokyo' },
    { id: 'torishige', name: 'Torishige', location: 'Shibuya, Tokyo', cuisine: 'Yakitori', cuisineType: 'japanese', diet: ['nonveg'], budget: 'mid', rating: 4.8, price: '¥¥', emoji: '🍢', mustTry: 'Premium Yakitori', desc: 'Michelin Bib Gourmand. Best yakitori.', michelin: true, stars: '⭐', book: 'https://www.torishige.jp', gmapUrl: 'https://maps.google.com/?q=Torishige+Tokyo' },
    { id: 'kushiage', name: 'Kushiage Kappo Yoshida', location: 'Ueno, Tokyo', cuisine: 'Kushiage', cuisineType: 'japanese', diet: ['nonveg'], budget: 'upscale', rating: 4.8, price: '¥¥¥', emoji: '🍢', mustTry: 'Kushiage Platter', desc: 'Michelin star. Best kushiage.', michelin: true, stars: '⭐', book: 'https://www.kushiage-yoshida.com', gmapUrl: 'https://maps.google.com/?q=Kushiage+Tokyo' },
    { id: 'omusubi', name: 'Omoide Yokocho', location: 'Shinjuku, Tokyo', cuisine: 'Yakitori · Bar', cuisineType: 'japanese', diet: ['nonveg'], budget: 'cheap', rating: 4.6, price: '¥', emoji: '🍢', mustTry: 'Yakitori', desc: 'Famous alley with tiny yakitori stalls.', michelin: false, book: 'https://www.google.com/maps/search/omusubi+ganbo+shinjuku', gmapUrl: 'https://maps.google.com/?q=Omoide+Yokocho+Tokyo' },
    { id: 'golden_gai', name: 'Golden Gai', location: 'Shinjuku, Tokyo', cuisine: 'Izakaya · Bar', cuisineType: 'japanese', diet: ['multi'], budget: 'mid', rating: 4.7, price: '¥¥', emoji: '🍶', mustTry: 'Various Small Dishes', desc: 'Famous alley with 200+ tiny bars.', michelin: false, book: 'https://www.google.com/maps/search/golden+gai+tokyo', gmapUrl: 'https://maps.google.com/?q=Golden+Gai+Tokyo' },
    { id: 'tokyo_base', name: 'Tokyo Station Ramen Street', location: 'Tokyo Station', cuisine: 'Ramen', cuisineType: 'japanese', diet: ['nonveg'], budget: 'cheap', rating: 4.5, price: '¥', emoji: '🍜', mustTry: 'Ramen Variety', desc: 'Underground ramen paradise.', michelin: false, book: 'https://www.tokyo-ramenso.com', gmapUrl: 'https://maps.google.com/?q=Tokyo+Station+Ramen+Street' },
    { id: 'harbs', name: 'Harbs', location: 'Multiple Locations, Tokyo', cuisine: 'Cafe · Desserts', cuisineType: 'dessert', diet: ['veg'], budget: 'mid', rating: 4.6, price: '¥¥', emoji: '🧁', mustTry: 'Huge Fruit Cake', desc: 'Legendary cakes. Always fresh.', michelin: false, book: 'https://harbs.co.jp', gmapUrl: 'https://maps.google.com/?q=Harbs+Tokyo' },
    { id: 'cremia', name: 'Cremia', location: 'Shibuya, Tokyo', cuisine: 'Ice Cream', cuisineType: 'dessert', diet: ['veg'], budget: 'mid', rating: 4.8, price: '¥', emoji: '🍦', mustTry: '15% Milk Soft Serve', desc: 'Best soft serve in Japan.', michelin: false, book: 'https://www.cremia.co.jp', gmapUrl: 'https://maps.google.com/?q=Cremia+Tokyo' },
    { id: 'tonkotsu', name: 'Fuunji', location: 'Shinjuku, Tokyo', cuisine: 'Tonkotsu Ramen', cuisineType: 'japanese', diet: ['nonveg'], budget: 'cheap', rating: 4.7, price: '¥', emoji: '🍜', mustTry: 'Kyushu Ramen', desc: 'Famous for tsukemen.', michelin: false, book: 'https:// fuunji.com', gmapUrl: 'https://maps.google.com/?q=Fuunji+Tokyo' },
  ],

  // SINGAPORE
  singapore: [
    { id: 'burnt_ends_sg', name: 'Burnt Ends', location: 'Tiong Bahru, Singapore', cuisine: 'Australian · BBQ', cuisineType: 'australian', diet: ['nonveg'], budget: 'upscale', rating: 4.8, price: '$$$', emoji: '🔥', mustTry: 'Smoked Beef Brisket', desc: 'Michelin star. Best BBQ in Asia.', michelin: true, stars: '⭐', book: 'https://www.burntends.com.sg', gmapUrl: 'https://maps.google.com/?q=Burnt+Ends+Singapore' },
    { id: 'hawker_chan', name: 'Hawker Chan', location: 'Chinatown, Singapore', cuisine: 'Soya Chicken · Hawker', cuisineType: 'chinese', diet: ['nonveg'], budget: 'cheap', rating: 4.7, price: '$', emoji: '🍗', mustTry: 'Soya Sauce Chicken Rice', desc: 'World\'s cheapest Michelin-starred meal.', michelin: true, stars: '⭐', book: 'https://www.liao-fan.com', gmapUrl: 'https://maps.google.com/?q=Hawker+Chan+Singapore' },
    { id: 'meta_sg', name: 'Meta', location: 'Keong Saik, Singapore', cuisine: 'Modern Asian', cuisineType: 'asian', diet: ['multi'], budget: 'upscale', rating: 4.8, price: '$$$', emoji: '🌟', mustTry: 'Korean Tasting Menu', desc: 'Michelin star. Modern Korean cuisine.', michelin: true, stars: '⭐', book: 'https://www.metarestaurant.sg', gmapUrl: 'https://maps.google.com/?q=Meta+Singapore' },
    { id: 'candlenut_sg', name: 'Candlenut', location: 'Transverse Building, Singapore', cuisine: 'Peranakan', cuisineType: 'singaporean', diet: ['multi'], budget: 'upscale', rating: 4.8, price: '$$$', emoji: '🫒', mustTry: 'Nonya Laksa', desc: 'Michelin star. World\'s only Peranakan star.', michelin: true, stars: '⭐', book: 'https://www.comohotels.com/metropolitan/singapore/dining/candlenut', gmapUrl: 'https://maps.google.com/?q=Candlenut+Singapore' },
    { id: 'les_marins', name: 'Les Marins', location: 'Amoy Street, Singapore', cuisine: 'French Seafood', cuisineType: 'french', diet: ['seafood'], budget: 'upscale', rating: 4.9, price: '$$$', emoji: '🦞', mustTry: 'Oyster Platter', desc: 'Michelin star. Best oysters in Singapore.', michelin: true, stars: '⭐', book: 'https://www.lesmarins.sg', gmapUrl: 'https://maps.google.com/?q=Les+Marins+Singapore' },
    { id: 'hill_street_sg', name: 'Hill Street Tai Hwa Pork Noodle', location: 'Bedok, Singapore', cuisine: 'Noodles · Hawker', cuisineType: 'singaporean', diet: ['nonveg'], budget: 'cheap', rating: 4.7, price: '$', emoji: '🍜', mustTry: 'Braised Pork Noodles', desc: 'Michelin star. Best noodle in Singapore.', michelin: true, stars: '⭐', book: 'https://www.google.com/maps/place/Hill+Street+Tai+Hwa+Pork+Noodle', gmapUrl: 'https://maps.google.com/?q=Hill+Street+Tai+Hwa+Pork+Noodle+Singapore' },
    { id: 'jaguars', name: 'Jaggi', location: 'Chinatown, Singapore', cuisine: 'Indian · North', cuisineType: 'indian', diet: ['halal'], budget: 'cheap', rating: 4.6, price: '$', emoji: '🍛', mustTry: 'Tandoori Chicken', desc: 'Famous for tandoori and biryani.', michelin: false, book: 'https://www.google.com/maps/search/Jaggi+Singapore', gmapUrl: 'https://maps.google.com/?q=Jaggi+Singapore' },
    { id: 'newton_sg', name: 'Newton Food Centre', location: 'Newton, Singapore', cuisine: 'Hawker · Local', cuisineType: 'singaporean', diet: ['nonveg'], budget: 'cheap', rating: 4.5, price: '$', emoji: '🥘', mustTry: 'Satay', desc: 'Famous hawker center. Best satay.', michelin: false, book: 'https://www.newtonfoodcentre.com', gmapUrl: 'https://maps.google.com/?q=Newton+Food+Centre+Singapore' },
    { id: 'lolla', name: 'Lolla', location: 'Tiong Bahru, Singapore', cuisine: 'Modern European', cuisineType: 'european', diet: ['multi'], budget: 'upscale', rating: 4.8, price: '$$$', emoji: '🌿', mustTry: 'Tasting Menu', desc: 'Michelin star. Spanish-inspired cuisine.', michelin: true, stars: '⭐', book: 'https://www.lolla.sg', gmapUrl: 'https://maps.google.com/?q=Lolla+Singapore' },
    { id: 'labyrinth', name: 'Labyrinth', location: 'Marina Bay, Singapore', cuisine: 'Modern Singaporean', cuisineType: 'singaporean', diet: ['multi'], budget: 'luxury', rating: 4.9, price: '$$$$', emoji: '🇸🇬', mustTry: 'Chilli Crab', desc: 'Michelin star. Modern Singaporean.', michelin: true, stars: '⭐', book: 'https://www.restaurantlabyrinth.com', gmapUrl: 'https://maps.google.com/?q=Labyrinth+Singapore' },
    { id: 'born', name: 'Born', location: 'Telok Ayer, Singapore', cuisine: 'Modern Chinese', cuisineType: 'chinese', diet: ['multi'], budget: 'upscale', rating: 4.8, price: '$$$', emoji: '🥢', mustTry: 'Tasting Menu', desc: 'Michelin star. Modern Chinese fine dining.', michelin: true, stars: '⭐', book: 'https://www.born.sg', gmapUrl: 'https://maps.google.com/?q=Born+Restaurant+Singapore' },
    { id: 'cheeky', name: 'Cheeky', location: 'Amoy Street, Singapore', cuisine: 'Modern European', cuisineType: 'european', diet: ['multi'], budget: 'upscale', rating: 4.7, price: '$$$', emoji: '🍷', mustTry: 'Tasting Menu', desc: 'Michelin star. Wine-focused dining.', michelin: true, stars: '⭐', book: 'https://www.cheekysg.com', gmapUrl: 'https://maps.google.com/?q=Cheeky+Singapore' },
    { id: 'sala', name: 'Sala', location: 'Geylang, Singapore', cuisine: 'Thai', cuisineType: 'thai', diet: ['nonveg'], budget: 'mid', rating: 4.6, price: '$$', emoji: '🍜', mustTry: 'Pad Thai', desc: 'Authentic Thai in Geylang.', michelin: false, book: 'https://www.google.com/maps/search/Sala+Thai+Singapore', gmapUrl: 'https://maps.google.com/?q=Sala+Thai+Singapore' },
    { id: 'jumbo', name: 'Jumbo Seafood', location: 'Clarke Quay, Singapore', cuisine: 'Seafood · Chilli Crab', cuisineType: 'seafood', diet: ['nonveg'], budget: 'upscale', rating: 4.5, price: '$$$', emoji: '🦀', mustTry: 'Chilli Crab', desc: 'Iconic for chilli crab.', michelin: false, book: 'https://www.jumboseafood.com.sg', gmapUrl: 'https://maps.google.com/?q=Jumbo+Seafood+Singapore' },
    { id: 'putien', name: 'Putien', location: 'Multiple Locations, Singapore', cuisine: 'Fujian', cuisineType: 'chinese', diet: ['nonveg'], budget: 'mid', rating: 4.6, price: '$$', emoji: '🥘', mustTry: 'Stir-fried Lor Mee', desc: 'Michelin Bib Gourmand. Fujian cuisine.', michelin: true, stars: '⭐', book: 'https://www.putien.com', gmapUrl: 'https://maps.google.com/?q=Putien+Singapore' },
    { id: 'tong_dim_sg', name: 'Tong Dim Shui Gek', location: 'Geylang, Singapore', cuisine: 'Teochew · Dessert', cuisineType: 'dessert', diet: ['veg'], budget: 'cheap', rating: 4.6, price: '$', emoji: '🍮', mustTry: 'Orh Nee', desc: 'Michelin Bib Gourmand. Best Teochew desserts.', michelin: true, stars: '⭐', book: 'https://www.tongdim.com', gmapUrl: 'https://maps.google.com/?q=Tong+Dim+Singapore' },
    { id: 'sushi_ride', name: 'Sushi Ride', location: 'Orchard, Singapore', cuisine: 'Japanese · Omakase', cuisineType: 'japanese', diet: ['nonveg'], budget: 'upscale', rating: 4.8, price: '$$$', emoji: '🍣', mustTry: 'Omakase', desc: 'Michelin star. Premium omakase.', michelin: true, stars: '⭐', book: 'https://www.sushiride.sg', gmapUrl: 'https://maps.google.com/?q=Sushi+Ride+Singapore' },
    { id: 'shin', name: 'Shin', location: 'Clarke Quay, Singapore', cuisine: 'Japanese · BBQ', cuisineType: 'japanese', diet: ['nonveg'], budget: 'upscale', rating: 4.7, price: '$$$', emoji: '🥩', mustTry: 'Wagyu BBQ', desc: 'Premium Japanese BBQ.', michelin: false, book: 'https://www.shin.oddlygood.com', gmapUrl: 'https://maps.google.com/?q=Shin+Restaurant+Singapore' },
    { id: 'national', name: 'National Kitchen', location: 'Clarke Quay, Singapore', cuisine: 'Peranakan · Singapore', cuisineType: 'singaporean', diet: ['multi'], budget: 'mid', rating: 4.6, price: '$$', emoji: '🏛️', mustTry: 'Kaya Toast', desc: 'By Singapore Marriott. Iconic dishes.', michelin: false, book: 'https://www.marriott.com/hotels/hotel-information/restaurant/sinsr-national-kitchen-by-villa-vanuatu/', gmapUrl: 'https://maps.google.com/?q=National+Kitchen+Singapore' },
    { id: 'astor', name: 'The Olde Circle', location: 'Tanjong Pagar, Singapore', cuisine: 'Peranakan', cuisineType: 'singaporean', diet: ['multi'], budget: 'upscale', rating: 4.7, price: '$$$', emoji: '🏠', mustTry: 'Peranakan Set', desc: 'Authentic Peranakan cuisine.', michelin: false, book: 'https://www.theoldecircle.com', gmapUrl: 'https://maps.google.com/?q=The+Olde+Circle+Singapore' },
    { id: 'hawker_bee_sg', name: 'Liao Fan Hong Kong Soya', location: 'Chinatown, Singapore', cuisine: 'Chicken Rice', cuisineType: 'chinese', diet: ['nonveg'], budget: 'cheap', rating: 4.6, price: '$', emoji: '🍗', mustTry: 'Soya Chicken Rice', desc: 'Michelin star. Affordable.', michelin: true, stars: '⭐', book: 'https://www.liao-fan.com', gmapUrl: 'https://maps.google.com/?q=Liao+Fan+Singapore' },
    { id: 'marrow', name: 'Marrow', location: 'Tiong Bahru, Singapore', cuisine: 'Modern European', cuisineType: 'european', diet: ['multi'], budget: 'upscale', rating: 4.9, price: '$$$', emoji: '🦴', mustTry: 'Tasting Menu', desc: 'Michelin star. Nose-to-tail dining.', michelin: true, stars: '⭐', book: 'https://www.marrow.sg', gmapUrl: 'https://maps.google.com/?q=Marrow+Singapore' },
    { id: 'spice', name: 'Spice', location: 'Marina Bay Sands, Singapore', cuisine: 'Multi-cuisine', cuisineType: 'multi', diet: ['multi'], budget: 'upscale', rating: 4.6, price: '$$$', emoji: '🌶️', mustTry: 'Indian Spread', desc: 'At Marina Bay Sands. Great Indian.', michelin: false, book: 'https://www.marinabaysands.com', gmapUrl: 'https://maps.google.com/?q=Spice+Restaurant+Marina+Bay+Singapore' },
    { id: 'seamus', name: 'Seamus', location: 'Tiong Bahru, Singapore', cuisine: 'Modern European', cuisineType: 'european', diet: ['multi'], budget: 'upscale', rating: 4.8, price: '$$$', emoji: '🐟', mustTry: 'Seafood', desc: 'Michelin star. Chef\'s table experience.', michelin: true, stars: '⭐', book: 'https://www.seamus.sg', gmapUrl: 'https://maps.google.com/?q=Seamus+Singapore' },
    { id: 'nduja', name: 'Nduja', location: 'Tiong Bahru, Singapore', cuisine: 'Italian', cuisineType: 'italian', diet: ['nonveg'], budget: 'mid', rating: 4.7, price: '$$', emoji: '🍕', mustTry: 'Wood-fired Pizza', desc: 'Michelin Bib Gourmand. Great pizza.', michelin: true, stars: '⭐', book: 'https://www.nduja.sg', gmapUrl: 'https://maps.google.com/?q=Nduja+Singapore' },
    { id: 'cote', name: "Cote", location: 'Amoy Street, Singapore', cuisine: 'Korean · BBQ', cuisineType: 'korean', diet: ['nonveg'], budget: 'upscale', rating: 4.8, price: '$$$', emoji: '🥩', mustTry: 'Korean BBQ Set', desc: 'Michelin star. Premium Korean BBQ.', michelin: true, stars: '⭐', book: 'https://www.cote.sg', gmapUrl: 'https://maps.google.com/?q=Cote+Singapore' },
  ],
}

// FOOD TIPS
export const FOOD_TIPS = [
  { icon: '🍽️', title: 'Eat Where Locals Eat', desc: 'Follow the crowd. Long queues usually mean great food. If locals are eating there, it\'s usually authentic.' },
  { icon: '🕐', title: 'Time Your Meals', desc: 'In many countries, lunch is the main meal with discounts. Dinner is pricier. Breakfast spots close early.' },
  { icon: '💰', title: 'Carry Cash', desc: 'Many local restaurants, markets, and street food vendors in Asia don\'t accept cards. Always carry local currency.' },
  { icon: '🚰', title: 'Tap Water Warning', desc: 'In developing countries, drink bottled water only. Avoid ice in drinks unless you\'re sure it\'s purified.' },
  { icon: '🌶️', title: 'Spice Levels', desc: 'Start mild when trying new cuisines. You can always add spice, but you can\'t remove it!' },
  { icon: '📱', title: 'Use Food Apps', desc: 'Zomato (India), Tabelog (Japan), TripAdvisor, and Google Maps reviews help find real gems.' },
  { icon: '⏰', title: 'Book Ahead', desc: 'For Michelin-starred or famous restaurants, book weeks or months in advance online.' },
  { icon: '🍜', title: 'Try Street Food Safely', desc: 'Look for high turnover - fresh oil, busy stalls, and locals eating. Avoid food that\'s been sitting out.' },
  { icon: '🙏', title: 'Dietary Restrictions', desc: 'Learn key phrases: "Vegetarian" (no meat), "Vegan" (no animal products), "Halal" (Islamic diet), "Kosher" (Jewish diet).' },
  { icon: '🧾', title: 'Check Reviews First', desc: 'Look at recent reviews (last 3 months) for the most accurate picture of current quality.' },
  { icon: '📍', title: 'Location Matters', desc: 'Restaurants in tourist areas are usually overpriced. Walk 2-3 blocks away for better prices and authentic food.' },
  { icon: '🥢', title: 'Use Chopsticks', desc: 'In Asia, finishing all your rice shows the meal was good. Leaving some rice is polite in Japan.' },
]

// BOOKING PLATFORMS BY COUNTRY
export const BOOKING_PLATFORMS: Record<string, { name: string; url: string; icon: string }[]> = {
  'India': [
    { name: 'Zomato', url: 'https://www.zomato.com', icon: '🟠' },
    { name: 'Dineout', url: 'https://www.dineout.co.in', icon: '🍴' },
    { name: 'EazyDiner', url: 'https://www.eazydiner.com', icon: '✨' },
    { name: 'BookMyTable', url: 'https://www.bookmytable.com', icon: '📅' },
  ],
  'USA': [
    { name: 'OpenTable', url: 'https://www.opentable.com', icon: '🍽️' },
    { name: 'Resy', url: 'https://www.resy.com', icon: '📅' },
    { name: 'Yelp', url: 'https://www.yelp.com', icon: '⭐' },
    { name: 'Tock', url: 'https://www.exploretock.com', icon: '🎫' },
  ],
  'UK': [
    { name: 'OpenTable', url: 'https://www.opentable.com', icon: '🍽️' },
    { name: 'TheFork', url: 'https://www.thefork.co.uk', icon: '🍴' },
    { name: 'TripAdvisor', url: 'https://www.tripadvisor.com', icon: '✈️' },
    { name: 'Quandoo', url: 'https://www.quandoo.co.uk', icon: '📍' },
  ],
  'France': [
    { name: 'TheFork', url: 'https://www.thefork.com', icon: '🍴' },
    { name: 'TripAdvisor', url: 'https://www.tripadvisor.com', icon: '✈️' },
    { name: 'LaFourchette', url: 'https://www.lafourchette.com', icon: '🍽️' },
    { name: 'Google Reserve', url: 'https://restaurants.google.com', icon: '📍' },
  ],
  'Japan': [
    { name: 'Tabelog', url: 'https://tabelog.com', icon: '🍜' },
    { name: 'Retty', url: 'https://retty.me', icon: '⭐' },
    { name: 'Hot Pepper Beauty', url: 'https://www.hotpepper.jp', icon: '🌶️' },
    { name: 'Omakase', url: 'https://www.omakase.co.jp', icon: '🍣' },
  ],
  'Thailand': [
    { name: 'TheFork', url: 'https://www.thefork.com', icon: '🍴' },
    { name: 'Wongnai', url: 'https://www.wongnai.com', icon: '🍛' },
    { name: 'TripAdvisor', url: 'https://www.tripadvisor.com', icon: '✈️' },
    { name: 'Google Reserve', url: 'https://restaurants.google.com', icon: '📍' },
  ],
  'Singapore': [
    { name: 'Chope', url: 'https://www.chope.co', icon: '🍽️' },
    { name: 'Burpple', url: 'https://www.burpple.com', icon: '✨' },
    { name: 'TripAdvisor', url: 'https://www.tripadvisor.com', icon: '✈️' },
    { name: 'WhenNow', url: 'https://www.whennow.com', icon: '📅' },
  ],
  'UAE': [
    { name: 'TheFork', url: 'https://www.thefork.ae', icon: '🍴' },
    { name: 'Zomato UAE', url: 'https://www.zomato.ae', icon: '🟠' },
    { name: 'TripAdvisor', url: 'https://www.tripadvisor.com', icon: '✈️' },
    { name: 'Google Reserve', url: 'https://restaurants.google.com', icon: '📍' },
  ],
  'Italy': [
    { name: 'TheFork', url: 'https://www.thefork.com', icon: '🍴' },
    { name: 'Gambero Rosso', url: 'https://www.gamberorosso.it', icon: '🍝' },
    { name: 'TripAdvisor', url: 'https://www.tripadvisor.com', icon: '✈️' },
    { name: 'Google Reserve', url: 'https://restaurants.google.com', icon: '📍' },
  ],
  'Spain': [
    { name: 'ElTenedor', url: 'https://www.eltenedor.com', icon: '🍴' },
    { name: 'TheFork', url: 'https://www.thefork.com', icon: '🍽️' },
    { name: 'TripAdvisor', url: 'https://www.tripadvisor.com', icon: '✈️' },
    { name: 'Google Reserve', url: 'https://restaurants.google.com', icon: '📍' },
  ],
  'Global': [
    { name: 'TripAdvisor', url: 'https://www.tripadvisor.com', icon: '✈️' },
    { name: 'Google Maps', url: 'https://maps.google.com', icon: '📍' },
    { name: 'Yelp', url: 'https://www.yelp.com', icon: '⭐' },
    { name: 'TheFork', url: 'https://www.thefork.com', icon: '🍴' },
  ],
}

// DELIVERY PLATFORMS
export const DELIVERY_PLATFORMS: Record<string, { name: string; url: string; icon: string }[]> = {
  'India': [
    { name: 'Zomato', url: 'https://www.zomato.com', icon: '🟠' },
    { name: 'Swiggy', url: 'https://www.swiggy.com', icon: '🟡' },
    { name: 'Dominos', url: 'https://www.dominos.co.in', icon: '🍕' },
    { name: 'Pizza Hut', url: 'https://www.pizzahut.co.in', icon: '🍕' },
  ],
  'USA': [
    { name: 'DoorDash', url: 'https://www.doordash.com', icon: '🟠' },
    { name: 'Uber Eats', url: 'https://www.ubereats.com', icon: '⚫' },
    { name: 'Grubhub', url: 'https://www.grubhub.com', icon: '🟢' },
    { name: 'Seamless', url: 'https://www.seamless.com', icon: '🔵' },
  ],
  'UK': [
    { name: 'Deliveroo', url: 'https://www.deliveroo.co.uk', icon: '🟢' },
    { name: 'Uber Eats', url: 'https://www.ubereats.com', icon: '⚫' },
    { name: 'Just Eat', url: 'https://www.justeat.co.uk', icon: '🟠' },
    { name: 'Oddbox', url: 'https://www.oddbox.co.uk', icon: '🥬' },
  ],
  'UAE': [
    { name: 'Talabat', url: 'https://www.talabat.com', icon: '🟠' },
    { name: 'Deliveroo UAE', url: 'https://www.deliveroo.ae', icon: '🟢' },
    { name: 'Noon Food', url: 'https://www.noon.com/food', icon: '🟡' },
    { name: 'Carriage', url: 'https://www.carriage.ae', icon: '🍽️' },
  ],
  'Singapore': [
    { name: 'GrabFood', url: 'https://www.grab.com/sg/food/', icon: '🟢' },
    { name: 'Foodpanda', url: 'https://www.foodpanda.sg', icon: '🟠' },
    { name: 'Deliveroo SG', url: 'https://www.deliveroo.com.sg', icon: '🔵' },
    { name: 'gogo', url: 'https://www.gogo.com/sg/food', icon: '🍱' },
  ],
  'Thailand': [
    { name: 'GrabFood TH', url: 'https://www.grab.com/th/food/', icon: '🟢' },
    { name: 'Foodpanda', url: 'https://www.foodpanda.co.th', icon: '🟠' },
    { name: 'Lineman', url: 'https://www.linemanapp.com', icon: '🟡' },
    { name: 'Get', url: 'https://www.get.com/th/food/', icon: '🍜' },
  ],
  'Japan': [
    { name: 'Uber Eats JP', url: 'https://www.ubereats.com/jp', icon: '⚫' },
    { name: 'Demae-can', url: 'https://www.demae-can.com', icon: '🍜' },
    { name: 'Rakuten Delivery', url: 'https://delivery.rakuten.co.jp', icon: '🔴' },
    { name: 'Pay Eats', url: 'https://www.paypay.ne.jp/shopei', icon: '💴' },
  ],
  'Global': [
    { name: 'Uber Eats', url: 'https://www.ubereats.com', icon: '⚫' },
    { name: 'DoorDash', url: 'https://www.doordash.com', icon: '🟠' },
    { name: 'Google Maps', url: 'https://maps.google.com', icon: '📍' },
    { name: 'Grab', url: 'https://www.grab.com', icon: '🟢' },
  ],
}

// CUISINE TYPES
export const CUISINE_TYPES = [
  { id: 'all', name: 'All Cuisines', emoji: '🍽️' },
  { id: 'indian', name: 'Indian', emoji: '🇮🇳' },
  { id: 'italian', name: 'Italian', emoji: '🇮🇹' },
  { id: 'japanese', name: 'Japanese', emoji: '🇯🇵' },
  { id: 'chinese', name: 'Chinese', emoji: '🇨🇳' },
  { id: 'thai', name: 'Thai', emoji: '🇹🇭' },
  { id: 'french', name: 'French', emoji: '🇫🇷' },
  { id: 'mexican', name: 'Mexican', emoji: '🇲🇽' },
  { id: 'american', name: 'American', emoji: '🇺🇸' },
  { id: 'korean', name: 'Korean', emoji: '🇰🇷' },
  { id: 'middle-eastern', name: 'Middle Eastern', emoji: '🥙' },
  { id: 'seafood', name: 'Seafood', emoji: '🦐' },
  { id: 'cafe', name: 'Cafe', emoji: '☕' },
  { id: 'vegetarian', name: 'Vegetarian', emoji: '🥗' },
  { id: 'vegan', name: 'Vegan', emoji: '🌱' },
  { id: 'street-food', name: 'Street Food', emoji: '🍢' },
]

// BUDGET LEVELS
export const BUDGET_LEVELS = [
  { id: 'all', name: 'Any Budget', emoji: '💰' },
  { id: 'cheap', name: 'Budget Friendly', emoji: '💵' },
  { id: 'mid', name: 'Mid-Range', emoji: '💶' },
  { id: 'upscale', name: 'Upscale', emoji: '💷' },
  { id: 'luxury', name: 'Luxury', emoji: '💎' },
]

// DIETARY OPTIONS
export const DIETARY_OPTIONS = [
  { id: 'all', name: 'All', emoji: '🍽️' },
  { id: 'veg', name: 'Vegetarian', emoji: '🥬' },
  { id: 'nonveg', name: 'Non-Veg', emoji: '🍖' },
  { id: 'vegan', name: 'Vegan', emoji: '🌱' },
  { id: 'halal', name: 'Halal', emoji: '☪️' },
]

// SEARCH FUNCTION
export function searchRestaurants(query: string, cityId?: string): Restaurant[] {
  const lowerQuery = query.toLowerCase()
  
  let results: Restaurant[] = []
  
  if (cityId && RESTAURANTS_BY_CITY[cityId]) {
    results = RESTAURANTS_BY_CITY[cityId]
  } else {
    Object.values(RESTAURANTS_BY_CITY).forEach(cityRestaurants => {
      results.push(...cityRestaurants)
    })
  }
  
  return results.filter(r => 
    r.name.toLowerCase().includes(lowerQuery) ||
    r.cuisine.toLowerCase().includes(lowerQuery) ||
    r.location.toLowerCase().includes(lowerQuery) ||
    r.desc.toLowerCase().includes(lowerQuery) ||
    r.mustTry?.toLowerCase().includes(lowerQuery)
  )
}

export function getRestaurantsByCity(cityId: string): Restaurant[] {
  return RESTAURANTS_BY_CITY[cityId] || []
}

export function getAllRestaurants(): Restaurant[] {
  const all: Restaurant[] = []
  Object.values(RESTAURANTS_BY_CITY).forEach(cityRestaurants => {
    all.push(...cityRestaurants)
  })
  return all
}

export function getFeaturedRestaurants(): Restaurant[] {
  const all = getAllRestaurants()
  return all.filter(r => r.rating >= 4.7).sort((a, b) => b.rating - a.rating).slice(0, 30)
}

export function getMichelinRestaurants(): Restaurant[] {
  const all = getAllRestaurants()
  return all.filter(r => r.michelin)
}
