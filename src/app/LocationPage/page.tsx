"use client"

import React from "react";
import { GsapAnimation } from "../hooks/GsapAnimation";
import Header from "../components/Header";

const Location: React.FC = () => {
    const headerRef = GsapAnimation();
  
  return (
    <div className="bg-[#263033] text-white">
      <header
        ref={headerRef}
        className="sticky top-0 w-full z-50 bg-white shadow-md transition-all"
      >
        <Header />
      </header>
      <section id="location" className="flex items-center justify-center h-screen px-6 bg-blue-400 text-white">
        <div>
          <h1>Location</h1>
        </div>
      </section>
      <section id="location" className="flex items-center justify-center h-screen px-6 bg-blue-400 text-white">
        <div>
          <h1>Location</h1>
        </div>
      </section>
      <section id="location" className="flex items-center justify-center h-screen px-6 bg-blue-400 text-white">
        <div>
          <h1>Location</h1>
        </div>
      </section>
    </div>
  );
};
 
export default Location;
 
 