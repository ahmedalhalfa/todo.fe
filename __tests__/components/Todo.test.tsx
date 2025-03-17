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
  
  test('renders incomplete todo with X icon', () => {
    render(<Todo {...mockTodo} />)
    
    expect(screen.getByTestId('x-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument()
  })
  
  test('renders completed todo with check icon', () => {
    render(<Todo {...mockTodo} completed={true} />)
    
    expect(screen.getByTestId('check-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument()
  })
  
  test('calls onToggleStatus when status button is clicked', () => {
    render(<Todo {...mockTodo} />)
    
    const toggleButton = screen.getByRole('button', { name: /Mark as complete/i })
    fireEvent.click(toggleButton)
    
    expect(mockTodo.onToggleStatus).toHaveBeenCalledWith('1')
  })
  
  test('has an edit link with the correct href', () => {
    render(<Todo {...mockTodo} />)
    
    const editLink = screen.getByRole('link', { name: /Edit/i })
    expect(editLink).toHaveAttribute('href', '/todos/edit/1')
  })
  
  test('shows delete confirmation dialog when delete button is clicked', () => {
    render(<Todo {...mockTodo} />)
    
    // Open delete dialog
    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    fireEvent.click(deleteButton)
    
    // Check dialog content
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
    expect(screen.getByText('This action cannot be undone. This will permanently delete the todo.')).toBeInTheDocument()
  })
  
  test('calls onDelete when delete is confirmed', () => {
    render(<Todo {...mockTodo} />)
    
    // Open delete dialog
    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    fireEvent.click(deleteButton)
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Delete/i, exact: true })
    fireEvent.click(confirmButton)
    
    expect(mockTodo.onDelete).toHaveBeenCalledWith('1')
  })
}) 