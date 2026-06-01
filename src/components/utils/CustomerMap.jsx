import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import L from "leaflet";
import FlyToLocation from "./FlyToLocation";

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function CustomerMap({
    addresses = [],
    selectedAddress,
    height = "300px",
}) {
    if (!addresses.length) {
        return (
            <div
                style={{
                    height,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                Sin ubicaciones registradas
            </div>
        );
    }

    return (
        <MapContainer
            center={[
                selectedAddress?.latitude,
                selectedAddress?.longitude,
            ]}
            zoom={15}
            style={{
                height: "100%",
                width: "100%",
                margin: 0,
                padding: 0,
            }}
        >
            <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FlyToLocation
                location={selectedAddress}
            />

            {addresses.map((address) => (
                <Marker
                    key={address.id}
                    position={[
                        address.latitude,
                        address.longitude,
                    ]}
                    icon={redIcon}
                >
                    <Popup>
                        {address.address}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}