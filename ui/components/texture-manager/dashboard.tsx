"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Cloud,
  Moon,
  Heart,
  HelpCircle,
  Settings,
  Check,
  ExternalLink,
  Play,
  Globe,
} from "lucide-react"
import type { OnboardingSettings } from "./onboarding"
import { skyboxes } from "@/lib/skyboxes"
import { electronAPI } from "@/lib/electron-api"

interface DashboardProps {
  initialSettings: OnboardingSettings
}

const skies = skyboxes;

const tabs = [
  { id: "skies", icon: Cloud, labelEs: "Cielos", labelEn: "Skies" },
  { id: "textures", icon: Moon, labelEs: "Textura Negra", labelEn: "Black Texture" },
  { id: "donate", icon: Heart, labelEs: "Donar", labelEn: "Donate" },
  { id: "help", icon: HelpCircle, labelEs: "Help", labelEn: "Help" },
  { id: "settings", icon: Settings, labelEs: "Configuración", labelEn: "Settings" },
]

const translations = {
  es: {
    selectSky: "Selecciona un cielo para aplicar",
    applySky: "Aplicar Cielo",
    skyApplied: "Cielo aplicado",
    activateBlack: "Activar Arena Negra",
    blackTextureDesc: "Aplica texturas oscuras para mejorar la visibilidad del juego",
    textureActive: "Textura activa",
    textureInactive: "Textura inactiva",
    supportUs: "Apoya el proyecto",
    donateRoblox: "Donar en Roblox",
    donateRobloxDesc: "Visita mi perfil y apóyame",
    donatePaypal: "Donar por PayPal",
    donatePaypalDesc: "$5 USD",
    needHelp: "¿Necesitas ayuda?",
    joinDiscord: "Únete a nuestro Discord si tienes dudas",
    joinButton: "Unirse al Discord",
    settingsTitle: "Configuración",
    language: "Idioma",
    theme: "Tema",
    darkMode: "Modo Oscuro",
    lightModeDisabled: "Modo Claro (Deshabilitado)",
    executor: "Ejecutor",
    changeExecutor: "Cambiar Ejecutor",
    currentExecutor: "Ejecutor actual",
    version: "YUMMAN RIVALS v1.0.0",
    restoreOriginal: "Restaurar Texturas Originales",
    restoreDesc: "Quita arena negra y cielo personalizado",
    restoring: "Restaurando...",
    restored: "Restaurado",
  },
  en: {
    selectSky: "Select a sky to apply",
    applySky: "Apply Sky",
    skyApplied: "Sky applied",
    activateBlack: "Activate Black Arena",
    blackTextureDesc: "Apply dark textures to improve game visibility",
    textureActive: "Texture active",
    textureInactive: "Texture inactive",
    supportUs: "Support the project",
    donateRoblox: "Donate on Roblox",
    donateRobloxDesc: "Visit my profile and support me",
    donatePaypal: "Donate via PayPal",
    donatePaypalDesc: "$5 USD",
    needHelp: "Need help?",
    joinDiscord: "Join our Discord if you have questions",
    joinButton: "Join Discord",
    settingsTitle: "Settings",
    language: "Language",
    theme: "Theme",
    darkMode: "Dark Mode",
    lightModeDisabled: "Light Mode (Disabled)",
    executor: "Executor",
    changeExecutor: "Change Executor",
    currentExecutor: "Current executor",
    version: "YUMMAN RIVALS v1.0.0",
    restoreOriginal: "Restore Original Textures",
    restoreDesc: "Remove black arena and custom sky",
    restoring: "Restoring...",
    restored: "Restored",
  },
}

