import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PredictionTool from "@/components/PredictionTool";

const Prediction = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <PredictionTool />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Prediction;