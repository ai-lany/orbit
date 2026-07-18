import type { MediaItem, PostData, ProfileStats, ProfileUser } from '../types';

/** Deterministic placeholder image from picsum.photos (needs network in-browser). */
function img(seed: string, w = 600, h = 600): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

function gallery(seed: string, count: number): MediaItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${seed}-${i}`,
    src: img(`${seed}-${i}`),
    alt: `Photo ${i + 1}`,
  }));
}

export const currentUser: ProfileUser = {
  name: 'Maya Okonkwo',
  handle: 'mayao',
  avatarSrc: img('maya-avatar', 200, 200),
  coverSrc: img('maya-cover', 1200, 400),
  bio: 'Product designer & film-photography nerd. Building small, calm software. Coffee-first.',
  verified: true,
  isFollowing: false,
};

export const currentUserStats: ProfileStats = {
  posts: 214,
  followers: 18400,
  following: 312,
};

export const posts: PostData[] = [
  {
    id: 'p1',
    author: {
      name: 'Maya Okonkwo',
      handle: 'mayao',
      avatarSrc: img('maya-avatar', 200, 200),
      verified: true,
    },
    timestamp: '2h',
    content:
      'Spent the weekend shooting on the old rangefinder. A few frames from the roll — light was unreal.',
    media: gallery('roll', 6),
    stats: { likes: 1240, comments: 84, shares: 22 },
    liked: true,
  },
  {
    id: 'p2',
    author: {
      name: 'Devs & Coffee',
      handle: 'devscoffee',
      avatarSrc: img('devs-avatar', 200, 200),
    },
    timestamp: '5h',
    content:
      'Hot take: the best design system is the one your team actually remembers to use. Constraints > options.',
    stats: { likes: 532, comments: 141, shares: 47 },
  },
  {
    id: 'p3',
    author: {
      name: 'Rafael Costa',
      handle: 'rafa',
      avatarSrc: img('rafa-avatar', 200, 200),
      verified: true,
    },
    timestamp: '8h',
    content: 'New studio wall is done. Swipe through.',
    media: gallery('studio', 3),
    stats: { likes: 890, comments: 33, shares: 12 },
  },
  {
    id: 'p4',
    author: {
      name: ' Line & grid',
      handle: 'linegrid',
      avatarSrc: img('line-avatar', 200, 200),
    },
    timestamp: '1d',
    content: 'One image is sometimes enough.',
    media: [{ id: 'single', src: img('single', 1200, 800), alt: 'A single wide photo' }],
    stats: { likes: 2100, comments: 58, shares: 96 },
  },
  {
    id: 'p5',
    author: {
      name: 'Nadia Rahman',
      handle: 'nadiar',
      avatarSrc: img('nadia-avatar', 200, 200),
    },
    timestamp: '1d',
    content: 'Text-only thought for the evening: ship the boring version first. You can always add sparkle.',
    stats: { likes: 410, comments: 19, shares: 4 },
  },
];

/** A standalone set of photos for the PhotoGrid showcase. */
export const galleryPhotos: MediaItem[] = gallery('showcase', 12);
