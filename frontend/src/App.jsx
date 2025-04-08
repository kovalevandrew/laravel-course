import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState('Завантаження...')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Помилка запиту'))
  }, [])

  return (
    <div style={{ padding: '2rem', fontSize: '1.5rem' }}>
      <h1>{message}</h1>
    </div>
  )
}

export default App
