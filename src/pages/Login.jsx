import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        // Simulate a tiny network delay for realism
        await new Promise(r => setTimeout(r, 600))
        const err = login(username, password)
        setLoading(false)
        if (err) {
            setError(err)
        } else {
            navigate('/')
        }
    }

    const fillTest = () => {
        setUsername('test')
        setPassword('test')
    }

    return (
        <div className="auth-page">
            <div className="auth-card animate-fade-up">
                {/* Logo */}
                <Link to="/" className="auth-card__logo">
                    <span className="auth-card__logo-icon">🥗</span>
                    <span className="auth-card__logo-text">Share<span className="gradient-text">Meat</span></span>
                </Link>

                <h1 className="auth-card__title">Bon retour 👋</h1>
                <p className="auth-card__subtitle">Connecte-toi pour partager et récupérer des plats sur le campus.</p>

                {/* Hint box */}
                <div className="auth-hint" style={{ marginBottom: 20 }}>
                    <span>💡</span>
                    <span>
                        Compte de démo disponible : <strong>test / test</strong>
                        {' '}— ou <button type="button" onClick={fillTest} style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>remplir automatiquement</button>
                    </span>
                </div>

                <form className="auth-card__form" onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label" htmlFor="login-username">Identifiant</label>
                        <input
                            id="login-username"
                            className="input"
                            type="text"
                            placeholder="Ton identifiant"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label" htmlFor="login-password">Mot de passe</label>
                        <input
                            id="login-password"
                            className="input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="auth-error">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <div className="auth-card__actions">
                        <button
                            id="login-submit"
                            type="submit"
                            className="btn btn-primary"
                            style={{ justifyContent: 'center', width: '100%', opacity: loading ? 0.7 : 1 }}
                            disabled={loading}
                        >
                            {loading ? '⏳ Connexion...' : '🔑 Se connecter'}
                        </button>
                    </div>
                </form>

                <div className="auth-divider">ou</div>

                <p className="auth-card__link">
                    Pas encore de compte ?{' '}
                    <Link to="/register">Créer un compte via CROUS →</Link>
                </p>
            </div>
        </div>
    )
}
