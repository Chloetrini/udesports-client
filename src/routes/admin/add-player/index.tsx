// import React from 'react'
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useState } from "react";
import { useGetPlayers } from "@/hooks/useApi";
import countries from "world-countries";

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
  const { data: players, isLoading, isError } = useGetPlayers();
  const navigate = useNavigate();
  const { index } = useParams();
  const player = index !== undefined ? players?.[Number(index)] ?? null : null;
  const [name, setName] = useState(player?.playerFullName);
  const [position, setPosition] = useState(player?.position);
  const [group, setGroup] = useState(player?.ageGroup);
  const [dob, setDob] = useState(player?.DOB);
  const [nationality, setNationality] = useState(player?.nationality);
  const [foot, setFoot] = useState(player?.preferredFoot);
  const [height, setHeight] = useState(player?.height);
  const [status, setStatus] = useState(player?.status || "Free");
  const [goals, setGoals] = useState(player?.goals);
  const [assists, setAssists] = useState(player?.assists);
  const [ratings, setRatings] = useState(player?.rating?.toString() || "");
  const [background, setBackground] = useState(player?.playerHistory);

  const [error, setError] = useState<Record<string, string>>({});

  if (isLoading) {
    return <AddPlayerSkeleton />
  }
  if (isError) {
    return <div className="p-6 text-gray-900 dark:text-white">Something went wrong</div>
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

  function handleSubmit() {
    const newError = validate();
    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }
    navigate("/admin/player-overview");
  }
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
              className={`border px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error.name ? "border-red-400" : "border-gray-200 dark:border-white/15"
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
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
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
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
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
              className={`border px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error.dob ? "border-red-400" : "border-gray-200 dark:border-white/15"
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
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
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
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
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
              className={`border px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error.height ? "border-red-400" : "border-gray-200 dark:border-white/15"
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
              onChange={(e) => setStatus(e.target.value as "Free" | "Transferred" | "Negotiation")}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              <option>Free</option>
              <option>Transferred</option>
              <option>Negotiation</option>
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
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
            className={`border px-3 py-2 text-sm focus:outline-none focus:border-green-400 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error.background ? "border-red-400" : "border-gray-200 dark:border-white/15"
              }`}
          />
          {error.background && (
            <p className="text-xs text-red-500">{error.background}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-gray-900 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
          >
            {player ? "Save Changes" : "+ Add Player"}
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


