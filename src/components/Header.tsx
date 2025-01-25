import { Link } from "react-router-dom";
import { IndianRupee } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 3D Logo Effect */}
            <div className="w-10 h-10 bg-primary rounded-lg shadow-lg transform hover:scale-110 transition-transform duration-300 flex items-center justify-center animate-float">
              <span className="text-white text-2xl font-bold transform hover:rotate-12 transition-transform duration-300">H</span>
            </div>
            <Link to="/" className="text-2xl font-bold text-primary">
              Hyderabad AQI Analysis
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">
              Contact
            </Link>
            <Link to="/learn" className="text-gray-600 hover:text-primary transition-colors">
              Learn More
            </Link>
          </nav>

          {/* Made in India Box */}
          <div className="hidden md:flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
            <IndianRupee className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Made in India</span>
          </div>
          
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;