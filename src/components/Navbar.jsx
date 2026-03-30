import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handler)
        return () => window.removeEventListener('scroll', handler)
    }, [])

    useEffect(() => {
        setMenuOpen(false)
    }, [location])

    const isActive = (path) => location.pathname === path

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
                    <Link to="/echanges" className={`navbar__link ${isActive('/echanges') ? 'active' : ''}`}>
                        Échanges
                    </Link>
                    <Link to="/publier" className={`navbar__link ${isActive('/publier') ? 'active' : ''}`}>
                        Partager
                    </Link>
                    <Link to="/profil" className={`navbar__link ${isActive('/profil') ? 'active' : ''}`}>
                        Mon Profil
                    </Link>
                </div>

                {/* CTA */}
                <div className="navbar__actions">
                    <Link to="/profil" className="navbar__avatar" title="Mon profil">
                        <span>🧑‍💻</span>
                        <span className="navbar__dot"></span>
                    </Link>
                    <Link to="/publier" className="btn btn-primary btn-sm">
                        + Partager
                    </Link>
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
                <Link to="/explorer" className="navbar__mobile-link">🔍 Explorer les offres</Link>
                <Link to="/echanges" className="navbar__mobile-link">🤝 Échanges Solidaires</Link>
                <Link to="/publier" className="navbar__mobile-link">➕ Partager un plat</Link>
                <Link to="/profil" className="navbar__mobile-link">👤 Mon Profil</Link>
            </div>
        </nav>
    )
}
