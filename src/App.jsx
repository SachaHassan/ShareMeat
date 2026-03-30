import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Explorer from './pages/Explorer'
import OffreDetail from './pages/OffreDetail'
import Publier from './pages/Publier'
import Profil from './pages/Profil'
import Echanges from './pages/Echanges'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/offre/:id" element={<OffreDetail />} />
          <Route path="/publier" element={<Publier />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/echanges" element={<Echanges />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
