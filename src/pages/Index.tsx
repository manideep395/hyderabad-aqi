import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MainDashboard from "@/components/MainDashboard";
import LocationGrid from "@/components/LocationGrid";
import Footer from "@/components/Footer";

const Index = () => {
  console.log("Index page rendering");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Add padding-top to account for fixed header */}
      <main className="flex-grow pt-48">
        <Hero />
        
        <div className="container mx-auto px-4 py-12 space-y-12">
          <MainDashboard />
          
          <div>
            <h2 className="text-3xl font-bold mb-8">Monitoring Stations</h2>
            <LocationGrid />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;