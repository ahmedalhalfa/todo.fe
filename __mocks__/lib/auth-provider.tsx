import React from 'react'

export interface User {
  email: string
  firstName?: string
  lastName?: string
}

// Mock state
const mockState: { user: User | null } = { user: null }

// Create a default mock auth context
const createMockAuthContext = () => ({
  user: mockState.user,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  logoutAll: jest.fn(),
  loading: false,
})

// Create the context
const AuthContext = React.createContext(createMockAuthContext())

// Export the hook to access the context
export const useAuth = () => React.useContext(AuthContext)

// Export a provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={createMockAuthContext()}>
      {children}
    </AuthContext.Provider>
  )
}

// Method to update the mock user for tests
export const __setMockUser = (user: User | null) => {
  mockState.user = user
} 