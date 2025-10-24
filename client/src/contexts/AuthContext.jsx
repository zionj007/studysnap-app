import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('studysnap_user')
    const savedToken = localStorage.getItem('studysnap_token')
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser))
        setToken(savedToken)
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        // Clear invalid data
        localStorage.removeItem('studysnap_user')
        localStorage.removeItem('studysnap_token')
      }
    }
    
    setIsLoading(false)
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('studysnap_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('studysnap_user')
    }
  }, [user])

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('studysnap_token', token)
    } else {
      localStorage.removeItem('studysnap_token')
    }
  }, [token])

  const login = (userData, userToken) => {
    console.log('AuthContext: Login called with:', userData)
    setUser(userData)
    setToken(userToken)
  }

  const logout = async () => {
    try {
      // Call logout API if token exists
      if (token) {
        const getApiUrl = () => {
          if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3001'
          }
          return 'https://studysnap-app.onrender.com'
        }

        await fetch(`${getApiUrl()}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Clear local state regardless of API call success
      setUser(null)
      setToken(null)
    }
  }

  const register = (userData, userToken) => {
    console.log('AuthContext: Register called with:', userData)
    setUser(userData)
    setToken(userToken)
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
  }

  const isAuthenticated = () => {
    return user !== null && token !== null
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const isPro = () => {
    return user?.isPro === true || user?.role === 'admin'
  }

  const getAuthHeaders = () => {
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    }
    return {
      'Content-Type': 'application/json',
    }
  }

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    register,
    updateUser,
    isAuthenticated,
    isAdmin,
    isPro,
    getAuthHeaders
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
