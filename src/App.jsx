import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import BrowseLivestock from "./pages/BrowseLivestock";
import Marketplace from "./pages/Marketplace";
import LivestockDetail from "./pages/LivestockDetail";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/**
 * App Component
 * * Note: Ensure your Navbar 'Get Started' button links to "/auth"
 * to match the Route defined below.
 */
function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar stays at the top of every page */}
      <Navbar />

      {/* Main content area expands to fill space so footer stays at bottom */}
      <main className="flex-grow">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Home />} />

          {/* Authentication (Login/Register) */}
          <Route path="/auth" element={<SignUp />} />

          {/* Livestock Discovery */}
          <Route path="/browse" element={<BrowseLivestock />} />

          {/* Main Marketplace Grid */}
          <Route path="/marketplace" element={<Marketplace />} />

          {/* Dynamic Route for individual animals */}
          <Route path="/livestock/:id" element={<LivestockDetail />} />

          {/* Fallback for 404 - Optional but recommended */}
          <Route
            path="*"
            element={
              <div className="pt-40 text-center">
                <h1 className="text-4xl font-bold text-slate-900">
                  404 - Page Not Found
                </h1>
                <a
                  href="/"
                  className="text-green-600 underline mt-4 inline-block">
                  Go Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>

      
    </div>
  );
}

export default App;
