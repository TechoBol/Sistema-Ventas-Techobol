import styled, { keyframes, css } from "styled-components";
import { theme } from "../ui/Theme";

const { colors } = theme;

/* ─── Animations ─────────────────────────────────────────────────── */

export const ring = keyframes`
  0%   { transform: rotate(0deg); }
  10%  { transform: rotate(14deg); }
  20%  { transform: rotate(-8deg); }
  30%  { transform: rotate(14deg); }
  40%  { transform: rotate(-4deg); }
  50%  { transform: rotate(10deg); }
  60%  { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
`;

export const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.4); opacity: 0.6; }
`;

export const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(6px); }
  to   { opacity: 1; transform: translateX(0); }
`;

export const expandFromRight = keyframes`
  from { opacity: 0; width: 36px; transform: translateX(10px); }
  to   { opacity: 1; width: 300px; transform: translateX(0); }
`;

export const collapseToRight = keyframes`
  from { opacity: 1; width: 300px; transform: translateX(0); }
  to   { opacity: 0; width: 36px; transform: translateX(10px); }
`;

/* ─── Bell button ─────────────────────────────────────────────────── */

export const Wrapper = styled.div`
  position: relative;
`;

export const BellButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  color: ${colors.textSecondary};
  transition: color 0.15s;

  svg {
    ${({ $ringing }) =>
      $ringing &&
      css`
        animation: ${ring} 0.8s ease forwards;
        transform-origin: top center;
      `}
  }
`;

export const Badge = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${colors.primary};
  border: 2px solid ${colors.background};
  animation: ${pulse} 2s ease-in-out infinite;
`;

/* ─── Panel ───────────────────────────────────────────────────────── */

export const Panel = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 420px;
  max-height: 540px;
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
  animation: ${slideDown} 0.18s ease forwards;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
  border-bottom: 1px solid ${colors.border};
  flex-shrink: 0;
`;

export const PanelTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1;
`;

export const UnreadBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: #FCEBEB;
  color: #A32D2D;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
`;

/* FIX 1: scroll horizontal invisible, altura fija para evitar saltos */
export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-bottom: 1px solid ${colors.border};
  overflow-x: auto;
  flex-shrink: 0;
  height: 44px;

  /* scroll invisible en todos los navegadores */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
`;

/* FIX 2: line-height fijo para que el texto no salte al activarse */
export const FilterChip = styled.button`
  flex-shrink: 0;
  border: none;
  border-radius: 99px;
  padding: 5px 13px;
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  line-height: 1.2;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  white-space: nowrap;
  background: ${({ $active, $activeBg }) =>
    $active ? ($activeBg ?? colors.primaryLight) : "transparent"};
  color: ${({ $active, $activeColor }) =>
    $active ? ($activeColor ?? colors.primary) : colors.textSecondary};

  &:hover {
    background: ${({ $activeBg }) => $activeBg ?? colors.primaryLight};
    color: ${({ $activeColor }) => $activeColor ?? colors.primary};
  }
`;

export const MarkAllBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 12px;
  color: ${colors.primary};
  padding: 4px 6px;
  border-radius: 6px;
  transition: background 0.12s;
  white-space: nowrap;

  &:hover {
    background: ${colors.primaryLight};
  }
`;

/* ─── Notification list ───────────────────────────────────────────── */

export const NotificationList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 4px 0;
  overflow-y: auto;
  flex: 1;
  min-height: 0;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${colors.border};
    border-radius: 2px;
  }
`;

export const NotificationItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px 10px 13px;
  cursor: pointer;
  transition: background 0.12s;
  animation: ${fadeIn} 0.2s ease forwards;
  position: relative;

  background: ${({ $unread }) =>
    $unread ? colors.backgroundHover : "transparent"};

  border-left: 3px solid
    ${({ $unread, $accentColor }) =>
      $unread ? ($accentColor ?? colors.primary) : "transparent"};

  &:hover {
    background: ${colors.backgroundHover};
  }

  & + & {
    border-top: 1px solid ${colors.border};
  }
`;

export const NotifIcon = styled.div`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $color }) => $color ?? colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
  position: relative;
`;

export const NotifIconDot = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ $color }) => $color ?? colors.primary};
  border: 2px solid ${colors.background};
`;

export const NotifBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NotifTitle = styled.p`
  margin: 0 0 1px;
  font-size: 13px;
  color: ${({ $unread }) => ($unread ? colors.textPrimary : colors.textSecondary)};
  font-weight: ${({ $unread }) => ($unread ? 600 : 400)};
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NotifTypeBadge = styled.span`
  display: inline-block;
  font-size: 10px;
  font-weight: 500;
  padding: 1px 7px;
  border-radius: 99px;
  margin-bottom: 3px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

export const NotifSubtitle = styled.p`
  margin: 0 0 3px;
  font-size: 12px;
  color: ${colors.textSecondary};
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NotifTime = styled.span`
  font-size: 11px;
  color: ${colors.textMuted};
`;

export const UnreadDot = styled.div`
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $color }) => $color ?? colors.primary};
  margin-top: 6px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: ${colors.textMuted};
  gap: 8px;
  font-size: 13px;
`;

/* ─── Panel footer ────────────────────────────────────────────────── */

export const PanelFooter = styled.div`
  border-top: 1px solid ${colors.border};
  padding: 10px 16px;
  text-align: center;
  flex-shrink: 0;
`;

export const ViewAllBtn = styled.button`
  border: none;
  background: none;
  font-size: 13px;
  font-weight: 500;
  color: ${colors.primary};
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.12s;

  &:hover {
    background: ${colors.primaryLight};
  }
`;

export const NotifFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
`;

/* ─── Toast ───────────────────────────────────────────────────────── */

export const expandFromBell = keyframes`
  0%   { width: 36px; opacity: 0.6; border-radius: 8px; }
  60%  { width: 310px; opacity: 1; }
  100% { width: 290px; opacity: 1; border-radius: 12px; }
`;

export const collapseToBell = keyframes`
  0%   { width: 290px; opacity: 1; border-radius: 12px; }
  40%  { width: 310px; opacity: 0.8; }
  100% { width: 36px; opacity: 0; border-radius: 8px; }
`;

export const ToastWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${colors.background};
  border: 1.5px solid ${({ $accentColor }) => $accentColor ?? colors.primary};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  white-space: nowrap;
  z-index: 999;
  padding: 0 12px 0 6px;
  animation: ${({ $closing }) =>
    $closing ? collapseToBell : expandFromBell} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
`;

export const ToastIconBox = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: ${({ $color }) => $color ?? colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
`;

export const ToastContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  opacity: 0;
  animation: fadeInContent 0.2s ease 0.25s forwards;

  @keyframes fadeInContent {
    from { opacity: 0; transform: translateX(-4px); }
    to   { opacity: 1; transform: translateX(0); }
  }
`;

export const ToastTitle = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

export const ToastBody = styled.span`
  font-size: 11px;
  color: ${colors.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

export const ToastProgressBar = styled.div``;
export const NotifMessage = NotifTitle;