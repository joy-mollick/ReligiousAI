import { ArrowUp, LoaderCircle, Paperclip } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function Composer({ value, onChange, onSend, loading }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.height = 'auto'
    ref.current.style.height = `${Math.min(ref.current.scrollHeight, 170)}px`
  }, [value])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!loading && value.trim()) onSend()
    }
  }

  return (
    <div className="composer-wrap">
      <div className="composer">
        <button
          className="composer-utility"
          type="button"
          title="Attachments coming later"
          aria-label="Attachments coming later"
          disabled
        >
          <Paperclip size={18} />
        </button>

        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="বাংলা, Banglish or English-এ প্রশ্ন করুন…"
          rows={1}
          maxLength={4000}
          disabled={loading}
        />

        <button
          className="send-btn"
          onClick={onSend}
          disabled={loading || !value.trim()}
          aria-label="Send message"
        >
          {loading ? <LoaderCircle className="spin" size={19} /> : <ArrowUp size={19} />}
        </button>
      </div>

      <div className="composer-meta">
        <span>Enter to send · Shift + Enter for new line</span>
        <span>{value.length}/4000</span>
      </div>
    </div>
  )
}
