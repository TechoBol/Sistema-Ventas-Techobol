import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

const LocationMarker = ({ position, setPosition, onConfirm }) => {
  useMapEvents({
    click(e) {
      const coords = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };

      setPosition(coords);

      onConfirm(coords);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const LocationPicker = ({ onConfirm }) => {
  const [position, setPosition] = useState(null);

  return (
    <div
      style={{
        height: "400px",
        width: "100%",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={[-17.3935, -66.157]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          position={position}
          setPosition={setPosition}
          onConfirm={onConfirm}
        />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;