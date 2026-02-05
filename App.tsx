import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Products } from './components/Products';
import { Operations } from './components/Operations';
import { Sustainability } from './components/Sustainability';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { LanguageProvider } from './LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-white selection:text-black">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Services />
          <Products />
          <Operations />
          <Sustainability />
          <Contact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;