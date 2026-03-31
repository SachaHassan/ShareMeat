import { createContext, useContext, useState, useEffect } from 'react'

/* ─── Default users ─── */
const DEFAULT_USERS = [
    {
        id: 'u-test',
        username: 'test',
        password: 'test',
        name: 'Alex Dupont',
        email: 'alex.dupont@etudiant.univ.fr',
        avatar: '🧑‍💻',
        university: 'Université Paris Nanterre',
        verified: true,
        badge: 'Super Cuisinier',
        rating: 4.8,
        reviewCount: 18,
        stats: { given: 24, received: 31, co2Saved: 14.4, mealsSaved: 55 },
    }
]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [users, setUsers] = useState(() => {
        try {
            const stored = localStorage.getItem('sharemeat_users')
            return stored ? JSON.parse(stored) : DEFAULT_USERS
        } catch {
            return DEFAULT_USERS
        }
    })

    /* Restore session on mount */
    useEffect(() => {
        try {
            const stored = localStorage.getItem('sharemeat_session')
            if (stored) setUser(JSON.parse(stored))
        } catch { /* ignore */ }
    }, [])

    /* Persist users list */
    useEffect(() => {
        localStorage.setItem('sharemeat_users', JSON.stringify(users))
    }, [users])

    /* Login — returns null on success, error string on failure */
    const login = (username, password) => {
        const found = users.find(
            u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
        )
        if (!found) return 'Identifiant ou mot de passe incorrect.'
        const { password: _, ...safeUser } = found
        setUser(safeUser)
        localStorage.setItem('sharemeat_session', JSON.stringify(safeUser))
        return null
    }

    /* Register — returns null on success, error string on failure */
    const register = (newUser) => {
        const exists = users.find(u => u.username.toLowerCase() === newUser.username.toLowerCase())
        if (exists) return 'Ce nom d\'utilisateur est déjà pris.'
        const fullUser = {
            ...newUser,
            id: `u-${Date.now()}`,
            verified: true,
            badge: 'Nouveau membre',
            rating: 5.0,
            reviewCount: 0,
            stats: { given: 0, received: 0, co2Saved: 0, mealsSaved: 0 },
        }
        setUsers(prev => [...prev, fullUser])
        const { password: _, ...safeUser } = fullUser
        setUser(safeUser)
        localStorage.setItem('sharemeat_session', JSON.stringify(safeUser))
        return null
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('sharemeat_session')
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}
