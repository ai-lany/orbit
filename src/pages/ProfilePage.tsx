import { useMemo, useState } from 'react';
import { EmptyState } from '@your-org/design-system';
import { ProfileHeader } from '../components/ProfileHeader';
import { Feed } from '../components/Feed';
import { useAppState } from '../app/AppState';
import styles from './Page.module.css';

export function ProfilePage() {
  const { user, stats, posts, toggleLike } = useAppState();
  const [tab, setTab] = useState('posts');

  const authored = useMemo(
    () => posts.filter((p) => p.author.handle === user.handle),
    [posts, user.handle],
  );

  const visible = useMemo(() => {
    if (tab === 'media') return authored.filter((p) => p.media && p.media.length > 0);
    if (tab === 'likes') return posts.filter((p) => p.liked);
    return authored;
  }, [authored, posts, tab]);

  const empty = {
    posts: { title: 'No posts yet', description: 'Your posts will show up here.' },
    media: { title: 'No media yet', description: 'Posts with photos will show up here.' },
    likes: { title: 'No likes yet', description: "Posts you like will show up here." },
  }[tab] ?? { title: 'Nothing here yet', description: undefined };

  return (
    <div className={styles.page}>
      <ProfileHeader
        user={user}
        stats={stats}
        activeTab={tab}
        onTabChange={setTab}
        isOwnProfile
      />
      <Feed
        posts={visible}
        onLike={toggleLike}
        emptyState={<EmptyState title={empty.title} description={empty.description} />}
      />
    </div>
  );
}
