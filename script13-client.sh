#!/usr/bin/env bash
set -euo pipefail

echo "Applying script13: photo upload + club fields on admin add-player form, rounded corners on admin inputs, and hiding the current-club UI block on the public site when no club is set..."

mkdir -p "$(dirname "src/types/dataTypes.ts")"
cat > "src/types/dataTypes.ts" << 'UDES_EOF_5554316921856685972'


// Wire-format status, matching the backend's PlayerStatus enum exactly.
// Display labels ("Free" / "Transferred" / "Negotiation") live in
// STATUS_LABEL / STATUS_STYLE (src/lib/playerStatus.ts) — same pattern
// already used for NewsCategory below.
export type PlayerStatus = "FREE" | "TRANSFERRED" | "NEGOTIATION";

export type Player = {
  id: string;
  playerPhoto: string | null,
  playerName: string,
  playerFullName: string | null,
  DOB: string,
  nationality: string,
  height: number | null,
  preferredFoot: string,
  ageGroup: "U-17" | "U-21" | "U-23",
  status: PlayerStatus,
  position: string,
  goals: number,
  assists: number,
  rating: number | null,
  currentClubName: string | null,
  currentClubLogo: string | null,
  newClubName: string | null,
  newClubLogo: string | null,
  playerHistory: string | null,
  playerAppearance: number
  isFeatured:boolean
}

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "SUB_ADMIN";

export type NewsCategory = 'TRANSFER' | 'ACADEMY' | 'ANNOUNCEMENT';

// export interface Admin {
//   id: string;
//   name: string;
//   avatarUrl?: string;
// }

export interface NewsArticle {
  id: string;
  category: NewsCategory;
  headline: string;
  excerpt:string;
  subtitle: string | null;
  body: string;
  coverImage: string;
  author: string;
  date: string;
  published:boolean
  authorPhoto: string
  createdAt: string
}

// export interface Article {
//   id: number;
//   title: string;
//   subtitle: string;
//   excerpt: string;
//   author: string;
//   date: string;
//   readTime: string;
//   link: string;
//   authorPhoto: string;
//   articlePhoto: string;
// }

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  club: string;
  country: string;
}

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  verified: boolean;
}

export interface Award {
  id: number;
  name: string;
  subtitle: string;
}

export interface Headlines {
  id: string;
  category: string;
  headline: string;
}

export interface GalleryImages {
 id: string;
 type: "image" | "video";
 link: string;
 title: string;
 description: string;
}
export type QuickUpdateCategory = 'TRANSFER' | 'ACADEMY' | 'ANNOUNCEMENT' | 'MILESTONE' | 'INTERNATIONAL';

export interface QuickUpdate {
  id: string;
  headline: string;
  category: QuickUpdateCategory;
  createdAt: string;
  author: {
    name: string;
    avatarUrl: string;
  };
}

UDES_EOF_5554316921856685972

mkdir -p "$(dirname "src/routes/admin/add-player/index.tsx")"
cat > "src/routes/admin/add-player/index.tsx" << 'UDES_EOF_3307654453226028186'
// import React from 'react'
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useGetSinglePlayer, useCreatePlayer, useUpdatePlayer } from "@/hooks/useApi";
import { STATUS_LABEL, STATUS_OPTIONS } from "@/lib/playerStatus";
import type { PlayerStatus } from "@/types/dataTypes";
import countries from "world-countries";

