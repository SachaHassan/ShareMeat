import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { mockOffers } from '../data/mockData'
import './OffreDetail.css'

function QRCodeMock({ code }) {
    // A decorative SVG QR code look-alike
    return (
        <div className="qr-container">
            <div className="qr-code" aria-label="QR Code de réservation">
                <svg viewBox="0 0 100 100" width="160" height="160" xmlns="http://www.w3.org/2000/svg">
                    {/* Corner squares */}
                    <rect x="5" y="5" width="28" height="28" rx="3" fill="none" stroke="#10b981" strokeWidth="3" />
                    <rect x="10" y="10" width="18" height="18" rx="1" fill="#10b981" />
                    <rect x="67" y="5" width="28" height="28" rx="3" fill="none" stroke="#10b981" strokeWidth="3" />
                    <rect x="72" y="10" width="18" height="18" rx="1" fill="#10b981" />
                    <rect x="5" y="67" width="28" height="28" rx="3" fill="none" stroke="#10b981" strokeWidth="3" />
                    <rect x="10" y="72" width="18" height="18" rx="1" fill="#10b981" />
                    {/* Data modules */}
                    {[40, 44, 48, 52, 56, 60, 40, 60, 40, 60, 40, 44, 52, 56, 60].map((x, i) => (
                        <rect key={i} x={x} y={[5, 5, 5, 5, 5, 5, 9, 9, 13, 13, 17, 17, 17, 17, 17][i]} width="4" height="4" fill="#10b981" opacity="0.9" />
                    ))}
                    {[5, 9, 13, 17, 21, 25, 5, 25, 5, 25, 40, 44, 48, 52, 56, 60, 40, 60].map((y, i) => (
                        <rect key={'v' + i} x={[40, 40, 40, 40, 40, 40, 60, 60, 56, 56, 40, 44, 48, 52, 40, 40, 60, 56][i]} y={y} width="4" height="4" fill="#10b981" opacity="0.7" />
                    ))}
                    {/* Center data */}
                    {Array.from({ length: 16 }).map((_, i) => (
                        <rect key={'c' + i} x={40 + (i % 4) * 6} y={40 + Math.floor(i / 4) * 6} width="4" height="4" rx="1" fill={Math.random() > 0.4 ? "#10b981" : "transparent"} opacity="0.85" />
                    ))}
                </svg>
                <p className="qr-code__label">Code : {code}</p>
            </div>
        </div>
    )
}

