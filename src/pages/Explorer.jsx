import { useState } from 'react'
import { Link } from 'react-router-dom'
import { mockOffers } from '../data/mockData'
import './Explorer.css'

const CATEGORIES = ['Tous', 'Plat chaud', 'Vegan', 'Végétarien', 'Salade', 'Dessert']
const ALLERGENS_LIST = ['Gluten', 'Lactose', 'Œufs', 'Soja', 'Sésame', 'Fruits à coque', 'Poisson']

function timeLeft(expiresAt) {
    const diff = new Date(expiresAt) - new Date()
    if (diff <= 0) return 'Expiré'
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    return h > 0 ? `${h}h ${m}min` : `${m} min`
}

function StarRating({ rating }) {
    return (
        <span className="stars" aria-label={`Note: ${rating}/5`}>
            {'⭐'.repeat(Math.round(rating))}
            <span style={{ marginLeft: 4, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{rating}</span>
        </span>
    )
}

export default function Explorer() {
    const [category, setCategory] = useState('Tous')
    const [search, setSearch] = useState('')
    const [excludedAllergens, setExcludedAllergens] = useState([])
    const [showFilters, setShowFilters] = useState(false)

    const toggleAllergen = (a) =>
        setExcludedAllergens(prev =>
            prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
        )

    const filtered = mockOffers.filter(o => {
        if (category !== 'Tous' && o.category !== category) return false
        if (search && !o.title.toLowerCase().includes(search.toLowerCase()) &&
            !o.description.toLowerCase().includes(search.toLowerCase())) return false
        if (excludedAllergens.some(a => o.allergens.includes(a))) return false
        return true
    })

    return (
        <div className="explorer">
            <div className="explorer__header">
                <div className="container">
                    <div className="animate-fade-up">
                        <span className="badge badge-green">🔍 {filtered.length} offres disponibles</span>
                        <h1 className="section-title" style={{ marginTop: 12 }}>
                            Les plats du <span className="gradient-text">campus</span>
                        </h1>
                        <p className="section-subtitle" style={{ marginTop: 8 }}>
                            Tous les plats ont été préparés par des étudiants vérifiés et sont conservés dans nos Frigo-Lockers CROUS.
                        </p>
                    </div>

                    {/* Search + Filters */}
                    <div className="explorer__controls animate-fade-up animate-fade-up-2">
                        <input
                            id="search-offers"
                            className="input explorer__search"
                            type="text"
                            placeholder="🔍 Rechercher un plat..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button
                            id="toggle-filters-btn"
                            className={`btn btn-secondary ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            ⚙️ Filtres {excludedAllergens.length > 0 && `(${excludedAllergens.length})`}
                        </button>
                    </div>

                    {/* Categories */}
                    <div className="explorer__cats animate-fade-up animate-fade-up-3">
                        {CATEGORIES.map(c => (
                            <button
                                key={c}
                                id={`cat-${c.replace(/\s+/g, '-').toLowerCase()}`}
                                className={`cat-btn ${category === c ? 'active' : ''}`}
                                onClick={() => setCategory(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    {/* Allergen filters */}
                    {showFilters && (
                        <div className="explorer__allergens animate-fade-up">
                            <p className="label">Exclure les allergènes :</p>
                            <div className="allergen-chips">
                                {ALLERGENS_LIST.map(a => (
                                    <button
                                        key={a}
                                        id={`allergen-${a.toLowerCase().replace(/\s+/g, '-')}`}
                                        className={`allergen-chip ${excludedAllergens.includes(a) ? 'excluded' : ''}`}
                                        onClick={() => toggleAllergen(a)}
                                    >
                                        {excludedAllergens.includes(a) ? '✕ ' : ''}{a}
                                    </button>
                                ))}
                            </div>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>
                                💡 Les plats contenant ces allergènes seront masqués.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Grid */}
            <div className="container">
                {filtered.length === 0 ? (
                    <div className="explorer__empty">
                        <span>😕</span>
                        <p>Aucune offre ne correspond à tes critères.</p>
                        <button className="btn btn-secondary" onClick={() => { setCategory('Tous'); setSearch(''); setExcludedAllergens([]) }}>
                            Réinitialiser les filtres
                        </button>
                    </div>
                ) : (
                    <div className="offers-grid">
                        {filtered.map((offer, i) => (
                            <Link
                                key={offer.id}
                                to={`/offre/${offer.id}`}
                                id={`offer-card-${offer.id}`}
                                className={`offer-card card animate-fade-up animate-fade-up-${Math.min(i + 1, 6)} ${offer.reserved ? 'offer-card--reserved' : ''}`}
                            >
                                {/* Image placeholder */}
                                <div className="offer-card__image">
                                    <span className="offer-card__emoji">{offer.emoji}</span>
                                    <span className="offer-card__status-badge" style={{ background: offer.reserved ? '#f59e0b22' : '#10b98122', color: offer.reserved ? '#fbbf24' : '#34d399', borderColor: offer.reserved ? '#fbbf2455' : '#10b98155' }}>
                                        {offer.reserved ? '🔒 Réservé' : '✅ Disponible'}
                                    </span>
                                    <span className="offer-card__cat-badge" style={{ background: offer.categoryColor + '22', color: offer.categoryColor }}>
                                        {offer.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="offer-card__body">
                                    <h3 className="offer-card__title">{offer.title}</h3>
                                    <p className="offer-card__desc">{offer.description}</p>

                                    <div className="offer-card__meta">
                                        <span className="offer-card__locker">📍 {offer.locker.name}</span>
                                        <div className="offer-card__info-row">
                                            {offer.isVegetarian && <span className="tag">🌿 Végé</span>}
                                            {offer.isCold ? <span className="tag">❄️ Froid</span> : <span className="tag">🌡️ Chaud</span>}
                                            <span className="tag">👤 {offer.portions} portion{offer.portions > 1 ? 's' : ''}</span>
                                        </div>
                                    </div>

                                    <div className="offer-card__footer">
                                        <div className="offer-card__donor">
                                            <span className="offer-card__avatar">{offer.donor.avatar}</span>
                                            <div>
                                                <p className="offer-card__donor-name">{offer.donor.name}</p>
                                                <StarRating rating={offer.donor.rating} />
                                            </div>
                                        </div>
                                        <div className="offer-card__expire">
                                            <span className="offer-card__expire-icon">⏱️</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                                                {timeLeft(offer.expiresAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
