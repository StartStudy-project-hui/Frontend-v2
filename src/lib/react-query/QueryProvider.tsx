import React from 'react'
import axios from 'axios'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

import { toast } from '@/hooks/use-toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      throwOnError(error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            toast({
              title: `${error.response.data.message}`,
            })
          }
        }
        return false
      },
    },
    mutations: {
      throwOnError(error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            toast({
              title: `${error.response.data.message}`,
            })
          }
        }
        return false
      },
    },
  },
})

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
