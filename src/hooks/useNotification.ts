import { useState, useEffect, useCallback, useRef } from 'react';
import {
    getAllNotificationsService,
    markNotificationAsReadService,
    markAllNotificationsAsReadService,
} from '../services/notificationService';
import { socket } from '../services/SocketIOConnection';
import { useLoginStore } from '../components/store/loginStore';

const POLLING_INTERVAL = 30_000;


const iconByType: Record<string, string> = {
    SALE: '🛒',
    TRANSFER: '📦',
    QUOTATION: '📋',
    IMPORTACION: '🚢',
};

const bgByType: Record<string, string> = {
    SALE: '#dcfce7',
    TRANSFER: '#dbeafe',
    QUOTATION: '#fef9c3',
    IMPORTACION: '#f3e8ff',
};

const normalize = (n: any) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    read: n.isRead,
    createdAt: n.createdAt,
    icon: iconByType[n.type] ?? '🔔',
    iconBg: bgByType[n.type] ?? '#f3f4f6',
    type: n.type,
    sale: n.sale,
    transfer: n.transfer,
    quotation: n.quotation,
    importacion: n.importacion,
});

function useNotifications() {
    const { employeeId, token } = useLoginStore();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [toastNotification, setToastNotification] = useState<any | null>(null);

    const fetchNotifications = useCallback(async () => {
        if (!employeeId || !token) {
            return;
        }
        try {
            const data = await getAllNotificationsService(employeeId, token);
            setNotifications(data.map(normalize));
            setError(null);
        } catch (err: any) {
            setError(err.message);
        }
    }, [employeeId, token]);

    useEffect(() => {
        if (!employeeId || !token) return;
        setLoading(true);
        fetchNotifications().finally(() => setLoading(false));
        intervalRef.current = setInterval(fetchNotifications, POLLING_INTERVAL);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [fetchNotifications, employeeId, token]);

    useEffect(() => {
        if (!employeeId) return;
        const handleNewNotification = (notif: any) => {
            const normalized = normalize(notif);
            setNotifications((prev) => {
                if (prev.some((n) => n.id === normalized.id)) return prev;
                return [normalized, ...prev];
            });
            setToastNotification(normalized);
        };

        const handleConnect = () => {
            socket.emit('join', employeeId);
        };
        socket.on('new_notification', handleNewNotification);
        socket.on('connect', handleConnect);
        if (socket.connected) {
            socket.emit('join', employeeId);
        }

        return () => {
            socket.off('new_notification', handleNewNotification);
            socket.off('connect', handleConnect);
        };
    }, [employeeId]);

    const markAsRead = useCallback(
        async (notificationId: number) => {
            if (!employeeId || !token) return;
            setNotifications((prev) =>
                prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
            );
            try {
                await markNotificationAsReadService(employeeId, notificationId, token);
            } catch {
                setNotifications((prev) =>
                    prev.map((n) => (n.id === notificationId ? { ...n, read: false } : n))
                );
            }
        },
        [employeeId, token]
    );

    const markAllAsRead = useCallback(async () => {
        if (!employeeId || !token) return;
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        try {
            await markAllNotificationsAsReadService(employeeId, token);
        } catch {
            await fetchNotifications();
        }
    }, [employeeId, token, fetchNotifications]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return {
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        refetch: fetchNotifications,
        toastNotification,
        clearToast: () => setToastNotification(null),
    };
}

export default useNotifications;