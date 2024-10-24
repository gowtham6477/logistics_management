// ManagerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import './ManagerDashboard.css';

import truckIconImage from './images/truck.jpg';

const truckIcon = new L.Icon({
  iconUrl: truckIconImage,
  iconSize: [38, 38],
  iconAnchor: [22, 38],
  popupAnchor: [0, -38],
});

const LocationMarker = ({ currentPosition, destination }) => {
  const map = useMap();

  useEffect(() => {
    if (currentPosition) {
      map.setView(currentPosition, 13);
      L.Routing.control({
        waypoints: [L.latLng(currentPosition), L.latLng(destination)],
        routeWhileDragging: true,
      }).addTo(map);
    }
  }, [currentPosition, destination, map]);

  return currentPosition === null ? null : (
    <Marker position={currentPosition} icon={truckIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

function ManagerDashboard() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [destinationPosition, setDestinationPosition] = useState([13.067439, 80.237617]); // Sample destination
  const [error, setError] = useState(null);

  useEffect(() => {
    const defaultPosition = [13.0827, 80.2707]; // Default position if geolocation fails
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
        },
        (err) => {
          setError(`Geolocation Error: ${err.message}`);
          setCurrentPosition(defaultPosition);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setCurrentPosition(defaultPosition);
    }
  }, []);

  return (
    <div className="manager-dashboard">
      <h1>Manager Dashboard</h1>
      <p>Your live location and destination details</p>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div className="map-container" style={{ height: '400px', width: '100%' }}>
        <MapContainer
          center={currentPosition || [13.0827, 80.2707]}
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

      {currentPosition && (
        <div className="location-details">
          <h2>Live Location</h2>
          <p>Latitude: {currentPosition[0]}</p>
          <p>Longitude: {currentPosition[1]}</p>
          <h2>Destination</h2>
          <p>Latitude: {destinationPosition[0]}</p>
          <p>Longitude: {destinationPosition[1]}</p>
        </div>
      )}
    </div>
  );
}

export default ManagerDashboard;
