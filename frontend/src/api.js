const API = 'http://127.0.0.1:8000'

export async function getUser() {
  const res = await fetch(`${API}/api/user`, {
    credentials: 'include',
  })
  return res.ok ? res.json() : null
}

export async function register(data) {
    await fetch(`${API}/sanctum/csrf-cookie`, { credentials: 'include' })
    const token = decodeURIComponent(
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1] || ''
      )
    const res = await fetch(`${API}/api/register`, {
      method: 'POST',
      withCredentials: true,
      withXSRFToken: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': token,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })
  
    return res.ok ? res.json() : Promise.reject(await res.json())
}

export async function login(data) {
  await fetch(`${API}/sanctum/csrf-cookie`, { credentials: 'include' })
    const token = decodeURIComponent(
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1] || ''
      )
  const res = await fetch(`${API}/api/login`, {
    method: 'POST',
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': token,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  return res.ok ? res.json() : Promise.reject(await res.json())
}

export async function logout() {
  await fetch(`${API}/api/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}
