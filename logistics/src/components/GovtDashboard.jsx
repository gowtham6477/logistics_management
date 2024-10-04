import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet';
import 'leaflet-routing-machine'; // Import Leaflet Routing Machine
import './GovtDashboard.css';

// Fix for Leaflet's default marker icons not showing up in React apps
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Truck icon for the marker
import truckIconImage from './images/truck.jpg'; // Assuming you have a truck image

// Correctly set the marker icons using ES6 imports
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


// Create a custom truck icon
const truckIcon = new L.Icon({
  iconUrl: truckIconImage, // Path to your truck image
  iconSize: [38, 38], // Adjust size of truck icon
  iconAnchor: [22, 38], // Point where the marker icon is anchored
  popupAnchor: [0, -38], // Point from which the popup should open relative to the iconAnchor
});

function LocationMarker({ currentPosition, destination }) {
  const map = useMap();

  useEffect(() => {
    if (currentPosition) {
      map.setView(currentPosition, 13); // Recenter the map to the user's location

      // Add routing between source (current position) and destination
      L.Routing.control({
        waypoints: [
          L.latLng(currentPosition), // Current location
          L.latLng(destination) // Destination coordinates
        ],
        routeWhileDragging: true, // Allow the user to drag the route
      }).addTo(map);
    }
  }, [currentPosition, destination, map]);

  return currentPosition === null ? null : (
    <Marker position={currentPosition} icon={truckIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

function GovtDashboard() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [error, setError] = useState(null);

  // Destination: Egmore Railway Station, Chennai [13.067439, 80.237617]
  const destinationPosition = [13.067439, 80.237617];

  useEffect(() => {
    const defaultPosition = [13.0827, 80.2707]; // Default to Chennai if location fails

    if (navigator.geolocation) {
      // Geolocation API available
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User's location found:", latitude, longitude);
          setCurrentPosition([latitude, longitude]);
        },
        (err) => {
          console.error("Error getting location: ", err.message);
          setError(`Geolocation Error: ${err.message}`);
          setCurrentPosition(defaultPosition); // Default to Chennai if permission denied
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Options for better accuracy
      );
    } else {
      // Geolocation API not available
      setError('Geolocation is not supported by this browser.');
      setCurrentPosition(defaultPosition); // Default to Chennai
    }
  }, []);

  return (
    <div className="govt-dashboard">
      <h1>Government Dashboard</h1>
      <p>Manage Private Partners and Truck Drivers</p>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Leaflet Map Container */}
      <div className="map-container">
        <MapContainer
          center={currentPosition || [13.0827, 80.2707]} // Default to Chennai until location is fetched
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker currentPosition={currentPosition} destination={destinationPosition} />
        </MapContainer>
      </div>
    </div>
  );
}

export default GovtDashboard;
