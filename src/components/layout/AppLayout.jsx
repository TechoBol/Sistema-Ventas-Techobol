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

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <LayoutWrapper>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {isSidebarOpen && <MobileOverlay onClick={closeSidebar} />}

      <MainWrapper>
        <Topbar onOpenSidebar={openSidebar} />

        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainWrapper>
    </LayoutWrapper>
  );
}

export default AppLayout;
