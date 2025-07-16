"use client"

import { useEffect } from "react"

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: {
    frameRate: number[]
    memoryUsage: number[]
    loadTime: number
    interactionLatency: number[]
  } = {
    frameRate: [],
    memoryUsage: [],
    loadTime: 0,
    interactionLatency: [],
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startMonitoring() {
    this.monitorFrameRate()
    this.monitorMemoryUsage()
    this.measureLoadTime()
  }

  private monitorFrameRate() {
    let lastTime = performance.now()
    let frameCount = 0

    const measureFPS = (currentTime: number) => {
      frameCount++

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        this.metrics.frameRate.push(fps)

        // Keep only last 60 measurements (1 minute at 1 FPS measurement rate)
        if (this.metrics.frameRate.length > 60) {
          this.metrics.frameRate.shift()
        }

        frameCount = 0
        lastTime = currentTime

        // Log performance warnings
        if (fps < 30) {
          console.warn(`Low FPS detected: ${fps}`)
        }
      }

      requestAnimationFrame(measureFPS)
    }

    requestAnimationFrame(measureFPS)
  }

  private monitorMemoryUsage() {
    const checkMemory = () => {
      if ("memory" in (performance as any)) {
        const memory = (performance as any).memory
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
        this.metrics.memoryUsage.push(usedMB)

        // Keep only last 60 measurements
        if (this.metrics.memoryUsage.length > 60) {
          this.metrics.memoryUsage.shift()
        }

        // Log memory warnings
        if (usedMB > 100) {
          console.warn(`High memory usage: ${usedMB}MB`)
        }
      }
    }

    // Check memory every 5 seconds
    setInterval(checkMemory, 5000)
    checkMemory()
  }

  private measureLoadTime() {
    if (performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
      this.metrics.loadTime = loadTime

      if (loadTime > 3000) {
        console.warn(`Slow load time: ${loadTime}ms`)
      }
    }
  }

  measureInteractionLatency(startTime: number) {
    const latency = performance.now() - startTime
    this.metrics.interactionLatency.push(latency)

    // Keep only last 100 measurements
    if (this.metrics.interactionLatency.length > 100) {
      this.metrics.interactionLatency.shift()
    }

    if (latency > 100) {
      console.warn(`High interaction latency: ${latency}ms`)
    }

    return latency
  }

  getMetrics() {
    const avgFPS =
      this.metrics.frameRate.length > 0
        ? this.metrics.frameRate.reduce((a, b) => a + b, 0) / this.metrics.frameRate.length
        : 0

    const avgMemory =
      this.metrics.memoryUsage.length > 0
        ? this.metrics.memoryUsage.reduce((a, b) => a + b, 0) / this.metrics.memoryUsage.length
        : 0

    const avgLatency =
      this.metrics.interactionLatency.length > 0
        ? this.metrics.interactionLatency.reduce((a, b) => a + b, 0) / this.metrics.interactionLatency.length
        : 0

    return {
      averageFPS: Math.round(avgFPS),
      currentFPS: this.metrics.frameRate[this.metrics.frameRate.length - 1] || 0,
      averageMemoryUsage: Math.round(avgMemory),
      currentMemoryUsage: this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1] || 0,
      loadTime: this.metrics.loadTime,
      averageInteractionLatency: Math.round(avgLatency),
      performanceScore: this.calculatePerformanceScore(),
    }
  }

  private calculatePerformanceScore(): number {
    const metrics = this.getMetrics()
    let score = 100

    // Deduct points for poor performance
    if (metrics.averageFPS < 30) score -= 30
    else if (metrics.averageFPS < 45) score -= 15

    if (metrics.loadTime > 3000) score -= 20
    else if (metrics.loadTime > 2000) score -= 10

    if (metrics.averageMemoryUsage > 100) score -= 20
    else if (metrics.averageMemoryUsage > 50) score -= 10

    if (metrics.averageInteractionLatency > 100) score -= 15
    else if (metrics.averageInteractionLatency > 50) score -= 5

    return Math.max(0, score)
  }

  generateReport(): string {
    const metrics = this.getMetrics()

    return `
Performance Report - ${new Date().toISOString()}
=============================================

Frame Rate:
- Average FPS: ${metrics.averageFPS}
- Current FPS: ${metrics.currentFPS}

Memory Usage:
- Average: ${metrics.averageMemoryUsage}MB
- Current: ${metrics.currentMemoryUsage}MB

Load Performance:
- Load Time: ${metrics.loadTime}ms

Interaction Performance:
- Average Latency: ${metrics.averageInteractionLatency}ms

Overall Performance Score: ${metrics.performanceScore}/100

Recommendations:
${this.getRecommendations(metrics)}
    `.trim()
  }

  private getRecommendations(metrics: any): string {
    const recommendations: string[] = []

    if (metrics.averageFPS < 30) {
      recommendations.push("- Reduce particle count and animation complexity")
      recommendations.push("- Enable performance mode for low-end devices")
    }

    if (metrics.loadTime > 3000) {
      recommendations.push("- Optimize asset loading and bundle size")
      recommendations.push("- Implement lazy loading for non-critical resources")
    }

    if (metrics.averageMemoryUsage > 100) {
      recommendations.push("- Implement object pooling for game entities")
      recommendations.push("- Clean up unused resources more aggressively")
    }

    if (metrics.averageInteractionLatency > 100) {
      recommendations.push("- Optimize touch event handling")
      recommendations.push("- Reduce main thread blocking operations")
    }

    return recommendations.length > 0 ? recommendations.join("\n") : "- Performance is optimal!"
  }
}

// Usage in game component
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance()
    monitor.startMonitoring()

    // Log performance report every minute in development
    if (process.env.NODE_ENV === "development") {
      const interval = setInterval(() => {
        console.log(monitor.generateReport())
      }, 60000)

      return () => clearInterval(interval)
    }
  }, [])

  return PerformanceMonitor.getInstance()
}
