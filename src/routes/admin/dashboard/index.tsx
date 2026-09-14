// import React from 'react'
import { Users, ArrowLeftRight, Handshake, FileText, Newspaper, RefreshCw, Mail, Trophy } from "lucide-react"
import { useNavigate } from "react-router"
import { adminUser } from "@/lib/adminUser"
import { useGetNewsArticles, useGetPlayersAdmin } from "@/hooks/useApi";


const recentActivity = [
    {
        title: 'K. Omeruo transfer confirmed Leganés',
        meta: "Transfer · Serie A · La Liga",
        time: "2h ago",
        icon: ArrowLeftRight
    },
    {
        title: 'News article published - U-17 Trials Open',
        meta: 'Academy · Admin',
        time: "2h ago",
        icon: Newspaper
    },
    {
        title: 'C. Eze status changed → Negotiation',
        meta: "Transfer · Serie A · Premiere league",
        time: "2h ago",
        icon: RefreshCw
    },
    {
        title: 'New message  Marco Bianchi, Juventus FC',
        meta: 'Scout Enquiry · Unread',
        time: "2h ago",
        icon: Mail
    },
    {
        title: 'V. Osimhen wins Serie A Player of Month',
        meta: 'Transfer · Serie A · La Liga',
        time: "2h ago",
        icon: Trophy
    }
]

function StatCardSkeleton() {
    return (
        <div className="bg-gray-100 dark:bg-white/5 rounded-xl shadow-sm p-4 animate-pulse">
            <div className="w-5 h-5 rounded bg-gray-300 dark:bg-white/10 mb-2" />
            <div className="h-3 w-20 rounded bg-gray-300 dark:bg-white/10 mb-3" />
            <div className="h-7 w-10 rounded bg-gray-300 dark:bg-white/10 mb-1" />
            <div className="h-2.5 w-24 rounded bg-gray-300 dark:bg-white/10" />
        </div>
    );
}

function ListRowSkeleton() {
    return (
        <div className="flex items-start justify-between pb-2 animate-pulse">
            <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-white/10 shrink-0" />
                <div className="space-y-1.5">
                    <div className="h-3 w-40 rounded bg-gray-200 dark:bg-white/10" />
                    <div className="h-2.5 w-28 rounded bg-gray-200 dark:bg-white/10" />
                </div>
            </div>
            <div className="h-2.5 w-10 rounded bg-gray-200 dark:bg-white/10 shrink-0 ml-4" />
        </div>
    );
}

