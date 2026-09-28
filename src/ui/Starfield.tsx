import './Starfield.css'

/** Three parallax layers of stars generated from a seeded sequence so the sky is stable between renders. */
function stars(count: number, seed: number): string {
  let s = seed
  const next = () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
  return Array.from({ length: count }, () => `${(next() * 100).toFixed(2)}vw ${(next() * 100).toFixed(2)}vh #fff`).join(',')
}

const LAYERS = [
  { count: 160, size: 1, seed: 1, duration: '180s' },
  { count: 70, size: 2, seed: 2, duration: '120s' },
  { count: 25, size: 3, seed: 3, duration: '80s' },
]

export function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      {LAYERS.map((layer) => (
        <div
          key={layer.seed}
          className="star-layer"
          style={{
            width: layer.size,
            height: layer.size,
            boxShadow: stars(layer.count, layer.seed),
            animationDuration: layer.duration,
          }}
        />
      ))}
      <div className="nebula" />
    </div>
  )
}
