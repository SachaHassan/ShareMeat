import { useState } from 'react'
import { Link } from 'react-router-dom'
import { mockProducts } from '../data/mockData'
import './Echanges.css'

export default function Echanges() {
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('Tous')
    const categories = ['Tous', 'Sec', 'Conserve', 'Légumes', 'Boissons', 'Autre']

    const filteredProducts = mockProducts.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        const matchCat = activeCategory === 'Tous' || p.category === activeCategory
        return matchSearch && matchCat
    })

    return (
        <div className="echanges animate-fade-in">
            {/* Header */}
            <div className="echanges__header">
                <div className="container">
                    <div className="echanges__header-content animate-fade-up">
                        <span className="badge badge-amber">🤝 Échanges Solidaires</span>
                        <h1 className="echanges__title">
                            Le <span className="gradient-text-amber">Garde-manger</span> Étudiant
                        </h1>
                        <p className="echanges__subtitle">
                            Des paquets de pâtes en trop, une boîte de conserve inutilisée ? Donne ou échange tes produits alimentaires non cuisinés avec les autres étudiants du campus.
                        </p>
                        <div className="echanges__actions">
                            <button className="btn btn-amber" onClick={() => alert("Formulaire de don d'ingrédients à venir !")}>
                                ➕ Proposer un produit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Filters */}
                <div className="echanges__filters animate-fade-up animate-fade-up-2">
                    <div className="echanges__search-wrap">
                        <input
                            className="input echanges__search"
                            type="text"
                            placeholder="🔍 Rechercher des pâtes, du riz, des légumes..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="echanges__cats">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="products-grid animate-fade-up animate-fade-up-3">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <div key={product.id} className="product-card group">
                                {/* Header */}
                                <div className="product-card__header">
                                    <div className="product-card__emoji">{product.emoji}</div>
                                    <div className="product-card__badges">
                                        <span className="badge-small">{product.category}</span>
                                    </div>
                                </div>

                                {/* Content */}
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

                                {/* Footer */}
                                <div className="product-card__footer">
                                    <div className="product-donor">
                                        <span className="donor-avatar">{product.donor.avatar}</span>
                                        <div className="donor-info">
                                            <p className="donor-name">{product.donor.name}</p>
                                            <div className="donor-rating">
                                                {'⭐'.repeat(Math.floor(product.donor.rating))} <span>{product.donor.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn btn-sm btn-outline-amber" onClick={() => alert("Réservation de produit à venir !")}>
                                        Récupérer
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <span className="empty-emoji">🥣</span>
                            <h3>Aucun produit trouvé</h3>
                            <p>Essaye de modifier tes filtres ou reviens plus tard.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
