import {
  BookOpenCheck,
  HeartHandshake,
  MoonStar,
  SearchCheck,
  Sparkles,
} from 'lucide-react'

const prompts = [
  {
    icon: HeartHandshake,
    title: 'আল্লাহর রহমত',
    text: 'আল্লাহর রহমত থেকে হতাশ হলে কুরআন কী বলে?',
  },
  {
    icon: MoonStar,
    title: 'ধৈর্য ও পরীক্ষা',
    text: 'কঠিন সময়ে ধৈর্য ধরার ব্যাপারে কুরআন কী বলে?',
  },
  {
    icon: BookOpenCheck,
    title: 'তওবা',
    text: 'আমার অনেক গুনাহ হয়েছে—আল্লাহ কি আমাকে ক্ষমা করবেন?',
  },
  {
    icon: SearchCheck,
    title: 'Hadith',
    text: 'নিয়ত সম্পর্কে সহীহ বুখারী বা মুসলিমে কী হাদিস আছে?',
  },
]

export default function Welcome({ onPrompt }) {
  return (
    <section className="welcome">
      <div className="welcome__eyebrow">
        <Sparkles size={15} />
        <span>Quran-first. Source-aware. Human-reviewed.</span>
      </div>

      <h2>
        Ask with confidence.
        <br />
        Read the sources yourself.
      </h2>

      <p className="welcome__lead">
        বাংলা, Banglish বা English-এ প্রশ্ন করুন। Quran AI উত্তর, ব্যাখ্যা এবং
        যাচাইকৃত উৎস আলাদা করে দেখাবে।
      </p>

      <div className="prompt-grid">
        {prompts.map(({ icon: Icon, title, text }) => (
          <button className="prompt-card" key={text} onClick={() => onPrompt(text)}>
            <span className="prompt-card__icon">
              <Icon size={18} />
            </span>
            <span>
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
          </button>
        ))}
      </div>

      <div className="welcome__note">
        <ShieldMini />
        <span>
          Religious guidance can involve interpretation. Always inspect the cited Quran/Hadith
          sources and consult a qualified scholar for personal rulings.
        </span>
      </div>
    </section>
  )
}

function ShieldMini() {
  return (
    <span className="mini-shield" aria-hidden="true">
      ✓
    </span>
  )
}
