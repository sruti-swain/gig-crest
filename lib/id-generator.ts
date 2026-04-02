// lib/id-generator.ts
// Generates unique IDs with readable prefixes
// e.g., "worker_a1b2c3d4", "policy_x9y8z7w6"

import { v4 as uuidv4 } from 'uuid';

// Valid prefix types for our entities
type EntityType =
  | 'worker'
  | 'zone'
  | 'policy'
  | 'claim'
  | 'event'
  | 'payment'
  | 'fraud'
  | 'weather';

/**
 * Generate a prefixed unique ID
 * @param entity - The entity type (worker, policy, etc.)
 * @returns string like "worker_a1b2c3d4"
 */
export function generateId(entity: EntityType): string {
  // Take first 8 chars of UUID for readability
  const shortId = uuidv4().replace(/-/g, '').substring(0, 12);
  return `${entity}_${shortId}`;
}

/**
 * Generate a mock UPI transaction ID
 * @returns string like "TXN202401150001"
 */
export function generateTransactionId(): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, '0');
  return `TXN${dateStr}${random}`;
}