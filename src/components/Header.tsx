import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* 3D Animated Logo */}
          <div className="relative w-16 h-16 perspective-1000">
            <div className="absolute w-full h-full animate-float">
              <div className="w-full h-full bg-gradient-to-r from-primary to-blue-600 rounded-lg shadow-lg transform rotate-3d-1 transition-transform duration-300 hover:scale-110 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">T</span>
              </div>
            </div>
          </div>
          
          {/* Title */}
          <Link to="/" className="text-2xl font-bold text-gray-800 text-center">
            Telangana AQI
          </Link>
          
          {/* Navigation Menu */}
          <nav className="flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link to="/prediction" className="text-gray-600 hover:text-gray-900 transition-colors">
              Predictions
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;