  'use client'
  import { useState, useEffect, useCallback } from 'react'
  import { useRouter } from 'next/navigation'

  // ─── THEME ────────────────────────────────────────────────────────────────────
  const C='#63d2ff', G='#ffb74d', BG='#020810', BG2='#060d1a', GR='#4cff91'

  // ─── TYPES ────────────────────────────────────────────────────────────────────
  type Budget = 'low'|'mid'|'high'
  type TripType = 'india'|'intl'

  interface Destination {
    name: string
    state?: string
    country?: string
    flag: string
    tags: string[]
    img: string
    budget?: {low:number,mid:number,high:number}
    dayRate?: {low:number,mid:number,high:number}
    highlights: string[]
    food: string[]
    hotels: {low:string,mid:string,high:string}
    transport: string
    bestTime: string
    emergency: string
    packing: string[]
    region?: string
  }

  // ─── 100 INDIA DESTINATIONS ───────────────────────────────────────────────────
  const INDIA: Destination[] = [
    {name:'Goa',state:'Goa',flag:'🏖️',tags:['Beach','Nightlife','Party'],img:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=70',budget:{low:1200,mid:2800,high:6000},highlights:['Baga Beach at sunrise','Fort Aguada sunset','Dudhsagar Falls trek','Old Goa heritage churches','Anjuna flea market Wednesdays','Chapora Fort panoramic view'],food:['Fish Curry Rice','Bebinca dessert','Prawn Balchão','Goan Vindaloo','Feni cocktails'],hotels:{low:'Zostel Goa',mid:'Park Regis Goa',high:'The Leela Goa'},transport:'Rent a scooter ₹300/day or hire taxi',bestTime:'Nov–Mar',emergency:'Goa Police: 100 | Tourist Helpline: 1800-233-0101',packing:['Sunscreen SPF50+','Swimwear','Light cotton clothes','Waterproof sandals','Dry bag']},
    {name:'Mumbai',state:'Maharashtra',flag:'🏙️',tags:['City','Food','Culture'],img:'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400&q=70',budget:{low:1500,mid:3500,high:9000},highlights:['Gateway of India dawn walk','Marine Drive evening','Dharavi real tour','Elephanta Caves ferry','Juhu Beach sunset','Film City Bollywood tour'],food:['Vada Pav','Pav Bhaji','Bhel Puri','Keema Pav','Mutton Biryani'],hotels:{low:'Backpacker Panda',mid:'Trident Nariman Point',high:'Taj Mahal Palace'},transport:'Local train ₹10-50 or Ola/Uber',bestTime:'Oct–Mar',emergency:'Mumbai Police: 100 | Coast Guard: 1554',packing:['Umbrella','Comfortable shoes','Warm layer for AC','ID proof','Power bank']},
    {name:'Delhi',state:'Delhi',flag:'🏛️',tags:['Heritage','Food','History'],img:'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=70',budget:{low:1200,mid:3000,high:8000},highlights:['Red Fort at sunrise','Qutub Minar complex','India Gate evening','Humayun Tomb gardens','Chandni Chowk food trail','Lotus Temple meditation'],food:['Chole Bhature','Paranthe Wali Gali breakfast','Dilli 6 Kebabs','Butter Chicken','Jalebi'],hotels:{low:'Moustache Hostel',mid:'The Lalit',high:'Taj Mahal Hotel Delhi'},transport:'Metro ₹10-60 or autorickshaw',bestTime:'Oct–Mar',emergency:'Delhi Police: 100 | Women Helpline: 181',packing:['Warm clothes Dec-Jan','Good walking shoes','Anti-pollution mask','Sunscreen','Water bottle']},
    {name:'Jaipur',state:'Rajasthan',flag:'🏰',tags:['Heritage','Culture','Desert'],img:'https://images.unsplash.com/photo-1477587458883-47145ed6979e?w=400&q=70',budget:{low:1000,mid:2500,high:7000},highlights:['Amber Fort elephant ride','Hawa Mahal photography','City Palace museum','Nahargarh Fort sunset','Jantar Mantar UNESCO','Johari Bazaar gems shopping'],food:['Dal Baati Churma','Laal Maas','Ghevar sweets','Kachori Sabzi','Lassi'],hotels:{low:'Zostel Jaipur',mid:'Pearl Palace Heritage',high:'Taj Jai Mahal Palace'},transport:'Tuk-tuk ₹50-200 or Jeep for forts',bestTime:'Oct–Mar',emergency:'Rajasthan Police: 100 | Tourist: 0141-2744999',packing:['Light cotton','Sunscreen','Comfortable sandals','Scarf for temples','Camera']},
    {name:'Kerala',state:'Kerala',flag:'🌿',tags:['Nature','Backwaters','Ayurveda'],img:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=70',budget:{low:1200,mid:3000,high:8000},highlights:['Alleppey houseboat overnight','Munnar tea estate walk','Varkala cliff sunset','Periyar wildlife safari','Kovalam beach yoga','Athirapally waterfalls'],food:['Kerala Sadya on banana leaf','Appam with Stew','Fish Molee','Puttu Kadala','Karimeen Pollichathu'],hotels:{low:'Bamboo House',mid:'Spice Village Thekkady',high:'Marari Beach Resort'},transport:'KSRTC buses or houseboats',bestTime:'Sep–Mar',emergency:'Kerala Police: 100 | Tourist: 1800-425-4747',packing:['Light clothes','Mosquito repellent','Rain jacket','Sandals','Sunscreen']},
    {name:'Manali',state:'Himachal Pradesh',flag:'🏔️',tags:['Mountains','Adventure','Snow'],img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70',budget:{low:900,mid:2200,high:6000},highlights:['Rohtang Pass snowfield','Solang Valley cable car','Hadimba Temple forest','Old Manali cafés','Beas River white-water rafting','Kullu Valley apple orchards'],food:['Trout Fish Curry','Siddu bread','Dham feast','Madra chickpea','Thenthuk noodle soup'],hotels:{low:'Snow Valley Hostel',mid:'Hotel Rohtang Retreat',high:'Span Resort & Spa'},transport:'Tempo traveller or rent bike ₹500/day',bestTime:'Mar–Jun & Sep–Nov',emergency:'HP Police: 100 | Mountain Rescue: 01902-252706',packing:['Heavy woolens','Snow boots','Thermal inner wear','Lip balm','Altitude pills']},
    {name:'Leh-Ladakh',state:'J&K',flag:'🗻',tags:['Adventure','Desert','Monasteries'],img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',budget:{low:1500,mid:3500,high:9000},highlights:['Pangong Lake colour change','Nubra Valley camel safari','Khardung La highest motor road','Hemis Monastery festival','Magnetic Hill illusion','Tso Moriri bird lake'],food:['Thukpa noodle soup','Steamed Momos','Skyu pasta stew','Butter Tea','Tsampa roasted barley'],hotels:{low:'Kanger Valley Hostel',mid:'The Grand Dragon',high:'Chamba Camp Thiksey'},transport:'Royal Enfield ₹800-1200/day or shared jeep',bestTime:'Jun–Sep only',emergency:'Leh Police: 01982-252018 | Army Medical: 01982-252114',packing:['Down jacket','Altitude sickness pills','UV sunglasses','Trekking boots','Emergency kit']},
    {name:'Agra',state:'Uttar Pradesh',flag:'🕌',tags:['Heritage','Taj Mahal','History'],img:'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=70',budget:{low:800,mid:2000,high:5500},highlights:['Taj Mahal at sunrise','Agra Fort ramparts','Fatehpur Sikri ghost city','Mehtab Bagh Taj view','Itmad-ud-Daulah Baby Taj','Keetham Lake bird watching'],food:['Petha candy','Dalmoth snack','Bedai poori','Mughlai Biryani','Jalebi'],hotels:{low:'Tourists Rest House',mid:'ITC Mughal',high:'Oberoi Amarvilas'},transport:'E-rickshaw ₹50-200 or autorickshaw',bestTime:'Oct–Mar',emergency:'UP Police: 100 | Tourist Police: 0562-2421204',packing:['Comfortable walking shoes','Light clothes','Camera','Photo ID for Taj','Water bottle']},
    {name:'Varanasi',state:'Uttar Pradesh',flag:'🕯️',tags:['Spiritual','Ghats','Culture'],img:'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=400&q=70',budget:{low:700,mid:1800,high:4500},highlights:['Dashashwamedh Ghat Aarti at dusk','Sarnath deer park','Boat ride at 5am sunrise','Kashi Vishwanath temple','Ramnagar Fort museum','Assi Ghat yoga morning'],food:['Baati Chokha','Kachori Sabzi breakfast','Thandai milk drink','Chena Dahi Vada','Malaiyo winter dessert'],hotels:{low:'Stops Hostel',mid:'Hotel Surya',high:'Taj Ganges'},transport:'Cycle rickshaw or boat on Ganges',bestTime:'Oct–Mar',emergency:'UP Police: 100 | Ghat Patrol: 0542-2508045',packing:['Modest clothing for temples','Sandals for ghats','Mosquito repellent','Rain jacket','Camera']},
    {name:'Darjeeling',state:'West Bengal',flag:'☕',tags:['Tea','Mountains','Nature'],img:'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=70',budget:{low:800,mid:2000,high:5000},highlights:['Tiger Hill Kanchenjunga sunrise','Toy train UNESCO ride','Tea estate plucking tour','Batasia Loop garden','Peace Pagoda walk','Singalila Ridge winter trek'],food:['First Flush Darjeeling tea','Steamed Momos','Thukpa noodles','Gundruk fermented soup','Sel Roti rice donut'],hotels:{low:'Zostel Darjeeling',mid:'Cedar Inn',high:'Glenburn Tea Estate'},transport:'Shared jeep ₹100-200 or toy train',bestTime:'Mar–May & Sep–Nov',emergency:'WB Police: 100 | Tourist: 1800-345-0001',packing:['Warm layers','Rain jacket','Trekking shoes','Binoculars','Camera']},
    {name:'Rishikesh',state:'Uttarakhand',flag:'🧘',tags:['Spiritual','Adventure','Yoga'],img:'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=400&q=70',budget:{low:700,mid:1800,high:4500},highlights:['Lakshman Jhula bridge','Ganga Aarti ceremony 6pm','White-water rafting Grade 3-4','Neer Garh waterfall hike','Beatles Ashram ruins','Jumpin Heights bungee'],food:['Aloo Puri breakfast','Kadhi Chawal','Chole Bhature','Banana Lassi','Ginger Lemon Tea'],hotels:{low:'Zostel Rishikesh',mid:'Aloha on the Ganges',high:'Ananda in the Himalayas'},transport:'Auto-rickshaw or walk (town is compact)',bestTime:'Sep–Jun',emergency:'Uttarakhand Police: 100 | River Rescue: 135-2430280',packing:['Quick-dry clothes','River sandals','Yoga mat','Insect repellent','Sun protection']},
    {name:'Udaipur',state:'Rajasthan',flag:'🏯',tags:['Lake','Romance','Heritage'],img:'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=400&q=70',budget:{low:1100,mid:2800,high:7500},highlights:['City Palace museum rooftop','Lake Pichola evening boat','Jag Mandir island lunch','Saheliyon ki Bari fountain garden','Monsoon Palace hilltop sunset','Bagore Ki Haveli dance show'],food:['Dal Baati traditional','Mawa Kachori sweets','Ghevar festival sweet','Gatte ki Sabzi','Rajasthani Thali'],hotels:{low:'Bunkyard Hostel',mid:'Fateh Prakash Palace',high:'Taj Lake Palace'},transport:'Tuk-tuk ₹50-150 or boat on Pichola',bestTime:'Sep–Mar',emergency:'Rajasthan Police: 100',packing:['Evening wear','Light cotton','Camera','Sunscreen','Comfortable sandals']},
    {name:'Mysore',state:'Karnataka',flag:'👑',tags:['Palace','Culture','Food'],img:'https://images.unsplash.com/photo-1600019248680-a5a2e501fa82?w=400&q=70',budget:{low:800,mid:2000,high:5000},highlights:['Mysore Palace lit Sunday evenings','Chamundi Hills 1000 steps','Brindavan Gardens fountain show','Somnathpur Hoysala temple','Devaraja Market spices','Zoo ranked best in India'],food:['Mysore Pak sweet','Masala Dosa with ghee','Bisi Bele Bath','Mysore Sandesh','South Indian Filter Coffee'],hotels:{low:'Hotel Siddhartha',mid:'Royal Orchid Metropole',high:'Radisson Blu Mysore'},transport:'City bus ₹15-30 or autorickshaw',bestTime:'Oct–Feb',emergency:'Karnataka Police: 100',packing:['Modest clothes for palace','Comfortable shoes','Camera','Light layers','Water bottle']},
    {name:'Coorg',state:'Karnataka',flag:'🌱',tags:['Coffee','Nature','Hills'],img:'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=400&q=70',budget:{low:1000,mid:2500,high:6500},highlights:['Abbey Falls monsoon roar','Raja Seat sunset viewpoint','Coffee estate guided walk','Namdroling Golden Temple','Pushpagiri peak trek','Iruppu Falls pilgrimage'],food:['Pandi Curry pork','Akki Roti rice flatbread','Kadumbuttu rice balls','Coorg Filter Coffee','Bamboo Shoot Curry'],hotels:{low:'Coorg Jungle Camp',mid:'Alath-Cad Jungle Lodge',high:'Orange County Resort'},transport:'Hire Innova ₹2500/day or self-drive',bestTime:'Oct–Apr',emergency:'Karnataka Police: 100',packing:['Rain jacket','Trekking shoes','Insect repellent','Light layers','Binoculars']},
    {name:'Andaman',state:'A&N Islands',flag:'🏝️',tags:['Beach','Diving','Islands'],img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=70',budget:{low:2000,mid:4500,high:11000},highlights:['Radhanagar Beach Asia top 7','Scuba diving Havelock coral','Cellular Jail sound light show','Neil Island bicycle ride','Glass bottom boat Jolly Buoy','Barren Island volcano view'],food:['Grilled Seafood Platter','Fish Tikka','Lobster Masala','Coconut Prawn Curry','Fresh Crab'],hotels:{low:'Symphony Palms',mid:'Sea Shell Havelock',high:'Taj Exotica Andaman'},transport:'Ferry ₹500-2000 or speedboat',bestTime:'Nov–Apr',emergency:'Police: 100 | Coast Guard: 03192-232501',packing:['Swimwear','Underwater camera','Reef shoes','Dry bag','Reef-safe sunscreen']},
    {name:'Hampi',state:'Karnataka',flag:'🗿',tags:['Ruins','History','Heritage'],img:'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=70',budget:{low:600,mid:1500,high:3500},highlights:['Virupaksha Temple morning prayers','Vittala Temple stone chariot','Hemakuta Hill sunset boulders','Matanga Hill sunrise panorama','Elephant Stables royal quarter','Achyutaraya Temple jungle ruins'],food:['Masala Dosa crispy','South Indian Thali','Bisi Bele Bath','Jolada Rotti jowar','Fresh Coconut Water'],hotels:{low:'Kishkinda Trust Guesthouse',mid:'Hoova Chocolate Resort',high:'Evolve Back Hampi'},transport:'Bicycle ₹50-100/day is best way',bestTime:'Oct–Feb',emergency:'Karnataka Police: 100',packing:['Comfortable shoes','Hat','Sunscreen','Water bottle 2L','Camera']},
    {name:'Ooty',state:'Tamil Nadu',flag:'🌸',tags:['Hills','Tea','Nature'],img:'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&q=70',budget:{low:800,mid:2000,high:5000},highlights:['Government Botanical Gardens roses','Ooty Lake pedal boating','Nilgiri Mountain Railway UNESCO','Doddabetta highest peak Nilgiris','Rose Garden 2000 varieties','Avalanche Lake trout fishing'],food:['Ooty Homemade Chocolate','Nilgiri tea varieties','Kothu Parotta street food','Fresh Strawberry Cream','Biryani'],hotels:{low:'Sterling Ooty',mid:'Savoy Hotel',high:'Taj Savoy Ooty'},transport:'Toy train or hire cab ₹2000-3000/day',bestTime:'Oct–Jun',emergency:'TN Police: 100',packing:['Warm layers','Rain jacket','Comfortable walking shoes','Camera','Umbrella']},
    {name:'Kolkata',state:'West Bengal',flag:'🎭',tags:['Culture','Art','Food'],img:'https://images.unsplash.com/photo-1558431382-27e303142255?w=400&q=70',budget:{low:1000,mid:2500,high:6000},highlights:['Victoria Memorial museum','Howrah Bridge evening walk','Kalighat Kali Temple','Eden Gardens cricket ground','Indian Museum oldest in Asia','College Street book bazaar'],food:['Mishti Doi sweet yogurt','Rasgulla original','Kathi Roll egg wrap','Hilsa Fish curry','Phuchka street pani puri'],hotels:{low:'Backpackers Hostel',mid:'Oberoi Grand',high:'ITC Royal Bengal'},transport:'Yellow taxi ₹50-200 or Metro ₹5-25',bestTime:'Oct–Mar',emergency:'WB Police: 100 | Tourist: 033-22483564',packing:['Light clothes','Umbrella','Comfortable shoes','Camera','Power bank']},
    {name:'Chennai',state:'Tamil Nadu',flag:'🌊',tags:['Beach','Food','Temple'],img:'https://images.unsplash.com/photo-1574307932175-0d0ac9177a0b?w=400&q=70',budget:{low:1000,mid:2500,high:6500},highlights:['Marina Beach world second longest','Kapaleeshwarar Temple gopuram','Fort St. George museum','Mahabalipuram UNESCO shore temple','Elliot Beach sunrise jog','DakshinaChitra cultural museum'],food:['Chettinad Chicken Biryani','Idli Sambar breakfast','Kothu Parotta street','Filter Kaapi coffee','Murukku snack'],hotels:{low:'Zostel Chennai',mid:'Crowne Plaza',high:'Taj Coromandel'},transport:'MTC bus ₹5-20 or Ola/Uber',bestTime:'Nov–Feb',emergency:'TN Police: 100 | Coast Guard: 044-25363025',packing:['Light cotton','Sunscreen','Comfortable sandals','Modest temple wear','Water bottle']},
    {name:'Hyderabad',state:'Telangana',flag:'🍛',tags:['Food','Heritage','IT City'],img:'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&q=70',budget:{low:1000,mid:2500,high:6500},highlights:['Charminar iconic arch','Golconda Fort sound light show','Ramoji Film City largest studio','Hussain Sagar lake statue','Nehru Zoological Park','Birla Mandir hilltop temple'],food:['Hyderabadi Dum Biryani','Haleem Ramadan special','Irani Chai Osmania biscuit','Double Ka Meetha dessert','Mirchi Ka Salan'],hotels:{low:'Treebo Hotels',mid:'Taj Deccan',high:'Park Hyatt Hyderabad'},transport:'MMTS train or Rapido bike taxi',bestTime:'Oct–Mar',emergency:'Telangana Police: 100 | SHE Teams: 100',packing:['Light clothes','Comfortable shoes','Sunscreen','Water bottle','Camera']},
    {name:'Shimla',state:'Himachal Pradesh',flag:'🌲',tags:['Hills','Colonial','Nature'],img:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=70',budget:{low:900,mid:2200,high:6000},highlights:['The Ridge colonial heart','Mall Road café walk','Jakhoo Temple monkeys','Kufri ski slopes','Narkanda apple orchards','Himalayan Bird Park'],food:['Siddu stuffed bread','Tibetan Thukpa','Himachali Dham feast','Rajmah Chawal','Aktori sweet'],hotels:{low:'YMCA Shimla',mid:'Hotel Willow Banks',high:'The Oberoi Cecil'},transport:'Walk Mall Road or hire taxi',bestTime:'Mar–Jun & Sep–Nov',emergency:'HP Police: 100',packing:['Woolens Dec-Jan','Rain jacket','Trekking shoes','Camera','Umbrella']},
    {name:'Amritsar',state:'Punjab',flag:'⚜️',tags:['Spiritual','Heritage','Food'],img:'https://images.unsplash.com/photo-1609255575042-a98078f5fdf5?w=400&q=70',budget:{low:800,mid:2000,high:5000},highlights:['Golden Temple 24hr open','Wagah Border ceremony 5pm','Jallianwala Bagh memorial','Partition Museum powerful','Gobindgarh Fort light show','Hall Bazaar spice shopping'],food:['Langar free temple meal','Amritsari Kulcha butter','Lassi thick sweet','Butter Chicken original','Makki di Roti Sarson Saag'],hotels:{low:'Backpacker Hostel',mid:'Ramada Hotel',high:'Taj Swarna Amritsar'},transport:'E-rickshaw ₹30-100 or walk near temple',bestTime:'Oct–Mar',emergency:'Punjab Police: 100',packing:['Head cover for temple','Modest clothing','Comfortable sandals','Camera','Water bottle']},
    {name:'Jodhpur',state:'Rajasthan',flag:'🏯',tags:['Blue City','Heritage','Desert'],img:'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=70',budget:{low:900,mid:2200,high:5500},highlights:['Mehrangarh Fort massive walls','Jaswant Thada marble cenotaph','Clock Tower spice market','Umaid Bhawan Palace hotel','Toorji Ka Jhalra stepwell photography','Mandore Gardens royal cenotaphs'],food:['Makhania Lassi thick','Mirchi Bada spicy fritter','Dal Baati Churma traditional','Mawa Kachori sweet','Makhaniya Lassi'],hotels:{low:'Cosy Nook Hostel',mid:'Haveli Inn Pal',high:'Umaid Bhawan Palace'},transport:'Auto ₹50-200 or cycle rickshaw',bestTime:'Oct–Mar',emergency:'Rajasthan Police: 100',packing:['Light cotton','Sunscreen','Hat','Camera','Comfortable walking shoes']},
    {name:'Jaisalmer',state:'Rajasthan',flag:'🏜️',tags:['Desert','Dunes','Camel Safari'],img:'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=70',budget:{low:1000,mid:2500,high:6000},highlights:['Jaisalmer Fort living fort','Sam Sand Dunes sunset camel','Night under stars tented camp','Patwon ki Haveli mirror work','Gadisar Lake morning boats','Kuldhara ghost village'],food:['Ker Sangri desert beans','Gatte ki Sabzi','Bajre ki Roti pearl millet','Makhaniya Lassi saffron','Desert Rajasthani Thali'],hotels:{low:'Hostel Shahi',mid:'Suryagarh Palace',high:'Killa Bhawan'},transport:'Jeep ₹1500-2000/day for dunes or camel',bestTime:'Oct–Mar',emergency:'Rajasthan Police: 100',packing:['Light cotton','Sunglasses','Scarf for sand','Closed shoes for dunes','Sunscreen']},
    {name:'Ranthambore',state:'Rajasthan',flag:'🐯',tags:['Wildlife','Safari','Nature'],img:'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&q=70',budget:{low:2500,mid:5000,high:12000},highlights:['Tiger Zone 1-5 morning safari','Ranthambore Fort ruins inside park','Padam Lake tiger watering hole','Raj Bagh ancient ruins','Khandar Fort panorama','Sloth bear sighting at dusk'],food:['Rajasthani Thali','Dal Baati feast','Churma sweet balls','Gatte ki Curry','Safed Maas white mutton'],hotels:{low:'Zone by the Park',mid:'RTDC Vinayak',high:'Sher Bagh Luxury Tents'},transport:'Canter ₹500/person or Jeep safari ₹1200',bestTime:'Oct–Jun',emergency:'Rajasthan Police: 100 | Forest: 07462-220223',packing:['Neutral earth colours','Binoculars','Zoom camera lens','Early morning jacket','Insect repellent']},
    {name:'Pondicherry',state:'Puducherry',flag:'🇫🇷',tags:['French Town','Beach','Spirituality'],img:'https://images.unsplash.com/photo-1582546016034-65a18a2a1040?w=400&q=70',budget:{low:800,mid:2000,high:5000},highlights:['French Quarter heritage walk','Auroville Matrimandir meditation','Paradise Beach boat trip','Sri Aurobindo Ashram silence','Promenade Beach evening walk','Rock Beach café breakfast'],food:['French Crepes','Fresh Baguettes','Banana Pancake','Fish Curry local','Kasha Mani Thali'],hotels:{low:'Gratitude Heritage',mid:'Le Dupleix',high:'Maison Perumal'},transport:'Rent bicycle ₹100/day or autorickshaw',bestTime:'Oct–Mar',emergency:'Puducherry Police: 100',packing:['Light cotton','Beach wear','Bicycle-friendly clothes','Camera','Sunscreen']},
    {name:'Munnar',state:'Kerala',flag:'🍵',tags:['Tea','Hills','Nature'],img:'https://images.unsplash.com/photo-1531169628054-a8e9e2b6e5f9?w=400&q=70',budget:{low:900,mid:2200,high:5500},highlights:['Top Station viewpoint dawn','Eravikulam Nilgiri Tahr park','Mattupetty Dam shola forests','Chinnar Wildlife Sanctuary','KDHP Tea Museum history','Lockhart Gap misty view'],food:['Kerala Sadya full meals','Appam with coconut stew','Fresh Munnar Tea','Fish Curry nadan style','Chakka Halwa jackfruit'],hotels:{low:'Green View Budget',mid:'Spice Tree',high:'Windermere Estate'},transport:'Private taxi ₹1500-2500/day',bestTime:'Sep–May',emergency:'Kerala Police: 100',packing:['Warm layer for nights','Rain jacket','Trekking shoes','Insect repellent','Camera']},
    {name:'Spiti Valley',state:'Himachal Pradesh',flag:'🌌',tags:['Mountains','Remote','Monasteries'],img:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=70',budget:{low:1200,mid:3000,high:7000},highlights:['Key Monastery 1000 years old','Chandratal Lake crescent moon','Hikkim world highest post office','Dhankar Monastery cliff edge','Pin Valley snow leopard habitat','Komic village 4500m altitude'],food:['Thukpa noodle broth','Steamed Momos','Tsampa roasted barley flour','Butter Tea salty warming','Roasted Barley bread'],hotels:{low:'Hostel Spiti',mid:'Ecosphere Spiti',high:'Snow Leopard Camp'},transport:'Hire Innova for tough mountain roads ₹3000-4000/day',bestTime:'Jun–Sep',emergency:'HP Police: 100 | BSNL Kaza: 01906-222274',packing:['Heavy thermals','Altitude sickness pills Diamox','UV sunglasses','Trekking boots','Emergency first aid kit']},
    {name:'Alleppey',state:'Kerala',flag:'⛵',tags:['Backwaters','Houseboat','Nature'],img:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=70',budget:{low:2000,mid:4500,high:10000},highlights:['Overnight houseboat Vembanad Lake','Kumarakom Bird Sanctuary dawn','Marari Beach fishing village','Kuttanad rice bowl below sea level','Punnamada Lake snake boat race','Alleppey Sunday market'],food:['Kerala Sadya traditional feast','Karimeen Pearl Spot fish','Fresh Prawn Curry','Appam with vegetable stew','Coconut Fish curry'],hotels:{low:'Zostel Alleppey',mid:'Pagoda Resort',high:'Coconut Lagoon CGH'},transport:'Houseboat or local ferry ₹50-100',bestTime:'Sep–Mar',emergency:'Kerala Police: 100 | Coast Guard: 0477-2252334',packing:['Light clothes','Rain jacket','Mosquito repellent','Sunscreen','Camera']},
    {name:'Pushkar',state:'Rajasthan',flag:'🐪',tags:['Spiritual','Desert','Culture'],img:'https://images.unsplash.com/photo-1477587458883-47145ed6979e?w=400&q=70',budget:{low:700,mid:1700,high:4500},highlights:['Pushkar Lake 52 bathing ghats','Brahma Temple only in world','Camel Fair Nov grounds','Savitri Mata Temple ropeway','Sunset at Pushkar Lake','Street shopping tie-dye fabrics'],food:['Malpua jaggery pancake','Mawa Kachori sweet','Thick Lassi curd drink','Baba Masala Chai','Rajasthani Thali full'],hotels:{low:'Kanhaia Haveli Hostel',mid:'Hotel Pushkar Palace',high:'The Westin Pushkar Resort'},transport:'Walk or camel ride ₹200-500',bestTime:'Oct–Mar',emergency:'Rajasthan Police: 100',packing:['Modest lake-side clothing','Light cotton','Camel ride gear','Camera','Comfortable sandals']},
    {name:'Gangtok',state:'Sikkim',flag:'🏔️',tags:['Mountains','Buddhism','Nature'],img:'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=70',budget:{low:1000,mid:2500,high:6000},highlights:['Tsomgo Lake 12500 feet yak ride','Nathula Pass China border','Rumtek Monastery largest Sikkim','MG Marg pedestrian zone','Banjhakri Falls nature park','Seven Sisters Waterfalls roadside'],food:['Gundruk fermented soup','Steamed Momos','Chhurpi dried cheese','Phagshapa pork fat','Changkhi millet beer'],hotels:{low:'Mintokling Guest House',mid:'Mayfair Gangtok',high:'Elgin Nor-Khill'},transport:'Shared jeep ₹100-500 or private taxi',bestTime:'Mar–May & Sep–Nov',emergency:'Sikkim Police: 100 | ILP required',packing:['Warm layers','Rain jacket','Trekking shoes','Altitude sickness pills','Camera']},
    {name:'Madurai',state:'Tamil Nadu',flag:'🏛️',tags:['Temple','Culture','Heritage'],img:'https://images.unsplash.com/photo-1600255820935-ca6ce9a30f79?w=400&q=70',budget:{low:700,mid:1800,high:4500},highlights:['Meenakshi Amman Temple 12 gopurams','Thirumalai Nayak Palace columns','Gandhi Memorial Museum','Koodal Azhagar Vishnu Temple','Alagar Koil hill temple','Vaigai Dam evening walk'],food:['Jigarthanda unique milk drink','Mutton Kothu Parotta spicy','Kal Dosai stone roasted','Madurai Biryani local style','Panneer Sodhi gravy'],hotels:{low:'Madurai Residency',mid:'Heritage Madurai',high:'Gateway Hotel Pasumalai'},transport:'Auto ₹40-100 or walk Old Town',bestTime:'Oct–Mar',emergency:'TN Police: 100',packing:['Modest temple clothing','Comfortable sandals','Hat','Water bottle','Camera']},
    {name:'Puri',state:'Odisha',flag:'🌊',tags:['Beach','Temple','Spirituality'],img:'https://images.unsplash.com/photo-1580777361964-27e9cdd2f838?w=400&q=70',budget:{low:700,mid:1800,high:4500},highlights:['Jagannath Temple chariot','Puri Beach sunrise fishing boats','Chilika Lake flamingos','Konark Sun Temple UNESCO','Raghurajpur art village patachitra','Chandrabhaga beach dolphin'],food:['Mahaprasad temple offering','Dalma lentil vegetable','Chenna Poda baked cheese','Khaja sweet layered','Fresh Coconut Water'],hotels:{low:'Youth Hostel Puri',mid:'Hotel Nilachal Ashok',high:'Mayfair Beach Resort'},transport:'Cycle rickshaw or auto ₹30-100',bestTime:'Nov–Feb',emergency:'Odisha Police: 100 | Coast Guard: 0674-2415860',packing:['Modest temple wear','Beach clothes','Comfortable sandals','Camera','Sunscreen']},
    {name:'Jim Corbett',state:'Uttarakhand',flag:'🐘',tags:['Wildlife','Safari','Jungle'],img:'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&q=70',budget:{low:2000,mid:4000,high:10000},highlights:['Bijrani Zone tiger safari','Dhikala grasslands dawn jeep','Ramganga River crocodile watch','Elephant safari Jhirna Zone','Bird watching 600 species','Sitabani Buffer Zone walk'],food:['Kumaoni Thali traditional','Aloo ke Gutke spiced potato','Bhatt ki Daal black bean','Kafuli leafy curry','Bal Mithai chocolate fudge'],hotels:{low:'Nature Valley Resort',mid:'Jim\'s Jungle Retreat',high:'The Solluna Resort'},transport:'Safari jeep ₹2500-3500 or resort transfer',bestTime:'Nov–Jun',emergency:'Uttarakhand Police: 100 | Forest: 05947-251489',packing:['Neutral earth colours','Binoculars','Zoom camera','Early morning jacket','Insect repellent']},
    {name:'Haridwar',state:'Uttarakhand',flag:'🏊',tags:['Ganga','Spiritual','Yoga'],img:'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=400&q=70',budget:{low:600,mid:1500,high:4000},highlights:['Har ki Pauri Ganga Aarti 6pm','Chandi Devi Temple cable car','Mansa Devi Temple rope way','Rajaji Tiger Reserve jeep','Bharat Mata Mandir 8 floors','Sapt Rishi Ashram peace'],food:['Aloo Puri morning breakfast','Kachori Sabzi street food','Halwa Puri sweet','Thick Lassi','Pav Bhaji Chaat'],hotels:{low:'GMVN Haridwar',mid:'Hotel Ganga Lahari',high:'Haveli Hari Ganga'},transport:'Shared auto ₹10-30 or walk Ghat area',bestTime:'Sep–Jun',emergency:'Uttarakhand Police: 100',packing:['Modest ghat clothing','Comfortable sandals','Camera','Water bottle','Mosquito repellent']},
    {name:'Aurangabad',state:'Maharashtra',flag:'🏛️',tags:['Caves','UNESCO','Heritage'],img:'https://images.unsplash.com/photo-1616097788249-de1f5b7c3eed?w=400&q=70',budget:{low:900,mid:2200,high:5500},highlights:['Ajanta Caves 2000 year old paintings','Ellora Caves 3 religions one cliff','Bibi Ka Maqbara mini Taj Mahal','Daulatabad Fort unconquered','Aurangabad Caves lesser known','Panchakki water mill'],food:['Naan Qalia mutton dish','Taheri rice dish','Sheer Khurma Eid sweet','Aurangabadi Biryani','Shahi Tukda bread dessert'],hotels:{low:'Hotel Panchavati',mid:'Vivanta Aurangabad',high:'Taj Hotel Aurangabad'},transport:'Hire car for Ajanta-Ellora ₹1500-2000/day',bestTime:'Oct–Mar',emergency:'Maharashtra Police: 100',packing:['Comfortable walking shoes','Light clothes','Camera','Hat','Water bottle']},
    {name:'Mahabaleshwar',state:'Maharashtra',flag:'🍓',tags:['Hills','Strawberry','Nature'],img:'https://images.unsplash.com/photo-1629467057571-42d22d8f0cbd?w=400&q=70',budget:{low:1200,mid:2800,high:6500},highlights:['Venna Lake pedal boating','Arthur Seat viewpoint 1470m','Pratapgad Fort Shivaji history','Elephant Head Point formation','Mapro Garden strawberry farm','Wilson Point first sunrise point'],food:['Strawberry Fresh Cream','Corn Bhutta roasted','Mapro strawberry jam','Poha Jalebi breakfast','Vada Pav'],hotels:{low:'Hotel Dreamland',mid:'Bella Vista',high:'Le Meridien Mahabaleshwar'},transport:'Horse riding ₹300-500 or hired jeep',bestTime:'Oct–Jun',emergency:'Maharashtra Police: 100',packing:['Warm layer evenings','Rain jacket monsoon','Walking shoes','Camera','Light cotton']},
    {name:'Kodaikanal',state:'Tamil Nadu',flag:'🌹',tags:['Hills','Lake','Romantic'],img:'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&q=70',budget:{low:900,mid:2200,high:5500},highlights:['Kodai Star-shaped Lake boating','Pillar Rocks 122m vertical','Coakers Walk cliff promenade','Bryant Park horticulture','Silver Cascade Falls roadside','Bear Shola Falls forest'],food:['Kodai Homemade Chocolate','Local Wine fruit wine','Fresh Cheese Kodai','Varkey biscuit','Crispy Dosa'],hotels:{low:'Hotel Kodai',mid:'Cardamom House',high:'The Carlton Kodaikanal'},transport:'Bicycle ₹60/hour or horse ride',bestTime:'Oct–Jun',emergency:'TN Police: 100',packing:['Warm layers','Rain jacket','Bicycle gear','Camera','Comfortable shoes']},
    {name:'Nainital',state:'Uttarakhand',flag:'🦅',tags:['Lake','Hills','Family'],img:'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=70',budget:{low:900,mid:2200,high:5500},highlights:['Naini Lake paddle boating','Snow View Point cable car','Naina Devi Temple hilltop','Mall Road shopping stroll','Eco Cave Gardens adventure','High Altitude Zoo red pandas'],food:['Bal Mithai chocolate fudge','Singori cone milk sweet','Kumaoni Thali traditional','Bhaang Pakoda cannabis fritters','Aloo ke Gutke'],hotels:{low:'Hotel Priya',mid:'Manu Maharani',high:'The Naini Retreat'},transport:'Tonga horse cart ₹100-200 or walk',bestTime:'Mar–Jun & Sep–Nov',emergency:'Uttarakhand Police: 100',packing:['Warm layers','Rain jacket','Comfortable shoes','Camera','Light sweater']},
    {name:'Kasol',state:'Himachal Pradesh',flag:'🌿',tags:['Backpacker','Trekking','Parvati Valley'],img:'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&q=70',budget:{low:600,mid:1500,high:3500},highlights:['Kheerganga hot spring trek 22km','Chalal Village forest walk','Malana Village hashish culture','Kheer Ganga thermal pool soak','Tosh Village beyond Kasol','Rasol Trek 3500m ridge'],food:['Israeli Hummus chickpea','Shakshuka egg tomato','Fresh Pasta cafes','Maggi noodles','Thick Lassi'],hotels:{low:'Alpine Guest House',mid:'Parvati Valley Retreat',high:'The Park Kasol'},transport:'Bus from Delhi ₹600-1200 or hire bike',bestTime:'Mar–Jun & Sep–Nov',emergency:'HP Police: 100',packing:['Trekking boots','Warm layers','Rain jacket','Trekking poles','First aid kit']},
    {name:'Varkala',state:'Kerala',flag:'🌅',tags:['Cliff Beach','Yoga','Backpacker'],img:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=70',budget:{low:900,mid:2200,high:5500},highlights:['North Cliff sunset cafe walk','Papanasam Beach sacred water','Janardana Swami 2000 year Temple','Black Beach secluded south','Cliff Restaurant fresh seafood','Helipad best sunset viewpoint'],food:['Fresh Grilled Seafood Thali','Kerala Fish Curry coconut','Banana Leaf Meals nadan','Fresh Juices cliff cafes','Coconut Crepes'],hotels:{low:'Zostel Varkala',mid:'Clafouti Resort',high:'Taj Green Cove'},transport:'Walk along cliff or bicycle ₹100/day',bestTime:'Sep–Mar',emergency:'Kerala Police: 100',packing:['Swimwear','Yoga gear','Light clothes','Sunscreen','Beach sandals']},
    // NEW DESTINATIONS 43-100
    {name:'Mcleod Ganj',state:'Himachal Pradesh',flag:'☸️',tags:['Tibetan Culture','Trekking','Mountains'],img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',budget:{low:700,mid:1800,high:4500},highlights:['Dalai Lama Temple complex','Bhagsu Nag waterfall swim','Triund Trek 2827m meadow','Namgyal Monastery butter lamps','St. John Church colonial','Dal Lake Dharamkot walk'],food:['Tibetan Thukpa noodle','Steamed Momos','Thenthuk hand-pulled noodles','Butter Tea warming','Fresh Apple Juice'],hotels:{low:'Zostel Mcleod',mid:'Hotel Norbu House',high:'Chonor House'},transport:'Auto or walk compact hill town',bestTime:'Mar–Jun & Sep–Nov',emergency:'HP Police: 100',packing:['Warm layers','Rain jacket','Trekking boots','Yoga gear','Camera']},
    {name:'Kutch',state:'Gujarat',flag:'🌅',tags:['White Rann','Culture','Desert'],img:'https://images.unsplash.com/photo-1583396618423-cd74c44a6a1a?w=400&q=70',budget:{low:900,mid:2200,high:5500},highlights:['White Rann of Kutch full moon','Kalo Dungar Black Hills viewpoint','Rann Utsav tent festival Nov-Feb','Bhuj old walled city','Flamingo City seasonal','Great Indian Bustard Sanctuary'],food:['Kutchi Dabeli tangy burger','Bajra Rotla pearl millet bread','Khichdi sesame sweetened','Roasted Groundnuts roadside','Chaas buttermilk'],hotels:{low:'Rann Riders Camp',mid:'Rann Utsav Tent',high:'Gateway Hotel Bhuj'},transport:'Hired jeep ₹2000-3000/day essential',bestTime:'Nov–Feb Rann Utsav',emergency:'Gujarat Police: 100',packing:['White clothes for photos','Warm layer cold nights','Camera','Binoculars','Comfortable sandals']},
    {name:'Wayanad',state:'Kerala',flag:'🌄',tags:['Nature','Wildlife','Tribal'],img:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=70',budget:{low:900,mid:2200,high:5500},highlights:['Chembra Peak heart-shaped lake trek','Edakkal Neolithic cave carvings','Soochipara Sentinel Rock Falls','Wayanad Wildlife Sanctuary elephant','Thirunelli ancient forest temple','Banasura Sagar largest earthen dam India'],food:['Bamboo Biryani tribal style','Full Kerala Meals','Wild Forest Honey','Puttu steamed rice cake','Fresh Coconut Fish Curry'],hotels:{low:'Vythiri Village Camp',mid:'Jungle Retreat',high:'Wayanad Wild'},transport:'Hire cab or self-drive ₹2000-3000/day',bestTime:'Sep–May',emergency:'Kerala Police: 100',packing:['Trekking boots','Insect repellent','Rain jacket','Light clothes','Camera']},
    {name:'Shillong',state:'Meghalaya',flag:'🌧️',tags:['Meghalaya','Waterfalls','Living Roots'],img:'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=70',budget:{low:900,mid:2200,high:5500},highlights:['Cherrapunji wettest day trip','Living Root Bridges double decker','Elephant Falls three levels','Ward Lake botanical garden','Dawki River glass boat','Mawlynnong cleanest village Asia'],food:['Jadoh rice meat breakfast','Tungrymbai fermented soybean','Dohneiiong black sesame pork','Local Rice Beer','Smoked Pork bamboo'],hotels:{low:'Tripura Castle Hostel',mid:'Polo Towers',high:'Ri Kynmaw Resort'},transport:'Shared taxi ₹50-200 or hired car',bestTime:'Oct–May',emergency:'Meghalaya Police: 100',packing:['Rain jacket always essential','Trekking boots','Warm layer','Camera','Insect repellent']},
    {name:'Kochi',state:'Kerala',flag:'⛵',tags:['Fort Kochi','Culture','Backwaters'],img:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=70',budget:{low:1000,mid:2500,high:6500},highlights:['Fort Kochi heritage walk at dusk','Chinese Fishing Nets photo iconic','Mattancherry Dutch Palace frescos','Jew Town antique shopping','Kerala Kathakali evening show','Marine Drive breezy walk'],food:['Puttu Kadala breakfast','Karimeen Pearl Spot curry','Appam Stew dinner','Prawn Biryani Malabari','Coconut Fish Curry'],hotels:{low:'Delight Home Stay',mid:'Old Harbour Hotel',high:'Brunton Boatyard CGH'},transport:'Ferry ₹5-20 or autorickshaw',bestTime:'Sep–Mar',emergency:'Kerala Police: 100 | Coast Guard: 0484-2666353',packing:['Light clothes','Camera','Comfortable sandals','Mosquito repellent','Modest wear synagogue']},
    {name:'Gokarna',state:'Karnataka',flag:'🌊',tags:['Beach','Spiritual','Backpacker'],img:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=70',budget:{low:700,mid:1800,high:4500},highlights:['Mahabaleshwar Temple main town','Om Beach sacred OM shape','Kudle Beach backpacker vibe','Half Moon Beach hike access only','Paradise Beach pristine','Yana Rock pinnacles cave'],food:['Grilled Fresh Seafood daily','Goli Bajje batter balls','Neer Dosa thin lacy','Fresh Fish Fry','Coconut Water beach-side'],hotels:{low:'Zostel Gokarna',mid:'SwaSwara Resort',high:'Namaste Cafe Cottages'},transport:'Walk or kayak between beaches',bestTime:'Oct–Mar',emergency:'Karnataka Police: 100',packing:['Beach wear','Sandals','Snorkeling gear','Light cotton','Sunscreen']},
    {name:'Lucknow',state:'Uttar Pradesh',flag:'🕌',tags:['Nawabi','Food','Heritage'],img:'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=70',budget:{low:800,mid:2000,high:5000},highlights:['Bara Imambara labyrinth Bhul Bhulaiya','Rumi Darwaza Ottoman Gate replica','Chota Imambara chandelier interior','Residency 1857 ruins','Hazratganj evening stroll','Ambedkar Memorial Park fountains'],food:['Tunday Kebab legendary','Dum Biryani slow cooked','Sheermal saffron bread','Gosht Korma royal style','Malai Paan betel leaf'],hotels:{low:'Hotel Gomti',mid:'Vivanta Lucknow',high:'Taj Mahal Hotel Lucknow'},transport:'Auto ₹30-80 or e-rickshaw',bestTime:'Oct–Mar',emergency:'UP Police: 100',packing:['Light clothes','Comfortable shoes','Camera','Water bottle','Evening dress for dining']},
    {name:'Vizag',state:'Andhra Pradesh',flag:'⚓',tags:['Beach','Naval','Scenic'],img:'https://images.unsplash.com/photo-1574307932175-0d0ac9177a0b?w=400&q=70',budget:{low:800,mid:2000,high:5000},highlights:['Araku Valley Eastern Ghats drive','Borra Limestone Caves ancient','Rushikonda Beach swimming safe','INS Kursura Submarine Museum','Kailasagiri Park cable car','Simhachalam Temple hilltop'],food:['Gongura Prawn tangy pickle','Bobbatlu sweet flatbread','Pulihora tamarind rice','Andhra Style Biryani spicy','Pappu Charu rasam'],hotels:{low:'Sri Sai Lodge',mid:'Grand Bay Hotel',high:'Novotel Vizag'},transport:'APSRTC bus or Ola/Uber',bestTime:'Oct–Mar',emergency:'AP Police: 100 | Coast Guard: 0891-2559543',packing:['Light clothes','Beach wear','Comfortable shoes','Camera','Sunscreen']},
    {name:'Pelling',state:'Sikkim',flag:'🏔️',tags:['Mountains','Kanchenjunga','Buddhism'],img:'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=70',budget:{low:900,mid:2200,high:5500},highlights:['Pemayangtse Monastery 300 years','Rabdentse Ancient Sikkim Capital ruins','Skywalk glass-floored Pelling','Kanchenjunga Falls 100m drop','Khecheopalri Wish Fulfilling Lake','Singing Bowl Valley meditation'],food:['Gundruk fermented vegetable soup','Steamed Momos dumplings','Fermented Churpi dry cheese','Chhurpi hard yak cheese','Local Rice Beer Tongba'],hotels:{low:'Hotel Garuda',mid:'Norbugang Resort',high:'Elgin Mt. Pandim'},transport:'Shared jeep ₹100-300 from Gangtok',bestTime:'Mar–May & Sep–Nov',emergency:'Sikkim Police: 100 | ILP required',packing:['Warm layers','Rain jacket','Trekking shoes','Altitude pills','Camera']},
    {name:'Munsiyari',state:'Uttarakhand',flag:'❄️',tags:['Himalayan','Offbeat','Snow'],img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',budget:{low:800,mid:2000,high:5000},highlights:['Panchachuli Five Peaks sunrise view','Birthi Falls 126m cascade','Khaliya Top Trek 3600m meadow','Ramam Valley hidden gem trek','Tribal Heritage Museum Johar','Dark Sky Stargazing night'],food:['Kumaoni Thali local','Bhatt ki Churkani black bean','Aloo ke Gutke spiced dry','Baal Mithai chocolate fudge','Singori milk sweet'],hotels:{low:'KMVN Rest House',mid:'Hotel Triveni',high:'Himalayan Eco Lodge'},transport:'Jeep from Almora ₹2500-3500 one way',bestTime:'Apr–Jun & Sep–Nov',emergency:'Uttarakhand Police: 100',packing:['Heavy thermals','Snow boots','Trekking gear','First aid kit','Camera']},
    {name:'Bandhavgarh',state:'Madhya Pradesh',flag:'🐅',tags:['Tiger Reserve','Wildlife','Safari'],img:'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&q=70',budget:{low:3000,mid:6000,high:15000},highlights:['Tiger Zone highest density India','Bandhavgarh Ancient Fort Vishnu','White Tiger Legacy origin park','Sone River dry season walk','Shesh Shaiya Vishnu rock statue','Leopard Sloth Bear sighting'],food:['Tribal Thali authentic','Daal Bafla wheat dumplings','Bhutte ka Kees corn cheese','Poha Jalebi breakfast','Tikhi Chutney spicy condiment'],hotels:{low:'Forest Rest House',mid:'Kings Lodge',high:'Taj Mahua Kothi'},transport:'Open jeep safari ₹3000-5000 essential',bestTime:'Oct–Jun',emergency:'MP Police: 100 | Forest: 07627-265158',packing:['Neutral colours only','Binoculars essential','Zoom camera lens','Early morning warm jacket','Insect repellent']},
    {name:'Lansdowne',state:'Uttarakhand',flag:'🌳',tags:['Offbeat','Hills','Quiet'],img:'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=70',budget:{low:700,mid:1800,high:4000},highlights:['Bhim Pakora balanced rocks','Garhwali Regimental War Memorial','Santoshi Mata hilltop Temple','Tip-in-Top panoramic point','Tarkeshwar Mahadev sacred grove','Ancient Oak Rhododendron forest walk'],food:['Kumaoni Thali traditional','Mandua Roti finger millet','Jhangora Kheer millet pudding','Singori sweet cone','Simple Chai ginger'],hotels:{low:'GMVN Rest House',mid:'Kalsoni Heights',high:'Trishul Riverside Resort'},transport:'Private car or taxi limited options',bestTime:'Mar–Jun & Sep–Nov',emergency:'Uttarakhand Police: 100',packing:['Warm layers','Rain jacket','Comfortable shoes','Camera','Light clothes']},
    {name:'Lonavala',state:'Maharashtra',flag:'🌫️',tags:['Hill Station','Waterfalls','Weekend'],img:'https://images.unsplash.com/photo-1629467057571-42d22d8f0cbd?w=400&q=70',budget:{low:800,mid:2000,high:5000},highlights:['Bhushi Dam water overflow monsoon','Karla Buddhist Rock Caves 2000yr','Bhaja Caves Hinayana Buddhist','Tiger Point viewpoint valley','Lohagad Fort Shivaji command','Rajmachi Trek camping overnight'],food:['Lonavala Famous Chikki peanut','Homemade Chocolate Fudge','Cutting Chai roadside','Vada Pav spicy','Corn Bhutta roasted'],hotels:{low:'Hotel Lemon Tree',mid:'Fariyas Resort',high:'The Machan treehouse'},transport:'Hire bike or car close to Pune Mumbai',bestTime:'Jun–Sep monsoon magic & Oct–Feb',emergency:'Maharashtra Police: 100',packing:['Rain jacket monsoon','Trekking shoes','Warm layer','Camera','Water bottle']},
    {name:'Chikmagalur',state:'Karnataka',flag:'☕',tags:['Coffee','Trekking','Nature'],img:'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=400&q=70',budget:{low:800,mid:2000,high:5000},highlights:['Mullayanagiri 1930m highest Karnataka','Baba Budangiri Sufi shrine hills','Hebbe Falls 2-stage 168m cascade','Z Point Viewpoint sea of clouds','Kemmanagundi hill station retreat','Coffee estate guided walk picking'],food:['Fresh Coorg Filter Coffee best','Akki Roti rice flatbread','Bisi Bele Bath hot lentil rice','Ragi Mudde finger millet ball','Pandi Pork Curry spicy'],hotels:{low:'Plantation Stay Homestay',mid:'Zostel Chikmagalur',high:'Serenity Green Resort'},transport:'Hire cab ₹1500-2500/day or self-drive',bestTime:'Sep–Mar',emergency:'Karnataka Police: 100',packing:['Trekking shoes','Warm layer evenings','Rain jacket','Camera','Insect repellent']},
    {name:'Pachmarhi',state:'Madhya Pradesh',flag:'🌿',tags:['Hill Station','Caves','Nature'],img:'https://images.unsplash.com/photo-1629467057571-42d22d8f0cbd?w=400&q=70',budget:{low:700,mid:1800,high:4500},highlights:['Bee Falls 35m cascade swimming','Pandava Caves Mahabharata origin','Chauragarh Peak Shiva Trek 1326m','Duchess Falls 100m viewpoint','Satpura Tiger Reserve jeep','Priyadarshini Forsyth Point sunset'],food:['Dal Bafla Madhya Pradesh dish','Poha Jalebi quick breakfast','Bhutte ka Kees corn grated','Local Tribal Cuisine forest ingredients','Sindoori thick Lassi'],hotels:{low:'MPSTDC Tourist Hostel',mid:'Rock End Manor heritage',high:'The Satpura Retreat'},transport:'Hired jeep ₹1200-2000/day essential',bestTime:'Oct–Jun',emergency:'MP Police: 100',packing:['Trekking gear','Warm layer','Rain jacket','Camera','Water bottle']},
    {name:'Kaziranga',state:'Assam',flag:'🦏',tags:['Rhino Safari','Wildlife','Northeast'],img:'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&q=70',budget:{low:2500,mid:5000,high:12000},highlights:['One-Horn Rhino elephant safari','Central Zone jeep dawn safari','Western Burapahar Zone trek','Brahmaputra River sunset cruise','Bird Watching 480 species park','Kohora Village tribal culture'],food:['Assamese Thali home style','Masor Tenga sour fish curry','Duck Meat Curry mustard','Pitha rice cake sweet','Bamboo Shoot Curry smoked'],hotels:{low:'Wild Grass Lodge',mid:'Iora the Retreat',high:'Diphlu River Lodge'},transport:'Elephant safari ₹800-1200 or jeep ₹2000-3500',bestTime:'Nov–Apr',emergency:'Assam Police: 100 | Forest: 03776-268023',packing:['Neutral earth colours','Binoculars essential','Zoom camera lens','Early morning jacket','Insect repellent']},
    {name:'Tawang',state:'Arunachal Pradesh',flag:'🏔️',tags:['Mountains','Monastery','Northeast'],img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',budget:{low:1200,mid:3000,high:7000},highlights:['Tawang Monastery 400-year largest India','Sela Pass 4170m frozen lake','Madhuri Lake Shungatser scenic','Nuranang Jang Falls misty','1962 War Memorial solemn','Pt Tso Lake hidden gem'],food:['Tibetan Thukpa warming noodle','Steamed Momos dumplings','Khura buckwheat pancake','Zan cornmeal porridge','Butter Tea salty warming'],hotels:{low:'Tawang Circuit House',mid:'Hotel Tawang',high:'Pemaling Resort'},transport:'Shared taxi or hired Sumo ₹3000-4000/day',bestTime:'Mar–Oct',emergency:'AP Police: 100 | ILP mandatory all visitors',packing:['Heavy thermals','Altitude sickness meds','Trekking boots','Down jacket','Camera']},
    {name:'Coimbatore',state:'Tamil Nadu',flag:'🏭',tags:['Gateway','Nature','Temples'],img:'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&q=70',budget:{low:700,mid:1700,high:4000},highlights:['Marudhamalai Temple hill drive','Dhyanalinga Isha Meditation','VOC Park children zoo','Siruvani Waterfalls cleanest water','Perur Pateeswarar 1000-year Temple','Black Thunder water theme park'],food:['Arisim Paruppu Payasam rice kheer','Masala Dosa crispy','Sothi coconut milk curry','Paal Kozhukattai rice dumplings','Filter Kaapi South Indian coffee'],hotels:{low:'Zostel Coimbatore',mid:'Residency Towers',high:'The Tamara Coorg nearby'},transport:'Auto ₹30-80 or city bus',bestTime:'Oct–Mar',emergency:'TN Police: 100',packing:['Light cotton','Comfortable shoes','Camera','Water bottle','Modest temple wear']},
    {name:'Ajmer',state:'Rajasthan',flag:'🕌',tags:['Spiritual','Heritage','Sufi'],img:'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=400&q=70',budget:{low:700,mid:1700,high:4000},highlights:['Dargah Khwaja Moinuddin Chishti','Ana Sagar Lake evening walk','Adhai Din Ka Jhonpra masjid','Taragarh Fort hill summit','Soniji Ki Nasiyan Jain Temple gold','Akbar Fort museum palace'],food:['Qorma slow cooked mutton','Shahi Tukda bread dessert','Malpua jaggery pancake','Biryani Ajmer style','Meetha Paan betel sweet'],hotels:{low:'Hotel Embassy',mid:'Mansingh Palace',high:'Ajmer Haveli'},transport:'Auto ₹30-80 or cycle rickshaw',bestTime:'Oct–Mar',emergency:'Rajasthan Police: 100',packing:['Modest dargah attire','Head cover women','Comfortable sandals','Camera','Water bottle']},
    {name:'Khajuraho',state:'Madhya Pradesh',flag:'🗽',tags:['UNESCO','Temples','Art'],img:'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=400&q=70',budget:{low:800,mid:2000,high:5000},highlights:['Western Group UNESCO tantric temples','Eastern Group Jain shrines','Sound Light Show English Hindi','Raneh Falls Ken gorge canyon','Panna Tiger Reserve jeep','Archaeological Museum sculpture'],food:['Poha light breakfast','Jalebi street sweet','Dal Bafla Madhya Pradesh','Bhutte ka Kees corn savoury','Shrikhand sweet yoghurt'],hotels:{low:'Hotel Isabel Palace',mid:'Ramada Khajuraho',high:'Taj Chandela'},transport:'Bicycle rent ₹50-80/day or hired car',bestTime:'Oct–Mar',emergency:'MP Police: 100',packing:['Comfortable walking shoes','Light clothes','Camera','Hat','Water bottle']},
    {name:'Tirupati',state:'Andhra Pradesh',flag:'🛕',tags:['Temple','Spiritual','Pilgrimage'],img:'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=400&q=70',budget:{low:800,mid:2000,high:5000},highlights:['Venkateswara Temple 10 million visitors','Kapila Theertham sacred falls','Sri Govindarajaswami ground level','Chandragiri Fort museum palace','ISKCON Temple Gaudiya style','Tiruchanur Padmavathi Temple goddess'],food:['Tirupati Laddu official prasadam','Pesarattu green lentil dosa','Andhra Meals spicy rice combo','Gongura Chutney sorrel leaf','Murukku rice snack crispy'],hotels:{low:'TTD Cottages affordable',mid:'Hotel Bliss Tirupati',high:'Fortune Kences'},transport:'TTD bus to temple ₹50 or private cab',bestTime:'Sep–Feb',emergency:'AP Police: 100 | TTD: 1800-425-5101',packing:['Modest full-sleeve clothing','Comfortable sandals','Water bottle','No leather items in temple','Camera outside temple only']},
    {name:'Dwarka',state:'Gujarat',flag:'🔱',tags:['Pilgrimage','Sea','Lord Krishna'],img:'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=400&q=70',budget:{low:600,mid:1500,high:3500},highlights:['Dwarkadhish Temple 12-storey spire','Beyt Dwarka Island ferry boat','Nageshwar Jyotirlinga 12 sacred','Rukmani Devi Temple outskirts','Gomti Ghat ancient bathing','Lighthouse Arabian Sea view'],food:['Full Vegetarian Thali','Fafda Jalebi breakfast','Jalebi crispy sweet','Dhokla steamed fermented','Undhiyu winter vegetables'],hotels:{low:'GTDC Hotel budget',mid:'Hotel Dwarka comfortable',high:'GRT Grand Dwarka'},transport:'Auto or ferry to Beyt Dwarka ₹30-50',bestTime:'Oct–Mar',emergency:'Gujarat Police: 100 | Coast Guard: 0288-2225148',packing:['Modest temple wear full sleeve','Comfortable sandals','Camera','Water bottle','Light cotton']},
    {name:'Shirdi',state:'Maharashtra',flag:'🙏',tags:['Spiritual','Pilgrimage','Sai Baba'],img:'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=400&q=70',budget:{low:600,mid:1500,high:4000},highlights:['Sai Baba Samadhi Mandir main','Dwarkamai Sacred mosque Baba sat','Chavadi alternate nights Baba slept','Shani Shingnapur open-air shrine 45km','Shri Sai Heritage Museum history','Gurusthan neem tree sacred'],food:['Prasad Meals free temple','Puran Poli sweet flatbread','Misal Pav spicy sprouts','Ukadiche Modak steam dumpling','Masala Chai spiced tea'],hotels:{low:'Sai Ashram budget',mid:'Hotel Sai Residency',high:'Sai Leela Hotel luxury'},transport:'Temple shuttle or walk Shirdi compact',bestTime:'All year avoid summer peak',emergency:'Maharashtra Police: 100 | Shrine: 02423-258770',packing:['Modest devotional clothing','Head cover','Comfortable sandals','Small donation bag','Camera restricted inside']},
    {name:'Bhubaneswar',state:'Odisha',flag:'🕍',tags:['Temples','Heritage','Culture'],img:'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=400&q=70',budget:{low:700,mid:1700,high:4000},highlights:['Lingaraj Temple 11th century','Udayagiri Khandagiri Jain Caves','Nandankanan Zoological Park white tiger','Dhauli Shanti Stupa Peace Pagoda','Parasuramesvara Temple carvings','Chilika Lagoon Asia largest'],food:['Pakhala fermented rice water','Dalma lentil mixed vegetables','Chenna Poda baked cheese cake','Mahaprasad Jagannath offerings','Rasabali sweet cheese flattened'],hotels:{low:'Hotel Pushpak',mid:'Swosti Premium',high:'Mayfair Lagoon'},transport:'Auto ₹30-80 or city bus',bestTime:'Nov–Feb',emergency:'Odisha Police: 100',packing:['Modest temple wear','Comfortable sandals','Camera','Water bottle','Light clothes']},
    {name:'Hamirpur',state:'Himachal Pradesh',flag:'🌺',tags:['Offbeat','Temple','Quiet'],img:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=70',budget:{low:500,mid:1200,high:3000},highlights:['Sujanpur Tira Fort riverside','Nadaun Beas River Ghats','Deotsidh Durga Temple important','Awah Devi hilltop Temple views','Hamirpur Market town centre','Apple Orchards walk Sep-Oct'],food:['Himachali Dham traditional feast','Madra chickpea yogurt curry','Bhey lotus stem curry','Anardana Chutney pomegranate','Aktori buckwheat sweet'],hotels:{low:'HPTDC Hotel basic',mid:'Hotel Hamirpur',high:'Baragarh Resort'},transport:'HRTC bus or hire local taxi',bestTime:'Mar–Jun & Sep–Nov',emergency:'HP Police: 100',packing:['Warm layers','Rain jacket','Comfortable shoes','Camera','Light clothes']},
    {name:'Ziro Valley',state:'Arunachal Pradesh',flag:'🌾',tags:['Offbeat','Tribal','Festival'],img:'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=70',budget:{low:1000,mid:2500,high:6000},highlights:['Apatani Tribal Villages UNESCO nominee','Ziro Music Festival September','Talley Valley Wildlife Reserve','Dolo Mando Hills viewpoint','Pine Forest walk misty','Apatani Women nose plug tradition'],food:['Apong Rice Beer traditional','Pika Pila fried banana stems','Bamboo Shoot Smoked Pork','Amin pork intestine smoked','Local Forest Mushroom curry'],hotels:{low:'Blue Pine Homestay',mid:'Ziro Valley Resort',high:'Pine Ridge Resort'},transport:'Shared taxi or hired vehicle ₹2000-3000/day',bestTime:'Mar–Oct & Sep Festival',emergency:'AP Police: 100 | ILP mandatory',packing:['Warm layers','Rain jacket','Trekking boots','Insect repellent','Camera']},
    {name:'Majuli',state:'Assam',flag:'🏝️',tags:['River Island','Vaishnavism','Offbeat'],img:'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=70',budget:{low:700,mid:1800,high:4000},highlights:['Kamalabari Satra main monastery','Auniati Satra rare relics','Garamur Satra mask making','Mask Making Workshop hands-on','Brahmaputra Sunset golden hour','Bird Watching migratory season'],food:['Masor Tenga sour fish','Pitha various rice cakes','Duck Curry black sesame','Bamboo Shoot fermented','Local Apong rice beer'],hotels:{low:'La Maison de Ananda',mid:'Majuli Resort',high:'Ygdrasil Eco Camp'},transport:'Ferry from Jorhat ₹50-80 then cycles',bestTime:'Oct–Mar',emergency:'Assam Police: 100',packing:['Light clothes','Rain jacket','Bicycle friendly wear','Camera','Insect repellent']},
    {name:'Valley of Flowers',state:'Uttarakhand',flag:'🌺',tags:['UNESCO','Alpine Meadows','Trekking'],img:'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=400&q=70',budget:{low:2000,mid:4500,high:9000},highlights:['300+ Alpine flower species bloom','Hemkund Sahib Sikh pilgrimage 4329m','Ghangaria Base Camp stay','River Pushpawati crystal clear','Photography paradise Aug-Sep','Himalayan Blue Poppy rare'],food:['Simple Daal Rice camps','Aloo Paratha breakfast','Kumaoni Thali local','Hot Chai essential','Maggi emergency noodles'],hotels:{low:'GMVN Camp Ghangaria',mid:'Trekkers Inn Ghangaria',high:'Green Trail Camp'},transport:'Trek from Govindghat 14km no vehicles in valley',bestTime:'Jun–Sep only park closed rest of year',emergency:'Uttarakhand Police: 100 | BSNL Joshimath: 01389-222002',packing:['Trek boots essential','Rain jacket always','Altitude sickness meds','Walking poles recommended','Camera']},
    {name:'Sundarbans',state:'West Bengal',flag:'🐯',tags:['Tiger','Mangroves','UNESCO'],img:'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&q=70',budget:{low:2000,mid:4000,high:9000},highlights:['Royal Bengal Tiger boat safari','Mangrove Forest largest world','Sudhanyakhali Watchtower tigers','Sajnekhali Wildlife Sanctuary birds','Dobanki Canopy Walk exciting','Netidhopani Ruins ancient'],food:['Fresh Fish Prawn curry','Tiger Prawn Malai Curry','Rice Fish main meal','Coconut Fish Curry','Machher Jhol light curry'],hotels:{low:'Forest Rest House WBTDC',mid:'Sundarban Jungle Camp',high:'Sajnekhali Tiger Camp'},transport:'Boat launch only access ₹3000-5000/day',bestTime:'Sep–Mar',emergency:'WB Police: 100 | Forest: 03210-252270',packing:['Neutral colours for safari','Binoculars essential','Insect repellent heavy duty','Rain jacket waterproof','Life jacket provided by boat']},
    {name:'Diu',state:'Daman & Diu',flag:'🏖️',tags:['Beach','Portuguese','Relaxed'],img:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=70',budget:{low:700,mid:1800,high:4500},highlights:['Diu Fort Portuguese 16th century','Nagoa Beach watersports resort zone','St. Paul Church restored museum','Ghoghla Beach long untouched','Jallandhar Beach sea temple','Gangeshwar Shivalingas sea washed'],food:['Fresh Lobster Grilled','Local Prawn Masala','Fish Curry coconut','Bebinca Portuguese dessert','Toddy coconut wine'],hotels:{low:'Jay Shankar Guest House',mid:'Herança Goesa resort',high:'Kohinoor Beach Resort'},transport:'Rent scooter ₹200-300/day or auto',bestTime:'Nov–Mar',emergency:'Diu Police: 100 | Coast Guard: 02875-252266',packing:['Beach wear','Light cotton','Sunscreen','Camera','Comfortable sandals']},
    {name:'Lepchajagat',state:'West Bengal',flag:'🌲',tags:['Offbeat','Forest','Silent'],img:'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=70',budget:{low:600,mid:1500,high:3500},highlights:['Dense Fir Forest silence heal','Bird Watching 300+ species','Jungle Night Walk safe guided','Deer Park tame spotted deer','Silent Zone digital detox','Stargazing dark sky certified'],food:['Darjeeling First Flush Tea','Steamed Momos local','Thukpa warming noodle','Simple Rice Meals','Boiled Farm Vegetables'],hotels:{low:'Forest Bungalow WBFDC',mid:'Lepchajagat Camp',high:'Samsara Retreat'},transport:'Shared jeep from NJP Siliguri ₹200-400',bestTime:'Mar–May & Sep–Nov',emergency:'WB Police: 100',packing:['Warm layers essential','Binoculars','Trekking shoes','Insect repellent','Camera']},
    {name:'Matheran',state:'Maharashtra',flag:'🌄',tags:['No Vehicles','Hill Station','Eco'],img:'https://images.unsplash.com/photo-1629467057571-42d22d8f0cbd?w=400&q=70',budget:{low:800,mid:2000,high:5000},highlights:['Panorama Point 360 valley view','Charlotte Lake monsoon swim','Echo Point sound trick valley','Louisa Point Prabal Fort view','Toy Train from Neral UNESCO','Horse Riding main transport'],food:['Chikki Famous Matheran','Vada Pav spicy','Hot Corn Bhutta','Masala Cutting Chai','Fresh Seasonal Fruits'],hotels:{low:'MTDC Resort',mid:'Lords Central Hotel',high:'Rushi Cottage Heritage'},transport:'NO vehicles allowed walk or horse ₹100-200',bestTime:'Oct–May',emergency:'Maharashtra Police: 100',packing:['Comfortable walking shoes most important','Rain jacket','Light backpack small','Camera','Water bottle']},
    {name:'Hemis',state:'J&K',flag:'🏔️',tags:['Monastery','Festival','Ladakh'],img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',budget:{low:1500,mid:3500,high:8000},highlights:['Hemis Monastery largest Ladakh','Hemis Festival masked dance June-July','Hemis National Park Snow Leopard','Indus River Valley views','Shang Sumdo camping spot','Nimmu Confluence point rivers'],food:['Thukpa classic noodles','Skyu thick pasta stew','Butter Tea po cha','Tsampa roasted barley','Khambir local bread'],hotels:{low:'Camp Hemis budget',mid:'Hunder Eco Safari',high:'The Ultimate Travelling Camp'},transport:'Shared taxi from Leh 40km or private jeep',bestTime:'Jun–Sep & June-July Festival',emergency:'Leh Police: 01982-252018',packing:['Heavy woolens','Down jacket','Altitude pills','Trekking boots','Camera']},
    {name:'Orchha',state:'Madhya Pradesh',flag:'🏰',tags:['Heritage','Temples','Bundelkhand'],img:'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=400&q=70',budget:{low:600,mid:1500,high:4000},highlights:['Orchha Fort complex riverside','Ram Raja Temple only king-god','Jahangir Mahal intricate façade','Raj Praveen Mahal garden pavilion','Chhatris cenotaphs 14 royal','Betwa River sunset rafting'],food:['Dal Bafla traditional Bundelkhand','Poha Jalebi morning combo','Bhutte ka Kees corn savoury','Laapsi sweet wheat porridge','Tehri rice vegetable mix'],hotels:{low:'MPSTDC Betwa Retreat',mid:'Amar Mahal Heritage',high:'Orchha Resort'},transport:'Cycle rickshaw or auto ₹30-60',bestTime:'Oct–Mar',emergency:'MP Police: 100',packing:['Comfortable walking shoes','Light clothes','Camera','Hat','Water bottle']},
    {name:'Gwalior',state:'Madhya Pradesh',flag:'🏰',tags:['Fort','Heritage','Music'],img:'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=70',budget:{low:700,mid:1800,high:4500},highlights:['Gwalior Fort Man Mandir Palace','Jai Vilas Mahal 2-tonne chandelier','Tansen Tomb music maestro','Saas Bahu Ka Temple twin','Sound Light Show fort evening','Gopachal Rock Jain carvings'],food:['Gwalior Gajak sesame sweet','Bedai poori breakfast','Jalebi crispy orange','Dal Bafla warming','Poha light simple'],hotels:{low:'Hotel India Palace',mid:'Usha Kiran Palace Heritage',high:'Taj Usha Kiran Palace'},transport:'Auto ₹30-80 or city bus',bestTime:'Oct–Mar',emergency:'MP Police: 100',packing:['Comfortable shoes','Light clothes','Camera','Hat','Water bottle']},
    {name:'Bundi',state:'Rajasthan',flag:'💧',tags:['Stepwells','Heritage','Offbeat'],img:'https://images.unsplash.com/photo-1477587458883-47145ed6979e?w=400&q=70',budget:{low:600,mid:1500,high:4000},highlights:['Taragarh Fort monkey kingdom','Raniji ki Baori giant stepwell','Sukh Mahal Kipling inspiration','Bundi Palace murals frescos','Nawal Sagar Lake floating temple','84 Pillared Cenotaph riverside'],food:['Rajasthani Thali full traditional','Bundi Ka Laddoo chickpea sweet','Dal Baati Churma','Mawa Kachori street sweet','Kachori Sabzi breakfast'],hotels:{low:'Haveli Braj Bhushanjee',mid:'Bundi Vilas Heritage',high:'Ishwari Niwas Palace'},transport:'Auto ₹30-60 or cycle for sightseeing',bestTime:'Oct–Mar',emergency:'Rajasthan Police: 100',packing:['Light cotton','Camera essential Insta spots','Hat','Sunscreen','Comfortable walking shoes']},
    {name:'Kanha',state:'Madhya Pradesh',flag:'🐯',tags:['Tiger Reserve','Wildlife','Jungle'],img:'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&q=70',budget:{low:2500,mid:5500,high:13000},highlights:['Kanha Tiger Reserve Kipling Jungle Book','Barasingha Swamp Deer saved extinction','Elephant Safari at dawn','Bamni Dadar Sunset Point','Sloth Bear sighting evening','Kanha Museum wildlife interpretation'],food:['Jungle Thali camp meals','Dal Bafla MP specialty','Simple Rice Daal warming','Poha Jalebi morning','Camp Chai ginger'],hotels:{low:'Kanha National Park Guesthouse',mid:'Shergarh Tented Camp',high:'Banjaar Tola Taj Safaris'},transport:'Open jeep safari ₹3500-5000 essential',bestTime:'Oct–Jun',emergency:'MP Police: 100 | Forest Control: 07649-277227',packing:['Neutral colours mandatory','Binoculars','Camera zoom lens','Early morning jacket','Insect repellent']},
  ]

  // ─── 50 INTERNATIONAL ─────────────────────────────────────────────────────────
  const INTL: Destination[] = [
    {name:'Paris',country:'France',flag:'🇫🇷',region:'Europe',tags:['Romance','Art','Food'],img:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=70',dayRate:{low:6000,mid:12000,high:28000},highlights:['Eiffel Tower sunrise skip queue','Louvre Museum Mona Lisa','Montmartre Artist Quarter walk','Seine River evening cruise','Versailles Palace gardens half day','Musée d\'Orsay Impressionist art'],food:['Fresh Croissant au beurre','French Onion Soup gratinée','Crêpes Suzette flambéed','Beef Bourguignon slow cooked','Macarons Pierre Hermé'],hotels:{low:'Generator Hostel Paris',mid:'Hotel Le Marais boutique',high:'Hôtel Ritz Paris'},transport:'Metro €2/ride or Vélib bicycle',bestTime:'Apr–Jun & Sep–Nov',emergency:'Police: 17 | SAMU: 15 | Fire: 18',packing:['Smart casual clothes','Comfortable walking shoes','Light jacket','Camera','Phrasebook']},
    {name:'Tokyo',country:'Japan',flag:'🇯🇵',region:'East Asia',tags:['Culture','Tech','Food'],img:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=70',dayRate:{low:5500,mid:11000,high:25000},highlights:['Shibuya Crossing at rush hour','Senso-ji Temple 5am pre-crowds','Tsukiji outer market breakfast','Harajuku Takeshita Street fashion','Akihabara Electronics gaming','Mount Fuji Fuji-Q Highland day'],food:['Sushi omakase chef selection','Ramen tonkotsu pork bone','Tempura crispy fresh','Wagyu A5 beef experience','Matcha Desserts everything'],hotels:{low:'K\'s House Tokyo Hostel',mid:'Shinjuku Granbell',high:'The Peninsula Tokyo'},transport:'IC Suica card subway ¥170-300 or JR Pass',bestTime:'Mar–May cherry blossom & Sep–Nov',emergency:'Police: 110 | Ambulance: 119',packing:['Comfortable walking shoes','IC transport card','Pocket WiFi','Japan Rail Pass','Cash yen']},
    {name:'Bali',country:'Indonesia',flag:'🇮🇩',region:'Southeast Asia',tags:['Beach','Culture','Yoga'],img:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=70',dayRate:{low:2200,mid:5000,high:13000},highlights:['Tanah Lot cliff temple sunset','Ubud Sacred Monkey Forest','Tegalalang Rice Terrace sunrise','Seminyak Beach sunset Ku De Ta','Mount Batur 4am sunrise trek','Uluwatu Kecak dance sunset'],food:['Nasi Goreng fried rice national','Chicken Satay peanut sauce','Babi Guling roast suckling pig','Jamu herbal wellness drink','Lawar green bean pork dish'],hotels:{low:'Katamama Hostel social',mid:'Alaya Resort Ubud',high:'Four Seasons Sayan jungle'},transport:'Scooter rent $5-8/day or Grab app',bestTime:'Apr–Oct dry season',emergency:'Police: 110 | Ambulance: 118',packing:['Light clothes','Reef-safe sunscreen','Sarong for temples','Mosquito repellent','Reef shoes']},
    {name:'Dubai',country:'UAE',flag:'🇦🇪',region:'Middle East',tags:['Luxury','Shopping','Desert'],img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=70',dayRate:{low:5000,mid:10500,high:26000},highlights:['Burj Khalifa 124th floor sunset','Dubai Mall fountain show','Desert Safari dune bashing','Palm Jumeirah Atlantis beach','Dubai Frame iconic bridge','Gold Souk bargain hunt'],food:['Shawarma Al Mallah best','Al Harees Ramadan slow wheat','Margoog slow meat rice','Luqaimat honey dumplings sweet','Machboos spiced rice chicken'],hotels:{low:'Citymax Hotel Bur Dubai',mid:'Sofitel Dubai Downtown',high:'Atlantis The Palm'},transport:'Metro AED 4-10 or Careem taxi',bestTime:'Nov–Mar',emergency:'Police: 999 | Ambulance: 998',packing:['Smart dress codes apply','Modest cover-up for malls','Sunscreen SPF50','Sunglasses','Comfortable shoes']},
    {name:'Bangkok',country:'Thailand',flag:'🇹🇭',region:'Southeast Asia',tags:['Street Food','Temples','Nightlife'],img:'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=70',dayRate:{low:2000,mid:4500,high:11000},highlights:['Grand Palace Emerald Buddha','Wat Arun Temple Dawn riverside','Chatuchak 15000 stalls weekend','Khao San Road backpacker street','Floating Market Damnoen Saduak','Wat Pho reclining Buddha massage'],food:['Pad Thai Thip Samai best','Tom Yum Goong river prawn','Mango Sticky Rice street sweet','Green Curry coconut creamy','Boat Noodles blood thickened'],hotels:{low:'NapPark Hostel social',mid:'Arnoma Grand Bangkok',high:'Capella Bangkok riverside'},transport:'BTS Skytrain ฿16-59 or Grab app',bestTime:'Nov–Mar',emergency:'Tourist Police: 1155 | Ambulance: 1669',packing:['Modest temple wear','Light cotton','Dehydration salts','Stomach medicine','Comfortable shoes']},
    {name:'Singapore',country:'Singapore',flag:'🇸🇬',region:'Southeast Asia',tags:['Modern','Food','Shopping'],img:'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=400&q=70',dayRate:{low:5000,mid:10000,high:22000},highlights:['Gardens by the Bay Supertrees','Marina Bay Sands infinity pool hotel','Sentosa Universal Studios','Hawker Centre authentic outdoor','Night Safari world first','Little India Chinatown contrast'],food:['Chicken Rice national dish','Laksa spicy coconut noodle','Char Kway Teow wok fried','Chilli Crab iconic messy','Kaya Toast breakfast set'],hotels:{low:'Fort Hostel social',mid:'PARKROYAL Marina Bay',high:'Marina Bay Sands Hotel'},transport:'MRT EZ-Link card SGD 0.9-2.5',bestTime:'Feb–Apr least rain',emergency:'Police: 999 | Ambulance: 995',packing:['Light cotton','Umbrella sudden showers','Smart casual restaurants','Sunscreen','Good walking shoes']},
    {name:'London',country:'UK',flag:'🇬🇧',region:'Europe',tags:['History','Culture','Tea'],img:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=70',dayRate:{low:7000,mid:14000,high:32000},highlights:['Tower of London Crown Jewels','Buckingham Palace Changing Guards','British Museum free all day','Borough Market food paradise','Thames South Bank walk free','Notting Hill pastel houses'],food:['Fish and Chips newspaper style','Full English Breakfast pub style','Afternoon Tea Claridges','Beef Wellington Gordon Ramsay style','Scotch Egg artisan'],hotels:{low:'St Christopher\'s Village Hostel',mid:'Z Hotel Soho',high:'Claridge\'s Mayfair'},transport:'Oyster card Tube £2.40-4.90 journey',bestTime:'May–Sep',emergency:'Police Ambulance Fire: 999',packing:['Waterproof jacket essential','Layered clothing','Comfortable walking shoes','Oyster card','Umbrella']},
    {name:'Rome',country:'Italy',flag:'🇮🇹',region:'Europe',tags:['History','Food','Art'],img:'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=70',dayRate:{low:5500,mid:10500,high:24000},highlights:['Colosseum arena floor tour','Vatican Museums Sistine Chapel','Trevi Fountain coin wish','Pantheon free 2000 years old','Trastevere evening neighbourhood wine','Borghese Gallery book ahead'],food:['Cacio e Pepe Roman classic','Supplì fried rice balls street','Gelato Fatamorgana artisan','Pizza al Taglio by weight','Carbonara Roscioli best'],hotels:{low:'The Yellow Hostel social',mid:'Hotel Artemide Rome',high:'Hotel Eden Rome rooftop'},transport:'Metro €1.50 or walk historic centre',bestTime:'Apr–Jun & Sep–Oct',emergency:'Police: 113 | Ambulance: 118',packing:['Comfortable walking shoes','Modest church wear knees shoulders','Light layers','Camera','Portable charger']},
    {name:'Barcelona',country:'Spain',flag:'🇪🇸',region:'Europe',tags:['Architecture','Beach','Nightlife'],img:'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&q=70',dayRate:{low:5000,mid:10000,high:23000},highlights:['Sagrada Familia Gaudí unfinished wonder','Park Güell mosaic terrace free','La Boqueria market breakfast','Gothic Quarter maze walk lost','Barceloneta Beach urban beach','Casa Batlló night show'],food:['Patatas Bravas everywhere tapas','Pan con Tomate bread tomato','Paella Barceloneta seafood','Crema Catalana original crème brûlée','Jamón Ibérico market','Tapas bar hopping evening'],hotels:{low:'Sant Jordi Hostel rooftop pool',mid:'Hotel Arts Barcelona luxury',high:'W Barcelona beachfront'},transport:'T-Casual 10-journey metro €11.35',bestTime:'May–Jun & Sep–Oct',emergency:'Police: 112 | Ambulance: 061',packing:['Beach wear','Smart casual evenings','Comfortable shoes','Pickpocket-proof bag','Camera']},
    {name:'Maldives',country:'Maldives',flag:'🇲🇻',region:'South Asia',tags:['Luxury','Beach','Diving'],img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=70',dayRate:{low:9000,mid:20000,high:55000},highlights:['Overwater Bungalow sunrise private','Snorkeling house reef coral garden','Submarine Tour Whale Shark','Dolphin Watching sunset cruise','Manta Ray Night Diving','Private Sandbank picnic champagne'],food:['Garudhiya clear tuna soup','Mas Huni tuna coconut breakfast','Fihunu Mas BBQ fish on beach','Saagu Bondibai sago dessert','Coconut Roshi flatbread'],hotels:{low:'Kaani Grand Seaview local island',mid:'Centara Grand Maldives water villas',high:'Soneva Fushi overwater'},transport:'Seaplane most spectacular or speedboat',bestTime:'Nov–Apr dry season',emergency:'Police: 119 | Ambulance: 102',packing:['Swimwear multiple','Reef-safe sunscreen mandatory','Underwater camera','Formal wear fine dining','Light dresses evenings']},
    {name:'New York',country:'USA',flag:'🇺🇸',region:'North America',tags:['City','Culture','Shopping'],img:'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=70',dayRate:{low:7500,mid:16000,high:38000},highlights:['Central Park free all year','Empire State Building sunset','Times Square night chaos','Metropolitan Museum 5000 years art','Brooklyn Bridge walk free','Statue of Liberty ferry morning'],food:['NY Style Pizza Joe\'s Coal Fired','Pastrami Sandwich Katz\'s Deli','Bagel with Lox Russ & Daughters','New York Cheesecake Junior\'s','Classic Hot Dog Gray\'s Papaya'],hotels:{low:'HI New York Hostel',mid:'Pod 51 Hotel Manhattan',high:'The Plaza Fifth Avenue'},transport:'MetroCard subway $2.90 or walk Manhattan',bestTime:'Apr–Jun & Sep–Nov',emergency:'Police Fire Ambulance: 911',packing:['Layered clothing all seasons','Comfortable walking shoes daily','ESTA pre-approved','Power adapter','Good camera']},
    {name:'Santorini',country:'Greece',flag:'🇬🇷',region:'Europe',tags:['Romance','Beach','Views'],img:'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=70',dayRate:{low:5500,mid:12000,high:28000},highlights:['Oia Sunset best in Greece','Fira caldera walk cliff edge','Red Beach volcanic unusual','Akrotiri Bronze Age Pompeii excavation','Wine Tasting Assyrtiko local','Caldera Boat Trip volcano swim'],food:['Tomatokeftedes tomato fritters','Grilled Octopus with ouzo','Fresh Fava Yellow Split Pea','Saganaki pan-fried cheese','Local Assyrtiko White Wine'],hotels:{low:'Youth Hostel Anna basic',mid:'Andronis Concept wellness',high:'Grace Santorini infinity pool'},transport:'ATV quad bike €25/day or bus €1.80',bestTime:'Apr–Jun & Sep–Oct',emergency:'Police: 100 | Ambulance: 166',packing:['White linen clothes','Comfortable sandals','Camera sunset spots','Sunscreen high factor','Evening dress restaurants']},
    {name:'Cape Town',country:'South Africa',flag:'🇿🇦',region:'Africa',tags:['Nature','Adventure','Beach'],img:'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=70',dayRate:{low:3500,mid:7500,high:18000},highlights:['Table Mountain cable car fast','Cape Point most south-west tip','V&A Waterfront market seafood','Boulders Beach African Penguins','Cape Winelands Stellenbosch half day','Camps Bay Clifton beach sunset'],food:['Braai South African BBQ culture','Bunny Chow curry in bread','Boerewors grilled sausage farmer','Malva Pudding warm sweet pudding','Cape Malay Curry apricot mild'],hotels:{low:'The Backpack Hostel vibey',mid:'The Portswood Hotel Waterfront',high:'Belmond Mount Nelson historic'},transport:'Uber very affordable or car hire',bestTime:'Nov–Apr South African summer',emergency:'Police: 10111 | Ambulance: 10177',packing:['Layered clothing','Windproof jacket','Sunscreen','Good walking shoes','Camera']},
    {name:'Kyoto',country:'Japan',flag:'🇯🇵',region:'East Asia',tags:['Culture','Temples','History'],img:'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=70',dayRate:{low:5000,mid:10000,high:22000},highlights:['Fushimi Inari 10000 torii gates dawn','Arashiyama Bamboo Grove early morning','Kinkaku-ji Golden Pavilion reflection','Nishiki Market narrow food','Gion District Geisha spotting evening','Philosopher\'s Path cherry blossom'],food:['Kaiseki multi-course traditional','Tofu Kyoto Nishiki Market','Matcha everything ceremony','Yudofu hot tofu winter','Tsukemono pickled vegetables'],hotels:{low:'K\'s House Kyoto hostel',mid:'The Hotel Seiryu boutique',high:'Aman Kyoto forest ryokan'},transport:'Bus Day Pass ¥700 or bicycle',bestTime:'Mar–May & Oct–Nov',emergency:'Police: 110 | Ambulance: 119',packing:['Modest temple wear','Comfortable walking shoes','Layered clothes','IC Suica card','Yen cash']},
    {name:'Amsterdam',country:'Netherlands',flag:'🇳🇱',region:'Europe',tags:['Culture','Canals','Museums'],img:'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&q=70',dayRate:{low:6000,mid:12000,high:27000},highlights:['Rijksmuseum Night Watch Rembrandt','Anne Frank House book ahead','Canal Boat Tour 90 min classic','Vondelpark Sunday picnic free','Heineken Brewery Experience tour','Albert Cuyp Market Saturday'],food:['Stroopwafel caramel wafer warm','Bitterballen deep fried beef','Poffertjes mini fluffy pancakes','Hollandse Nieuwe raw herring','Dutch Aged Gouda market'],hotels:{low:'StayOkay Hostel canalside',mid:'Hotel V Nesplein',high:'Hotel de l\'Europe iconic'},transport:'OV-Chipkaart tram €3.20 zone or bike €10-15/day',bestTime:'Apr–Aug tulip season',emergency:'Police Ambulance Fire: 112',packing:['Waterproof jacket','Comfortable shoes','Bike gear helmet optional','Layered clothes','Camera']},
    {name:'Istanbul',country:'Turkey',flag:'🇹🇷',region:'Europe',tags:['History','Food','Culture'],img:'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=70',dayRate:{low:3000,mid:6500,high:16000},highlights:['Hagia Sophia 1500 years history','Blue Mosque still active inside','Grand Bazaar 4000 shops bargain','Bosphorus Cruise Asia Europe','Topkapi Palace Ottoman power','Spice Bazaar aromatic colours'],food:['Döner Kebab classic street','Baklava pistachio walnut layered','Turkish Breakfast mezze spread','Simit sesame ring street bread','Lahmacun Turkish pizza thin'],hotels:{low:'Agora Hostel Sultanahmet',mid:'Georges Hotel Galata modern',high:'Four Seasons Sultanahmet palace'},transport:'Istanbulkart metro tram ₺7.5 or ferry hop',bestTime:'Apr–May & Sep–Nov',emergency:'Police: 155 | Ambulance: 112',packing:['Modest mosque wear women scarf','Comfortable shoes cobblestones','Layered clothes','Camera','Turkish Lira cash']},
    {name:'Phuket',country:'Thailand',flag:'🇹🇭',region:'Southeast Asia',tags:['Beach','Nightlife','Diving'],img:'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400&q=70',dayRate:{low:2500,mid:5500,high:14000},highlights:['Patong Beach main busy strip','Phi Phi Islands speedboat day','James Bond Island Phang Nga Bay','Big Buddha 45m white marble','Old Phuket Town Sino-Portuguese','Phang Nga Sea Kayaking mangrove'],food:['Pad Thai Thip Samai quality','Massaman Curry Muslim Persian','Tom Kha Gai coconut galangal','Mango Sticky Rice cart street','Fresh Grilled Seafood beach'],hotels:{low:'Lub d Phuket Patong',mid:'Kata Rocks Resort cliffs',high:'Trisara Phuket villas'},transport:'Grab taxi or scooter ฿150-200/day',bestTime:'Nov–Apr dry season',emergency:'Tourist Police: 1155 | Ambulance: 1669',packing:['Beach wear swimwear','Reef-safe sunscreen','Light cotton','Flip flops','Waterproof dry bag']},
    {name:'Prague',country:'Czech Republic',flag:'🇨🇿',region:'Europe',tags:['Architecture','History','Beer'],img:'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400&q=70',dayRate:{low:4000,mid:8500,high:20000},highlights:['Prague Castle 9th century complex','Charles Bridge sunrise golden','Old Town Square Astronomical Clock','Josefov Jewish Quarter history','Vyšehrad fortress views city','Wenceslas Square Christmas market'],food:['Svíčková sirloin cream sauce','Trdelník chimney pastry cinnamon','Roast Pork Knuckle sauerkraut','Pilsner Urquell Czech beer','Goulash beef paprika bread'],hotels:{low:'MadHouse Prague central hostel',mid:'Hotel Josef design',high:'Four Seasons Prague riverfront'},transport:'DPP metro tram Kč24/90min or walk compact',bestTime:'May–Sep',emergency:'Police: 158 | Ambulance: 155',packing:['Comfortable walking shoes cobblestones','Layered clothes','Waterproof jacket','Camera','Kč Czech koruna cash']},
    {name:'Vietnam',country:'Vietnam',flag:'🇻🇳',region:'Southeast Asia',tags:['Culture','Food','Nature'],img:'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=70',dayRate:{low:1800,mid:4200,high:10000},highlights:['Halong Bay limestone karst cruise','Hoi An Ancient Town lanterns evening','Ho Chi Minh City motorbike chaos','Sapa Rice Terraces ethnic tribes','Hue Imperial Citadel royal tombs','Mekong Delta boat coconut candy'],food:['Pho Bo beef noodle soup broth','Banh Mi Vietnamese baguette','Bun Cha grilled pork Hanoi','Cao Lau Hoi An regional noodle','Goi Cuon fresh spring rolls'],hotels:{low:'Vietnam Backpacker Hostel chain',mid:'Nam Hai Hoi An luxury',high:'Amanoi Resort Central Vietnam'},transport:'Grab app or overnight sleeper train',bestTime:'Mar–Apr & Sep–Nov',emergency:'Police: 113 | Ambulance: 115',packing:['Light clothes humid','Rain jacket','Mosquito repellent','Quick-dry fabrics','Vietnamese Dong cash']},
    {name:'New Zealand',country:'New Zealand',flag:'🇳🇿',region:'Oceania',tags:['Adventure','Nature','Scenic'],img:'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&q=70',dayRate:{low:7500,mid:15000,high:35000},highlights:['Milford Sound fjord UNESCO cruise','Hobbiton Movie Set Matamata','Franz Josef Glacier heli-hike','Queenstown Bungee AJ Hackett','Bay of Islands dolphins sailing','Tongariro Alpine Crossing volcano'],food:['Hāngī earth oven Māori feast','Meat Pie iconic NZ comfort','Pavlova meringue cream dessert','Green-lipped Mussels fresh','Manuka Honey healing world best'],hotels:{low:'BBH Budget Backpacker Hostels',mid:'Millbrook Resort Queenstown',high:'Eagles Nest Bay of Islands'},transport:'Campervan $80-150/day freedom or domestic flights',bestTime:'Dec–Feb NZ summer',emergency:'Police Fire Ambulance: 111',packing:['Layered clothing all conditions','Waterproof jacket essential','Hiking boots','NZ dollars','Camera landscapes']},
    {name:'Seoul',country:'South Korea',flag:'🇰🇷',region:'East Asia',tags:['K-Culture','Food','Tech'],img:'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&q=70',dayRate:{low:4500,mid:9000,high:20000},highlights:['Gyeongbokgung Palace changing guards','Bukchon Hanok Village traditional','Myeongdong cosmetics street eating','N Seoul Tower padlock panorama','Hongdae indie music nightlife','DMZ Demilitarized Zone sobering'],food:['Korean BBQ KBBQ grill table','Bibimbap mixed rice veggies egg','Tteokbokki spicy rice cakes street','Samgyeopsal pork belly grill','Bingsu shaved ice dessert mango'],hotels:{low:'Kimchee Hostel Hongdae',mid:'Westin Josun Seoul classic',high:'Four Seasons Seoul'},transport:'T-money card subway ₩1250/ride',bestTime:'Apr–May & Sep–Oct',emergency:'Police: 112 | Ambulance: 119',packing:['Layered clothes 4 seasons','K-fashion items shopping budget','Comfortable shoes lots walking','Power bank K-beauty items','T-money card']},
    {name:'Marrakech',country:'Morocco',flag:'🇲🇦',region:'Africa',tags:['Culture','Souks','Desert'],img:'https://images.unsplash.com/photo-1539020140153-e479b8b22e73?w=400&q=70',dayRate:{low:2500,mid:5500,high:14000},highlights:['Jemaa el-Fna square chaos sunset','Medina Souks leather tannery Chouara','Majorelle Garden Yves Saint Laurent','Bahia Palace 160 rooms ornate','Atlas Mountains Berber day trip','Desert Camel Trek Erg Chebbi'],food:['Lamb Tagine preserved lemon','Couscous Friday traditional','Pastilla pigeon pastry sweet savoury','Harira lentil tomato soup Ramadan','Fresh Mint Tea ritual welcome'],hotels:{low:'Riad Yima rooftop pool',mid:'Es Saadi Resort pool',high:'La Mamounia legendary'},transport:'Petit taxi MAD 20-50 negotiate or walk medina',bestTime:'Mar–May & Sep–Nov',emergency:'Police: 19 | Ambulance: 15',packing:['Modest clothing shoulders knees','Comfortable shoes medina cobbles','Scarf versatile','Camera','Dirhams cash']},
    {name:'Rio de Janeiro',country:'Brazil',flag:'🇧🇷',region:'South America',tags:['Carnival','Beach','Nature'],img:'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&q=70',dayRate:{low:4000,mid:8000,high:18000},highlights:['Christ the Redeemer sunrise cable','Sugarloaf Mountain cable car both','Copacabana Beach 4km arc','Ipanema Beach fashion beautiful people','Lapa Arches Saturday samba street','Tijuca Forest urban national park'],food:['Churrasco rodizio all-you-can-eat','Açaí Bowl purple antioxidant','Pão de Queijo cheese bread warm','Caipirinha national cocktail lime','Feijoada black bean pork Saturday'],hotels:{low:'Discovery Hostel Santa Teresa',mid:'Windsor Excelsior Copacabana',high:'Belmond Copacabana Palace'},transport:'Metro R$5.10 or 99 taxi app',bestTime:'Dec–Mar Carnival or Jun–Aug dry',emergency:'Police: 190 | Ambulance: 192',packing:['Beach wear light','Anti-theft bag crossbody','Minimal jewellery','Sunscreen very strong','Camera carefully']},
    {name:'Petra',country:'Jordan',flag:'🇯🇴',region:'Middle East',tags:['UNESCO','Ancient','Desert'],img:'https://images.unsplash.com/photo-1580834340874-1f9b5e82d0d0?w=400&q=70',dayRate:{low:3500,mid:7000,high:16000},highlights:['The Treasury Al-Khazneh reveal moment','Monastery Ad-Deir 800 steps worth','Siq Canyon 1.2km walk reveal','High Place of Sacrifice panorama','Petra by Night candles Tuesday Thu Sat','Wadi Rum overnight Bedouin camp'],food:['Mansaf lamb fermented yoghurt national','Falafel fresh fried crispy','Hummus with olive oil mezze','Maqluba upside-down rice','Knafeh cheese syrup dessert'],hotels:{low:'Valentine Inn budget local',mid:'Movenpick Petra comfortable',high:'Petra Guest House cave rooms'},transport:'Horse into Petra JD7 or walk 1.2km Siq',bestTime:'Mar–May & Sep–Nov',emergency:'Police: 191 | Ambulance: 911',packing:['8km minimum walking shoes comfortable','Modest clothing','Hat essential','Sunscreen factor 50','2+ litres water carry']},
    {name:'Budapest',country:'Hungary',flag:'🇭🇺',region:'Europe',tags:['Thermal Baths','History','Nightlife'],img:'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&q=70',dayRate:{low:4000,mid:8500,high:19000},highlights:['Széchenyi Thermal Bath pools evening','Chain Bridge walk Parliament view','Parliament Building free for EU citizens','Buda Castle history complex','Szimpla Kert Ruin Bar Friday night','Heroes Square Millennium Monument'],food:['Goulash beef paprika national dish','Lángos deep fried dough sour cream','Kürtőskalács chimney cake Váci street','Chicken Paprikash sour cream sauce','Tokaji Aszú botrytis dessert wine'],hotels:{low:'Carpe Noctem Hostel',mid:'Prestige Hotel Budapest',high:'Four Seasons Gresham Palace'},transport:'BKK 72hr card HUF 5500 all transport',bestTime:'Apr–Jun & Sep–Oct',emergency:'Police: 107 | Ambulance: 104',packing:['Swimwear thermal baths','Comfortable shoes hills','Smart casual ruin bars','Camera Parliament','Forint HUF cash']},
    {name:'Vienna',country:'Austria',flag:'🇦🇹',region:'Europe',tags:['Classical Music','Art','Cafés'],img:'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400&q=70',dayRate:{low:5500,mid:11000,high:25000},highlights:['Schönbrunn Palace gardens 1441 rooms','St. Stephen\'s Cathedral South Tower','Vienna State Opera standing €4','Naschmarkt Saturday farmers market','Belvedere Klimt Kiss painting','Prater Giant Ferris Wheel 1897'],food:['Wiener Schnitzel veal pounded thin','Sachertorte Hotel Sacher original','Apfelstrudel Café Central classic','Tafelspitz boiled beef traditional','Melange Coffee Viennese style'],hotels:{low:'Wombat\'s City Hostel Vienna',mid:'Hotel Rathaus Wein und Design',high:'Hotel Imperial Vienna'},transport:'Vienna City Card €17-29 all day transport',bestTime:'May–Sep',emergency:'Police: 133 | Ambulance: 144',packing:['Smart casual opera dress code','Comfortable shoes','Layered clothes','Camera','Euro cash']},
    {name:'Sri Lanka',country:'Sri Lanka',flag:'🇱🇰',region:'South Asia',tags:['Culture','Beach','Wildlife'],img:'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=70',dayRate:{low:2200,mid:5000,high:12000},highlights:['Sigiriya Rock Fortress UNESCO dawn climb','Kandy Temple of Tooth daily puja','Yala Safari leopard highest density','Mirissa Whale Watching Blue Whales','Galle Fort Dutch colonial walk','Tea Country Train Ella to Kandy'],food:['Rice and Curry 12 dishes traditional','Kottu Roti chopped flattened bread','Hoppers crispy bowl-shaped fermented','Pol Sambol raw coconut fresh','Watalappan jaggery coconut pudding'],hotels:{low:'Hangover Hostel Ella',mid:'Cinnamon Grand Colombo',high:'Amanwella Tangalle'},transport:'Tuk-tuk LKR 50-200 or PickMe app',bestTime:'Nov–Apr west south coast',emergency:'Police: 119 | Ambulance: 110',packing:['Light cotton','Modest temple wear','Mosquito repellent','Rain jacket','Sunscreen']},
    {name:'Machu Picchu',country:'Peru',flag:'🇵🇪',region:'South America',tags:['Inca','Wonder','Trek'],img:'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&q=70',dayRate:{low:5000,mid:10000,high:22000},highlights:['Machu Picchu citadel dawn before crowds','Inca Trail 4-day classic trek','Sun Gate Inti Punku arrival moment','Huayna Picchu Mountain extra ticket','Aguas Calientes thermal baths night','Sacred Valley Pisac market Sunday'],food:['Ceviche fresh lime tiger\'s milk','Cuy Guinea Pig special occasion','Lomo Saltado stir fry Chinese Peruvian','Chicha Morada purple corn drink','Quinoa Soup Andean highlands warm'],hotels:{low:'Hostal Munay Tika Aguas',mid:'Inkaterra Machu Picchu Pueblo',high:'Belmond Sanctuary Lodge at gate'},transport:'Peru Rail train Cusco-Aguas then bus ₹ site',bestTime:'May–Sep dry season',emergency:'Police: 105 | Ambulance: 106',packing:['Altitude sickness Diamox consult doctor','Layered clothes cold mornings','Waterproof jacket','Trekking boots','Sunscreen high altitude']},
    {name:'Nairobi',country:'Kenya',flag:'🇰🇪',region:'Africa',tags:['Safari','Wildlife','Nature'],img:'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=70',dayRate:{low:4000,mid:8500,high:22000},highlights:['Masai Mara Great Migration Jul-Oct','Nairobi National Park city backdrop','Giraffe Centre feed breakfast','Bomas of Kenya cultural performance','David Sheldrick Elephant Orphanage','Lake Nakuru Pink Flamingo spectacle'],food:['Nyama Choma roasted goat celebration','Ugali cornmeal staple with sukuma','Sukuma Wiki collard greens everyday','Mandazi East African doughnut','Tusker Lager Kenya beer'],hotels:{low:'Wildebeest Eco Camp Karen',mid:'Fairview Hotel Nairobi garden',high:'Angama Mara suspended Mara'},transport:'Safari jeep included packages or Bolt taxi',bestTime:'Jun–Oct & Jan–Feb dry',emergency:'Police: 999 | Ambulance: 999',packing:['Neutral earth safari colours','Binoculars essential','Camera zoom long','Yellow fever vaccination required','Malaria prevention pills']},
    {name:'Reykjavik',country:'Iceland',flag:'🇮🇸',region:'Europe',tags:['Northern Lights','Nature','Adventure'],img:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=70',dayRate:{low:9000,mid:18000,high:40000},highlights:['Northern Lights Sep-Mar hunt village dark','Blue Lagoon geothermal silica spa','Golden Circle Geysir Gullfoss waterfall','Whale Watching humpback minke','Glacier Hike Solheimajokull crampons','Vik Black Sand Beach Reynisfjara'],food:['Plokkfiskur fish potato stew traditional','Skyr thick Icelandic yoghurt','Lamb Soup slow cooked hearty','Hot Dogs Bæjarins Beztu iconic','Kleinur Icelandic pastry twisted'],hotels:{low:'KEX Hostel Reykjavik bar',mid:'Hotel Borg art deco city centre',high:'Ion Adventure Hotel lava'},transport:'Car hire essential ISK 10000-20000/day ring road',bestTime:'Jun–Aug midnight sun & Sep–Mar Northern Lights',emergency:'Police Ambulance Fire: 112',packing:['Waterproof jacket windproof essential','Thermal base layers','Waterproof hiking boots','Camera Aurora tripod','Extra batteries cold kills fast']},
    {name:'Lisbon',country:'Portugal',flag:'🇵🇹',region:'Europe',tags:['Fado','Culture','Scenic'],img:'https://images.unsplash.com/photo-1558370781-d6196949e317?w=400&q=70',dayRate:{low:5000,mid:10000,high:23000},highlights:['Belém Tower Tagus River UNESCO','São Jorge Castle Moorish views','Alfama Fado show authentic evening','Sintra fairytale palaces day trip','LX Factory Sunday market creative','Jerónimos Monastery Vasco da Gama'],food:['Pastéis de Nata custard tart warm','Bacalhau 365 recipes salted cod','Francesinha Porto beer sauce sandwich','Grilled Sardines St Anthony June','Ginjinha cherry liqueur standing shot'],hotels:{low:'Home Hostel Lisbon social',mid:'Memmo Príncipe Real boutique',high:'Bairro Alto Hotel panoramic'},transport:'Viva Viagem tram Zapping or walk hills',bestTime:'Mar–May & Sep–Oct',emergency:'Police Ambulance Fire: 112',packing:['Comfortable uphill walking shoes essential','Light layers','Camera tram selfies','Tram card pre-loaded','Euro cash']},
    {name:'Bora Bora',country:'French Polynesia',flag:'🇵🇫',region:'Oceania',tags:['Luxury','Lagoon','Honeymoon'],img:'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=70',dayRate:{low:15000,mid:30000,high:75000},highlights:['Overwater Bungalow sunrise private deck','Snorkeling Coral Garden rainbow fish','Shark Ray Feeding shallows safe','Mount Otemanu hike jungle guide','Sunset Catamaran cruise cocktails','Motu Picnic private sandbank'],food:['Poisson Cru French Polynesian ceviche','Mahi-Mahi grilled pineapple','Fresh Lobster resort beach','Everything Coconut natural island','Tropical Fruits Tahitian vanilla'],hotels:{low:'Pension Fare Miti local island',mid:'Le Maitai Polynesia lagoon villas',high:'Four Seasons Bora Bora ultimate'},transport:'Water taxis between motus $5-15 or resort boat',bestTime:'May–Oct dry season',emergency:'Police: 17 | Ambulance: 15',packing:['Swimwear multiple','Reef-safe sunscreen mandatory reefs','Underwater camera gopro','Light casual dresses evenings','Formal wear fine dining resort']},
    {name:'Kathmandu',country:'Nepal',flag:'🇳🇵',region:'South Asia',tags:['Trekking','Spirituality','Himalayas'],img:'https://images.unsplash.com/photo-1467377791767-c929b5dc9a23?w=400&q=70',dayRate:{low:1800,mid:4000,high:9000},highlights:['Pashupatinath cremation ghat sacred','Swayambhunath Monkey Temple hilltop','Boudhanath Stupa largest Nepal walk','Thamel Backpacker District shopping','Bhaktapur Durbar Square medieval UNESCO','Annapurna Base Camp Trek permit'],food:['Dal Bhat power lunch dinner national','Momo dumplings everywhere addictive','Sel Roti ring donut festivals','Chhoyla spiced marinated meat Newari','Tongba millet warm beer bamboo straw'],hotels:{low:'Alobar1000 Hostel Thamel',mid:'Hotel Yak and Yeti classic',high:'Dwarika\'s Hotel living heritage'},transport:'Uber InDrive or taxi NPR 100-300 bargain',bestTime:'Oct–Nov & Mar–May',emergency:'Police: 100 | Ambulance: 102',packing:['Altitude sickness Diamox doctor consult','Layered clothes cold nights','Trek boots broken in','Cash NPR','Down jacket Himalayan cold']},
    {name:'Queenstown',country:'New Zealand',flag:'🇳🇿',region:'Oceania',tags:['Adventure','Skiing','Scenic'],img:'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&q=70',dayRate:{low:8000,mid:16000,high:36000},highlights:['AJ Hackett Bungee original Kawarau','Milford Sound Fly Cruise Fly unforgettable','Gondola summit Luge thrill ride','Skydive 15000ft Remarkables backdrop','Lord of the Rings Glenorchy tour','Shotover Jet 85kmh rapids thrills'],food:['Fergburger legendary queue worth it','Whitebait Fritters West Coast rare','Feijoa Smoothie uniquely NZ','Fush n Chups Vudu Café','Central Otago Pinot Noir world best'],hotels:{low:'Haka Lodge central location',mid:'Eichardt\'s Private Hotel lakefront',high:'Blanket Bay Lodge Glenorchy luxury'},transport:'Intercity buses or Uber exists limited',bestTime:'Dec–Feb summer & Jun–Aug skiing',emergency:'Police Fire Ambulance: 111',packing:['Layered outdoor gear essential','Waterproof jacket always','Activity specific clothes','NZ dollars','Camera landscapes']},
    {name:'Havana',country:'Cuba',flag:'🇨🇺',region:'North America',tags:['Culture','Music','Classic Cars'],img:'https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=400&q=70',dayRate:{low:3500,mid:7000,high:15000},highlights:['Old Havana Habana Vieja UNESCO walk','El Malecón seafront sunset social','Che Guevara Mausoleum Santa Clara','Viñales Valley tobacco plantation','Classic Car Tour 1950s Chevrolet','Buena Vista Social Club live concert'],food:['Ropa Vieja shredded beef national','Moros y Cristianos black beans rice','Cuban Sandwich pressed midnight snack','Daiquiri La Floridita Hemingway bar','Mojito La Bodeguita del Medio'],hotels:{low:'Casa Particular local homestay',mid:'Hotel Nacional de Cuba iconic',high:'Gran Hotel Manzana Kempinski'},transport:'Classic taxi negotiate CUC 10-20 or almendron',bestTime:'Nov–Apr',emergency:'Police: 106 | Ambulance: 104',packing:['USD cash cards dont work everywhere','Light cotton hot humid','Sunscreen','Camera time machine feeling','Insect repellent evenings']},
    {name:'Cairo',country:'Egypt',flag:'🇪🇬',region:'Africa',tags:['Ancient','Pyramids','History'],img:'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=400&q=70',dayRate:{low:2500,mid:5500,high:13000},highlights:['Giza Pyramids Sphinx at dawn camel','Egyptian Museum 120000 artefacts','Khan el-Khalili Bazaar gold silver spice','Nile Felucca Sunset Cruise traditional','Abu Simbel day flight south Ramses','Old Cairo Coptic neighbourhood'],food:['Koshari lentils rice pasta national','Ful Medames fava bean breakfast','Shawarma lamb chicken everywhere','Om Ali bread milk nuts dessert','Baklava honey walnut Ottoman'],hotels:{low:'Cairo Backpackers Zamalek',mid:'Kempinski Nile Hotel Corniche',high:'Four Seasons Cairo Nile Plaza'},transport:'Uber Metro EGP 5 or white taxi negotiate',bestTime:'Oct–Apr avoid summer 40°C',emergency:'Police: 122 | Ambulance: 123',packing:['Modest clothing conservative country','Comfortable sandals','Sunscreen extreme sun','Sunglasses','USD cash tips expected everywhere']},
    {name:'Zurich',country:'Switzerland',flag:'🇨🇭',region:'Europe',tags:['Lakes','Alps','Luxury'],img:'https://images.unsplash.com/photo-1529933757987-0e8b8a9e1a6e?w=400&q=70',dayRate:{low:9000,mid:18000,high:42000},highlights:['Lake Zurich ferry scenic round trip','Old Town Grossmünster twin towers','Swiss National Museum free Monday','Rhine Falls Europe largest waterfall','Jungfraujoch Top of Europe day trip','Lindt Home of Chocolate factory'],food:['Rösti crispy potato Bernese style','Fondue melted cheese bread dip winter','Raclette melted cheese potato sides','Birchermüesli overnight oats original','Swiss Chocolate Lindt Läderach premium'],hotels:{low:'Youth Hostel Zurich city',mid:'Hotel Storchen riverside old town',high:'The Dolder Grand art museum spa'},transport:'Swiss Travel Pass CHF 244+ 3 days unlimited',bestTime:'May–Sep',emergency:'Police: 117 | Fire: 118 | Ambulance: 144',packing:['Smart casual Swiss dress well','Comfortable shoes','Camera Alpine scenery','Swiss francs CHF','Layered clothes']},
    {name:'Siem Reap',country:'Cambodia',flag:'🇰🇭',region:'Southeast Asia',tags:['Temples','History','Culture'],img:'https://images.unsplash.com/photo-1601577394854-f0b5f6d63cf9?w=400&q=70',dayRate:{low:1500,mid:3500,high:8500},highlights:['Angkor Wat sunrise reflection pool','Bayon Temple 216 serene faces','Ta Prohm jungle roots engulf','Banteay Srei pink sandstone finest carvings','Tonle Sap Lake floating village season','Pub Street Night Market evening'],food:['Amok Fish Curry coconut steamed','Lok Lak sautéed beef Khmer style','Kuy Teav rice noodle soup breakfast','Khmer BBQ dip yourself self-grill','Fresh Tropical Fruit everywhere cheap'],hotels:{low:'Mad Monkey Hostel pool',mid:'Sofitel Angkor Phokeethra Palace',high:'Song Saa Private Island'},transport:'Tuk-tuk day hire $15-25 excellent or bicycle',bestTime:'Nov–Mar dry season',emergency:'Police: 117 | Ambulance: 119',packing:['Light cotton hot','Sunscreen high factor','Mosquito repellent Angkor trees','Comfortable walking shoes','USD cash preferred']},
    {name:'Athens',country:'Greece',flag:'🇬🇷',region:'Europe',tags:['Ancient History','Culture','Food'],img:'https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&q=70',dayRate:{low:4000,mid:8500,high:20000},highlights:['Acropolis Parthenon morning early queue','National Archaeological Museum free','Plaka neighbourhood neoclassical walk','Monastiraki Flea Market Sunday find','Lycabettus Hill sunset best Athens','Cape Sounion Poseidon Temple day trip'],food:['Moussaka layers eggplant meat béchamel','Souvlaki grilled pork pita wrap','Spanakopita spinach feta pastry','Horiatiki Greek Salad tomato feta','Loukoumades honey nut dumplings'],hotels:{low:'Athens Backpackers rooftop pool',mid:'Hotel Grande Bretagne Parliament',high:'Electra Palace Athens rooftop pool'},transport:'OASA metro bus €1.20 or walk central area',bestTime:'Apr–Jun & Sep–Oct',emergency:'Police: 100 | Ambulance: 166',packing:['Comfortable walking shoes cobblestones','Light cotton summer','Sunscreen Acropolis exposed','Camera sunset shots','Euro cash']},
    {name:'Mexico City',country:'Mexico',flag:'🇲🇽',region:'North America',tags:['Culture','Food','Art'],img:'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=400&q=70',dayRate:{low:3500,mid:7500,high:17000},highlights:['Teotihuacan Pyramids sunrise climb','Frida Kahlo Blue House Museum','Zócalo Central Square Cathedral','Xochimilco Trajineras colourful boat','National Museum Anthropology Aztec Sun','Lucha Libre Wrestling Friday night show'],food:['Tacos al Pastor vertical spit pork','Tamales corn masa steamed events','Tlayuda Oaxacan flat pizza','Churros chocolate dipping sauce','Mezcal artisanal agave Oaxaca'],hotels:{low:'Hostel Home Mexico City',mid:'Hotel Condesa Mexico City',high:'Las Alcobas Mexico City Polanco'},transport:'Metro MX$5 very cheap or Uber safe',bestTime:'Mar–May dry pleasant',emergency:'Police Ambulance Fire: 911',packing:['Layered clothes altitude cool','Comfortable shoes','Anti-theft crossbody bag','Stomach medicines prevention','Camera']},
    {name:'Copenhagen',country:'Denmark',flag:'🇩🇰',region:'Europe',tags:['Design','Cycling','Hygge'],img:'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400&q=70',dayRate:{low:7000,mid:14000,high:32000},highlights:['Tivoli Gardens fairytale amusement park','Nyhavn colourful canal boat row','The Little Mermaid Langelinie pier','Christiania Free Town community art','Rosenborg Castle crown jewels garden','National Museum free permanent'],food:['Smørrebrød open sandwich rye combinations','Flæskesteg Christmas pork roast','Æbleskiver round Christmas pancakes balls','New Nordic Noma tasting menu if budget','Carlsberg Denmark original pilsner'],hotels:{low:'Urban House Hostel Copenhagen',mid:'Hotel d\'Angleterre luxury harbour',high:'Nimb Hotel Tivoli facing unique'},transport:'Copenhagen City Pass DKK 239/24hr or city bike rent',bestTime:'May–Aug',emergency:'Police Fire Ambulance: 112',packing:['Waterproof jacket Danish weather','Layered clothes','Bike gear explore properly','Comfortable shoes','Camera pastel buildings']},
    {name:'Buenos Aires',country:'Argentina',flag:'🇦🇷',region:'South America',tags:['Tango','Culture','Food'],img:'https://images.unsplash.com/photo-1589909202802-8f4aadce9d73?w=400&q=70',dayRate:{low:3500,mid:7500,high:17000},highlights:['La Boca Caminito colourful street tango','Recoleta Cemetery Evita ornate','Tango Show San Telmo authentic intimate','MALBA Frida Kahlo modern art','Palermo Soho brunch street art','Tigre Delta boat weekend escape'],food:['Asado Argentine BBQ culture Sunday','Empanadas baked fried filling variety','Dulce de Leche everything smear it','Medialunas croissant sweeter Argentine','Malbec Mendoza world best wine'],hotels:{low:'Millhouse Hostel legendary San Telmo',mid:'Palermo Soho Hotel boutique',high:'Alvear Palace Hotel Recoleta'},transport:'SUBE card Subte metro ARS 2250 or taxi',bestTime:'Mar–May & Sep–Nov',emergency:'Police: 101 | Ambulance: 107',packing:['Smart casual Argentines dress elegantly','Tango shoes if keen','Camera street art Palermo','Comfortable shoes walking neighbourhood','Credit card many places accept']},
  ]

  // ─── PREFS & STAYS ────────────────────────────────────────────────────────────
  const PREFS = [
    {id:'adventure',label:'Adventure',icon:'🧗'},{id:'culture',label:'Culture',icon:'🏛️'},{id:'food',label:'Food & Dining',icon:'🍽️'},
    {id:'nature',label:'Nature',icon:'🌿'},{id:'beach',label:'Beach',icon:'🏖️'},{id:'shopping',label:'Shopping',icon:'🛍️'},
    {id:'spiritual',label:'Spiritual',icon:'🧘'},{id:'nightlife',label:'Nightlife',icon:'🌃'},{id:'photography',label:'Photography',icon:'📸'},
    {id:'romantic',label:'Romantic',icon:'💑'},{id:'family',label:'Family',icon:'👨‍👩‍👧'},{id:'wildlife',label:'Wildlife',icon:'🦁'},
  ]
  const STAYS = [
    {id:'hostel',icon:'🏠',label:'Hostel',desc:'Budget, social, shared'},
    {id:'hotel',icon:'🏨',label:'Hotel',desc:'Comfortable & convenient'},
    {id:'airbnb',icon:'🏡',label:'Airbnb',desc:'Local home experience'},
    {id:'resort',icon:'🌴',label:'Resort',desc:'All-inclusive luxury'},
    {id:'boutique',icon:'🏩',label:'Boutique Hotel',desc:'Unique & stylish'},
    {id:'camping',icon:'⛺',label:'Camping / Glamping',desc:'Close to nature'},
    {id:'villa',icon:'🏖️',label:'Private Villa',desc:'Spacious & private'},
    {id:'guesthouse',icon:'🏘️',label:'Guesthouse / Homestay',desc:'Homely & authentic'},
  ]

  // ─── SMART ITINERARY BUILDER ──────────────────────────────────────────────────
  function buildItinerary(dest: Destination, days: number, budget: Budget, prefs: string[], stays: string[], adults: number, children: number, isIndia: boolean) {
    const totalPeople = adults + (children * 0.5)
    const rk = isIndia ? 'budget' : 'dayRate'
    const dc = (dest as any)[rk]?.[budget] ?? 2000
    const totalCost = Math.round(dc * days * totalPeople)
    const h = dest.highlights
    const foods = dest.food

    const themes = [
      {name:'Arrival & City Orientation',icon:'✈️'},
      {name:'Iconic Landmarks & Monuments',icon:'🏛️'},
      {name:'Deep Cultural Immersion',icon:'🎭'},
      {name:'Local Markets & Street Life',icon:'🛍️'},
      {name:'Nature, Outdoors & Adventure',icon:'🌿'},
      {name:'Hidden Gems & Offbeat Spots',icon:'💎'},
      {name:'Food Trail & Culinary Discovery',icon:'🍽️'},
      {name:'Scenic Day Excursion',icon:'🚗'},
      {name:'Relaxation, Wellness & Spa',icon:'🧘'},
      {name:'Photography & Sunset Chasing',icon:'📸'},
      {name:'Neighbourhood & Local Life',icon:'🗺️'},
      {name:'Shopping & Souvenir Hunting',icon:'🛒'},
      {name:'Festivals, Arts & Culture',icon:'🎉'},
      {name:'Departure Prep & Farewell',icon:'🧳'},
    ]

    // Smart activities using destination highlights intelligently
    const getMorning = (i: number) => {
      if (i === 0) return `Check in at ${dest.hotels[budget]}. Freshen up & take an orientation walk around ${dest.name} city centre — get your bearings and find your first meal spot`
      const highlights_morning = [
        `Early morning visit to ${h[0]} before crowds arrive — best light for photography`,
        `Guided heritage walk through ${dest.name} Old Town / historic quarter`,
        `Sunrise trek or viewpoint visit — recommended spot: ${h[1]||'local scenic area'}`,
        `Morning local market & street food trail — follow the locals`,
        `${h[2]||'cultural site'} exploration — hire a local guide for deeper context`,
        `Nature walk, botanical garden or lakeside morning jog`,
        `Traditional cooking class or food market tour with chef`,
        `Early departure for full-day excursion to nearby attraction`,
        `Yoga, meditation or Ayurveda morning session`,
        `Golden hour photography walk through scenic lanes`,
        `Off-the-beaten-path village or artisan neighbourhood`,
        `Craft workshop or local artisan studio visit`,
        `${h[3]||'heritage site'} visit at auspicious early morning hour`,
        `Farewell breakfast at favourite spot, final packing`,
      ]
      return highlights_morning[i % highlights_morning.length]
    }

    const getForenoon = (i: number) => {
      const acts = [
        `Visit ${h[4]||'major attraction'} — allow 2-3 hours for proper exploration`,
        `${h[5]||'second highlight'} guided tour with certified local guide`,
        `Adventure activity: rafting / zip-line / safari / cycling / paragliding`,
        `Neighbourhood café-hopping and street art discovery walk`,
        `${h[0]||'scenic spot'} photography + nearby cafes + rest stops`,
        `Authentic local bazaar exploration & genuine souvenir hunting`,
        `Boat / lake / river / backwater activity with local boatman`,
        `UNESCO world heritage site deep dive with audio guide`,
        `Spa treatment, Ayurveda massage or wellness afternoon`,
        `Golden hour photography at top 3 scenic spots in ${dest.name}`,
        `Cycling or trekking route through countryside or forest`,
        `Street food deep-dive tour with local food guide`,
        `Museum, gallery or cultural centre with context`,
        `Checkout, luggage storage & explore last spots before departure`,
      ]
      return acts[i % acts.length]
    }

    const getEvening = (i: number) => {
      const acts = [
        `Sunset at ${dest.name}'s iconic viewpoint — arrive 30min early for best spot`,
        `Traditional cultural show / folk dance / classical performance`,
        `Evening prayer / Ganga Aarti / lantern festival / fire ceremony`,
        `Rooftop bar or café with panoramic city views & cocktails`,
        `Night market exploration — try 3-4 different street food stalls`,
        `Sound & Light show at historical monument`,
        `Local pub / jazz bar / live music evening show`,
        `Romantic sunset cruise or heritage river / lake boat ride`,
        `Beach bonfire / garden terrace party / rooftop social`,
        `Heritage ghost walk or night photography walk`,
        `Comedy show, drama performance or open-air cinema`,
        `Final souvenir shopping at curated local boutiques`,
        `Farewell dinner at best restaurant — book in advance`,
        `Airport / railway transfer — check in 2-3 hours early`,
      ]
      return acts[i % acts.length]
    }

    const bfOpts = foods.slice(0,3).map((f,i)=>`${['Local neighbourhood café — ','Authentic heritage restaurant — ','Hotel breakfast then explore — '][i%3]}${f}`)
    const lunchOpts = foods.slice(1,4).map((f,i)=>`${['Most famous local joint (ask hotel) — ','Street food stall where locals eat — ','Rooftop restaurant with view — '][i%3]}${f}`)
    const dinnerOpts = foods.map((f,i)=>`${['Riverside heritage restaurant — ','Traditional home-kitchen / thali — ','Fine dining experience — ','Rooftop dinner with skyline — ','Night market food stall — '][i%5]}${f}`)

    const costs = {
      morning: Math.round(dc * 0.15),
      breakfast: Math.round(dc * 0.08),
      forenoon: Math.round(dc * 0.30),
      lunch: Math.round(dc * 0.12),
      afternoon: Math.round(dc * 0.20),
      evening: Math.round(dc * 0.05),
      dinner: Math.round(dc * 0.10),
    }

    const tips: Record<Budget, string[]> = {
      low: ['Always use public transport — state buses save 60-70% vs taxis','Eat at local dhabas and market stalls — tastier and 5x cheaper','Buy water bottles in bulk from supermarket — not convenience stores','Book accommodation directly on property website — no platform fees','Walk between attractions whenever possible — often more interesting anyway'],
      mid: ['Pre-book popular restaurant tables 24-48 hours ahead','Hire a knowledgeable local guide for ₹500-1000/half day — worth every rupee','Keep small denomination bills always — ₹10, ₹20, ₹50 for tips and autos','Download Google Maps offline before leaving hotel WiFi range','Carry a day-bag: 2 water bottles, snacks, first aid, portable charger'],
      high: ['Pre-arrange all airport and city transfers with hotel concierge','Book premium experiences: helicopter rides, spa, fine dining — minimum 2-3 days ahead','Carry printed backup copies of ALL reservations — hotel, flights, activities','Comprehensive travel insurance covering medical evacuation is mandatory','Engage a private professional guide for genuine cultural depth and access'],
    }

    // Smart packing per destination type
    const packingList = dest.packing || ['Comfortable walking shoes','Camera','Water bottle 2L','Sunscreen SPF50','Light cotton clothes']

    return {
      destination: dest,
      days, adults, children, budget, stays, totalCost,
      dailyCost: dc,
      hotelName: dest.hotels[budget],
      tips: tips[budget],
      packingList,
      emergency: dest.emergency,
      bestTime: dest.bestTime,
      transport: dest.transport,
      itinerary: Array.from({length: days}, (_, i) => {
        const theme = themes[i % themes.length]
        return {
          day: i + 1,
          theme: theme.name,
          themeIcon: theme.icon,
          hotel: dest.hotels[budget],
          dayCost: dc,
          slots: [
            {label:'Morning',time:'7:00 – 9:00 AM',icon:'🌅',activity: getMorning(i), cost: i===0 ? 0 : costs.morning},
            {label:'Breakfast',time:'9:00 – 10:00 AM',icon:'☕',activity: bfOpts[i % bfOpts.length], cost: costs.breakfast},
            {label:'Forenoon',time:'10:00 AM – 1:00 PM',icon:'🎯',activity: getForenoon(i+1), cost: costs.forenoon},
            {label:'Lunch',time:'1:00 – 2:30 PM',icon:'🍽️',activity: lunchOpts[i % lunchOpts.length], cost: costs.lunch},
            {label:'Afternoon',time:'2:30 – 6:00 PM',icon:'🌞',activity: i===days-1 ? `Pack bags & final shopping. Checkout from ${dest.hotels[budget]}. Transfer to station or airport` : getForenoon(i), cost: i===days-1 ? 0 : costs.afternoon},
            {label:'Evening',time:'6:00 – 7:30 PM',icon:'🌆',activity: getEvening(i), cost: costs.evening},
            {label:'Dinner',time:'7:30 – 10:00 PM',icon:'🍷',activity: dinnerOpts[i % dinnerOpts.length], cost: costs.dinner},
          ],
        }
      }),
    }
  }

  // ─── SAVE TO DASHBOARD ────────────────────────────────────────────────────────
  function saveTrip(result: ReturnType<typeof buildItinerary>): boolean {
    try {
      const existing = JSON.parse(localStorage.getItem('roamind_saved_trips') || '[]')
      const summary = {
        id: Date.now(),
        savedAt: new Date().toISOString(),
        destination: result.destination.name,
        state: result.destination.state || result.destination.country || '',
        flag: result.destination.flag,
        img: result.destination.img,
        days: result.days,
        budget: result.budget,
        totalCost: result.totalCost,
        dailyCost: result.dailyCost,
        travelers: result.adults + result.children,
        adults: result.adults,
        children: result.children,
        stays: result.stays,
        hotelName: result.hotelName,
        highlights: result.destination.highlights.slice(0, 3),
        bestTime: result.bestTime,
        tags: result.destination.tags,
      }
      existing.unshift(summary)
      if (existing.length > 30) existing.splice(30)
      localStorage.setItem('roamind_saved_trips', JSON.stringify(existing))
      return true
    } catch { return false }
  }

  // ─── HTML TEMPLATE DOWNLOAD ────────────────────────────────────────────────────
  function downloadHTMLTemplate(result: ReturnType<typeof buildItinerary>) {
    const budgetLabel = result.budget === 'low' ? 'Budget' : result.budget === 'mid' ? 'Comfort' : 'Luxury'
    const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Roamind — ${result.destination.name} ${result.days}-Day Itinerary</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',sans-serif;background:#f5f5f5;color:#1a1a2e;print-color-adjust:exact;-webkit-print-color-adjust:exact}
    .cover{background:linear-gradient(135deg,#020810 0%,#0a1628 60%,#020810 100%);color:white;padding:60px 70px;min-height:220px;position:relative;page-break-after:always}
    .cover-logo{font-size:13px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:rgba(99,210,255,0.7);margin-bottom:20px}
    .cover h1{font-family:'Playfair Display',serif;font-size:46px;font-weight:900;color:#63d2ff;line-height:1.1;margin-bottom:8px}
    .cover h2{font-size:20px;font-weight:300;color:rgba(255,255,255,0.65);margin-bottom:28px}
    .cover-meta{display:flex;gap:14px;flex-wrap:wrap}
    .cover-tag{font-size:12px;background:rgba(99,210,255,0.12);border:1px solid rgba(99,210,255,0.3);padding:5px 16px;border-radius:20px;color:#63d2ff}
    .cover-cost{position:absolute;top:55px;right:70px;text-align:right}
    .cover-cost .amount{font-family:'Playfair Display',serif;font-size:44px;font-weight:900;color:#ffb74d}
    .cover-cost .label{font-size:12px;color:rgba(255,255,255,0.45);margin-top:4px}
    .brand{position:absolute;bottom:22px;right:70px;font-size:11px;color:rgba(255,255,255,0.25);letter-spacing:2px}
    .body{max-width:920px;margin:0 auto;padding:40px 40px 80px}
    .section-title{font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#63d2ff;border-left:3px solid #63d2ff;padding-left:14px;margin:40px 0 16px}
    .highlights-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:28px}
    .highlight{background:#eef9ff;border:1px solid #b3e5fc;border-radius:10px;padding:11px 15px;font-size:13px;color:#0277bd;font-weight:500}
    .highlight::before{content:'★ ';color:#ffb74d}
    .food-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}
    .food{background:#fff8e1;border:1px solid #ffe082;border-radius:20px;padding:6px 16px;font-size:13px;color:#e65100;font-weight:500}
    .budget-table{background:white;border:1px solid #e0e0e0;border-radius:14px;overflow:hidden;margin-bottom:28px}
    .budget-row{display:flex;justify-content:space-between;padding:11px 20px;border-bottom:1px solid #f5f5f5;font-size:13px}
    .budget-row:last-child{border-bottom:none;font-weight:600;font-size:15px;background:#f8f9ff;color:#3c3489}
    .budget-row .label{color:#666}
    .day-card{background:white;border:1px solid #e0e0e0;border-radius:16px;margin-bottom:22px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.05);page-break-inside:avoid}
    .day-header{background:linear-gradient(135deg,#020810,#0a1628);color:white;padding:18px 26px;display:flex;justify-content:space-between;align-items:center}
    .day-num{font-family:'Playfair Display',serif;font-size:34px;font-weight:900;color:#63d2ff}
    .day-theme{font-size:18px;font-weight:600}
    .day-hotel{font-size:12px;color:rgba(255,255,255,0.4);margin-top:3px}
    .day-cost-badge{text-align:right;font-size:12px;color:rgba(255,255,255,0.4)}
    .day-cost-badge strong{display:block;font-size:18px;color:#ffb74d;font-weight:700}
    .slot{display:flex;align-items:flex-start;gap:14px;padding:13px 24px;border-bottom:1px solid #f8f8f8}
    .slot:last-child{border-bottom:none}
    .slot-time{min-width:76px;font-size:10px;font-weight:700;color:#1565c0;background:#e3f2fd;padding:4px 7px;border-radius:7px;text-align:center;flex-shrink:0}
    .slot-icon{font-size:19px;flex-shrink:0;margin-top:1px}
    .slot-text{flex:1}
    .slot-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9e9e9e;margin-bottom:2px}
    .slot-activity{font-size:13.5px;color:#1a1a2e;line-height:1.5}
    .slot-cost{font-size:13px;font-weight:700;color:#e65100;flex-shrink:0;margin-top:3px}
    .tips-box{background:#fff8e1;border:1px solid #ffe082;border-radius:12px;padding:20px 24px;margin-bottom:22px}
    .tips-box h3{color:#f57f17;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px}
    .tip{font-size:13px;color:#5d4037;padding:4px 0;display:flex;gap:10px;line-height:1.6}
    .tip::before{content:'•';color:#ff8f00;flex-shrink:0}
    .packing-box{background:#e8f5e9;border:1px solid #a5d6a7;border-radius:12px;padding:20px 24px;margin-bottom:22px}
    .packing-box h3{color:#2e7d32;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px}
    .packing-grid{display:flex;flex-wrap:wrap;gap:8px}
    .packing-item{background:white;border:1px solid #c8e6c9;border-radius:8px;padding:5px 12px;font-size:12px;color:#2e7d32}
    .packing-item::before{content:'☐ ';font-size:13px}
    .emergency-box{background:#ffebee;border:1px solid #ef9a9a;border-radius:12px;padding:18px 22px;margin-bottom:22px}
    .emergency-box h3{color:#c62828;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px}
    .emergency-box p{font-size:13px;color:#b71c1c;line-height:1.7}
    .transport-box{background:#e3f2fd;border:1px solid #90caf9;border-radius:12px;padding:18px 22px;margin-bottom:22px}
    .transport-box p{font-size:13.5px;color:#0d47a1;line-height:1.7}
    .footer{text-align:center;padding:32px;color:#9e9e9e;font-size:12px;border-top:1px solid #e0e0e0;margin-top:40px}
    @media print{
      body{background:white}
      .day-card{break-inside:avoid;box-shadow:none}
      .cover{break-after:page}
      .section-title{break-before:auto}
    }
  </style>
  </head>
  <body>
  <div class="cover">
    <div class="cover-logo">🌍 Roamind AI Travel Platform</div>
    <h1>${result.destination.name}</h1>
    <h2>${result.days}-Day ${budgetLabel} Adventure · ${result.destination.state || result.destination.country}</h2>
    <div class="cover-meta">
      <span class="cover-tag">📅 ${result.days} Days</span>
      <span class="cover-tag">👥 ${result.adults + result.children} Traveler${result.adults+result.children>1?'s':''}</span>
      <span class="cover-tag">🏨 ${result.stays.join(' + ')}</span>
      <span class="cover-tag">💰 ${budgetLabel} Budget</span>
      <span class="cover-tag">🗓️ Best: ${result.bestTime}</span>
    </div>
    <div class="cover-cost">
      <div class="amount">₹${result.totalCost.toLocaleString()}</div>
      <div class="label">Total Estimated Cost</div>
      <div class="label" style="margin-top:6px">₹${result.dailyCost.toLocaleString()} / person / day</div>
    </div>
    <div class="brand">GENERATED BY ROAMIND AI</div>
  </div>
  <div class="body">
    <div class="section-title">🌟 Must-Do Highlights</div>
    <div class="highlights-grid">
      ${result.destination.highlights.map(h=>`<div class="highlight">${h}</div>`).join('')}
    </div>
    <div class="section-title">🍽️ Must-Try Local Food</div>
    <div class="food-row">
      ${result.destination.food.map(f=>`<div class="food">${f}</div>`).join('')}
    </div>
    <div class="section-title">💰 Cost Breakdown</div>
    <div class="budget-table">
      ${[
        ['🍽️ Food & Dining / day', '₹'+Math.round(result.dailyCost*.18).toLocaleString()+' per person'],
        ['🎫 Activities & Entries / day', '₹'+Math.round(result.dailyCost*.45).toLocaleString()+' per person'],
        ['🚗 Local Transport / day', '₹'+Math.round(result.dailyCost*.12).toLocaleString()+' per person'],
        ['🏨 Accommodation / day', '₹'+Math.round(result.dailyCost*.25).toLocaleString()+' per person'],
        ['💵 Total / day / person', '₹'+result.dailyCost.toLocaleString()],
        ['🎯 TOTAL TRIP ESTIMATE', '₹'+result.totalCost.toLocaleString()],
      ].map(([l,v])=>`<div class="budget-row"><span class="label">${l}</span><strong>${v}</strong></div>`).join('')}
    </div>
    <div class="section-title">📋 Day-by-Day Itinerary</div>
    ${result.itinerary.map(day=>`
    <div class="day-card">
      <div class="day-header">
        <div>
          <div class="day-num">Day ${day.day}</div>
          <div class="day-theme">${day.themeIcon} ${day.theme}</div>
          <div class="day-hotel">🏨 ${day.hotel}</div>
        </div>
        <div class="day-cost-badge">
          <strong>₹${result.dailyCost.toLocaleString()}</strong>
          estimated / person
        </div>
      </div>
      ${day.slots.map(s=>`
      <div class="slot">
        <div class="slot-time">${s.time.split('–')[0].trim()}</div>
        <div class="slot-icon">${s.icon}</div>
        <div class="slot-text">
          <div class="slot-label">${s.label}</div>
          <div class="slot-activity">${s.activity}</div>
        </div>
        ${s.cost>0?`<div class="slot-cost">₹${s.cost.toLocaleString()}</div>`:'<div class="slot-cost" style="color:#4caf50">incl.</div>'}
      </div>`).join('')}
    </div>`).join('')}
    <div class="section-title">💡 Pro Travel Tips</div>
    <div class="tips-box">
      <h3>Tips for ${budgetLabel} Travelers in ${result.destination.name}</h3>
      ${result.tips.map(t=>`<div class="tip">${t}</div>`).join('')}
    </div>
    <div class="section-title">🎒 Packing Checklist</div>
    <div class="packing-box">
      <h3>Pack for ${result.destination.name} — ${result.bestTime}</h3>
      <div class="packing-grid">
        ${[...result.packingList,'Valid Photo ID / Passport','Travel Insurance documents','Emergency contact card','Portable phone charger','Offline maps downloaded'].map(p=>`<div class="packing-item">${p}</div>`).join('')}
      </div>
    </div>
    <div class="section-title">🚨 Emergency Contacts</div>
    <div class="emergency-box">
      <h3>${result.destination.name} Emergency Numbers</h3>
      <p>${result.emergency}</p>
      <p style="margin-top:10px;color:#bf360c">⚠️ Always carry your hotel address in local language & share live location with family</p>
    </div>
    <div class="section-title">🚗 Getting Around</div>
    <div class="transport-box">
      <p>${result.transport}</p>
    </div>
  </div>
  <div class="footer">
    <p><strong>Generated by Roamind AI Travel Platform</strong> — Your AI Travel Brain 🌍</p>
    <p style="margin-top:6px">This itinerary is AI-generated. Verify all details locally. Costs are estimates. Prices vary by season.</p>
    <p style="margin-top:4px">💾 Save as PDF: Press Ctrl+P → Print to PDF</p>
  </div>
  </body>
  </html>`

    const blob = new Blob([html], {type:'text/html;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Roamind_${result.destination.name.replace(/\s+/g,'-')}_${result.days}Day_Itinerary.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ─── TXT NOTEPAD DOWNLOAD ─────────────────────────────────────────────────────
  function downloadTXT(result: ReturnType<typeof buildItinerary>) {
    const L = '═'.repeat(60)
    const l = '─'.repeat(60)
    const lines: string[] = []
    lines.push(L)
    lines.push('  ROAMIND AI TRAVEL PLATFORM — OFFICIAL ITINERARY')
    lines.push(L)
    lines.push('')
    lines.push(`  DESTINATION  : ${result.destination.name}, ${result.destination.state || result.destination.country}`)
    lines.push(`  DURATION     : ${result.days} Days`)
    lines.push(`  BUDGET TIER  : ${result.budget.toUpperCase()} (${result.budget==='low'?'Budget':result.budget==='mid'?'Comfort':'Luxury'})`)
    lines.push(`  TRAVELERS    : ${result.adults} Adult${result.adults>1?'s':''}${result.children?' + '+result.children+' Child'+( result.children>1?'ren':''):''}`)
    lines.push(`  ACCOMMODATION: ${result.stays.join(' + ')}`)
    lines.push(`  STAYING AT   : ${result.hotelName}`)
    lines.push(`  TOTAL COST   : ₹${result.totalCost.toLocaleString()}`)
    lines.push(`  DAILY/PERSON : ₹${result.dailyCost.toLocaleString()}`)
    lines.push(`  BEST TIME    : ${result.bestTime}`)
    lines.push('')
    lines.push(l)
    lines.push('  MUST-DO HIGHLIGHTS')
    lines.push(l)
    result.destination.highlights.forEach((h,i)=>lines.push(`  ${i+1}. ${h}`))
    lines.push('')
    lines.push(l)
    lines.push('  MUST-TRY LOCAL FOOD')
    lines.push(l)
    result.destination.food.forEach((f,i)=>lines.push(`  ${i+1}. ${f}`))
    lines.push('')
    lines.push(l)
    lines.push('  COST BREAKDOWN (PER PERSON PER DAY)')
    lines.push(l)
    lines.push(`  Food & Dining    : ₹${Math.round(result.dailyCost*.18).toLocaleString()}`)
    lines.push(`  Activities       : ₹${Math.round(result.dailyCost*.45).toLocaleString()}`)
    lines.push(`  Local Transport  : ₹${Math.round(result.dailyCost*.12).toLocaleString()}`)
    lines.push(`  Accommodation    : ₹${Math.round(result.dailyCost*.25).toLocaleString()}`)
    lines.push(`  TOTAL / day      : ₹${result.dailyCost.toLocaleString()}`)
    lines.push('')
    lines.push(l)
    lines.push('  DAY-BY-DAY ITINERARY')
    lines.push(l)
    result.itinerary.forEach(day=>{
      lines.push('')
      lines.push(`  ┌${'─'.repeat(54)}┐`)
      lines.push(`  │  DAY ${String(day.day).padEnd(3)} · ${day.theme.toUpperCase().substring(0,41).padEnd(41)}│`)
      lines.push(`  │  Hotel: ${day.hotel.substring(0,46).padEnd(46)}│`)
      lines.push(`  └${'─'.repeat(54)}┘`)
      day.slots.forEach(s=>{
        lines.push('')
        lines.push(`  [${s.time}]  ${s.label.toUpperCase()}  ${s.cost>0?'₹'+s.cost.toLocaleString():'INCLUDED'}`)
        lines.push(`  → ${s.activity}`)
      })
      lines.push('')
    })
    lines.push(l)
    lines.push('  PRO TRAVEL TIPS')
    lines.push(l)
    result.tips.forEach((t,i)=>lines.push(`  ${i+1}. ${t}`))
    lines.push('')
    lines.push(l)
    lines.push('  PACKING CHECKLIST')
    lines.push(l)
    result.packingList.forEach(p=>lines.push(`  ☐  ${p}`))
    lines.push(`  ☐  Valid Photo ID / Passport`)
    lines.push(`  ☐  Travel Insurance documents`)
    lines.push(`  ☐  Emergency contact card`)
    lines.push('')
    lines.push(l)
    lines.push('  EMERGENCY CONTACTS')
    lines.push(l)
    lines.push(`  ${result.emergency}`)
    lines.push(`  Tip: Save hotel address in local language on your phone`)
    lines.push('')
    lines.push(l)
    lines.push('  GETTING AROUND')
    lines.push(l)
    lines.push(`  ${result.transport}`)
    lines.push('')
    lines.push(L)
    lines.push('  Generated by ROAMIND AI — Your AI Travel Brain 🌍')
    lines.push('  Visit roamind.app | Save as PDF for offline access')
    lines.push(L)

    const blob = new Blob([lines.join('\n')], {type:'text/plain;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Roamind_${result.destination.name.replace(/\s+/g,'-')}_${result.days}Day_Itinerary.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ─── SHARE FUNCTIONS ──────────────────────────────────────────────────────────
  function shareWhatsApp(result: ReturnType<typeof buildItinerary>) {
    const msg = `🌍 *My Roamind AI Itinerary*\n\n📍 *${result.destination.name}* — ${result.days} Days\n💰 ${result.budget} budget | ₹${result.totalCost.toLocaleString()} total\n👥 ${result.adults+result.children} Traveler${result.adults+result.children>1?'s':''} | 🏨 ${result.stays.join(' + ')}\n🗓️ Best time: ${result.bestTime}\n\n*Top Must-Do:*\n${result.destination.highlights.slice(0,4).map(h=>`• ${h}`).join('\n')}\n\n*Must Try Food:*\n${result.destination.food.slice(0,3).join(', ')}\n\n*Stay:* ${result.hotelName}\n\n✈️ *Planned with Roamind AI* 🚀\nPlan yours: roamind.app`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  function shareEmail(result: ReturnType<typeof buildItinerary>) {
    const subject = `My ${result.days}-Day ${result.destination.name} Trip — Roamind AI Itinerary`
    const body = `Hi!\n\nI've planned an amazing trip to ${result.destination.name} using Roamind AI!\n\nTrip Summary:\n• Destination: ${result.destination.name}, ${result.destination.state||result.destination.country}\n• Duration: ${result.days} days\n• Budget: ${result.budget} (₹${result.totalCost.toLocaleString()} estimated total)\n• Travelers: ${result.adults + result.children}\n• Staying at: ${result.hotelName}\n• Best time to visit: ${result.bestTime}\n\nMust-Do Highlights:\n${result.destination.highlights.map(h=>`• ${h}`).join('\n')}\n\nMust-Try Food:\n${result.destination.food.map(f=>`• ${f}`).join('\n')}\n\nDay 1 Plan:\n${result.itinerary[0]?.slots.map(s=>`${s.time}: ${s.activity}`).join('\n')}\n\nEmergency Contacts:\n${result.emergency}\n\n---\nGenerated by Roamind AI Travel Platform — roamind.app`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  function shareTwitter(result: ReturnType<typeof buildItinerary>) {
    const text = `Just planned my ${result.days}-day trip to ${result.destination.name}! 🌍\n\n📍 ${result.destination.highlights[0]}\n🍽️ Can't wait for ${result.destination.food[0]}\n💰 Budget: ${result.budget} | ₹${result.totalCost.toLocaleString()}\n\nPlanned with @RoamindAI ✈️\n#Travel #${result.destination.name.replace(/\s+/g,'')} #Wanderlust #Roamind`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  function generateInstagramCaption(result: ReturnType<typeof buildItinerary>) {
    const caption = `✈️ ${result.destination.name} calling! 🌍\n\n${result.destination.highlights[0]} is on my list! Planning ${result.days} magical days exploring this incredible destination.\n\n🍽️ Most excited for: ${result.destination.food[0]}\n💰 Budget: ${result.budget} travel | ${result.days} days\n🏨 Staying at: ${result.hotelName}\n\nWho else wants to visit ${result.destination.name}? Drop a ✋ below!\n\n#${result.destination.name.replace(/\s+/g,'')} #Travel #Wanderlust #TravelGram #ExploreMore #RoamindAI #TravelPlanning #TravelBlogger #Traveler #IndianTravel`
    navigator.clipboard.writeText(caption).then(()=>alert('📸 Instagram caption copied to clipboard! Paste it in your Instagram post.'))
  }

  function copyLink(result: ReturnType<typeof buildItinerary>) {
    const text = `🌍 Roamind AI Itinerary: ${result.destination.name} — ${result.days} Days\nBudget: ${result.budget} | Total: ₹${result.totalCost.toLocaleString()} | ${result.adults+result.children} Travelers\nHighlights: ${result.destination.highlights.slice(0,3).join(' · ')}\nPlan yours at roamind.app`
    navigator.clipboard.writeText(text).then(()=>alert('✅ Trip summary copied to clipboard!'))
  }

  function printItinerary() {
    window.print()
  }

  // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
  export default function ItineraryPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [tripType, setTripType] = useState<TripType>('india')
    const [budget, setBudget] = useState<Budget|null>(null)
    const [totalBudget, setTotalBudget] = useState('')
    const [dest, setDest] = useState<Destination|null>(null)
    const [days, setDays] = useState<number|null>(null)
    const [startDate, setStartDate] = useState('')
    const [adults, setAdults] = useState(2)
    const [children, setChildren] = useState(0)
    const [prefs, setPrefs] = useState<string[]>([])
    const [stays, setStays] = useState<string[]>(['hotel'])
    const [genP, setGenP] = useState(0)
    const [generating, setGenerating] = useState(false)
    const [result, setResult] = useState<ReturnType<typeof buildItinerary>|null>(null)
    const [activeDay, setActiveDay] = useState(0)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')
    const [savedOk, setSavedOk] = useState(false)
    const [activeTab, setActiveTab] = useState<'itinerary'|'packing'|'budget'|'emergency'>('itinerary')

    const allDests = tripType==='india' ? INDIA : INTL

    const filtered = allDests.filter(d => {
      const q = search.toLowerCase()
      const matchSearch = d.name.toLowerCase().includes(q) ||
        (d.state||'').toLowerCase().includes(q) ||
        (d.country||'').toLowerCase().includes(q)
      if (filter === 'All') return matchSearch
      return matchSearch && d.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
    })

    const calcDays = useCallback(() => {
      if (!budget || !dest) return null
      const rk = tripType === 'india' ? 'budget' : 'dayRate'
      const dc = (dest as any)[rk]?.[budget] ?? 2000
      const tb = parseInt(totalBudget.replace(/\D/g,'')) || 0
      if (!tb) return null
      return Math.max(1, Math.min(30, Math.floor(tb / (dc * Math.max(adults, 1)))))
    }, [budget, dest, tripType, totalBudget, adults])

    const recDays = calcDays()
    const togglePref = (id: string) => setPrefs(p => p.includes(id) ? p.filter(x=>x!==id) : p.length>=5 ? p : [...p, id])
    const toggleStay = (id: string) => setStays(s => s.includes(id) ? (s.length>1 ? s.filter(x=>x!==id) : s) : [...s, id])

    const generate = async () => {
      if (!dest || !budget || !days || days < 1 || days > 30) return
      setGenerating(true); setGenP(0)
      for (const n of [12,28,45,62,80,95,100]) {
        await new Promise(r=>setTimeout(r,500))
        setGenP(n)
      }
      const res = buildItinerary(dest, days, budget, prefs.length?prefs:['culture','food'], stays.length?stays:['hotel'], adults, children, tripType==='india')
      setResult(res)
      setGenerating(false)
      setStep(6)
      setActiveDay(0)
      setActiveTab('itinerary')
    }

    const handleSave = () => {
      if (!result) return
      const ok = saveTrip(result)
      if (ok) { setSavedOk(true); setTimeout(()=>setSavedOk(false), 4000) }
    }

    const stepLabels = ['Budget','Destination','Days','Travelers','Generating','Your Plan']
    const canNext = (step===1&&!!budget) || (step===2&&!!dest) || (step===3&&!!days&&days>=1&&days<=30) || step===4

    const Card = ({children:ch, style:st}: {children:React.ReactNode, style?:React.CSSProperties}) => (
      <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:22,...st}}>{ch}</div>
    )

    return (
      <div style={{minHeight:'100vh',background:BG,color:'#fff',fontFamily:"'Outfit',sans-serif"}}>

        {/* NAV */}
        <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(2,8,16,0.97)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.07)',padding:'13px 32px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <button onClick={()=>router.push('/dashboard')} style={{display:'flex',alignItems:'center',gap:10,background:'transparent',border:'none',cursor:'pointer',color:'#fff',fontFamily:"'Outfit',sans-serif"}}>
            <span style={{fontSize:20}}>🌍</span>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:900,background:`linear-gradient(130deg,#fff 30%,${C} 70%)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Roamind</span>
          </button>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <span style={{fontSize:11,color:'rgba(255,255,255,0.3)',padding:'4px 12px',background:'rgba(255,255,255,0.04)',borderRadius:100,border:'1px solid rgba(255,255,255,0.07)'}}>{allDests.length} destinations</span>
            <button onClick={()=>router.push('/dashboard')} style={{padding:'7px 16px',background:'transparent',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.5)',borderRadius:100,cursor:'pointer',fontSize:12,fontFamily:"'Outfit',sans-serif"}}>← Dashboard</button>
            {step>1&&<button onClick={()=>{setStep(1);setResult(null);setBudget(null);setDest(null);setDays(null);setPrefs([]);setStays(['hotel']);setGenP(0);setGenerating(false)}} style={{padding:'7px 16px',background:'transparent',border:`1px solid rgba(255,183,77,0.3)`,color:G,borderRadius:100,cursor:'pointer',fontSize:12,fontFamily:"'Outfit',sans-serif"}}>🔄 Restart</button>}
          </div>
        </nav>

        {/* STEP PROGRESS */}
        <div style={{background:BG2,borderBottom:'1px solid rgba(255,255,255,0.07)',padding:'14px 32px',display:'flex',alignItems:'center',justifyContent:'center',gap:0,overflowX:'auto'}}>
          {stepLabels.map((label,i)=>{
            const n=i+1, done=n<step, active=n===step
            return (
              <div key={n} style={{display:'flex',alignItems:'center',gap:0}}>
                <div style={{display:'flex',alignItems:'center',gap:7,padding:'5px 12px',flexShrink:0}}>
                  <div style={{width:26,height:26,borderRadius:'50%',background:done?`${GR}22`:active?`${C}22`:'rgba(255,255,255,0.05)',border:`1px solid ${done?GR:active?C:'rgba(255,255,255,0.1)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:done?GR:active?C:'rgba(255,255,255,0.35)',transition:'all .3s'}}>
                    {done?'✓':n}
                  </div>
                  <span style={{fontSize:11,color:active?'#fff':'rgba(255,255,255,0.35)',fontWeight:active?600:400,whiteSpace:'nowrap'}}>{label}</span>
                </div>
                {i<stepLabels.length-1&&<div style={{width:28,height:1,background:done?GR:'rgba(255,255,255,0.08)',flexShrink:0,transition:'background .3s'}}/>}
              </div>
            )
          })}
        </div>

        <div style={{maxWidth:1100,margin:'0 auto',padding:'36px 24px 120px'}}>

          {/* STEP 1 — BUDGET */}
          {step===1&&(
            <div>
              <div style={{marginBottom:28}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:C,marginBottom:9}}>Step 1 — Budget & Region</div>
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:900,marginBottom:7}}>Where are you <em style={{fontStyle:'italic',color:C}}>heading?</em></h1>
                <p style={{fontSize:13,color:'rgba(255,255,255,0.45)',lineHeight:1.8}}>Select your trip type and budget tier. Enter your total budget and we'll auto-calculate the ideal trip length.</p>
              </div>

              <div style={{display:'flex',gap:8,marginBottom:28,padding:5,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,width:'fit-content'}}>
                {([['india',`🇮🇳 India (${INDIA.length} cities)`],['intl',`✈️ International (${INTL.length} countries)`]] as [TripType,string][]).map(([v,l])=>(
                  <button key={v} onClick={()=>{setTripType(v);setBudget(null)}} style={{padding:'9px 22px',borderRadius:10,border:'none',background:tripType===v?`${C}18`:'transparent',color:tripType===v?C:'rgba(255,255,255,0.45)',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif",transition:'all .2s'}}>{l}</button>
                ))}
              </div>

              {tripType==='india' ? (
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
                  {[
                    {id:'low' as Budget,icon:'🎒',name:'Budget Traveller',range:'₹600–1,500 / day',desc:'Maximum experience, minimum spend. Hostels, street food & state buses.',perks:['Dormitory / budget guesthouse','Street food & local dhabas','State buses & shared taxis','Free monuments & public parks'],clr:GR},
                    {id:'mid' as Budget,icon:'🏨',name:'Comfort Traveller',range:'₹2,000–5,000 / day',desc:'Comfortable 3-star stays, good restaurants and private cab travel.',perks:['3-star hotel & private AC rooms','Multi-cuisine restaurants','Ola/Uber/local cabs','Heritage entries & guided tours'],clr:C},
                    {id:'high' as Budget,icon:'✨',name:'Luxury Traveller',range:'₹8,000–25,000 / day',desc:'5-star stays, fine dining, private chauffeur and exclusive experiences.',perks:['Luxury 5-star hotels & resorts','Award-winning restaurants','Private chauffeur all day','Premium exclusive guided experiences'],clr:G},
                  ].map(b=>(
                    <div key={b.id} onClick={()=>setBudget(b.id)} style={{background:'rgba(255,255,255,0.025)',border:`2px solid ${budget===b.id?b.clr+'55':'rgba(255,255,255,0.07)'}`,borderRadius:20,padding:24,cursor:'pointer',transition:'all .3s',position:'relative',overflow:'hidden',transform:budget===b.id?'translateY(-4px)':'translateY(0)'}}>
                      {budget===b.id&&<div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${b.clr},${G})`}}/>}
                      <span style={{fontSize:38,display:'block',marginBottom:14}}>{b.icon}</span>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:900,marginBottom:4}}>{b.name}</div>
                      <div style={{fontSize:13,fontWeight:600,color:G,marginBottom:10}}>{b.range}</div>
                      <div style={{fontSize:12,color:'rgba(255,255,255,0.45)',lineHeight:1.65,marginBottom:14}}>{b.desc}</div>
                      {b.perks.map((p,i)=><div key={i} style={{fontSize:11,color:'rgba(255,255,255,0.5)',display:'flex',alignItems:'center',gap:6,marginBottom:5}}><span style={{color:GR}}>✓</span>{p}</div>)}
                      {budget===b.id&&<div style={{position:'absolute',top:12,right:12,width:22,height:22,borderRadius:'50%',background:b.clr,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:BG,fontWeight:700}}>✓</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:14}}>
                  {[
                    {region:'Southeast Asia',flag:'🌏',countries:'Thailand · Bali · Vietnam · Singapore · Cambodia · Phuket',low:'₹1,800–2,500/day',mid:'₹4,500–6,000/day',high:'₹10,000–15,000/day',tag:'Best Value',tagClr:GR},
                    {region:'Europe',flag:'🏰',countries:'France · Italy · Spain · Greece · UK · Portugal · Austria · Hungary',low:'₹5,000–7,000/day',mid:'₹10,000–14,000/day',high:'₹24,000–42,000/day',tag:'Most Popular',tagClr:C},
                    {region:'Middle East',flag:'🕌',countries:'Dubai · Jordan · Saudi Arabia · Turkey · Egypt',low:'₹3,000–5,000/day',mid:'₹7,000–12,000/day',high:'₹20,000–30,000/day',tag:'Trending',tagClr:G},
                    {region:'Americas',flag:'🗽',countries:'USA · Mexico · Brazil · Argentina · Peru · Cuba',low:'₹3,500–7,500/day',mid:'₹8,000–16,000/day',high:'₹17,000–38,000/day',tag:'Premium',tagClr:C},
                    {region:'East & South Asia',flag:'🏯',countries:'Japan · South Korea · Nepal · Sri Lanka',low:'₹1,800–5,500/day',mid:'₹4,000–11,000/day',high:'₹9,000–25,000/day',tag:'Cultural',tagClr:GR},
                    {region:'Africa & Oceania',flag:'🦁',countries:'South Africa · Kenya · Australia · New Zealand · Morocco',low:'₹3,000–7,500/day',mid:'₹6,500–16,000/day',high:'₹15,000–40,000/day',tag:'Adventure',tagClr:G},
                  ].map((r,i)=>(
                    <div key={i} style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:18}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                        <div style={{fontWeight:700,fontSize:14,display:'flex',alignItems:'center',gap:7}}><span>{r.flag}</span>{r.region}</div>
                        <span style={{fontSize:10,padding:'2px 10px',borderRadius:100,background:`${r.tagClr}18`,border:`1px solid ${r.tagClr}44`,color:r.tagClr}}>{r.tag}</span>
                      </div>
                      <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginBottom:12}}>{r.countries}</div>
                      {([['💚 Budget',r.low],['💛 Standard',r.mid],['❤️ Luxury',r.high]] as [string,string][]).map(([label,val])=>(
                        <div key={label} style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:4}}><span>{label}</span><strong style={{color:'#fff'}}>{val}</strong></div>
                      ))}
                      <div style={{marginTop:12,paddingTop:12,borderTop:'1px solid rgba(255,255,255,0.07)',display:'flex',gap:7}}>
                        {(['low','mid','high'] as Budget[]).map(bl=>(
                          <button key={bl} onClick={()=>setBudget(bl)} style={{flex:1,padding:'7px',background:budget===bl?`${C}18`:'rgba(255,255,255,0.04)',border:`1px solid ${budget===bl?C+'66':'rgba(255,255,255,0.08)'}`,borderRadius:8,color:budget===bl?C:'rgba(255,255,255,0.45)',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif",transition:'all .2s'}}>
                            {bl==='low'?'Budget':bl==='mid'?'Standard':'Luxury'}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {budget&&(
                <div style={{marginTop:24,background:`${C}08`,border:`1px solid ${C}22`,borderRadius:16,padding:22}}>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,255,255,0.35)',marginBottom:10}}>Total Trip Budget (₹ INR) — Optional</div>
                  <input value={totalBudget} onChange={e=>setTotalBudget(e.target.value)} placeholder="e.g. 75000 — we'll suggest ideal trip length" type="number" min="0"
                    style={{width:'100%',maxWidth:340,padding:'12px 16px',background:'rgba(255,255,255,0.04)',border:`1px solid ${C}44`,borderRadius:12,color:'#fff',fontSize:16,fontFamily:"'Outfit',sans-serif",outline:'none'}}/>
                  <p style={{marginTop:8,fontSize:12,color:'rgba(255,255,255,0.35)'}}>Enter your total budget → we calculate how many days you can comfortably travel.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — DESTINATION */}
          {step===2&&(
            <div>
              <div style={{marginBottom:22}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:C,marginBottom:9}}>Step 2 — Destination ({allDests.length} available)</div>
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:900,marginBottom:7}}>Choose your <em style={{fontStyle:'italic',color:C}}>destination</em></h1>
                <p style={{fontSize:13,color:'rgba(255,255,255,0.45)'}}>{filtered.length} destinations match your filters</p>
              </div>

              <div style={{display:'flex',alignItems:'center',gap:9,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'11px 16px',marginBottom:14}}>
                <span style={{opacity:.4}}>🔍</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${tripType==='india'?'cities, states...':'countries, regions...'}`}
                  style={{flex:1,background:'transparent',border:'none',outline:'none',fontFamily:"'Outfit',sans-serif",fontSize:14,color:'#fff'}}/>
                {search&&<button onClick={()=>setSearch('')} style={{background:'transparent',border:'none',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:18,lineHeight:1}}>✕</button>}
              </div>

              <div style={{display:'flex',gap:7,flexWrap:'wrap',marginBottom:18}}>
                {['All','Beach','Adventure','Culture','Nature','Food','Heritage','Mountains','Wildlife','Spiritual','Offbeat','Luxury','Backpacker','Trekking'].map(f=>(
                  <button key={f} onClick={()=>setFilter(f)} style={{padding:'7px 15px',borderRadius:100,border:`1px solid ${filter===f?C+'44':'rgba(255,255,255,0.1)'}`,background:filter===f?`${C}14`:'rgba(255,255,255,0.03)',color:filter===f?C:'rgba(255,255,255,0.5)',fontSize:12,cursor:'pointer',fontFamily:"'Outfit',sans-serif",transition:'all .2s'}}>{f}</button>
                ))}
              </div>

              {dest&&(
                <div style={{padding:'10px 16px',background:`${GR}12`,border:`1px solid ${GR}33`,borderRadius:10,marginBottom:14,fontSize:13,color:GR,display:'flex',alignItems:'center',gap:8}}>
                  <span>✓</span> <strong>{dest.name}</strong> selected — click another destination to change
                </div>
              )}

              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(148px,1fr))',gap:10}}>
                {filtered.map((d,i)=>(
                  <div key={`${d.name}-${i}`} onClick={()=>setDest(d)} style={{borderRadius:13,overflow:'hidden',position:'relative',aspectRatio:'4/3',cursor:'pointer',border:`2px solid ${dest?.name===d.name?C:'transparent'}`,transition:'all .3s'}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(-3px)'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(0)'}}>
                    <img src={d.img} alt={d.name} style={{width:'100%',height:'100%',objectFit:'cover'}} loading="lazy"/>
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(2,8,16,0.92) 0%,transparent 55%)'}}/>
                    <div style={{position:'absolute',bottom:0,left:0,right:0,padding:10}}>
                      <span style={{fontSize:11}}>{d.flag}</span>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:12,fontWeight:700,marginTop:2,lineHeight:1.2}}>{d.name}</div>
                      <div style={{fontSize:9,color:G,marginTop:2}}>{d.state||d.country}</div>
                    </div>
                    {dest?.name===d.name&&<div style={{position:'absolute',top:7,right:7,width:20,height:20,borderRadius:'50%',background:C,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:BG,fontWeight:700}}>✓</div>}
                    <div style={{position:'absolute',top:7,left:7,fontSize:9,padding:'2px 7px',background:'rgba(2,8,16,0.7)',borderRadius:8,color:'rgba(255,255,255,0.6)'}}>{d.tags[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 — DAYS */}
          {step===3&&(
            <div>
              <div style={{marginBottom:24}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:C,marginBottom:9}}>Step 3 — Trip Duration</div>
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:900,marginBottom:7}}>How many <em style={{fontStyle:'italic',color:C}}>days?</em></h1>
                <p style={{fontSize:13,color:'rgba(255,255,255,0.45)'}}>Select duration or enter custom days. Budget AI recommends optimal length.</p>
              </div>

              {recDays&&(
                <div style={{padding:'16px 22px',background:`${C}08`,border:`1px solid ${C}22`,borderRadius:16,marginBottom:24,display:'flex',alignItems:'center',gap:14}}>
                  <span style={{fontSize:30}}>💡</span>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,marginBottom:3}}>AI Budget Recommendation</div>
                    <div style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>With ₹{parseInt(totalBudget||'0').toLocaleString()} at <span style={{color:C,fontWeight:600}}>{budget}</span> budget → <span style={{color:GR,fontWeight:700,fontSize:17}}>{recDays} days</span> in {dest?.name} is ideal</div>
                  </div>
                </div>
              )}

              {dest&&(
                <div style={{padding:'12px 18px',background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,marginBottom:20,display:'flex',alignItems:'center',gap:12}}>
                  <span style={{fontSize:24}}>{dest.flag}</span>
                  <div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>{dest.name}</div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>🗓️ Best time: {dest.bestTime} · 🚗 {dest.transport}</div>
                  </div>
                </div>
              )}

              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:12,marginBottom:22}}>
                {[2,3,5,7,10,14,21,30].map(d=>{
                  const rk = tripType==='india'?'budget':'dayRate'
                  const dc = (dest as any)?.[rk]?.[budget!] ?? 2000
                  const tc = dc * d * adults
                  return (
                    <div key={d} onClick={()=>setDays(d)} style={{background:'rgba(255,255,255,0.025)',border:`2px solid ${days===d?C+'55':'rgba(255,255,255,0.07)'}`,borderRadius:18,padding:20,cursor:'pointer',transition:'all .3s',position:'relative',transform:days===d?'translateY(-4px)':'translateY(0)'}}>
                      {recDays===d&&<div style={{position:'absolute',top:9,right:9,fontSize:9,padding:'2px 8px',borderRadius:100,background:`${G}22`,color:G,fontWeight:700,letterSpacing:1,textTransform:'uppercase'}}>AI Pick</div>}
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:900,color:C,lineHeight:1}}>{d}</div>
                      <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',margin:'3px 0 12px'}}>days</div>
                      <div style={{paddingTop:10,borderTop:'1px solid rgba(255,255,255,0.07)'}}>
                        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:3}}><span>Per person</span><strong style={{color:G}}>₹{(dc*d).toLocaleString()}</strong></div>
                        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'rgba(255,255,255,0.4)'}}><span>Total est.</span><strong style={{color:'#fff'}}>₹{tc.toLocaleString()}</strong></div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
                <Card style={{flex:1,minWidth:200}}>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,255,255,0.35)',marginBottom:8}}>Custom days (1–30)</div>
                  <input type="number" min="1" max="30" value={days||''} onChange={e=>{const v=parseInt(e.target.value);setDays(v>=1&&v<=30?v:null)}} placeholder="Enter exact number of days"
                    style={{padding:'10px 14px',background:'rgba(255,255,255,0.04)',border:`1px solid ${days&&(days<1||days>30)?'#ff6b6b':C+'22'}`,borderRadius:10,color:'#fff',fontSize:15,fontFamily:"'Outfit',sans-serif",outline:'none',width:'100%'}}/>
                  {days&&(days<1||days>30)&&<div style={{marginTop:6,fontSize:11,color:'#ff6b6b'}}>Please enter between 1 and 30 days</div>}
                </Card>
                <Card style={{flex:1,minWidth:200}}>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,255,255,0.35)',marginBottom:8}}>Start Date (Optional)</div>
                  <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}
                    style={{padding:'10px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,fontFamily:"'Outfit',sans-serif",fontSize:14,color:'#fff',outline:'none',colorScheme:'dark',width:'100%'}}/>
                  {startDate&&days&&<div style={{marginTop:6,fontSize:12,color:'rgba(255,255,255,0.4)'}}>Return: {new Date(new Date(startDate).getTime()+days*86400000).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>}
                </Card>
              </div>
            </div>
          )}

          {/* STEP 4 — TRAVELERS */}
          {step===4&&(
            <div>
              <div style={{marginBottom:24}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:C,marginBottom:9}}>Step 4 — Travelers & Style</div>
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:900,marginBottom:7}}>Who's <em style={{fontStyle:'italic',color:C}}>travelling?</em></h1>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginBottom:28}}>
                <Card>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,255,255,0.35)',marginBottom:18}}>Number of Travelers</div>
                  {([['👨 Adults',adults,setAdults,1],['👧 Children (under 12)',children,setChildren,0]] as [string,number,React.Dispatch<React.SetStateAction<number>>,number][]).map(([label,val,setter,min])=>(
                    <div key={label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                      <span style={{fontSize:13}}>{label}</span>
                      <div style={{display:'flex',alignItems:'center',gap:16}}>
                        <button onClick={()=>setter(Math.max(min,val-1))} style={{width:30,height:30,borderRadius:'50%',border:'1px solid rgba(255,255,255,0.15)',background:'rgba(255,255,255,0.05)',color:'#fff',fontSize:17,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>−</button>
                        <span style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:C,minWidth:28,textAlign:'center'}}>{val}</span>
                        <button onClick={()=>setter(val+1)} style={{width:30,height:30,borderRadius:'50%',border:'1px solid rgba(255,255,255,0.15)',background:'rgba(255,255,255,0.05)',color:'#fff',fontSize:17,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
                      </div>
                    </div>
                  ))}
                  <div style={{marginTop:14,padding:'10px 14px',background:`${C}08`,border:`1px solid ${C}22`,borderRadius:10,fontSize:12,color:'rgba(255,255,255,0.5)'}}>
                    Children counted as 0.5 for cost calculation
                  </div>
                </Card>

                <Card>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,255,255,0.35)',marginBottom:6}}>Accommodation Type</div>
                  <div style={{fontSize:11,color:`${C}99`,marginBottom:12}}>Select as many as you like — no limit</div>
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    {STAYS.map(s=>(
                      <div key={s.id} onClick={()=>toggleStay(s.id)} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',background:stays.includes(s.id)?`${C}0d`:'rgba(255,255,255,0.025)',border:`1px solid ${stays.includes(s.id)?C+'44':'rgba(255,255,255,0.06)'}`,borderRadius:10,cursor:'pointer',transition:'all .2s'}}>
                        <span style={{fontSize:16}}>{s.icon}</span>
                        <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:stays.includes(s.id)?C:'#fff'}}>{s.label}</div><div style={{fontSize:10,color:'rgba(255,255,255,0.35)'}}>{s.desc}</div></div>
                        <div style={{width:16,height:16,borderRadius:4,border:`1px solid ${stays.includes(s.id)?C:'rgba(255,255,255,0.2)'}`,background:stays.includes(s.id)?C:'transparent',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:BG,fontWeight:700,flexShrink:0}}>{stays.includes(s.id)?'✓':''}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,255,255,0.35)',marginBottom:6}}>Travel Style <span style={{color:C,fontWeight:400,textTransform:'none',letterSpacing:0}}>({prefs.length}/5 selected)</span></div>
                <p style={{fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:14}}>Select up to 5 preferences — shapes your activities each day</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {PREFS.map(p=>(
                    <button key={p.id} onClick={()=>togglePref(p.id)} style={{padding:'8px 16px',borderRadius:100,border:`1px solid ${prefs.includes(p.id)?C+'55':'rgba(255,255,255,0.1)'}`,background:prefs.includes(p.id)?`${C}14`:'rgba(255,255,255,0.03)',color:prefs.includes(p.id)?C:'rgba(255,255,255,0.5)',fontSize:12,cursor:'pointer',fontFamily:"'Outfit',sans-serif",transition:'all .2s',display:'flex',alignItems:'center',gap:6}}>
                      <span style={{fontSize:14}}>{p.icon}</span>{p.label}{prefs.includes(p.id)&&<span style={{color:GR,fontSize:10}}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 — GENERATING */}
          {step===5&&(
            <div style={{textAlign:'center',padding:'60px 20px'}}>
              <div style={{fontSize:72,marginBottom:24,display:'inline-block',animation:'spin 3s ease-in-out infinite'}}>🌍</div>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:900,marginBottom:10}}>Crafting your <em style={{fontStyle:'italic',color:C}}>perfect itinerary</em></h2>
              <p style={{fontSize:13,color:'rgba(255,255,255,0.45)',marginBottom:44}}>
                {dest?.name} · {days} days · {budget} budget · {adults+children} traveler{adults+children>1?'s':''}
              </p>
              <div style={{maxWidth:400,margin:'0 auto 36px',textAlign:'left'}}>
                {[
                  ['🗺️','Analysing destination & must-visit highlights'],
                  ['💰','Calculating smart per-day budget breakdown'],
                  ['🏨','Selecting best accommodation for your tier'],
                  ['🍽️','Curating authentic local food trail'],
                  ['🎯','Building logical & varied day-by-day activities'],
                  ['📦','Generating packing list & emergency contacts'],
                  ['✅','Finalising & quality-checking your plan'],
                ].map(([icon,text],i)=>{
                  const pct=(i+1)/7*100, done=genP>=pct, active=genP>=pct-15&&!done
                  return (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'9px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                      <span style={{fontSize:16,width:28,textAlign:'center',flexShrink:0}}>{icon}</span>
                      <span style={{fontSize:13,color:done?GR:active?'#fff':'rgba(255,255,255,0.35)',flex:1}}>{text}</span>
                      <div style={{width:7,height:7,borderRadius:'50%',background:done?GR:active?C:'rgba(255,255,255,0.08)',animation:active?'blink 1s infinite':'none',flexShrink:0}}/>
                    </div>
                  )
                })}
              </div>
              <div style={{maxWidth:400,margin:'0 auto'}}>
                <div style={{height:5,background:'rgba(255,255,255,0.06)',borderRadius:5,overflow:'hidden',marginBottom:10}}>
                  <div style={{height:'100%',background:`linear-gradient(90deg,${C},${G})`,borderRadius:5,width:`${genP}%`,transition:'width .6s ease'}}/>
                </div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.35)'}}>{genP}% complete</div>
              </div>
            </div>
          )}

          {/* STEP 6 — RESULT */}
          {step===6&&result&&(
            <div>
              {/* HERO BANNER */}
              <div style={{background:`linear-gradient(135deg,${C}12,${G}08)`,border:`1px solid ${C}22`,borderRadius:22,padding:'26px 30px',marginBottom:18,display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
                <div>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:GR,marginBottom:8}}>✨ Your AI Itinerary is Ready</div>
                  <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:900,marginBottom:10}}>
                    {result.destination.name} — <span style={{color:C}}>{result.days}-Day Adventure</span>
                  </h1>
                  <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:10}}>
                    {[['📅',`${result.days} days`],['👥',`${result.adults+result.children} traveler${result.adults+result.children>1?'s':''}`],['🏨',result.stays.join(' + ')],['💰',`${result.budget} budget`],['🗓️',`Best: ${result.bestTime}`]].map(([icon,text])=>(
                      <div key={String(text)} style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:'rgba(255,255,255,0.55)'}}><span>{icon}</span>{text}</div>
                    ))}
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:900,color:G}}>₹{result.totalCost.toLocaleString()}</div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.35)'}}>Total estimated cost</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.3)',marginTop:3}}>₹{result.dailyCost.toLocaleString()} / day / person</div>
                </div>
              </div>

              {/* SAVE & SHARE BAR */}
              <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:'16px 20px',marginBottom:18}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:'rgba(255,255,255,0.3)',marginBottom:12}}>Save · Share · Download</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {[
                    {icon:'💾',label:savedOk?'✅ Saved to Dashboard!':'Save Trip',onClick:handleSave,color:savedOk?GR:C,bg:savedOk?`${GR}18`:`${C}18`},
                    {icon:'🖨️',label:'HTML Template',onClick:()=>downloadHTMLTemplate(result),color:'#a855f7',bg:'rgba(168,85,247,0.15)'},
                    {icon:'📝',label:'Notepad TXT',onClick:()=>downloadTXT(result),color:G,bg:`${G}18`},
                    {icon:'🖨️',label:'Print PDF',onClick:printItinerary,color:'rgba(255,255,255,0.6)',bg:'rgba(255,255,255,0.06)'},
                  ].map((btn,i)=>(
                    <button key={i} onClick={btn.onClick} style={{padding:'8px 16px',border:`1px solid ${btn.color}44`,background:btn.bg,color:btn.color,borderRadius:100,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif",display:'flex',alignItems:'center',gap:6,transition:'all .2s'}}>
                      {btn.icon} {btn.label}
                    </button>
                  ))}
                  <div style={{width:1,height:28,background:'rgba(255,255,255,0.1)',alignSelf:'center',margin:'0 2px'}}/>
                  {[
                    {icon:'💬',label:'WhatsApp',onClick:()=>shareWhatsApp(result),color:'#25D366',bg:'rgba(37,211,102,0.12)'},
                    {icon:'📧',label:'Email',onClick:()=>shareEmail(result),color:'#FF6B6B',bg:'rgba(255,107,107,0.12)'},
                    {icon:'🐦',label:'Twitter / X',onClick:()=>shareTwitter(result),color:'#1DA1F2',bg:'rgba(29,161,242,0.12)'},
                    {icon:'📸',label:'Instagram Caption',onClick:()=>generateInstagramCaption(result),color:'#E1306C',bg:'rgba(225,48,108,0.12)'},
                    {icon:'🔗',label:'Copy',onClick:()=>copyLink(result),color:'rgba(255,255,255,0.6)',bg:'rgba(255,255,255,0.06)'},
                  ].map((btn,i)=>(
                    <button key={i} onClick={btn.onClick} style={{padding:'8px 16px',border:`1px solid ${btn.color}44`,background:btn.bg,color:btn.color,borderRadius:100,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif",display:'flex',alignItems:'center',gap:6,transition:'all .2s'}}>
                      {btn.icon} {btn.label}
                    </button>
                  ))}
                </div>
                {savedOk&&<div style={{marginTop:10,fontSize:12,color:GR}}>✅ Trip saved! View in Dashboard → Saved Trips section</div>}
              </div>

              {/* SUMMARY CARDS */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:18}}>
                {[
                  {icon:'🏨',label:'Staying at',val:result.hotelName},
                  {icon:'🍽️',label:'Food / day',val:`₹${Math.round(result.dailyCost*.18).toLocaleString()}`},
                  {icon:'🎫',label:'Activities / day',val:`₹${Math.round(result.dailyCost*.45).toLocaleString()}`},
                  {icon:'🚗',label:'Transport / day',val:`₹${Math.round(result.dailyCost*.12).toLocaleString()}`},
                ].map((s,i)=>(
                  <div key={i} style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:18}}>
                    <span style={{fontSize:22,display:'block',marginBottom:8}}>{s.icon}</span>
                    <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:1,marginBottom:4}}>{s.label}</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700}}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* TABS */}
              <div style={{display:'flex',gap:6,marginBottom:18}}>
                {[
                  {id:'itinerary',label:'📅 Itinerary'},
                  {id:'budget',label:'💰 Budget'},
                  {id:'packing',label:'🎒 Packing'},
                  {id:'emergency',label:'🚨 Emergency'},
                ].map(t=>(
                  <button key={t.id} onClick={()=>setActiveTab(t.id as typeof activeTab)} style={{padding:'9px 18px',borderRadius:10,border:`1px solid ${activeTab===t.id?C+'44':'rgba(255,255,255,0.08)'}`,background:activeTab===t.id?`${C}14`:'rgba(255,255,255,0.025)',color:activeTab===t.id?C:'rgba(255,255,255,0.45)',fontSize:12,fontWeight:activeTab===t.id?600:400,cursor:'pointer',fontFamily:"'Outfit',sans-serif",transition:'all .2s'}}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* TAB: ITINERARY */}
              {activeTab==='itinerary'&&(
                <div>
                  <div style={{marginBottom:18}}>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,255,255,0.35)',marginBottom:10}}>Must-Do in {result.destination.name}</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                      {result.destination.highlights.map((h,i)=>(
                        <div key={i} style={{padding:'6px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:100,fontSize:12,color:'rgba(255,255,255,0.6)',display:'flex',alignItems:'center',gap:5}}>
                          <span style={{color:G}}>★</span>{h}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>
                    {result.itinerary.map((_,i)=>(
                      <button key={i} onClick={()=>setActiveDay(i)} style={{padding:'7px 16px',borderRadius:100,border:`1px solid ${activeDay===i?C+'44':'rgba(255,255,255,0.1)'}`,background:activeDay===i?`${C}14`:'rgba(255,255,255,0.025)',color:activeDay===i?C:'rgba(255,255,255,0.45)',fontSize:12,fontWeight:activeDay===i?600:400,cursor:'pointer',fontFamily:"'Outfit',sans-serif",transition:'all .2s',whiteSpace:'nowrap'}}>
                        Day {i+1}
                      </button>
                    ))}
                  </div>

                  {result.itinerary[activeDay]&&(()=>{
                    const day = result.itinerary[activeDay]
                    return (
                      <div>
                        <div style={{padding:'14px 20px',background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,marginBottom:14,display:'flex',alignItems:'center',gap:14}}>
                          <span style={{fontSize:30}}>{day.themeIcon}</span>
                          <div>
                            <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',letterSpacing:1,textTransform:'uppercase'}}>Day {day.day} of {result.days}</div>
                            <div style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,marginBottom:2}}>{day.theme}</div>
                            <div style={{fontSize:12,color:'rgba(255,255,255,0.35)'}}>🏨 {day.hotel} · 💰 Est. ₹{day.dayCost.toLocaleString()}/person</div>
                          </div>
                        </div>

                        {day.slots.map((slot,i)=>(
                          <div key={i}>
                            <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'14px 18px',marginBottom:7,transition:'all .2s',cursor:'default'}}
                              onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor=`${C}33`;(e.currentTarget as HTMLDivElement).style.background=`${C}06`}}
                              onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='rgba(255,255,255,0.07)';(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.025)'}}>
                              <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
                                <div style={{minWidth:62,textAlign:'center',padding:'5px 4px',background:`${C}12`,border:`1px solid ${C}22`,borderRadius:9,flexShrink:0}}>
                                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:10,fontWeight:700,color:C,lineHeight:1.3}}>{slot.time.split('–')[0].trim()}</div>
                                  <div style={{fontSize:8,color:'rgba(255,255,255,0.35)',marginTop:2}}>{slot.label}</div>
                                </div>
                                <div style={{fontSize:22,flexShrink:0}}>{slot.icon}</div>
                                <div style={{flex:1}}>
                                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,marginBottom:2,lineHeight:1.4}}>{slot.activity}</div>
                                  <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',letterSpacing:1,textTransform:'uppercase'}}>{slot.time}</div>
                                </div>
                                <div style={{fontSize:12,color:slot.cost>0?G:GR,fontWeight:600,flexShrink:0}}>{slot.cost>0?`₹${slot.cost.toLocaleString()}`:'incl.'}</div>
                              </div>
                            </div>
                            {i<day.slots.length-1&&<div style={{width:2,height:10,background:`linear-gradient(to bottom,${C}28,transparent)`,margin:'0 0 0 28px'}}/>}
                          </div>
                        ))}

                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginTop:20}}>
                          <div style={{background:`${G}08`,border:`1px solid ${G}2a`,borderRadius:14,padding:'18px 20px'}}>
                            <div style={{fontSize:11,fontWeight:700,color:G,marginBottom:10,letterSpacing:2,textTransform:'uppercase'}}>💡 Pro Travel Tips</div>
                            {result.tips.map((tip,i)=>(
                              <div key={i} style={{fontSize:12,color:'rgba(255,255,255,0.55)',lineHeight:1.7,padding:'3px 0',display:'flex',gap:7}}>
                                <span style={{color:G,flexShrink:0}}>•</span>{tip}
                              </div>
                            ))}
                          </div>
                          <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'18px 20px'}}>
                            <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.35)',marginBottom:10,letterSpacing:2,textTransform:'uppercase'}}>🍽️ Must-Try Food</div>
                            <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:12}}>
                              {result.destination.food.map((f,i)=>(
                                <div key={i} style={{padding:'5px 12px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:100,fontSize:11,color:'rgba(255,255,255,0.6)'}}>{f}</div>
                              ))}
                            </div>
                            <div style={{fontSize:10,color:'rgba(255,255,255,0.3)',letterSpacing:1,textTransform:'uppercase',marginBottom:5}}>🚗 Getting Around</div>
                            <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>{result.transport}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* TAB: BUDGET */}
              {activeTab==='budget'&&(
                <div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:14,marginBottom:20}}>
                    {[
                      {icon:'🍽️',label:'Food & Dining',pct:18,desc:'Local restaurants, street food, cafes'},
                      {icon:'🎫',label:'Activities & Entry',pct:45,desc:'Sites, tours, guides, experiences'},
                      {icon:'🚗',label:'Local Transport',pct:12,desc:'Auto, taxi, metro, local commute'},
                      {icon:'🏨',label:'Accommodation',pct:25,desc:'Hotel, hostel, resort per night'},
                    ].map((item,i)=>(
                      <div key={i} style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:20}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                          <div>
                            <span style={{fontSize:22,display:'block',marginBottom:6}}>{item.icon}</span>
                            <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{item.label}</div>
                            <div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>{item.desc}</div>
                          </div>
                          <div style={{textAlign:'right'}}>
                            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:900,color:C}}>{item.pct}%</div>
                            <div style={{fontSize:12,color:G,fontWeight:600}}>₹{Math.round(result.dailyCost*item.pct/100).toLocaleString()}/day</div>
                          </div>
                        </div>
                        <div style={{height:6,background:'rgba(255,255,255,0.06)',borderRadius:3,overflow:'hidden'}}>
                          <div style={{height:'100%',background:`linear-gradient(90deg,${C},${G})`,borderRadius:3,width:`${item.pct*2}%`,transition:'width 1s ease'}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{background:`linear-gradient(135deg,${C}10,${G}08)`,border:`1px solid ${C}22`,borderRadius:16,padding:'22px 26px'}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:900,marginBottom:16}}>Complete Cost Summary</div>
                    {[
                      ['Daily Cost per Person','₹'+result.dailyCost.toLocaleString()],
                      ['Duration',result.days+' days'],
                      ['Adults',String(result.adults)],
                      ['Children (×0.5)','₹'+(result.children*result.dailyCost*result.days*0.5).toLocaleString()],
                      ['Adults Total','₹'+(result.adults*result.dailyCost*result.days).toLocaleString()],
                    ].map(([k,v])=>(
                      <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.07)',fontSize:13}}>
                        <span style={{color:'rgba(255,255,255,0.5)'}}>{k}</span>
                        <strong style={{color:'#fff'}}>{v}</strong>
                      </div>
                    ))}
                    <div style={{display:'flex',justifyContent:'space-between',padding:'12px 0 0',fontSize:16}}>
                      <span style={{color:'rgba(255,255,255,0.7)',fontWeight:600}}>TOTAL ESTIMATED</span>
                      <strong style={{color:G,fontFamily:"'Playfair Display',serif",fontSize:22}}>₹{result.totalCost.toLocaleString()}</strong>
                    </div>
                    <p style={{fontSize:11,color:'rgba(255,255,255,0.3)',marginTop:10}}>* Estimates. Actual costs depend on season, booking time & personal choices. Add 10-15% buffer.</p>
                  </div>
                </div>
              )}

              {/* TAB: PACKING */}
              {activeTab==='packing'&&(
                <div>
                  <div style={{background:`${GR}08`,border:`1px solid ${GR}22`,borderRadius:16,padding:'22px 24px',marginBottom:18}}>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:GR,marginBottom:4}}>🎒 Smart Packing for {result.destination.name}</div>
                    <p style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:18}}>Curated for your destination, season ({result.bestTime}) and travel style</p>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:8}}>
                      {[...result.packingList,'Valid Photo ID / Passport','Travel insurance card','Emergency contact printout','Portable phone charger','Offline maps downloaded','First aid basics','Cash in local currency'].map((item,i)=>(
                        <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10}}>
                          <div style={{width:16,height:16,borderRadius:3,border:`1px solid ${GR}44`,flexShrink:0}}/>
                          <span style={{fontSize:12,color:'rgba(255,255,255,0.7)',lineHeight:1.4}}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{padding:'16px 20px',background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14}}>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.3)',letterSpacing:2,textTransform:'uppercase',marginBottom:6}}>🗓️ Best Time to Visit</div>
                    <div style={{fontSize:14,color:'#fff',fontWeight:500}}>{result.bestTime}</div>
                  </div>
                </div>
              )}

              {/* TAB: EMERGENCY */}
              {activeTab==='emergency'&&(
                <div>
                  <div style={{background:'rgba(255,59,48,0.08)',border:'1px solid rgba(255,59,48,0.25)',borderRadius:16,padding:'22px 24px',marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'#ff6b6b',marginBottom:12}}>🚨 Emergency Contacts — {result.destination.name}</div>
                    <div style={{fontSize:14,color:'rgba(255,255,255,0.8)',lineHeight:1.9,fontFamily:"'Outfit',sans-serif"}}>{result.emergency}</div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                    <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'18px 20px'}}>
                      <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.35)',marginBottom:12,letterSpacing:2,textTransform:'uppercase'}}>🏥 General Tips</div>
                      {['Save hotel address in local language on your phone','Share live location with family back home','Carry physical copies of all booking confirmations','Keep travel insurance emergency number handy','Know nearest hospital to your accommodation'].map((t,i)=>(
                        <div key={i} style={{fontSize:12,color:'rgba(255,255,255,0.55)',padding:'4px 0',display:'flex',gap:7,lineHeight:1.6}}>
                          <span style={{color:G,flexShrink:0}}>•</span>{t}
                        </div>
                      ))}
                    </div>
                    <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'18px 20px'}}>
                    <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.35)',marginBottom:12,letterSpacing:2,textTransform:'uppercase'}}>🚗 Getting Around</div>
                      <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',lineHeight:1.7}}>{result.transport}</div>
                      <div style={{marginTop:14,paddingTop:14,borderTop:'1px solid rgba(255,255,255,0.07)'}}>
                        <div style={{fontSize:10,color:'rgba(255,255,255,0.3)',letterSpacing:1,textTransform:'uppercase',marginBottom:5}}>🗓️ Best Time to Visit</div>
                        <div style={{fontSize:13,color:'#fff',fontWeight:500}}>{result.bestTime}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* BOTTOM NAV BAR */}
        {step<6&&!generating&&(
          <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:50,background:'rgba(2,8,16,0.97)',backdropFilter:'blur(20px)',borderTop:'1px solid rgba(255,255,255,0.07)',padding:'13px 32px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:14}}>
            <div style={{fontSize:13,color:'rgba(255,255,255,0.4)'}}>
              {step===1&&budget&&<>Budget: <strong style={{color:C}}>{budget}</strong></>}
              {step===2&&dest&&<>Destination: <strong style={{color:C}}>{dest.name}</strong></>}
              {step===3&&days&&<>Duration: <strong style={{color:C}}>{days} days</strong></>}
              {step===4&&<>Travelers: <strong style={{color:C}}>{adults+children}</strong> · Stay: <strong style={{color:C}}>{stays.join(', ')}</strong></>}
            </div>
            <div style={{display:'flex',gap:9}}>
              {step>1&&(
                <button onClick={()=>setStep(s=>s-1)}
                  style={{padding:'9px 22px',border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'rgba(255,255,255,0.5)',fontFamily:"'Outfit',sans-serif",fontSize:13,cursor:'pointer',borderRadius:100,transition:'all .2s'}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C;(e.currentTarget as HTMLButtonElement).style.color=C}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(255,255,255,0.1)';(e.currentTarget as HTMLButtonElement).style.color='rgba(255,255,255,0.5)'}}>
                  ← Back
                </button>
              )}
              <button
                disabled={!canNext}
                onClick={()=>{
                  if(step===4){setStep(5);setTimeout(generate,300)}
                  else setStep(s=>s+1)
                }}
                style={{padding:'9px 28px',border:'none',background:canNext?`linear-gradient(135deg,${C},#8ae0ff)`:'rgba(99,210,255,0.15)',color:canNext?BG:'rgba(255,255,255,0.25)',fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:700,cursor:canNext?'pointer':'not-allowed',borderRadius:100,transition:'all .2s'}}>
                {step===4?'🤖 Generate Itinerary':'Continue →'}
              </button>
            </div>
          </div>
        )}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
          *{box-sizing:border-box;margin:0;padding:0}
          html{scroll-behavior:smooth}
          ::-webkit-scrollbar{width:3px}
          ::-webkit-scrollbar-track{background:#020810}
          ::-webkit-scrollbar-thumb{background:#63d2ff;border-radius:2px}
          input[type=date]::-webkit-calendar-picker-indicator{filter:invert(1);opacity:.4}
          @keyframes spin{0%,100%{transform:rotate(-8deg) scale(1)}50%{transform:rotate(8deg) scale(1.15)}}
          @keyframes blink{0%,100%{opacity:1}50%{opacity:.1}}
          @media print{
            nav,div[style*='position:fixed']{display:none!important}
            body{background:white;color:black}
          }
        `}</style>
      </div>
    )
  }