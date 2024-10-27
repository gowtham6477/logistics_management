import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Pie } from 'react-chartjs-2'; // Import Pie chart from Chart.js
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'; // Import necessary Chart.js components
import './TruckDriverDashboard.css'; // Ensure this CSS file exists with styles below
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import truckIconImage from './images/truck.jpg'; // Ensure correct path to truck image

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

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
    if (currentPosition && destination) {
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

function TruckDriverDashboard() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [destinationPosition] = useState([13.067439, 80.237617]); // Example destination (Chennai)
  const [currentLocationName, setCurrentLocationName] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [error, setError] = useState(null);
  
  // Sample data for the pie chart
  const [goodsData] = useState({
    labels: ['Glass', 'Electronics', 'Clothing', 'Furniture'],
    datasets: [{
      data: [25, 35, 20, 20], // Example values for each good type
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }]
  });

  const truckCapacityData = [
    { name: 'Available', value: 60 },
    { name: 'Occupied', value: 40 }
  ];

  useEffect(() => {
    const defaultPosition = [13.0827, 80.2707]; // Default (Chennai)

    const reverseGeocode = async (lat, lon, setLocationName) => {
      try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=4f2042ea0a594d04b2ff0ebe32e3a718`);
        const location = response.data.results[0]?.formatted || 'Unknown location';
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
  }, [destinationPosition]);

  return (
    <div className="govt-dashboard">
      {/* Map Section */}
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

      {/* Details Section */}
      <div className="details-container">
        {/* Route Description */}
        <div className="route-description">
          <h2>Route Details</h2>
          <p>Starting Location: {currentLocationName || 'Loading...'}</p>
          <p>Destination: {destinationName || 'Loading...'}</p>
        </div>

        {/* Coordinates Block */}
        <div className="route-coordinates">
          <h3>In Progress</h3>
          <p>Starting Point: {currentPosition ? `${currentLocationName} (${currentPosition[0]}, ${currentPosition[1]})` : 'Loading...'}</p>
          <p>Destination Point: {destinationName} ({destinationPosition[0]}, {destinationPosition[1]})</p>
        </div>

        {/* Pie Chart Section */}
        <div className="pie-chart-container">
          <h3>Goods Stored in Truck</h3>
          <Pie data={goodsData} />
          </div>
          <div className="pie-chart-container2">
          <h3>Truck Capacity Distribution</h3>
          <Pie
            data={{
              labels: truckCapacityData.map(item => item.name),
              datasets: [{
                data: truckCapacityData.map(item => item.value),
                backgroundColor: ['#FF6384', '#36A2EB'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB']
              }]
            }}
            />
          </div>
      </div>
    </div>
  );
}

export default TruckDriverDashboard;