export default function OffreDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const offer = mockOffers.find(o => o.id === id)
    const [reserved, setReserved] = useState(false)
    const [showQR, setShowQR] = useState(false)

    if (!offer) {
        return (
            <div className="offer-detail offer-detail--notfound">
                <div className="container">
                    <div>
                        <span style={{ fontSize: '3rem' }}>😕</span>
                        <h2>Offre introuvable</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Cette offre n'existe pas ou a expiré.</p>
                        <Link to="/explorer" className="btn btn-primary" style={{ marginTop: 20 }}>← Retour aux offres</Link>
                    </div>
                </div>
            </div>
        )
    }

    const handleReserve = () => {
        setReserved(true)
        setShowQR(true)
    }

    return (
        <div className="offer-detail">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="offer-detail__breadcrumb animate-fade-up">
                    <Link to="/explorer">← Retour aux offres</Link>
                    <span>›</span>
                    <span>{offer.title}</span>
                </nav>

                <div className="offer-detail__grid">
                    {/* LEFT */}
                    <div className="offer-detail__left animate-fade-up">
                        {/* Image */}
                        <div className="offer-detail__image">
                            <span className="offer-detail__emoji">{offer.emoji}</span>
                            <div className="offer-detail__badges-overlay">
                                {offer.isVegetarian && <span className="badge badge-green">🌿 Végétarien</span>}
                                {offer.isCold
                                    ? <span className="badge badge-cyan">❄️ Conservation froide</span>
                                    : <span className="badge badge-orange">🌡️ Plat chaud</span>}
                            </div>
                        </div>

                        {/* Donor card */}
                        <div className="donor-card">
                            <div className="donor-card__header">
                                <span className="donor-card__avatar">{offer.donor.avatar}</span>
                                <div>
                                    <p className="donor-card__name">{offer.donor.name}</p>
                                    <div className="stars" style={{ fontSize: '0.85rem' }}>
                                        {'⭐'.repeat(Math.round(offer.donor.rating))}
                                        <span style={{ marginLeft: 4, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                            {offer.donor.rating} ({offer.donor.reviewCount} avis)
                                        </span>
                                    </div>
                                </div>
                                <span className="badge badge-green" style={{ marginLeft: 'auto' }}>
                                    ✓ Vérifié
                                </span>
                            </div>
                            <div className="donor-card__badge">
                                🏅 {offer.donor.badge}
                            </div>
                        </div>

                        {/* Locker info */}
                        <div className="locker-info-card">
                            <h4>📍 Où récupérer ?</h4>
                            <p className="locker-info-card__name">{offer.locker.name}</p>
                            <p className="locker-info-card__address">{offer.locker.address}</p>
                            <p className="locker-info-card__slot">
                                Casier <strong>{offer.locker.id}</strong>
                            </p>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="offer-detail__right animate-fade-up animate-fade-up-2">
                        <div className="offer-detail__title-row">
                            <div>
                                <span className="badge" style={{ background: offer.categoryColor + '22', color: offer.categoryColor, border: `1px solid ${offer.categoryColor}55` }}>
                                    {offer.category}
                                </span>
                                <h1 className="offer-detail__title">{offer.title}</h1>
                            </div>
                            <div className="offer-detail__portions">
                                <span>👤</span>
                                <span>{offer.portions} portion{offer.portions > 1 ? 's' : ''}</span>
                            </div>
                        </div>

                        <p className="offer-detail__description">{offer.description}</p>

                        {/* Sanitary sheet - the Design Thinking trust element */}
                        <div className="sanitary-sheet">
                            <h3 className="sanitary-sheet__title">
                                🩺 Fiche Sanitaire Transparente
                            </h3>
                            <div className="sanitary-sheet__row">
                                <span>🕐 Préparé le</span>
                                <strong>{new Date(offer.preparedAt).toLocaleString('fr-FR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}</strong>
                            </div>
                            <div className="sanitary-sheet__row">
                                <span>⏰ À retirer avant</span>
                                <strong>{new Date(offer.expiresAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</strong>
                            </div>

                            <div className="sanitary-sheet__section">
                                <p className="label">Ingrédients</p>
                                <div className="ingredients-list">
                                    {offer.ingredients.map(ing => (
                                        <span key={ing} className="tag">{ing}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="sanitary-sheet__section">
                                <p className="label">⚠️ Allergènes présents</p>
                                <div className="allergens-list">
                                    {offer.allergens.length === 0
                                        ? <span className="badge badge-green">Aucun allergène majeur</span>
                                        : offer.allergens.map(a => (
                                            <span key={a} className="allergen-warning">{a}</span>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Reserve CTA */}
                        {!reserved ? (
                            <div className="offer-detail__cta">
                                {offer.reserved
                                    ? (
                                        <div className="offer-detail__reserved-msg">
                                            🔒 Ce plat a déjà été réservé par un autre étudiant.
                                        </div>
                                    )
                                    : (
                                        <button
                                            id="reserve-btn"
                                            className="btn btn-primary btn-lg offer-detail__reserve-btn"
                                            onClick={handleReserve}
                                        >
                                            🔓 Réserver ce plat
                                        </button>
                                    )
                                }
                                <p className="offer-detail__cta-note">
                                    Un QR code sécurisé sera généré pour déverrouiller le casier.
                                </p>
                            </div>
                        ) : (
                            <div className="offer-detail__confirmed animate-fade-up">
                                <div className="confirmed-banner">
                                    <span>🎉</span>
                                    <div>
                                        <h4>Réservation confirmée !</h4>
                                        <p>Scanne ce QR code au Frigo-Locker pour récupérer ton plat.</p>
                                    </div>
                                </div>
                                <QRCodeMock code={`BF-${offer.id}-${Date.now().toString(36).toUpperCase()}`} />
                                <p className="qr-instructions">
                                    📱 Présente ce QR code devant le lecteur du casier <strong>{offer.locker.id}</strong><br />
                                    ⏰ Valid jusqu'a {new Date(offer.expiresAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}<br />
                                    🔐 Usage unique – ne partage pas ce code
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
