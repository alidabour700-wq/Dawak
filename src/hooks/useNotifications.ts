/**
 * useNotifications Hook
 * 
 * Custom React hook for managing notifications
 */

import { useState, useEffect, useCallback } from "react";
import { MedicationNotification } from "@/types/medication";
import * as notificationService from "@/services/notificationService";

export function useNotifications(targetUser: "patient" | "caregiver" = "patient") {
  const [notifications, setNotifications] = useState<MedicationNotification[]>(
    []
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    refreshNotifications();
  }, []);

  // Subscribe to notification changes
  useEffect(() => {
    const unsubscribeDoseReminder = notificationService.onNotification(
      "dose_reminder",
      () => refreshNotifications()
    );
    const unsubscribeDoseTaken = notificationService.onNotification(
      "dose_taken",
      () => refreshNotifications()
    );
    const unsubscribeLowStock = notificationService.onNotification(
      "low_stock",
      () => refreshNotifications()
    );

    return () => {
      unsubscribeDoseReminder();
      unsubscribeDoseTaken();
      unsubscribeLowStock();
    };
  }, []);

  const refreshNotifications = useCallback(() => {
    setLoading(true);
    try {
      const notifs = notificationService.getNotificationsFor(targetUser);
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.read).length);
    } finally {
      setLoading(false);
    }
  }, [targetUser]);

  const markAsRead = useCallback((notificationId: string) => {
    notificationService.markAsRead(notificationId);
    refreshNotifications();
  }, []);

  const markAllAsRead = useCallback(() => {
    notifications.forEach((n) => {
      if (!n.read) notificationService.markAsRead(n.id);
    });
    refreshNotifications();
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };
}
