// lib/db.ts
import { kv } from '@vercel/kv';

/**
 * Read all records from KV
 * Returns empty array if key doesn't exist
 */
export async function readData<T>(filename: string): Promise<T[]> {
  const data = await kv.get<T[]>(filename);
  return data ?? [];
}

/**
 * Write entire array to KV (overwrites)
 */
export async function writeData<T>(filename: string, data: T[]): Promise<void> {
  await kv.set(filename, data);
}

/**
 * Append a single item to a KV key
 */
export async function appendData<T>(filename: string, item: T): Promise<void> {
  const data = await readData<T>(filename);
  data.push(item);
  await writeData(filename, data);
}

/**
 * Find a single record by ID
 */
export async function findById<T extends { id: string }>(
  filename: string,
  id: string
): Promise<T | undefined> {
  const data = await readData<T>(filename);
  return data.find((item) => item.id === id);
}

/**
 * Update a record by ID with partial data
 */
export async function updateById<T extends { id: string }>(
  filename: string,
  id: string,
  updates: Partial<T>
): Promise<T | null> {
  const data = await readData<T>(filename);
  const index = data.findIndex((item) => item.id === id);

  if (index === -1) return null;

  data[index] = { ...data[index], ...updates };
  await writeData(filename, data);
  return data[index];
}

/**
 * Delete a record by ID
 */
export async function deleteById<T extends { id: string }>(
  filename: string,
  id: string
): Promise<boolean> {
  const data = await readData<T>(filename);
  const filtered = data.filter((item) => item.id !== id);

  if (filtered.length === data.length) return false;

  await writeData(filename, filtered);
  return true;
}

/**
 * Filter records by a predicate function
 */
export async function filterData<T>(
  filename: string,
  predicate: (item: T) => boolean
): Promise<T[]> {
  const data = await readData<T>(filename);
  return data.filter(predicate);
}

/**
 * Count records
 */
export async function countData<T>(
  filename: string,
  predicate?: (item: T) => boolean
): Promise<number> {
  const data = await readData<T>(filename);
  if (!predicate) return data.length;
  return data.filter(predicate).length;
}

/**
 * Check if a record exists by a field value
 */
export async function existsByField<T>(
  filename: string,
  field: keyof T,
  value: unknown
): Promise<boolean> {
  const data = await readData<T>(filename);
  return data.some((item) => item[field] === value);
}