// src/utils/csvParser.js

/**
 * @function parseCSV
 * @description Parses a raw CSV string into a 2D array of strings.
 * Correctly handles quoted fields that may contain commas or newlines.
 * @param {string} str - Raw CSV text content
 * @returns {Array<Array<string>>} 2D array of rows and columns (header row included)
 */
export const parseCSV = (str) => {
  const result = [];
  let row = [],
    inQuotes = false,
    val = "";

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(val.trim());
      val = "";
    } else if (char === "\n" && !inQuotes) {
      row.push(val.trim());
      if (row.length > 1) result.push(row);
      row = [];
      val = "";
    } else if (char !== "\r") {
      val += char;
    }
  }

  // Handle last row if file doesn't end with newline
  row.push(val.trim());
  if (row.length > 1) result.push(row);

  return result;
};

/**
 * @function parseCSVToObjects
 * @description Parses a CSV string and maps each data row to a plain object
 * using the first row as keys. Skips rows that don't match the header length.
 * @param {string} str - Raw CSV text content
 * @returns {Array<Object>} Array of row objects keyed by column header
 *
 * @example
 * // Input: "Name,Age\nAlice,30\nBob,25"
 * // Output: [{ Name: "Alice", Age: "30" }, { Name: "Bob", Age: "25" }]
 */
export const parseCSVToObjects = (str) => {
  const rows = parseCSV(str);
  if (rows.length < 2) return [];

  const [headers, ...dataRows] = rows;
  return dataRows
    .filter((cols) => cols.length === headers.length)
    .map((cols) => Object.fromEntries(headers.map((key, i) => [key, cols[i]])));
};
