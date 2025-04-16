import { useEffect, useState } from 'react'
import { login, register, getUser, logout } from './api'

function App() {
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const data = isLogin ? await login(form) : await register(form)
      setUser(data)
    } catch (err) {
      setError(err.message || 'Помилка')
    }
  }

  const handleLogout = async () => {
    await logout()
    setUser(null)
  }

  useEffect(() => {
    getUser().then(setUser)
  }, [])

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>🔐 Авторизація (Sanctum)</h1>

      {user ? (
        <div>
          <p>👋 Вітаю, {user.name}!</p>
          <button onClick={handleLogout}>Вийти</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Імʼя"
              value={form.name}
              onChange={handleChange}
              required
              style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            required
            style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
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
    </div>
  )
}

export default App
