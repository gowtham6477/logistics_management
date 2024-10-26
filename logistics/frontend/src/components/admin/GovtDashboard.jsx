import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import DriverForm from './DriverForm';
import PartnerForm from './PartnerForm';
import ManagerForm from './ManagerForm';
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
  const [destinationPosition, setDestinationPosition] = useState([13.067439, 80.237617]);
  const [currentLocationName, setCurrentLocationName] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [partners, setPartners] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState('Driver');
  const [truckCapacityData, setTruckCapacityData] = useState([
    { name: 'Available', value: 60 },
    { name: 'Occupied', value: 40 }
  ]);

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

  const openForm = (type) => {
    setFormType(type);
    setShowModal(true);
  };

  useEffect(() => {
    const reverseGeocode = async (lat, lon, setLocationName) => {
      try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=4f2042ea0a594d04b2ff0ebe32e3a718`);
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
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
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
      <MapContainer
        center={currentPosition || [13.0827, 80.2707]}
        zoom={13}
        style={{ height: '100vh', width: '100%' }}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {currentPosition && (
          <LocationMarker currentPosition={currentPosition} destination={destinationPosition} />
        )}
      </MapContainer>

      <div className="info-container">
        <div className="route-description">
          <h2>Route Description</h2>
          <p><strong>Current Location:</strong> {currentLocationName || 'Fetching...'}</p>
          <p><strong>Destination:</strong> {destinationName || 'Fetching...'}</p>
        </div>

        <div className="chart-container">
          <h3>Truck Capacity Distribution</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={truckCapacityData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {truckCapacityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <p><strong>Truck Capacity Analysis:</strong> This pie chart shows the current distribution of truck capacities for efficient management.</p>
        </div>
      </div>

      <button className="popup-button" onClick={() => openForm('Driver')}>Open Registration Form</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{formType} Registration</h2>
            <button onClick={() => setShowModal(false)} className="close-button">&times;</button>
            {formType === 'Driver' && <DriverForm />}
            {formType === 'Partner' && <PartnerForm />}
            {formType === 'Manager' && <ManagerForm />}
            <div className="form-selector">
              <button onClick={() => openForm('Driver')}>Driver Registration</button>
              <button onClick={() => openForm('Partner')}>Partner Registration</button>
              <button onClick={() => openForm('Manager')}>Manager Registration</button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default GovtDashboard;
