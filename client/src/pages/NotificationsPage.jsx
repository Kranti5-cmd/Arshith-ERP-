import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Bell, CheckCircle2, AlertTriangle, Info, CheckCheck } from 'lucide-react';

export const NotificationsPage = ({ onSelectProject }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await api.getNotifications();
      if (res.success) setNotifications(res.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      fetchNotifs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-5 max-w-4xl mx-auto text-xs max-w-full overflow-x-hidden font-sans animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-[#DDE4EC]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#7C8998] mb-1 font-medium">
            <span>Atmosphere</span>
            <span>&rsaquo;</span>
            <span>Activity</span>
            <span>&rsaquo;</span>
            <span className="text-[#253142] font-semibold">Notifications</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#253142] tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-[#2563EB] shrink-0" /> <span>Notifications & Operational Alerts</span>
          </h1>
          <p className="text-xs text-[#7C8998] mt-0.5">
            Real-time notifications for status transitions, budget utilization thresholds and overdue tasks.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#E8EDF3] border border-[#DDE4EC] hover:bg-[#DDE4EC] text-[#253142] rounded-2xl text-xs font-semibold shadow-atmo-btn transition-all"
        >
          <CheckCheck className="w-4 h-4 text-[#2563EB]" />
          <span>Mark All as Read</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              handleMarkRead(n.id);
              if (n.relatedProjectId) onSelectProject(n.relatedProjectId);
            }}
            className={`p-4 rounded-3xl border flex items-start justify-between gap-4 cursor-pointer transition-all ${
              n.isRead
                ? 'bg-[#F4F7FA] border-[#DDE4EC] shadow-atmo-card opacity-90'
                : 'bg-[#EFF6FF]/40 border-[#BFDBFE] shadow-atmo-card'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`p-2.5 rounded-2xl flex-shrink-0 shadow-atmo-btn ${
                  n.type === 'ALERT'
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : n.type === 'WARNING'
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : n.type === 'SUCCESS'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
                }`}
              >
                {n.type === 'ALERT' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : n.type === 'SUCCESS' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#253142] text-xs">{n.title}</h3>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>}
                </div>
                <p className="text-[#7C8998] mt-1">{n.message}</p>
                <div className="text-[10px] text-[#A0ACBA] font-mono mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

