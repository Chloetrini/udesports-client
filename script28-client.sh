#!/bin/bash
set -e

echo "Applying script28: adds a one-click Retired checkbox next to Featured (instead of only being reachable through the Status dropdown), restyles both checkboxes to the site green with a checkmark instead of the browser default blue, and fixes the player-photo caption text overflowing on small screens."

mkdir -p "src/routes/admin/add-player"
cat > "src/routes/admin/add-player/index.tsx" << 'UDESPORT_EOF_MARKER'
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
  const [saves, setSaves] = useState(0);
  const [cleanSheets, setCleanSheets] = useState(0);
  const [playerAppearance, setPlayerAppearance] = useState(0);
  const [ratings, setRatings] = useState("");
  const [background, setBackground] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [currentClubName, setCurrentClubName] = useState("");
  const [currentClubLogo, setCurrentClubLogo] = useState("");
  const [currentClubLogoFile, setCurrentClubLogoFile] = useState<File | null>(null);
  const [newClubName, setNewClubName] = useState("");
  const [newClubLogo, setNewClubLogo] = useState("");
  const [newClubLogoFile, setNewClubLogoFile] = useState<File | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);

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
    setSaves(player.saves ?? 0);
    setCleanSheets(player.cleanSheets ?? 0);
    setPlayerAppearance(player.playerAppearance ?? 0);
    setRatings(player.rating?.toString() || "");
    setBackground(player.playerHistory || "");
    setPhotoPreview(player.playerPhoto || "");
    setCurrentClubName(player.currentClubName || "");
    setCurrentClubLogo(player.currentClubLogo || "");
    setNewClubName(player.newClubName || "");
    setNewClubLogo(player.newClubLogo || "");
    setIsFeatured(!!player.isFeatured);
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

  // Shared validation for a club-logo file upload (current or new club) —
  // same rules as the player photo, just a smaller size cap since these are
  // simple badge/crest images, not portraits.
  function handleLogoFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    field: "currentClubLogo" | "newClubLogo",
    setFile: (file: File | null) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError((prev) => ({ ...prev, [field]: "Please choose an image file" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError((prev) => ({ ...prev, [field]: "Image must be smaller than 5MB" }));
      return;
    }

    setError((prev) => ({ ...prev, [field]: "" }));
    setFile(file);
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
      saves,
      cleanSheets,
      playerAppearance,
      rating: ratings ? Number(ratings) : undefined,
      playerHistory: background,
      currentClubName: currentClubName.trim() || undefined,
      currentClubLogo: currentClubLogo.trim() || undefined,
      newClubName: newClubName.trim() || undefined,
      newClubLogo: newClubLogo.trim() || undefined,
      isFeatured,
    };

    // Only include a photo when a new one was picked — omitting it on edit
    // keeps the existing photo (the backend preserves it unless a file is
    // actually sent), and including it only when present is what tells
    // toRequestBody() in Players.ts to send this as multipart FormData.
    if (photo) {
      payload.playerPhoto = photo;
    }

    // Same pattern for club logos: an uploaded file takes priority over the
    // pasted URL (the URL field is disabled while a file is selected, so in
    // practice only one or the other is ever set at a time).
    if (currentClubLogoFile) {
      payload.currentClubLogo = currentClubLogoFile;
    }
    if (newClubLogoFile) {
      payload.newClubLogo = newClubLogoFile;
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
        {/* Player photo — preview uses the same portrait shape as the public
            player card / detail page, with object-contain (not a crop) so a
            cut-out PNG with a transparent background shows in full, matching
            how the site actually displays it. */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-white/10">
          <div className="w-[87px] h-[94px] rounded-b-[10px] overflow-hidden bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/15 flex items-center justify-center flex-shrink-0">
            {photoPreview ? (
              <img src={photoPreview} alt="Player" className="w-full h-full object-contain object-top" />
            ) : (
              <span className="text-[10px] text-gray-400 text-center px-1">No photo</span>
            )}
          </div>
          {/* min-w-0 lets this column actually shrink to the container's
              width instead of being pushed wide by the file input / long
              caption text — without it, the row overflowed horizontally on
              small screens instead of wrapping. */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Player Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="text-xs text-gray-600 dark:text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-green-500 file:text-gray-900 hover:file:bg-green-600 cursor-pointer"
            />
            <p className="text-[11px] text-gray-400 break-words">
              Use a PNG with the background already removed (a head-and-shoulders or upper-body cutout) for the best look — it's shown as-is, not cropped to a box.
            </p>
            {error.photo && <p className="text-xs text-red-500">{error.photo}</p>}
          </div>
        </div>

        {/* Featured — controls whether this player shows in the homepage
            "Featured Players" carousel (SectionTwo.tsx filters on this flag).
            Retired — a quick on/off next to it for the same status you can
            also set via the "Current Status" dropdown further down; this
            just makes the Retired flag a single obvious click instead of
            something you have to know to look for inside a select. Checking
            it sets status to RETIRED, unchecking it sets status back to
            FREE — both stay in sync with the dropdown either way. */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4">
          <div className="flex items-center gap-2">
            <input
              id="isFeatured"
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 dark:border-white/20 accent-[#00D46A] focus:ring-green-400 cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-xs font-medium text-gray-600 dark:text-gray-300 cursor-pointer">
              Show on homepage "Featured Players" section
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isRetired"
              type="checkbox"
              checked={status === "RETIRED"}
              onChange={(e) => setStatus(e.target.checked ? "RETIRED" : "FREE")}
              className="w-4 h-4 rounded border-gray-300 dark:border-white/20 accent-[#00D46A] focus:ring-green-400 cursor-pointer"
            />
            <label htmlFor="isRetired" className="text-xs font-medium text-gray-600 dark:text-gray-300 cursor-pointer">
              Mark this player as Retired
            </label>
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
              <option>FW</option>
              <option>CM</option>
              <option>CB</option>
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

          {/* Goals / Assists (outfield) or Saves / Clean Sheets (goalkeeper) —
              the public card shows whichever pair matches the position. */}
          {position === "GK" ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Saves</label>
                <input
                  value={saves}
                  onChange={(e) => setSaves(Number(e.target.value))}
                  type="number"
                  placeholder="0"
                  min={0}
                  className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Clean Sheets</label>
                <input
                  value={cleanSheets}
                  onChange={(e) => setCleanSheets(Number(e.target.value))}
                  type="number"
                  placeholder="0"
                  min={0}
                  className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </>
          ) : (
            <>
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
            </>
          )}

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

          {/* Appearances — backs the "APP." box on the public player cards.
              This field existed on the backend and the card display already,
              but had no input anywhere in this form to actually set it. */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Appearances</label>
            <input
              value={playerAppearance}
              onChange={(e) => setPlayerAppearance(Number(e.target.value))}
              type="number"
              placeholder="0"
              min={0}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Club information — shown on the public player cards/detail page.
            Grouped as "Current Club" / "New Club" units (name + logo
            together) instead of four equal-width grid cells, since the logo
            field needs a lot more vertical room (URL input + file upload row
            + remove button + error) than a plain name field — mixing them
            into one 4-up grid made the row heights mismatch badly, especially
            once the file-upload option was added. */}
        {status === "RETIRED" && (
          <div className="mt-5 flex items-start gap-2 rounded-lg border border-amber-300/50 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
            <span aria-hidden="true">ℹ️</span>
            <span>
              This player is marked <strong>Retired</strong> — the public site shows a "Retired" badge
              instead of a club logo, so the current/new club fields below won't be displayed. You can
              still fill them in for your own records; they'll just be hidden until the status changes.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          {/* Current club */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-white/10 p-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Current Club
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Club Name</label>
              <input
                type="text"
                placeholder="e.g. Enyimba FC"
                value={currentClubName}
                onChange={(e) => setCurrentClubName(e.target.value)}
                className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Club Logo</label>
              <input
                type="text"
                placeholder="Paste an image URL..."
                value={currentClubLogo}
                onChange={(e) => setCurrentClubLogo(e.target.value)}
                disabled={!!currentClubLogoFile}
                className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
              />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="text-[11px] text-gray-400">or upload a file</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoFileChange(e, "currentClubLogo", setCurrentClubLogoFile)}
                  className="text-xs text-gray-600 dark:text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-green-500 file:text-gray-900 hover:file:bg-green-600 cursor-pointer"
                />
                {currentClubLogoFile && (
                  <button
                    type="button"
                    onClick={() => setCurrentClubLogoFile(null)}
                    className="text-[11px] text-red-500 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              {error.currentClubLogo && <p className="text-xs text-red-500">{error.currentClubLogo}</p>}
            </div>
          </div>

          {/* New club (in-progress transfer) */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-white/10 p-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              New Club <span className="normal-case font-normal">(if recently transferred)</span>
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Club Name</label>
              <input
                type="text"
                placeholder="If recently transferred"
                value={newClubName}
                onChange={(e) => setNewClubName(e.target.value)}
                className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Club Logo</label>
              <input
                type="text"
                placeholder="Paste an image URL..."
                value={newClubLogo}
                onChange={(e) => setNewClubLogo(e.target.value)}
                disabled={!!newClubLogoFile}
                className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
              />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="text-[11px] text-gray-400">or upload a file</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoFileChange(e, "newClubLogo", setNewClubLogoFile)}
                  className="text-xs text-gray-600 dark:text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-green-500 file:text-gray-900 hover:file:bg-green-600 cursor-pointer"
                />
                {newClubLogoFile && (
                  <button
                    type="button"
                    onClick={() => setNewClubLogoFile(null)}
                    className="text-[11px] text-red-500 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              {error.newClubLogo && <p className="text-xs text-red-500">{error.newClubLogo}</p>}
            </div>
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
UDESPORT_EOF_MARKER

echo "Done. Now run: npx tsc --noEmit -p tsconfig.app.json && npx eslint . && npm run build"
