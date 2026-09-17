import {
  Brain,
  Languages,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
} from 'lucide-react'
import Brand from './Brand'

export default function Topbar({
  language,
  onLanguageChange,
  theme,
  onToggleTheme,
  onOpenSidebar,
}) {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="icon-btn mobile-only" onClick={onOpenSidebar} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="mobile-brand">
          <Brand compact />
        </div>
        <div className="desktop-title">
          <h1>Ask Quran AI</h1>
          <span>Quran & Sahih Hadith grounded assistant</span>
        </div>
      </div>

      <div className="topbar__actions">
        <div className="memory-chip" title="Recent messages are stored in this browser and sent as short context for follow-up questions.">
          <Brain size={15} />
          <span>Chat memory</span>
        </div>

        <div className="grounded-chip">
          <ShieldCheck size={15} />
          <span>Grounded</span>
        </div>

        <label className="language-select">
          <Languages size={16} />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            aria-label="Response language"
          >
            <option value="auto">Auto</option>
            <option value="bn">বাংলা</option>
            <option value="en">English</option>
          </select>
        </label>

        <button
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}
