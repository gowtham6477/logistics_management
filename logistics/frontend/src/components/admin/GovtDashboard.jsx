import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import './GovtDashboard.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import truckIconImage from './images/truck.jpg';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const truckIcon = new L.Icon({
  iconUrl: truckIconImage,
  iconSize: [38, 38],
  iconAnchor: [22, 38],
  popupAnchor: [0, -38],
});

function LocationMarker({ currentPosition, destination }) {
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
}

function GovtDashboard() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [partners, setPartners] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);

  const destinationPosition = [13.067439, 80.237617];

  useEffect(() => {
    const defaultPosition = [13.0827, 80.2707];
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

    // Fetch private partners and drivers from the backend
    axios.get('http://localhost:5000/partners')
      .then((res) => setPartners(res.data))
      .catch((err) => setError('Error fetching partners'));
    
    axios.get('http://localhost:5000/drivers')
      .then((res) => setDrivers(res.data))
      .catch((err) => setError('Error fetching drivers'));
  }, []);

  return (
    <div className="govt-dashboard">
      <h1>Government Dashboard</h1>
      <p>Manage Private Partners and Truck Drivers</p>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div className="map-container">
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

      <div className="partner-driver-info">
        <h2>Private Partners</h2>
        {partners.map((partner) => (
          <p key={partner._id}>{partner.name} - {partner.location}</p>
        ))}

        <h2>Truck Drivers</h2>
        {drivers.map((driver) => (
          <p key={driver._id}>{driver.name} - Current Location: {driver.currentLocation.join(', ')}</p>
        ))}
      </div>
    </div>
  );
}

export default GovtDashboard;
