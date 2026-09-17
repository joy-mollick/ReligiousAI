import {
  MessageSquarePlus,
  MessageSquareText,
  PanelLeftClose,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'
import Brand from './Brand'

function formatTime(value) {
  try {
    const date = new Date(value)
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
    }).format(date)
  } catch {
    return ''
  }
}

export default function Sidebar({
  open,
  chats,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onClose,
}) {
  return (
    <>
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <div className="sidebar__top">
          <Brand />
          <button className="icon-btn mobile-only" onClick={onClose} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        <button className="new-chat-btn" onClick={onNew}>
          <MessageSquarePlus size={18} />
          <span>New conversation</span>
        </button>

        <div className="sidebar__section-label">Recent chats</div>

        <div className="chat-list">
          {chats.length === 0 ? (
            <div className="sidebar-empty">
              <MessageSquareText size={18} />
              <span>Your conversations will appear here.</span>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-history-item ${
                  chat.id === activeId ? 'chat-history-item--active' : ''
                }`}
              >
                <button className="chat-history-main" onClick={() => onSelect(chat.id)}>
                  <MessageSquareText size={16} />
                  <span className="chat-history-copy">
                    <span className="chat-history-title">
                      {chat.title || 'New conversation'}
                    </span>
                    <span className="chat-history-date">{formatTime(chat.updatedAt)}</span>
                  </span>
                </button>
                <button
                  className="history-delete"
                  onClick={() => onDelete(chat.id)}
                  aria-label="Delete conversation"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="sidebar__footer">
          <div className="trust-card">
            <div className="trust-card__icon">
              <ShieldCheck size={17} />
            </div>
            <div>
              <strong>Source-grounded</strong>
              <p>AI explanations are shown separately from verified Quran and Hadith sources.</p>
            </div>
          </div>
        </div>
      </aside>
      {open && <button className="sidebar-backdrop" onClick={onClose} aria-label="Close menu" />}
    </>
  )
}
