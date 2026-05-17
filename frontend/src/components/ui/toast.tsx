import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

type ToastVariant = "success" | "error" | "info"

type ToastInput = {
  title: string
  description?: string
  variant?: ToastVariant
}

type ToastItem = ToastInput & {
  id: number
}

type ToastContextValue = {
  toast: (input: ToastInput) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

const variantClasses: Record<ToastVariant, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  info: "border-border bg-background text-foreground",
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const toast = React.useCallback((input: ToastInput) => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, variant: "info", ...input }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id))
    }, 4500)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {typeof document !== "undefined"
        ? createPortal(
            <div className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
              {toasts.map((item) => (
                <div
                  key={item.id}
                  role="status"
                  className={cn(
                    "rounded-lg border px-4 py-3 shadow-lg",
                    variantClasses[item.variant ?? "info"]
                  )}
                >
                  <p className="text-sm font-semibold">{item.title}</p>
                  {item.description ? (
                    <p className="mt-1 text-sm opacity-85">{item.description}</p>
                  ) : null}
                </div>
              ))}
            </div>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }

  return context
}
