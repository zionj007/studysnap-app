import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isPro: false,
    plan: null,
    usage: {
      quizzesToday: 0,
      quizzesThisMonth: 0,
      lastResetDate: new Date().toDateString()
    }
  })

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('studysnap-user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing saved user data:', error)
      }
    }
  }, [])

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('studysnap-user', JSON.stringify(user))
  }, [user])

  // Reset daily usage if it's a new day
  useEffect(() => {
    const today = new Date().toDateString()
    if (user.usage.lastResetDate !== today) {
      setUser(prev => ({
        ...prev,
        usage: {
          ...prev.usage,
          quizzesToday: 0,
          lastResetDate: today
        }
      }))
    }
  }, [user.usage.lastResetDate])

  const upgradeToPro = (plan) => {
    setUser(prev => ({
      ...prev,
      isPro: true,
      plan: plan
    }))
  }

  const downgradeToFree = () => {
    setUser(prev => ({
      ...prev,
      isPro: false,
      plan: null
    }))
  }

  const incrementQuizUsage = () => {
    setUser(prev => ({
      ...prev,
      usage: {
        ...prev.usage,
        quizzesToday: prev.usage.quizzesToday + 1,
        quizzesThisMonth: prev.usage.quizzesThisMonth + 1
      }
    }))
  }

  const canGenerateQuiz = () => {
    if (user.isPro) return true
    return user.usage.quizzesToday < 2 // Free plan: 2 generations per week
  }

  const getRemainingQuizzes = () => {
    if (user.isPro) return 'Unlimited'
    return Math.max(0, 2 - user.usage.quizzesToday) // Free plan: 2 generations per week
  }

  const value = {
    user,
    upgradeToPro,
    downgradeToFree,
    incrementQuizUsage,
    canGenerateQuiz,
    getRemainingQuizzes
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
