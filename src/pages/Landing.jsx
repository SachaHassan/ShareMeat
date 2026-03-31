import { Link } from 'react-router-dom'
import { stats, testimonials } from '../data/mockData'
import './Landing.css'

/* ---- Helper: format big numbers ---- */
const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n

export default function Landing() {
    return (
        <div className="landing">

            {/* === HERO === */}
            <section className="hero">
                <div className="hero__bg-glow"></div>
                <div className="container hero__content">

                    {/* Problem framing pill – Design Thinking empathy */}
                    <div className="animate-fade-up animate-fade-up-1">
                        <span className="hero__pill">
                            🎓 Projet étudiant • Design Thinking • CROUS
                        </span>
                    </div>

                    <h1 className="hero__title animate-fade-up animate-fade-up-2">
                        Tes restes de repas<br />
                        méritent une <span className="gradient-text">deuxième vie</span>
                    </h1>

                    <p className="hero__subtitle animate-fade-up animate-fade-up-3">
                        Chaque soir, des tonnes de plats faits maison finissent à la poubelle dans les résidences étudiantes.
                        ShareMeal connecte les bons cuisiniers et les estomacs vides — en toute sécurité, via nos <strong>Frigo-Lockers</strong> connectés sur ton campus.
                    </p>

                    <div className="hero__cta animate-fade-up animate-fade-up-4">
                        <Link to="/explorer" className="btn btn-primary btn-lg">
                            🔍 Explorer les offres du campus
                        </Link>
                        <Link to="/publier" className="btn btn-secondary btn-lg">
                            ➕ Partager un plat
                        </Link>
                    </div>

                    <div className="hero__trust animate-fade-up animate-fade-up-5">
                        <div className="hero__trust-item">
                            <span>🔒</span>
                            <span>Profil vérifié carte étudiante</span>
                        </div>
                        <div className="hero__trust-sep">·</div>
                        <div className="hero__trust-item">
                            <span>🌡️</span>
                            <span>Chaîne du froid garantie</span>
                        </div>
                        <div className="hero__trust-sep">·</div>
                        <div className="hero__trust-item">
                            <span>⚡</span>
                            <span>Accès par QR code sécurisé</span>
                        </div>
                    </div>
                </div>

                {/* Floating food cards decoration */}
                <div className="hero__float-cards">
                    <div className="hero__float-card hero__float-card--1">🍝 Lasagnes • Hall A</div>
                    <div className="hero__float-card hero__float-card--2">🥗 Buddha Bowl • BU</div>
                    <div className="hero__float-card hero__float-card--3">🍲 Soupe lentilles • G</div>
                </div>
            </section>

            {/* === PROBLÈME (Design Thinking: Empathie) === */}
            <section className="section problem-section">
                <div className="container">
                    <div className="problem-section__inner">
                        <div className="problem-section__text animate-fade-up">
                            <span className="badge badge-amber">🤔 Le problème identifié</span>
                            <h2 className="section-title" style={{ marginTop: 16 }}>
                                Pourquoi le partage <span className="gradient-text">ne se fait pas</span> naturellement ?
                            </h2>
                            <p className="section-subtitle" style={{ marginTop: 16 }}>
                                En phase d'empathie, nous avons interviewé 60 étudiants. Résultat : <strong>80% ont déjà jeté un plat fait maison</strong> alors qu'ils auraient voulu le partager.
                            </p>
                            <div className="problem-cards">
                                {[
                                    { icon: '😰', title: 'Peur sanitaire', text: 'Manque de confiance sur l\'hygiène et la chaîne du froid du donneur.' },
                                    { icon: '🤐', title: 'Maladresse sociale', text: 'Proposer à un inconnu de manger son repas est anxiogène des deux côtés.' },
                                    { icon: '🚫', title: 'Aucune infrastructure', text: 'Pas de lieu neutre, sécurisé et réfrigéré pour faciliter l\'échange.' },
                                ].map((p) => (
                                    <div key={p.title} className="problem-card">
                                        <span className="problem-card__icon">{p.icon}</span>
                                        <div>
                                            <h4>{p.title}</h4>
                                            <p>{p.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="problem-section__quote animate-fade-up animate-fade-up-2">
                            <blockquote>
                                "Je cuisine toujours trop. J&apos;aurais adoré donner mes restes, mais je ne voulais pas sonner chez un voisin que je connais à peine."
                            </blockquote>
                            <cite>— Clara, étudiante en M1 Droit, interviewée lors de notre phase d'empathie</cite>
                        </div>
                    </div>
                </div>
            </section>

            {/* === FONCTIONNEMENT (Design Thinking: Solution) === */}
            <section className="section how-section">
                <div className="container">
                    <div className="section-header animate-fade-up">
                        <span className="badge badge-green">✅ Notre solution</span>
                        <h2 className="section-title" style={{ marginTop: 16 }}>
                            Comment fonctionne
                            <span className="gradient-text"> ShareMeal</span> ?
                        </h2>
                        <p className="section-subtitle" style={{ marginTop: 12 }}>
                            Un écosystème physique + digital qui élimine chaque frein identifié.
                        </p>
                    </div>

                    <div className="steps animate-fade-up animate-fade-up-2">
                        {[
                            {
                                num: '01',
                                icon: '🍽️',
                                title: 'Tu prépares & documentes',
                                text: 'Remplis la fiche de ton plat : photo, liste d\'ingrédients, allergènes, date/heure de préparation. La transparence crée la confiance.',
                                tag: 'Fiche sanitaire transparente',
                            },
                            {
                                num: '02',
                                icon: '📱',
                                title: 'Tu reçois ton QR Code',
                                text: 'L\'app génère un QR code unique. Dépose ton plat dans le Frigo-Locker CROUS le plus proche et scanne pour verrouiller le casier.',
                                tag: 'Chaîne du froid garantie',
                            },
                            {
                                num: '03',
                                icon: '🔓',
                                title: 'Quelqu\'un récupère',
                                text: 'Un étudiant réserve via l\'app et reçoit son propre QR code pour déverrouiller le casier. Zéro contact anxiogène, 100% traçable.',
                                tag: 'Accès sécurisé par QR code',
                            },
                            {
                                num: '04',
                                icon: '⭐',
                                title: 'Vous vous notez',
                                text: 'Après chaque échange, donneurs et receveurs se notent. Les profils de confiance sont mis en avant. Les négligences sont exclus.',
                                tag: 'Système de confiance communautaire',
                            },
                        ].map((step, i) => (
                            <div key={step.num} className={`step animate-fade-up animate-fade-up-${i + 1}`}>
                                <div className="step__number">{step.num}</div>
                                <div className="step__icon">{step.icon}</div>
                                <h3 className="step__title">{step.title}</h3>
                                <p className="step__text">{step.text}</p>
                                <span className="tag">{step.tag}</span>
                                {i < 3 && <div className="step__connector"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === LOCKER PHYSIQUE === */}
            <section className="section locker-section">
                <div className="container">
                    <div className="locker-section__inner">
                        <div className="locker-visual animate-fade-up">
                            <div className="locker-box">
                                <div className="locker-box__header">
                                    <span>🏬 FRIGO-LOCKER</span>
                                    <span className="badge badge-green">● Connecté</span>
                                </div>
                                {[
                                    { slot: 'A1', status: 'taken', label: '🍝 Lasagnes' },
                                    { slot: 'A2', status: 'available', label: 'Disponible' },
                                    { slot: 'A3', status: 'taken', label: '🥗 Buddha Bowl' },
                                    { slot: 'B1', status: 'available', label: 'Disponible' },
                                    { slot: 'B2', status: 'reserved', label: '🍲 Soupe (réservé)' },
                                    { slot: 'B3', status: 'available', label: 'Disponible' },
                                ].map(slot => (
                                    <div key={slot.slot} className={`locker-slot locker-slot--${slot.status}`}>
                                        <span className="locker-slot__id">{slot.slot}</span>
                                        <span className="locker-slot__label">{slot.label}</span>
                                        <span className="locker-slot__dot"></span>
                                    </div>
                                ))}
                                <div className="locker-box__footer">
                                    <span>🌡️ 4°C</span>
                                    <span>📍 Résidence Voltaire</span>
                                    <span>⚡ 3/6 dispo</span>
                                </div>
                            </div>
                        </div>

                        <div className="locker-section__text animate-fade-up animate-fade-up-2">
                            <span className="badge badge-cyan">🏗️ L'infrastructure physique</span>
                            <h2 className="section-title" style={{ marginTop: 16 }}>
                                Le <span className="gradient-text">Frigo-Locker</span> : l'élément clé
                            </h2>
                            <p className="section-subtitle" style={{ marginTop: 12 }}>
                                Notre vrai différenciateur : des casiers réfrigérés connectés, implantés dans les halls des résidences CROUS. Ils créent un <strong>tiers de confiance physique</strong> entre donneurs et receveurs.
                            </p>
                            <ul className="locker-features">
                                {[
                                    '🌡️ Réfrigération automatique à 4°C – chaîne du froid garantie',
                                    '🔐 Verrouillage/déverrouillage par QR code unique (1 usage)',
                                    '📡 Connecté en temps réel à l\'application',
                                    '🧼 Nettoyage automatique entre chaque usage',
                                    '📍 Visible sur la carte de l\'application',
                                ].map(f => (
                                    <li key={f}>{f}</li>
                                ))}
                            </ul>
                            <Link to="/explorer" className="btn btn-primary" style={{ marginTop: 24 }}>
                                Voir les lockers disponibles →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* === STATS === */}
            <section className="section stats-section">
                <div className="container">
                    <div className="stats-section__grid animate-fade-up">
                        {[
                            { value: fmt(stats.students), label: 'Étudiants inscrits', icon: '🎓' },
                            { value: fmt(stats.mealsShared), label: 'Repas partagés', icon: '🍽️' },
                            { value: `${stats.co2Saved} kg`, label: 'CO₂ évités', icon: '🌱' },
                            { value: stats.campuses, label: 'Campus partenaires', icon: '🏫' },
                        ].map((s, i) => (
                            <div key={s.label} className={`stat-card animate-fade-up animate-fade-up-${i + 1}`}>
                                <span className="stat-card__icon">{s.icon}</span>
                                <span className="stat-card__value">{s.value}</span>
                                <span className="stat-card__label">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === TESTIMONIALS === */}
            <section className="section testimonials-section">
                <div className="container">
                    <div className="section-header animate-fade-up">
                        <span className="badge badge-purple">💬 Retours utilisateurs</span>
                        <h2 className="section-title" style={{ marginTop: 16 }}>
                            Ce que disent nos <span className="gradient-text">beta-testeurs</span>
                        </h2>
                    </div>
                    <div className="testimonials-grid">
                        {testimonials.map((t, i) => (
                            <div key={t.id} className={`testimonial-card card animate-fade-up animate-fade-up-${i + 1}`}>
                                <div className="stars">{'⭐'.repeat(t.rating)}</div>
                                <p className="testimonial-card__text">"{t.text}"</p>
                                <div className="testimonial-card__author">
                                    <span className="testimonial-card__avatar">{t.avatar}</span>
                                    <span className="testimonial-card__name">{t.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === CTA FINAL === */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-box animate-fade-up">
                        <span className="cta-box__emoji">🚀</span>
                        <h2 className="section-title">Prêt à rejoindre <span className="gradient-text">ShareMeal</span> ?</h2>
                        <p className="section-subtitle">
                            Rejoins des milliers d'étudiants qui transforment leurs restes en bonheur partagé.
                        </p>
                        <div className="cta-box__actions">
                            <Link to="/explorer" className="btn btn-primary btn-lg">
                                🔍 Voir les plats disponibles
                            </Link>
                            <Link to="/publier" className="btn btn-outline btn-lg">
                                ➕ Partager mon plat
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}
