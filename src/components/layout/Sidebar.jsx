import React from "react";

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
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";

import { NavLink } from "react-router-dom";

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
        label: "Carrito de Venta",
        icon: ShoppingCart,
        path: "/cart",
      },
      {
        label: "Comprobantes",
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
        path: "/settings",
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
  return (
    <SidebarWrapper $isOpen={isOpen} $isCollapsed={isCollapsed}>
      <SidebarHeader $isCollapsed={isCollapsed}>
        <Brand>
          {!isCollapsed && (
            <BrandText>
              Megadis
            </BrandText>
          )}
        </Brand>

        <CollapseButton
          type="button"
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expandir menú" : "Contraer menú"}
        >
          {isCollapsed ? (
            <MenuIcon size={18} />
          ) : (
            <MenuOpenIcon size={18} />
          )}
        </CollapseButton>

        <CloseButton
          type="button"
          onClick={onClose}
        >
          <X size={20} />
        </CloseButton>
      </SidebarHeader>

      <NavContent>
        {sidebarSections.map((section) => (
          <NavSection key={section.title}>
            {!isCollapsed && (
              <SectionTitle>
                {section.title}
              </SectionTitle>
            )}

            {section.items.map(({ label, icon: Icon, path }) => {
              if (!path) {
                return (
                  <NavItem
                    key={label}
                    $active={false}
                    $isCollapsed={isCollapsed}
                    title={isCollapsed ? label : undefined}
                  >
                    <Icon size={18} />

                    {!isCollapsed && (
                      <NavItemText>{label}</NavItemText>
                    )}
                  </NavItem>
                );
              }

              return (
                <NavLink
                  key={label}
                  to={path}
                  style={{
                    textDecoration: "none",
                  }}
                >
                  {({ isActive }) => (
                    <NavItem
                      $active={isActive}
                      $isCollapsed={isCollapsed}
                      title={isCollapsed ? label : undefined}
                      onClick={() => {
                        if (window.innerWidth < 900) {
                          onClose?.();
                        }
                      }}
                    >
                      <Icon size={18} />

                      {!isCollapsed && (
                        <NavItemText>{label}</NavItemText>
                      )}
                    </NavItem>
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
