import React, { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import NotificationToast from "./NotificationToast";
import { NOTIF_TYPES } from "../ui/NotificationTypes";
import { useNavigate } from "react-router-dom";
import {
  Wrapper,
  BellButton,
  Badge,
  Panel,
  PanelHeader,
  PanelTitle,
  UnreadBadge,
  FilterRow,
  FilterChip,
  MarkAllBtn,
  NotificationList,
  NotificationItem,
  NotifIcon,
  NotifBody,
  NotifTitle,
  NotifTypeBadge,
  NotifSubtitle,
  NotifTime,
  UnreadDot,
  EmptyState,
  PanelFooter,
  ViewAllBtn,
  NotifFooter,
} from "../ui/NotificationBell";

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "Ahora";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
}

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "SALE", label: "Ventas" },
  { key: "QUOTATION", label: "Cotizaciones" },
  { key: "TRANSFER", label: "Transferencias" },
  { key: "IMPORTACION", label: "Importaciones" },
];

function BellNotifications({
  notifications = [],
  onMarkAllRead,
  onMarkRead,
  onViewAll,
  toastNotification,
  onClearToast,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [ringing, setRinging] = useState(false);
  const [filter, setFilter] = useState("all");
  const panelRef = useRef(null);
  const filterRowRef = useRef(null);
  const prevCountRef = useRef(notifications.length);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (notifications.length > prevCountRef.current) {
      setRinging(true);
      const t = setTimeout(() => setRinging(false), 900);
      prevCountRef.current = notifications.length;
      return () => clearTimeout(t);
    }
    prevCountRef.current = notifications.length;
  }, [notifications.length]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Redirigir scroll vertical del mouse en categorias
  useEffect(() => {
    if (!open) return;  

    const el = filterRowRef.current;
    if (!el) return;

    const handler = (e) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [open]);

  const handleNotifClick = (n) => {
    onMarkRead?.(n.id);
    setOpen(false);

    const routeMap = {
      SALE: { path: "/receipts", code: n.sale?.code },
      QUOTATION: { path: "/quotations", code: n.quotation?.code },
      TRANSFER: { path: "/transfers", code: n.transfer?.transferCode },
    };

    const route = routeMap[n.type];
    if (route?.path && route?.code) {
      navigate(`${route.path}?search=${route.code}`);
    }
  };

  const visible = filter === "all"
    ? notifications
    : notifications.filter((n) => n.type === filter);

  return (
    <Wrapper ref={panelRef}>
      <BellButton
        type="button"
        $ringing={ringing}
        onClick={() => setOpen((p) => !p)}
        aria-label="Notificaciones"
      >
        <Bell size={18} />
        {unreadCount > 0 && <Badge />}
      </BellButton>

      {toastNotification && (
        <NotificationToast
          notification={toastNotification}
          onDone={onClearToast}
        />
      )}

      {open && (
        <Panel>
          <PanelHeader>
            <PanelTitle>
              Notificaciones
              {unreadCount > 0 && (
                <UnreadBadge>{unreadCount} nuevas</UnreadBadge>
              )}
            </PanelTitle>
            {unreadCount > 0 && (
              <MarkAllBtn onClick={onMarkAllRead}>
                <CheckCheck size={13} />
                Marcar todas
              </MarkAllBtn>
            )}
          </PanelHeader>

          <FilterRow ref={filterRowRef}>
            {FILTERS.map(({ key, label }) => {
              const cfg = NOTIF_TYPES[key];
              return (
                <FilterChip
                  key={key}
                  $active={filter === key}
                  $activeBg={cfg?.badgeBg}
                  $activeColor={cfg?.badgeColor}
                  onClick={() => setFilter(key)}
                >
                  {label}
                </FilterChip>
              );
            })}
          </FilterRow>

          <NotificationList>
            {visible.length === 0 ? (
              <EmptyState>
                <Bell size={28} strokeWidth={1.4} />
                Sin notificaciones
              </EmptyState>
            ) : (
              visible.map((n) => {
                const cfg = NOTIF_TYPES[n.type];
                return (
                  <NotificationItem
                    key={n.id}
                    $unread={!n.read}
                    $accentColor={cfg?.accentColor}
                    onClick={() => handleNotifClick(n)}
                  >
                    <NotifIcon $color={n.iconBg ?? cfg?.iconBg}>
                      {n.icon ?? <Bell size={16} />}
                    </NotifIcon>

                    <NotifBody>
                      <NotifTitle $unread={!n.read}>{n.title}</NotifTitle>
                      <NotifSubtitle>{n.body}</NotifSubtitle>
                      <NotifFooter>
                        {cfg && (
                          <NotifTypeBadge $bg={cfg.badgeBg} $color={cfg.badgeColor}>
                            {cfg.label}
                          </NotifTypeBadge>
                        )}
                        <NotifTime>{timeAgo(n.createdAt)}</NotifTime>
                      </NotifFooter>
                    </NotifBody>

                    {!n.read && <UnreadDot $color={cfg?.accentColor} />}
                  </NotificationItem>
                );
              })
            )}
          </NotificationList>

          {onViewAll && (
            <PanelFooter>
              <ViewAllBtn onClick={onViewAll}>
                Ver todas las notificaciones
              </ViewAllBtn>
            </PanelFooter>
          )}
        </Panel>
      )}
    </Wrapper>
  );
}

export default BellNotifications;