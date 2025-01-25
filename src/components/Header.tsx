import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute w-full h-full">
                <div className="w-full h-full bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-110 flex items-center justify-center">
                  <span className="text-blue-600 text-xl font-bold">T</span>
                </div>
              </div>
            </div>
            <Link to="/" className="text-xl font-bold text-white">
              Telangana AQI
            </Link>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex space-x-6">
            <Link to="/" className="text-white hover:text-blue-200 transition-colors text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/about" className="text-white hover:text-blue-200 transition-colors text-sm font-medium">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;