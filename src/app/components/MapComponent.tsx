import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, LayersControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
});

type MapComponentProps = {
  setLocation: (locationName: string) => void;
  pickupLocation: string;
};

const MapComponent: React.FC<MapComponentProps> = ({
  setLocation,
  pickupLocation,
}) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);

  const fetchLocationName = async (lat: number, lng: number) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const locationName = data.display_name || "Unknown location";
      setLocation(locationName); // Update location name in parent
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocation("Unable to retrieve location name");
    }
  };

  const LocationSelector: React.FC = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]); // Set the marker position
        fetchLocationName(lat, lng); // Fetch and update location name
      },
    });

    return markerPosition ? <Marker position={markerPosition} icon={customIcon} /> : null;
  };

  return (
    <div>
      <p className="text-gray-600 mb-4">Click on the map to specify your location:</p>
      <div className="w-full h-64 border rounded">
        <MapContainer
          className="z-0"
          center={[12.8797, 121.774]} // Default to Philippines
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Standard">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Terrain">
              <TileLayer
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://opentopomap.org/">OpenTopoMap</a> contributors'
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          <LocationSelector />
        </MapContainer>
      </div>
      <div className="mt-4">
        <label className="block text-gray-600">Selected Location:</label>
        <p className="text-gray-800 text-sm">
          {pickupLocation || "No location selected yet."}
        </p>
      </div>
    </div>
  );
};

export default MapComponent;
