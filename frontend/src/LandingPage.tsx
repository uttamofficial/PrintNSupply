// LandingPage.tsx
import React from 'react';
import  Navbar  from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import SupportedFormats from './components/SupportedFormats';
import { CallToAction } from './components/CallToAction';
import Footer from './components/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Features />
        <HowItWorks />
        <Testimonials />
        <SupportedFormats />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
