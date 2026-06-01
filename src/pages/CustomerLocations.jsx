import { useState, useRef, useEffect } from "react";

import {
    CardTitle,
    RedDot,
} from "../components/ui/DetailCustomer";

import CustomerMap from "../components/utils/CustomerMap";
import CustomerLocationsModal from "../components/modals/CustomerLocationsModal";

import {
    ExpandButton,
    LocationSelect,
    FloatingHeader,
    MapContainerWrapper,
    DropdownWrapper,
    DropdownSelected,
    DropdownList,
    DropdownItem,
} from "../components/ui/CustomerLocations.styles.jsx";

export default function CustomerLocations({ customer }) {
    const [openModal, setOpenModal] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const addresses = customer?.addresses ?? [];
    const initialAddress = addresses.find((a) => a.isPrimary) ?? addresses[0];
    const [selectedAddress, setSelectedAddress] = useState(initialAddress);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <MapContainerWrapper>
                <CustomerMap
                    addresses={addresses}
                    selectedAddress={selectedAddress}
                    height="100%"
                />

                <FloatingHeader>
                    <CardTitle>
                        <RedDot />
                        Ubicaciones
                    </CardTitle>
                    <ExpandButton onClick={() => setOpenModal(true)}>⛶</ExpandButton>
                </FloatingHeader>

                <DropdownWrapper ref={dropdownRef}>
                    {openDropdown && (
                        <DropdownList>
                            {addresses.map((address) => (
                                <DropdownItem
                                    key={address.id}
                                    $active={address.id === selectedAddress?.id}
                                    onClick={() => {
                                        setSelectedAddress(address);
                                        setOpenDropdown(false);
                                    }}
                                >
                                    {address.address}
                                </DropdownItem>
                            ))}
                        </DropdownList>
                    )}

                    <DropdownSelected onClick={() => setOpenDropdown((p) => !p)}>
                        <span>{selectedAddress?.address ?? "Seleccionar ubicación"}</span>
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>
                            {openDropdown ? "▲" : "▼"}
                        </span>
                    </DropdownSelected>
                </DropdownWrapper>
            </MapContainerWrapper>

            <CustomerLocationsModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                customer={customer}
                addresses={addresses}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
            />
        </>
    );
}