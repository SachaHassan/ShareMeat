import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer__inner">
                <div className="footer__brand">
                    <div className="footer__logo">
                        <span>🥗</span>
                        <span>Share<span className="gradient-text">Meal</span></span>
                    </div>
                    <p className="footer__tagline">
                        L'économie circulaire alimentaire sur ton campus.
                    </p>
                    <div className="footer__badges">
                        <span className="badge badge-green">🌱 Anti-gaspi</span>
                        <span className="badge badge-green">🔒 Certifié CROUS</span>
                    </div>
                </div>

                <div className="footer__links">
                    <div className="footer__col">
                        <h4>Application</h4>
                        <Link to="/explorer">Explorer les offres</Link>
                        <Link to="/publier">Partager un plat</Link>
                        <Link to="/profil">Mon profil</Link>
                    </div>
                    <div className="footer__col">
                        <h4>Le projet</h4>
                        <a href="#">Notre démarche Design Thinking</a>
                        <a href="#">Sécurité sanitaire</a>
                        <a href="#">Les Frigo-Lockers</a>
                    </div>
                    <div className="footer__col">
                        <h4>Contact</h4>
                        <a href="mailto:contact@sharemeal.fr">contact@sharemeal.fr</a>
                        <a href="#">CROUS partenaires</a>
                        <a href="#">FAQ</a>
                    </div>
                </div>
            </div>
            <div className="footer__bottom">
                <div className="container">
                    <p>© 2026 ShareMeal – Projet Design Thinking MIAGE · Développé avec ❤️ pour lutter contre le gaspillage alimentaire</p>
                </div>
            </div>
        </footer>
    )
}
