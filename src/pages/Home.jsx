import React from "react";
import About from "../components/About";
import Header from "../components/Header";

function Home() {
  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
      <main>
        <Header />

        <div id="about">
          <About />
        </div>
      </main>
    </div>
  );
}

export default Home;
