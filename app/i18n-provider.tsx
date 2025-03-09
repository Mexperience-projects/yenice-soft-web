"use client"

import type { ReactNode } from "react"
import "../lib/i18n/i18n" // Import i18n configuration

export function ClientI18nProvider({ children }: { children: ReactNode }) {
  // This component doesn't do anything special except ensuring i18n is only loaded on the client
  return <>{children}</>
}

