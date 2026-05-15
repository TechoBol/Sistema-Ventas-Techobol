import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";

// =====================================================
// 🔥 MOVER MAPA
// =====================================================

const ChangeMapView = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 16);
    }
  }, [center]);

  return null;
};

// =====================================================
// 🔥 MARKER
// =====================================================

const LocationMarker = ({
  position,
  setPosition,
  onConfirm,
}) => {
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

  return position ? (
    <Marker position={position} />
  ) : null;
};

// =====================================================
// 🔥 COMPONENTE
// =====================================================

const LocationPicker = ({
  onConfirm,
  value,
}) => {
  const [position, setPosition] =
    useState(null);

  // 🔥 sincronizar desde afuera

  useEffect(() => {
    if (
      value?.lat &&
      value?.lng
    ) {
      setPosition(value);
    }
  }, [value]);

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
        center={
          position || [
            -17.3935,
            -66.157,
          ]
        }
        zoom={13}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeMapView center={position} />

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