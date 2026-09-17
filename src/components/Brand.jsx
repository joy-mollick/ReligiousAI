import { BookOpenText, Sparkles } from 'lucide-react'

export default function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`}>
      <div className="brand__mark" aria-hidden="true">
        <BookOpenText size={22} strokeWidth={1.8} />
        <span className="brand__spark">
          <Sparkles size={11} />
        </span>
      </div>
      <div>
        <div className="brand__name">Quran AI</div>
        {!compact && <div className="brand__tagline">Grounded knowledge</div>}
      </div>
    </div>
  )
}
