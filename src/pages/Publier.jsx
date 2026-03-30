import { useState } from 'react'
import { Link } from 'react-router-dom'
import { lockers, addOffer, mockUser } from '../data/mockData'
import './Publier.css'

const STEPS = ['📝 Description', '🥦 Ingrédients', '📍 Dépôt', '✅ Confirmation']

const ALLERGENS_LIST = ['Gluten', 'Lactose', 'Œufs', 'Soja', 'Sésame', 'Fruits à coque', 'Poisson', 'Crustacés', 'Arachides']
const EMOJIS = ['🍝', '🥗', '🍲', '🍳', '🥙', '🍜', '🍱', '🥘', '🍛', '🧆', '🍕', '🍪']

export default function Publier() {
    const [step, setStep] = useState(0)
    const [form, setForm] = useState({
        title: '',
        description: '',
        emoji: '🍝',
        category: 'Plat chaud',
        portions: 1,
        ingredients: '',
        allergens: [],
        isVegetarian: false,
        lockerId: '',
        expiresIn: '4',
    })
    const [submitted, setSubmitted] = useState(false)
    const [qrCode] = useState(`BF-NEW-${Math.random().toString(36).substr(2, 8).toUpperCase()}`)

    const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

    const toggleAllergen = (a) =>
        setForm(f => ({
            ...f,
            allergens: f.allergens.includes(a)
                ? f.allergens.filter(x => x !== a)
                : [...f.allergens, a]
        }))

    const canNext = () => {
        if (step === 0) return form.title.length >= 3 && form.description.length >= 10
        if (step === 1) return form.ingredients.length >= 3
        if (step === 2) return form.lockerId !== ''
        return true
    }

    const handleSubmit = () => {
        // Generate a new ID
        const newId = `offer-new-${Date.now()}`

        // Create new offer based on form state
        const newOffer = {
            id: newId,
            title: form.title,
            description: form.description,
            image: null,
            emoji: form.emoji,
            category: form.category,
            categoryColor: form.category === 'Vegan' ? '#10b981' :
                form.category === 'Dessert' ? '#f59e0b' :
                    form.category === 'Salade' ? '#06b6d4' :
                        form.category === 'Plat chaud' ? '#f97316' : '#8b5cf6',
            donor: {
                id: mockUser.id,
                name: mockUser.name.split(' ')[0] + ' ' + mockUser.name.split(' ')[1][0] + '.',
                avatar: mockUser.avatar,
                rating: mockUser.rating,
                reviewCount: mockUser.reviewCount,
                badge: mockUser.badge,
            },
            preparedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + parseInt(form.expiresIn) * 3600000).toISOString(),
            locker: lockers.find(l => l.id === form.lockerId),
            ingredients: form.ingredients.split(',').map(i => i.trim()).filter(i => i),
            allergens: form.allergens,
            isVegetarian: form.isVegetarian,
            isCold: form.category === 'Salade' || form.category === 'Dessert',
            portions: form.portions,
            reserved: false,
        }

        // Add the offer to the mock dataset
        addOffer(newOffer)

        setSubmitted(true)
    }

    if (submitted) {
        return (
            <div className="publier">
                <div className="container">
                    <div className="publier__success animate-fade-up">
                        <div className="success-icon">🎉</div>
                        <h2>Plat déposé avec succès !</h2>
                        <p>Rends-toi au locker <strong>{lockers.find(l => l.id === form.lockerId)?.name}</strong> et scanne ce QR code pour verrouiller ton casier.</p>

                        <div className="success-qr">
                            <svg viewBox="0 0 100 100" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                                <rect x="5" y="5" width="28" height="28" rx="3" fill="none" stroke="#10b981" strokeWidth="3" />
                                <rect x="10" y="10" width="18" height="18" rx="1" fill="#10b981" />
                                <rect x="67" y="5" width="28" height="28" rx="3" fill="none" stroke="#10b981" strokeWidth="3" />
                                <rect x="72" y="10" width="18" height="18" rx="1" fill="#10b981" />
                                <rect x="5" y="67" width="28" height="28" rx="3" fill="none" stroke="#10b981" strokeWidth="3" />
                                <rect x="10" y="72" width="18" height="18" rx="1" fill="#10b981" />
                                {[40, 46, 52, 58, 40, 58, 40, 58, 40, 46, 52, 58].map((x, i) => (
                                    <rect key={i} x={x} y={[5, 5, 5, 5, 9, 9, 13, 13, 17, 17, 17, 17][i]} width="4" height="4" fill="#10b981" opacity="0.8" />
                                ))}
                                {Array.from({ length: 16 }).map((_, i) => (
                                    <rect key={`d${i}`} x={40 + (i % 4) * 6} y={40 + Math.floor(i / 4) * 6} width="4" height="4" rx="1"
                                        fill={[1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0][i] ? "#10b981" : "transparent"} opacity="0.9" />
                                ))}
                            </svg>
                            <p className="qr-code__label">{qrCode}</p>
                        </div>

                        <div className="success-summary">
                            <div className="success-summary__row"><span>🍽️</span><span>{form.emoji} {form.title}</span></div>
                            <div className="success-summary__row"><span>📍</span><span>{lockers.find(l => l.id === form.lockerId)?.name}</span></div>
                            <div className="success-summary__row"><span>⏰</span><span>Retrait avant {form.expiresIn}h</span></div>
                        </div>

                        <div className="success-actions">
                            <Link to="/explorer" className="btn btn-primary">🔍 Voir mes offres</Link>
                            <Link to="/profil" className="btn btn-secondary">👤 Mon profil</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="publier">
            <div className="container">
                {/* Header */}
                <div className="publier__header animate-fade-up">
                    <span className="badge badge-green">➕ Partager un plat</span>
                    <h1 className="section-title" style={{ marginTop: 12 }}>
                        Dépose ton <span className="gradient-text">plat</span>
                    </h1>
                    <p className="section-subtitle" style={{ marginTop: 8 }}>
                        En 4 étapes simples, ton repas trouve preneur plutôt que la poubelle.
                    </p>
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

                    {/* Step 0: Description */}
                    {step === 0 && (
                        <div className="form-step">
                            <h3 className="form-step__title">📝 Présente ton plat</h3>

                            <div className="form-group">
                                <label className="label" htmlFor="plat-emoji">Choisis un emoji</label>
                                <div className="emoji-picker">
                                    {EMOJIS.map(e => (
                                        <button
                                            key={e}
                                            id={`emoji-${e}`}
                                            className={`emoji-btn ${form.emoji === e ? 'active' : ''}`}
                                            onClick={() => update('emoji', e)}
                                        >{e}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label" htmlFor="plat-title">Nom du plat *</label>
                                <input
                                    id="plat-title"
                                    className="input"
                                    type="text"
                                    placeholder="Ex: Lasagnes bolognaise maison"
                                    value={form.title}
                                    onChange={e => update('title', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="label" htmlFor="plat-desc">Description *</label>
                                <textarea
                                    id="plat-desc"
                                    className="input"
                                    rows={3}
                                    placeholder="Décris ton plat : saveurs, texture, histoire... plus c'est vivant, plus ça donne envie !"
                                    value={form.description}
                                    onChange={e => update('description', e.target.value)}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label" htmlFor="plat-cat">Catégorie</label>
                                    <select id="plat-cat" className="input" value={form.category} onChange={e => update('category', e.target.value)}>
                                        {['Plat chaud', 'Vegan', 'Végétarien', 'Salade', 'Dessert', 'Soupe', 'Autre'].map(c => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="label" htmlFor="plat-portions">Portions</label>
                                    <input
                                        id="plat-portions"
                                        className="input"
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={form.portions}
                                        onChange={e => update('portions', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label">
                                    <input
                                        type="checkbox"
                                        checked={form.isVegetarian}
                                        onChange={e => update('isVegetarian', e.target.checked)}
                                        style={{ marginRight: 8 }}
                                    />
                                    🌿 Ce plat est végétarien / vegan
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Ingredients & Allergens */}
                    {step === 1 && (
                        <div className="form-step">
                            <h3 className="form-step__title">🥦 Ingrédients & Allergènes</h3>
                            <p className="form-step__desc">
                                La transparence, c'est notre pilier. Ces informations permettent aux receveurs de décider en toute confiance.
                            </p>

                            <div className="form-group">
                                <label className="label" htmlFor="plat-ingredients">Liste des ingrédients *</label>
                                <textarea
                                    id="plat-ingredients"
                                    className="input"
                                    rows={4}
                                    placeholder="Ex: Pâtes, bœuf haché, tomates, oignons, ail, gruyère, huile d'olive..."
                                    value={form.ingredients}
                                    onChange={e => update('ingredients', e.target.value)}
                                    style={{ resize: 'vertical' }}
                                />
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>
                                    Sépare les ingrédients par des virgules
                                </p>
                            </div>

                            <div className="form-group">
                                <label className="label">⚠️ Cocher les allergènes présents</label>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                                    Si tu n'es pas sûr(e), coche quand même. Mieux vaut prévenir !
                                </p>
                                <div className="allergen-grid">
                                    {ALLERGENS_LIST.map(a => (
                                        <label key={a} className={`allergen-toggle ${form.allergens.includes(a) ? 'checked' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={form.allergens.includes(a)}
                                                onChange={() => toggleAllergen(a)}
                                                style={{ display: 'none' }}
                                            />
                                            {form.allergens.includes(a) ? '⚠️' : '○'} {a}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Locker */}
                    {step === 2 && (
                        <div className="form-step">
                            <h3 className="form-step__title">📍 Choisis un Frigo-Locker</h3>
                            <p className="form-step__desc">
                                Sélectionne le locker le plus proche de chez toi. Tu as {form.expiresIn}h pour déposer le plat après validation.
                            </p>

                            <div className="locker-options">
                                {lockers.map(l => (
                                    <button
                                        key={l.id}
                                        id={`locker-${l.id}`}
                                        className={`locker-option ${form.lockerId === l.id ? 'selected' : ''} ${l.available === 0 ? 'full' : ''}`}
                                        onClick={() => l.available > 0 && update('lockerId', l.id)}
                                        disabled={l.available === 0}
                                    >
                                        <div className="locker-option__icon">🏬</div>
                                        <div className="locker-option__info">
                                            <p className="locker-option__name">{l.name}</p>
                                            <p className="locker-option__slots">
                                                {l.available > 0
                                                    ? `${l.available} casier${l.available > 1 ? 's' : ''} disponible${l.available > 1 ? 's' : ''} sur ${l.slots}`
                                                    : '❌ Complet'}
                                            </p>
                                        </div>
                                        {form.lockerId === l.id && <span className="locker-option__check">✓</span>}
                                    </button>
                                ))}
                            </div>

                            <div className="form-group" style={{ marginTop: 20 }}>
                                <label className="label" htmlFor="expires-in">⏰ Délai de retrait maximum</label>
                                <select
                                    id="expires-in"
                                    className="input"
                                    value={form.expiresIn}
                                    onChange={e => update('expiresIn', e.target.value)}
                                >
                                    <option value="2">2 heures</option>
                                    <option value="4">4 heures</option>
                                    <option value="6">6 heures</option>
                                    <option value="24">Demain (24h)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Recap */}
                    {step === 3 && (
                        <div className="form-step">
                            <h3 className="form-step__title">✅ Récapitulatif</h3>
                            <p className="form-step__desc">Vérifie les informations avant de valider.</p>

                            <div className="recap-card">
                                <div className="recap-emoji">{form.emoji}</div>
                                <div className="recap-info">
                                    <h4>{form.title}</h4>
                                    <p>{form.description}</p>
                                </div>
                            </div>

                            <div className="recap-rows">
                                <div className="recap-row"><span>📦 Catégorie</span><strong>{form.category}</strong></div>
                                <div className="recap-row"><span>👤 Portions</span><strong>{form.portions}</strong></div>
                                <div className="recap-row"><span>🌿 Végétarien</span><strong>{form.isVegetarian ? 'Oui' : 'Non'}</strong></div>
                                <div className="recap-row">
                                    <span>⚠️ Allergènes</span>
                                    <strong>{form.allergens.length > 0 ? form.allergens.join(', ') : 'Aucun déclaré'}</strong>
                                </div>
                                <div className="recap-row">
                                    <span>📍 Locker</span>
                                    <strong>{lockers.find(l => l.id === form.lockerId)?.name}</strong>
                                </div>
                                <div className="recap-row"><span>⏰ Délai</span><strong>{form.expiresIn} heures</strong></div>
                            </div>

                            <div className="recap-commitment">
                                <span>🤝</span>
                                <p>En validant, je certifie que ce plat a été préparé dans des conditions d'hygiène satisfaisantes et que les informations fournies sont exactes.</p>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="form-nav">
                        {step > 0 && (
                            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
                                ← Précédent
                            </button>
                        )}
                        {step < 3 ? (
                            <button
                                id="next-step-btn"
                                className="btn btn-primary"
                                onClick={() => setStep(s => s + 1)}
                                disabled={!canNext()}
                                style={{ marginLeft: 'auto', opacity: canNext() ? 1 : 0.5 }}
                            >
                                Suivant →
                            </button>
                        ) : (
                            <button
                                id="submit-offer-btn"
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                style={{ marginLeft: 'auto' }}
                            >
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
