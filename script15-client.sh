#!/usr/bin/env bash
set -euo pipefail

echo "Applying script15: add a Professional age-group option across the app, and fix dark mode on the admin login page..."

mkdir -p "$(dirname "src/types/dataTypes.ts")"
cat > "src/types/dataTypes.ts" << 'UDES_EOF_1105447791285382750'


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
  ageGroup: "U-17" | "U-21" | "U-23" | "Professional",
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


UDES_EOF_1105447791285382750

mkdir -p "$(dirname "src/routes/admin/add-player/index.tsx")"
cat > "src/routes/admin/add-player/index.tsx" << 'UDES_EOF_2569916817421723243'
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
  const [group, setGroup] = useState<"U-17" | "U-21" | "U-23" | "Professional">("U-17");
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
        {/* Player photo — preview uses the same portrait shape (and object-cover
            crop) as the public player card / detail page, so what you see here
            is what visitors will actually see, not a generic round avatar. */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-white/10">
          <div className="w-[87px] h-[94px] rounded-b-[10px] overflow-hidden bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/15 flex items-center justify-center flex-shrink-0">
            {photoPreview ? (
              <img src={photoPreview} alt="Player" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] text-gray-400 text-center px-1">No photo</span>
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
            <p className="text-[11px] text-gray-400">
              Shown as a tall portrait crop on the site — a headshot or upper-body photo works best.
            </p>
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
              onChange={(e) => setGroup(e.target.value as "U-17" | "U-21" | "U-23" | "Professional")}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              <option>U-17</option>
              <option>U-21</option>
              <option>U-23</option>
              <option>Professional</option>
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



UDES_EOF_2569916817421723243

mkdir -p "$(dirname "src/routes/admin/player-overview/index.tsx")"
cat > "src/routes/admin/player-overview/index.tsx" << 'UDES_EOF_4095127660757582553'
// import React from 'react'
import { Search, Plus } from "lucide-react"
import { useNavigate } from "react-router"
import { useState } from "react"
import { useGetPlayers, useDeletePlayer } from "@/hooks/useApi";
import { STATUS_LABEL, STATUS_STYLE } from "@/lib/playerStatus";
import type { PlayerStatus } from "@/types/dataTypes";

const GROUP_OPTIONS = ["U-17", "U-21", "U-23", "Professional"] as const;

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
    const [statusFilter, setStatusFilter] = useState<'All Statuses' | PlayerStatus>('All Statuses')
    const [deletingId, setDeletingId] = useState<string | null>(null)

      const { data: players, isLoading } = useGetPlayers();
      const deletePlayerMutation = useDeletePlayer();

      function handleDelete(id: string, name: string) {
        if (!window.confirm(`Delete ${name}? This can't be undone.`)) return
        setDeletingId(id)
        deletePlayerMutation.mutate(id, {
          onSettled: () => setDeletingId(null),
        })
      }


const filteredPlayers = players?.filter((player) => {
    const name = player.playerFullName || player.playerName
    const club = player.currentClubName || ""
    const matchSearch =
    name.toLowerCase().includes(search.toLowerCase()) ||
    STATUS_LABEL[player.status].toLowerCase().includes(search.toLowerCase()) ||
    club.toLowerCase().includes(search.toLowerCase())

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
                {GROUP_OPTIONS.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'All Statuses' | PlayerStatus)} className="text-xs border border-gray-200 dark:border-white/15 focus:bg-green-100 dark:focus:bg-green-900/30 rounded-lg px-3 py-2 focus:outline-none focus:border-green-400 text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5">
                <option value="All Statuses">All Statuses</option>
                {(Object.keys(STATUS_LABEL) as PlayerStatus[]).map((status) => (
                  <option key={status} value={status}>{STATUS_LABEL[status]}</option>
                ))}
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
            filteredPlayers?.map((player) => {
                const displayName = player.playerFullName || player.playerName
                return (
                <tr key={player.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                   {/* Player */}
                   <td className="px-5 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {displayName.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{displayName}</p>
                            <p className="text-xs text-gray-400">Pos. {player.position}</p>
                        </div>
                     </div>
                   </td>
                     <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{player.ageGroup}</td>
                     <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{player.position}</td>
                     <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{player.rating ?? "—"}</td>
                     <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{player.currentClubName || "—"}</td>

 {/* Status */}
             <td className="px-5 py-4">
               <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[player.status]}`}>
                 {STATUS_LABEL[player.status]}
               </span>
             </td>

             {/* Actions */}
             <td className="px-5 py-4">
               <div className="flex items-center gap-2">
                 <button onClick={() => navigate(`/admin/player-overview/edit/${player.id}`)} className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                    Edit
                 </button>
                 <button
                   onClick={() => handleDelete(player.id, displayName)}
                   disabled={deletingId === player.id}
                   className="text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                 >
                    {deletingId === player.id ? "Deleting…" : "Delete"}
                 </button>
               </div>
             </td>
                </tr>
                )
            }))}
          </tbody>
         </table>
       </div>

    </div>
)
}




UDES_EOF_4095127660757582553

mkdir -p "$(dirname "src/routes/admin/dashboard/index.tsx")"
cat > "src/routes/admin/dashboard/index.tsx" << 'UDES_EOF_5383906620843651502'
// import React from 'react'
import { Users, ArrowLeftRight, Handshake, FileText, Newspaper, RefreshCw, Mail, Trophy } from "lucide-react"
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

    const { data: players, isLoading: loadingPlayers } = useGetPlayers();
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

    const statCards = [
        {
            label: "Players this Season",
            value: players?.length,
            sub: 'From Last Season +13% ',
            icon: Users,
            bg: "bg-green-300"
        },
        {
            label: 'Completed Transfers',
            value: transferredPlayers,
            sub: 'All time Record',
            icon: ArrowLeftRight,
            bg: 'bg-green-500',
        },
        {
            label: 'Live Negotiations',
            value: negotiationPlayers,
            sub: 'Active Now',
            icon: Handshake,
            bg: 'bg-orange-400',
        },
        {
            label: 'Published Article',
            value: publishedArticles,
            sub: 'New Today',
            icon: FileText,
            bg: 'bg-blue-300',
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




UDES_EOF_5383906620843651502

mkdir -p "$(dirname "src/routes/admin/login/index.tsx")"
cat > "src/routes/admin/login/index.tsx" << 'UDES_EOF_961650547946864708'
import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/green udeLogo.png";
import { useLogin } from "@/hooks/useApi";

export default function Login() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const newErrors = {
      email: "",
      password: "",
      form: "",
    };

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      return;
    }

    try {
      await loginMutation.mutateAsync({ email: email.trim(), password });
      navigate("/admin/dashboard");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      }));
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7F5] dark:bg-black flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-white/5 border border-transparent dark:border-white/10 rounded-2xl shadow-lg p-8 transition-colors duration-300">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Udesport Logo" className="w-24" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Login to Account
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
          Please enter your email and password to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300"> Email Address</label>

            <input
              type="email"
              placeholder="Input email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({
                    ...prev,
                    email: ""
                }))
              }}
              className={`w-full mt-2 border rounded-lg px-4 py-3 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-200 dark:border-white/15 focus:border-green-500"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300"> Password</label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Input password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({
                        ...prev,
                        password: ""
                    }))
                }}
                className={`w-full border rounded-lg px-4 py-3 pr-12 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ${
                  errors.password ? "border-red-500" : "border-gray-200 dark:border-white/15 focus:border-green-500"
                }`}
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={rememberPassword}
                onChange={() => setRememberPassword(!rememberPassword)}
              />
              Remember Password
            </label>

            <button
              type="button"
              onClick={() => navigate("/admin/forgot-password")}
              className="text-green-600 dark:text-green-400 text-sm"
            >
              Forgot Password
            </button>
          </div>

          {errors.form && (
            <p className="text-sm text-red-500 text-center">{errors.form}</p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

UDES_EOF_961650547946864708

echo "Done. Now run:"
echo "  npx tsc --noEmit -p tsconfig.app.json && npx eslint . && npm run build"