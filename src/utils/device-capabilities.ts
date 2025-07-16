"use client"

import { useEffect } from "react"

import { useState } from "react"

import { Device } from "@capacitor/device"
import { Haptics, ImpactStyle } from "@capacitor/haptics"

export interface DeviceCapabilities {
  screenSize: "small" | "medium" | "large" | "xlarge"
  density: "ldpi" | "mdpi" | "hdpi" | "xhdpi" | "xxhdpi" | "xxxhdpi"
  hasHaptics: boolean
  hasAudio: boolean
  hasCamera: boolean
  memoryClass: "low" | "medium" | "high"
  performanceLevel: "low" | "medium" | "high"
  supportedFeatures: string[]
}

export class DeviceCapabilityDetector {
  private static instance: DeviceCapabilityDetector
  private capabilities: DeviceCapabilities | null = null

  static getInstance(): DeviceCapabilityDetector {
    if (!DeviceCapabilityDetector.instance) {
      DeviceCapabilityDetector.instance = new DeviceCapabilityDetector()
    }
    return DeviceCapabilityDetector.instance
  }

  async detectCapabilities(): Promise<DeviceCapabilities> {
    if (this.capabilities) {
      return this.capabilities
    }

    const deviceInfo = await Device.getInfo()
    const screenInfo = this.getScreenInfo()
    const audioSupport = this.detectAudioSupport()
    const hapticsSupport = await this.detectHapticsSupport()
    const memoryInfo = this.detectMemoryClass()
    const performanceLevel = this.detectPerformanceLevel(deviceInfo)

    this.capabilities = {
      screenSize: screenInfo.size,
      density: screenInfo.density,
      hasHaptics: hapticsSupport,
      hasAudio: audioSupport,
      hasCamera: await this.detectCameraSupport(),
      memoryClass: memoryInfo,
      performanceLevel,
      supportedFeatures: this.getSupportedFeatures(),
    }

    return this.capabilities
  }

  private getScreenInfo(): { size: DeviceCapabilities["screenSize"]; density: DeviceCapabilities["density"] } {
    const width = window.screen.width
    const height = window.screen.height
    const density = window.devicePixelRatio

    // Determine screen size category
    let size: DeviceCapabilities["screenSize"] = "medium"
    const minDimension = Math.min(width, height)

    if (minDimension < 480) size = "small"
    else if (minDimension < 600) size = "medium"
    else if (minDimension < 720) size = "large"
    else size = "xlarge"

    // Determine density category
    let densityCategory: DeviceCapabilities["density"] = "mdpi"
    if (density <= 0.75) densityCategory = "ldpi"
    else if (density <= 1.0) densityCategory = "mdpi"
    else if (density <= 1.5) densityCategory = "hdpi"
    else if (density <= 2.0) densityCategory = "xhdpi"
    else if (density <= 3.0) densityCategory = "xxhdpi"
    else densityCategory = "xxxhdpi"

    return { size, density: densityCategory }
  }

  private detectAudioSupport(): boolean {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      return audioContext.state !== undefined
    } catch {
      return false
    }
  }

  private async detectHapticsSupport(): Promise<boolean> {
    try {
      await Haptics.impact({ style: ImpactStyle.Light })
      return true
    } catch {
      return false
    }
  }

  private async detectCameraSupport(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      return devices.some((device) => device.kind === "videoinput")
    } catch {
      return false
    }
  }

  private detectMemoryClass(): DeviceCapabilities["memoryClass"] {
    // Estimate memory based on device characteristics
    const hardwareConcurrency = navigator.hardwareConcurrency || 1
    const deviceMemory = (navigator as any).deviceMemory || 2

    if (deviceMemory >= 6 && hardwareConcurrency >= 6) return "high"
    if (deviceMemory >= 3 && hardwareConcurrency >= 4) return "medium"
    return "low"
  }

  private detectPerformanceLevel(deviceInfo: any): DeviceCapabilities["performanceLevel"] {
    const memoryClass = this.detectMemoryClass()
    const isAndroid = deviceInfo.platform === "android"

    // Android version-based performance estimation
    if (isAndroid) {
      const androidVersion = Number.parseInt(deviceInfo.osVersion?.split(".")[0] || "7")
      if (androidVersion >= 12 && memoryClass === "high") return "high"
      if (androidVersion >= 10 && memoryClass !== "low") return "medium"
    }

    return memoryClass === "high" ? "medium" : "low"
  }

  private getSupportedFeatures(): string[] {
    const features: string[] = []

    // Check for various web APIs
    if ("serviceWorker" in navigator) features.push("serviceWorker")
    if ("webgl" in window || "webgl2" in window) features.push("webgl")
    if ("indexedDB" in window) features.push("indexedDB")
    if ("localStorage" in window) features.push("localStorage")
    if ("geolocation" in navigator) features.push("geolocation")
    if ("vibrate" in navigator) features.push("vibrate")
    if ("share" in navigator) features.push("webShare")
    if ("requestFullscreen" in document.documentElement) features.push("fullscreen")

    return features
  }

  // Game-specific optimization methods
  getOptimalSettings(): {
    particleCount: number
    animationQuality: "low" | "medium" | "high"
    audioEnabled: boolean
    hapticsEnabled: boolean
    frameRate: number
  } {
    const capabilities = this.capabilities
    if (!capabilities) {
      throw new Error("Capabilities not detected. Call detectCapabilities() first.")
    }

    const settings = {
      particleCount: 50,
      animationQuality: "medium" as const,
      audioEnabled: capabilities.hasAudio,
      hapticsEnabled: capabilities.hasHaptics,
      frameRate: 60,
    }

    // Adjust based on performance level
    switch (capabilities.performanceLevel) {
      case "low":
        settings.particleCount = 20
        settings.animationQuality = "low"
        settings.frameRate = 30
        break
      case "medium":
        settings.particleCount = 35
        settings.animationQuality = "medium"
        settings.frameRate = 45
        break
      case "high":
        settings.particleCount = 80
        settings.animationQuality = "high"
        settings.frameRate = 60
        break
    }

    // Adjust for screen size
    if (capabilities.screenSize === "small") {
      settings.particleCount = Math.floor(settings.particleCount * 0.7)
    } else if (capabilities.screenSize === "xlarge") {
      settings.particleCount = Math.floor(settings.particleCount * 1.3)
    }

    return settings
  }
}

// Usage in game component
export const useDeviceOptimization = () => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(null)
  const [gameSettings, setGameSettings] = useState<any>(null)

  useEffect(() => {
    const detector = DeviceCapabilityDetector.getInstance()

    detector.detectCapabilities().then((caps) => {
      setCapabilities(caps)
      setGameSettings(detector.getOptimalSettings())
    })
  }, [])

  return { capabilities, gameSettings }
}
