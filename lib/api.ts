import axios from "axios"

// Create an axios instance with default config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
})

// Types for API responses
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ErrorResponse {
  message: string
  statusCode: number
}

// Todo types
export interface Todo {
  _id: string
  title: string
  description?: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTodoDto {
  title: string
  description?: string
  completed?: boolean
}

export interface UpdateTodoDto {
  title?: string
  description?: string
  completed?: boolean
}

// Auth types
export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface RefreshTokenDto {
  refreshToken: string
}

// API functions for todos
export const todoApi = {
  getAll: async (): Promise<Todo[]> => {
    const response = await api.get<Todo[]>("/todos")
    return response.data
  },

  getById: async (id: string): Promise<Todo> => {
    const response = await api.get<Todo>(`/todos/${id}`)
    return response.data
  },

  create: async (todo: CreateTodoDto): Promise<Todo> => {
    const response = await api.post<Todo>("/todos", todo)
    return response.data
  },

  update: async (id: string, todo: UpdateTodoDto): Promise<Todo> => {
    const response = await api.put<Todo>(`/todos/${id}`, todo)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`)
  },
}

// API functions for auth
export const authApi = {
  login: async (credentials: LoginDto): Promise<AuthTokens> => {
    const response = await api.post<AuthTokens>("/auth/login", credentials)
    return response.data
  },

  register: async (userData: RegisterDto): Promise<AuthTokens> => {
    const response = await api.post<AuthTokens>("/auth/register", userData)
    return response.data
  },

  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await api.post<AuthTokens>("/auth/refresh", { refreshToken })
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout")
  },

  logoutAll: async (): Promise<void> => {
    await api.post("/auth/logout-all")
  },
}

