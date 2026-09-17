import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { askQuranAI } from './lib/api'
import { loadChats, makeId, saveChats } from './lib/history'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Welcome from './components/Welcome'
import Composer from './components/Composer'
import Message from './components/Message'
import Thinking from './components/Thinking'

function newChat() {
  return {
    id: makeId(),
    title: 'New conversation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  }
}

function titleFromMessage(value) {
  const cleaned = value.replace(/\s+/g, ' ').trim()
  return cleaned.length > 46 ? `${cleaned.slice(0, 46)}…` : cleaned
}

export default function App() {
  const [chats, setChats] = useState(() => {
    const saved = loadChats()
    return saved.length ? saved : [newChat()]
  })
  const [activeId, setActiveId] = useState(() => {
    const saved = loadChats()
    return saved[0]?.id || null
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [language, setLanguage] = useState('auto')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('quran-ai-theme') || 'dark')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!activeId && chats[0]?.id) setActiveId(chats[0].id)
  }, [activeId, chats])

  useEffect(() => {
    saveChats(chats)
  }, [chats])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('quran-ai-theme', theme)
  }, [theme])

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeId) || chats[0],
    [chats, activeId],
  )

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    })
  }, [activeChat?.messages?.length, loading])

  function updateChat(chatId, updater) {
    setChats((prev) =>
      prev
        .map((chat) => (chat.id === chatId ? updater(chat) : chat))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    )
  }

  function createConversation() {
    const chat = newChat()
    setChats((prev) => [chat, ...prev])
    setActiveId(chat.id)
    setSidebarOpen(false)
    setInput('')
    setError('')
  }

  function deleteConversation(chatId) {
    setChats((prev) => {
      const next = prev.filter((chat) => chat.id !== chatId)
      if (!next.length) {
        const replacement = newChat()
        setActiveId(replacement.id)
        return [replacement]
      }
      if (chatId === activeId) setActiveId(next[0].id)
      return next
    })
  }

  async function sendMessage(override) {
    const text = (override ?? input).trim()
    if (!text || loading) return

    setError('')
    setInput('')
    setLoading(true)

    let targetId = activeChat?.id
    if (!targetId) {
      const chat = newChat()
      targetId = chat.id
      setChats((prev) => [chat, ...prev])
      setActiveId(chat.id)
    }

    // Keep memory local to this browser. Only a short recent window is
    // sent with the current request so follow-up questions make sense.
    const localConversationHistory = (activeChat?.messages || [])
      .slice(-10)
      .map((item) => {
        const quranSourceKeys =
          item.role === 'assistant'
            ? (
                item.data?.selectedSourceKeys ||
                item.data?.sources?.map((source) => source?.key).filter(Boolean) ||
                []
              )
            : []

        const hadithSourceIds =
          item.role === 'assistant'
            ? (
                item.data?.selectedHadithIds ||
                item.data?.hadithSources
                  ?.map((source) => source?.id || source?.key)
                  .filter(Boolean) ||
                []
              )
            : []

        return {
          role: item.role === 'assistant' ? 'assistant' : 'user',
          content: String(item.content || '').slice(0, 1800),
          quranSourceKeys: quranSourceKeys.slice(0, 8),
          hadithSourceIds: hadithSourceIds.slice(0, 8),
          responseLanguage:
            item.role === 'assistant'
              ? item.data?.responseLanguage || ''
              : '',
        }
      })

    const userMessage = {
      id: makeId('msg'),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    }

    updateChat(targetId, (chat) => ({
      ...chat,
      title: chat.messages.length ? chat.title : titleFromMessage(text),
      updatedAt: new Date().toISOString(),
      messages: [...chat.messages, userMessage],
    }))

    try {
      const data = await askQuranAI({
        message: text,
        language,
        history: localConversationHistory,
      })

      const assistantMessage = {
        id: makeId('msg'),
        role: 'assistant',
        content: data.answer || 'No answer was returned.',
        data,
        createdAt: new Date().toISOString(),
      }

      updateChat(targetId, (chat) => ({
        ...chat,
        updatedAt: new Date().toISOString(),
        messages: [...chat.messages, assistantMessage],
      }))
    } catch (err) {
      setError(err?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const messages = activeChat?.messages || []

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        chats={chats}
        activeId={activeChat?.id}
        onSelect={(id) => {
          setActiveId(id)
          setSidebarOpen(false)
          setError('')
        }}
        onNew={createConversation}
        onDelete={deleteConversation}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-shell">
        <Topbar
          language={language}
          onLanguageChange={setLanguage}
          theme={theme}
          onToggleTheme={() => setTheme((v) => (v === 'dark' ? 'light' : 'dark'))}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <div className="conversation-scroll" ref={scrollRef}>
          <div className="conversation">
            {messages.length === 0 ? (
              <Welcome onPrompt={(text) => sendMessage(text)} />
            ) : (
              <div className="messages">
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    language={
                      message.data?.responseLanguage ||
                      (language === 'auto' ? 'bn' : language)
                    }
                  />
                ))}
                {loading && <Thinking />}

                {error && (
                  <div className="error-card">
                    <AlertTriangle size={18} />
                    <div>
                      <strong>Couldn’t complete the answer</strong>
                      <p>{error}</p>
                    </div>
                    <button onClick={() => sendMessage(messages.at(-1)?.content || input)}>
                      <RotateCcw size={15} />
                      Retry
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <footer className="composer-footer">
          <div className="composer-inner">
            <Composer
              value={input}
              onChange={setInput}
              onSend={() => sendMessage()}
              loading={loading}
            />
            <p className="footer-disclaimer">
              AI explanation may contain mistakes. Verify the cited Quran/Hadith text before relying on it.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
