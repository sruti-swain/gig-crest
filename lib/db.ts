// lib/db.ts
// JSON file-based database utility
// Reads and writes to data/*.json files
// Only use in API routes (server-side) — NEVER in client components

import fs from 'fs';
import path from 'path';

// Path to the data directory
const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Ensure the data directory exists
 * Called once when the module loads
 */
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Run on module load
ensureDataDir();

/**
 * Read all records from a JSON file
 * Returns empty array if file doesn't exist
 */
export function readData<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, filename);

  // Create file with empty array if it doesn't exist
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
    return [];
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    // Handle empty file
    if (!raw.trim()) return [];
    return JSON.parse(raw) as T[];
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

/**
 * Write entire array to a JSON file (overwrites)
 */
export function writeData<T>(filename: string, data: T[]): void {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw new Error(`Failed to write to ${filename}`);
  }
}

/**
 * Append a single item to a JSON file
 */
export function appendData<T>(filename: string, item: T): void {
  const data = readData<T>(filename);
  data.push(item);
  writeData(filename, data);
}

/**
 * Find a single record by ID
 */
export function findById<T extends { id: string }>(
  filename: string,
  id: string
): T | undefined {
  const data = readData<T>(filename);
  return data.find((item) => item.id === id);
}

/**
 * Update a record by ID with partial data
 * Returns updated record or null if not found
 */
export function updateById<T extends { id: string }>(
  filename: string,
  id: string,
  updates: Partial<T>
): T | null {
  const data = readData<T>(filename);
  const index = data.findIndex((item) => item.id === id);

  if (index === -1) return null;

  // Merge updates into existing record
  data[index] = { ...data[index], ...updates };
  writeData(filename, data);
  return data[index];
}

/**
 * Delete a record by ID
 * Returns true if deleted, false if not found
 */
export function deleteById<T extends { id: string }>(
  filename: string,
  id: string
): boolean {
  const data = readData<T>(filename);
  const filtered = data.filter((item) => item.id !== id);

  if (filtered.length === data.length) return false;

  writeData(filename, filtered);
  return true;
}

/**
 * Filter records by a predicate function
 */
export function filterData<T>(
  filename: string,
  predicate: (item: T) => boolean
): T[] {
  const data = readData<T>(filename);
  return data.filter(predicate);
}

/**
 * Count records, optionally with a filter
 */
export function countData<T>(
  filename: string,
  predicate?: (item: T) => boolean
): number {
  const data = readData<T>(filename);
  if (!predicate) return data.length;
  return data.filter(predicate).length;
}

/**
 * Check if a record exists by a field value
 * Useful for checking duplicates (e.g., phone number)
 */
export function existsByField<T>(
  filename: string,
  field: keyof T,
  value: unknown
): boolean {
  const data = readData<T>(filename);
  return data.some((item) => item[field] === value);
}