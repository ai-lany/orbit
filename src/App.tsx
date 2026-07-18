import { useMemo, useState } from 'react';
import {
  ButtonGroup,
  Container,
  Divider,
  Switch,
  Typography,
  type SpaceToken,
} from '@your-org/design-system';
import { ProfileHeader } from './components/ProfileHeader';
import { Feed } from './components/Feed';
import { PhotoGrid } from './components/PhotoGrid';
import type { PostData, ProfileUser } from './types';
import { currentUser, currentUserStats, posts as seedPosts, galleryPhotos } from './mock/data';
import styles from './App.module.css';

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<ProfileUser>(currentUser);
  const [posts, setPosts] = useState<PostData[]>(seedPosts);
  const [activeTab, setActiveTab] = useState('posts');

  // PhotoGrid showcase controls.
  const [cols, setCols] = useState(3);
  const [rowsChoice, setRowsChoice] = useState('all');
  const [gap, setGap] = useState<SpaceToken>(2);

  // Feed states showcase.
  const [feedLoading, setFeedLoading] = useState(false);

  const rows = rowsChoice === 'all' ? undefined : Number(rowsChoice);

  const visiblePosts = useMemo(() => {
    if (activeTab === 'media') return posts.filter((p) => p.media && p.media.length > 0);
    if (activeTab === 'likes') return posts.filter((p) => p.liked);
    return posts;
  }, [posts, activeTab]);

  const toggleLike = (post: PostData) => {
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
  };

  const toggleFollow = () => {
    setUser((u) => ({ ...u, isFollowing: !u.isFollowing }));
  };

  return (
    <div className={styles.page} data-theme={theme === 'dark' ? 'dark' : undefined}>
      <header className={styles.bar}>
        <div className={styles.barInner}>
          <Typography as="span" variant="h6" className={styles.brand}>
            Orbit
          </Typography>
          <Switch
            checked={theme === 'dark'}
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
            label="Dark"
            labelPosition="start"
          />
        </div>
      </header>

      <Container maxWidth="md" className={styles.content}>
        <Typography as="p" variant="body2" color="muted" className={styles.intro}>
          A small set of social components built on the design system — Profile Header, Feed +
          Post Card, and an adjustable Photo Grid.
        </Typography>

        {/* Profile header + tab-driven feed */}
        <section className={styles.section} id="profile">
          <ProfileHeader
            user={user}
            stats={currentUserStats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onFollow={toggleFollow}
          />
          <div className={styles.feedWrap}>
            <Feed posts={visiblePosts} onLike={toggleLike} />
          </div>
        </section>

        <Divider />

        {/* Photo grid showcase with live controls */}
        <section className={styles.section} id="photo-grid">
          <div className={styles.sectionHead}>
            <Typography as="h3" variant="h5" gutterBottom>
              Photo Grid
            </Typography>
            <Typography as="p" variant="body2" color="muted">
              Adjustable columns and rows. Rows caps how many are shown.
            </Typography>
          </div>

          <div className={styles.controls}>
            <label className={styles.controlRow}>
              <span className={styles.controlLabel}>Columns</span>
              <ButtonGroup
                value={String(cols)}
                onChange={(v) => setCols(Number(v))}
                items={[
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                  { value: '4', label: '4' },
                  { value: '5', label: '5' },
                ]}
              />
            </label>

            <label className={styles.controlRow}>
              <span className={styles.controlLabel}>Rows</span>
              <ButtonGroup
                value={rowsChoice}
                onChange={setRowsChoice}
                items={[
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                  { value: 'all', label: 'All' },
                ]}
              />
            </label>

            <label className={styles.controlRow}>
              <span className={styles.controlLabel}>Gap</span>
              <ButtonGroup
                value={String(gap)}
                onChange={(v) => setGap(Number(v) as SpaceToken)}
                items={[
                  { value: '1', label: 'S' },
                  { value: '2', label: 'M' },
                  { value: '4', label: 'L' },
                ]}
              />
            </label>
          </div>

          <PhotoGrid photos={galleryPhotos} cols={cols} rows={rows} gap={gap} />
        </section>

        <Divider />

        {/* Loading / empty states */}
        <section className={styles.section} id="states">
          <div className={styles.sectionHead}>
            <Typography as="h3" variant="h5" gutterBottom>
              States
            </Typography>
            <Typography as="p" variant="body2" color="muted">
              Feed skeletons while loading; empty states when there's nothing to show.
            </Typography>
          </div>

          <div className={styles.controls}>
            <Switch
              checked={feedLoading}
              onChange={(e) => setFeedLoading(e.target.checked)}
              label="Simulate loading"
            />
          </div>

          <Feed posts={[]} loading={feedLoading} skeletonCount={2} />

          <div className={styles.emptyGridWrap}>
            <PhotoGrid photos={[]} />
          </div>
        </section>
      </Container>
    </div>
  );
}
