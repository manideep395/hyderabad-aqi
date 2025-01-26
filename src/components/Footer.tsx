import { Link } from "react-router-dom";
import { Github, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center animate-float">
                <span className="text-blue-600 text-2xl font-bold">H</span>
              </div>
              <span className="text-xl font-bold text-primary-foreground">Hyderabad AQI</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/prediction" className="hover:text-primary transition-colors">Prediction Tool</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>Email: dspraneeth07@gmail.com</li>
              <li>Phone: +91 7416466619</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/dspraneeth07" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a 
                href="https://instagram.com/praneethinspires" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://twitter.com/DSPRANEETHREDDY" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a 
                href="https://linkedin.com/in/dspraneeth" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p>© 2025 Xpeditionr. All Rights Reserved.</p>
          <p className="mt-2 text-sm text-gray-400">
            Designed and developed by{" "}
            <a 
              href="https://github.com/dspraneeth07" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Dhadi Sai Praneeth Reddy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;