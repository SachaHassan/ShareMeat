import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

/* Fake OTP code for the demo — any 6 digits work, or the shown code */
const DEMO_OTP = '482917'

/* Accepted CROUS email domains */
const STUDENT_DOMAINS = ['etudiant', 'etu', 'student', 'univ', 'u-paris', 'sorbonne', 'ulille', 'ubordeaux']

function isStudentEmail(email) {
    const domain = email.split('@')[1] || ''
    return STUDENT_DOMAINS.some(d => domain.includes(d)) || domain.endsWith('.fr')
}

const STEPS = ['📧 Email CROUS', '🔐 Vérification', '👤 Profil']

const UNIVERSITIES = [
    'Université Paris Nanterre',
    'Sorbonne Université',
    'Université Paris-Saclay',
    'Université de Lille',
    'Université de Bordeaux',
    'Université de Lyon',
    'Université de Strasbourg',
    'Autre',
]

export default function Register() {
    const [step, setStep] = useState(0)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [otpError, setOtpError] = useState('')
    const [profile, setProfile] = useState({
        username: '', password: '', confirmPassword: '', name: '', university: UNIVERSITIES[0], avatar: '🧑‍💻',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const otpRefs = useRef([])

    const { register } = useAuth()
    const navigate = useNavigate()

    /* ── Step 0: email ── */
    const handleEmailSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!email.includes('@')) { setError('Adresse email invalide.'); return }
        if (!isStudentEmail(email)) { setError('Utilise ton adresse email universitaire ou CROUS (.fr ou domaine étudiant).'); return }
        setLoading(true)
        await new Promise(r => setTimeout(r, 1200)) // Simulate sending email
        setLoading(false)
        setStep(1)
    }

    /* ── Step 1: OTP ── */
    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return
        const next = [...otp]
        next[index] = value
        setOtp(next)
        if (value && index < 5) otpRefs.current[index + 1]?.focus()
    }

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus()
        }
    }

    const handleOtpSubmit = async (e) => {
        e.preventDefault()
        setOtpError('')
        const code = otp.join('')
        if (code.length < 6) { setOtpError('Saisis les 6 chiffres du code.'); return }
        // Accept the demo code OR any 6-digit code (for demo flexibility)
        setLoading(true)
        await new Promise(r => setTimeout(r, 800))
        setLoading(false)
        setStep(2)
    }

    /* ── Step 2: Profile ── */
    const AVATARS = ['🧑‍💻', '👩‍🍳', '🧑‍🎓', '👩‍🎓', '🧑‍🌾', '👩‍⚖️', '🧑', '👩', '🙂', '😎']

    const updateProfile = (f, v) => setProfile(p => ({ ...p, [f]: v }))

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (profile.username.length < 3) { setError('L\'identifiant doit faire au moins 3 caractères.'); return }
        if (profile.password.length < 4) { setError('Le mot de passe doit faire au moins 4 caractères.'); return }
        if (profile.password !== profile.confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return }
        if (profile.name.length < 2) { setError('Saisis ton prénom et nom.'); return }

        setLoading(true)
        await new Promise(r => setTimeout(r, 700))

        const err = register({
            username: profile.username,
            password: profile.password,
            name: profile.name,
            email,
            avatar: profile.avatar,
            university: profile.university,
        })
        setLoading(false)
        if (err) { setError(err); return }
        navigate('/')
    }

    return (
        <div className="auth-page">
            <div className="auth-card animate-fade-up">
                {/* Logo */}
                <Link to="/" className="auth-card__logo">
                    <span className="auth-card__logo-icon">🥗</span>
                    <span className="auth-card__logo-text">Share<span className="gradient-text">Meal</span></span>
                </Link>

                {/* Step progress */}
                <div className="register-step-indicator">
                    {STEPS.map((_, i) => (
                        <div key={i} className={`register-step-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} />
                    ))}
                </div>

                {/* ═══ STEP 0: Email ═══ */}
                {step === 0 && (
                    <>
                        <span className="crous-badge">🎓 Vérification CROUS</span>
                        <h1 className="auth-card__title">Crée ton compte</h1>
                        <p className="auth-card__subtitle">
                            ShareMeal est réservé aux étudiants. Commence par entrer ton adresse email universitaire pour prouver que tu es bien inscrit(e).
                        </p>

                        <form className="auth-card__form" onSubmit={handleEmailSubmit}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="label" htmlFor="reg-email">📧 Adresse email CROUS / universitaire</label>
                                <input
                                    id="reg-email"
                                    className="input"
                                    type="email"
                                    placeholder="prenom.nom@etudiant.univ.fr"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <div className="auth-error"><span>⚠️</span> {error}</div>}
                            <div className="auth-hint">
                                <span>💡</span>
                                <span>Pour la démo, n'importe quelle adresse <strong>.fr</strong> est acceptée.</span>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>
                                {loading ? '📤 Envoi du code...' : '📨 Recevoir mon code de vérification'}
                            </button>
                        </form>

                        <p className="auth-card__link">
                            Déjà un compte ? <Link to="/login">Se connecter</Link>
                        </p>
                    </>
                )}

                {/* ═══ STEP 1: OTP ═══ */}
                {step === 1 && (
                    <>
                        <span className="crous-badge">🔐 Double authentification</span>
                        <h1 className="auth-card__title">Vérifie ton email</h1>

                        <div className="fake-email-sent">
                            Un code de vérification à <strong>6 chiffres</strong> a été envoyé à<br />
                            <strong>{email}</strong><br /><br />
                            <em style={{ color: 'var(--primary-light)', fontStyle: 'normal' }}>🧪 Mode démo — code valide : <strong>{DEMO_OTP}</strong></em>
                        </div>

                        <form className="auth-card__form" style={{ marginTop: 20 }} onSubmit={handleOtpSubmit}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="label" style={{ textAlign: 'center', display: 'block' }}>Saisis le code reçu</label>
                                <div className="otp-grid">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={el => (otpRefs.current[i] = el)}
                                            className="otp-input"
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={e => handleOtpChange(i, e.target.value)}
                                            onKeyDown={e => handleOtpKeyDown(i, e)}
                                        />
                                    ))}
                                </div>
                            </div>
                            {otpError && <div className="auth-error"><span>⚠️</span> {otpError}</div>}
                            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>
                                {loading ? '🔍 Vérification...' : '✅ Confirmer le code'}
                            </button>
                            <button type="button" className="btn btn-secondary" style={{ justifyContent: 'center', width: '100%' }} onClick={() => setStep(0)}>
                                ← Changer l'email
                            </button>
                        </form>
                    </>
                )}

                {/* ═══ STEP 2: Profile ═══ */}
                {step === 2 && (
                    <>
                        <h1 className="auth-card__title">Ton profil 🎉</h1>
                        <p className="auth-card__subtitle">Plus qu'une étape ! Choisis ton avatar et configure ton compte.</p>

                        <form className="auth-card__form" onSubmit={handleProfileSubmit}>
                            {/* Avatar picker */}
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="label">Avatar</label>
                                <div className="emoji-picker">
                                    {AVATARS.map(a => (
                                        <button key={a} type="button" className={`emoji-btn ${profile.avatar === a ? 'active' : ''}`} onClick={() => updateProfile('avatar', a)}>{a}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="label" htmlFor="reg-name">Prénom & Nom *</label>
                                <input id="reg-name" className="input" type="text" placeholder="Marie Curie" value={profile.name} onChange={e => updateProfile('name', e.target.value)} required />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="label" htmlFor="reg-university">Université</label>
                                <select id="reg-university" className="input" value={profile.university} onChange={e => updateProfile('university', e.target.value)}>
                                    {UNIVERSITIES.map(u => <option key={u}>{u}</option>)}
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="label" htmlFor="reg-username">Identifiant *</label>
                                <input id="reg-username" className="input" type="text" placeholder="marie.c" value={profile.username} onChange={e => updateProfile('username', e.target.value)} required autoComplete="username" />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="label" htmlFor="reg-password">Mot de passe *</label>
                                <input id="reg-password" className="input" type="password" placeholder="••••••••" value={profile.password} onChange={e => updateProfile('password', e.target.value)} required autoComplete="new-password" />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="label" htmlFor="reg-confirm">Confirmer le mot de passe *</label>
                                <input id="reg-confirm" className="input" type="password" placeholder="••••••••" value={profile.confirmPassword} onChange={e => updateProfile('confirmPassword', e.target.value)} required autoComplete="new-password" />
                            </div>

                            {error && <div className="auth-error"><span>⚠️</span> {error}</div>}

                            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>
                                {loading ? '⏳ Création...' : '🚀 Créer mon compte'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
