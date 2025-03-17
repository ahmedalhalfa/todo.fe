'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error boundary caught error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="max-w-md w-full rounded-lg border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Application Error</h2>
            </div>
            <p className="text-muted-foreground">
              {process.env.NODE_ENV === 'development' 
                ? error.message 
                : 'A critical error occurred. Our team has been notified.'}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground">
                Error ID: {error.digest}
              </p>
            )}
            <Button
              onClick={() => reset()}
              className="w-full"
            >
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
} 