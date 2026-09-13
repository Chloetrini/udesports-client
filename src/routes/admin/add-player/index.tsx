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
        {/* Player photo — preview uses the same portrait shape as the public
            player card / detail page, with object-contain (not a crop) so a
            cut-out PNG with a transparent background shows in full, matching
            how the site actually displays it. */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-white/10">
          <div className="w-[87px] h-[94px] rounded-b-[10px] overflow-hidden bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/15 flex items-center justify-center flex-shrink-0">
            {photoPreview ? (
              <img src={photoPreview} alt="Player" className="w-full h-full object-contain object-bottom" />
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
              Use a PNG with the background already removed (a head-and-shoulders or upper-body cutout) for the best look — it's shown as-is, not cropped to a box.
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



