import { useState } from "react"
import { X, Trash2 } from "lucide-react"
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

export default function Notifications() {
  const { data, isLoading, isError } = useGetNotifications()
  const markReadMutation = useMarkNotificationRead()
  const markAllReadMutation = useMarkAllNotificationsRead()
  const deleteMutation = useDeleteNotification()

  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const notificationList = data?.notifications ?? []

  function showToast(message: string) {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  function markAsRead(id: string) {
    markReadMutation.mutate(id, {
      onSuccess: () => showToast("Notification read — Message marked as read"),
    })
    setSelectedNotification(null)
  }

  function markAllAsRead() {
    markAllReadMutation.mutate(undefined, {
      onSuccess: () => showToast("All notifications marked as read"),
    })
  }

  function handleDelete(id: string) {
    deleteMutation.mutate(id, {
      onSuccess: () => showToast("Notification deleted"),
    })
    setSelectedNotification(null)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-green-500 mb-1">Communication</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NOTIFICATIONS</h1>
          <p className="text-sm text-gray-400 mt-0.5">Contact form submissions from scouts, families, and media</p>
        </div>
        <button
          onClick={markAllAsRead}
          disabled={notificationList.length === 0 || markAllReadMutation.isPending}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Mark all as read
        </button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm p-5 animate-pulse h-24" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-red-500">Couldn't load notifications. Please refresh the page.</p>
      )}

      {!isLoading && !isError && notificationList.length === 0 && (
        <p className="text-sm text-gray-400">No messages yet — submissions from the Contact page will show up here.</p>
      )}

      {/* Notification list */}
      <div className="flex flex-col gap-3">
        {notificationList.map((notificat) => (
          <div key={notificat.id} className={`rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-green-400 focus:outline-none shadow-sm p-5 ${notificat.isRead ? 'opacity-40' : ''}`}>
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-gray-900 text-xs font-semibold shrink-0">
                {initialsFor(notificat.senderName)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-0.5">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{notificat.senderName}</p>
                  <p className="text-xs text-gray-400">{formatRelativeTime(notificat.createdAt)}</p>
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{notificat.subject}</p>
                <p className="text-xs text-gray-400 mb-3 line-clamp-1">{notificat.body}</p>

                <div className="flex items-center gap-4">
                  {notificat.email && (
                    <a
                      href={`mailto:${notificat.email}?subject=${encodeURIComponent(`Re: ${notificat.subject}`)}`}
                      className="text-xs text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors"
                    >
                      Reply Via Mail
                    </a>
                  )}

                  {!notificat.isRead && (
                    <button onClick={() => markAsRead(notificat.id)} className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors cursor-pointer">
                      Mark as read
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedNotification(notificat)}
                    className="text-xs text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors cursor-pointer"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(notificat.id)}
                    className="text-xs text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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

      {/* toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white text-xs font-medium px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center">
            ✓
          </div>
          {toast}
        </div>
      )}
    </div>
  )
}
