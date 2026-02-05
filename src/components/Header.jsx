import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";

function Header() {
  return (
    <>
      {/* HERO SECTION */}
      <div className="relative bg-[url('/HeaderBg.jpg')] bg-cover bg-center h-screen w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Darker overlay for better text readability on dark themes */}
        <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-7xl md:text-[92px] font-black text-white leading-[0.9] tracking-tighter italic uppercase">
            Buy & Sell <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">
              Livestock Direct
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-emerald-50 text-lg md:text-xl font-medium mt-8 max-w-2xl mx-auto drop-shadow-md">
            Connect with trusted farmers and buyers. Trade cattle, sheep, goats,
            and more with total transparency and secure logistics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <a
              href="/browse"
              className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-900/50 flex items-center justify-center gap-2">
              Browse Animals <ChevronRight size={18} />
            </a>
            <a
              href="/sell"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white/20 transition-all flex items-center justify-center">
              Sell Livestock
            </a>
          </motion.div>
        </div>

        {/* Bottom fade into Dark Background */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-emerald-950 to-transparent" />
      </div>

      {/* ABOUT SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-24 px-6 md:px-20 lg:px-32 max-w-7xl mx-auto overflow-hidden text-white"
        id="About">
        <div className="flex flex-col items-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
            About <span className="text-emerald-500">Farmart</span>
          </h2>
          <div className="w-24 h-2 bg-emerald-600 mt-4 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          <p className="text-emerald-400 font-bold uppercase text-xs tracking-[0.3em] mt-6">
            Pioneering Digital Agriculture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="relative group w-full lg:w-1/2">
            {/* The "Blob" background updated to emerald */}
            <div className="absolute -inset-4 bg-emerald-900/30 rounded-[100px] rotate-3 group-hover:rotate-0 transition-transform duration-500 border border-emerald-500/20" />
            <img
              src={"/about1.jpg"}
              alt="Farm Management"
              className="relative w-full aspect-square object-cover rounded-[80px] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 border border-emerald-500/30"
            />
          </div>

          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-2 gap-8">
              {[
                { val: "15k+", lab: "Verified Farmers" },
                { val: "50k+", lab: "Heads Traded" },
                { val: "24h", lab: "Vet Support" },
                { val: "100%", lab: "Secure Payments" },
              ].map((stat, i) => (
                <div key={i} className="group">
                  <p className="text-4xl md:text-5xl font-black text-white group-hover:text-emerald-500 transition-colors">
                    {stat.val}
                  </p>
                  <p className="text-[10px] font-black text-emerald-400/60 uppercase tracking-widest mt-2">
                    {stat.lab}
                  </p>
                </div>
              ))}
            </div>

            <div className="h-[1px] w-full bg-emerald-800/30 my-10" />

            <p className="text-emerald-100/80 leading-relaxed font-medium mb-10 italic border-l-4 border-emerald-600 pl-6">
              "We are building the bridge between the ranch and the market. Our
              mission is to empower farmers with fair pricing and buyers with
              healthy, traceable livestock through a modern digital ecosystem."
            </p>

            <button className="group flex items-center gap-4 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/40">
              Our Process
              <ArrowRight
                className="group-hover:translate-x-2 transition-transform"
                size={16}
              />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Header;
