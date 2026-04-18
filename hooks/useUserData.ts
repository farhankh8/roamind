'use client'
import { useState, useEffect, useCallback } from 'react'
import { where, orderBy } from 'firebase/firestore'
import { dbUtils, BaseDocument } from '@/lib/db'
import { useAuth } from '@/context/AuthContext'

interface UserSettings extends BaseDocument {
  displayName: string
  avatar: string
  homeCurrency: string
  language: string
  theme: string
}

interface SavedTrip extends BaseDocument {
  destination: string
  dates: string
  budget: number
  notes: string
  imageUrl?: string
}

interface BudgetData extends BaseDocument {
  total: number
  expenses: Array<{
    id: string
    amount: number
    category: string
    description: string
    date: string
  }>
}

export function useUserSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await dbUtils.getDocument<UserSettings>('settings', user.uid)
      setSettings(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }, [user])

  const saveSettings = useCallback(async (data: Partial<UserSettings>) => {
    if (!user) return
    try {
      await dbUtils.setDocument('settings', user.uid, data)
      await fetchSettings()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save settings')
    }
  }, [user, fetchSettings])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return { settings, loading, error, saveSettings, refetch: fetchSettings }
}

export function useSavedTrips() {
  const { user } = useAuth()
  const [trips, setTrips] = useState<SavedTrip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrips = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await dbUtils.getCollection<SavedTrip>(
        'trips',
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      setTrips(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load trips')
    } finally {
      setLoading(false)
    }
  }, [user])

  const saveTrip = useCallback(async (trip: Omit<SavedTrip, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return
    try {
      const tripId = `trip_${Date.now()}`
      await dbUtils.setDocument('trips', tripId, { ...trip, userId: user.uid })
      await fetchTrips()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save trip')
    }
  }, [user, fetchTrips])

  const deleteTrip = useCallback(async (tripId: string) => {
    try {
      await dbUtils.deleteDocument('trips', tripId)
      await fetchTrips()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete trip')
    }
  }, [fetchTrips])

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  return { trips, loading, error, saveTrip, deleteTrip, refetch: fetchTrips }
}

export function useBudget() {
  const { user } = useAuth()
  const [budget, setBudget] = useState<BudgetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBudget = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await dbUtils.getDocument<BudgetData>('budgets', user.uid)
      setBudget(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load budget')
    } finally {
      setLoading(false)
    }
  }, [user])

  const saveBudget = useCallback(async (data: Partial<BudgetData>) => {
    if (!user) return
    try {
      await dbUtils.updateDocument('budgets', user.uid, data)
      await fetchBudget()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save budget')
    }
  }, [user, fetchBudget])

  const addExpense = useCallback(async (expense: BudgetData['expenses'][0]) => {
    if (!user || !budget) return
    try {
      await dbUtils.updateDocument('budgets', user.uid, {
        expenses: [...budget.expenses, expense],
        total: budget.total + expense.amount
      })
      await fetchBudget()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add expense')
    }
  }, [user, budget, fetchBudget])

  useEffect(() => {
    fetchBudget()
  }, [fetchBudget])

  return { budget, loading, error, saveBudget, addExpense, refetch: fetchBudget }
}