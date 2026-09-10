// import React from 'react'
import { Users, ArrowLeftRight, Handshake, FileText, Newspaper, RefreshCw, Mail, Trophy, Loader2 } from "lucide-react"
import { adminUser } from "@/lib/adminUser"
import { useGetNewsArticles, useGetPlayers } from "@/hooks/useApi";


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


export default function Dashboard() {

    const { data: players, isLoading: loadingPlayers } = useGetPlayers();
    const { data: articles, isLoading: loadingArticles } = useGetNewsArticles();

    const freePlayers = players?.filter(
        (player) => player.status === "Free"
    ).length ?? 0;

    const transferredPlayers = players?.filter(
        (player) => player.status === "Transferred"
    ).length ?? 0;

    const negotiationPlayers = players?.filter(
        (player) => player.status === "Negotiation"
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

    const publishedArticles = articles?.filter(
        (article) => article.published === true
    ).length ?? 0;

    const statCards = [
        {
            label: "Players this Season",
            value: loadingPlayers ? <Loader2 className="animate-spin" /> : players?.length,
            sub: 'From Last Season +13% ',
            icon: Users,
            bg: "bg-green-300"
        },
        {
            label: 'Completed Transfers',
            value: loadingPlayers ? <Loader2 className="animate-spin" /> : transferredPlayers,
            sub: 'All time Record',
            icon: ArrowLeftRight,
            bg: 'bg-green-500',
        },
        {
            label: 'Live Negotiations',
            value: loadingPlayers ? <Loader2 className="animate-spin" /> : negotiationPlayers,
            sub: 'Active Now',
            icon: Handshake,
            bg: 'bg-orange-400',
        },
        {
            label: 'Published Article',
            value: loadingArticles ? <Loader2 className="animate-spin" /> : publishedArticles,
            sub: 'New Today',
            icon: FileText,
            bg: 'bg-blue-300',
        }
    ]

    const transferStats = [
        {
            label: 'Total Transfers',
            value: loadingPlayers ? <Loader2 className="animate-spin" /> : transferredPlayers,
            color: 'text-green-500'
        },
        {
            label: 'This Season',
            value: loadingPlayers ? <Loader2 className="animate-spin" /> : transferredPlayers,
            color: 'text-blue-700'
        },
        {
            label: 'Combined Value',
            value: '$340M',
            color: 'text-orange-400'
        },
        {
            label: 'In Negotiation',
            value: loadingPlayers ? <Loader2 className="animate-spin" /> : negotiationPlayers,
            color: 'text-red-500'
        },
    ]

    const ageGroupStats = [
        {
            label: 'U - 17',
            value: loadingPlayers ? <Loader2 className="animate-spin" /> : under17,
            color: 'text-gray-900'
        },
        {
            label: 'U - 21',
            value: loadingPlayers ? <Loader2 className="animate-spin" /> : under21,
            color: 'text-gray-900'
        },
        {
            label: 'U - 23',
            value: loadingPlayers ? <Loader2 className="animate-spin" /> : under23,
            color: 'text-orange-400'
        },
        {

            label: 'Free Agents',
            value: loadingPlayers ? <Loader2 className="animate-spin" /> : freePlayers,
            color: 'text-green-500'
        },
        {
            label: 'Transferred',
            value: loadingPlayers ? <Loader2 className="animate-spin" /> : transferredPlayers,
            color: 'text-blue-700'
        }
    ]

    return (
        <div className="p-6">
            {/* Heading */}
            <div className="mb-6">
                <p className="text-sm font-medium text-[#00D46A] mb-1">Overview</p>
                <h1 className="text-2xl font-bold text-gray-900">DASHBOARD</h1>
                <p className="text-sm text-gray-400 mt-0.5">Welcome back, {adminUser.name.split(" ")[0]}</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ">
                {
                    statCards.map((card) => (
                        <div key={card.label} className={`${card.bg} rounded-xl shadow-sm p-4`}>
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
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5 lg:mb-30">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h2>
                    <div className="divide-y divide-gray-200 space-y-3">
                        {recentActivity.map((item, i) => (
                            <div key={i} className="
            flex items-start justify-between pb-2
            ">
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center mt-0.5 shrink-0">
                                        <item.icon size={12} className="text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
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

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-900 mb-4">
                            Transfer stats
                        </h2>
                        <div className="divide-y divide-gray-200 space-y-3">
                            {transferStats.map((stat) => (
                                <div key={stat.label} className="flex items-center justify-between pb-2">
                                    <p className="text-xs text-gray-500">{stat.label}</p>
                                    <p className={`text-xs font-semibold ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Age group stats */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-900 mb-4">Age Group stats</h2>
                        <div className="divide-y divide-gray-200 space-y-3">
                            {ageGroupStats.map((stats) => (
                                <div key={stats.label} className="flex items-center justify-between pb-2">
                                    <p className="text-xs text-gray-500">{stats.label}</p>
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

