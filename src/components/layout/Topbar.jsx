import React, { useState, useRef, useEffect } from "react";

import { Bell, ChevronDown, User, LogOut ,PiggyBank} from "lucide-react";
import MenuIcon from "@mui/icons-material/Menu";
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
  UserMenuWrapper,
  DropdownMenu,
  DropdownHeader,
  DropdownName,
  DropdownRole,
  DropdownItem,
} from "../ui/layout/Topbar.styles";

import { useLoginStore } from "../store/loginStore";

import useAuthentication from "../../hooks/useAuthentication";

function Topbar({ onOpenSidebar }) {
  const { fullName, role } = useLoginStore();

  const { logOut ,redirect} = useAuthentication();

  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <TopbarWrapper>
      <LeftActions>
        <MenuButton type="button" onClick={onOpenSidebar}>
          <MenuIcon size={22} />
        </MenuButton>
      </LeftActions>

      <Actions>
        <IconButton type="button">
          <Bell size={18} />
        </IconButton>

        <UserMenuWrapper ref={menuRef}>
          <UserProfile
            type="button"
            onClick={() => setOpenMenu((prev) => !prev)}
          >
            <Avatar>
              <User size={18} strokeWidth={1.8} />
            </Avatar>

            <UserText>
              <UserName>{fullName}</UserName>
              <UserRole>{role}</UserRole>
            </UserText>

            <ChevronDown size={16} />
          </UserProfile>

          {openMenu && (
            <DropdownMenu>
              <DropdownHeader>
                <DropdownName>{fullName}</DropdownName>
                <DropdownRole>{role}</DropdownRole>
              </DropdownHeader>
              <DropdownItem
                onClick={redirect}
              >
                <PiggyBank size={18} />
                Ir a tesoreria
              </DropdownItem>
              <DropdownItem onClick={logOut}>
                <LogOut size={18} />
                Cerrar sesión
              </DropdownItem>
            </DropdownMenu>
          )}
        </UserMenuWrapper>
      </Actions>
    </TopbarWrapper>
  );
}

export default Topbar;
