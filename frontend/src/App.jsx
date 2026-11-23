import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, Check, Feather, Heart, LockKeyhole, Mail, Plus, Sparkles, Trash2 } from 'lucide-react'
import { createNote, deleteNote, getNotes, loginUser, registerUser, updateNote } from './api.js'

const TOKEN_KEY = 'notesapp_token'

function Brand() { return <Link className="brand" to="/"><span className="brand-icon"><Feather size={19}/></span> notespace<span className="brand-dot">.</span></Link> }
function Header({ token, onLogout }) { return <header className="topbar"><Brand/><nav><a href="#about">A little calm</a>{token ? <button className="nav-button" onClick={onLogout}>Sign out</button> : <Link className="nav-button" to="/login">Sign in <ArrowRight size={15}/></Link>}</nav></header> }

function Home({ token }) {
  return <main className="hero-wrap"><section className="hero"><div className="eyebrow"><Sparkles size={14}/> A softer place for your thoughts</div><h1>Make room for<br/><em>what matters.</em></h1><p className="hero-copy">A quiet little space to collect ideas, untangle thoughts, and come back to what you meant to remember.</p><div className="hero-actions"><Link className="button primary" to={token ? '/dashboard' : '/register'}>{token ? 'Open my space' : 'Create your free space'}<ArrowRight size={17}/></Link><Link className="button secondary" to="/login">I already have an account</Link></div><div className="soft-note"><span className="avatar-stack"><i>J</i><i>M</i><i>A</i></span><span>A small pause in a noisy day</span></div></section><section className="note-stage" aria-label="Notespace preview"><div className="sun-wash"/><div className="floating-card card-back"><span className="card-date">A THOUGHT TO KEEP</span><p>“The secret of getting ahead is getting started.”</p><small>Mark Twain</small></div><div className="note-card"><div className="note-top"><span className="tiny-mark"><Feather size={15}/></span><span>MONDAY, 9:41 AM</span><span className="saved"><Check size={12}/> saved</span></div><h2>Small things,<br/><em>big feelings.</em></h2><p>Today I noticed the light landing on the kitchen table. It made an ordinary morning feel like something worth keeping.</p><div className="note-footer"><span><BookOpen size={14}/> A little observation</span><span className="note-dots">•••</span></div></div><div className="sparkle sparkle-one">✳</div><div className="sparkle sparkle-two">✳</div><div className="little-caption">your mind, with a little more breathing room</div></section></main>
}

