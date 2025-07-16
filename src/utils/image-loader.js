export default function imageLoader({ src, width, quality }) {
  // Optimize images for mobile devices
  const params = new URLSearchParams()

  if (width) params.set("w", width.toString())
  if (quality) params.set("q", quality.toString())

  // Handle different image sources
  if (src.startsWith("/")) {
    return `${src}${params.toString() ? "?" + params.toString() : ""}`
  }

  if (src.startsWith("http")) {
    return src
  }

  return `/${src}${params.toString() ? "?" + params.toString() : ""}`
}
