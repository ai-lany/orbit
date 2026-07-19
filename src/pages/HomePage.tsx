import { PostComposer } from '../components/PostComposer';
import { Feed } from '../components/Feed';
import { useAppState } from '../app/AppState';
import styles from './Page.module.css';

export function HomePage() {
  const { user, posts, toggleLike, addPost } = useAppState();

  return (
    <div className={styles.page}>
      <PostComposer author={{ name: user.name, avatarSrc: user.avatarSrc }} onSubmit={addPost} />
      <Feed posts={posts} onLike={toggleLike} />
    </div>
  );
}
