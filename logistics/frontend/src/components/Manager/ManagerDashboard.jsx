import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
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
  const [destinationPosition] = useState([13.067439, 80.237617]); // Sample destination
  const [error, setError] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');

  // Truck capacity data
  const truckCapacity = {
    totalCapacity: 1000,
    occupiedSpace: 600,
  };

  const availableSpace = truckCapacity.totalCapacity - truckCapacity.occupiedSpace;

  // Pie chart data
  const pieData = [
    { name: 'Occupied Space', value: truckCapacity.occupiedSpace },
    { name: 'Available Space', value: availableSpace },
  ];

  const COLORS = ['#FF6384', '#36A2EB'];

  // Sample driver data
  const drivers = [
    { id: 1, name: 'John Doe', truckId: 'TRK123' },
    { id: 2, name: 'Jane Smith', truckId: 'TRK456' },
    { id: 3, name: 'Bob Johnson', truckId: 'TRK789' },
  ];

  useEffect(() => {
    const defaultPosition = [13.0827, 80.2707]; // Default position if geolocation fails
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);

          // Reverse geocoding for current position
          const currentLocResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const currentLocData = await currentLocResponse.json();
          setCurrentAddress(currentLocData.display_name);
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

  // Reverse geocoding for destination position
  useEffect(() => {
    const fetchDestinationAddress = async () => {
      const destLocResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${destinationPosition[0]}&lon=${destinationPosition[1]}&format=json`
      );
      const destLocData = await destLocResponse.json();
      setDestinationAddress(destLocData.display_name);
    };

    fetchDestinationAddress();
  }, [destinationPosition]);

  return (
    <div className="manager-dashboard">
      <h1>Manager Dashboard</h1>
      <p>Your live location and destination details</p>

      {error && <p className="error-message">Error: {error}</p>}

      <div className="dashboard-container">
        <div className="map-container">
          <MapContainer
            center={currentPosition || [13.0827, 80.2707]}
            zoom={13}
            style={{ height: '60vh', width: '100%' }} // Set height for map
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker currentPosition={currentPosition} destination={destinationPosition} />
          </MapContainer>
        </div>

        <div className="info-container">
          <div className="location-details">
            <h2>Live Location</h2>
            <p>Address: {currentAddress}</p>
            <h2>Destination</h2>
            <p>Address: {destinationAddress}</p>
          </div>

          <div className="route-description">
            <h2>Route Description</h2>
            <p>From: {currentAddress} <br /> To: {destinationAddress}</p>
          </div>

          <div className="capacity-chart">
            <h2>Truck Capacity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="capacity-info-details">
              <p>Total Capacity: {truckCapacity.totalCapacity} m³</p>
              <p>Occupied Space: {truckCapacity.occupiedSpace} m³</p>
              <p>Available Space: {availableSpace} m³</p>
            </div>
          </div>

          <div className="drivers-table">
            <h2>Drivers Information</h2>
            <table>
              <thead>
                <tr>
                  <th>Driver Name</th>
                  <th>Truck ID</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map(driver => (
                  <tr key={driver.id}>
                    <td>{driver.name}</td>
                    <td>{driver.truckId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;