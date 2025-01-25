import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  console.log("About page rendered");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto space-y-8 bg-white rounded-lg shadow-xl p-8">
          <section className="space-y-4">
            <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">About Us - Team Xpeditionr</h1>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
              <p className="text-lg text-gray-700 leading-relaxed">
                Welcome to Xpeditionr – a team driven by innovation and dedicated to enhancing the quality of life through real-time environmental data. We are a group of passionate individuals focused on providing timely, accurate, and easily accessible air quality insights, empowering citizens, organizations, and policymakers to make informed decisions for a healthier tomorrow.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">Our Vision</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                Our vision is to become a leading platform for real-time air quality monitoring, providing critical insights that drive positive change in urban environments. By offering accurate data from multiple locations, we aim to raise awareness about air pollution, help mitigate its effects, and foster a sustainable future for all.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">Our Mission</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                At Xpeditionr, our mission is simple: To provide real-time air quality data for 12 key locations in Hyderabad, helping individuals, communities, and authorities monitor pollution levels and take timely actions to improve public health.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
                <li>Empower local communities with the knowledge needed to protect their health from air pollution.</li>
                <li>Support environmental sustainability by making air quality monitoring accessible to all.</li>
                <li>Collaborate with policymakers to create data-driven strategies that improve air quality and public health in Hyderabad and beyond.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">Our 12 Monitoring Locations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "New Malakpet",
                "Nacharam",
                "ECIL",
                "Hyderabad US",
                "Bahadurpura Zoo Park",
                "Somajiguda",
                "Sanathnagar",
                "Kokapet",
                "Central University Hyderabad",
                "Patancheruvu",
                "IDA Pashamylaram",
                "IITH Kandi"
              ].map((location) => (
                <div key={location} className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-gray-800 font-medium">{location}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">Join Us in Our Journey</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                At Xpeditionr, we are committed to making Hyderabad a cleaner and healthier place to live. We are continuously expanding our network of monitoring stations, refining our data analytics, and working closely with local governments, health organizations, and citizens to create a safer, more sustainable environment for everyone.
              </p>
              <div className="flex justify-center pt-6">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/">Back to Dashboard</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;