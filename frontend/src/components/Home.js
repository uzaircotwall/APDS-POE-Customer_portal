// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-yellow-100 to-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-80 h-80 bg-yellow-300 opacity-30 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-500 opacity-20 rounded-full filter blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-40 left-40 w-60 h-60 bg-yellow-400 opacity-25 rounded-full filter blur-3xl animate-float-reverse"></div>
      </div>

      {/* Welcome Section */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md p-12 rounded-3xl shadow-xl text-center max-w-lg mx-auto transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl">
        <h1 className="text-5xl font-extrabold text-yellow-700 mb-6 tracking-tight leading-tight">
          Welcome to Our <br /> International Customer Portal
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Your secure gateway to managing international payments and financial insights.
        </p>
        <Link
          to="/login"
          className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-md transform transition-transform duration-300 hover:scale-110 hover:shadow-lg"
        >
          Login to Your Account
        </Link>
      </div>

      {/* Credits Section */}
      <footer className="mt-16 text-gray-500 text-sm text-center relative z-10 font-medium">
        Made with ❤️ by <span className="text-yellow-600">Tamir, Thiyan, Raesa, and Eshvara</span>
      </footer>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(-10px); }
          50% { transform: translateY(10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(5px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(10px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Home;
