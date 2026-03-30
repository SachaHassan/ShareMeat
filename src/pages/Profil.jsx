import { mockUser } from '../data/mockData'
import './Profil.css'
import { Link } from 'react-router-dom'

function StarRating({ rating, interactive = false }) {
    return (
        <div className="stars">
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} style={{ opacity: i <= Math.round(rating) ? 1 : 0.25 }}>⭐</span>
            ))}
            <span style={{ marginLeft: 6, fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {rating}/5
            </span>
        </div>
    )
}

export default function Profil() {
    const user = mockUser

    return (
        <div className="profil">
            <div className="container">
                {/* Hero banner */}
                <div className="profil__banner animate-fade-up">
                    <div className="profil__avatar-wrap">
                        <span className="profil__avatar">{user.avatar}</span>
                        <span className="profil__avatar-badge" title="Profil vérifié">✓</span>
                    </div>
                    <div className="profil__meta">
                        <div className="profil__name-row">
                            <h1 className="profil__name">{user.name}</h1>
                            <span className="badge badge-green">✓ Étudiant vérifié</span>
                        </div>
                        <p className="profil__university">🏫 {user.university}</p>
                        <StarRating rating={user.rating} />
                        <p className="profil__reviews">{user.reviewCount} avis laissés</p>
                    </div>
                    <div className="profil__trust-badge">
                        <span className="profil__trust-icon">🏅</span>
                        <span className="profil__trust-label">{user.badge}</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="profil__stats animate-fade-up animate-fade-up-2">
                    {[
                        { icon: '🍽️', value: user.stats.given, label: 'Plats donnés' },
                        { icon: '🥗', value: user.stats.received, label: 'Repas reçus' },
                        { icon: '🌱', value: `${user.stats.co2Saved} kg`, label: 'CO₂ évité' },
                        { icon: '♻️', value: user.stats.mealsSaved, label: 'Repas sauvés' },
                    ].map(s => (
                        <div key={s.label} className="profil__stat">
                            <span className="profil__stat-icon">{s.icon}</span>
                            <span className="profil__stat-value">{s.value}</span>
                            <span className="profil__stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>

                <div className="profil__grid">
                    {/* History */}
                    <div className="profil__section animate-fade-up animate-fade-up-3">
                        <h2 className="profil__section-title">📋 Historique des échanges</h2>
                        <div className="history-list">
                            {user.history.map(h => (
                                <div key={h.id} className="history-item">
                                    <div className={`history-item__type ${h.type}`}>
                                        {h.type === 'given' ? '↑' : '↓'}
                                    </div>
                                    <div className="history-item__info">
                                        <p className="history-item__title">{h.title}</p>
                                        <p className="history-item__meta">
                                            {h.type === 'given' ? 'Donné à' : 'Reçu de'} {h.partner} · {new Date(h.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                    <div className="history-item__rating">
                                        {'⭐'.repeat(h.rating)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="profil__aside">
                        {/* Trust system */}
                        <div className="profil__section animate-fade-up animate-fade-up-4">
                            <h2 className="profil__section-title">🛡️ Système de confiance</h2>
                            <div className="trust-section">
                                <p className="trust-section__desc">
                                    Notre système de réputation communautaire permet à chacun de connaître la fiabilité d'un donneur avant de réserver.
                                </p>
                                <div className="trust-levels">
                                    {[
                                        { level: 'Nouveau membre', emoji: '🌱', desc: '0–5 échanges', active: false },
                                        { level: 'Régulier', emoji: '🌿', desc: '6–15 échanges', active: false },
                                        { level: 'Super Cuisinier', emoji: '🏅', desc: '16+ échanges + note ≥ 4.5', active: true },
                                        { level: 'Écolo du campus', emoji: '🌍', desc: '30+ échanges + note parfaite', active: false },
                                    ].map(l => (
                                        <div key={l.level} className={`trust-level ${l.active ? 'trust-level--active' : ''}`}>
                                            <span className="trust-level__emoji">{l.emoji}</span>
                                            <div>
                                                <p className="trust-level__name">{l.level}</p>
                                                <p className="trust-level__desc">{l.desc}</p>
                                            </div>
                                            {l.active && <span className="badge badge-green" style={{ marginLeft: 'auto' }}>Votre niveau</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Design Thinking note */}
                        <div className="profil__section profil__dt-note animate-fade-up animate-fade-up-5">
                            <h2 className="profil__section-title">🎨 Design Thinking</h2>
                            <div className="dt-note">
                                <p>Ce système de profil est directement issu de notre phase de <strong>prototypage</strong> et <strong>test utilisateur</strong>.</p>
                                <p>En phase d'empathie, nos interviewés ont exprimé le besoin d'un <em>"signal de confiance visible"</em> avant d'accepter un plat. Le badge et les notes répondent exactement à ce frein identifié.</p>
                                <div className="dt-note__phases">
                                    {['Empathie', 'Définition', 'Idéation', 'Prototype', 'Test'].map((p, i) => (
                                        <div key={p} className={`dt-phase ${i < 5 ? 'done' : ''}`}>
                                            <span>✓</span>
                                            <span>{p}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="profil__cta animate-fade-up">
                            <Link to="/publier" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                ➕ Partager un nouveau plat
                            </Link>
                            <Link to="/explorer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                                🔍 Explorer les offres
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