// Backend stores DOB as a DateTime; the form edits it as MM/DD/YYYY text.
function isoToInputDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${mm}/${dd}/${d.getUTCFullYear()}`;
}

function inputDateToIso(input: string): string {
  const [mm, dd, yyyy] = input.split("/");
  return new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd))).toISOString();
}

function FieldSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-3 w-20 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
      <div className="h-9 w-full rounded bg-gray-100 dark:bg-white/5 animate-pulse" />
    </div>
  );
}

function AddPlayerSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-6 space-y-2">
        <div className="h-3 w-16 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
        <div className="h-7 w-40 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
        <div className="h-3 w-64 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
      </div>
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <FieldSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mt-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <FieldSkeleton key={i} />
          ))}
        </div>
        <div className="mt-5">
          <div className="h-3 w-32 rounded bg-gray-200 dark:bg-white/10 animate-pulse mb-1.5" />
          <div className="h-24 w-full rounded-lg bg-gray-100 dark:bg-white/5 animate-pulse" />
        </div>
        <div className="flex items-center gap-3 mt-6">
          <div className="h-9 w-32 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse" />
          <div className="h-9 w-32 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse" />
          <div className="h-9 w-24 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

const AddPlayer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const { data: player, isLoading, isError } = useGetSinglePlayer(id ?? "");
  const createPlayerMutation = useCreatePlayer();
  const updatePlayerMutation = useUpdatePlayer();

  const [name, setName] = useState("");
  const [position, setPosition] = useState("LW");
  const [group, setGroup] = useState<"U-17" | "U-21" | "U-23">("U-17");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [foot, setFoot] = useState("Both");
  const [height, setHeight] = useState<number | "">("");
  const [status, setStatus] = useState<PlayerStatus>("FREE");
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [ratings, setRatings] = useState("");
  const [background, setBackground] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [currentClubName, setCurrentClubName] = useState("");
  const [currentClubLogo, setCurrentClubLogo] = useState("");
  const [newClubName, setNewClubName] = useState("");
  const [newClubLogo, setNewClubLogo] = useState("");

  const [error, setError] = useState<Record<string, string>>({});

  // Player loads asynchronously — sync the form once it arrives (the
  // useState calls above only run once on mount, before the fetch resolves).
  useEffect(() => {
    if (!player) return;
    setName(player.playerFullName || player.playerName);
    setPosition(player.position);
    setGroup(player.ageGroup);
    setDob(isoToInputDate(player.DOB));
    setNationality(player.nationality);
    setFoot(player.preferredFoot);
    setHeight(player.height ?? "");
    setStatus(player.status);
    setGoals(player.goals);
    setAssists(player.assists);
    setRatings(player.rating?.toString() || "");
    setBackground(player.playerHistory || "");
    setPhotoPreview(player.playerPhoto || "");
    setCurrentClubName(player.currentClubName || "");
    setCurrentClubLogo(player.currentClubLogo || "");
    setNewClubName(player.newClubName || "");
    setNewClubLogo(player.newClubLogo || "");
  }, [player]);

  // Local preview for a newly-picked file — revoked on change/unmount so we
  // don't leak object URLs as the admin swaps photos before saving.
  useEffect(() => {
    if (!photo) return;
    const url = URL.createObjectURL(photo);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError((prev) => ({ ...prev, photo: "Please choose an image file" }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError((prev) => ({ ...prev, photo: "Image must be smaller than 10MB" }));
      return;
    }

    setError((prev) => ({ ...prev, photo: "" }));
    setPhoto(file);
  }

  if (isEditMode && isLoading) {
    return <AddPlayerSkeleton />
  }
  if (isEditMode && isError) {
    return <div className="p-6 text-gray-900 dark:text-white">Something went wrong loading this player.</div>
  }

  function validate() {
    const newError: Record<string, string> = {};
    if (!name?.trim()) {
      newError.name = "Player name is required";
    }

    const dobRegex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!dob?.trim()) {
      newError.dob = "Date of birth is required";
    } else if (!dobRegex.test(dob)) {
      newError.dob = "Use MM/DD/YYYY format (e.g. 08/25/2006)";
    }

    // const heightRegex = /^\d{2,3}\s?cm$/i;
    // if (!height?.trim()) {
    //   newError.height = "Height is required";
    // } else if (!heightRegex.test(height.trim())) {
    //   newError.height = "Height must be in cm (e.g. 187 cm)";
    // }

    if (!background?.trim())
      newError.background = "Player Background is required";

    return newError;
  }

  async function handleSubmit() {
    const newError = validate();
    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    const payload: Record<string, unknown> = {
      playerName: name,
      playerFullName: name,
      DOB: inputDateToIso(dob),
      nationality,
      height: height === "" ? undefined : height,
      preferredFoot: foot,
      ageGroup: group,
      status,
      position,
      goals,
      assists,
      rating: ratings ? Number(ratings) : undefined,
      playerHistory: background,
      currentClubName: currentClubName.trim() || undefined,
      currentClubLogo: currentClubLogo.trim() || undefined,
      newClubName: newClubName.trim() || undefined,
      newClubLogo: newClubLogo.trim() || undefined,
    };

    // Only include a photo when a new one was picked — omitting it on edit
    // keeps the existing photo (the backend preserves it unless a file is
    // actually sent), and including it only when present is what tells
    // toRequestBody() in Players.ts to send this as multipart FormData.
    if (photo) {
      payload.playerPhoto = photo;
    }

    try {
      if (isEditMode && id) {
        await updatePlayerMutation.mutateAsync({ id, data: payload });
      } else {
        await createPlayerMutation.mutateAsync(payload);
      }
      navigate("/admin/player-overview");
    } catch (err) {
      setError((prev) => ({
        ...prev,
        form: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      }));
    }
  }

  const isSaving = createPlayerMutation.isPending || updatePlayerMutation.isPending;
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-green-500 mb-1">Overview</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {player ? "EDIT PLAYER" : "ADD PLAYER"}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Add, edit, and manage player profiles and status
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        {/* Player photo */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-white/10">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/15 flex items-center justify-center flex-shrink-0">
            {photoPreview ? (
              <img src={photoPreview} alt="Player" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-gray-400">No photo</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Player Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="text-xs text-gray-600 dark:text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-green-500 file:text-gray-900 hover:file:bg-green-600 cursor-pointer"
            />
            {error.photo && <p className="text-xs text-red-500">{error.photo}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Player's name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Player Name
            </label>
            <input
              type="text"
              placeholder="Input Player Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError({ ...error, name: "" });
              }}
              className={`border px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error.name ? "border-red-400" : "border-gray-200 dark:border-white/15"
                }`}
            />
            {error.name && <p className="text-xs text-red-500">{error.name}</p>}
          </div>

          {/* Position */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Position
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              <option>LW</option>
              <option>RW</option>
              <option>ST</option>
              <option>CM</option>
              <option>RB</option>
              <option>LB</option>
              <option>GK</option>
            </select>
          </div>

          {/* Age Group */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Age Group
            </label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value as "U-17" | "U-21" | "U-23")}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              <option>U-17</option>
              <option>U-21</option>
              <option>U-23</option>
            </select>
          </div>

          {/* Date of birth */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Date of Birth
            </label>
            <input
              type="text"
              placeholder="DD/MM/YY"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                setError({ ...error, dob: "" });
              }}
              className={`border px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error.dob ? "border-red-400" : "border-gray-200 dark:border-white/15"
                }`}
            />
            {error.dob && <p className="text-xs text-red-500">{error.dob}</p>}
          </div>

          {/* Nationality */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Nationality
            </label>

            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              <option value="">Select nationality</option>

              {countries.map((country) => (
                <option key={country.cca3} value={country.demonyms?.eng?.m ?? country.name.common}>
                  {country.demonyms?.eng?.m ?? country.name.common}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred foot */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Preferred Foot
            </label>
            <select
              value={foot}
              onChange={(e) => setFoot(e.target.value)}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              <option>Both</option>
              <option>Left</option>
              <option>Right</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mt-5 ">
          {/* Height */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Height (CM)</label>
            <input
              value={height}
              onChange={(e) => {
                setHeight(Number(e.target.value));
                setError({ ...error, height: "" });
              }}
              type="number"
              placeholder="e.g. 187 cm"
              className={`border px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error.height ? "border-red-400" : "border-gray-200 dark:border-white/15"
                }`}
            />
            {error.height && (
              <p className="text-xs text-red-500">{error.height}</p>
            )}
          </div>

          {/* Current status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Current Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PlayerStatus)}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
              ))}
            </select>
          </div>

          {/* Goals */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Goals</label>
            <input
              value={goals}
              onChange={(e) => setGoals(Number(e.target.value))}
              type="number"
              placeholder="0"
              min={0}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Assists */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Assists</label>
            <input
              value={assists}
              onChange={(e) => setAssists(Number(e.target.value))}
              type="number"
              placeholder="0"
              min={0}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Ratings */}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Ratings</label>
            <input
              value={ratings}
              onChange={(e) => setRatings(e.target.value)}
              type="number"
              placeholder="0"
              min={0}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Club information — shown on the public player cards/detail page */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Current Club Name
            </label>
            <input
              type="text"
              placeholder="e.g. Enyimba FC"
              value={currentClubName}
              onChange={(e) => setCurrentClubName(e.target.value)}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Current Club Logo (Image URL)
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={currentClubLogo}
              onChange={(e) => setCurrentClubLogo(e.target.value)}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              New Club Name
            </label>
            <input
              type="text"
              placeholder="If recently transferred"
              value={newClubName}
              onChange={(e) => setNewClubName(e.target.value)}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              New Club Logo (Image URL)
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={newClubLogo}
              onChange={(e) => setNewClubLogo(e.target.value)}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Player background */}
        <div className="flex flex-col gap-1.5 mt-5">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Player Background
          </label>
          <textarea
            value={background}
            onChange={(e) => {
              setBackground(e.target.value);
              setError({ ...error, background: "" });
            }}
            placeholder="Input Player history"
            rows={10}
            className={`border px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error.background ? "border-red-400" : "border-gray-200 dark:border-white/15"
              }`}
          />
          {error.background && (
            <p className="text-xs text-red-500">{error.background}</p>
          )}
        </div>

        {error.form && (
          <p className="text-xs text-red-500 mt-4">{error.form}</p>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-6 flex-wrap">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-green-500 hover:bg-green-600 text-gray-900 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving…" : isEditMode ? "Save Changes" : "+ Add Player"}
          </button>
          <button
            onClick={() => navigate("/admin/player-overview")}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/15 px-6 py-2 rounded-lg transition-colors"
          >
            Save as Draft
          </button>
          <button
            onClick={() => navigate("/admin/player-overview")}
            className="text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlayer;

UDES_EOF_3307654453226028186

mkdir -p "$(dirname "src/routes/admin/news-article/index.tsx")"
cat > "src/routes/admin/news-article/index.tsx" << 'UDES_EOF_2258830995201588181'
// import React from 'react'
import { useNavigate } from "react-router";
import { ArrowLeft, List, ListOrdered, Quote, Eye, Share2, ImagePlus, CircleUserRound } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { articleHistory } from "@/data/articles";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function NewsArticle() {
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [headline, setHeadline] = useState("");
  const [category, setCategory] = useState("Transfer");
  const [featuredPlayer, setFeaturedPlayer] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<Record<string, string>>({});

  const { index } = useParams();
  const article = index !== undefined ? articleHistory[Number(index)] : null;

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  function validate() {
    const newError: Record<string, string> = {};
    if (!headline.trim()) newError.headline = "Headline is required";
    if (!summary.trim()) newError.summary = "Article summary is required";
    const bodyText = editor?.getText().trim();
    if (!bodyText) newError.body = "Article body is required";

    return newError;
  }

  function handlePublish() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }
    setShowPublishModal(true);
  }

  return (
    <div className="p-6">
      <p className="text-sm font-medium text-green-500 mb-1">
        Content Management
      </p>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl">
            <strong className="text-gray-500">NEWS UPDATE</strong>{" "}
            <span className="text-gray-900 dark:text-white">››</span>{" "}
            <strong className="text-gray-900 dark:text-white">{article ? "EDIT ARTICLE" : "NEWS ARTICLE"}</strong>
          </h1>
          <p className="text-[15px] text-gray-400 mt-0.5">
            Publish and manage transfer updates, academy news, and announcements
          </p>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate("/admin/news")}
        className="flex items-center gap-1.5 text-[18px] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={26} className="text-gray-500 dark:text-gray-300" />
        Back
      </button>

      {/* Form section */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        {/*  Headline, Category, Featured Player */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Headline
            </label>
            <input
              type="text"
              placeholder="Content"
              value={headline}
              onChange={(e) => {
                setHeadline(e.target.value);
                setError({ ...error, headline: "" });
              }}
              className={`border-2 px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 ${
                error.headline
                  ? "border-red-400"
                  : "border-gray-100 dark:border-white/15 hover:border-green-500"
              }`}
            />
            {error.headline && (
              <p className="text-xs text-red-500">{error.headline}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 focus:outline-none focus:border-green-500"
            >
              <option>Transfer</option>
              <option>Academy</option>
              <option>Negotiation</option>
              <option>International</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Featured Player
            </label>
            <input
              type="text"
              placeholder="Player Name"
              value={featuredPlayer}
              onChange={(e) => setFeaturedPlayer(e.target.value)}
              className="border bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/15 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* Article Summary, Cover Image  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Article Summary
            </label>
            <textarea
              placeholder="Input text"
              rows={6}
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                setError({ ...error, summary: "" });
              }}
              className={`border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-400 resize-none ${
                error.summary ? "border-red-400" : "border-gray-200 dark:border-white/15"
              }`}
            />
            {error.summary && (
              <p className="text-xs text-red-500">{error.summary}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Cover Image
            </label>
            <label className="border-2 border-gray-300 dark:border-white/15 h-34 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-colors">
              {coverImage ? (
                <img
                  src={coverImage}
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <ImagePlus className="w-6 h-6 text-gray-400" />
                    <p className="text-xs text-gray-400">Upload Photo</p>
                  </div>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setCoverImage(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
        </div>

        {/* Article section */}
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Article Body
          </label>

          {/* Toolbar */}
          <div className="border border-gray-200 dark:border-white/15 rounded-t-lg px-3 py-2 rounded-lg flex items-center gap-2 flex-wrap bg-gray-50 dark:bg-white/5">
            {/*Heading 1 */}
            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`p-1 px-2 rounded text-xs font-bold transition-colors text-gray-700 dark:text-gray-200 ${
                editor?.isActive("heading", { level: 1 })
                  ? "bg-gray-300 dark:bg-white/20"
                  : "hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              T1
            </button>

            {/*Heading 2 */}
            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-1 px-2 rounded text-xs font-bold transition-colors text-gray-700 dark:text-gray-200 ${
                editor?.isActive("heading", { level: 2 })
                  ? "bg-gray-300 dark:bg-white/20"
                  : "hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              T2
            </button>

            {/*Paragraph */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().setParagraph().run()}
              className={`p-1 px-2 rounded text-xs font-bold transition-colors text-gray-700 dark:text-gray-200 ${
                editor?.isActive("paragraph") && !editor?.isActive("heading")
                  ? "bg-gray-300 dark:bg-white/20"
                  : "hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              P
            </button>

            <div className="w-px h-4 bg-gray-300 dark:bg-white/20 mx-1" />

            {/*Bold */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-1 px-2 rounded text-xs font-bold transition-colors text-gray-700 dark:text-gray-200 ${
                editor?.isActive("bold") ? "bg-gray-300 dark:bg-white/20" : "hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              B
            </button>

            {/* I - Italic */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-1 px-2 rounded text-xs font-bold transition-colors text-gray-700 dark:text-gray-200 ${
                editor?.isActive("italic") ? "bg-gray-300 dark:bg-white/20" : "hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              I
            </button>

            <div className="w-px h-4 bg-gray-300 dark:bg-white/20 mx-1" />

            {/* Bullet List */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-1 rounded transition-colors ${
                editor?.isActive("bulletList")
                  ? "bg-gray-300 dark:bg-white/20"
                  : "hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              <List size={14} className="text-gray-600 dark:text-gray-300" />
            </button>

            {/* Numbered List */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`p-1 rounded transition-colors ${
                editor?.isActive("orderedList")
                  ? "bg-gray-300 dark:bg-white/20"
                  : "hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              <ListOrdered size={14} className="text-gray-600 dark:text-gray-300" />
            </button>
            {/* Blockquote */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={`p-1 rounded transition-colors ${
                editor?.isActive("blockquote")
                  ? "bg-gray-300 dark:bg-white/20"
                  : "hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              <Quote size={14} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Editor Content */}
          <EditorContent
            editor={editor}
            className={`border border-t-0 rounded-b-lg px-3 py-2 rounded-lg text-sm min-h-50 bg-white dark:bg-white/5 text-gray-900 dark:text-white [&_.tiptap]:outline-none ${
              error.body ? "border-red-400" : "border-gray-200 dark:border-white/15"
            }`}
          />
          {error.body && <p className="text-xs text-red-500">{error.body}</p>}
        </div>

        {/* buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handlePublish}
            className="bg-white dark:bg-white/5 hover:bg-green-500 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-black text-sm font-medium px-6 py-2 rounded-lg border border-gray-300 dark:border-white/15 transition-colors"
          >
            {article ? "Save Changes" : "+ Publish"}
          </button>
          <button className="bg-white dark:bg-white/5 hover:bg-green-500 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-black text-sm font-medium px-6 py-2 rounded-lg border border-gray-300 dark:border-white/15 transition-colors">
            Save as Draft
          </button>
          <button
            onClick={() => navigate("/admin/news")}
            className="bg-white dark:bg-white/5 hover:bg-green-500 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-black text-sm font-medium px-6 py-2 rounded-lg border border-gray-300 dark:border-white/15 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Publish modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0d1117] rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border-2 border-green-500">
            <div className="p-8 pb-0 pt-0">
              {coverImage && (
                <img
                  src={coverImage}
                  alt="Cover image"
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="pb-8">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-3 mb-1">
                  {headline}
                </h3>

                {/* Summary */}
                <p className="text-xs text-gray-400 mb-4">{summary}</p>

                {/* Author views and shares */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold">
                      <CircleUserRound className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Anwar pandar
                      </p>
                      <p className="text-xs text-gray-400">
                        March 16, 2022 · 6 min read
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Eye size={11} /> Views
                      </p>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">1.6K</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Share2 size={11} />
                        Shares
                      </p>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">14K</p>
                    </div>
                  </div>
                </div>

                {/* Featured Player */}
                {featuredPlayer && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Featured Player:{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {featuredPlayer}
                    </span>
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                  Are you sure you want to{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {" "}
                    {article ? "save changes to" : "publish"}
                  </span>{" "}
                  this Article?
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowPublishModal(false);
                      navigate("/admin/news");
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-10 py-1.5 rounded-lg transition-colors"
                  >
                    {article ? "Save Changes" : "+ Publish"}
                  </button>
                  <button
                    onClick={() => setShowPublishModal(false)}
                    className="bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 text-sm font-medium px-10 py-1.5 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

UDES_EOF_2258830995201588181

mkdir -p "$(dirname "src/routes/admin/settings/index.tsx")"
cat > "src/routes/admin/settings/index.tsx" << 'UDES_EOF_1347474180791173044'
// import React from 'react'
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function Settings() {
  const [siteTitle, setSiteTitle] = useState('UDE Sports Management')
  const [contactInfo, setContactInfo] = useState('+234')
  const [mail, setMail] = useState('info@udesports.com')
  const [instagram, setInstagram] = useState('')
  const [twitter, setTwitter] = useState('')

  const [adminName, setAdminName] = useState('domegbukwu')
  const [adminEmail, setAdminEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [toast, setToast] = useState(false)
  const [adminErrors, setAdminErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [inviteAdmins, setInviteAdmins] = useState([
  { name: 'admin name 1', email: '', role: 'Sub Admin' },
  { name: 'admin name 2', email: '', role: 'Sub Admin' },
])

   const [editingIndex, setEditingIndex] = useState<number | null>(null)
  function showToast() {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  function validateAdmin() {
    const newErrors: Record<string, string> = {}
    if (!adminName.trim()) newErrors.adminName = 'Admin name is required'
    if (!adminEmail.trim()) newErrors.adminEmail = 'Admin email is required'
    if (!password.trim()) newErrors.password = 'password is required'
    if (password && !confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    return newErrors
  }

  function resetAdminForm() {
  setAdminName('')
  setAdminEmail('')
  setPassword('')
  setConfirmPassword('')
  setAdminErrors({})
}

    function handleAdminSave() {
    const newErrors = validateAdmin()
    if (Object.keys(newErrors).length > 0) {
      setAdminErrors(newErrors)
      return
    }
    setAdminErrors({})
    resetAdminForm()
    showToast()
  }

  return (
     <>
    <div className="p-6">
      {/* header */}
      <p className="text-sm font-medium text-green-500 mb-1">Communication</p>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SETTINGS</h1>
      <p className="text-sm text-gray-400 mt-0.5 mb-6">Manage site configuration, admin accounts, and display preferences</p>

      {/* Site Information */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6 mb-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Site Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Site Title
          </label>
          <input type="text" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-500"/>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Contact Info</label>
            <input type="text" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400"  />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Mail</label>
            <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Instagram</label>
              <input type="text" placeholder="Instagram Handle" value={instagram} onChange={(e) => setInstagram(e.target.value)}
                className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">X (Twitter)</label>
            <input type="text" placeholder="x.com/" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400" />
          </div>
        </div>
        <button onClick={showToast} className="bg-green-500 hover:bg-green-600 rounded-lg hover:text-white text-gray-900 text-sm font-medium px-5 py-2 transition-colors">
             Save Changes
        </button>
      </div>

      {/* Admin Account */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6 mb-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Admin Account</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="flex flex-col gap-1.5">
           <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Admin Name</label>
           <input type="text" value={adminName} onChange={(e) => {setAdminName(e.target.value); setAdminErrors({...adminErrors, adminName: ""}) }}
           className={`border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 ${adminErrors.adminName ? 'border-red-400' : 'border-gray-200 dark:border-white/15'}`} />
           {adminErrors.adminName && <p className="text-xs text-red-500">{adminErrors.adminName}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
           <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Admin Email</label>
           <input type="email" placeholder="email address" value={adminEmail} onChange={(e)=> {setAdminEmail(e.target.value); setAdminErrors({...adminErrors, adminEmail: ""})}}
           className={`border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-400 ${adminErrors.adminEmail ? 'border-red-400' : 'border-gray-200 dark:border-white/15'}`} />
           {adminErrors.adminEmail && <p className="text-xs text-red-500">{adminErrors.adminEmail}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Role</label>
            <select disabled className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 cursor-not-allowed focus:outline-none">
              <option>Super Admin</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Password</label>
           <div className="relative">
             <input type={showPassword ? "text" : "password"} placeholder="........" value={password} onChange={(e)=>  {setPassword(e.target.value); setAdminErrors({...adminErrors, password: ""}) }}
                className="w-full border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                {showPassword? <Eye size={15}/> : <EyeOff size={15}/>}
              </button>
             {adminErrors.password && <p className="text-xs text-red-500">{adminErrors.password}</p>}
           </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Confirm Password</label>
           <div className="relative">
             <input type={showConfirmPassword ? "text" : "password"} placeholder=".........." value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value); setAdminErrors({...adminErrors, confirmPassword: ""})}}
           className={`w-full border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-400 pr-10 ${ adminErrors.confirmPassword ? 'border-red-400' : 'border-gray-200 dark:border-white/15'}`} />
           <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              {showConfirmPassword ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
           </div>
            {adminErrors.confirmPassword && <p className="text-xs text-red-500">{adminErrors.confirmPassword}</p>}
          </div>
        </div>
        <button onClick={handleAdminSave} className="bg-green-500 hover:bg-green-600 hover:text-white rounded-lg text-gray-900 text-sm font-medium px-5 py-2 transition-colors">
          Save Changes
        </button>
      </div>

      {/* Invite Admin Account */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Invite Admin Account</h2>
        <div className="space-y-4">
          {
            inviteAdmins.map((admin, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Admin Name</label>
                  <input type="text" value={admin.name} disabled={editingIndex !== i} onChange={(e) => {const updated = [...inviteAdmins]; updated[i].name = e.target.value; setInviteAdmins(updated)}}
                   className={`border px-3 py-2 rounded-lg text-sm focus:outline-none ${editingIndex === i ? 'border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white' : 'border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500'}`} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Admin Email</label>
                  <input type="email" value={admin.email} disabled={editingIndex !== i} onChange={(e) => {const updated = [...inviteAdmins]; updated[i].email = e.target.value; setInviteAdmins(updated)}} placeholder="email address"
                  className={`border px-3 py-2 rounded-lg text-sm focus:outline-none ${editingIndex === i ? 'border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white' : 'border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500'}`}/>
                </div>
                <div className="flex flex-col gap-1.5">
                 <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Role</label>
                 <select value={admin.role} disabled={editingIndex !== i} onChange={(e) => {
                 const updated = [...inviteAdmins]; updated[i].role = e.target.value; setInviteAdmins(updated)}}
                 className={`border px-3 py-2 rounded-lg text-sm focus:outline-none ${editingIndex === i ? 'border-green-400 text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5' : 'border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500'}`}>
                    <option>Sub Admin</option>
                    <option>Super Admin</option>
                 </select>
                </div>
                <div className="flex items-end gap-2 pb-0.5">
                  {editingIndex === i ? (
                    <button
                      onClick={() => { setEditingIndex(null); showToast() }}
                      className="text-xs text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors">
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingIndex(i)}
                      className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                      Edit
                    </button>
                  )}
                  <button className="text-xs text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>

    {/* Toast */}
    {toast && (
      <div className="fixed bottom-6 right-6 bg-green-500 text-white text-xs font-medium px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
       <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-white">✓</div>
       <div>
         <p className="font-semibold">Changes Saved</p>
            <p className="opacity-80">Changes for task done saved</p>
       </div>
       <button onClick={() => setToast(false)} className="ml-2 text-white/70 hover:text-white">
         ✕
       </button>
      </div>
    )}
    </>
   )
}

UDES_EOF_1347474180791173044

mkdir -p "$(dirname "src/routes/admin/gallery-upload/index.tsx")"
cat > "src/routes/admin/gallery-upload/index.tsx" << 'UDES_EOF_3288025977865266522'
// import React from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { ImagePlus } from "lucide-react"

export default function GalleryUpload() {
  const navigate = useNavigate()
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [headline, setHeadline] = useState('')
  const [instaUrl, setInstaUrl] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<Record<string, string>>({})

  function validate(){
       const newError: Record<string, string> = {}
    if (!headline.trim() && !instaUrl.trim()) {
      newError.headline = 'Either Photo Headline or Insta URL is required'
    }
    if (!description.trim()) newError.description = 'Photo description is required'
    return newError
  }

  function handlePublish(){
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors)
      return
    }
    navigate("/admin/gallery")
  }

  return (
    <div className='p-6'>
       <p className="text-sm font-medium text-green-500 mb-1"> Content Management</p>
       <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        <span className="text-gray-400">GALLERY</span> › UPLOAD CONTENT
       </h1>
       <p className="text-sm text-gray-400 mb-4">Upload and manage photos shown on the public gallery page</p>

       {/* Back button */}
      <button onClick={() =>("/gallery")} className='flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors'>
        <ArrowLeft size={18}/>
        Back
      </button>

      {/* Form */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
           <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  Photo Headline <span className="text-gray-400 font-medium">(Optional on Insta URL paste)</span>
                </label>
                <input type="text" placeholder='Input Headline' value={headline} onChange={(e) => {setHeadline(e.target.value); setError({...error, headline: ""})}}
                className={`border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 ${error.headline ? 'border-red-400' : 'border-gray-200 dark:border-white/15 hover:border-green-400'}`} />
                {error.headline && <p className='text-xs text-red-500'>{error.headline}</p>}
              </div>

              <div  className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Insta URL</label>
                <input type="text" placeholder='Input Headline' value={instaUrl} onChange={(e) => setInstaUrl(e.target.value)}
                 className='border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 py-2 px-3 text-sm'/>

              </div>
           </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Photo Description <span className="text-gray-400 font-normal">(Optional on Insta URL paste)</span>
          </label>
          <textarea placeholder="Input Description" rows={5} value={description} onChange={(e) => {setDescription(e.target.value); setError({...error, description: ""})}}
               className={`border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-400 resize-none rounded-lg ${error.description ? 'border-red-400' : 'border-gray-200 dark:border-white/15 hover:border-green-400'}`} />
               {error.description && <p className='text-xs text-red-500'>{error.description}</p>}
        </div>
        </div>

        <div className="flex flex-col gap-1.5 mb-6 md:w-1/2">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Cover Image <span className="text-gray-400 font-normal">(Optional on Insta URL paste)</span>
          </label>
          <label className="border border-gray-200 dark:border-white/15 h-36 flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors">
            {coverImage ? (
              <img src={coverImage} className="h-full w-full object-cover rounded-lg" />
        ) : (
           <div className="flex items-center gap-2">
             <ImagePlus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
             <p className="text-xs text-gray-400">Upload Photo</p>
           </div>
            )}

            <input type="file" accept='image/*' className='hidden' onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) setCoverImage(URL.createObjectURL(file))
            }} />
          </label>
        </div>

{/* Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={handlePublish} className="bg-gray-200 dark:bg-white/10 hover:bg-green-600 text-black dark:text-white hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors">
            + Publish
          </button>
          <button className="bg-gray-200 dark:bg-white/10 hover:bg-green-500 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors">
             Save as Draft
          </button>
          <button onClick={() => navigate("/admin/gallery")} className='bg-gray-200 dark:bg-white/10 hover:bg-green-500 hover:text-white text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 text-sm font-medium px-6 py-2 rounded-lg transition-colors'>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

UDES_EOF_3288025977865266522

mkdir -p "$(dirname "src/components/player-information/PlayerFullDetails.tsx")"
cat > "src/components/player-information/PlayerFullDetails.tsx" << 'UDES_EOF_7993049151103534272'
import { useGetSinglePlayer } from "@/hooks/useApi"
import leftFootHighlight from "@/assets/leftFootHighlight.png"
import leftFootDim from "@/assets/leftFootDim.png"
import rightFootHighlight from "@/assets/rightFootHighlight.png"
import rightFootDim from "@/assets/rightFootDim.png"
import noClubLogo from "@/assets/currentClubLogo.png"
import closeIcon from "@/assets/closeIcon.png"
import silhouette from '@/assets/silhouette.png'
import { Skeleton } from "@mui/material"
import { useEffect } from "react"
import { STATUS_LABEL } from "@/lib/playerStatus"


interface PlayerFullDetailsProps {
  id: string;
  onClose: () => void;
}

const PlayerFullDetails = ({ id, onClose }: PlayerFullDetailsProps) => {
  const { data: player, isLoading, isError } = useGetSinglePlayer(id);

  // lock background scroll while the modal is mounted; restore on unmount
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  if (isLoading) {
    return (
      <div
        onClick={onClose}
        className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-none md:backdrop-blur-sm md:bg-black/40 p-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-screen h-screen md:h-fit md:w-fit md:max-w-[90vw] md:max-h-[90vh] md:px-7 md:py-8 bg-white dark:bg-[#0d1117] rounded-2xl flex flex-col gap-5 overflow-y-auto relative"
        >
          {/* close icon stays real so the user can bail out mid-load */}
          <img
            src={closeIcon}
            alt="close"
            onClick={onClose}
            className="w-[27px] h-[27px] absolute md:top-6 md:right-6 top-3 right-2 cursor-pointer z-10"
          />

          <div className="flex flex-col md:flex-row md:gap-10 gap-15 mt-4 pt-10 md:pt-0">
            {/* image panel + silhouette */}
            <div className="relative w-[360px] h-[300px] rounded-[10px] bg-[#f0f0f0] flex items-end justify-center overflow-hidden self-center">
              <img
                src={silhouette}
                alt=""
                className="w-[280px] h-[290px] opacity-20 animate-pulse"
              />
            </div>

            <div className="flex flex-col gap-6">
              <Skeleton variant="text" width={220} height={60} />       {/* name */}
              <div className="flex items-center gap-10">
                <Skeleton variant="rounded" width={120} height={38} />  {/* status pill */}
                <Skeleton variant="text" width={80} />                  {/* position */}
              </div>
              <div className="flex gap-2 lg:gap-3">
                <Skeleton variant="rounded" width={100} height={100} />
                <Skeleton variant="rounded" width={100} height={100} />
                <Skeleton variant="rounded" width={100} height={100} />
                <Skeleton variant="rounded" width={110} height={90} sx={{ ml: 3 }} />
              </div>
              <div className="flex gap-4 items-center">
                <Skeleton variant="circular" width={50} height={50} />
                <div className="flex flex-col gap-1">
                  <Skeleton variant="text" width={90} />
                  <Skeleton variant="text" width={120} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-15 md:gap-40 mt-10 md:mt-0">
            {/* bio data column — 6 rows */}
            <div className="w-[320px] flex flex-col gap-3">
              <Skeleton variant="text" width={120} height={30} />
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="text" width='100%' height={28} />
              ))}
            </div>

            {/* brief history — a paragraph of lines */}
            <div className="w-[400px] flex flex-col gap-2">
              <Skeleton variant="text" width={160} height={30} />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="text" width='90%' height={20} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !player) {
    return (
      <div
        onClick={onClose}
        className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-none md:backdrop-blur-sm md:bg-black/40 p-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-screen h-screen md:h-fit md:w-fit md:min-w-[320px] md:max-w-[90vw] md:max-h-[90vh] md:px-7 md:py-10 bg-white dark:bg-[#0d1117] rounded-2xl flex flex-col items-center justify-center text-center gap-4 relative px-6"
        >
          {/* close icon so the user can dismiss the failed modal */}
          <img
            src={closeIcon}
            alt="close"
            onClick={onClose}
            className="w-[27px] h-[27px] absolute md:top-6 md:right-6 top-3 right-2 cursor-pointer z-10"
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#DC2626"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <p className="font-manrope font-bold text-[#060A0F] dark:text-white text-lg mb-1">
              We couldn't load this player
            </p>
            <p className="font-manrope font-normal text-[#68717D] dark:text-gray-400 text-sm max-w-xs">
              Something went wrong fetching this player's details. Please try again.
            </p>
          </div>
          <button
            onClick={onClose}
            className="font-manrope font-bold text-white text-sm bg-[#00A553] hover:bg-[#00934a] transition-colors rounded-xl py-2.5 px-5 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClose}
      className="backdrop-blur-none fixed inset-0 z-[999] flex items-center justify-center md:backdrop-blur-sm md:bg-black/40 p-4"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="w-screen h-screen pt-10 py-5 md:h-fit md:w-fit md:max-w-[90vw] md:max-h-[90vh] md:px-7 md:py-8 bg-white dark:bg-[#0d1117] text-[#060A0F] dark:text-white md:rounded-2xl flex flex-col gap-10 md:gap-5 overflow-y-auto relative"
      >
        {/* close icon - sits in the top-right corner, above the name; calls onClose */}
        <img
          src={closeIcon}
          alt="close"
          onClick={onClose}
          className="w-[27px] h-[27px] absolute top-3 right-1 md:top-6 md:right-6 cursor-pointer z-10"
        />

        <div className='flex flex-col gap-[8px] relative md:hidden'>
          <div className='w-[100px] h-[37px] flex gap-[8px] items-center justify-center bg-[#00D46A4D] rounded-full font-manrope text-[#00A553] font-bold'>
            <span className='w-[8px] h-[8px] bg-[#00D46A] rounded-lg'></span>
            Roster
          </div>
          <p className='font-normal text-[64px] leading-[69px] font-bebas text-[#060A0F] dark:text-white'>
            <span className='block'>PLAYER</span>
            INFORMATION
          </p>
        </div>

        <div className="flex flex-col items-center md:flex-row gap-15 lg:gap-20 md:mt-4 mb-10 md:mb-0">
          <div className="relative w-[330px] h-[290px]  md:w-[360px] md:h-[300px] rounded-[10px] bg-[url(./assets/PlayerFullDetailsBG.png)] bg-cover">
            <div className='absolute inset-0 z-10 flex items-end justify-center '>
              <img src={player?.playerPhoto ? player?.playerPhoto : silhouette} alt="" className='w-[270px] h-[280px] md:w-[280px] md:h-[290px] rounded-b-[10px]' />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-[48px] leading-7">{player?.playerFullName}</h1>

            {/* Player Status */}

            <div className="flex items-center gap-10">
              {
                player?.status && (
                  <div className={`flex items-center gap-[8px] px-[16px] py-[8px] rounded-[99px] font-manrope text-[16px] font-bold
                ${player?.status === "TRANSFERRED" ? "bg-[#00D46A4D] text-[#00A553]" : player?.status === "NEGOTIATION" ? "bg-[#D47F0033] text-[#D47F00]" : "bg-[#1778FB33] text-[#045BD0]"}`}>
                    {STATUS_LABEL[player.status]}
                    <div className={`w-[8px] h-[8px] rounded-full
                  ${player?.status === "TRANSFERRED" ? "bg-[#00D46A]" : player?.status === "NEGOTIATION" ? "bg-[#D47F00]" : "bg-[#045BD0]"}`}>
                    </div>
                  </div>
                )}
              <p className="font-manrope text-[20px]">{player?.position}</p>
            </div>

            <div className="flex gap-2 lg:gap-3">
              <div className="w-[78px] h-[78px] lg:w-[100px] lg:h-[100px] bg-[#1FC16B1A] rounded-2xl flex flex-col items-center justify-center">
                <p className="font-wdxl-lubrifont-sc text-[37px] lg:text-[48px] leading-[130%]">{player?.goals}</p>
                <p className="font-manrope text-[9px] text-[#8E8E8E] leading-[130%] font-bold">GOALS</p>
              </div>

              <div className="w-[78px] h-[78px] lg:w-[100px] lg:h-[100px] bg-[#1FC16B1A] rounded-2xl flex flex-col items-center justify-center">
                <p className="font-wdxl-lubrifont-sc text-[37px] lg:text-[48px] leading-[130%]">{player?.assists}</p>
                <p className="font-manrope text-[9px] text-[#8E8E8E] leading-[130%] font-bold">ASSISTS</p>
              </div>

              <div className="w-[78px] h-[78px] lg:w-[100px] lg:h-[100px] bg-[#1FC16B1A] rounded-2xl flex flex-col items-center justify-center">
                <p className="font-wdxl-lubrifont-sc text-[37px] lg:text-[48px] leading-[130%]">{player?.rating}</p>
                <p className="font-manrope text-[9px] text-[#8E8E8E] leading-[130%] font-bold">RATINGS</p>
              </div>

              {/* Preferred Foot */}
              {
                player?.preferredFoot && (

                  <div className="flex ml-4 lg:ml-6 gap-3">
                    <div className="relative">
                      <img src={player?.preferredFoot === "Left" ? leftFootHighlight : leftFootDim} alt="" className="w-[35px] h-[70px] lg:w-[50px] lg:h-[90px]" />
                      <p className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${player?.preferredFoot === "Left" ? "text-white" : "text-[#676768]"}`}>L</p>
                    </div>
                    <div className="relative">
                      <img src={player?.preferredFoot === "Right" ? rightFootHighlight : rightFootDim} alt="" className="w-[35px] h-[70px] lg:w-[50px] lg:h-[90px]" />
                      <p className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${player?.preferredFoot === "Right" ? "text-white" : "text-[#676768]"}`}>R</p>
                    </div>
                  </div>

                )
              }
            </div>

            {/* Optional field — only shown once an admin actually sets a current club */}
            {player?.currentClubName && (
              <div className="flex gap-4">
                <div>
                  <img src={player.currentClubLogo ? player.currentClubLogo : noClubLogo} alt="" className="w-[50px]" />
                </div>
                <div>
                  <p className="font-manrope font-medium text-lg text-[#060A0F] dark:text-white">Club Name</p>
                  <p className="font-manrope text-[16px] text-[#060A0F] dark:text-white">{player.currentClubName}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bio-data and History */}
        <div className="flex flex-col-reverse md:flex-row gap-10 md:gap-15 lg:gap-40">
          <div className="w-full md:w-[320px]">
            <p className="pb-2 font-bebas text-[26px] text-[#00D46A]">BIO DATA</p>
            <div>
              <div className="flex justify-between pb-2 border-b border-b-[#CACACA] dark:border-b-white/15 font-manrope">
                <p className="text-[18px] text-[#8E8E8E] dark:text-gray-400">Full Name:</p>
                <p className="text-end text-[20px] text-[#060A0F] dark:text-white">{player?.playerFullName ? player?.playerFullName : "Unknown"}</p>
              </div>
              <div className="flex justify-between pb-2 pt-2 border-b border-b-[#CACACA] dark:border-b-white/15 font-manrope">
                <p className="text-[18px] text-[#8E8E8E] dark:text-gray-400">Date of Birth:</p>
                <p className="text-end text-[20px] text-[#060A0F] dark:text-white">{player?.DOB ? player?.DOB : "Unknown"}</p>
              </div>
              <div className="flex justify-between pb-2 pt-2 border-b border-b-[#CACACA] dark:border-b-white/15 font-manrope">
                <p className="text-[18px] text-[#8E8E8E] dark:text-gray-400">Nationality:</p>
                <p className="text-end text-[20px] text-[#060A0F] dark:text-white">{player?.nationality ? player?.nationality : "Unknown"}</p>
              </div>
              <div className="flex justify-between pb-2 pt-2 border-b border-b-[#CACACA] dark:border-b-white/15 font-manrope">
                <p className="text-[18px] text-[#8E8E8E] dark:text-gray-400">Height:</p>
                <p className="text-end text-[20px] text-[#060A0F] dark:text-white">{player?.height ? player?.height : "Unknown"}cm</p>
              </div>
              <div className="flex justify-between pb-2 pt-2 border-b border-b-[#CACACA] dark:border-b-white/15 font-manrope">
                <p className="text-[18px] text-[#8E8E8E] dark:text-gray-400">Preferred foot:</p>
                <p className="text-end text-[20px] text-[#060A0F] dark:text-white">{player?.preferredFoot ? player?.preferredFoot : "Unknown"}</p>
              </div>
              <div className="flex justify-between pb-2 pt-2 border-b border-b-[#CACACA] dark:border-b-white/15 font-manrope">
                <p className="text-[18px] text-[#8E8E8E] dark:text-gray-400">Age Group:</p>
                <p className="text-end text-[20px] text-[#060A0F] dark:text-white">{player?.ageGroup ? player?.ageGroup : "Unknown"}</p>
              </div>
            </div>
          </div>


          <div className=" md:w-[300px] lg:w-[400px]">
            <p className="font-bebas text-[#00D46A] text-[26px]">BRIEF HISTORY</p>
            <div className="font-manrope font-medium text-[#8E8E8E] dark:text-gray-400 leading-[24px] lg:text-[16px] w-[90%]">
              <p>
                {player?.playerHistory ? player.playerHistory : "No Player History"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerFullDetails


UDES_EOF_7993049151103534272

mkdir -p "$(dirname "src/components/player-information/FetchPlayers.tsx")"
cat > "src/components/player-information/FetchPlayers.tsx" << 'UDES_EOF_74688500199641803'
import { useGetPlayers } from '@/hooks/useApi';
import Skeleton from '@mui/material/Skeleton';
import noPlayers from '@/assets/noPlayers.png'
import udeSportLogo from '@/assets/udeSportLogo.png'
import { getAge } from '@/hooks/getAge';
import silhouette from '@/assets/silhouette.png'
import type { AgeGroup, Status } from './FilterPlayers';
import { STATUS_LABEL } from '@/lib/playerStatus';


type FetchPlayersProps = {
  ageFilter: AgeGroup
  statusFilter: Status
  searchInput: string
  onPlayerClick: (id: string) => void   // called with the player's id when a card is clicked
  onClearFilters: () => void            // resets age/status/search back to defaults in the parent
}

const FetchPlayers = ({ ageFilter, statusFilter, searchInput, onPlayerClick, onClearFilters }: FetchPlayersProps) => {
  const { data, isLoading, isError } = useGetPlayers();

  // true when any filter is narrowing the list — decides which empty state to show
  const hasActiveFilters =
    ageFilter !== "All" || statusFilter !== "All" || searchInput.trim() !== ""

  // A single skeleton card — mirrors the real card's outer dimensions and split layout
  const PlayerCardSkeleton = () => (
    <div className='w-[255px] h-[226px] md:w-[240px] md:h-[211px] lg:w-[306px] lg:h-[272px] flex gap-2 relative'>
      {/* left: main card area with silhouette */}
      <div className='h-full w-[226px] rounded-[10px] bg-[#f0f0f0] flex items-end justify-center overflow-hidden'>
        {/* silhouette shape — a rounded block standing in for the player image */}
        <img
          src={silhouette}
          alt=""
          className='w-[174px] h-[187px] lg:w-[200px] lg:h-[224px] opacity-20 animate-pulse'
        />
      </div>

      {/* right: the G/A · APP · club strip */}
      <div className='h-full w-[69.1px] rounded-r-3xl flex flex-col justify-between gap-1'>
        <Skeleton variant="rounded" width='100%' height={63} />
        <Skeleton variant="rounded" width='100%' height={40} />
        <Skeleton variant="rounded" width={48} height={108} sx={{ borderBottomRightRadius: 16 }} />
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gridAdjust gap-11 w-full justify-items-center'>
        {Array.from({ length: 8 }).map((_, i) => (
          <PlayerCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center text-center gap-4 w-full py-20 px-6'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#DC2626"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div>
          <p className='font-manrope font-bold text-[#060A0F] dark:text-white text-lg mb-1'>
            We couldn't load the players
          </p>
          <p className='font-manrope font-normal text-[#68717D] text-sm max-w-sm'>
            Something went wrong fetching the roster. Check your connection and try again.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className='font-manrope font-bold text-white text-sm bg-[#00A553] hover:bg-[#00934a] transition-colors rounded-xl py-2.5 px-5 cursor-pointer'
        >
          Retry
        </button>
      </div>
    )
  }

  // No players in the system at all (empty roster, not a filter mismatch)
  if (!data || data.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center text-center gap-4 w-full h-90 px-6'>
        <img src={noPlayers} alt="" className='w-20 h-20 opacity-80' />
        <p className='font-manrope font-bold text-[#060A0F] dark:text-white text-lg'>No players yet</p>
        <p className='font-manrope font-normal text-[#68717D] text-sm max-w-sm'>
          There are no players on the roster at the moment. Check back soon.
        </p>
      </div>
    )
  }

  const filteredData = data.filter((player) => {
    const currentAge = getAge(player.DOB)
    const ageMatch =
      ageFilter === "All" || currentAge <= ageFilter

    const statusMatch =
      statusFilter === "All" || STATUS_LABEL[player.status] === statusFilter

    const q = searchInput.toLowerCase()

    const searchMatch =
      (player.playerName?.toLowerCase().includes(q)) ||
      (player.playerFullName?.toLowerCase().includes(q)) ||
      (player.currentClubName?.toLowerCase().includes(q)) ||
      (player.position?.toLowerCase().includes(q)) ||
      getAge(player.DOB).toString().includes(searchInput)

    return ageMatch && statusMatch && searchMatch

  })

  // Players exist, but none match the current filters — let the user clear them
  if (filteredData.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center text-center gap-4 w-full h-90 px-6'>
        <img src={noPlayers} alt="" className='w-20 h-20 opacity-80' />
        <div>
          <p className='font-manrope font-bold text-[#060A0F] dark:text-white text-lg mb-1'>
            No players match your filters
          </p>
          <p className='font-manrope font-normal text-[#68717D] text-sm max-w-sm'>
            Try adjusting your search or filters to see more of the roster.
          </p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className='font-manrope font-bold text-white text-sm bg-[#00A553] hover:bg-[#00934a] transition-colors rounded-xl py-2.5 px-5 cursor-pointer'
          >
            Clear filters
          </button>
        )}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-11 w-full justify-items-center gridAdjust'>
      {
        filteredData.map((result) => {
          return (
            <div key={result.id}
              onClick={() => onPlayerClick(result.id)}
              className=' w-[255px] h-[226px] md:w-[240px] md:h-[211px] lg:w-[306px] lg:h-[272px] flex gap-2 cursor-pointer relative rounded-[10px] transition-transform duration-300 hover:scale-105'>

              <div className={`flex flex-row-reverse items-center gap-[8px] px-[9px] py-[4.5px] rounded-[99px] font-manrope text-[10px] font-bold absolute top-3 left-3 md:top-2 md:left-2 lg:top-3 lg:left-3 bg-[#155535] text-[#00D46A]`}>
                {result?.status}
                <div className={`w-[8px] h-[8px] rounded-full bg-[#00D46A]`}>
                </div>
              </div>

              <div className='h-full w-[226px] rounded-[10px] bg-[url(./assets/playerCard.png)] bg-cover flex items-end'>

                {/* gradient panel: three stacked layers (silhouette / gradient / text) */}
                <div className='w-full h-[126px] relative rounded-b-[10px] '>

                  {/* silhouette - bottom layer */}
                  <div className='absolute inset-0 z-10 flex items-end justify-center '>
                    <img src={result.playerPhoto ? result.playerPhoto : silhouette} alt="" className='w-[174px] h-[187px] md:w-[165px] md:h-[175px] lg:w-[200px] lg:h-[224px] rounded-b-[10px]' />
                  </div>

                  {/* gradient - middle layer, sits above the silhouette */}
                  <div className='absolute inset-0 z-20 bg-gradient-to-b from-transparent to-[#00D46A] rounded-b-[10px]' />

                  {/* text content - top layer */}
                  <div className='relative z-30 h-full flex flex-col items-center justify-center gap-1 lg:gap-2 '>
                    <div className='px-[7.9px] bg-[#00D46A] mt-9 lg:mt-6'>
                      <p className='font-bebas font-normal text-[17px] lg:text-[20px]'>{result.playerName}</p>
                    </div>

                    <div className='flex gap-4 text-center'>
                      <div className='flex flex-col items-center justify-center'>
                        <p className=' text-[10px] lg:text-[12px] font-medium text-[#FFFFFF]'>Age</p>
                        <p className='lg:text-[20px] font-bold text-[#FFFFFF]'>{getAge(result.DOB)}</p>
                      </div>

                      <div className=' flex flex-col items-center justify-center'>
                        <p className='text-[10px] lg:text-[12px] font-medium text-[#FFFFFF]'>Position</p>
                        <p className='lg:text-[20px] font-bold text-[#FFFFFF]'>{result.position}</p>
                      </div>

                      <div className='flex flex-col items-center justify-center'>
                        <p className='text-[10px] lg:text-[12px] font-medium text-[#FFFFFF]'> {'Height (cm)'}</p>
                        <p className='lg:text-[20px] font-bold text-[#FFFFFF]'>{result.height}</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
              <div className='h-full w-[69.1px] rounded-r-3xl flex flex-col justify-between'>

                {/* G/A */}
                <div className='bg-[#00D46A] w-full h-[63px] lg:h-[75.9px] rounded-tr-2xl flex flex-col justify-center items-center'>
                  <span className='font-manrope font-bold text-[11px] leading-[100%]'>G/A</span>
                  <span className='font-wdxl-lubrifont-sc font-normal text-[40px] leading-[100%]'>{(result.goals + result.assists) ? (result.goals + result.assists) : "?"}</span>
                </div>

                {/* APP. */}
                <div className='w-full justify-center items-center flex flex-col'>
                  <span className='font-manrope font-bold text-[11px] leading-[100%]'>APP.</span>
                  <span className='font-wdxl-lubrifont-sc font-normal text-[40px] leading-[100%]'>{result.playerAppearance ? result.playerAppearance : "?"}</span>
                </div>

                {/* current club — optional field, only shown once an admin actually sets it */}
                {result.currentClubName && (
                  <div
                    className='bg-[url(./assets/bgEffect.png)] bg-contain bg-[#00D46A] w-[48px] h-[108px] lg:w-[57px] lg:h-[130px] rounded-br-2xl flex justify-center items-end pb-3'>
                    <img src={result.currentClubLogo ? result.currentClubLogo : udeSportLogo} alt="" className='w-[30px] h-[30px]' />
                  </div>
                )}

              </div>

            </div>
          )
        })
      }
    </div>
  )
}

