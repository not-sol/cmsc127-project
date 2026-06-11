import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "@/styles/index.css"
import App from "./App.tsx"
import { ToastProvider } from "@/components/ui/toast"
// import { ThemeProvider } from "@/components/theme-provider.tsx"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider> */}
      <ToastProvider>
        <App />
      </ToastProvider>
      {/* </ThemeProvider> */}
    </QueryClientProvider>
  </StrictMode>
)
