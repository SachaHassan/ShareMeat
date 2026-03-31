import { useState } from 'react'
import { Link } from 'react-router-dom'
import { mockOffers, mockProducts } from '../data/mockData'
import './Explorer.css'

/* ─── OFFERS ─── */
const MEAL_CATEGORIES = ['Tous', 'Plat chaud', 'Vegan', 'Végétarien', 'Salade', 'Dessert']
const ALLERGENS_LIST = ['Gluten', 'Lactose', 'Œufs', 'Soja', 'Sésame', 'Fruits à coque', 'Poisson']

/* ─── PRODUCTS ─── */
const PRODUCT_CATEGORIES = ['Tous', 'Sec', 'Conserve', 'Légumes', 'Boissons', 'Épices', 'Petit-déjeuner']

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

/* ═══════════════════════════════════════
   TAB: Plats cuisinés
═══════════════════════════════════════ */
function MealsTab() {
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
        <>
            {/* Controls */}
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
                {MEAL_CATEGORIES.map(c => (
                    <button
                        key={c}
                        id={`cat-meal-${c.replace(/\s+/g, '-').toLowerCase()}`}
                        className={`cat-btn ${category === c ? 'active' : ''}`}
                        onClick={() => setCategory(c)}
                    >{c}</button>
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

            {/* Grid */}
            <div style={{ marginTop: 32 }}>
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
                                <div className="offer-card__image">
                                    <span className="offer-card__emoji">{offer.emoji}</span>
                                    <span className="offer-card__status-badge" style={{ background: offer.reserved ? '#f59e0b22' : '#10b98122', color: offer.reserved ? '#fbbf24' : '#34d399', borderColor: offer.reserved ? '#fbbf2455' : '#10b98155' }}>
                                        {offer.reserved ? '🔒 Réservé' : '✅ Disponible'}
                                    </span>
                                    <span className="offer-card__cat-badge" style={{ background: offer.categoryColor + '22', color: offer.categoryColor }}>
                                        {offer.category}
                                    </span>
                                </div>
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
        </>
    )
}

/* ═══════════════════════════════════════
   TAB: Garde-Manger (Produits)
═══════════════════════════════════════ */
function PantryTab() {
    const [category, setCategory] = useState('Tous')
    const [search, setSearch] = useState('')

    const filtered = mockProducts.filter(p => {
        if (category !== 'Tous' && p.category !== category) return false
        if (search && !p.title.toLowerCase().includes(search.toLowerCase()) &&
            !p.description.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    return (
        <>
            {/* Controls */}
            <div className="explorer__controls animate-fade-up animate-fade-up-2">
                <input
                    id="search-products"
                    className="input explorer__search"
                    type="text"
                    placeholder="🔍 Rechercher un produit (pâtes, riz, maïs...)"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <Link to="/publier-produit" className="btn btn-primary">
                    ➕ Partager un produit
                </Link>
            </div>

            {/* Categories */}
            <div className="explorer__cats animate-fade-up animate-fade-up-3">
                {PRODUCT_CATEGORIES.map(c => (
                    <button
                        key={c}
                        id={`cat-product-${c.toLowerCase().replace(/\s+/g, '-')}`}
                        className={`cat-btn ${category === c ? 'active' : ''}`}
                        onClick={() => setCategory(c)}
                    >{c}</button>
                ))}
            </div>

            {/* Grid */}
            <div style={{ marginTop: 32 }}>
                {filtered.length === 0 ? (
                    <div className="explorer__empty">
                        <span>🥫</span>
                        <p>Aucun produit ne correspond à tes critères.</p>
                        <button className="btn btn-secondary" onClick={() => { setCategory('Tous'); setSearch('') }}>
                            Réinitialiser
                        </button>
                    </div>
                ) : (
                    <div className="products-grid echanges-products-grid">
                        {filtered.map(product => (
                            <div key={product.id} className="product-card">
                                <div className="product-card__header">
                                    <div className="product-card__emoji">{product.emoji}</div>
                                    <div className="product-card__badges">
                                        <span className="badge-small">{product.category}</span>
                                        {product.reserved && <span className="badge" style={{ background: '#f59e0b22', color: '#fbbf24', border: '1px solid #fbbf2455' }}>🔒 Réservé</span>}
                                    </div>
                                </div>
                                <div className="product-card__content">
                                    <h3 className="product-card__title">{product.title}</h3>
                                    <p className="product-card__desc">{product.description}</p>
                                    <div className="product-card__meta">
                                        <div className="meta-item">
                                            <span className="meta-icon">📍</span>
                                            <span>{product.locker.name}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-icon">⌛</span>
                                            <span>Expire le {new Date(product.expiresAt).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="product-card__footer">
                                    <div className="product-donor">
                                        <span className="donor-avatar">{product.donor.avatar}</span>
                                        <div className="donor-info">
                                            <p>{product.donor.name}</p>
                                            <div className="donor-rating">{'⭐'.repeat(Math.floor(product.donor.rating))} <span>{product.donor.rating}</span></div>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-outline-amber"
                                        disabled={product.reserved}
                                        onClick={() => !product.reserved && alert(`Réservation de "${product.title}" confirmée ! Récupère-le au ${product.locker.name}.`)}
                                    >
                                        {product.reserved ? 'Réservé' : 'Récupérer'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function Explorer() {
    const [activeTab, setActiveTab] = useState('meals')

    const totalItems = activeTab === 'meals' ? mockOffers.length : mockProducts.length

    return (
        <div className="explorer">
            <div className="explorer__header">
                <div className="container">
                    <div className="animate-fade-up">
                        <span className="badge badge-green">
                            {activeTab === 'meals' ? '🍽️' : '🥫'} {totalItems} {activeTab === 'meals' ? 'plats disponibles' : 'produits disponibles'}
                        </span>
                        <h1 className="section-title" style={{ marginTop: 12 }}>
                            Explorer le <span className="gradient-text">campus</span>
                        </h1>
                        <p className="section-subtitle" style={{ marginTop: 8 }}>
                            {activeTab === 'meals'
                                ? 'Plats cuisinés par des étudiants vérifiés, conservés dans nos Frigo-Lockers CROUS.'
                                : 'Produits non cuisinés partagés entre étudiants. Secs, conserves, légumes...'}
                        </p>
                    </div>

                    {/* Tab switcher */}
                    <div className="explorer__tabs animate-fade-up animate-fade-up-2">
                        <button
                            id="tab-meals"
                            className={`explorer__tab ${activeTab === 'meals' ? 'active' : ''}`}
                            onClick={() => setActiveTab('meals')}
                        >
                            🍽️ Plats cuisinés
                        </button>
                        <button
                            id="tab-pantry"
                            className={`explorer__tab ${activeTab === 'pantry' ? 'active' : ''}`}
                            onClick={() => setActiveTab('pantry')}
                        >
                            🥫 Garde-Manger
                        </button>
                    </div>
                </div>
            </div>

            <div className="container">
                {activeTab === 'meals' ? <MealsTab /> : <PantryTab />}
            </div>
        </div>
    )
}
