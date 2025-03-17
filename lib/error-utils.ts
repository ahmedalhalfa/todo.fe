import { toast } from "@/components/ui/use-toast"

// Error types
export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}

export class AppError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(message: string, status = 500, errors?: Record<string, string[]>) {
    super(message)
    this.name = "AppError"
    this.status = status
    this.errors = errors
  }
}

// Function to handle API errors
export function handleApiError(error: unknown): ApiError {
  console.error("API Error:", error)

  if (error instanceof AppError) {
    return {
      status: error.status,
      message: error.message,
      errors: error.errors
    }
  }

  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message
    }
  }

  return {
    status: 500,
    message: "An unexpected error occurred"
  }
}

// Function to show toast notifications for errors
export function showErrorToast(error: unknown) {
  if (error instanceof AppError) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    })
    return
  }

  if (error instanceof Error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    })
    return
  }

  toast({
    title: "Error",
    description: "An unexpected error occurred",
    variant: "destructive",
  })
}

// Function to parse axios error responses
export function parseAxiosError(error: any): ApiError {
  const response = error.response
  
  if (response?.data) {
    return {
      status: response.status || 500,
      message: response.data.message || "An error occurred",
      errors: response.data.errors
    }
  }
  
  if (error.message === "Network Error") {
    return {
      status: 0,
      message: "Cannot connect to server. Please check your internet connection."
    }
  }

  return {
    status: 500,
    message: error.message || "An unexpected error occurred"
  }
} 