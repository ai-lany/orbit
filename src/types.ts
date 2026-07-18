/**
 * Shared domain types for Orbit's social components.
 * Kept framework-agnostic so they can back real API models later.
 */

export interface MediaItem {
  /** Stable key for lists; falls back to the src when absent. */
  id?: string;
  src: string;
  alt?: string;
  /** Optional link target when a tile is clicked. */
  href?: string;
}

export interface Author {
  name: string;
  /** Handle without the leading "@". */
  handle?: string;
  avatarSrc?: string;
  verified?: boolean;
}

export interface PostStats {
  likes: number;
  comments: number;
  shares: number;
}

export interface PostData {
  id: string;
  author: Author;
  /** Display string (e.g. "2h", "Jul 14"). */
  timestamp?: string;
  content?: string;
  media?: MediaItem[];
  stats?: PostStats;
  liked?: boolean;
}

export interface ProfileUser {
  name: string;
  /** Handle without the leading "@". */
  handle: string;
  avatarSrc?: string;
  coverSrc?: string;
  bio?: string;
  verified?: boolean;
  isFollowing?: boolean;
}

export interface ProfileStats {
  posts: number;
  followers: number;
  following: number;
}
