import CustomerMap from "../utils/CustomerMap";

import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalHeaderText,
  ModalTitle,
  ModalSubtitle,
  CloseButton,
  ModalBody,
  Sidebar,
  LocationItem,
  LocationPin,
  LocationInfo,
  LocationAddress,
  PrimaryBadge,
  MapWrapper,
} from "../ui/CustomerLocations.styles.jsx";

export default function CustomerLocationsModal({
  open,
  onClose,
  customer,
  addresses,
  selectedAddress,
  setSelectedAddress,
}) {
  if (!open) return null;

  return (
    <ModalOverlay>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalHeaderText>
            <ModalTitle>Ubicaciones</ModalTitle>
            <ModalSubtitle>{customer?.name}</ModalSubtitle>
          </ModalHeaderText>

          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <ModalBody>
          <Sidebar>
            {addresses.map((address) => {
              const isActive = selectedAddress?.id === address.id;
              return (
                <LocationItem
                  key={address.id}
                  $active={isActive}
                  onClick={() => setSelectedAddress(address)}
                >
                  <LocationPin $active={isActive}>📍</LocationPin>

                  <LocationInfo>
                    <LocationAddress $active={isActive}>
                      {address.address}
                    </LocationAddress>
                    {address.isPrimary && (
                      <PrimaryBadge>Principal</PrimaryBadge>
                    )}
                  </LocationInfo>
                </LocationItem>
              );
            })}
          </Sidebar>

          <MapWrapper>
            <CustomerMap
              addresses={addresses}
              selectedAddress={selectedAddress}
              height="100%"
            />
          </MapWrapper>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
}