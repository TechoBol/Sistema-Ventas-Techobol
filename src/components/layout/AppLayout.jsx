import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import {
  LayoutWrapper,
  MainWrapper,
  ContentWrapper,
  MobileOverlay,
} from "../ui/layout/AppLayout.styles";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(
      "sidebar-collapsed"
    );

    if (saved !== null) {
      setIsSidebarCollapsed(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "sidebar-collapsed",
      JSON.stringify(isSidebarCollapsed)
    );
  }, [isSidebarCollapsed]);

  const openSidebar = () => setIsSidebarOpen(true);

  const closeSidebar = () => setIsSidebarOpen(false);

  const toggleDesktopSidebar = () => {
    if (window.innerWidth < 900) {
      openSidebar();
      return;
    }

    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <LayoutWrapper $isCollapsed={isSidebarCollapsed}>
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={closeSidebar}
        onToggleCollapse={toggleDesktopSidebar}
      />

      {isSidebarOpen && (
        <MobileOverlay onClick={closeSidebar} />
      )}

      <MainWrapper>
        <Topbar onOpenSidebar={toggleDesktopSidebar} />

        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </MainWrapper>
    </LayoutWrapper>
  );
}

export default AppLayout;