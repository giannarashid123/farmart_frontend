import React from "react";
import About from "../components/About";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    // Replaced inline styles with Tailwind for consistency with your other components
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
      <Navbar />

      <main>
        <Header />

        {/* Added an ID here to ensure the Navbar "About Us" link lands correctly */}
        <div id="about">
          <About />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
