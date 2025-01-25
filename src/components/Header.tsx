import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Hyderabad AQI
          </Link>
          <div className="space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/prediction" className="text-gray-600 hover:text-gray-900">
              Predictions
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;