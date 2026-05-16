"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Settings, Download, HelpCircle, MessageCircle, Loader2, Check, X, Copy } from "lucide-react"

type LaunchState = "idle" | "launching" | "done" | "error"

interface HomeViewProps {
  onSettings: () => void
}

const AVATAR = "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-695CED98FDC232201477E9A144B99CE4-Png/150/150/AvatarHeadshot/Webp/noFilter"

export function HomeView({ onSettings }: HomeViewProps) {
  const [launchState, setLaunchState] = useState<LaunchState>("idle")
  const [isInstalling, setIsInstalling] = useState(false)
  const [extraLaunching, setExtraLaunching] = useState(false)
  const [extraDone, setExtraDone] = useState(false)
  const api = typeof window !== "undefined" ? (window as any).electronAPI : null

  const ext = (url: string) => window.open(url, "_blank", "noopener,noreferrer")

  const handleLaunch = async () => {
    if (launchState !== "idle") return
    setLaunchState("launching")
    try {
      const r = await api?.launchRoblox?.("roblox")
      setLaunchState(r?.success ? "done" : "error")
      setTimeout(() => setLaunchState("idle"), 3000)
    } catch {
      setLaunchState("error")
      setTimeout(() => setLaunchState("idle"), 3000)
    }
  }

  // Lanza una instancia extra SIN cerrar el launcher
  const handleExtraInstance = async () => {
    if (extraLaunching) return
    setExtraLaunching(true)
    try {
      const r = await api?.launchExtraInstance?.("roblox")
      if (r?.success) {
        setExtraDone(true)
        setTimeout(() => setExtraDone(false), 2500)
      }
    } catch { /* ignorar */ }
    finally { setExtraLaunching(false) }
  }

  const handleInstall = async () => {
    if (isInstalling) return
    setIsInstalling(true)
    try {
      await api?.installRoblox?.()
    } catch {
      // ignorar — el instalador se lanza en background
    } finally {
      setTimeout(() => setIsInstalling(false), 4000)
    }
  }

  const launchIcon = () => {
    if (launchState === "launching") return <Loader2 size={18} className="animate-spin" />
    if (launchState === "done") return <Check size={18} />
    if (launchState === "error") return <X size={18} />
    return <ArrowRight size={18} />
  }

  const launchText = () => {
    if (launchState === "launching") return "Iniciando Roblox..."
    if (launchState === "done") return "¡Roblox iniciado!"
    if (launchState === "error") return "Error al iniciar"
    return "Iniciar Roblox"
  }

  const buttons = [
    {
      key: "launch",
      icon: launchIcon(),
      label: launchText(),
      onClick: handleLaunch,
      disabled: launchState !== "idle",
      accent: launchState === "done" ? "#22c55e" : launchState === "error" ? "#ef4444" : null,
    },
    {
      key: "extra",
      icon: extraLaunching ? <Loader2 size={18} className="animate-spin" /> : extraDone ? <Check size={18} /> : <Copy size={18} />,
      label: extraLaunching ? "Abriendo..." : extraDone ? "¡Instancia abierta!" : "Abrir instancia extra",
      onClick: handleExtraInstance,
      disabled: extraLaunching,
      accent: extraDone ? "#22c55e" : null,
      sub: "Abre Roblox sin cerrar el launcher",
    },
    {
      key: "settings",
      icon: <Settings size={18} />,
      label: "Configurar ajustes",
      onClick: onSettings,
      disabled: false,
      accent: null,
    },
    {
      key: "install",
      icon: isInstalling ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />,
      label: isInstalling ? "Instalando..." : "Instalar / Actualizar Roblox",
      onClick: handleInstall,
      disabled: isInstalling,
      accent: null,
    },
  ]

  return (
    <div style={{
      display: "flex", height: "100vh", width: "100vw", overflow: "hidden",
      userSelect: "none", backgroundColor: "#1D1B17",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          width: 210, display: "flex", flexDirection: "column",
          justifyContent: "space-between", padding: "28px 22px",
          borderRight: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
        }}
      >
        {/* Top */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
            style={{
              width: 68, height: 68, borderRadius: 18,
              overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            }}
          >
            <img src={AVATAR} alt="YUMMAN" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
          >
            <p style={{ color: "#AEAEAE", fontSize: 14, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>YUMMAN RIVALS</p>
            <p style={{ color: "#555250", fontSize: 11, margin: "3px 0 0 0" }}>Versión 1.0.1</p>
          </motion.div>
        </div>

        {/* Bottom links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
        >
          {[
            { label: "Acerca de YUMMAN", icon: <HelpCircle size={13} />, url: "https://www.roblox.com/es/users/4018950771/profile" },
            { label: "Unirse al Discord", icon: <MessageCircle size={13} />, url: "https://discord.com/invite/EVWqd5swAt" },
          ].map(item => (
            <motion.button
              key={item.label}
              whileHover={{ x: 3 }}
              onClick={() => ext(item.url)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                color: "#555250", fontSize: 11, background: "none",
                border: "none", cursor: "pointer", padding: 0, textAlign: "left",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#AEAEAE")}
              onMouseLeave={e => (e.currentTarget.style.color = "#555250")}
            >
              {item.icon}{item.label}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", gap: 10, padding: "28px 22px",
      }}>
        {buttons.map((btn, i) => (
          <motion.button
            key={btn.key}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.35, ease: "easeOut" }}
            whileHover={!btn.disabled ? { scale: 1.015, x: 2 } : {}}
            whileTap={!btn.disabled ? { scale: 0.985 } : {}}
            onClick={btn.onClick}
            disabled={btn.disabled}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderRadius: 14, padding: "15px 18px", cursor: btn.disabled ? "not-allowed" : "pointer",
              opacity: btn.disabled && btn.key !== "launch" ? 0.5 : 1,
              border: `1px solid ${btn.accent ? btn.accent + "40" : "rgba(255,255,255,0.07)"}`,
              background: btn.accent ? `${btn.accent}12` : "rgba(255,255,255,0.04)",
              backdropFilter: "blur(8px)",
              transition: "border-color 0.2s, background 0.2s",
              width: "100%",
            }}
            onMouseEnter={e => {
              if (!btn.disabled) {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"
                ;(e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = btn.accent ? btn.accent + "40" : "rgba(255,255,255,0.07)"
              ;(e.currentTarget as HTMLElement).style.background = btn.accent ? `${btn.accent}12` : "rgba(255,255,255,0.04)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: "rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: btn.accent || "#AEAEAE", flexShrink: 0,
              }}>
                {btn.icon}
              </div>
              <span style={{ color: "#AEAEAE", fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}>
                {btn.label}
              </span>
            </div>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: btn.key === "launch" && launchState === "idle" ? Infinity : 0, duration: 2, ease: "easeInOut" }}
            >
              <ArrowRight size={15} style={{ color: "#444240" }} />
            </motion.div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
