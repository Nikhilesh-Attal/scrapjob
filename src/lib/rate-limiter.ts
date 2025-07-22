
"use client";

// This file is DEPRECATED as we are now using a more robust
// Firestore-based approach in user-actions.ts
// It is kept for reference but should not be used.

/**
 * @fileOverview A simple client-side rate limiter using localStorage.
 */

/**
 * Checks if the user has exceeded the usage limit for a specific action
 * within a given time period (default is 24 hours).
 *
 * @param {string} action - A unique name for the action (e.g., 'analyze', 'enhance').
 * @param {number} limit - The maximum number of times the action can be performed.
 * @param {number} periodInHours - The time window in hours to check against.
 * @returns {boolean} - True if the user is within the limit, false otherwise.
 */
export function checkLimit(action: string, limit: number, periodInHours: number = 24): boolean {
  if (typeof window === 'undefined') return true;
  const key = `rateLimit_${action}`;
  const now = Date.now();
  const periodInMillis = periodInHours * 60 * 60 * 1000;

  try {
    const records: number[] = JSON.parse(localStorage.getItem(key) || '[]');
    // Filter out records that are older than the period
    const recentRecords = records.filter(timestamp => now - timestamp < periodInMillis);
    
    // Save the cleaned list back to localStorage
    localStorage.setItem(key, JSON.stringify(recentRecords));

    return recentRecords.length < limit;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    // Fail open, allow the action
    return true;
  }
}

/**
 * Records that an action has been performed.
 *
 * @param {string} action - A unique name for the action to record.
 */
export function recordAction(action: string): void {
   if (typeof window === 'undefined') return;
  const key = `rateLimit_${action}`;
  const now = Date.now();

  try {
    const records: number[] = JSON.parse(localStorage.getItem(key) || '[]');
    records.push(now);
    localStorage.setItem(key, JSON.stringify(records));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}
