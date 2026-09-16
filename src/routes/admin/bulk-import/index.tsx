import { useNavigate } from "react-router";
import { useRef, useState } from "react";
import { useBulkCreatePlayers } from "@/hooks/useApi";
import { parseCsv, toCsvBlob } from "@/lib/csv";
import { toast } from "react-toastify";

// Columns the CSV template ships with, in the order the template/download
// writes them and the preview table reads them. Required ones match the
// server's non-nullable Player columns exactly (see player.controller.ts
// createPlayersBulk) — a row missing any of these is skipped, not sent.
const REQUIRED_COLUMNS = ["playerName", "DOB", "nationality", "preferredFoot", "ageGroup", "position"] as const;
const ALL_COLUMNS = [
  "playerName",
  "playerFullName",
  "DOB",
  "nationality",
  "height",
  "preferredFoot",
  "ageGroup",
  "status",
  "position",
  "previousClubName",
  "currentClubName",
  "playerHistory",
  "playerAppearance",
  "rating",
] as const;

// DOB in the CSV is typed as MM/DD/YYYY (same format the single Add
// Player form uses) — converted to an ISO string before it's sent.
function inputDateToIso(input: string): string | null {
  const match = input.trim().match(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/(\d{4})$/);
  if (!match) return null;
  const [, mm, dd, yyyy] = match;
  const date = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

interface PreviewRow {
  index: number;
  raw: Record<string, string>;
  errors: string[];
  payload: Record<string, unknown> | null;
}

function buildPreviewRow(index: number, raw: Record<string, string>): PreviewRow {
  const errors: string[] = [];

  for (const col of REQUIRED_COLUMNS) {
    if (!raw[col]?.trim()) errors.push(`Missing "${col}"`);
  }

  let isoDob: string | null = null;
  if (raw.DOB?.trim()) {
    isoDob = inputDateToIso(raw.DOB);
    if (!isoDob) errors.push(`Invalid DOB "${raw.DOB}" — use MM/DD/YYYY`);
  }

  if (errors.length > 0) {
    return { index, raw, errors, payload: null };
  }

  const payload: Record<string, unknown> = {
    playerName: raw.playerName.trim(),
    playerFullName: raw.playerFullName?.trim() || raw.playerName.trim(),
    DOB: isoDob,
    nationality: raw.nationality.trim(),
    height: raw.height?.trim() ? Number(raw.height.trim()) : undefined,
    preferredFoot: raw.preferredFoot.trim(),
    ageGroup: raw.ageGroup.trim(),
    status: raw.status?.trim() || "FREE",
    position: raw.position.trim(),
    previousClubName: raw.previousClubName?.trim() || undefined,
    currentClubName: raw.currentClubName?.trim() || undefined,
    playerHistory: raw.playerHistory?.trim() || undefined,
    playerAppearance: raw.playerAppearance?.trim() || "0",
    rating: raw.rating?.trim() ? Number(raw.rating.trim()) : undefined,
    // Bulk imports are always drafts — see createPlayersBulk on the server.
    published: false,
  };

  return { index, raw, errors: [], payload };
}

export default function BulkImportPlayers() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkCreateMutation = useBulkCreatePlayers();

  const [fileName, setFileName] = useState<string>("");
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [results, setResults] = useState<{ playerName: string; success: boolean; error?: string }[] | null>(null);

  const validRows = previewRows.filter((r) => r.errors.length === 0);
  const invalidRows = previewRows.filter((r) => r.errors.length > 0);

  function handleDownloadTemplate() {
    const exampleRow = [
      "Uche Henry Agbo",
      "Uche Henry Agbo",
      "12/04/1995",
      "Nigerian",
      "185",
      "Both",
      "Professional",
      "TRANSFERRED",
      "CB",
      "Slovan Bratislava (Slovakia)",
      "FC Aktobe (Kazakhstan)",
      "Nigerian defender developed at Udinese's academy...",
      "382+",
      "8.5",
    ];
    const blob = toCsvBlob([...ALL_COLUMNS], [exampleRow]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "udesport-player-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResults(null);

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const { rows } = parseCsv(text);
      if (rows.length === 0) {
        toast.error("Couldn't find any data rows in that file");
        setPreviewRows([]);
        return;
      }
      setPreviewRows(rows.map((row, i) => buildPreviewRow(i, row)));
    };
    reader.onerror = () => toast.error("Couldn't read that file");
    reader.readAsText(file);
  }

  async function handleImport() {
    if (validRows.length === 0) return;
    try {
      const rowResults = await bulkCreateMutation.mutateAsync(
        validRows.map((r) => r.payload as Record<string, unknown>)
      );
      setResults(rowResults);
      const successCount = rowResults.filter((r) => r.success).length;
      if (successCount > 0) {
        toast.success(`${successCount}/${rowResults.length} players created as drafts`);
      } else {
        toast.error("No players were created — see the results below");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed");
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-green-500 mb-1">Overview</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BULK IMPORT PLAYERS</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Upload a CSV to create many players at once — every row is saved as a Draft, so nothing goes
            live until you review and publish it individually.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        {/* Step 1: template */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pb-6 border-b border-gray-100 dark:border-white/10">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">1. Download the CSV template</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Required columns: {REQUIRED_COLUMNS.join(", ")}. Everything else is optional.
            </p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shrink-0"
          >
            Download Template
          </button>
        </div>

        {/* Step 2: upload */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-6 border-b border-gray-100 dark:border-white/10">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">2. Upload your filled-in CSV</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {fileName ? `Loaded: ${fileName}` : "DOB should be MM/DD/YYYY, same as the Add Player form."}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="text-xs text-gray-600 dark:text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-green-500 file:text-gray-900 hover:file:bg-green-600 cursor-pointer"
          />
        </div>

        {/* Step 3: preview */}
        {previewRows.length > 0 && (
          <div className="pt-6">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                3. Review — {validRows.length} ready to import
                {invalidRows.length > 0 && `, ${invalidRows.length} need fixing`}
              </p>
              <button
                onClick={handleImport}
                disabled={validRows.length === 0 || bulkCreateMutation.isPending}
                className="bg-green-500 hover:bg-green-600 text-gray-900 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {bulkCreateMutation.isPending ? "Importing…" : `Import ${validRows.length} Player${validRows.length === 1 ? "" : "s"} as Drafts`}
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-white/10">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/10 text-gray-400 bg-gray-50 dark:bg-white/5">
                    <th className="text-left px-3 py-2 font-medium">Row</th>
                    <th className="text-left px-3 py-2 font-medium">Name</th>
                    <th className="text-left px-3 py-2 font-medium">DOB</th>
                    <th className="text-left px-3 py-2 font-medium">Nationality</th>
                    <th className="text-left px-3 py-2 font-medium">Position</th>
                    <th className="text-left px-3 py-2 font-medium">Status</th>
                    <th className="text-left px-3 py-2 font-medium">Result / Issues</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/10">
                  {previewRows.map((row) => {
                    const outcome = results?.[row.index] ?? results?.find((r) => r.playerName === row.raw.playerName);
                    return (
                      <tr key={row.index} className={row.errors.length > 0 ? "bg-red-50/50 dark:bg-red-900/10" : ""}>
                        <td className="px-3 py-2 text-gray-400">{row.index + 2}</td>
                        <td className="px-3 py-2 text-gray-900 dark:text-white">{row.raw.playerName || "—"}</td>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{row.raw.DOB || "—"}</td>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{row.raw.nationality || "—"}</td>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{row.raw.position || "—"}</td>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{row.raw.status || "FREE"}</td>
                        <td className="px-3 py-2">
                          {row.errors.length > 0 ? (
                            <span className="text-red-500">{row.errors.join("; ")}</span>
                          ) : outcome ? (
                            outcome.success ? (
                              <span className="text-green-600 dark:text-green-400">Created as draft</span>
                            ) : (
                              <span className="text-red-500">{outcome.error}</span>
                            )
                          ) : (
                            <span className="text-gray-400">Ready</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mt-6 flex-wrap">
          <button
            onClick={() => navigate("/admin/player-overview")}
            className="text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            {results ? "Back to Player Overview" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
