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
export const generateId = (prefix: string): string => {
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}_${Date.now()}_${random}`;
};

export const generatePaymentId = (): string => {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TXN_${Date.now()}_${random}`;
};
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
