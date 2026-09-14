import { useParams, useNavigate } from "react-router"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "react-toastify"
import { useGetSinglePlayer, useDeletePlayer } from "@/hooks/useApi"
import { STATUS_LABEL, STATUS_STYLE } from "@/lib/playerStatus"
import PlayerImage from "@/components/player-information/PlayerImage"
import silhouette from "@/assets/silhouette.png"
import noClubLogo from "@/assets/currentClubLogo.png"

function formatDOB(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "Unknown"
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d)
}

function DetailSkeleton() {
  return (
    <div className="p-6">
      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-white/10 animate-pulse mb-6" />
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-[180px] h-[190px] rounded-xl bg-gray-100 dark:bg-white/10 animate-pulse shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-7 w-48 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
            <div className="h-5 w-32 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
            <div className="h-4 w-64 rounded bg-gray-100 dark:bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PlayerView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: player, isLoading, isError } = useGetSinglePlayer(id ?? "")
  const deletePlayerMutation = useDeletePlayer()
  const [deleting, setDeleting] = useState(false)

  function handleDelete() {
    if (!player) return
    const displayName = player.playerFullName || player.playerName
    if (!window.confirm(`Delete ${displayName}? This can't be undone.`)) return
    setDeleting(true)
    deletePlayerMutation.mutate(player.id, {
      onSuccess: () => {
        toast.success(`${displayName} deleted`)
        navigate("/admin/player-overview")
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Couldn't delete this player")
      },
      onSettled: () => setDeleting(false),
    })
  }

  if (isLoading) return <DetailSkeleton />

  if (isError || !player) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate("/admin/player-overview")}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Players
        </button>
        <p className="text-sm text-red-500">Couldn't load this player. It may have been deleted.</p>
      </div>
    )
  }

  const displayName = player.playerFullName || player.playerName

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/admin/player-overview")}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back to Players
      </button>

      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-gray-100 dark:border-white/10">
          <div className="w-[150px] h-[160px] rounded-xl overflow-hidden bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/15 shrink-0 self-center md:self-start">
            <PlayerImage
              src={player.playerPhoto ? player.playerPhoto : silhouette}
              alt=""
              className="w-full h-full object-cover object-top"
              skeletonClassName="w-full h-full"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{displayName}</h1>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[player.status]}`}>
                {STATUS_LABEL[player.status]}
              </span>
              {!player.published && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                  Draft — not visible on the public site
                </span>
              )}
              {player.isFeatured && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400">
                  Featured
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {player.position} · {player.ageGroup}
            </p>

            <div className="flex flex-wrap gap-6">
              {player.position === "GK" ? (
                <>
                  <Stat label="Saves" value={player.saves} />
                  <Stat label="Clean Sheets" value={player.cleanSheets} />
                </>
              ) : (
                <>
                  <Stat label="Goals" value={player.goals} />
                  <Stat label="Assists" value={player.assists} />
                </>
              )}
              <Stat label="Appearances" value={player.playerAppearance} />
              {player.rating !== null && <Stat label="Rating" value={player.rating} />}
            </div>
          </div>

          <div className="flex md:flex-col gap-2 shrink-0">
            <button
              onClick={() => navigate(`/admin/player-overview/edit/${player.id}`)}
              className="flex items-center justify-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center justify-center gap-1.5 text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Trash2 size={14} /> {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>

        {/* Bio + club */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-b border-gray-100 dark:border-white/10">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Bio Data</p>
            <dl className="space-y-2 text-sm">
              <Row label="Date of Birth" value={formatDOB(player.DOB)} />
              <Row label="Nationality" value={player.nationality || "Unknown"} />
              <Row label="Height" value={player.height ? `${player.height}cm` : "Unknown"} />
              <Row label="Preferred Foot" value={player.preferredFoot || "Unknown"} />
            </dl>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Club</p>
            {player.currentClubName ? (
              <div className="flex items-center gap-3 mb-3">
                <img src={player.currentClubLogo || noClubLogo} alt="" className="w-10 h-10 object-contain" />
                <div>
                  <p className="text-xs text-gray-400">Current Club</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{player.currentClubName}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No current club set</p>
            )}
            {player.newClubName && (
              <div className="flex items-center gap-3">
                <img src={player.newClubLogo || noClubLogo} alt="" className="w-10 h-10 object-contain" />
                <div>
                  <p className="text-xs text-gray-400">New Club</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{player.newClubName}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History */}
        <div className="pt-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Player History</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {player.playerHistory || "No player history recorded."}
          </p>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-50 dark:border-white/5 pb-2">
      <dt className="text-gray-400">{label}</dt>
      <dd className="text-gray-900 dark:text-white font-medium">{value}</dd>
    </div>
  )
}
