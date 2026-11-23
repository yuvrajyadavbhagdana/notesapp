const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } })
  const body = await response.text()
  let data = body
  try { data = body ? JSON.parse(body) : null } catch { /* Express sends plain text for several backend replies. */ }
  if (!response.ok) {
    const error = new Error(data?.msg || (typeof data === 'string' ? data : null) || `Request failed (${response.status})`)
    error.status = response.status
    throw error
  }
  return data
}

export const registerUser = (form) => request('/api/user/register', { method: 'POST', body: JSON.stringify(form) })
export const loginUser = (form) => request('/api/user/login', { method: 'POST', body: JSON.stringify(form) })
export const getDashboard = (token) => request('/api/dashboard', { headers: { Authorization: token } })
export const getNotes = (token) => request('/api/notes', { headers: { Authorization: token } })
export const createNote = (token, note) => request('/api/notes', { method: 'POST', headers: { Authorization: token }, body: JSON.stringify(note) })
export const updateNote = (token, id, updates) => request(`/api/notes/${id}`, { method: 'PATCH', headers: { Authorization: token }, body: JSON.stringify(updates) })
export const deleteNote = (token, id) => request(`/api/notes/${id}`, { method: 'DELETE', headers: { Authorization: token } })
