import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import './GovtDashboard.css'; // Ensure this CSS file exists with styles below
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import truckIconImage from './images/truck.jpg'; // Ensure correct path to truck image

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
  const [destinationPosition, setDestinationPosition] = useState([13.067439, 80.237617]); // Example destination (Chennai)
  const [currentLocationName, setCurrentLocationName] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [partners, setPartners] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);
  const [truckCapacityData, setTruckCapacityData] = useState([
    { name: 'Truck 1', value: 40 },
    { name: 'Truck 2', value: 30 },
    { name: 'Truck 3', value: 20 },
    { name: 'Truck 4', value: 10 }
  ]);

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

  useEffect(() => {
    const defaultPosition = [13.0827, 80.2707]; // Default (Chennai)

    const reverseGeocode = async (lat, lon, setLocationName) => {
      try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=4f2042ea0a594d04b2ff0ebe32e3a718 `);
        const location = response.data.results[0].formatted;
        setLocationName(location);
      } catch (err) {
        setLocationName('Unknown location');
        setError('Error fetching location name.');
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
          reverseGeocode(latitude, longitude, setCurrentLocationName);
        },
        (err) => {
          setError(`Geolocation Error: ${err.message}`);
          setCurrentPosition(defaultPosition);
          reverseGeocode(defaultPosition[0], defaultPosition[1], setCurrentLocationName);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setCurrentPosition(defaultPosition);
      reverseGeocode(defaultPosition[0], defaultPosition[1], setCurrentLocationName);
    }

    reverseGeocode(destinationPosition[0], destinationPosition[1], setDestinationName);

    axios.get('http://localhost:5000/partners')
      .then((res) => setPartners(res.data))
      .catch((err) => setError('Error fetching partners'));

    axios.get('http://localhost:5000/drivers')
      .then((res) => setDrivers(res.data))
      .catch((err) => setError('Error fetching drivers'));
  }, [destinationPosition]);

  return (
    <div className="govt-dashboard">
      {/* Full-screen Map Container */}
      <div className="map-container">
        <MapContainer
          center={currentPosition || [13.0827, 80.2707]}
          zoom={13}
          style={{ height: '200vh', width: '200%' }} // Ensures the map takes up the entire viewport
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker currentPosition={currentPosition} destination={destinationPosition} />
        </MapContainer>
      </div>
  
      {/* Scrollable Content Below the Map */}
      <div className="content-container">
        {/* Route Details */}
        <div className="route-description">
          <h2>Route Details</h2>
          <p>Starting Location: {currentLocationName || 'Loading...'}</p>
          <p>Destination: {destinationName || 'Loading...'}</p>
        </div>
  
        {/* Truck Capacity and Drivers/Partners Info */}
        <div className="truck-capacity-chart">
          <h2>Truck Capacity Distribution</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={truckCapacityData}
              cx={200}
              cy={200}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {truckCapacityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
  
        {/* Driver and Partner Information */}
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
  
        {/* Truck Capacity Information */}
        <div className="truck-capacity-info">
          <h2>Truck Capacity Information</h2>
          <ul>
            {truckCapacityData.map((truck, index) => (
              <li key={index}>{truck.name}: {truck.value}% Capacity</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
  
  
}

export default GovtDashboard;
