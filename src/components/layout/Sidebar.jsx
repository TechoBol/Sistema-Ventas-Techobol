import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  ShoppingCart,
  ReceiptText,
  ClipboardMinus,
  Users,
  BarChart3,
  Building2,
  Truck,
  Settings,
  UserCog,
  X,
  FileText,
  ChevronDown,
  DollarSign,
} from "lucide-react";

import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";
import { NavLink, useLocation } from "react-router-dom";

import { usePermissions } from "../../hooks/usePermissions";
import { actionTooltipProps } from "../ui/DataTable.styles";

import {
  SidebarWrapper,
  SidebarHeader,
  Brand,
  BrandText,
  CloseButton,
  CollapseButton,
  NavContent,
  NavSection,
  SectionTitle,
  NavItem,
  NavItemText,
  ToggleIcon,
  SubNavList,
  SubNavItem,
  SubNavItemText,
  BranchSelectorWrapper,
  BranchSelectorButton,
  ActiveBranchRow,
  ActiveBranchText,
  BranchDropdownIcon,
  BranchDropdown,
  BranchDropdownHeader,
  BranchOption,
  BranchOptionTop,
  BranchName,
  BranchCode,
  BranchBadge,
} from "../ui/layout/Sidebar.styles";
import { useSucursales } from "../../hooks/useSucursales";
import { useLocationStore } from "../store/locationStore";
import { useLoginStore } from "../store/loginStore";

const sidebarSections = [
  {
    title: "Inicio",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
        permission: "canViewDashboard",
      },
    ],
  },

  {
    title: "Inventario",
    items: [
      {
        label: "Inventario",
        icon: Package,
        path: "/products",
        permission: "canViewProducts",
      },
      {
        label: "Kardex FV",
        icon: ClipboardList,
        path: "/kardex",
        permission: "canManageInventory",
      },
    ],
  },

  {
    title: "Ventas",
    items: [
      {
        label: "Venta",
        icon: ShoppingCart,
        path: "/cart",
        permission: "canSell",
      },
      {
        label: "Recibos / Facturas",
        icon: ReceiptText,
        path: "/receipts",
        permission: "canViewReceipts",
      },
      {
        label: "Cotizaciones",
        icon: FileText,
        path: "/quotations",
        permission: "canViewQuotations",
      },
      {
        label: "Matriz de Ventas",
        icon: ClipboardMinus,
        path: "/sales-matrix",
        permission: "canManageSales",
      },
    ],
  },

  {
    title: "Administración",
    items: [
      {
        label: "Márgenes y Utilidades",
        icon: BarChart3,
        path: "/profits",
        permission: "canViewProfits", // SOLO ADMIN
      },
      {
        label: "Clientes",
        icon: Users,
        path: "/customer",
        permission: "canViewCustomers",
      },
      {
        label: "Costos / Importaciones",
        icon: DollarSign,
        path: "/costs",
        permission: "canManageCosts",
      },
      {
        label: "Sucursales",
        icon: Building2,
        path: "/locations",
        permission: "canManageBranches",
      },
      {
        label: "Transferencias",
        icon: Truck,
        path: "/transfers",
        permission: "canManageTransfers",
      },
    ],
  },

  {
    title: "Configuración",
    items: [
      {
        label: "Usuarios",
        icon: UserCog,
        path: "/users",
        permission: "canManageUsers",
      },
      {
        label: "Sistema",
        icon: Settings,
        permission: "canManageRoles",
        children: [
          {
            label: "Roles",
            path: "/roles",
          },
          {
            label: "Marcas",
            path: "/brands",
          },
        ],
      },
    ],
  },
];

