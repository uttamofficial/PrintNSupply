import { Link } from './Link';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 min-h-screen flex items-center overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-fade-in-up">
          {/* Badge - Always visible and centered above heading */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-blue-200 text-blue-900 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-medium">Next-Gen Printing Solutions</span>
              <Zap className="w-3.5 h-3.5 text-blue-600" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-900 leading-tight tracking-tight pb-2">
            Print Your Documents
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600">
              Anytime, Anywhere
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto font-light">
            Fast, reliable printing services and quality stationery for students. Upload your PDFs and get them printed in minutes.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-5">
            <Link href="/upload">
              <button className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-base font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Upload PDF
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            
            <Link href="/stationery">
              <button className="group px-6 py-3 bg-white/90 backdrop-blur-md text-blue-700 border-2 border-blue-300 rounded-xl text-base font-bold shadow-xl hover:bg-white hover:border-blue-500 transform hover:scale-105 transition-all duration-300">
                <span className="flex items-center gap-2">
                  Explore Stationery
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 w-full max-w-4xl relative">
              {[
                { value: '10K+', label: 'Students Served', color: 'from-blue-500 to-cyan-500' },
                { value: '50K+', label: 'Pages Printed', color: 'from-purple-500 to-pink-500' },
                { value: '24/7', label: 'Available', color: 'from-orange-500 to-red-500' },
                { value: '4.9★', label: 'Rating', color: 'from-green-500 to-emerald-500' }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="group relative p-4 bg-white/90 backdrop-blur-md rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:bg-white hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                >
                  {/* Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-500`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div className={`text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color} pb-1 mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 font-semibold">{stat.label}</div>
                  </div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:translate-x-full transition-all duration-1000 rounded-xl"></div>
                </div>
              ))}
              
              {/* Scroll Indicator - Centered below stats on desktop */}
              <div className="hidden md:flex absolute -bottom-24 left-1/2 transform -translate-x-1/2 flex-col items-center gap-2">
                <div className="w-6 h-10 border-2 border-blue-500 rounded-full flex justify-center shadow-lg bg-white/50 backdrop-blur-sm animate-bounce">
                  <div className="w-1.5 h-3 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mt-2 animate-pulse"></div>
                </div>
                <span className="text-xs text-blue-600 font-medium animate-pulse">Scroll</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
