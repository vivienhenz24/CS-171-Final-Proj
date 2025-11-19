'use client';

import { User } from 'lucide-react';

export default function PageOne() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16">
      <div className="flex flex-col items-center text-center max-w-2xl">
        {/* Person Icon */}
        <div className="mb-8">
          <svg 
            className="w-32 h-32" 
            viewBox="0 0 24 24" 
            fill="white" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="white"/>
            <path d="M12 14C7.58172 14 4 16.134 4 19V22H20V19C20 16.134 16.4183 14 12 14Z" fill="white"/>
          </svg>
        </div>
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6">
          This is you
        </h1>
        
        {/* Description */}
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12">
          You're a student at Harvard. Choose your path.
        </p>
        
        {/* Placeholder for choice buttons */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          <button className="px-8 py-4 bg-black text-white font-semibold rounded-lg border-2 border-[#DC143C] hover:bg-[#DC143C]/10 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,20,60,0.4)]">
            Path Option 1
          </button>
          <button className="px-8 py-4 bg-black text-white font-semibold rounded-lg border-2 border-[#DC143C] hover:bg-[#DC143C]/10 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,20,60,0.4)]">
            Path Option 2
          </button>
        </div>
      </div>
    </div>
  );
}

