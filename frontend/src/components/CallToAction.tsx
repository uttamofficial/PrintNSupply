import { Link } from './Link';
import { Upload, ArrowRight, Zap, Sparkles } from 'lucide-react';

export function CallToAction() {
  return (
    <section className="hidden md:block relative py-24 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-6 animate-fade-in-up">
          <Zap className="w-3.5 h-3.5 text-white" />
          <span className="text-xs font-semibold text-white">Get Started Today</span>
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight pb-2">
          Ready to Print Your
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-blue-100 to-white">
            Documents?
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
          Simply upload your PDF and we'll handle the rest. Fast, reliable, and affordable printing for students.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-5">
          <Link href="/upload">
            <button className="group relative px-8 py-4 bg-white text-blue-700 rounded-xl text-base font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                Upload PDF Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
          
          <Link href="/stationery">
            <button className="group px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl text-base font-bold shadow-xl hover:bg-white/20 hover:border-white/50 transform hover:scale-105 transition-all duration-300">
              <span className="flex items-center justify-center gap-2">
                Browse Stationery
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-blue-100 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Secure Upload</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Fast Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
