/**
 * localStorage service for managing user profile and favorite papers
 * All persistence is done client-side using browser localStorage
 */

import { UserProfile, FavoritePaper } from './types';

// localStorage keys
const STORAGE_KEYS = {
  USER_PROFILE: 'paper_explorer_user_profile',
  FAVORITES: 'paper_explorer_favorites',
} as const;

/**
 * Check if localStorage is available (client-side only)
 */
function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * Load user profile from localStorage
 * Returns null if no profile exists or on error
 */
export function loadUserProfile(): UserProfile | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!data) return null;

    return JSON.parse(data) as UserProfile;
  } catch (error) {
    console.error('Error loading user profile from localStorage:', error);
    return null;
  }
}

/**
 * Save user profile to localStorage
 */
export function saveUserProfile(profile: UserProfile): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available');
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile to localStorage:', error);
  }
}

/**
 * Load favorite papers from localStorage
 * Returns empty array if no favorites exist or on error
 */
export function loadFavoritePapers(): FavoritePaper[] {
  if (!isLocalStorageAvailable()) return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!data) return [];

    return JSON.parse(data) as FavoritePaper[];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
}

/**
 * Save favorite papers to localStorage
 */
export function saveFavoritePapers(favorites: FavoritePaper[]): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available');
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
}

/**
 * Add a paper to favorites
 * Returns the updated favorites array
 */
export function addFavoritePaper(paper: Omit<FavoritePaper, 'addedAt'>): FavoritePaper[] {
  const favorites = loadFavoritePapers();

  // Check if paper is already in favorites
  const exists = favorites.some(fav => fav.id === paper.id);
  if (exists) {
    return favorites;
  }

  const favoritePaper: FavoritePaper = {
    ...paper,
    addedAt: new Date().toISOString(),
  };

  const updatedFavorites = [...favorites, favoritePaper];
  saveFavoritePapers(updatedFavorites);
  return updatedFavorites;
}

/**
 * Remove a paper from favorites
 * Returns the updated favorites array
 */
export function removeFavoritePaper(paperId: string): FavoritePaper[] {
  const favorites = loadFavoritePapers();
  const updatedFavorites = favorites.filter(fav => fav.id !== paperId);
  saveFavoritePapers(updatedFavorites);
  return updatedFavorites;
}

/**
 * Check if a paper is in favorites
 */
export function isFavorite(paperId: string): boolean {
  const favorites = loadFavoritePapers();
  return favorites.some(fav => fav.id === paperId);
}

/**
 * Clear all data from localStorage (for testing/debugging)
 */
export function clearAllData(): void {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
