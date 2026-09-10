// import React from 'react'
import { useState } from "react"
import { X } from "lucide-react"

const notifications = [
  {
    id: 1,
    sender: 'Name of Sender',
    initials: 'DI',
    time: '10 mins ago',
    subject: 'Subject',
    body: 'Good day, I am writing on behalf of my 19-year-old son who plays central midfield for Sunshine Stars FC. He has been our best player for two consecutive seasons, averaging 8 goals and 11 assists from midfield. We are looking for professional representation and a pathway to a European trial. Please advise on your intake process for the U-20 programme.',
    read: false,
  },
  {
    id: 2,
    sender: 'Name of Sender',
    initials: 'DI',
    time: '10 mins ago',
    subject: 'Subject',
    body: 'Body of the letter.',
    read: false,
  },
  {
    id: 3,
    sender: 'Name of Sender',
    initials: 'DI',
    time: '10 mins ago',
    subject: 'Subject',
    body: 'Body of the letter.',
    read: false,
  },
  {
    id: 4,
    sender: 'Name of Sender',
    initials: 'DI',
    time: '10 mins ago',
    subject: 'Subject',
    body: 'Body of the letter.',
    read: false,
  },
  {
    id: 5,
    sender: 'Name of Sender',
    initials: 'DI',
    time: '10 mins ago',
    subject: 'Subject',
    body: 'Body of the letter.',
    read: false,
  },
]

export default function Notifications() {
  const [notificationList, setNotificationList] = useState(notifications)
  const [selectedNotification, setSelectedNotification] = useState<typeof notifications[0] | null>(null)
  const [toast, setToast] = useState(false)

  function showToast() {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  function markAsRead(id: number) {
    setNotificationList(prev => prev.map(n => n.id === id ? {...n, read: true} : n))
    setSelectedNotification(null)
    showToast()
  }

  function markAllAsRead() {
    setNotificationList(prev => prev.map(n => ({...n, read: true})))
    showToast()
  }

  return (
    <div className="p-6">
{/* Header */}
    <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-green-500 mb-1">Communication</p>
          <h1 className="text-2xl font-bold text-gray-900">NOTIFICATIONS</h1>
          <p className="text-sm text-gray-400 mt-0.5">Contact form submissions from scouts, families, and media</p>
        </div>
      <button onClick={markAllAsRead} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
         + Mark all as read
      </button>
    </div>

    {/* Notification list */}
    <div className="flex flex-col gap-3">
       {notificationList.map((notificat) =>(
      <div key={notificat.id} className={`rounded-xl border border-gray-50 hover:border-green-400 focus:outline-none shadow-sm p-5 ${notificat.read ? 'opacity-40' : ''}`}>
       <div className="flex items-start gap-3">
{/* Avatar */}
    <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-gray-900 text-xs font-semibold shrink-0">
        {notificat.initials}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-0.5">
        <p className="text-sm font-semibold text-gray-900">{notificat.sender}</p>
        <p className="text-xs text-gray-400">{notificat.time}</p>
      </div>
      <p className="text-xs font-medium text-gray-700 mb-1">{notificat.subject}</p>
      <p className="text-xs text-gray-400 mb-3 line-clamp-1">{notificat.body}</p>

      <div className="flex items-center gap-4">
        <button onClick={() => setSelectedNotification(notificat)} className="text-xs text-gray-600 hover:text-green-500 transition-colors">
         Reply Via Mail
        </button>

        <button onClick={() => markAsRead(notificat.id)} className="text-xs font-bold text-gray-600 hover:text-green-500 transition-colors">
          Mark as read
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border-2 border-green-500 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                 NOTIFICATIONS
              </h2>
              <button onClick={() => setSelectedNotification(null)}>
                <X size={18} className="text-gray-400 hover:text-gray-600"/>
              </button>
            </div>

            {/* Sender details */}
            <div className="flex items-center gap-3 mb-4">
             <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {selectedNotification.initials}
             </div>

             <div>
              <p className="text-sm font-semibold text-gray-900">{selectedNotification.sender}</p>
              <p className="text-xs text-gray-400">{selectedNotification.time}</p>
             </div>
            </div>

            {/* body and subject */}
            <p className="text-sm font-medium text-gray-800 mb-2">{selectedNotification.subject}</p>
            <p className="text-xs text-gray-500 leading-relaxed mb-12">{selectedNotification.body}</p>

            {/* buttons */}
            <div className="flex items-center gap-3">
               <button onClick={() => markAsRead(selectedNotification.id)} className="bg-gray-100 hover:bg-green-600 text-gray-900 border border-gray-200 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors">
               + Reply via Email
            </button>
            <button onClick={() => setSelectedNotification(null)} className="bg-gray-100 hover:bg-green-600 text-gray-900 hover:text-white border border-gray-200 text-sm font-medium px-6 py-2 rounded-lg transition-colors">
              Cancel
            </button>
            </div>
          </div>
        </div>
       )}

       {/* toast */}
       {
        toast && (
          <div className="fixed bottom-6 right-6 bg-green-500 text-white text-xs font-medium px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
            <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center">
              ✓
            </div>
            Notification read — Message marked as read
          </div>
        )
       }
    </div>

  )
}

