import { useState } from "react"
import { X, Trash2 } from "lucide-react"
import { toast } from "react-toastify"
import {
  useGetNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from "@/hooks/useApi"
import type { AppNotification } from "@/types/dataTypes"
import { formatRelativeTime } from "@/lib/utils"

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function NotificationRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-2.5 w-36 rounded bg-gray-200 dark:bg-white/10" />
          </div>
        </div>
      </td>
      <td className="px-5 py-4"><div className="h-3 w-40 rounded bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-3 w-16 rounded bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-6 w-24 rounded bg-gray-200 dark:bg-white/10" /></td>
    </tr>
  )
}

export default function Notifications() {
  const { data, isLoading, isError } = useGetNotifications()
  const markReadMutation = useMarkNotificationRead()
  const markAllReadMutation = useMarkAllNotificationsRead()
  const deleteMutation = useDeleteNotification()

  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null)

  const notificationList = data?.notifications ?? []

  function markAsRead(id: string) {
    markReadMutation.mutate(id, {
      onSuccess: () => toast.success("Marked as read"),
      onError: () => toast.error("Couldn't mark this as read"),
    })
    setSelectedNotification(null)
  }

  function markAllAsRead() {
    markAllReadMutation.mutate(undefined, {
      onSuccess: () => toast.success("All notifications marked as read"),
      onError: () => toast.error("Couldn't mark all as read"),
    })
  }

  function handleDelete(id: string) {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Notification deleted"),
      onError: () => toast.error("Couldn't delete this notification"),
    })
    setSelectedNotification(null)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-xs font-medium text-green-500 mb-1">Communication</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NOTIFICATIONS</h1>
          <p className="text-sm text-gray-400 mt-0.5">Contact form submissions from scouts, families, and media</p>
        </div>
        <button
          onClick={markAllAsRead}
          disabled={notificationList.length === 0 || markAllReadMutation.isPending}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          + Mark all as read
        </button>
      </div>

      {isError && (
        <p className="text-sm text-red-500 mb-4">Couldn't load notifications. Please refresh the page.</p>
      )}

      {/* Table Section */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/10 text-gray-400 text-xs">
              <th className="text-left px-5 py-3 font-medium">Sender</th>
              <th className="text-left px-5 py-3 font-medium">Message</th>
              <th className="text-left px-5 py-3 font-medium">Received</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/10">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <NotificationRowSkeleton key={i} />)
            ) : notificationList.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">
                  No messages yet — submissions from the Contact page will show up here.
                </td>
              </tr>
            ) : (
              notificationList.map((notificat) => (
                <tr
                  key={notificat.id}
                  onClick={() => setSelectedNotification(notificat)}
                  className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${notificat.isRead ? "opacity-60" : ""}`}
                >
                  {/* Sender */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-gray-900 text-xs font-semibold shrink-0">
                        {initialsFor(notificat.senderName)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{notificat.senderName}</p>
                        {notificat.email && <p className="text-xs text-gray-400">{notificat.email}</p>}
                      </div>
                    </div>
                  </td>

                  {/* Message */}
                  <td className="px-5 py-4 max-w-xs">
                    <p className="text-gray-700 dark:text-gray-300 font-medium truncate">{notificat.subject}</p>
                    <p className="text-xs text-gray-400 truncate">{notificat.body}</p>
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {formatRelativeTime(notificat.createdAt)}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        notificat.isRead
                          ? "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                          : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                      }`}
                    >
                      {notificat.isRead ? "Read" : "Unread"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {!notificat.isRead && (
                        <button
                          onClick={() => markAsRead(notificat.id)}
                          className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notificat.id)}
                        className="text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0d1117] rounded-xl shadow-xl w-full max-w-lg border-2 border-green-500 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                NOTIFICATIONS
              </h2>
              <button onClick={() => setSelectedNotification(null)} className="cursor-pointer">
                <X size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
              </button>
            </div>

            {/* Sender details */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {initialsFor(selectedNotification.senderName)}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedNotification.senderName}</p>
                <p className="text-xs text-gray-400">{formatRelativeTime(selectedNotification.createdAt)}</p>
                {selectedNotification.email && (
                  <p className="text-xs text-gray-400">{selectedNotification.email}</p>
                )}
              </div>
            </div>

            {/* body and subject */}
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">{selectedNotification.subject}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-12 whitespace-pre-wrap">{selectedNotification.body}</p>

            {/* buttons */}
            <div className="flex items-center gap-3">
              {selectedNotification.email && (
                <a
                  href={`mailto:${selectedNotification.email}?subject=${encodeURIComponent(`Re: ${selectedNotification.subject}`)}`}
                  className="bg-gray-100 dark:bg-white/5 hover:bg-green-600 text-gray-900 dark:text-white border border-gray-200 dark:border-white/15 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  + Reply via Email
                </a>
              )}
              {!selectedNotification.isRead && (
                <button onClick={() => markAsRead(selectedNotification.id)} className="bg-gray-100 dark:bg-white/5 hover:bg-green-600 text-gray-900 dark:text-white border border-gray-200 dark:border-white/15 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors cursor-pointer">
                  Mark as read
                </button>
              )}
              <button onClick={() => setSelectedNotification(null)} className="bg-gray-100 dark:bg-white/5 hover:bg-green-600 text-gray-900 dark:text-white hover:text-white border border-gray-200 dark:border-white/15 text-sm font-medium px-6 py-2 rounded-lg transition-colors cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
