import { render, screen, fireEvent } from '@testing-library/react'
import Todo from '../../components/Todo'

// Mock the next/link component
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Todo component', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    description: 'This is a test todo',
    completed: false,
    createdAt: '2023-01-01T00:00:00.000Z',
    onToggleStatus: jest.fn(),
    onDelete: jest.fn()
  }
  
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  test('renders todo with correct title and description', () => {
    render(<Todo {...mockTodo} />)
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument()
    expect(screen.getByText('This is a test todo')).toBeInTheDocument()
    expect(screen.getByText(/Created on Jan 1, 2023/)).toBeInTheDocument()
  })
  
  test('calls onToggleStatus when status button is clicked', () => {
    render(<Todo {...mockTodo} />)
    
    const statusButton = screen.getByRole('button', { name: /Mark as complete/i })
    fireEvent.click(statusButton)
    
    expect(mockTodo.onToggleStatus).toHaveBeenCalledWith('1')
  })
}) 