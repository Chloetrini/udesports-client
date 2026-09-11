// import React from 'react'
import { Search, Plus } from "lucide-react"
import { useNavigate } from "react-router"
import { useState } from "react"
import { useGetPlayers } from "@/hooks/useApi";

const statusStyle : Record<string, string> = {
    Transferred: "bg-green-200 dark:bg-green-900/40 text-green-600 dark:text-green-400",
    Negotiation: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
    Free: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
}

function PlayerRowSkeleton() {
    return (
        <tr className="animate-pulse">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 shrink-0" />
                    <div className="space-y-1.5">
                        <div className="h-3 w-28 rounded bg-gray-200 dark:bg-white/10" />
                        <div className="h-2.5 w-16 rounded bg-gray-200 dark:bg-white/10" />
                    </div>
                </div>
            </td>
            <td className="px-5 py-4"><div className="h-3 w-10 rounded bg-gray-200 dark:bg-white/10" /></td>
            <td className="px-5 py-4"><div className="h-3 w-8 rounded bg-gray-200 dark:bg-white/10" /></td>
            <td className="px-5 py-4"><div className="h-3 w-6 rounded bg-gray-200 dark:bg-white/10" /></td>
            <td className="px-5 py-4"><div className="h-3 w-20 rounded bg-gray-200 dark:bg-white/10" /></td>
            <td className="px-5 py-4"><div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-white/10" /></td>
            <td className="px-5 py-4"><div className="h-6 w-20 rounded bg-gray-200 dark:bg-white/10" /></td>
        </tr>
    );
}

export default function PlayerOverview() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [groupFilter, setGroupFilter] = useState('All Groups')
    const [statusFilter, setStatusFilter] = useState('All Statuses')

      const { data: players, isLoading } = useGetPlayers();


const filteredPlayers = players?.filter((player) => {
    const matchSearch =
    player.playerFullName.toLowerCase().includes(search.toLowerCase()) ||
    player.status.toLowerCase().includes(search.toLowerCase()) ||
    player.currentClubName.toLowerCase().includes(search.toLowerCase())

    const matchGroup = groupFilter === "All Groups" || player.ageGroup === groupFilter
    const matchStatus = statusFilter === 'All Statuses' || player.status === statusFilter

    return matchSearch && matchGroup && matchStatus
})

return(
    <div className="p-6">
{/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
            <div>
                <p className="text-sm font-medium text-green-500 mb-1">Overview</p>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PLAYER</h1>
                <p className="text-xs text-gray-400 mt-0.5">Add, edit, and manage player profiles and status</p>
            </div>
            <button onClick={() => navigate("/admin/player-overview/add")} className="flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-black text-xs font-medium px-4 py-2 rounded-lg transition-colors shrink-0">
                 <Plus size={10}/>
                 Add Player
            </button>
          </div>

{/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative w-full sm:w-64">
                  <Search size={15} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input type="text"
                  placeholder="Search Players"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-2 py-2 text-xs border border-gray-200 dark:border-white/15 rounded-lg focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
              </div>

              <div className="flex gap-3 flex-wrap">
              <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} className="text-xs border border-gray-200 dark:border-white/15 rounded-lg px-3 py-2 focus:border-green-400 focus:bg-green-100 dark:focus:bg-green-900/30 text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5">
                <option>All Groups</option>
                <option>U - 17</option>
                <option>U - 21</option>
                <option>U - 23</option>
              </select>

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-xs border border-gray-200 dark:border-white/15 focus:bg-green-100 dark:focus:bg-green-900/30 rounded-lg px-3 py-2 focus:outline-none focus:border-green-400 text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5">
                <option>All Statuses</option>
                <option>Transferred</option>
                <option>Negotiation</option>
                <option>Free</option>
              </select>
              </div>
          </div>

{/* Table Section */}
       <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm overflow-x-auto">
         <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/10 text-gray-400 text-xs">
              <th className="text-left px-5 py-3 font-medium">Player</th>
              <th className="text-left px-5 py-3 font-medium">Group</th>
              <th className="text-left px-5 py-3 font-medium">Position</th>
              <th className="text-left px-5 py-3 font-medium">Ratings</th>
              <th className="text-left px-5 py-3 font-medium">Club</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/10">
            {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <PlayerRowSkeleton key={i} />)
            ) : (
            filteredPlayers?.map((player, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                   {/* Player */}
                   <td className="px-5 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {player.playerFullName.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{player.playerFullName}</p>
                            <p className="text-xs text-gray-400">Pos. {player.position}</p>
                        </div>
                     </div>
                   </td>
                     <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{player.ageGroup}</td>
                     <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{player.position}</td>
                     <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{player.rating}</td>
                     <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{player.currentClubName}</td>

 {/* Status */}
             <td className="px-5 py-4">
               <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[player.status]}`}>
                 {player.status}
               </span>
             </td>

             {/* Actions */}
             <td className="px-5 py-4">
               <div className="flex items-center gap-2">
                 <button onClick={() => navigate(`/admin/player-overview/edit/${i}`)} className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                    Edit
                 </button>
                 <button className="text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition-colors">
                    Delete
                 </button>
               </div>
             </td>
                </tr>
            )))}
          </tbody>
         </table>
       </div>

    </div>
)
}



