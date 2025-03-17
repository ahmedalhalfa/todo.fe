"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export interface User {
  email: string
  firstName?: string
  lastName?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("user")
      const accessToken = localStorage.getItem("accessToken")
      const refreshToken = localStorage.getItem("refreshToken")

      if (storedUser && accessToken) {
        try {
          setUser(JSON.parse(storedUser))

          // Set the authorization header for all future requests
          api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`

          // Check if token is expired and refresh if needed
          const tokenData = JSON.parse(atob(accessToken.split(".")[1]))
          const expiresAt = tokenData.exp * 1000

          if (Date.now() >= expiresAt && refreshToken) {
            await refreshAccessToken(refreshToken)
          }
        } catch (error) {
          console.error("Failed to restore auth state:", error)
          clearAuthData()
        }
      }

      setLoading(false)
    }

    initAuth()
  }, [])

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    const protectedRoutes = ["/dashboard", "/profile", "/todos/create", "/todos/edit"]
    const authRoutes = ["/login", "/register"]

    if (!loading) {
      // Redirect authenticated users away from auth pages
      if (user && authRoutes.some((route) => pathname.startsWith(route))) {
        router.push("/dashboard")
      }

      // Redirect unauthenticated users away from protected pages
      if (!user && protectedRoutes.some((route) => pathname.startsWith(route))) {
        router.push("/login")
      }
    }
  }, [user, loading, pathname, router])

  const saveAuthData = (userData: User, tokens: AuthTokens) => {
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("accessToken", tokens.accessToken)
    localStorage.setItem("refreshToken", tokens.refreshToken)

    // Set the authorization header for all future requests
    api.defaults.headers.common["Authorization"] = `Bearer ${tokens.accessToken}`

    setUser(userData)
  }

  const clearAuthData = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")

    // Remove the authorization header
    delete api.defaults.headers.common["Authorization"]

    setUser(null)
  }

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const response = await api.post("/auth/refresh", { refreshToken })

      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken)
        localStorage.setItem("refreshToken", response.data.refreshToken)

        // Update the authorization header
        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`

        return true
      }

      return false
    } catch (error) {
      console.error("Failed to refresh token:", error)
      clearAuthData()
      return false
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true)
      const response = await api.post("/auth/register", userData)

      if (response.data.accessToken) {
        const user: User = {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        }

        saveAuthData(user, {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })

        toast({
          title: "Registration successful",
          description: "Your account has been created successfully.",
        })

        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Registration failed:", error)

      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "An error occurred during registration.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await api.post("/auth/login", { email, password })

      if (response.data.accessToken) {
        // Extract user info from token or use email
        const tokenData = JSON.parse(atob(response.data.accessToken.split(".")[1]))

        const user: User = {
          email: tokenData.email || email,
          firstName: tokenData.firstName,
          lastName: tokenData.lastName,
        }

        saveAuthData(user, {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })

        toast({
          title: "Login successful",
          description: "You have been logged in successfully.",
        })

        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Login failed:", error)

      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid email or password.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await api.post("/auth/logout")

      clearAuthData()

      toast({
        title: "Logout successful",
        description: "You have been logged out successfully.",
      })

      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)

      // Even if the API call fails, we should still clear local auth data
      clearAuthData()
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const logoutAll = async () => {
    try {
      setLoading(true)
      await api.post("/auth/logout-all")

      clearAuthData()

      toast({
        title: "Logout successful",
        description: "You have been logged out from all devices.",
      })

      router.push("/login")
    } catch (error) {
      console.error("Logout from all devices failed:", error)

      // Even if the API call fails, we should still clear local auth data
      clearAuthData()
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  // Set up axios interceptor for token refresh
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // If the error is 401 and we haven't already tried to refresh the token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          const refreshToken = localStorage.getItem("refreshToken")

          if (refreshToken) {
            const refreshed = await refreshAccessToken(refreshToken)

            if (refreshed) {
              // Retry the original request with the new token
              const accessToken = localStorage.getItem("accessToken")
              originalRequest.headers["Authorization"] = `Bearer ${accessToken}`
              return api(originalRequest)
            }
          }

          // If we couldn't refresh the token, clear auth data and redirect to login
          clearAuthData()
          router.push("/login")
        }

        return Promise.reject(error)
      },
    )

    return () => {
      api.interceptors.response.eject(responseInterceptor)
    }
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        logoutAll,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

