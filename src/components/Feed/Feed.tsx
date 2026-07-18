import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import {
  cn,
  Button,
  Card,
  CardHeader,
  CardBody,
  Col,
  EmptyState,
  Skeleton,
  type MenuItem,
} from '@your-org/design-system';
import type { PostData } from '../../types';
import { PostCard } from '../PostCard';
import styles from './Feed.module.css';

export interface FeedProps extends HTMLAttributes<HTMLDivElement> {
  posts: PostData[];
  /** Show placeholder skeleton cards instead of posts. */
  loading?: boolean;
  skeletonCount?: number;
  /** Render a "Load more" button below the list. */
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  onLike?: (post: PostData) => void;
  onComment?: (post: PostData) => void;
  onShare?: (post: PostData) => void;
  onPhotoClick?: (post: PostData, index: number) => void;
  /** Per-post override for the "…" menu items. */
  menuItemsFor?: (post: PostData) => MenuItem[];
  /** Custom node rendered when there are no posts. */
  emptyState?: ReactNode;
}

function PostCardSkeleton() {
  return (
    <Card>
      <CardHeader className={styles.skeletonHeader}>
        <Skeleton variant="circle" width={32} height={32} />
        <div className={styles.skeletonLines}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="24%" />
        </div>
      </CardHeader>
      <CardBody>
        <Skeleton variant="text" lines={3} />
      </CardBody>
    </Card>
  );
}

export const Feed = forwardRef<HTMLDivElement, FeedProps>(function Feed(
  {
    posts,
    loading = false,
    skeletonCount = 3,
    hasMore = false,
    loadingMore = false,
    onLoadMore,
    onLike,
    onComment,
    onShare,
    onPhotoClick,
    menuItemsFor,
    emptyState,
    className,
    ...rest
  },
  ref,
) {
  if (loading) {
    return (
      <Col ref={ref} gap={4} className={cn(styles.feed, className)} {...rest}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </Col>
    );
  }

  if (posts.length === 0) {
    return (
      <div ref={ref} className={cn(styles.feed, className)} {...rest}>
        {emptyState ?? (
          <EmptyState
            title="Nothing here yet"
            description="Posts from people you follow will show up here."
          />
        )}
      </div>
    );
  }

  return (
    <Col ref={ref} gap={4} className={cn(styles.feed, className)} {...rest}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onPhotoClick={onPhotoClick}
          menuItems={menuItemsFor?.(post)}
        />
      ))}

      {hasMore ? (
        <div className={styles.loadMore}>
          <Button variant="secondary" onClick={onLoadMore} loading={loadingMore}>
            Load more
          </Button>
        </div>
      ) : null}
    </Col>
  );
});
