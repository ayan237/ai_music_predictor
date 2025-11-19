'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-dark-primary px-4">
          <div className="max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Something went wrong!</h2>
            <p className="text-gray-400 mb-6">
              An unexpected error occurred. Please refresh the page.
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}

