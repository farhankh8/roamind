'use client'
import { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { INDIA, INTL, type Destination, type Budget } from '@/data/destinations'

// ─── THEME ────────────────────────────────────────────────────────────────────
  const C='#63d2ff', G='#ffb74d', BG='#020810', BG2='#060d1a', GR='#4cff91'

// ─── TYPES ────────────────────────────────────────────────────────────────────
  type TripType = 'india'|'intl'
  type Region = 'Southeast Asia'|'Europe'|'Middle East'|'Americas'|'East Asia'|'South Asia'|'Africa'|'Oceania'|null

  const REGIONS: {id:Region,region:string,label:string,flag:string,countries:string}[] = [
    {id:'Southeast Asia',region:'Southeast Asia',label:'Southeast Asia',flag:'🌏',countries:'Thailand · Bali · Vietnam · Singapore · Cambodia'},
    {id:'Europe',region:'Europe',label:'Europe',flag:'🏰',countries:'France · Italy · Spain · Greece · Portugal · Germany · Norway'},
    {id:'Middle East',region:'Middle East',label:'Middle East',flag:'🕌',countries:'Egypt · Dubai · Jordan · Turkey'},
    {id:'Americas',region:'Americas',label:'Americas',flag:'🗽',countries:'USA · Canada · Mexico · Argentina · Peru · Cuba · Colombia'},
    {id:'East Asia',region:'East Asia',label:'East Asia',flag:'🏯',countries:'Japan · South Korea'},
    {id:'South Asia',region:'South Asia',label:'South Asia',flag:'🙏',countries:'Sri Lanka · Nepal · Maldives'},
    {id:'Africa',region:'Africa',label:'Africa',flag:'🦁',countries:'Kenya · South Africa'},
    {id:'Oceania',region:'Oceania',label:'Oceania',flag:'🏝️',countries:'Australia · New Zealand · Bora Bora'},
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
    const budgetData = isIndia ? dest.budget : dest.dayRate
    const dc = budgetData?.[budget] ?? 2000
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
    const [selectedRegion, setSelectedRegion] = useState<Region>(null)
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
    const [aiEnhanced, setAiEnhanced] = useState<string | null>(null)
    const [aiLoading, setAiLoading] = useState(false)
    const [activeDay, setActiveDay] = useState(0)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')
    const [savedOk, setSavedOk] = useState(false)
    const [activeTab, setActiveTab] = useState<'itinerary'|'packing'|'budget'|'emergency'>('itinerary')

    const allDests = tripType==='india' ? INDIA : INTL

    const filtered = useMemo(() => allDests.filter(d => {
      const q = search.toLowerCase()
      const matchSearch = d.name.toLowerCase().includes(q) ||
        (d.state||'').toLowerCase().includes(q) ||
        (d.country||'').toLowerCase().includes(q)
      const matchRegion = tripType === 'intl' && selectedRegion ? d.region === selectedRegion : true
      if (filter === 'All') return matchSearch && matchRegion
      return matchSearch && d.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())) && matchRegion
    }), [allDests, search, filter, tripType, selectedRegion])

    const calcDays = useCallback(() => {
      if (!budget || !dest) return null
      const budgetData = tripType === 'india' ? dest.budget : dest.dayRate
      const dc = budgetData?.[budget] ?? 2000
      const tb = parseInt(totalBudget.replace(/\D/g,'')) || 0
      if (!tb) return null
      return Math.max(1, Math.min(30, Math.floor(tb / (dc * Math.max(adults, 1)))))
    }, [budget, dest, tripType, totalBudget, adults])

    const recDays = calcDays()
    const togglePref = useCallback((id: string) => setPrefs(p => p.includes(id) ? p.filter(x=>x!==id) : p.length>=5 ? p : [...p, id]), [])
    const toggleStay = useCallback((id: string) => setStays(s => s.includes(id) ? (s.length>1 ? s.filter(x=>x!==id) : s) : [...s, id]), [])

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

    const enhanceWithAI = async () => {
      if (!result) return
      setAiLoading(true)
      try {
        const basicItinerary = result.itinerary.map(day =>
          `Day ${day.day}: [${day.theme}] ${day.slots.map(s => `${s.time} - ${s.activity} (${s.label})`).join(' | ')}`
        ).join('\n\n')
        const prompt = `Trip to ${result.destination.name}, ${result.destination.state || result.destination.country} for ${result.days} days, ${result.budget} budget, ${result.adults + result.children} traveler(s). Preferences: ${prefs.join(', ') || 'culture, food'}. Stay type: ${result.stays.join(', ')}.\n\nBasic itinerary:\n${basicItinerary}\n\nEnhance this itinerary with specific local restaurant names, hidden gems, local tips, cultural insights, and practical advice. Keep the same day structure but make it richer and more detailed. Format your response as enhanced day-by-day content that supplements the existing plan.`
        const res = await fetch('/api/anthropic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: result.destination.name, country: result.destination.country, prompt })
        })
        const data = await res.json()
        if (!res.ok || data.error) throw new Error(data.error || 'AI enhancement failed')
        setAiEnhanced(data.restaurants?.[0]?.desc || data.restaurants?.[0]?.mustOrder || data.content?.[0]?.text || data.content || 'Enhancement received.')
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'AI enhancement failed. Please try again.'
        alert(msg)
      } finally {
        setAiLoading(false)
      }
    }

    const stepLabels = ['Budget','Destination','Days','Travelers','Generating','Your Plan']
    const canNext = (step===1&&!!budget) || (step===2&&!!dest) || (step===3&&!!days&&days>=1&&days<=30) || step===4

    const Card = ({children:ch, style:st}: {children:React.ReactNode, style?:React.CSSProperties}) => (
      <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:22,...st}}>{ch}</div>
    )

    return (
      <div style={{minHeight:'100vh',background:BG,color:'#fff',fontFamily:"'Outfit',sans-serif"}}>

        {/* NAV */}
        <nav aria-label="Main navigation" style={{position:'sticky',top:0,zIndex:100,background:'rgba(2,8,16,0.97)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.07)',padding:'13px 32px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <button aria-label="Go to dashboard" onClick={()=>router.push('/dashboard')} style={{display:'flex',alignItems:'center',gap:10,background:'transparent',border:'none',cursor:'pointer',color:'#fff',fontFamily:"'Outfit',sans-serif"}}>
            <span style={{fontSize:20}}>🌍</span>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:900,background:`linear-gradient(130deg,#fff 30%,${C} 70%)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Roamind</span>
          </button>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <span style={{fontSize:11,color:'rgba(255,255,255,0.3)',padding:'4px 12px',background:'rgba(255,255,255,0.04)',borderRadius:100,border:'1px solid rgba(255,255,255,0.07)'}}>{allDests.length} destinations</span>
            <button onClick={()=>router.push('/dashboard')} style={{padding:'7px 16px',background:'transparent',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.5)',borderRadius:100,cursor:'pointer',fontSize:12,fontFamily:"'Outfit',sans-serif"}}>← Dashboard</button>
            {step>1&&<button onClick={()=>{setStep(1);setResult(null);setBudget(null);setDest(null);setDays(null);setPrefs([]);setStays(['hotel']);setGenP(0);setGenerating(false);setSelectedRegion(null)}} style={{padding:'7px 16px',background:'transparent',border:`1px solid rgba(255,183,77,0.3)`,color:G,borderRadius:100,cursor:'pointer',fontSize:12,fontFamily:"'Outfit',sans-serif"}}>🔄 Restart</button>}
          </div>
        </nav>

        {/* STEP PROGRESS */}
        <div role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={6} aria-label={`Step ${step} of 6: ${stepLabels[step-1]}`} style={{background:BG2,borderBottom:'1px solid rgba(255,255,255,0.07)',padding:'14px 32px',display:'flex',alignItems:'center',justifyContent:'center',gap:0,overflowX:'auto'}}>
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

        <div style={{maxWidth:1100,margin:'0 auto',padding:'36px 24px 120px'}} className="step-content">

          {/* STEP 1 — BUDGET */}
          {step===1&&(
            <div>
              <div style={{marginBottom:28}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:C,marginBottom:9}}>Step 1 — Budget & Region</div>
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:900,marginBottom:7}}>Where are you <em style={{fontStyle:'italic',color:C}}>heading?</em></h1>
                <p style={{fontSize:13,color:'rgba(255,255,255,0.45)',lineHeight:1.8}}>{tripType==='india' ? 'Select your trip type and budget tier. Enter your total budget and we\'ll auto-calculate the ideal trip length.' : 'Choose a region to explore destinations. Click on a region card below to see available countries.'}</p>
              </div>

              <div style={{display:'flex',gap:8,marginBottom:28,padding:5,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,width:'fit-content'}}>
                {([['india',`🇮🇳 India (${INDIA.length} cities)`],['intl',`✈️ International (${INTL.length} countries)`]] as [TripType,string][]).map(([v,l])=>(
                  <button key={v} onClick={()=>{setTripType(v);setBudget(null);setSelectedRegion(null);setDest(null)}} style={{padding:'9px 22px',borderRadius:10,border:'none',background:tripType===v?`${C}18`:'transparent',color:tripType===v?C:'rgba(255,255,255,0.45)',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif",transition:'all .2s'}}>{l}</button>
                ))}
              </div>

              {tripType==='india' ? (
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
                  {[
                    {id:'low' as Budget,icon:'🎒',name:'Budget Traveller',range:'₹600–1,500 / day',desc:'Maximum experience, minimum spend. Hostels, street food & state buses.',perks:['Dormitory / budget guesthouse','Street food & local dhabas','State buses & shared taxis','Free monuments & public parks'],clr:GR},
                    {id:'mid' as Budget,icon:'🏨',name:'Comfort Traveller',range:'₹2,000–5,000 / day',desc:'Comfortable 3-star stays, good restaurants and private cab travel.',perks:['3-star hotel & private AC rooms','Multi-cuisine restaurants','Ola/Uber/local cabs','Heritage entries & guided tours'],clr:C},
                    {id:'high' as Budget,icon:'✨',name:'Luxury Traveller',range:'₹8,000–25,000 / day',desc:'5-star stays, fine dining, private chauffeur and exclusive experiences.',perks:['Luxury 5-star hotels & resorts','Award-winning restaurants','Private chauffeur all day','Premium exclusive guided experiences'],clr:G},
                  ].map(b=>(
                    <div key={b.id} role="button" tabIndex={0} onClick={()=>setBudget(b.id)} onKeyDown={(e)=>e.key==='Enter'&&setBudget(b.id)} style={{background:'rgba(255,255,255,0.025)',border:`2px solid ${budget===b.id?b.clr+'55':'rgba(255,255,255,0.07)'}`,borderRadius:20,padding:24,cursor:'pointer',transition:'all .3s',position:'relative',overflow:'hidden',transform:budget===b.id?'translateY(-4px)':'translateY(0)',outline:'none'}}
                        onFocus={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow=`0 0 0 2px ${b.clr}`}}
                        onBlur={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow='none'}}
                        aria-pressed={budget===b.id}
                        aria-label={`${b.name}: ${b.range} - ${b.desc}`}>
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
                <div>
                  <div style={{marginBottom:20}}>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,255,255,0.4)',marginBottom:8}}>Select a Region</div>
                    <p style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>Click on a region to see available destinations</p>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12}}>
                    {REGIONS.map((r)=>(
                      <div key={r.id} role="button" tabIndex={0} onClick={()=>{setSelectedRegion(r.id);setStep(2)}} onKeyDown={(e)=>e.key==='Enter'&&(setSelectedRegion(r.id),setStep(2))} style={{background:'rgba(255,255,255,0.025)',border:`2px solid ${selectedRegion===r.id?C:'rgba(255,255,255,0.07)'}`,borderRadius:16,padding:18,cursor:'pointer',transition:'all .3s',transform:selectedRegion===r.id?'translateY(-4px)':'translateY(0)',outline:'none'}}
                        onFocus={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow=`0 0 0 2px ${C}`}}
                        onBlur={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow='none'}}
                        aria-pressed={selectedRegion===r.id}
                        aria-label={`${r.label}: ${r.countries}`}>
                        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                          <span style={{fontSize:28}}>{r.flag}</span>
                          <div style={{fontWeight:700,fontSize:15}}>{r.label}</div>
                        </div>
                        <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:12,lineHeight:1.5}}>{r.countries}</div>
                        <div style={{padding:'8px 12px',background:selectedRegion===r.id?`${C}22`:'rgba(255,255,255,0.04)',borderRadius:8,fontSize:12,color:selectedRegion===r.id?C:'rgba(255,255,255,0.4)',fontWeight:600,textAlign:'center'}}>
                          {selectedRegion===r.id?'✓ Selected':'Click to Explore →'}
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedRegion&&(
                    <div style={{marginTop:20,padding:'14px 18px',background:`${C}10`,border:`1px solid ${C}30`,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
                      <div>
                        <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:4}}>Selected Region</div>
                        <div style={{fontSize:16,fontWeight:700,color:C}}>{selectedRegion}</div>
                      </div>
                      <div style={{display:'flex',gap:8}}>
                        <button onClick={()=>{setSelectedRegion(null);setDest(null)}} style={{padding:'8px 16px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'rgba(255,255,255,0.6)',fontSize:12,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>Change Region</button>
                        <button onClick={()=>setStep(2)} style={{padding:'8px 20px',background:C,border:'none',borderRadius:8,color:BG,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>Browse Destinations →</button>
                      </div>
                    </div>
                  )}
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
                <div style={{fontSize:10,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:C,marginBottom:9}}>Step 2 — Destination {tripType==='intl' && selectedRegion ? `— ${selectedRegion}` : `(${allDests.length} available)`}</div>
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:900,marginBottom:7}}>Choose your <em style={{fontStyle:'italic',color:C}}>destination</em></h1>
                <p style={{fontSize:13,color:'rgba(255,255,255,0.45)'}}>{filtered.length} destinations match your filters</p>
                {tripType==='intl' && selectedRegion && (
                  <div style={{marginTop:12,display:'flex',gap:8}}>
                    <button onClick={()=>{setSelectedRegion(null);setDest(null)}} style={{padding:'6px 14px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:100,color:'rgba(255,255,255,0.5)',fontSize:11,cursor:'pointer'}}>← All Regions</button>
                    <div style={{padding:'6px 14px',background:`${C}15`,border:'1px solid rgba(99,210,255,0.3)',borderRadius:100,color:C,fontSize:11,fontWeight:600}}>{selectedRegion}</div>
                  </div>
                )}
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

              {filtered.length === 0 ? (
                <div style={{textAlign:'center',padding:'60px 20px',color:'rgba(255,255,255,0.4)'}}>
                  <span style={{fontSize:48,display:'block',marginBottom:16}}>🔍</span>
                  <p style={{fontSize:16,marginBottom:8}}>No destinations found</p>
                  <p style={{fontSize:13,color:'rgba(255,255,255,0.3)'}}>Try a different search or filter</p>
                  <button onClick={()=>{setSearch('');setFilter('All')}} style={{marginTop:16,padding:'10px 24px',background:C,border:'none',borderRadius:12,color:BG,fontSize:13,fontWeight:600,cursor:'pointer'}}>Clear Filters</button>
                </div>
              ) : (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:10}} className="mobile-grid">
                {filtered.map((d,i)=>(
                  <div 
                    key={`${d.name}-${i}`} 
                    role="button" 
                    tabIndex={0} 
                    onClick={()=>setDest(d)}
                    onKeyDown={(e) => e.key === 'Enter' && setDest(d)}
                    style={{borderRadius:13,overflow:'hidden',position:'relative',aspectRatio:'4/3',cursor:'pointer',border:`2px solid ${dest?.name===d.name?C:'transparent'}`,transition:'all .3s',outline:'none'}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(-3px)'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(0)'}}
                    onFocus={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(-3px)';(e.currentTarget as HTMLDivElement).style.boxShadow=`0 0 0 2px ${C}`}}
                    onBlur={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(0)';(e.currentTarget as HTMLDivElement).style.boxShadow='none'}}
                    aria-label={`${d.name}, ${d.state||d.country}, ${d.tags[0]}`}
                  >
                    <Image src={d.img} alt={`${d.name} - ${d.state||d.country}`} fill style={{objectFit:'cover'}} unoptimized />
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
              )}
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
                  const budgetData = tripType==='india'?dest?.budget:dest?.dayRate
                  const dc = budgetData?.[budget!] ?? 2000
                  const tc = dc * d * adults
                  return (
                    <div key={d} role="button" tabIndex={0} onClick={()=>setDays(d)} onKeyDown={(e)=>e.key==='Enter'&&setDays(d)} style={{background:'rgba(255,255,255,0.025)',border:`2px solid ${days===d?C+'55':'rgba(255,255,255,0.07)'}`,borderRadius:18,padding:20,cursor:'pointer',transition:'all .3s',position:'relative',transform:days===d?'translateY(-4px)':'translateY(0)',outline:'none'}}
                      onFocus={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow=`0 0 0 2px ${C}`}}
                      onBlur={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow='none'}}
                      aria-pressed={days===d}
                      aria-label={`${d} days trip, estimated cost ₹${tc.toLocaleString()}`}>
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
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:900,marginBottom:7}}>Who&apos;s <em style={{fontStyle:'italic',color:C}}>travelling?</em></h1>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginBottom:28}}>
                <Card>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,255,255,0.35)',marginBottom:18}}>Number of Travelers</div>
                  {([['👨 Adults',adults,setAdults,1],['👧 Children (under 12)',children,setChildren,0]] as [string,number,React.Dispatch<React.SetStateAction<number>>,number][]).map(([label,val,setter,min])=>(
                    <div key={label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                      <span style={{fontSize:13}}>{label}</span>
                      <div style={{display:'flex',alignItems:'center',gap:16}}>
                        <button aria-label={`Decrease ${label}`} onClick={()=>setter(Math.max(min,val-1))} style={{width:30,height:30,borderRadius:'50%',border:'1px solid rgba(255,255,255,0.15)',background:'rgba(255,255,255,0.05)',color:'#fff',fontSize:17,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>−</button>
                        <span aria-live="polite" style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:C,minWidth:28,textAlign:'center'}}>{val}</span>
                        <button aria-label={`Increase ${label}`} onClick={()=>setter(val+1)} style={{width:30,height:30,borderRadius:'50%',border:'1px solid rgba(255,255,255,0.15)',background:'rgba(255,255,255,0,05)',color:'#fff',fontSize:17,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
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
                      <div key={s.id} role="checkbox" aria-checked={stays.includes(s.id)} tabIndex={0} onClick={()=>toggleStay(s.id)} onKeyDown={(e)=>e.key==='Enter'&&toggleStay(s.id)} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',background:stays.includes(s.id)?`${C}0d`:'rgba(255,255,255,0.025)',border:`1px solid ${stays.includes(s.id)?C+'44':'rgba(255,255,255,0.06)'}`,borderRadius:10,cursor:'pointer',transition:'all .2s',outline:'none'}}
                        onFocus={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow=`0 0 0 2px ${C}`}}
                        onBlur={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow='none'}}>
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
                    <button key={p.id} role="checkbox" aria-checked={prefs.includes(p.id)} onClick={()=>togglePref(p.id)} style={{padding:'8px 16px',borderRadius:100,border:`1px solid ${prefs.includes(p.id)?C+'55':'rgba(255,255,255,0.1)'}`,background:prefs.includes(p.id)?`${C}14`:'rgba(255,255,255,0.03)',color:prefs.includes(p.id)?C:'rgba(255,255,255,0.5)',fontSize:12,cursor:'pointer',fontFamily:"'Outfit',sans-serif",transition:'all .2s',display:'flex',alignItems:'center',gap:6}}>
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

              {/* ENHANCE WITH AI */}
              <div style={{display:'flex',gap:10,marginBottom:18}}>
                <button
                  onClick={enhanceWithAI}
                  disabled={aiLoading}
                  style={{padding:'10px 22px',border:`1px solid ${GR}44`,background:`${GR}14`,color:GR,borderRadius:100,fontSize:13,fontWeight:600,cursor:aiLoading?'wait':'pointer',fontFamily:"'Outfit',sans-serif",display:'flex',alignItems:'center',gap:8,transition:'all .2s',opacity:aiLoading?0.8:1}}
                >
                  {aiLoading ? (
                    <><span style={{display:'inline-block',width:14,height:14,border:'2px solid rgba(76,255,145,0.3)',borderTopColor:GR,borderRadius:'50%',animation:'spinCW .8s linear infinite'}}/>Generating…</>
                  ) : (
                    <><span>✨</span>Enhance with AI</>
                  )}
                </button>
                {!aiLoading && aiEnhanced && (
                  <button
                    onClick={() => { setAiEnhanced(null) }}
                    style={{padding:'10px 22px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.4)',borderRadius:100,fontSize:13,fontWeight:400,cursor:'pointer',fontFamily:"'Outfit',sans-serif",display:'flex',alignItems:'center',gap:8}}
                  >
                    Hide AI version
                  </button>
                )}
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

              {/* AI ENHANCED VERSION */}
              {aiEnhanced && (
                <div style={{background:'linear-gradient(135deg,rgba(76,255,145,0.06) 0%,rgba(99,210,255,0.04) 100%)',border:'1px solid rgba(76,255,145,0.2)',borderRadius:20,padding:'28px 30px',marginTop:20}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
                    <span style={{fontSize:24}}>✨</span>
                    <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,background:'linear-gradient(130deg,#fff,rgba(76,255,145,0.8))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>AI Enhanced Version</h2>
                  </div>
                  <div style={{fontSize:14,color:'rgba(255,255,255,0.7)',lineHeight:1.9,whiteSpace:'pre-wrap',fontFamily:"'Outfit',sans-serif"}}>
                    {aiEnhanced}
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
          @keyframes spinCW{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
          @keyframes blink{0%,100%{opacity:1}50%{opacity:.1}}
          @keyframes fadeSlideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
          @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
          @keyframes shimmer{0%{background-position:-200px 0}100%{background-position:calc(200px + 100%) 0}}
          .fade-in{animation:fadeSlideIn .3s ease-out}
          .step-content{animation:fadeSlideIn .25s ease-out}
          @media print{
            nav,div[style*='position:fixed']{display:none!important}
            body{background:white;color:black}
          }
          @media (max-width:640px){
            .mobile-grid{grid-template-columns:repeat(auto-fill,minmax(110px,1fr))!important}
          }
        `}</style>
      </div>
    )
  }