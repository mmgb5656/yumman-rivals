"use client"

import { useState } from "react"
import { HomeView } from "@/components/texture-manager/home"
import { SettingsView } from "@/components/texture-manager/settings-view"

export default function Page() {
  const [view, setView] = useState<"home" | "settings">("home")
  const api = typeof window !== "undefined" ? (window as any).electronAPI : null

  const goSettings = () => {
    api?.resizeWindow?.("settings")
    setView("settings")
  }

  const goHome = () => {
    api?.resizeWindow?.("home")
    setView("home")
  }

  if (view === "settings") {
    return <SettingsView onBack={goHome} />
  }

  return <HomeView onSettings={goSettings} />
}
