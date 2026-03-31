import { useState } from 'react'
import { Link } from 'react-router-dom'
import { lockers, addOffer, addProduct, mockUser } from '../data/mockData'
import './Publier.css'

/* ─── Config ─── */
const MEAL_STEPS = ['📝 Description', '🥦 Ingrédients', '📍 Dépôt', '✅ Confirmation']
const PRODUCT_STEPS = ['📦 Produit', '📍 Dépôt', '✅ Confirmation']

const ALLERGENS_LIST = ['Gluten', 'Lactose', 'Œufs', 'Soja', 'Sésame', 'Fruits à coque', 'Poisson', 'Crustacés', 'Arachides']
const MEAL_EMOJIS = ['🍝', '🥗', '🍲', '🍳', '🥙', '🍜', '🍱', '🥘', '🍛', '🧆', '🍕', '🍪']
const PRODUCT_EMOJIS = ['🍝', '🌽', '🥔', '🍅', '🍞', '🍚', '🥫', '🥛', '☕', '🧂', '🫙', '🥜']
const PRODUCT_CATEGORIES = ['Sec', 'Conserve', 'Légumes', 'Boissons', 'Épices', 'Petit-déjeuner']

export default function Publier() {
    /* Type selection (null = not chosen yet, 'meal' | 'product') */
    const [shareType, setShareType] = useState(null)
    const [step, setStep] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const [qrCode] = useState(`BF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`)

    /* ── Meal form state ── */
    const [mealForm, setMealForm] = useState({
        title: '', description: '', emoji: '🍝', category: 'Plat chaud',
        portions: 1, ingredients: '', allergens: [], isVegetarian: false,
        lockerId: '', expiresIn: '4',
    })

    /* ── Product form state ── */
    const [productForm, setProductForm] = useState({
        title: '', description: '', emoji: '🥫', category: 'Sec',
        lockerId: '', expiresAt: '',
    })

    const updateMeal = (f, v) => setMealForm(prev => ({ ...prev, [f]: v }))
    const updateProduct = (f, v) => setProductForm(prev => ({ ...prev, [f]: v }))
    const toggleAllergen = (a) => setMealForm(prev => ({
        ...prev,
        allergens: prev.allergens.includes(a)
            ? prev.allergens.filter(x => x !== a)
            : [...prev.allergens, a]
    }))

    /* ── Validation ── */
    const canNext = () => {
        if (shareType === 'meal') {
            if (step === 0) return mealForm.title.length >= 3 && mealForm.description.length >= 10
            if (step === 1) return mealForm.ingredients.length >= 3
            if (step === 2) return mealForm.lockerId !== ''
        }
        if (shareType === 'product') {
            if (step === 0) return productForm.title.length >= 3 && productForm.description.length >= 5
            if (step === 1) return productForm.lockerId !== '' && productForm.expiresAt !== ''
        }
        return true
    }

    const STEPS = shareType === 'meal' ? MEAL_STEPS : PRODUCT_STEPS
    const maxStep = STEPS.length - 1

    /* ── Submit ── */
    const handleSubmit = () => {
        if (shareType === 'meal') {
            addOffer({
                id: `offer-${Date.now()}`,
                title: mealForm.title,
                description: mealForm.description,
                image: null,
                emoji: mealForm.emoji,
                category: mealForm.category,
                categoryColor: mealForm.category === 'Vegan' ? '#10b981' :
                    mealForm.category === 'Dessert' ? '#f59e0b' :
                    mealForm.category === 'Salade' ? '#06b6d4' :
                    mealForm.category === 'Plat chaud' ? '#f97316' : '#8b5cf6',
                donor: {
                    id: mockUser.id,
                    name: mockUser.name.split(' ')[0] + ' ' + mockUser.name.split(' ')[1][0] + '.',
                    avatar: mockUser.avatar, rating: mockUser.rating,
                    reviewCount: mockUser.reviewCount, badge: mockUser.badge,
                },
                preparedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + parseInt(mealForm.expiresIn) * 3600000).toISOString(),
                locker: lockers.find(l => l.id === mealForm.lockerId),
                ingredients: mealForm.ingredients.split(',').map(i => i.trim()).filter(Boolean),
                allergens: mealForm.allergens,
                isVegetarian: mealForm.isVegetarian,
                isCold: mealForm.category === 'Salade' || mealForm.category === 'Dessert',
                portions: mealForm.portions,
                reserved: false,
            })
        } else {
            addProduct({
                id: `product-${Date.now()}`,
                title: productForm.title,
                description: productForm.description,
                emoji: productForm.emoji,
                category: productForm.category,
                donor: {
                    id: mockUser.id,
                    name: mockUser.name.split(' ')[0] + ' ' + mockUser.name.split(' ')[1][0] + '.',
                    avatar: mockUser.avatar, rating: mockUser.rating,
                },
                expiresAt: productForm.expiresAt,
                locker: lockers.find(l => l.id === productForm.lockerId),
                reserved: false,
            })
        }
        setSubmitted(true)
    }

    /* ─────────────────────────────────
       SUCCESS SCREEN
    ───────────────────────────────── */
    if (submitted) {
        const lockerName = shareType === 'meal'
            ? lockers.find(l => l.id === mealForm.lockerId)?.name
            : lockers.find(l => l.id === productForm.lockerId)?.name

        return (
            <div className="publier">
                <div className="container">
                    <div className="publier__success animate-fade-up">
                        <div className="success-icon">🎉</div>
                        <h2>{shareType === 'meal' ? 'Plat déposé avec succès !' : 'Produit ajouté au Garde-Manger !'}</h2>
                        <p>Rends-toi au locker <strong>{lockerName}</strong> et scanne ce QR code.</p>
                        <div className="success-qr">
                            <svg viewBox="0 0 100 100" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                                <rect x="5" y="5" width="28" height="28" rx="3" fill="none" stroke="var(--primary)" strokeWidth="3" />
                                <rect x="10" y="10" width="18" height="18" rx="1" fill="var(--primary)" />
                                <rect x="67" y="5" width="28" height="28" rx="3" fill="none" stroke="var(--primary)" strokeWidth="3" />
                                <rect x="72" y="10" width="18" height="18" rx="1" fill="var(--primary)" />
                                <rect x="5" y="67" width="28" height="28" rx="3" fill="none" stroke="var(--primary)" strokeWidth="3" />
                                <rect x="10" y="72" width="18" height="18" rx="1" fill="var(--primary)" />
                            </svg>
                            <p className="qr-code__label">{qrCode}</p>
                        </div>
                        <div className="success-summary">
                            <div className="success-summary__row"><span>{shareType === 'meal' ? '🍽️' : '📦'}</span><span>{shareType === 'meal' ? mealForm.emoji + ' ' + mealForm.title : productForm.emoji + ' ' + productForm.title}</span></div>
                            <div className="success-summary__row"><span>📍</span><span>{lockerName}</span></div>
                            <div className="success-summary__row"><span>⏰</span><span>{shareType === 'meal' ? `Retrait avant ${mealForm.expiresIn}h` : `Expire le ${new Date(productForm.expiresAt).toLocaleDateString()}`}</span></div>
                        </div>
                        <div className="success-actions">
                            <Link to="/explorer" className="btn btn-primary">🔍 Voir les annonces</Link>
                            <Link to="/profil" className="btn btn-secondary">👤 Mon profil</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    /* ─────────────────────────────────
       TYPE SELECTION SCREEN
    ───────────────────────────────── */
    if (!shareType) {
        return (
            <div className="publier">
                <div className="container">
                    <div className="publier__header animate-fade-up">
                        <span className="badge badge-green">➕ Partager</span>
                        <h1 className="section-title" style={{ marginTop: 12 }}>
                            Que veux-tu <span className="gradient-text">partager</span> ?
                        </h1>
                        <p className="section-subtitle" style={{ marginTop: 8 }}>
                            Choisis le type de partage pour accéder au bon formulaire.
                        </p>
                    </div>

                    <div className="share-type-grid animate-fade-up animate-fade-up-2">
                        <button
                            id="share-type-meal"
                            className="share-type-card"
                            onClick={() => setShareType('meal')}
                        >
                            <div className="share-type-card__icon">🍽️</div>
                            <h3 className="share-type-card__title">Plat cuisiné</h3>
                            <p className="share-type-card__desc">
                                Tu as cuisiné en trop grande quantité ? Partage ton plat avec les autres étudiants du campus.
                            </p>
                            <div className="share-type-card__tags">
                                <span className="tag">🥗 Repas complets</span>
                                <span className="tag">⏱️ Durée limitée</span>
                                <span className="tag">🌡️ Chaud / Froid</span>
                            </div>
                            <span className="share-type-card__cta btn btn-primary" style={{ marginTop: 24 }}>
                                Partager un plat →
                            </span>
                        </button>

                        <button
                            id="share-type-product"
                            className="share-type-card share-type-card--amber"
                            onClick={() => setShareType('product')}
                        >
                            <div className="share-type-card__icon">🥫</div>
                            <h3 className="share-type-card__title">Produit du Garde-Manger</h3>
                            <p className="share-type-card__desc">
                                Un paquet de pâtes, une conserve inutilisée ? Donne-le plutôt que de le jeter !
                            </p>
                            <div className="share-type-card__tags">
                                <span className="tag">📦 Longue conservation</span>
                                <span className="tag">🌾 Sec / Conserve</span>
                                <span className="tag">🥕 Légumes</span>
                            </div>
                            <span className="share-type-card__cta btn btn-amber" style={{ marginTop: 24 }}>
                                Partager un produit →
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    /* ─────────────────────────────────
       FORM SCREEN
    ───────────────────────────────── */
    return (
        <div className="publier">
            <div className="container">
                {/* Header */}
                <div className="publier__header animate-fade-up">
                    <button className="publier__back" onClick={() => { setShareType(null); setStep(0) }}>
                        ← Changer le type
                    </button>
                    <span className="badge badge-green">
                        {shareType === 'meal' ? '🍽️ Plat cuisiné' : '🥫 Produit du Garde-Manger'}
                    </span>
                    <h1 className="section-title" style={{ marginTop: 12 }}>
                        {shareType === 'meal' ? <>Dépose ton <span className="gradient-text">plat</span></> : <>Ajouter au <span className="gradient-text">Garde-Manger</span></>}
                    </h1>
                </div>

                {/* Stepper */}
                <div className="stepper animate-fade-up animate-fade-up-2">
                    {STEPS.map((s, i) => (
                        <div key={i} className={`stepper__item ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
                            <div className="stepper__dot">{i < step ? '✓' : i + 1}</div>
                            <span className="stepper__label">{s}</span>
                            {i < STEPS.length - 1 && <div className="stepper__line"></div>}
                        </div>
                    ))}
                </div>

                {/* Form */}
                <div className="publier__form animate-fade-up animate-fade-up-3">

                    {/* ═══ MEAL STEPS ═══ */}
                    {shareType === 'meal' && step === 0 && (
                        <div className="form-step">
                            <h3 className="form-step__title">📝 Présente ton plat</h3>
                            <div className="form-group">
                                <label className="label">Choisis un emoji</label>
                                <div className="emoji-picker">
                                    {MEAL_EMOJIS.map(e => (
                                        <button key={e} className={`emoji-btn ${mealForm.emoji === e ? 'active' : ''}`} onClick={() => updateMeal('emoji', e)}>{e}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="label" htmlFor="meal-title">Nom du plat *</label>
                                <input id="meal-title" className="input" type="text" placeholder="Ex: Lasagnes bolognaise maison" value={mealForm.title} onChange={e => updateMeal('title', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="label" htmlFor="meal-desc">Description *</label>
                                <textarea id="meal-desc" className="input" rows={3} placeholder="Décris ton plat..." value={mealForm.description} onChange={e => updateMeal('description', e.target.value)} style={{ resize: 'vertical' }} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label" htmlFor="meal-cat">Catégorie</label>
                                    <select id="meal-cat" className="input" value={mealForm.category} onChange={e => updateMeal('category', e.target.value)}>
                                        {['Plat chaud', 'Vegan', 'Végétarien', 'Salade', 'Dessert', 'Soupe', 'Autre'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="label" htmlFor="meal-portions">Portions</label>
                                    <input id="meal-portions" className="input" type="number" min={1} max={10} value={mealForm.portions} onChange={e => updateMeal('portions', parseInt(e.target.value))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="label">
                                    <input type="checkbox" checked={mealForm.isVegetarian} onChange={e => updateMeal('isVegetarian', e.target.checked)} style={{ marginRight: 8 }} />
                                    🌿 Ce plat est végétarien / vegan
                                </label>
                            </div>
                        </div>
                    )}

                    {shareType === 'meal' && step === 1 && (
                        <div className="form-step">
                            <h3 className="form-step__title">🥦 Ingrédients & Allergènes</h3>
                            <p className="form-step__desc">La transparence, c'est notre pilier. Ces infos permettent aux receveurs de décider en confiance.</p>
                            <div className="form-group">
                                <label className="label" htmlFor="meal-ingredients">Liste des ingrédients *</label>
                                <textarea id="meal-ingredients" className="input" rows={4} placeholder="Ex: Pâtes, bœuf haché, tomates, oignons..." value={mealForm.ingredients} onChange={e => updateMeal('ingredients', e.target.value)} style={{ resize: 'vertical' }} />
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>Sépare par des virgules</p>
                            </div>
                            <div className="form-group">
                                <label className="label">⚠️ Allergènes présents</label>
                                <div className="allergen-grid">
                                    {ALLERGENS_LIST.map(a => (
                                        <label key={a} className={`allergen-toggle ${mealForm.allergens.includes(a) ? 'checked' : ''}`}>
                                            <input type="checkbox" checked={mealForm.allergens.includes(a)} onChange={() => toggleAllergen(a)} style={{ display: 'none' }} />
                                            {mealForm.allergens.includes(a) ? '⚠️' : '○'} {a}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {shareType === 'meal' && step === 2 && (
                        <div className="form-step">
                            <h3 className="form-step__title">📍 Choisis un Frigo-Locker</h3>
                            <div className="locker-options">
                                {lockers.map(l => (
                                    <button key={l.id} id={`locker-${l.id}`} className={`locker-option ${mealForm.lockerId === l.id ? 'selected' : ''} ${l.available === 0 ? 'full' : ''}`}
                                        onClick={() => l.available > 0 && updateMeal('lockerId', l.id)} disabled={l.available === 0}>
                                        <div className="locker-option__icon">🏬</div>
                                        <div className="locker-option__info">
                                            <p className="locker-option__name">{l.name}</p>
                                            <p className="locker-option__slots">{l.available > 0 ? `${l.available} casier${l.available > 1 ? 's' : ''} disponible${l.available > 1 ? 's' : ''} sur ${l.slots}` : '❌ Complet'}</p>
                                        </div>
                                        {mealForm.lockerId === l.id && <span className="locker-option__check">✓</span>}
                                    </button>
                                ))}
                            </div>
                            <div className="form-group" style={{ marginTop: 20 }}>
                                <label className="label" htmlFor="expires-in">⏰ Délai de retrait maximum</label>
                                <select id="expires-in" className="input" value={mealForm.expiresIn} onChange={e => updateMeal('expiresIn', e.target.value)}>
                                    <option value="2">2 heures</option>
                                    <option value="4">4 heures</option>
                                    <option value="6">6 heures</option>
                                    <option value="24">Demain (24h)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {shareType === 'meal' && step === 3 && (
                        <div className="form-step">
                            <h3 className="form-step__title">✅ Récapitulatif</h3>
                            <p className="form-step__desc">Vérifie avant de valider.</p>
                            <div className="recap-card">
                                <div className="recap-emoji">{mealForm.emoji}</div>
                                <div className="recap-info"><h4>{mealForm.title}</h4><p>{mealForm.description}</p></div>
                            </div>
                            <div className="recap-rows">
                                <div className="recap-row"><span>📦 Catégorie</span><strong>{mealForm.category}</strong></div>
                                <div className="recap-row"><span>👤 Portions</span><strong>{mealForm.portions}</strong></div>
                                <div className="recap-row"><span>🌿 Végétarien</span><strong>{mealForm.isVegetarian ? 'Oui' : 'Non'}</strong></div>
                                <div className="recap-row"><span>⚠️ Allergènes</span><strong>{mealForm.allergens.length > 0 ? mealForm.allergens.join(', ') : 'Aucun déclaré'}</strong></div>
                                <div className="recap-row"><span>📍 Locker</span><strong>{lockers.find(l => l.id === mealForm.lockerId)?.name}</strong></div>
                                <div className="recap-row"><span>⏰ Délai</span><strong>{mealForm.expiresIn} heures</strong></div>
                            </div>
                            <div className="recap-commitment"><span>🤝</span><p>Je certifie que ce plat a été préparé dans des conditions d'hygiène satisfaisantes.</p></div>
                        </div>
                    )}

                    {/* ═══ PRODUCT STEPS ═══ */}
                    {shareType === 'product' && step === 0 && (
                        <div className="form-step">
                            <h3 className="form-step__title">📦 Décris le produit</h3>
                            <div className="form-group">
                                <label className="label">Emoji représentatif</label>
                                <div className="emoji-picker">
                                    {PRODUCT_EMOJIS.map(e => (
                                        <button key={e} type="button" className={`emoji-btn ${productForm.emoji === e ? 'active' : ''}`} onClick={() => updateProduct('emoji', e)}>{e}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="label" htmlFor="prod-title">Nom du produit *</label>
                                <input id="prod-title" className="input" type="text" placeholder="Ex: Paquet de riz 1kg (neuf)" value={productForm.title} onChange={e => updateProduct('title', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="label" htmlFor="prod-desc">Description & État *</label>
                                <textarea id="prod-desc" className="input" rows={3} placeholder="Précise si le paquet est ouvert ou fermé, le poids approximatif..." value={productForm.description} onChange={e => updateProduct('description', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="label" htmlFor="prod-cat">Catégorie</label>
                                <select id="prod-cat" className="input" value={productForm.category} onChange={e => updateProduct('category', e.target.value)}>
                                    {PRODUCT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    )}

                    {shareType === 'product' && step === 1 && (
                        <div className="form-step">
                            <h3 className="form-step__title">📍 Dépôt & Date limite</h3>
                            <div className="form-group">
                                <label className="label" htmlFor="prod-expire">📅 Date de péremption *</label>
                                <input id="prod-expire" className="input" type="date" value={productForm.expiresAt} onChange={e => updateProduct('expiresAt', e.target.value)} />
                            </div>
                            <div className="locker-options">
                                {lockers.map(l => (
                                    <button key={l.id} id={`locker-prod-${l.id}`} className={`locker-option ${productForm.lockerId === l.id ? 'selected' : ''} ${l.available === 0 ? 'full' : ''}`}
                                        onClick={() => l.available > 0 && updateProduct('lockerId', l.id)} disabled={l.available === 0}>
                                        <div className="locker-option__icon">🏬</div>
                                        <div className="locker-option__info">
                                            <p className="locker-option__name">{l.name}</p>
                                            <p className="locker-option__slots">{l.available > 0 ? `${l.available} casier${l.available > 1 ? 's' : ''} disponible${l.available > 1 ? 's' : ''} sur ${l.slots}` : '❌ Complet'}</p>
                                        </div>
                                        {productForm.lockerId === l.id && <span className="locker-option__check">✓</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {shareType === 'product' && step === 2 && (
                        <div className="form-step">
                            <h3 className="form-step__title">✅ Récapitulatif</h3>
                            <div className="recap-card">
                                <div className="recap-emoji">{productForm.emoji}</div>
                                <div className="recap-info"><h4>{productForm.title}</h4><p>{productForm.description}</p></div>
                            </div>
                            <div className="recap-rows">
                                <div className="recap-row"><span>📦 Catégorie</span><strong>{productForm.category}</strong></div>
                                <div className="recap-row"><span>📍 Locker</span><strong>{lockers.find(l => l.id === productForm.lockerId)?.name}</strong></div>
                                <div className="recap-row"><span>📅 Expire le</span><strong>{new Date(productForm.expiresAt).toLocaleDateString()}</strong></div>
                            </div>
                            <div className="recap-commitment"><span>🤝</span><p>Je certifie que ce produit est encore consommable et en bon état.</p></div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="form-nav">
                        {step > 0 && (
                            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
                                ← Précédent
                            </button>
                        )}
                        {step < maxStep ? (
                            <button id="next-step-btn" className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canNext()} style={{ marginLeft: 'auto', opacity: canNext() ? 1 : 0.5 }}>
                                Suivant →
                            </button>
                        ) : (
                            <button id="submit-btn" className="btn btn-primary" onClick={handleSubmit} style={{ marginLeft: 'auto' }}>
                                🚀 Valider & Déposer
                            </button>
                        )}
                    </div>
                </div>

                {/* Info box */}
                <div className="publier__info animate-fade-up animate-fade-up-4">
                    <div className="info-item"><span>🔒</span><p>Tes informations sont vérifiées via ta carte étudiante</p></div>
                    <div className="info-item"><span>🌡️</span><p>La chaîne du froid est maintenue par le Frigo-Locker</p></div>
                    <div className="info-item"><span>⭐</span><p>Tu seras noté(e) après chaque échange réussi</p></div>
                </div>
            </div>
        </div>
    )
}
