import { useEffect, useState } from 'react'
import { login, register, getUser, logout } from './api'
import { motion } from 'framer-motion'

const API_URL = 'http://localhost:8000/api/posts'

function App() {
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState(null)
  

  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [loadingUser, setLoadingUser] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  const fetchPosts = async () => {
    setLoadingPosts(true)
    const res = await fetch(API_URL, { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      setPosts(data)
    }
    setLoadingPosts(false)
  }

  const handlePostSubmit = async (e) => {
    e.preventDefault()
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': decodeURIComponent(
          document.cookie
            .split('; ')
            .find((row) => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1] || ''
        ),
      },
      credentials: 'include',
      body: JSON.stringify({ title, content }),
    })
    setTitle('')
    setContent('')
    fetchPosts()
  }

  const handlePostEdit = (post) => {
    setEditingId(post.id)
    setEditTitle(post.title)
    setEditContent(post.content)
  }
  
  const handlePostUpdate = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': decodeURIComponent(
          document.cookie
            .split('; ')
            .find((row) => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1] || ''
        ),
      },
      credentials: 'include',
      body: JSON.stringify({
        title: editTitle,
        content: editContent,
      }),
    })
    setEditingId(null)
    fetchPosts()
  }
  

  const handlePostDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    fetchPosts()
  }

  const handleAuthChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const data = isLogin ? await login(form) : await register(form)
      setUser(data)
      fetchPosts()
    } catch (err) {
      setError(err.message || 'Помилка входу/реєстрації')
    }
  }

  const handleLogout = async () => {
    await logout()
    setUser(null)
    setPosts([])
  }

  useEffect(() => {
    getUser().then((u) => {
      if (u) {
        setUser(u)
        fetchPosts()
      }
      setLoadingUser(false)
    })
  }, [])

  if (loadingUser) {
    return (
      <div style={{
        height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
        background: '#f6f8fa', color: '#111'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          ⏳ Перевірка сесії...
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f6f8fa',
      padding: '2rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          maxWidth: '600px',
          background: '#fff',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          fontFamily: 'sans-serif',
          color: '#111', // 👈 Чорний текст
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          🔐 Laravel + React SPA
        </h1>

        {user ? (
          <>
            <p>👋 Вітаю, <strong>{user.name}</strong>!</p>
            <button onClick={handleLogout}>Вийти</button>

            <hr style={{ margin: '1.5rem 0' }} />
            <h2>📬 Пост-менеджер</h2>

            <form onSubmit={handlePostSubmit} style={{ marginBottom: '2rem' }}>
              <input
                type="text"
                placeholder="Заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
              />
              <textarea
                placeholder="Контент"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
              ></textarea>
              <button type="submit">➕ Додати пост</button>
            </form>

            {loadingPosts ? (
              <p>Завантаження постів...</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
                >
                  {editingId === post.id ? (
                    <>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                      ></textarea>
                      <button onClick={() => handlePostUpdate(post.id)}>💾 Зберегти</button>{' '}
                      <button onClick={() => setEditingId(null)}>❌ Скасувати</button>
                    </>
                  ) : (
                    <>
                      <h3>{post.title}</h3>
                      <p>{post.content}</p>
                      <button onClick={() => handlePostEdit(post)}>✏️ Редагувати</button>{' '}
                      <button onClick={() => handlePostDelete(post.id)}>🗑️ Видалити</button>
                    </>
                  )}
                </div>
              ))              
            )}
          </>
        ) : (
          <form onSubmit={handleAuthSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Імʼя"
                value={form.name}
                onChange={handleAuthChange}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleAuthChange}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
            />
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={form.password}
              onChange={handleAuthChange}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">{isLogin ? 'Увійти' : 'Зареєструватися'}</button>
            <p style={{ marginTop: '0.5rem' }}>
              {isLogin ? 'Немає акаунта?' : 'Вже є акаунт?'}{' '}
              <button type="button" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Зареєструватись' : 'Увійти'}
              </button>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  )
}

export default App
