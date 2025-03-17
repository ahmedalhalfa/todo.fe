import { render, screen } from '@testing-library/react'
import Navbar from '../../components/navbar'
import * as AuthProvider from '../../lib/auth-provider'

// Mock the AuthContext
jest.mock('../../lib/auth-provider', () => {
  const original = jest.requireActual('../../lib/auth-provider')
  return {
    ...original,
    useAuth: jest.fn()
  }
})

describe('Navbar component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('renders navbar with login links when not authenticated', () => {
    // Mock unauthenticated user
    const mockUseAuth = AuthProvider.useAuth as jest.Mock
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false
    })
    
    render(<Navbar />)
    
    expect(screen.getByText(/login/i)).toBeInTheDocument()
    expect(screen.getByText(/register/i)).toBeInTheDocument()
    expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument()
  })
  
  it('renders navbar with dashboard links when authenticated', () => {
    // Mock authenticated user
    const mockUseAuth = AuthProvider.useAuth as jest.Mock
    mockUseAuth.mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      isAuthenticated: true
    })
    
    render(<Navbar />)
    
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/register/i)).not.toBeInTheDocument()
  })
}) 