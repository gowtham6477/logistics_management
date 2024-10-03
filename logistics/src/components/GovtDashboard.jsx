import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet';
import './GovtDashboard.css';

// Fix for Leaflet's default marker icons not showing up in React apps
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Correctly set the marker icons using ES6 imports
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function GovtDashboard() {
  return (
    <div className="govt-dashboard">
      <h1>Government Dashboard</h1>
      <p>Manage Private Partners and Truck Drivers</p>

      {/* Leaflet Map Container */}
      <div className="map-container">
        <MapContainer
          center={[51.505, -0.09]} // Example coordinates (London)
          zoom={13}
          style={{ height: '500px', width: '100%' }} // Adjust the map's height and width as needed
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              A simple popup for the Government dashboard. You can manage trucks and partners here.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default GovtDashboard;
