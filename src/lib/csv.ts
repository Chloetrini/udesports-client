// Minimal dependency-free CSV parser — no papaparse/csv-parse in
// package.json, and this only needs to handle the simple case of a
// header row + data rows with optional quoted fields (commas/quotes
// inside a value wrapped in "..."). Not a full RFC 4180 implementation
// (no multi-line quoted fields), but covers what a player-data CSV
// realistically needs.

export interface ParsedCsv {
  headers: string[];
  rows: Record<string, string>[];
}

function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++; // skip the escaped quote's second character
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

export function parseCsv(text: string): ParsedCsv {
  // Strip a UTF-8 BOM if present (common when a CSV is saved from Excel)
  // and normalize line endings before splitting into rows.
  const cleaned = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = cleaned.split("\n").filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = splitCsvLine(lines[0]).map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = (values[idx] ?? "").trim();
    });
    rows.push(row);
  }

  return { headers, rows };
}

// Builds a downloadable CSV Blob from headers + rows (used for the
// "Download template" button — no library needed for this either).
export function toCsvBlob(headers: string[], rows: (string | number)[][]): Blob {
  const escape = (value: string | number) => {
    const str = String(value ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const lines = [headers.map(escape).join(","), ...rows.map((row) => row.map(escape).join(","))];
  return new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
}
