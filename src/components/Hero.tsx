import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-float">
            Breathe Fresh, Live Healthy
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Empowering communities with real-time air quality insights for a healthier tomorrow.
          </p>
          <Button
            onClick={() => navigate("/about")}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg text-lg"
          >
            Learn More
          </Button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-4 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
        <div className="absolute -top-4 right-1/4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float [animation-delay:2s]" />
      </div>
    </div>
  );
};

export default Hero;