function Auth({ mode, onAuth }) {
  const isRegister = mode === 'register'; const [form, setForm] = useState({ name: '', email: '', password: '' }); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const nav = useNavigate()
  async function submit(e) { e.preventDefault(); setError(''); setBusy(true); try { if (isRegister) { const result = await registerUser(form); if (typeof result === 'string' && /can't|error/i.test(result)) throw new Error(result); setError('Account created. You can sign in now.'); } else { const result = await loginUser({ email: form.email, password: form.password }); if (typeof result === 'string') throw new Error(result); if (!result?.token) throw new Error(result?.msg || 'The server did not return a login token.'); onAuth(result.token); nav('/dashboard'); } } catch (err) { setError(err.message || 'Something went wrong. Please try again.'); } finally { setBusy(false); } }
  return <main className="auth-wrap"><div className="auth-art"><div className="art-orbit orbit-a"/><div className="art-orbit orbit-b"/><div className="art-paper"><Feather size={27}/><div className="paper-lines"><i/><i/><i/><i/></div><span>good thoughts live here</span></div><span className="art-star">✳</span><span className="art-flower">✿</span><p>Pause. Write. Begin again.</p></div><section className="auth-panel"><div className="auth-kicker"><span className="brand-icon"><Feather size={16}/></span> YOUR SPACE IS WAITING</div><h1>{isRegister ? <>A fresh page<br/><em>starts here.</em></> : <>Welcome<br/><em>back.</em></>}</h1><p className="auth-sub">{isRegister ? 'Create a little corner that’s entirely yours.' : 'Pick up where your thoughts left off.'}</p><form onSubmit={submit} className="auth-form">{isRegister && <label>Your name<div className="input-wrap"><Feather size={16}/><input autoComplete="name" placeholder="How should we call you?" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div></label>}<label>Email address<div className="input-wrap"><Mail size={16}/><input type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></div></label><label>Password<div className="input-wrap"><LockKeyhole size={16}/><input type="password" autoComplete={isRegister?'new-password':'current-password'} minLength="3" placeholder="At least 3 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></div></label>{error&&<p className={error.startsWith('Account created')?'notice':'error'} role="status">{error}</p>}<button className="button primary submit" disabled={busy}>{busy?'One moment…':isRegister?'Create my space':'Sign in'}<ArrowRight size={16}/></button></form><p className="auth-switch">{isRegister?'Already have a space?':'New to Notespace?'} <Link to={isRegister?'/login':'/register'}>{isRegister?'Sign in':'Create an account'}</Link></p><p className="privacy-note"><LockKeyhole size={12}/> Your notes belong to you.</p></section></main>
}

function Dashboard({ token, onLogout }) {
  const [notes, setNotes] = useState([])
  const [form, setForm] = useState({ title: '', content: '' })
  const [filter, setFilter] = useState('all')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getNotes(token)
      .then(data => { if (active) setNotes(Array.isArray(data) ? data : []) })
      .catch(err => {
        if (!active) return
        if (err.status === 401) onLogout()
        else setError(err.message || 'Could not load notes')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [token])

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const note = await createNote(token, form)
      setNotes(current => [note, ...current])
      setForm({ title: '', content: '' })
    } catch (err) {
      if (err.status === 401) onLogout()
      else setError(err.message || 'Could not create note')
    } finally {
      setBusy(false)
    }
  }

  async function toggleFavorite(note) {
    try {
      const updated = await updateNote(token, note._id, { favorite: !note.favorite })
      setNotes(current => current.map(item => item._id === note._id ? updated : item))
    } catch (err) {
      setError(err.message || 'Could not update favorite')
    }
  }

  async function remove(note) {
    if (!window.confirm('Delete this note?')) return
    try {
      await deleteNote(token, note._id)
      setNotes(current => current.filter(item => item._id !== note._id))
    } catch (err) {
      setError(err.message || 'Could not delete note')
    }
  }

  const visibleNotes = filter === 'favorites' ? notes.filter(note => note.favorite) : notes

  return <main className="notes-workspace">
    <div className="notes-heading">
      <div><div className="dash-label"><span className="live-dot"/> YOUR PRIVATE SPACE</div><h1>A little room<br/><em>to think.</em></h1></div>
      <button className="button secondary" onClick={onLogout}>Sign out <ArrowRight size={15}/></button>
    </div>
    <section className="notes-composer">
      <form onSubmit={submit} className="composer-form">
        <div className="composer-title"><Feather size={18}/><input aria-label="Note title" placeholder="Name this thought…" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required/></div>
        <textarea aria-label="Note content" placeholder="Write something worth keeping…" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required/>
        <button className="button primary composer-submit" disabled={busy}><Plus size={16}/>{busy ? 'Saving…' : 'Save note'}</button>
      </form>
    </section>
    {error && <p className="error workspace-error" role="status">{error}</p>}
    <div className="notes-toolbar">
      <div><button className={filter === 'all' ? 'filter active' : 'filter'} onClick={() => setFilter('all')}>All notes <span>{notes.length}</span></button><button className={filter === 'favorites' ? 'filter active' : 'filter'} onClick={() => setFilter('favorites')}><Heart size={13}/>Favorites <span>{notes.filter(note => note.favorite).length}</span></button></div>
    </div>
    {loading ? <p className="empty-state">Opening your notes…</p> : visibleNotes.length === 0 ? <div className="empty-state"><Feather size={24}/><strong>{filter === 'favorites' ? 'No favorites yet' : 'A fresh page awaits'}</strong><p>{filter === 'favorites' ? 'Tap a heart on a note to keep it close.' : 'Write your first thought above.'}</p></div> : <section className="notes-grid">
      {visibleNotes.map(note => <article className="note-item" key={note._id}>
        <div className="note-item-top"><span>{new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span><div><button className={note.favorite ? 'icon-button favorite' : 'icon-button'} aria-label={note.favorite ? 'Remove from favorites' : 'Add to favorites'} onClick={() => toggleFavorite(note)}><Heart size={16} fill={note.favorite ? 'currentColor' : 'none'}/></button><button className="icon-button delete" aria-label="Delete note" onClick={() => remove(note)}><Trash2 size={16}/></button></div></div>
        <h2>{note.title}</h2><p>{note.content}</p>
      </article>)}
    </section>}
  </main>
}

export default function App() {
  const [token, setToken] = useState(()=>localStorage.getItem(TOKEN_KEY)); const nav=useNavigate()
  function saveToken(value){localStorage.setItem(TOKEN_KEY,value);setToken(value)}
  function logout(){localStorage.removeItem(TOKEN_KEY);setToken(null);nav('/login')}
  return <div className="app-shell"><Header token={token} onLogout={logout}/><Routes><Route path="/" element={<Home token={token}/>}/><Route path="/login" element={token?<Navigate to="/dashboard" replace/>:<Auth mode="login" onAuth={saveToken}/>}/><Route path="/register" element={token?<Navigate to="/dashboard" replace/>:<Auth mode="register" onAuth={saveToken}/>}/><Route path="/dashboard" element={token?<Dashboard token={token} onLogout={logout}/>:<Navigate to="/login" replace/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes><footer className="site-footer"><span>notespace<span className="brand-dot">.</span></span><span>Made for the thoughts worth keeping <span className="footer-heart">✳</span></span></footer></div>
}
