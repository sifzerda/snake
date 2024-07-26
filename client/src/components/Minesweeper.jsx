import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import spinner from '../assets/spinner.gif';

const containerStyle = {
  width: '600px',
  height: '600px'
};

const defaultLocation = {
  lat: -37.8136,
  lng: 144.9631
};

const GoogleMapBox = () => {
  const [location, setLocation] = useState(defaultLocation);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleSuccess = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      setIsLoaded(true);
    };

    const handleError = (error) => {
      console.error('Error fetching location', error);
      setError('Unable to retrieve your location. Showing default location.');
      setIsLoaded(true);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      console.error('Geolocation not supported');
      setError('Geolocation not supported by your browser. Showing default location.');
      setIsLoaded(true);
    }
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyCyIZAdqX2IyOBaizf6ybkZIH9dYXrQ9ac">
      {isLoaded ? (
        <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={10}>
          <Marker position={location} />
          {error && <div style={{ color: 'red', padding: '10px' }}>{error}</div>}
        </GoogleMap>
      ) : (
        <div className="loading-container">
          <img src={spinner} alt="Loading..." className="spinner" />
        </div>
      )}
    </LoadScript>
  );
};

export default GoogleMapBox;