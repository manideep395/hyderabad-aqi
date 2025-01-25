import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface LocationModalProps {
  location: string;
  onClose: () => void;
}

const LocationModal = ({ location, onClose }: LocationModalProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["location-details", location],
    queryFn: async () => {
      const response = await fetch(
        `https://api.waqi.info/feed/${location}/?token=demo`
      );
      return response.json();
    },
  });

  // Mock data for the chart
  const chartData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    aqi: Math.floor(Math.random() * 100) + 50,
  }));

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{location} Air Quality Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">PM2.5</p>
                <p className="text-2xl font-semibold">{data?.data?.iaqi?.pm25?.v || "N/A"}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">PM10</p>
                <p className="text-2xl font-semibold">{data?.data?.iaqi?.pm10?.v || "N/A"}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">NO2</p>
                <p className="text-2xl font-semibold">{data?.data?.iaqi?.no2?.v || "N/A"}</p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="aqi" stroke="#0EA5E9" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LocationModal;