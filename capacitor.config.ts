import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.heartcatcher.game",
  appName: "Heart Catcher",
  webDir: "out",
  bundledWebRuntime: false,

  // Server configuration
  server: {
    androidScheme: "https",
    allowNavigation: ["https://*", "http://localhost:*", "ionic://*"],
    hostname: "localhost",
    iosScheme: "ionic",
  },

  // Android-specific configuration
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    loggingBehavior: "none",
    minWebViewVersion: 70,
    appendUserAgent: "HeartCatcher/1.0.0",
    backgroundColor: "#FF69B4",
    toolbarColor: "#FF1493",
    navigationBarColor: "#FF1493",
    hideLogs: true,
    useLegacyBridge: false,

    // Performance optimizations
    mixedContentMode: "compatibility",
    allowFileAccess: true,
    allowContentAccess: true,
    allowFileAccessFromFileURLs: true,
    allowUniversalAccessFromFileURLs: true,

    // Build configuration
    buildOptions: {
      keystorePath: "./release-key.keystore",
      keystoreAlias: "heart-catcher-key",
      releaseType: "APK",
      signingType: "apksigner",
    },
  },

  // Plugin configurations
  plugins: {
    // Splash Screen
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#FF69B4",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: false,
      spinnerStyle: "large",
      spinnerColor: "#FFFFFF",
    },

    // Status Bar
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#FF1493",
      overlaysWebView: false,
    },

    // App Plugin
    App: {
      launchUrl: "index.html",
    },

    // Haptics for enhanced UX
    Haptics: {
      selectionStart: true,
      selectionChanged: true,
      selectionEnd: true,
    },

    // Keyboard handling
    Keyboard: {
      resize: "body",
      style: "DARK",
      resizeOnFullScreen: true,
    },

    // Screen orientation
    ScreenOrientation: {
      orientation: "portrait",
    },

    // Device information
    Device: {},

    // Network status monitoring
    Network: {},

    // File system access
    Filesystem: {
      iosDocumentPath: "DOCUMENTS",
      androidExternalStoragePublicDirectory: "DOWNLOADS",
    },

    // Toast notifications
    Toast: {
      duration: "short",
      position: "bottom",
    },
  },

  // Build configuration
  cordova: {},

  // Include files configuration
  includePlugins: [
    "@capacitor/app",
    "@capacitor/haptics",
    "@capacitor/status-bar",
    "@capacitor/splash-screen",
    "@capacitor/keyboard",
    "@capacitor/device",
    "@capacitor/network",
    "@capacitor/filesystem",
    "@capacitor/screen-orientation",
    "@capacitor/toast",
  ],
}

export default config
