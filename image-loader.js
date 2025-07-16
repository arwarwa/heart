export default function imageLoader({ src, width, quality }) {
  // Custom image loader for mobile optimization
  if (src.startsWith("/")) {
    return `${src}?w=${width}&q=${quality || 75}`
  }
  return src
}
