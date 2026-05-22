import React, { useMemo, useState } from "react";
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
  ChevronDown,
} from "lucide-react";

import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";

import { NavLink, useLocation } from "react-router-dom";

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
} from "../ui/layout/Sidebar.styles";

const sidebarSections = [
  {
    title: "Inicio",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
      },
    ],
  },
  {
    title: "Inventario",
    items: [
      {
        label: "Productos",
        icon: Package,
        path: "/products",
      },
      {
        label: "Kardex FV",
        icon: ClipboardList,
        path: "/kardex",
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
      },
      {
        label: "Recibos/Facturas",
        icon: ReceiptText,
        path: "/receipts",
      },
      {
        label: "Matriz de Ventas",
        icon: ClipboardMinus,
        path: "/sales-matrix",
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
      },
      {
        label: "Clientes",
        icon: Users,
        path: "/customer",
      },
      {
        label: "Reportes de Ventas",
        icon: BarChart3,
        path: "/sales-reports",
      },
      {
        label: "Sucursales",
        icon: Building2,
        path: "/locations",
      },
      {
        label: "Transferencias",
        icon: Truck,
        path: "/transfers",
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
      },
      {
        label: "Sistema",
        icon: Settings,
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

function Sidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}) {
  const location = useLocation();

  const defaultOpenMenus = useMemo(() => {
    const openMenus = {};

    sidebarSections.forEach((section) => {
      section.items.forEach((item) => {
        const hasActiveChild = item.children?.some(
          (child) => child.path === location.pathname
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

  return (
    <SidebarWrapper
      $isOpen={isOpen}
      $isCollapsed={isCollapsed}
    >
      <SidebarHeader $isCollapsed={isCollapsed}>
        <Brand>
          {!isCollapsed && <BrandText>Megadis</BrandText>}
        </Brand>

        <CollapseButton
          type="button"
          $isCollapsed={isCollapsed}
          onClick={onToggleCollapse}
        >
          {isCollapsed ? (
            <MenuIcon size={18} />
          ) : (
            <MenuOpenIcon size={18} />
          )}
        </CollapseButton>

        <CloseButton type="button" onClick={onClose}>
          <X size={20} />
        </CloseButton>
      </SidebarHeader>

      <NavContent $isCollapsed={isCollapsed}>
        {sidebarSections.map((section) => (
          <NavSection key={section.title}>
            {!isCollapsed && (
              <SectionTitle>{section.title}</SectionTitle>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;

              const hasChildren = Boolean(item.children?.length);

              const isSubmenuOpen = Boolean(
                openMenus[item.label]
              );

              const hasActiveChild = item.children?.some(
                (child) => child.path === location.pathname
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
                        onClick={() =>
                          toggleSubmenu(item.label)
                        }
                      >
                        <Icon size={18} />

                        {!isCollapsed && (
                          <>
                            <NavItemText>
                              {item.label}
                            </NavItemText>

                            <ToggleIcon
                              $isOpen={isSubmenuOpen}
                            >
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
                            style={{
                              textDecoration: "none",
                            }}
                            onClick={closeOnMobile}
                          >
                            {({ isActive }) => (
                              <SubNavItem
                                $active={isActive}
                              >
                                <SubNavItemText>
                                  {child.label}
                                </SubNavItemText>
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
                      <NavItem
                        $active={isActive}
                        $isCollapsed={isCollapsed}
                      >
                        <Icon size={18} />

                        {!isCollapsed && (
                          <NavItemText>
                            {item.label}
                          </NavItemText>
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