export default FetchPlayers



UDES_EOF_74688500199641803

mkdir -p "$(dirname "src/components/home/SectionTwo.tsx")"
cat > "src/components/home/SectionTwo.tsx" << 'UDES_EOF_7482282765743773108'
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import AutoScroll from 'embla-carousel-auto-scroll';
import arrow1 from '@/assets/arrow1.png';
import silhouette from '@/assets/silhouette.png';
import udeSportLogo from '@/assets/udeSportLogo.png';
import { useGetPlayers } from '@/hooks/useApi';
import type { Player } from '@/types/dataTypes';
import { getAge } from '@/hooks/getAge';
import PageWrapper from '../page-wrapper';


const SectionTwo = () => {
  const navigate = useNavigate();
  const { data: players, isLoading, error } = useGetPlayers();

  const handleViewPlayers = () => {
    navigate('/players');
  };

  const featuredPlayers = players?.filter((player: Player) => player.isFeatured);

  // Static left column, reused in every state so the layout never collapses
  const LeftSide = (
    <div className="flex-1 flex flex-col justify-start items-start gap-10">
      <div className="bg-[#00D46A4D] flex flex-row justify-center items-center gap-2 rounded-3xl py-2 px-2 w-fit">
        <span className="bg-[#00D46A] w-2 h-2 rounded-full"></span>
        <p className="font-manrope font-bold text-[#00A553] text-[13px] leading-[130%] tracking-normal">
          Our Stars
        </p>
      </div>
      <div className="flex flex-col justify-start items-start gap-14 lg:w-[400px]">
        <h2 className="font-bebas font-semibold text-[#060A0F] dark:text-white text-[clamp(52px,5vw,64px)] leading-0 tracking-normal">
          FEATURED PLAYERS
        </h2>
        <p className="font-manrope font-bold text-[#8E8E8E] dark:text-gray-400 text-[clamp(14px,2vw,18px)] leading-6.75 tracking-normal max-w-125">
          Every player on this roster has been developed, tested, and proven.
          These are not prospects. These are professionals in the making.
        </p>
      </div>
      <button
        className="flex justify-start items-center gap-2 border-[#FFFFFF] rounded-xl py-2 px-2 border-s hover:border-[#00A553] hover:border cursor-pointer"
        type="button"
        onClick={handleViewPlayers}
      >
        <p className="font-manrope font-normal text-[#68717D] dark:text-gray-300 text-[14px] leading-5.25 tracking-normal">
          View all Players
        </p>
        <img className="w-[17.86px] h-[17.86px]" src={arrow1} alt="" />
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="my-14">
        <PageWrapper className="p-[20px] flex flex-col lg:flex-row items-start gap-8">
          {LeftSide}
          {/* Player card skeletons mirroring the carousel row */}
          <div className="w-full min-w-0 lg:max-w-[1123px] lg:mr-[calc((100vw-100%)/-2)]">
            <div className="flex pl-4 md:pl-6 lg:pl-8 gap-4 md:gap-6 lg:gap-10.75 overflow-hidden" style={{ minHeight: '340px' }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-[358px] h-[318px] md:w-[384px] md:h-[340px] lg:w-[490px] lg:h-[430px] flex gap-2 flex-shrink-0"
                >
                  {/* main card */}
                  <div className="h-full w-[317px] md:w-[340px] lg:w-[399px] rounded-[10px] bg-gray-200 animate-pulse relative">
                    {/* status pill placeholder */}
                    <div className="absolute top-4 left-4 md:top-3 md:left-3 lg:top-5 lg:left-5 w-24 h-7 rounded-[99px] bg-gray-300 animate-pulse" />
                    {/* bottom info panel placeholder */}
                    <div className="absolute bottom-0 left-0 w-full h-[177px] md:h-[190px] lg:h-[222px] rounded-b-[10px] bg-gray-300/70 animate-pulse" />
                  </div>
                  {/* right stats column */}
                  <div className="h-full w-[97px] md:w-[104px] lg:w-[122px] rounded-r-3xl flex flex-col justify-between gap-2">
                    <div className="w-full h-[88px] lg:h-[134px] rounded-tr-2xl bg-gray-200 animate-pulse" />
                    <div className="w-full flex-1 bg-gray-200 animate-pulse rounded" />
                    <div className="w-[67px] h-[152px] lg:w-[101px] lg:h-[229px] rounded-br-2xl bg-gray-200 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PageWrapper>
      </div>
    );
  }

  if (error || !players) {
    return (
      <div className="my-14">
        <PageWrapper className="p-[20px] flex flex-col lg:flex-row items-start gap-8">
          {LeftSide}
          <div className="w-full min-w-0 flex items-center justify-center" style={{ minHeight: '340px' }}>
            <div className="flex flex-col items-center justify-center text-center gap-4 py-16 px-6 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl w-full max-w-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#DC2626"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <p className="font-manrope font-bold text-[#060A0F] text-lg mb-1">
                  We couldn't load players
                </p>
                <p className="font-manrope font-normal text-[#68717D] text-sm max-w-sm">
                  Something went wrong fetching the featured roster. Check your connection and try again.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="font-manrope font-bold text-white text-sm bg-[#00A553] hover:bg-[#00934a] transition-colors rounded-xl py-2.5 px-5 cursor-pointer"
              >
                Retry
              </button>
            </div>
          </div>
        </PageWrapper>
      </div>
    );
  }

  return (
    <div className="my-14">
      {/* container holds the left content; carousel sits outside its right padding so it can bleed */}
      <PageWrapper className="p-[20px] flex flex-col lg:flex-row items-start gap-8">
        {/* LEFT SIDE */}
        {LeftSide}

        {/* RIGHT SIDE: bleeds to the right edge of the viewport.
            On mobile it's full width in the column; from lg up it breaks out of the
            container's right padding using calc + a negative right margin. */}
        <div className="w-full min-w-0 lg:max-w-[1123px] lg:mr-[calc((100vw-100%)/-2)]">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[
              AutoScroll({
                speed: 1,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent
              className="ml-0 pl-4 md:pl-6 lg:pl-8 gap-4 md:gap-6 lg:gap-10.75"
              style={{ minHeight: '340px' }}
            >
              {featuredPlayers?.map((result: Player) => (
                <CarouselItem key={result.id} className="basis-auto pl-0 "
                  onClick={() => {
                    navigate('/players', {
                      state: { playerId: result.id }
                    });
                  }}>
                  <div className="w-[358px] h-[318px] md:w-[384px] md:h-[340px] lg:w-[490px] lg:h-[430px] flex gap-2 cursor-pointer relative  transition-transform duration-200 ease-out
    hover:scale-[0.97]">
                    <div className="flex flex-row-reverse items-center gap-[8px] px-[13px] py-[6px] rounded-[99px] font-manrope text-[13px] lg:text-[16px] font-bold absolute top-4 left-4 md:top-3 md:left-3 lg:top-5 lg:left-5 bg-[#155535] text-[#00D46A]">
                      {result?.status}
                      <div className="w-[11px] h-[11px] lg:w-[14px] lg:h-[14px] rounded-full bg-[#00D46A]"></div>
                    </div>

                    <div className="h-full w-[317px] md:w-[340px] lg:w-[399px] rounded-[10px] bg-[url(./assets/playerCard.png)] bg-cover flex items-end">
                      {/* gradient panel: three stacked layers (silhouette / gradient / text) */}
                      <div className="w-full h-[177px] md:h-[190px] lg:h-[222px] relative rounded-b-[10px]">
                        {/* silhouette - bottom layer */}
                        <div className="absolute inset-0 z-10 flex items-end justify-center">
                          <img
                            src={result.playerPhoto ? result.playerPhoto : silhouette}
                            alt=""
                            className="w-[244px] h-[262px] md:w-[260px] md:h-[280px] lg:w-[323px] lg:h-[365px] rounded-b-[10px]"
                          />
                        </div>

                        {/* gradient - middle layer, sits above the silhouette */}
                        <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent to-[#00D46A] rounded-b-[10px]" />

                        {/* text content - top layer */}
                        <div className="relative z-30 h-full flex flex-col items-center justify-center gap-2 lg:gap-3">
                          <div className="px-[11px] lg:px-[14px] bg-[#00D46A] mt-12 lg:mt-11">
                            <p className="font-bebas font-normal text-[24px] lg:text-[30px]">{result.playerName}</p>
                          </div>

                          <div className="flex gap-6 lg:gap-7 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <p className="text-[14px] lg:text-[15px] font-medium text-[#FFFFFF]">Age</p>
                              <p className="text-[24px] lg:text-[30px] font-bold text-[#FFFFFF]">{getAge(result.DOB)}</p>
                            </div>

                            <div className="flex flex-col items-center justify-center">
                              <p className="text-[14px] lg:text-[15px] font-medium text-[#FFFFFF]">Position</p>
                              <p className="text-[24px] lg:text-[30px] font-bold text-[#FFFFFF]">{result.position}</p>
                            </div>

                            <div className="flex flex-col items-center justify-center">
                              <p className="text-[14px] lg:text-[15px] font-medium text-[#FFFFFF]">{'Height (cm)'}</p>
                              <p className="text-[24px] lg:text-[30px] font-bold text-[#FFFFFF]">{result.height}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-full w-[97px] md:w-[104px] lg:w-[122px] rounded-r-3xl flex flex-col justify-between">
                      {/* G/A */}
                      <div className="bg-[#00D46A] w-full h-[88px] lg:h-[134px] rounded-tr-2xl flex flex-col justify-center items-center">
                        <span className="font-manrope font-bold text-[15px] lg:text-[19px] leading-[100%]">G/A</span>
                        <span className="font-wdxl-lubrifont-sc font-normal text-[56px] lg:text-[60px] leading-[100%]">{(result.goals + result.assists) ? (result.goals + result.assists) : "?"}</span>
                      </div>

                      {/* APP. */}
                      <div className="w-full justify-center items-center flex flex-col">
                        <span className="font-manrope font-bold text-[15px] lg:text-[19px] leading-[100%]">APP.</span>
                        <span className="font-wdxl-lubrifont-sc font-normal text-[56px] lg:text-[60px] leading-[100%]">{result.playerAppearance ? result.playerAppearance : "?"}</span>
                      </div>

                      {/* current club — optional field, only shown once an admin actually sets it */}
                      {result.currentClubName && (
                        <div className="bg-[url(./assets/bgEffect.png)] bg-contain bg-[#00D46A] w-[67px] h-[152px] lg:w-[101px] lg:h-[229px] rounded-br-2xl flex justify-center items-end pb-5">
                          <img
                            src={result.currentClubLogo ? result.currentClubLogo : udeSportLogo}
                            alt=""
                            className='w-[53px] h-[53px]'
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </PageWrapper>
    </div>
  );
};

export default SectionTwo;


UDES_EOF_7482282765743773108

echo "Done. Now run:"
echo "  npx tsc --noEmit -p tsconfig.app.json && npx eslint . && npm run build"