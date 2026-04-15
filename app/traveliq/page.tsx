'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import Sidebar from '@/components/Sidebar'

const C = '#63d2ff'
const G = '#ffb74d'
const R = '#ff6b6b'
const BG = '#000814'
const BG2 = '#05090f'
const BG3 = '#0a1628'
const GR = '#51cf66'
const PURPLE = '#a855f7'

const navSections = [
  { title: 'Plan & Discover', items: [{ icon: '🏠', label: 'Dashboard', path: '/dashboard' }, { icon: '🤖', label: 'AI Itinerary', path: '/itinerary' }] },
  { title: 'Book & Travel', items: [{ icon: '✈️', label: 'Flights', path: '/flights' }, { icon: '🏨', label: 'Hotels', path: '/hotels' }, { icon: '🍽️', label: 'Restaurants', path: '/restaurants' }, { icon: '🚌', label: 'Transport', path: '/transport' }] },
  { title: 'Intelligence', items: [{ icon: '🛂', label: 'Visa Guide', path: '/visa' }, { icon: '💱', label: 'Currency', path: '/currency' }, { icon: '🌤️', label: 'Weather+AQI', path: '/weather' }, { icon: '🆘', label: 'Emergency', path: '/emergency' }] },
  { title: 'Discover People', items: [{ icon: '👨‍💼', label: 'Local Guides', path: '/guides' }, { icon: '🤝', label: 'Couch Surfing', path: '/couchsurfing' }] },
  { title: 'My Travel', items: [{ icon: '🏅', label: 'Travel Passport', path: '/passport' }, { icon: '❤️', label: 'Saved Trips', path: '/saved' }, { icon: '📦', label: 'Packing List', path: '/packing' }, { icon: '💰', label: 'Budget Tracker', path: '/budget' }, { icon: '💬', label: 'AI Chat', path: '/chat' }, { icon: '🧠', label: 'Travel IQ', path: '/traveliq' }, { icon: '⚙️', label: 'Settings', path: '/settings' }] },
]

interface Question {
  question: string
  options: string[]
  answer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  isAi?: boolean
}

interface QuizState {
  questions: Question[]
  currentIndex: number
  score: number
  answered: boolean
  selectedAnswer: number | null
  timeLeft: number
  completed: boolean
  streak: number
  xp: number
}

interface QuizHistory {
  date: string
  score: number
  xp: number
  streak: number
}

const CATEGORIES = ['Geography', 'Capitals', 'Landmarks', 'Cuisine', 'Currency', 'Languages', 'UNESCO', 'Visa Free']
const ACHIEVEMENTS = [
  { id: 'first_quiz', name: 'First Steps', desc: 'Complete your first quiz', icon: '🎯', condition: (h: QuizHistory[]) => h.length >= 1 },
  { id: 'streak_3', name: 'Hot Streak', desc: '3 correct in a row', icon: '🔥', condition: (h: QuizHistory[]) => h.some(x => x.streak >= 3) },
  { id: 'perfect', name: 'Perfectionist', desc: 'Get a perfect score', icon: '👑', condition: (h: QuizHistory[]) => h.some(x => x.score === 10) },
  { id: 'xp_100', name: 'XP Hunter', desc: 'Earn 100 XP total', icon: '⭐', condition: (h: QuizHistory[]) => h.reduce((s, x) => s + x.xp, 0) >= 100 },
  { id: 'traveler', name: 'Globe Trotter', desc: 'Answer 50 questions', icon: '🌍', condition: (h: QuizHistory[]) => h.reduce((s, x) => s + x.score, 0) >= 50 },
  { id: 'dedicated', name: 'Dedicated Learner', desc: 'Play 10 quizzes', icon: '📚', condition: (h: QuizHistory[]) => h.length >= 10 },
]

