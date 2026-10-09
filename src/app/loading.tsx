export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-screen items-center justify-center bg-paper">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-accent" aria-hidden />
      <span className="sr-only">Loading</span>
    </div>
  )
}
