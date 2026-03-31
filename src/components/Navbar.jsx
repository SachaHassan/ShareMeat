import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout, isAuthenticated } = useAuth()

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handler)
        return () => window.removeEventListener('scroll', handler)
    }, [])

    useEffect(() => {
        setMenuOpen(false)
    }, [location])

    const isActive = (path) => location.pathname === path

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
            <div className="container navbar__inner">
                {/* Logo */}
                <Link to="/" className="navbar__logo">
                    <span className="navbar__logo-icon">🥗</span>
                    <span className="navbar__logo-text">
                        Share<span className="gradient-text">Meat</span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="navbar__links">
                    <Link to="/explorer" className={`navbar__link ${isActive('/explorer') ? 'active' : ''}`}>
                        Explorer
                    </Link>
                    {isAuthenticated && (
                        <Link to="/publier" className={`navbar__link ${isActive('/publier') ? 'active' : ''}`}>
                            Partager
                        </Link>
                    )}
                    {isAuthenticated && (
                        <Link to="/profil" className={`navbar__link ${isActive('/profil') ? 'active' : ''}`}>
                            Mon Profil
                        </Link>
                    )}
                </div>

                {/* CTA */}
                <div className="navbar__actions">
                    {isAuthenticated ? (
                        <>
                            <Link to="/profil" className="navbar__avatar" title={`Connecté en tant que ${user?.name}`}>
                                <span>{user?.avatar || '🧑‍💻'}</span>
                                <span className="navbar__dot"></span>
                            </Link>
                            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                                Déconnexion
                            </button>
                            <Link to="/publier" className="btn btn-primary btn-sm">
                                + Partager
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary btn-sm">
                                Se connecter
                            </Link>
                            <Link to="/register" className="btn btn-primary btn-sm">
                                🎓 Rejoindre
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className={`navbar__burger ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile menu */}
            <div className={`navbar__mobile ${menuOpen ? 'open' : ''}`}>
                <Link to="/explorer" className="navbar__mobile-link">🔍 Explorer (Plats & Garde-Manger)</Link>
                {isAuthenticated ? (
                    <>
                        <Link to="/publier" className="navbar__mobile-link">➕ Partager</Link>
                        <Link to="/profil" className="navbar__mobile-link">👤 Mon Profil — {user?.name}</Link>
                        <button onClick={handleLogout} className="navbar__mobile-link" style={{ textAlign: 'left', background: 'none', border: 'none', width: '100%', cursor: 'pointer', color: '#f87171' }}>
                            🚪 Déconnexion
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="navbar__mobile-link">🔑 Se connecter</Link>
                        <Link to="/register" className="navbar__mobile-link">🎓 Créer un compte</Link>
                    </>
                )}
            </div>
        </nav>
    )
}