function StatRowSkeleton() {
    return (
        <div className="flex items-center justify-between pb-2 animate-pulse">
            <div className="h-2.5 w-20 rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-2.5 w-8 rounded bg-gray-200 dark:bg-white/10" />
        </div>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();

    const { data: players, isLoading: loadingPlayers } = useGetPlayersAdmin();
    const { data: articles, isLoading: loadingArticles } = useGetNewsArticles();

    const freePlayers = players?.filter(
        (player) => player.status === "FREE"
    ).length ?? 0;

    const transferredPlayers = players?.filter(
        (player) => player.status === "TRANSFERRED"
    ).length ?? 0;

    const negotiationPlayers = players?.filter(
        (player) => player.status === "NEGOTIATION"
    ).length ?? 0;

    const under17 = players?.filter(
        (player) => player.ageGroup === "U-17"
    ).length ?? 0;

    const under21 = players?.filter(
        (player) => player.ageGroup === "U-21"
    ).length ?? 0;

    const under23 = players?.filter(
        (player) => player.ageGroup === "U-23"
    ).length ?? 0;

    const professionalPlayers = players?.filter(
        (player) => player.ageGroup === "Professional"
    ).length ?? 0;

    const publishedArticles = articles?.filter(
        (article) => article.published === true
    ).length ?? 0;

    // Each card navigates somewhere useful instead of sitting static — the
    // player-status cards jump straight to the (already-filterable) Player
    // Overview page with that status pre-selected via router state, so
    // "Completed Transfers" lands on an already-filtered list rather than
    // needing a brand new page.
    const statCards = [
        {
            label: "Players this Season",
            value: players?.length,
            sub: 'From Last Season +13% ',
            icon: Users,
            bg: "bg-green-300",
            onClick: () => navigate("/admin/player-overview"),
        },
        {
            label: 'Completed Transfers',
            value: transferredPlayers,
            sub: 'All time Record',
            icon: ArrowLeftRight,
            bg: 'bg-green-500',
            onClick: () => navigate("/admin/player-overview", { state: { statusFilter: "TRANSFERRED" } }),
        },
        {
            label: 'Live Negotiations',
            value: negotiationPlayers,
            sub: 'Active Now',
            icon: Handshake,
            bg: 'bg-orange-400',
            onClick: () => navigate("/admin/player-overview", { state: { statusFilter: "NEGOTIATION" } }),
        },
        {
            label: 'Published Article',
            value: publishedArticles,
            sub: 'New Today',
            icon: FileText,
            bg: 'bg-blue-300',
            onClick: () => navigate("/admin/news"),
        }
    ]

    const transferStats = [
        {
            label: 'Total Transfers',
            value: transferredPlayers,
            color: 'text-green-500'
        },
        {
            label: 'This Season',
            value: transferredPlayers,
            color: 'text-blue-700 dark:text-blue-400'
        },
        {
            label: 'Combined Value',
            value: '$340M',
            color: 'text-orange-400'
        },
        {
            label: 'In Negotiation',
            value: negotiationPlayers,
            color: 'text-red-500'
        },
    ]

    const ageGroupStats = [
        {
            label: 'U - 17',
            value: under17,
            color: 'text-gray-900 dark:text-white'
        },
        {
            label: 'U - 21',
            value: under21,
            color: 'text-gray-900 dark:text-white'
        },
        {
            label: 'U - 23',
            value: under23,
            color: 'text-orange-400'
        },
        {
            label: 'Professional',
            value: professionalPlayers,
            color: 'text-gray-900 dark:text-white'
        },
        {

            label: 'Free Agents',
            value: freePlayers,
            color: 'text-green-500'
        },
        {
            label: 'Transferred',
            value: transferredPlayers,
            color: 'text-blue-700 dark:text-blue-400'
        }
    ]

    return (
        <div className="p-6">
            {/* Heading */}
            <div className="mb-6">
                <p className="text-sm font-medium text-[#00D46A] mb-1">Overview</p>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">DASHBOARD</h1>
                <p className="text-sm text-gray-400 mt-0.5">Welcome back, {adminUser.name.split(" ")[0]}</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ">
                {loadingPlayers || loadingArticles
                    ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                    : statCards.map((card) => (
                        <div
                            key={card.label}
                            onClick={card.onClick}
                            className={`${card.bg} rounded-xl shadow-sm p-4 cursor-pointer transition-transform hover:scale-[1.03]`}
                        >
                            <card.icon size={20} className="text-black opacity-80 mb-2" />
                            <p className="text-black text-xs font-medium mb-3">{card.label}</p>
                            <p className="text-3xl font-medium text-black">{card.value}</p>
                            <p className="text-[10px] text-gray-600 mt-1 opacity-70">{card.sub}</p>
                        </div>
                    ))}

            </div>

            {/* Bottom section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent activity */}
                <div className="lg:col-span-2 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-5 lg:mb-30">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                    <div className="divide-y divide-gray-200 dark:divide-white/10 space-y-3">
                        {loadingPlayers || loadingArticles
                            ? Array.from({ length: 5 }).map((_, i) => <ListRowSkeleton key={i} />)
                            : recentActivity.map((item, i) => (
                            <div key={i} className="
            flex items-start justify-between pb-2
            ">
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mt-0.5 shrink-0">
                                        <item.icon size={12} className="text-gray-500 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                                        <p className="text-xs text-gray-400">{item.meta}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 shrink-0 ml-4">
                                    {item.time}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Stats section */}
                <div className="space-y-4">
                    {/* Transfer stats */}

                    <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Transfer stats
                        </h2>
                        <div className="divide-y divide-gray-200 dark:divide-white/10 space-y-3">
                            {loadingPlayers
                                ? Array.from({ length: 4 }).map((_, i) => <StatRowSkeleton key={i} />)
                                : transferStats.map((stat) => (
                                <div key={stat.label} className="flex items-center justify-between pb-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    <p className={`text-xs font-semibold ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Age group stats */}
                    <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Age Group stats</h2>
                        <div className="divide-y divide-gray-200 dark:divide-white/10 space-y-3">
                            {loadingPlayers
                                ? Array.from({ length: 5 }).map((_, i) => <StatRowSkeleton key={i} />)
                                : ageGroupStats.map((stats) => (
                                <div key={stats.label} className="flex items-center justify-between pb-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{stats.label}</p>
                                    <p className={`text-xs font-semibold ${stats.color}`}>{stats.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
