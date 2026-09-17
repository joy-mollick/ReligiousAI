import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Library,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'

function quranLabel(source) {
  if (source.key) return source.key
  if (source.surahNumber && source.ayahNumber) {
    return `${source.surahNumber}:${source.ayahNumber}`
  }
  return 'Quran source'
}

function hadithLabel(source) {
  const book =
    source.bookNameEnglish ||
    source.bookName ||
    (source.collection === 'muslim' ? 'Sahih Muslim' : 'Sahih al-Bukhari')
  const no = source.hadithNo || source.hadithNumber || source.number
  return no ? `${book} · Hadith ${no}` : book
}

function SourceCard({ type, source, language }) {
  const [open, setOpen] = useState(false)
  const quran = type === 'quran'
  const primaryText =
    language === 'en'
      ? source.english || source.bangla || source.text
      : source.bangla || source.english || source.text

  return (
    <article className={`source-card source-card--${type}`}>
      <button className="source-card__head" onClick={() => setOpen((v) => !v)}>
        <span className="source-icon">
          {quran ? <BookOpen size={16} /> : <Library size={16} />}
        </span>
        <span className="source-card__title">
          <strong>{quran ? quranLabel(source) : hadithLabel(source)}</strong>
          <small>
            {quran
              ? source.surahName || source.surahBanglaName || 'Verified Quran'
              : source.topicName || source.chapterName || 'Verified Hadith'}
          </small>
        </span>
        {open ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
      </button>

      <p className="source-card__preview">{primaryText || 'Verified source available.'}</p>

      {open && (
        <div className="source-card__details">
          {source.arabic && <p className="arabic-text">{source.arabic}</p>}
          {source.bangla && (
            <div className="translation-row">
              <span>বাংলা</span>
              <p>{source.bangla}</p>
            </div>
          )}
          {source.english && (
            <div className="translation-row">
              <span>English</span>
              <p>{source.english}</p>
            </div>
          )}
          {!quran && source.narratorBangla && (
            <div className="translation-row">
              <span>বর্ণনাকারী</span>
              <p>{source.narratorBangla}</p>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default function Sources({ quranSources = [], hadithSources = [], language = 'bn' }) {
  if (!quranSources.length && !hadithSources.length) return null

  return (
    <div className="sources-block">
      <div className="sources-heading">
        <ShieldCheck size={16} />
        <span>Verified sources</span>
        <small>{quranSources.length + hadithSources.length} found</small>
      </div>

      {quranSources.length > 0 && (
        <div className="source-group">
          <div className="source-group-label">QURAN</div>
          <div className="source-grid">
            {quranSources.map((source, idx) => (
              <SourceCard
                type="quran"
                source={source}
                language={language}
                key={`q-${source.key || idx}`}
              />
            ))}
          </div>
        </div>
      )}

      {hadithSources.length > 0 && (
        <div className="source-group">
          <div className="source-group-label">SAHIH HADITH</div>
          <div className="source-grid">
            {hadithSources.map((source, idx) => (
              <SourceCard
                type="hadith"
                source={source}
                language={language}
                key={`h-${source.id || source.key || idx}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
