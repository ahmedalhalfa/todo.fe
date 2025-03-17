import axios from "axios"
import { parseAxiosError, AppError, ApiError } from "./error-utils"

// Create an axios instance with default config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
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
  id?: string  // Some APIs might return id instead of _id
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
  access_token: string
  refresh_token: string
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

// Setup global error handling for axios
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    const parsedError = parseAxiosError(error);
    
    // Convert to our AppError for consistent error handling
    const appError = new AppError(
      parsedError.message,
      parsedError.status,
      parsedError.errors
    );
    
    // Log the error for debugging
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: parsedError.status,
      message: parsedError.message,
      errors: parsedError.errors
    });
    
    return Promise.reject(appError);
  }
);

// Wrap API calls in try/catch with error handling
const createApiMethod = <T>(
  apiCall: () => Promise<T>,
  errorMessage: string = "An error occurred"
): Promise<T> => {
  return apiCall().catch((error) => {
    // If it's already our AppError, just rethrow it
    if (error instanceof AppError) {
      throw error;
    }
    
    // Otherwise, create a new AppError with the provided message
    throw new AppError(
      error.message || errorMessage,
      error.status || 500,
      error.errors
    );
  });
};

// API functions for todos
export const todoApi = {
  getAll: async (): Promise<Todo[]> => {
    return createApiMethod(
      async () => {
        const response = await api.get<Todo[]>("/todos");
        return response.data;
      },
      "Failed to fetch todos"
    );
  },

  getById: async (id: string): Promise<Todo> => {
    return createApiMethod(
      async () => {
        const response = await api.get<Todo>(`/todos/${id}`);
        return response.data;
      },
      `Failed to fetch todo with ID ${id}`
    );
  },

  create: async (todo: CreateTodoDto): Promise<Todo> => {
    return createApiMethod(
      async () => {
        const response = await api.post<Todo>("/todos", todo);
        return response.data;
      },
      "Failed to create todo"
    );
  },

  update: async (id: string, todo: UpdateTodoDto): Promise<Todo> => {
    return createApiMethod(
      async () => {
        const response = await api.put<Todo>(`/todos/${id}`, todo);
        return response.data;
      },
      `Failed to update todo with ID ${id}`
    );
  },

  delete: async (id: string): Promise<void> => {
    return createApiMethod(
      async () => {
        await api.delete(`/todos/${id}`);
      },
      `Failed to delete todo with ID ${id}`
    );
  },
};

// API functions for auth
export const authApi = {
  login: async (credentials: LoginDto): Promise<AuthTokens> => {
    return createApiMethod(
      async () => {
        const response = await api.post<AuthTokens>("/auth/login", credentials);
        return response.data;
      },
      "Login failed. Please check your credentials."
    );
  },

  register: async (userData: RegisterDto): Promise<AuthTokens> => {
    return createApiMethod(
      async () => {
        const response = await api.post<AuthTokens>("/auth/register", userData);
        return response.data;
      },
      "Registration failed. Please try again."
    );
  },

  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    return createApiMethod(
      async () => {
        const response = await api.post<AuthTokens>("/auth/refresh", { refreshToken });
        return response.data;
      },
      "Failed to refresh authentication. Please log in again."
    );
  },

  logout: async (): Promise<void> => {
    return createApiMethod(
      async () => {
        await api.post("/auth/logout");
      },
      "Failed to log out"
    );
  },

  logoutAll: async (): Promise<void> => {
    return createApiMethod(
      async () => {
        await api.post("/auth/logout-all");
      },
      "Failed to log out from all devices"
    );
  },
};

