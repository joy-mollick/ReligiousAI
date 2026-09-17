import { Bot } from 'lucide-react'

export default function Thinking() {
  return (
    <div className="message-row message-row--assistant">
      <div className="avatar avatar--ai">
        <Bot size={17} />
      </div>
      <div className="message-content">
        <div className="thinking-card">
          <span />
          <span />
          <span />
          <p>Searching verified sources…</p>
        </div>
      </div>
    </div>
  )
}
