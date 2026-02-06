import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import BrowseLivestock from './pages/BrowseLivestock'
import Marketplace from './pages/Marketplace'
import LivestockDetail from './pages/LivestockDetail'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<SignUp />} />
        <Route path="/browse" element={<BrowseLivestock />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/livestock/:id" element={<LivestockDetail />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
