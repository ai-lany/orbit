import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { PostData, ProfileStats, ProfileUser } from '../types';
import { currentUser, currentUserStats, posts as seedPosts } from '../mock/data';

export type Theme = 'light' | 'dark';

interface AppState {
  user: ProfileUser;
  stats: ProfileStats;
  posts: PostData[];
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleLike: (post: PostData) => void;
  toggleFollow: () => void;
  addPost: (text: string) => void;
}

const AppStateContext = createContext<AppState | null>(null);

// Module-level counter for stable local-post ids (Date/random not needed).
let nextLocalId = 0;

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ProfileUser>(currentUser);
  const [posts, setPosts] = useState<PostData[]>(seedPosts);
  const [theme, setTheme] = useState<Theme>('light');

  const toggleLike = useCallback((post: PostData) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              liked: !p.liked,
              stats: p.stats
                ? { ...p.stats, likes: p.stats.likes + (p.liked ? -1 : 1) }
                : p.stats,
            }
          : p,
      ),
    );
  }, []);

  const toggleFollow = useCallback(() => {
    setUser((u) => ({ ...u, isFollowing: !u.isFollowing }));
  }, []);

  const addPost = useCallback(
    (text: string) => {
      setPosts((prev) => [
        {
          id: `local-${nextLocalId++}`,
          author: {
            name: user.name,
            handle: user.handle,
            avatarSrc: user.avatarSrc,
            verified: user.verified,
          },
          timestamp: 'now',
          content: text,
          stats: { likes: 0, comments: 0, shares: 0 },
          liked: false,
        },
        ...prev,
      ]);
    },
    [user],
  );

  // Profile post count reflects newly composed posts.
  const stats = useMemo<ProfileStats>(
    () => ({
      ...currentUserStats,
      posts: currentUserStats.posts + posts.filter((p) => p.id.startsWith('local-')).length,
    }),
    [posts],
  );

  const value = useMemo<AppState>(
    () => ({ user, stats, posts, theme, setTheme, toggleLike, toggleFollow, addPost }),
    [user, stats, posts, theme, toggleLike, toggleFollow, addPost],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within an AppStateProvider');
  return ctx;
}
