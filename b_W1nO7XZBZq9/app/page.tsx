"use client"

import { useState } from "react"
import { Onboarding, type OnboardingSettings } from "@/components/texture-manager/onboarding"
import { Dashboard } from "@/components/texture-manager/dashboard"

export default function TextureManagerPage() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [settings, setSettings] = useState<OnboardingSettings | null>(null)

  const handleOnboardingComplete = (onboardingSettings: OnboardingSettings) => {
    setSettings(onboardingSettings)
    setShowDashboard(true)
  }

  if (showDashboard && settings) {
    return <Dashboard initialSettings={settings} />
  }

  return <Onboarding onComplete={handleOnboardingComplete} />
}
