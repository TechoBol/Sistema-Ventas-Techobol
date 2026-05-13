import React from "react";
import { Bell, Menu, ChevronDown, User } from "lucide-react";
import {
  TopbarWrapper,
  LeftActions,
  MenuButton,
  Actions,
  IconButton,
  UserProfile,
  Avatar,
  UserText,
  UserName,
  UserRole,
} from "../ui/layout/Topbar.styles";

function Topbar({ onOpenSidebar }) {
  return (
    <TopbarWrapper>
      <LeftActions>
        <MenuButton type="button" onClick={onOpenSidebar}>
          <Menu size={22} />
        </MenuButton>
      </LeftActions>

      <Actions>
        <IconButton type="button">
          <Bell size={18} />
        </IconButton>

        <UserProfile>
          <Avatar>
            <User size={18} strokeWidth={1.8} />
          </Avatar>
          <UserText>
            <UserName>Carlos</UserName>
            <UserRole>Administrador</UserRole>
          </UserText>
          <ChevronDown size={16} />
        </UserProfile>
      </Actions>
    </TopbarWrapper>
  );
}

export default Topbar;