export function Dashboard({ initialSettings }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("skies")
  const [language, setLanguage] = useState(initialSettings.language)
  const [selectedSky, setSelectedSky] = useState(initialSettings.selectedSky)
  const [blackTextureActive, setBlackTextureActive] = useState(initialSettings.darkTextures)
  const [skyApplied, setSkyApplied] = useState(false)
  const [texturePath, setTexturePath] = useState<string>("")
  const [isApplying, setIsApplying] = useState(false)
  const [executor, setExecutor] = useState(initialSettings.executor)
  const [executorInfo, setExecutorInfo] = useState<string>("")
  const [isRestoring, setIsRestoring] = useState(false)
  const [restored, setRestored] = useState(false)

  const t = translations[language]

  // Obtener ruta de texturas al cargar según el ejecutor guardado
  useEffect(() => {
    async function loadPaths() {
      console.log('=== CARGANDO RUTAS EN DASHBOARD ===');
      console.log('Ejecutor guardado:', executor);
      console.log('Ruta personalizada:', initialSettings.customExecutorPath);
      
      const result = await electronAPI.getExecutorTexturePath(
        executor,
        initialSettings.customExecutorPath || undefined
      );
      
      console.log('Resultado:', result);
      
      if (result.valid) {
        setTexturePath(result.texturePath);
        setExecutorInfo(`${result.executor} - ${result.version}`);
        console.log('✓ Ruta de texturas configurada:', result.texturePath);
      } else {
        console.error('✗ Error al obtener ruta:', result.message);
        // Intentar con Roblox por defecto como fallback
        const paths = await electronAPI.getDefaultPaths();
        const fallback = await electronAPI.verifyRobloxPath(paths.roblox);
        if (fallback.valid) {
          setTexturePath(fallback.texturePath);
          setExecutorInfo(`roblox - ${fallback.version}`);
          console.log('✓ Usando Roblox por defecto:', fallback.texturePath);
        }
      }
    }
    loadPaths()
  }, [executor, initialSettings.customExecutorPath])

  const handleSelectSky = (skyId: string) => {
    setSelectedSky(skyId)
  }

  const handleApplySky = async () => {
    if (!selectedSky || isApplying) return
    
    setIsApplying(true)
    setSkyApplied(false) // Reset estado anterior
    
    try {
      console.log('Aplicando cielo:', selectedSky);
      // Aplicar skybox predefinido
      const result = await electronAPI.applySky(selectedSky, texturePath)
      
      console.log('Resultado:', result);
      
      if (result?.success) {
        setSkyApplied(true)
        setTimeout(() => setSkyApplied(false), 2000)
      } else {
        console.error('Error al aplicar cielo:', result?.message)
        alert(`Error: ${result?.message || 'No se pudo aplicar el cielo'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert(`Error: ${error}`)
    } finally {
      // Asegurar que isApplying se resetea
      setTimeout(() => setIsApplying(false), 100)
    }
  }

  const handleToggleTexture = async () => {
    setIsApplying(true)
    
    try {
      const newState = !blackTextureActive
      const result = await electronAPI.applyDarkTextures(newState, texturePath)
      
      if (result.success) {
        setBlackTextureActive(newState)
      } else {
        console.error('Error al cambiar texturas:', result.message)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsApplying(false)
    }
  }

  // Open external links (simulates shell.openExternal in Electron)
  const openExternal = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleRobloxDonate = () => {
    openExternal("https://www.roblox.com/es/users/4018950771/profile")
  }

  const handlePayPalDonate = () => {
    openExternal("https://www.paypal.com/paypalme/miguelbird/5")
  }

  const handleDiscordJoin = () => {
    openExternal("https://discord.com/invite/EVWqd5swAt")
  }

  const handleRestoreOriginal = async () => {
    if (isRestoring) return
    
    setIsRestoring(true)
    setRestored(false)
    
    try {
      console.log('Restaurando texturas originales...');
      const result = await electronAPI.restoreOriginal(texturePath)
      
      console.log('Resultado:', result);
      
      if (result?.success) {
        setRestored(true)
        setBlackTextureActive(false)
        setSelectedSky(null)
        setTimeout(() => setRestored(false), 3000)
      } else {
        console.error('Error al restaurar:', result?.message)
        alert(`Error: ${result?.message || 'No se pudo restaurar'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert(`Error: ${error}`)
    } finally {
      setTimeout(() => setIsRestoring(false), 100)
    }
  }

  const tabContent = {
    skies: (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-8"
      >
        <p className="text-center text-xl font-medium text-white">{t.selectSky}</p>
        
        {/* Lista Horizontal Deslizable */}
        <div className="relative">
          {/* Contenedor con scroll horizontal */}
          <div className="flex gap-8 overflow-x-auto pb-6 px-16 scrollbar-hide snap-x snap-mandatory">
            {skies.map(sky => (
              <button
                key={sky.id}
                onClick={() => handleSelectSky(sky.id)}
                className={`group relative flex-shrink-0 snap-center overflow-hidden rounded-2xl border-4 transition-all ${
                  selectedSky === sky.id 
                    ? "border-white scale-110 shadow-2xl" 
                    : "border-border hover:border-white/50 hover:scale-105"
                }`}
                style={{ width: '320px', height: '240px' }}
              >
                <img
                  src={sky.image}
                  alt={language === "es" ? sky.name : sky.nameEn}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5">
                  <p className="text-center text-lg font-bold text-white">
                    {language === "es" ? sky.name : sky.nameEn}
                  </p>
                </div>
                {selectedSky === sky.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/10">
                    <div className="rounded-full bg-white p-4">
                      <Check className="h-10 w-10 text-black" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {/* Flechas de navegación */}
          <button
            onClick={() => {
              const container = document.querySelector('.overflow-x-auto');
              if (container) container.scrollBy({ left: -340, behavior: 'smooth' });
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-muted/80 p-4 backdrop-blur-sm transition-all hover:bg-white hover:text-black"
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => {
              const container = document.querySelector('.overflow-x-auto');
              if (container) container.scrollBy({ left: 340, behavior: 'smooth' });
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-muted/80 p-4 backdrop-blur-sm transition-all hover:bg-white hover:text-black"
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={handleApplySky}
            disabled={!selectedSky || isApplying}
            className="btn-gray inline-flex items-center justify-center gap-3 rounded-xl px-10 py-5 text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {skyApplied ? (
              <>
                <Check className="h-7 w-7" />
                {t.skyApplied}
              </>
            ) : (
              <>
                <Play className="h-7 w-7 text-icon" />
                {t.applySky}
              </>
            )}
          </button>
        </div>
      </motion.div>
    ),

    textures: (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex flex-col items-center justify-center space-y-8"
      >
        <button
          onClick={handleToggleTexture}
          className={`group relative mb-4 overflow-hidden rounded-3xl border-4 p-12 transition-all hover:border-button-hover ${
            blackTextureActive 
              ? "border-white bg-muted" 
              : "border-border bg-card hover:bg-muted"
          }`}
        >
          <Moon className={`relative mx-auto h-24 w-24 transition-colors ${
            blackTextureActive ? "text-white" : "text-icon"
          }`} />
          <h3 className="relative mt-6 text-2xl font-bold text-white">{t.activateBlack}</h3>
          <p className="relative mt-3 max-w-md text-base text-muted-foreground">
            {t.blackTextureDesc}
          </p>
        </button>

        <div className={`inline-flex items-center gap-3 rounded-full px-6 py-3 text-base font-medium ${
          blackTextureActive 
            ? "bg-success/20 text-success" 
            : "bg-muted text-muted-foreground"
        }`}>
          <span className={`h-3 w-3 rounded-full ${blackTextureActive ? "bg-success" : "bg-muted-foreground"}`} />
          {blackTextureActive ? t.textureActive : t.textureInactive}
        </div>
      </motion.div>
    ),

    donate: (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-8"
      >
        <h3 className="text-center text-2xl font-bold text-white">{t.supportUs}</h3>
        
        <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
          <button 
            onClick={handleRobloxDonate}
            className="card-glass flex flex-col items-center gap-4 p-10 transition-all hover:bg-button-hover"
          >
            <img 
              src="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-695CED98FDC232201477E9A144B99CE4-Png/150/150/AvatarHeadshot/Webp/noFilter"
              alt="Perfil de Roblox"
              className="h-28 w-28 rounded-full object-cover border-4 border-white"
              crossOrigin="anonymous"
            />
            <div className="text-center">
              <p className="font-semibold text-white text-xl">{t.donateRoblox}</p>
              <p className="text-base text-muted-foreground mt-2">{t.donateRobloxDesc}</p>
            </div>
          </button>

          <button 
            onClick={handlePayPalDonate}
            className="card-glass flex flex-col items-center gap-4 p-10 transition-all hover:bg-button-hover"
          >
            <Heart className="h-28 w-28 text-[#00457C]" />
            <div className="text-center">
              <p className="font-semibold text-white text-xl">{t.donatePaypal}</p>
              <p className="text-base text-muted-foreground mt-2">{t.donatePaypalDesc}</p>
            </div>
          </button>
        </div>
      </motion.div>
    ),

    help: (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex flex-col items-center justify-center text-center space-y-6"
      >
        <HelpCircle className="h-20 w-20 text-[#5865F2]" />
        <h3 className="text-2xl font-bold text-white">{t.needHelp}</h3>
        <p className="text-lg text-muted-foreground max-w-md">{t.joinDiscord}</p>
        <button
          onClick={handleDiscordJoin}
          className="inline-flex items-center gap-3 rounded-xl bg-[#5865F2] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#4752C4]"
        >
          <ExternalLink className="h-6 w-6" />
          {t.joinButton}
        </button>
      </motion.div>
    ),

    settings: (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-8 max-w-2xl mx-auto"
      >
        <h3 className="text-2xl font-bold text-white text-center">{t.settingsTitle}</h3>

        <div className="space-y-5">
          <div className="card-glass flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Globe className="h-6 w-6 text-icon" />
              <span className="font-medium text-white text-lg">{t.language}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setLanguage("es")}
                className={`rounded-lg px-5 py-2 text-base font-medium transition-all ${
                  language === "es" 
                    ? "bg-white text-black" 
                    : "bg-muted text-white hover:bg-button-hover"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`rounded-lg px-5 py-2 text-base font-medium transition-all ${
                  language === "en" 
                    ? "bg-white text-black" 
                    : "bg-muted text-white hover:bg-button-hover"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="card-glass flex items-center justify-between p-6 opacity-50">
            <div className="flex items-center gap-4">
              <Moon className="h-6 w-6 text-icon" />
              <span className="font-medium text-white text-lg">{t.theme}</span>
            </div>
            <div className="flex gap-3">
              <span className="rounded-lg bg-white px-5 py-2 text-base font-medium text-black">
                {t.darkMode}
              </span>
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground">
            {t.lightModeDisabled}
          </p>
          
          {/* Botón de Restaurar Texturas Originales */}
          <div className="card-glass p-6 mt-6">
            <button
              onClick={handleRestoreOriginal}
              disabled={isRestoring}
              className="w-full flex flex-col items-center gap-4 p-6 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <svg className="h-8 w-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-xl font-bold text-white">
                  {restored ? t.restored : (isRestoring ? t.restoring : t.restoreOriginal)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {t.restoreDesc}
              </p>
            </button>
          </div>
        </div>
      </motion.div>
    ),
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-center relative">
          {/* Centered Logo and Title */}
          <div className="flex items-center gap-3">
            <img 
              src="https://static.wikia.nocookie.net/logopedia/images/5/51/RivalsLogo.png/revision/latest?cb=20260110001756"
              alt="Rivals Logo"
              className="h-10 w-10 object-contain"
              crossOrigin="anonymous"
            />
            <h1 className="text-xl font-bold text-white">YUMMAN RIVALS</h1>
          </div>
          {/* Connection Status - Absolute positioned to the right */}
          <div className="absolute right-0 flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">
                {language === "es" ? "Conectado" : "Connected"}
              </span>
            </div>
            {executorInfo && (
              <span className="text-xs text-muted-foreground">
                {executorInfo}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <nav className="w-64 border-r border-border p-4">
          <div className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition-all ${
                    isActive 
                      ? "bg-muted text-white" 
                      : "text-muted-foreground hover:bg-muted hover:text-white"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-icon"}`} />
                  {language === "es" ? tab.labelEs : tab.labelEn}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-6xl">
            <AnimatePresence mode="wait">
              {tabContent[activeTab as keyof typeof tabContent]}
            </AnimatePresence>
          </div>
        </main>

      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-center">
          <span className="text-xs text-muted-foreground">{t.version}</span>
        </div>
      </footer>
    </div>
  )
}
