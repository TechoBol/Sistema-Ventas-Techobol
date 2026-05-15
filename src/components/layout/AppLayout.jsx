import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import {
  LayoutWrapper,
  MainWrapper,
  ContentWrapper,
  MobileOverlay,
} from "../ui/layout/AppLayout.styles";

function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // estado para escritorio
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

      {isSidebarOpen && <MobileOverlay onClick={closeSidebar} />}

      <MainWrapper>
        <Topbar onOpenSidebar={toggleDesktopSidebar} />

        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainWrapper>
    </LayoutWrapper>
  );
}

export default AppLayout;