function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }) {
  const location = useLocation();
  const permissions = usePermissions();
  const { data: locations } = useSucursales();
  const { location: userLocation } = useLoginStore();

  const { selectedLocation, setSelectedLocation } = useLocationStore();
  const canChangeLocation = permissions.isAdmin || permissions.isManager;
  
  const displayLocation =
    permissions.isAdmin || permissions.isManager
      ? selectedLocation
      : userLocation;

  useEffect(() => {
    if (!selectedLocation && locations.length) {
      const defaultLocation = locations.find((l) => l.id === 1) || locations[0];

      setSelectedLocation(defaultLocation);
    }
  }, [locations, selectedLocation]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        branchDropdownRef.current &&
        !branchDropdownRef.current.contains(event.target)
      ) {
        setShowLocations(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [showLocations, setShowLocations] = useState(false);
  const branchDropdownRef = useRef(null);

  const defaultOpenMenus = useMemo(() => {
    const openMenus = {};

    sidebarSections.forEach((section) => {
      section.items.forEach((item) => {
        const hasActiveChild = item.children?.some(
          (child) => child.path === location.pathname,
        );

        if (hasActiveChild) {
          openMenus[item.label] = true;
        }
      });
    });

    return openMenus;
  }, [location.pathname]);

  const [openMenus, setOpenMenus] = useState(defaultOpenMenus);

  const closeOnMobile = () => {
    if (window.innerWidth < 900) {
      onClose?.();
    }
  };

  const toggleSubmenu = (label) => {
    if (isCollapsed) return;

    setOpenMenus((current) => ({
      ...current,
      [label]: !current[label],
    }));
  };

  const filteredSections = useMemo(() => {
    return sidebarSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          if (!item.permission) return true;
          return permissions[item.permission];
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [permissions]);

  return (
    <SidebarWrapper $isOpen={isOpen} $isCollapsed={isCollapsed}>
      <SidebarHeader $isCollapsed={isCollapsed}>
        <Brand>
          {!isCollapsed && (
            <BranchSelectorWrapper ref={branchDropdownRef}>
              {" "}
              <BranchSelectorButton
                onClick={() => {
                  if (canChangeLocation) {
                    setShowLocations((prev) => !prev);
                  }
                }}
                style={{
                  cursor: canChangeLocation ? "pointer" : "default",
                }}
              >
                <BrandText>Megadis</BrandText>

                {displayLocation && (
                  <ActiveBranchRow>
                    <Building2 size={13} />

                    <ActiveBranchText>{displayLocation.name}</ActiveBranchText>

                    {(permissions.isAdmin || permissions.isManager) && (
                      <BranchDropdownIcon>
                        <ChevronDown
                          size={13}
                          style={{
                            transform: showLocations
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "0.2s",
                          }}
                        />
                      </BranchDropdownIcon>
                    )}
                  </ActiveBranchRow>
                )}
              </BranchSelectorButton>
              {canChangeLocation && showLocations && (
                <BranchDropdown>
                  <BranchDropdownHeader>
                    Seleccionar sucursal
                  </BranchDropdownHeader>

                  {locations.map((location) => (
                    <BranchOption
                      key={location.id}
                      $active={selectedLocation?.id === location.id}
                      onClick={() => {
                        setSelectedLocation(location);
                        setShowLocations(false);
                      }}
                    >
                      <BranchOptionTop>
                        <BranchName>{location.name}</BranchName>

                        {selectedLocation?.id === location.id && (
                          <BranchBadge>Actual</BranchBadge>
                        )}
                      </BranchOptionTop>

                      <BranchCode>{location.abbreviation}</BranchCode>
                    </BranchOption>
                  ))}
                </BranchDropdown>
              )}
            </BranchSelectorWrapper>
          )}
        </Brand>

        <CollapseButton
          type="button"
          $isCollapsed={isCollapsed}
          onClick={onToggleCollapse}
        >
          {isCollapsed ? <MenuIcon size={18} /> : <MenuOpenIcon size={18} />}
        </CollapseButton>

        <CloseButton type="button" onClick={onClose}>
          <X size={20} />
        </CloseButton>
      </SidebarHeader>

      <NavContent $isCollapsed={isCollapsed}>
        {filteredSections.map((section) => (
          <NavSection key={section.title}>
            {!isCollapsed && <SectionTitle>{section.title}</SectionTitle>}

            {section.items.map((item) => {
              const Icon = item.icon;
              const hasChildren = Boolean(item.children?.length);
              const isSubmenuOpen = Boolean(openMenus[item.label]);
              const hasActiveChild = item.children?.some(
                (child) => child.path === location.pathname,
              );

              if (hasChildren) {
                return (
                  <div key={item.label}>
                    <Tooltip
                      title={isCollapsed ? item.label : ""}
                      {...actionTooltipProps}
                    >
                      <NavItem
                        as="button"
                        type="button"
                        $active={hasActiveChild}
                        $isCollapsed={isCollapsed}
                        onClick={() => toggleSubmenu(item.label)}
                      >
                        <Icon size={18} />

                        {!isCollapsed && (
                          <>
                            <NavItemText>{item.label}</NavItemText>
                            <ToggleIcon $isOpen={isSubmenuOpen}>
                              <ChevronDown size={16} />
                            </ToggleIcon>
                          </>
                        )}
                      </NavItem>
                    </Tooltip>

                    {!isCollapsed && isSubmenuOpen && (
                      <SubNavList>
                        {item.children.map((child) => (
                          <NavLink
                            key={child.label}
                            to={child.path}
                            style={{ textDecoration: "none" }}
                            onClick={closeOnMobile}
                          >
                            {({ isActive }) => (
                              <SubNavItem $active={isActive}>
                                <SubNavItemText>{child.label}</SubNavItemText>
                              </SubNavItem>
                            )}
                          </NavLink>
                        ))}
                      </SubNavList>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  style={{ textDecoration: "none" }}
                  onClick={closeOnMobile}
                >
                  {({ isActive }) => (
                    <Tooltip
                      title={isCollapsed ? item.label : ""}
                      {...actionTooltipProps}
                    >
                      <NavItem $active={isActive} $isCollapsed={isCollapsed}>
                        <Icon size={18} />
                        {!isCollapsed && (
                          <NavItemText>{item.label}</NavItemText>
                        )}
                      </NavItem>
                    </Tooltip>
                  )}
                </NavLink>
              );
            })}
          </NavSection>
        ))}
      </NavContent>
    </SidebarWrapper>
  );
}

export default Sidebar;
