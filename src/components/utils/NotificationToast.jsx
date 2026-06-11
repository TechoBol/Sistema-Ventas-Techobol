import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { NOTIF_TYPES } from "../ui/NotificationTypes";
import {
  ToastWrapper,
  ToastIconBox,
  ToastContent,
  ToastTitle,
  ToastBody,
} from "../ui/NotificationBell";

const VISIBLE_MS  = 4000;
const CLOSE_ANIM  = 400;

function NotificationToast({ notification, onDone }) {
  const [closing,   setClosing]   = useState(false);
  const [showIcon,  setShowIcon]  = useState(false); // empieza como campana

  const cfg = NOTIF_TYPES[notification?.type];
  const NotifIcon = cfg?.Icon;

  // Tras 120ms morfea al ícono del tipo
  useEffect(() => {
    const t = setTimeout(() => setShowIcon(true), 120);
    return () => clearTimeout(t);
  }, []);

  // Cierra después de VISIBLE_MS
  useEffect(() => {
    const t = setTimeout(() => {
      setClosing(true);
      setTimeout(onDone, CLOSE_ANIM);
    }, VISIBLE_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <ToastWrapper $closing={closing} $accentColor={cfg?.accentColor}>

      {/* Ícono: campana → ícono del tipo */}
      <ToastIconBox $color={cfg?.iconBg}>
        {showIcon && NotifIcon
          ? <NotifIcon size={13} color={cfg.iconColor} />
          : <Bell size={13} color={cfg?.iconColor ?? "#888"} />
        }
      </ToastIconBox>

      <ToastContent>
        <ToastTitle>{notification.title}</ToastTitle>
        <ToastBody>{notification.body}</ToastBody>
      </ToastContent>

    </ToastWrapper>
  );
}

export default NotificationToast;