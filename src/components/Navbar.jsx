import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Beef, ShoppingCart } from "lucide-react";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Browse Livestock", path: "/browse" },
    { name: "Marketplace", path: "/market" },
    { name: "Sell", path: "/sell" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        isScrolled
          ? "bg-emerald-950/95 backdrop-blur-md py-3 shadow-2xl border-b border-emerald-800/50"
          : "bg-transparent py-6"
      }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12">
        {/* LEFT: BRANDING (Replaced Image with Icon) */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-12 h-12 bg-emerald-600 rounded-xl transition-transform group-hover:scale-110 duration-500 shadow-lg shadow-emerald-900/20">
            <Beef className="text-white w-7 h-7" />
            <div className="absolute -inset-1 bg-emerald-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition"></div>
          </div>
          <div className="leading-none">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">
              FARM<span className="text-emerald-500">ART</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
              Livestock Exchange
            </p>
          </div>
        </Link>

        {/* CENTER: DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-[11px] font-black uppercase tracking-widest text-white/80 hover:text-emerald-400 transition-colors relative group">
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-6">
          {/* Marketplace/Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 text-white hover:text-emerald-400 transition-colors">
            <ShoppingCart size={22} />
            <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 text-[10px] flex items-center justify-center rounded-full font-bold">
              0
            </span>
          </Link>

          <Link
            to="/signup"
            className="hidden sm:block px-7 py-3 text-[10px] font-black uppercase tracking-widest text-white bg-emerald-600 rounded-lg shadow-lg shadow-emerald-900/40 hover:bg-emerald-500 hover:-translate-y-0.5 transition-all active:scale-95">
            Get Started
          </Link>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-emerald-800/50 rounded-lg transition-colors">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div
        className={`lg:hidden absolute w-full bg-emerald-950 border-b border-emerald-800 transition-all duration-500 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0"
        }`}>
        <div className="flex flex-col p-8 gap-6 bg-emerald-950/50">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-bold uppercase tracking-widest text-white hover:text-emerald-400 transition-colors">
              {link.name}
            </Link>
          ))}
          <hr className="border-emerald-800/50" />
          <Link
            to="/signup"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-4 text-center text-[10px] font-black uppercase tracking-widest text-white bg-emerald-600 rounded-lg shadow-lg shadow-emerald-900/30">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
