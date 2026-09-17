import {
  Bot,
  Check,
  Copy,
  Database,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Sources from './Sources'

export default function Message({ message, language }) {
  const [copied, setCopied] = useState(false)
  const assistant = message.role === 'assistant'

  async function copyAnswer() {
    try {
      await navigator.clipboard.writeText(message.content || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 1300)
    } catch {
      // Clipboard availability varies by browser.
    }
  }

  const quranSources =
    message.data?.sources ||
    message.data?.quranSources ||
    []

  const hadithSources =
    message.data?.hadithSources ||
    message.data?.hadith_sources ||
    []

  const metadata = message.data?.quranMetadataUsed

  return (
    <div className={`message-row ${assistant ? 'message-row--assistant' : 'message-row--user'}`}>
      <div className={`avatar ${assistant ? 'avatar--ai' : 'avatar--user'}`}>
        {assistant ? <Bot size={17} /> : <UserRound size={17} />}
      </div>

      <div className="message-content">
        {assistant && (
          <div className="answer-label">
            <span>AI explanation</span>
            {metadata && (
              <span className="answer-label__verified">
                <Database size={12} /> Verified metadata
              </span>
            )}
          </div>
        )}

        <div className={`message-bubble ${assistant ? 'message-bubble--assistant' : 'message-bubble--user'}`}>
          {assistant ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content || ''}
            </ReactMarkdown>
          ) : (
            <p>{message.content}</p>
          )}
        </div>

        {assistant && (
          <>
            <Sources
              quranSources={quranSources}
              hadithSources={hadithSources}
              language={language}
            />

            <div className="message-actions">
              <button onClick={copyAnswer}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              {message.data?.responseLanguage && (
                <span className="message-detail-chip">
                  {message.data.responseLanguage === 'bn' ? 'বাংলা' : 'English'}
                </span>
              )}

              {message.data?.conversationContextUsed && (
                <span className="message-detail-chip">Chat context</span>
              )}

              {message.data?.hadithContextUsed && (
                <span className="message-detail-chip">Sahih Hadith</span>
              )}

              {message.data?.retrievalMode && (
                <span className="message-detail-chip">{message.data.retrievalMode}</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