export default function TravelIQ() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/traveliq')
  const [quizState, setQuizState] = useState<QuizState | null>(() => {
    try {
      const data = localStorage.getItem('roamind_traveliq')
      if (data) {
        const parsed = JSON.parse(data)
        if (parsed.streak) {
          const lastDate = new Date(parsed.lastPlayed)
          const today = new Date()
          if (today.getTime() - lastDate.getTime() > 86400000 * 2) {
            parsed.streak = 0
          }
          return { ...parsed, currentIndex: 0, score: 0, answered: false, selectedAnswer: null, timeLeft: 20, completed: false }
        }
      }
    } catch {}
    return null
  })
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('')
  const [toast, setToast] = useState<{message: string, type: string} | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>(() => {
    try {
      const data = localStorage.getItem('roamind_traveliq')
      if (data) {
        const parsed = JSON.parse(data)
        return parsed.history || []
      }
    } catch {}
    return []
  })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [timerDuration, setTimerDuration] = useState(20)
  const [showAchievements, setShowAchievements] = useState(false)
  const [aiQuestions, setAiQuestions] = useState<Question[]>([])
  const [aiLoading, setAiLoading] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const selectAnswer = (index: number) => {
    if (!quizState || quizState.answered) return
    
    const correct = index === quizState.questions[quizState.currentIndex].answer
    const timeBonus = quizState.timeLeft > 15 ? 1.2 : quizState.timeLeft > 10 ? 1.0 : 0.8
    const difficultyPoints = quizState.questions[quizState.currentIndex].difficulty === 'hard' ? 30 : quizState.questions[quizState.currentIndex].difficulty === 'medium' ? 20 : 10
    
    setQuizState(prev => prev ? {
      ...prev,
      answered: true,
      selectedAnswer: index,
      score: prev.score + (correct ? 1 : 0),
      xp: prev.xp + (correct ? Math.round(difficultyPoints * timeBonus) : 0),
      streak: correct ? prev.streak + 1 : 0
    } : null)

    if (correct) {
      setToast({message: 'Correct! +' + Math.round(difficultyPoints * timeBonus) + ' XP', type: 'success'})
    } else {
      setToast({message: 'Wrong! The answer was: ' + quizState.questions[quizState.currentIndex].options[quizState.questions[quizState.currentIndex].answer], type: 'error'})
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => { setUser(u) })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (quizState?.timeLeft && quizState.timeLeft > 0 && !quizState.answered && !quizState.completed) {
      timerRef.current = setTimeout(() => {
        setQuizState(prev => prev ? { ...prev, timeLeft: prev.timeLeft - 1 } : null)
      }, 1000)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [quizState?.timeLeft, quizState?.answered, quizState?.completed])

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t) }
  }, [toast])

  useEffect(() => {
    if (quizState?.timeLeft === 0 && !quizState.answered && !quizState.completed) {
      const timer = setTimeout(() => {
        if (quizState && !quizState.answered) {
          setQuizState(prev => prev ? { ...prev, answered: true, selectedAnswer: -1 } : null)
        }
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [quizState, quizState?.timeLeft, quizState?.answered, quizState?.completed])

  const handleLogout = () => signOut(auth).then(() => router.push('/landing'))
  const nav = (path: string) => { setActivePath(path); router.push(path) }
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Traveler'
  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()

  const totalXP = quizHistory.reduce((s, x) => s + x.xp, 0)
  const totalQuizzes = quizHistory.length
  const avgScore = totalQuizzes > 0 ? (quizHistory.reduce((s, x) => s + x.score, 0) / totalQuizzes).toFixed(1) : 0

  const unlockedAchievements = ACHIEVEMENTS.filter(a => a.condition(quizHistory))

  const generateQuestions = async () => {
    const sampleQuestions: Question[] = [
      { question: 'What is the capital of Japan?', options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'], answer: 2, explanation: 'Tokyo has been Japan\'s capital since 1868.', difficulty: 'easy', category: 'Capitals' },
      { question: 'Which country has the most UNESCO World Heritage Sites?', options: ['China', 'Italy', 'Spain', 'Germany'], answer: 1, explanation: 'Italy has 58 UNESCO sites, the most in the world.', difficulty: 'medium', category: 'UNESCO' },
      { question: 'What is the currency of Brazil?', options: ['Peso', 'Real', 'Sol', 'Guarani'], answer: 1, explanation: 'The Brazilian Real (BRL) has been the official currency since 1994.', difficulty: 'easy', category: 'Currency' },
      { question: 'Which is the smallest country in the world?', options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], answer: 1, explanation: 'Vatican City is only 0.44 sq km - the smallest country.', difficulty: 'easy', category: 'Geography' },
      { question: 'What language is primarily spoken in Morocco?', options: ['Arabic', 'French', 'Spanish', 'Berber'], answer: 0, explanation: 'Arabic is the official language, though French is widely used.', difficulty: 'medium', category: 'Languages' },
      { question: 'Which landmark is in Paris?', options: ['Colosseum', 'Big Ben', 'Eiffel Tower', 'Statue of Liberty'], answer: 2, explanation: 'The Eiffel Tower was built in 1889 and is 330m tall.', difficulty: 'easy', category: 'Landmarks' },
      { question: 'What is the national dish of Japan?', options: ['Kimchi', 'Sushi', 'Pad Thai', 'Pho'], answer: 1, explanation: 'Sushi is Japan\'s most famous culinary export globally.', difficulty: 'easy', category: 'Cuisine' },
      { question: 'Which country allows visa-free entry for most passports?', options: ['Japan', 'Singapore', 'Germany', 'USA'], answer: 1, explanation: 'Singapore offers visa-free entry to 192+ countries.', difficulty: 'hard', category: 'Visa Free' },
      { question: 'What is the largest ocean?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], answer: 2, explanation: 'The Pacific covers 165.2 million square km.', difficulty: 'easy', category: 'Geography' },
      { question: 'Which river is the longest in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], answer: 1, explanation: 'The Nile is 6,650 km long, slightly longer than Amazon.', difficulty: 'medium', category: 'Geography' },
      { question: 'What is the largest desert in the world?', options: ['Sahara', 'Arabian', 'Gobi', 'Antarctic'], answer: 3, explanation: 'Antarctica is technically a desert (less than 50mm rain/year).', difficulty: 'hard', category: 'Geography' },
      { question: 'Which city has the most time zones?', options: ['Paris', 'New York', 'Moscow', 'London'], answer: 2, explanation: 'Russia spans 11 time zones, more than any other country.', difficulty: 'hard', category: 'Geography' },
    ]

    let combined = [...sampleQuestions]
    if (aiQuestions.length > 0) combined = [...combined, ...aiQuestions]
    
    let filtered = combined
    if (categoryFilter) filtered = filtered.filter(q => q.category === categoryFilter)
    if (difficultyFilter) filtered = filtered.filter(q => q.difficulty === difficultyFilter)
    
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10)
    
    setQuizState({
      questions: shuffled,
      currentIndex: 0,
      score: 0,
      answered: false,
      selectedAnswer: null,
      timeLeft: timerDuration,
      completed: false,
      streak: 0,
      xp: 0
    })
  }

  const loadAIQuestions = async () => {
    setAiLoading(true)
    try {
      const promptText = "Generate 5 multiple choice travel trivia questions. Each must have exactly 4 options and one correct answer. Mix easy, medium, hard difficulty. Topics: world geography, landmarks, travel tips, cultures, foods, festivals. Return ONLY a valid JSON array with 5 question objects. Each object must have: question (string), options (array of 4 strings), correct (number 0-3), difficulty (string: easy/medium/hard), explanation (string), category (string)."
      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: promptText }] })
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to load AI questions')
      let parsed: unknown = null
      if (Array.isArray(data.restaurants)) parsed = data.restaurants
      else if (Array.isArray(data)) parsed = data
      else if (data.content) {
        const text = Array.isArray(data.content) ? data.content[0]?.text : String(data.content)
        try { parsed = JSON.parse(text) } catch { parsed = null }
      }
      if (!Array.isArray(parsed)) throw new Error('No questions returned')
      const newQuestions: Question[] = parsed.slice(0, 5).map((q: { question: string; options: string[]; correct?: number; answer?: number; difficulty: string; explanation: string; category: string }) => ({
        question: q.question,
        options: q.options,
        answer: q.correct ?? q.answer ?? 0,
        difficulty: (q.difficulty === 'easy' || q.difficulty === 'medium' || q.difficulty === 'hard' ? q.difficulty : 'medium') as 'easy' | 'medium' | 'hard',
        explanation: q.explanation,
        category: q.category || 'Travel',
        isAi: true
      }))
      setAiQuestions(prev => {
        const combined = [...prev, ...newQuestions]
        setToast({ message: `${newQuestions.length} new AI questions added!`, type: 'success' })
        return combined
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'AI question generation failed'
      setToast({ message: msg, type: 'error' })
    } finally {
      setAiLoading(false)
    }
  }

  const nextQuestion = () => {
    if (!quizState) return
    
    if (quizState.currentIndex >= quizState.questions.length - 1) {
      const newStreak = quizState.streak > 0 ? quizState.streak : 0
      const newHistory: QuizHistory = {
        date: new Date().toISOString(),
        score: quizState.score,
        xp: quizState.xp,
        streak: quizState.streak
      }
      const updatedHistory = [...quizHistory, newHistory]
      
      const data = { ...quizState, completed: true, lastPlayed: new Date().toISOString(), streak: newStreak, history: updatedHistory }
      localStorage.setItem('roamind_traveliq', JSON.stringify(data))
      setQuizHistory(updatedHistory)
      setQuizState(data)
      setToast({message: `Quiz Complete! Score: ${quizState.score}/10, XP: ${quizState.xp}`, type: 'success'})
    } else {
      setQuizState(prev => prev ? { ...prev, currentIndex: prev.currentIndex + 1, answered: false, selectedAnswer: null, timeLeft: timerDuration } : null)
    }
  }

  const getRating = (score: number) => {
    if (score >= 9) return { title: 'World Master', emoji: '👑', color: G }
    if (score >= 7) return { title: 'Globetrotter', emoji: '🌍', color: C }
    if (score >= 5) return { title: 'Explorer', emoji: '🧭', color: GR }
    return { title: 'Backpacker', emoji: '🎒', color: R }
  }

  if (loading) return <div style={{position:'fixed',inset:0,background:BG,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:44,height:44,border:'2px solid rgba(99,210,255,0.15)',borderTopColor:C,borderRadius:'50%',animation:'spin 0.8s linear infinite'}} /></div>

  return (
    <div style={{display:'flex',height:'100vh',background:BG,color:'#fff',fontFamily:"'Outfit',sans-serif",overflow:'hidden'}}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade { animation: fadeIn 0.3s ease; }
      `}</style>

      <Sidebar sidebarOpen={sidebarOpen} activePath={activePath} user={user} onLogout={handleLogout} />

      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{height:62,padding:'0 22px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(99,210,255,0.07)',background:'rgba(0,5,14,0.9)',backdropFilter:'blur(20px)',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{width:34,height:34,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,cursor:'pointer',fontSize:15,color:'#fff'}}>☰</button>
            <div><div style={{fontSize:14,fontWeight:600}}>🧠 Travel IQ Quiz</div><div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>Test your travel knowledge</div></div>
          </div>
          {quizState && (
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <button onClick={() => setShowHistory(!showHistory)} style={{padding:'6px 12px',background:showHistory?C+'20':'rgba(255,255,255,0.05)',border:'1px solid '+C,borderRadius:8,color:C,fontSize:12,cursor:'pointer'}}>📊 History</button>
              <button onClick={() => setShowAchievements(!showAchievements)} style={{padding:'6px 12px',background:showAchievements?PURPLE+'20':'rgba(255,255,255,0.05)',border:'1px solid '+PURPLE,borderRadius:8,color:PURPLE,fontSize:12,cursor:'pointer'}}>🏆 Achievements</button>
              <div style={{display:'flex',alignItems:'center',gap:6,padding:'6px 12px',background:BG3,borderRadius:20}}><span>🔥</span><span style={{fontSize:14,fontWeight:600}}>{quizState.streak}</span></div>
              <div style={{display:'flex',alignItems:'center',gap:6,padding:'6px 12px',background:BG3,borderRadius:20}}><span style={{color:G}}>⭐</span><span style={{fontSize:14,fontWeight:600}}>{quizState.xp} XP</span></div>
            </div>
          )}
        </div>

        <div style={{flex:1,overflowY:'auto',padding:'20px 22px'}}>
          {/* STATS BAR */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
            <div style={{background:BG2,padding:16,borderRadius:12,textAlign:'center'}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>Total XP</div>
              <div style={{fontSize:20,fontWeight:700,color:G}}>{totalXP}</div>
            </div>
            <div style={{background:BG2,padding:16,borderRadius:12,textAlign:'center'}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>Quizzes</div>
              <div style={{fontSize:20,fontWeight:700,color:C}}>{totalQuizzes}</div>
            </div>
            <div style={{background:BG2,padding:16,borderRadius:12,textAlign:'center'}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>Avg Score</div>
              <div style={{fontSize:20,fontWeight:700,color:GR}}>{avgScore}/10</div>
            </div>
            <div style={{background:BG2,padding:16,borderRadius:12,textAlign:'center'}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>Achievements</div>
              <div style={{fontSize:20,fontWeight:700,color:PURPLE}}>{unlockedAchievements.length}/{ACHIEVEMENTS.length}</div>
            </div>
          </div>

          {/* ACHIEVEMENTS PANEL */}
          {showAchievements && (
            <div style={{marginBottom:20,background:BG2,borderRadius:14,padding:16,border:`1px solid ${PURPLE}`}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>🏆 Achievements</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                {ACHIEVEMENTS.map(ach => {
                  const unlocked = ach.condition(quizHistory)
                  return (
                    <div key={ach.id} style={{padding:12,background:unlocked?PURPLE+'20':BG3,border:`1px solid ${unlocked?PURPLE:'rgba(255,255,255,0.1)'}`,borderRadius:10,textAlign:'center',opacity:unlocked?1:0.4}}>
                      <div style={{fontSize:24,marginBottom:4}}>{ach.icon}</div>
                      <div style={{fontSize:12,fontWeight:600}}>{ach.name}</div>
                      <div style={{fontSize:10,color:'rgba(255,255,255,0.5)'}}>{ach.desc}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* HISTORY PANEL */}
          {showHistory && quizHistory.length > 0 && (
            <div style={{marginBottom:20,background:BG2,borderRadius:14,padding:16,border:`1px solid ${C}`}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>📊 Quiz History</div>
              <div style={{maxHeight:200,overflowY:'auto'}}>
                {quizHistory.slice().reverse().map((h, i) => (
                  <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <span style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>{new Date(h.date).toLocaleDateString()}</span>
                    <span style={{fontSize:12}}>Score: {h.score}/10</span>
                    <span style={{fontSize:12,color:G}}>+{h.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!quizState || quizState.completed ? (
            <div style={{maxWidth:500,margin:'0 auto',textAlign:'center'}}>
              {quizState?.completed && (
                <div style={{background:BG2,padding:30,borderRadius:20,marginBottom:30,border:`2px solid ${getRating(quizState.score).color}`,animation:'fadeIn 0.5s ease'}}>
                  <div style={{fontSize:64,marginBottom:16}}>{getRating(quizState.score).emoji}</div>
                  <div style={{fontSize:24,fontWeight:700,color:getRating(quizState.score).color}}>{getRating(quizState.score).title}</div>
                  <div style={{fontSize:48,fontWeight:800,color:C,margin:'16px 0'}}>{quizState.score}/10</div>
                  <div style={{color:'rgba(255,255,255,0.6)'}}>XP Earned: {quizState.xp}</div>
                </div>
              )}
              
              {/* FILTERS */}
              <div style={{background:BG2,padding:24,borderRadius:16,marginBottom:20}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:16}}>
                  <div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Category</div>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{width:'100%',padding:'12px',background:BG3,border:'1px solid rgba(99,210,255,0.2)',borderRadius:10,color:'#fff',fontSize:14}}>
                      <option value="">All</option>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Difficulty</div>
                    <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} style={{width:'100%',padding:'12px',background:BG3,border:'1px solid rgba(99,210,255,0.2)',borderRadius:10,color:'#fff',fontSize:14}}>
                      <option value="">All</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Timer</div>
                    <select value={timerDuration} onChange={(e) => setTimerDuration(parseInt(e.target.value))} style={{width:'100%',padding:'12px',background:BG3,border:'1px solid rgba(99,210,255,0.2)',borderRadius:10,color:'#fff',fontSize:14}}>
                      <option value={10}>10s</option>
                      <option value={15}>15s</option>
                      <option value={20}>20s</option>
                      <option value={30}>30s</option>
                    </select>
                  </div>
                </div>
                
                <label style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,cursor:'pointer',marginBottom:16}}>
                  <input type="checkbox" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />
                  <span style={{fontSize:13}}>Sound Effects</span>
                </label>

                {aiQuestions.length > 0 && (
                  <div style={{fontSize:12,color:GR,marginBottom:10,textAlign:'center'}}>
                    🎲 {aiQuestions.length} AI question{aiQuestions.length > 1 ? 's' : ''} in pool — mixed with built-in questions
                  </div>
                )}
                
                <div style={{display:'flex',gap:10}}>
                  <button
                    onClick={loadAIQuestions}
                    disabled={aiLoading}
                    style={{flex:'0 0 auto',padding:'12px 16px',background:aiLoading ? BG3 : `${GR}18`,border:`1px solid ${GR}44`,borderRadius:12,color:GR,fontSize:13,fontWeight:600,cursor:aiLoading?'wait':'pointer',display:'flex',alignItems:'center',gap:8,opacity:aiLoading?0.7:1}}
                  >
                    {aiLoading ? (
                      <><span style={{display:'inline-block',width:12,height:12,border:'2px solid rgba(81,207,102,0.3)',borderTopColor:GR,borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>Loading…</>
                    ) : (
                      <><span>🎲</span>Load AI Questions</>
                    )}
                  </button>
                  <button onClick={generateQuestions} style={{flex:1,padding:'18px',background:`linear-gradient(135deg, ${C}, #3b9fd4)`,border:'none',borderRadius:14,color:BG,fontSize:16,fontWeight:700,cursor:'pointer'}}>
                    {quizState?.completed ? 'Play Again' : 'Start Quiz'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{maxWidth:600,margin:'0 auto'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
                <div style={{fontSize:14,color:'rgba(255,255,255,0.6)'}}>Question {quizState.currentIndex + 1} of {quizState.questions.length}</div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:quizState.timeLeft <= 5 ? R : BG3,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:quizState.timeLeft <= 5 ? '#fff' : C}}>
                    {quizState.timeLeft}
                  </div>
                </div>
              </div>
              
              <div style={{height:6,background:BG3,borderRadius:3,marginBottom:30,overflow:'hidden'}}>
                <div style={{width:`${((quizState.currentIndex + 1) / quizState.questions.length) * 100}%`,height:'100%',background:C,transition:'width 0.3s'}} />
              </div>
              
              <div style={{background:BG2,padding:24,borderRadius:16,marginBottom:24}}>
                <div style={{fontSize:18,fontWeight:600,lineHeight:1.5}}>{quizState.questions[quizState.currentIndex].question}</div>
                <div style={{display:'flex',gap:8,marginTop:12}}>
                  <span style={{fontSize:11,padding:'4px 8px',background:BG3,borderRadius:4,color:'rgba(255,255,255,0.6)'}}>{quizState.questions[quizState.currentIndex].category}</span>
                  <span style={{fontSize:11,padding:'4px 8px',background:quizState.questions[quizState.currentIndex].difficulty === 'hard' ? R+'30' : quizState.questions[quizState.currentIndex].difficulty === 'medium' ? G+'30' : C+'30',borderRadius:4,color:quizState.questions[quizState.currentIndex].difficulty === 'hard' ? R : quizState.questions[quizState.currentIndex].difficulty === 'medium' ? G : C,textTransform:'capitalize'}}>{quizState.questions[quizState.currentIndex].difficulty}</span>
                  {quizState.questions[quizState.currentIndex].isAi && (
                    <span style={{fontSize:11,padding:'4px 8px',background:`${PURPLE}30`,border:`1px solid ${PURPLE}60`,borderRadius:4,color:PURPLE,fontWeight:600}}>AI</span>
                  )}
                </div>
              </div>
              
              <div style={{display:'grid',gap:12}}>
                {quizState.questions[quizState.currentIndex].options.map((option, i) => {
                  const isCorrect = i === quizState.questions[quizState.currentIndex].answer
                  const isSelected = i === quizState.selectedAnswer
                  let bg = BG2
                  let border = '1px solid rgba(255,255,255,0.08)'
                  if (quizState.answered) {
                    if (isCorrect) { bg = GR+'30'; border = `1px solid ${GR}` }
                    else if (isSelected) { bg = R+'30'; border = `1px solid ${R}` }
                  }
                  return (
                    <button key={i} onClick={() => selectAnswer(i)} disabled={quizState.answered} style={{padding:'16px 20px',background:bg,border,borderRadius:12,cursor:quizState.answered?'default':'pointer',textAlign:'left',color:'#fff',fontSize:15,transition:'all 0.2s'}}>
                      <span style={{marginRight:12,opacity:0.5}}>{String.fromCharCode(65 + i)}.</span>
                      {option}
                    </button>
                  )
                })}
              </div>
              
              {quizState.answered && (
                <div style={{marginTop:20,padding:16,background:BG2,borderRadius:12,border:`1px solid ${quizState.selectedAnswer === quizState.questions[quizState.currentIndex].answer ? GR : R}`}}>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:8}}>{quizState.selectedAnswer === quizState.questions[quizState.currentIndex].answer ? '✅ Correct!' : '❌ Incorrect'}</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.7)'}}>{quizState.questions[quizState.currentIndex].explanation}</div>
                  <button onClick={nextQuestion} style={{marginTop:16,width:'100%',padding:'12px',background:C,border:'none',borderRadius:8,color:BG,fontWeight:600,cursor:'pointer'}}>
                    {quizState.currentIndex >= quizState.questions.length - 1 ? 'See Results' : 'Next Question'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {toast && <div style={{position:'fixed',bottom:20,right:20,background:toast.type === 'error' ? R : toast.type === 'success' ? GR : C,color:toast.type === 'success' ? BG : '#fff',padding:'12px 20px',borderRadius:10,fontWeight:500,zIndex:2000}}>{toast.message}</div>}
    </div>
  )
}
